/**
 * Inventory Service
 *
 * Wraps the inventory endpoints exposed by the backend:
 *   GET   /api/v1/inventory              – list all items with aggregate totals
 *   PATCH /api/v1/inventory/:id          – set stock quantity for one item
 *   POST  /api/v1/inventory/:id/restock  – add quantity to current stock (admin only)
 *
 * Uses the shared Axios client so JWT injection and 401 handling
 * are applied automatically via the global request/response interceptors.
 */

import { apiClient } from '../../../api/axios-client';
import { VehicleDTO } from '../../../api/api';
import {
  InventoryItemDTO,
  InventoryResponse,
  UpdateStockInput,
  RestockInput,
} from '../types/inventory.types';

// ── Helpers ────────────────────────────────────────────────────────────────

/**
 * Pick the first non-empty string from a list of candidates.
 * Returning undefined (not empty string) lets resolveVehicleImage fall
 * through to the make-based Unsplash fallback correctly.
 */
function firstNonEmpty(...candidates: (string | null | undefined)[]): string | undefined {
  for (const c of candidates) {
    if (typeof c === 'string' && c.trim().length > 0) return c.trim();
  }
  return undefined;
}

/**
 * normalizeInventoryItem
 *
 * Handles two backend response shapes:
 *
 *   A) Flat  – the /v1/inventory endpoint returns fields at the root:
 *              { id, vehicleId, make, model, year, vin, price, imageUrl,
 *                stockQuantity, isAvailable, createdAt, updatedAt }
 *
 *   B) Nested – future-proof / PATCH response may include a nested vehicle
 *               object: { id, vehicleId, vehicle: { imageUrl, ... }, ... }
 *
 * The resulting InventoryItemDTO always carries a fully populated `vehicle`
 * sub-object so that InventoryCardView / InventoryTable can read imageUrl,
 * make, model, price, etc. without extra lookups.
 */
export function normalizeInventoryItem(rawItem: any): InventoryItemDTO {
  // ── IDs ──────────────────────────────────────────────────────────────────
  const id = rawItem.id || rawItem.vehicleId || '';
  const vehicleId = rawItem.vehicleId || rawItem.id || id;

  // ── Vehicle scalar fields (nested object takes priority over flat fields) ─
  const make    = firstNonEmpty(rawItem.vehicle?.make,  rawItem.make)  ?? '';
  const model   = firstNonEmpty(rawItem.vehicle?.model, rawItem.model) ?? '';
  const vin     = firstNonEmpty(rawItem.vehicle?.vin,   rawItem.vin)   ?? '';
  const color   = firstNonEmpty(rawItem.vehicle?.color, rawItem.color);
  const year    = rawItem.vehicle?.year    ?? rawItem.year    ?? 0;
  const price   = rawItem.vehicle?.price   ?? rawItem.price   ?? 0;
  const mileage = rawItem.vehicle?.mileage ?? rawItem.mileage;

  // ── imageUrl ─────────────────────────────────────────────────────────────
  // Priority: nested vehicle.imageUrl → flat imageUrl → undefined
  // Do NOT fall back to '' — undefined lets resolveVehicleImage use the
  // make-based Unsplash image instead of a broken empty <img> src.
  const imageUrl = firstNonEmpty(rawItem.vehicle?.imageUrl, rawItem.imageUrl);

  // ── Timestamps ───────────────────────────────────────────────────────────
  const createdAt =
    firstNonEmpty(rawItem.vehicle?.createdAt, rawItem.createdAt) ??
    new Date().toISOString();
  const updatedAt =
    firstNonEmpty(rawItem.vehicle?.updatedAt, rawItem.updatedAt) ??
    new Date().toISOString();

  // ── Reconstruct vehicle sub-object ───────────────────────────────────────
  const vehicle: VehicleDTO = {
    ...(rawItem.vehicle ?? {}),
    id: vehicleId,
    vin,
    make,
    model,
    year,
    price,
    ...(mileage  !== undefined && { mileage }),
    ...(color    !== undefined && { color }),
    ...(imageUrl !== undefined && { imageUrl }),
    createdAt,
    updatedAt,
  };

  // ── Stock / availability ─────────────────────────────────────────────────
  // Flat response uses `stockQuantity`; PATCH response may use `quantity`.
  const quantity =
    typeof rawItem.stockQuantity === 'number'
      ? rawItem.stockQuantity
      : typeof rawItem.quantity === 'number'
      ? rawItem.quantity
      : rawItem.isAvailable === false
      ? 0
      : 1;

  const available =
    typeof rawItem.available === 'boolean'
      ? rawItem.available
      : typeof rawItem.isAvailable === 'boolean'
      ? rawItem.isAvailable
      : quantity > 0;

  return {
    id: id || vehicleId,
    vehicleId,
    vehicle,
    quantity,
    available,
    reserved: rawItem.reserved ?? false,
    createdAt,
    updatedAt,
  };
}

// ── Service ────────────────────────────────────────────────────────────────

export const inventoryService = {
  /**
   * Fetch the full inventory list with aggregate totals.
   * GET /v1/inventory
   */
  getInventory: async (): Promise<InventoryResponse> => {
    const response = await apiClient.get<any>('/v1/inventory');
    const data = response.data;
    const rawItems = Array.isArray(data?.items)
      ? data.items
      : Array.isArray(data)
      ? data
      : [];
    const items = rawItems.map(normalizeInventoryItem);
    return {
      ...data,
      items,
      totalVehicles: data?.totalVehicles ?? items.length,
      availableVehicles:
        data?.availableVehicles ??
        items.filter((i: InventoryItemDTO) => i.available).length,
    };
  },

  /**
   * Set the stock quantity for a single inventory item (absolute value).
   * PATCH /v1/inventory/:id
   */
  updateStock: async (id: string, data: UpdateStockInput): Promise<InventoryItemDTO> => {
    const qty = data.stockQuantity;
    const payload = {
      quantity: qty,
      isAvailable: qty > 0,
      available: qty > 0,
      ...data,
    };
    const response = await apiClient.patch<any>(`/v1/inventory/${id}`, payload);
    const resData = response.data || {};
    return normalizeInventoryItem({
      ...resData,
      id: resData.id || id,
      quantity: typeof resData.quantity === 'number' ? resData.quantity : qty,
      stockQuantity: typeof resData.stockQuantity === 'number' ? resData.stockQuantity : qty,
      available: qty > 0,
    });
  },

  /**
   * Add quantity to a vehicle's current stock (admin only).
   * POST /v1/inventory/:id/restock
   */
  restock: async (id: string, data: RestockInput): Promise<InventoryItemDTO> => {
    const response = await apiClient.post<any>(`/v1/inventory/${id}/restock`, data);
    return normalizeInventoryItem(response.data);
  },
};
