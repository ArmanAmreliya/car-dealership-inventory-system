/**
 * Inventory Service
 *
 * Wraps the two inventory endpoints exposed by the backend:
 *   GET  /api/v1/inventory          – list all items with aggregate totals
 *   PATCH /api/v1/inventory/:id     – update stock quantity for one item
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
} from '../types/inventory.types';

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
  const make  = firstNonEmpty(rawItem.vehicle?.make,  rawItem.make)  ?? '';
  const model = firstNonEmpty(rawItem.vehicle?.model, rawItem.model) ?? '';
  const vin   = firstNonEmpty(rawItem.vehicle?.vin,   rawItem.vin)   ?? '';
  const color = firstNonEmpty(rawItem.vehicle?.color, rawItem.color);
  const year  = rawItem.vehicle?.year  ?? rawItem.year  ?? 0;
  const price = rawItem.vehicle?.price ?? rawItem.price ?? 0;
  const mileage = rawItem.vehicle?.mileage ?? rawItem.mileage;

  // ── imageUrl: preserve the Cloudinary URL from whichever shape is returned ─
  // Priority: nested vehicle.imageUrl → flat imageUrl at root level → undefined
  // We must NOT fall back to '' here; an undefined imageUrl lets
  // resolveVehicleImage use the make-based Unsplash image instead of
  // rendering a broken <img> with an empty src.
  const imageUrl = firstNonEmpty(
    rawItem.vehicle?.imageUrl,
    rawItem.imageUrl,
  );

  // ── Timestamps ───────────────────────────────────────────────────────────
  const createdAt =
    firstNonEmpty(rawItem.vehicle?.createdAt, rawItem.createdAt) ??
    new Date().toISOString();
  const updatedAt =
    firstNonEmpty(rawItem.vehicle?.updatedAt, rawItem.updatedAt) ??
    new Date().toISOString();

  // ── Reconstruct vehicle object ───────────────────────────────────────────
  // Spread rawItem.vehicle first so any extra fields the backend may add
  // in the future (trim, color, vehicleImages, etc.) are preserved.
  const vehicle: VehicleDTO = {
    ...(rawItem.vehicle ?? {}),
    id: vehicleId,
    vin,
    make,
    model,
    year,
    price,
    ...(mileage !== undefined && { mileage }),
    ...(color    !== undefined && { color }),
    ...(imageUrl !== undefined && { imageUrl }),
    createdAt,
    updatedAt,
  };

  // ── Stock / availability ─────────────────────────────────────────────────
  // Backend flat response uses `stockQuantity`; nested PATCH responses may
  // use `quantity`. Accept both, in that priority order.
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

/**
 * Inventory API service
 */
export const inventoryService = {
  /**
   * Fetch the full inventory list with aggregate totals.
   */
  getInventory: async (): Promise<InventoryResponse> => {
    const response = await apiClient.get<any>('/v1/inventory');
    const data = response.data;
    const rawItems = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];
    const items = rawItems.map(normalizeInventoryItem);
    return {
      ...data,
      items,
      totalVehicles: data?.totalVehicles ?? items.length,
      availableVehicles: data?.availableVehicles ?? items.filter((i: InventoryItemDTO) => i.available).length,
    };
  },

  /**
   * Update the stock quantity for a single inventory item.
   */
  updateStock: async (
    id: string,
    data: UpdateStockInput
  ): Promise<InventoryItemDTO> => {
    const qty = data.stockQuantity;
    const payload = {
      quantity: qty,
      isAvailable: qty > 0,
      available: qty > 0,
      ...data,
    };
    const response = await apiClient.patch<any>(
      `/v1/inventory/${id}`,
      payload
    );
    // If backend returns a response without the full object, fall back to updated item structure
    const resData = response.data || {};
    return normalizeInventoryItem({
      ...resData,
      id: resData.id || id,
      quantity: typeof resData.quantity === 'number' ? resData.quantity : qty,
      stockQuantity: typeof resData.stockQuantity === 'number' ? resData.stockQuantity : qty,
      available: qty > 0,
    });
  },
};
