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

export function normalizeInventoryItem(rawItem: any): InventoryItemDTO {
  const id = rawItem.id || rawItem.vehicleId || '';
  const vehicleId = rawItem.vehicleId || rawItem.id || id;
  const make = rawItem.vehicle?.make || rawItem.make || '';
  const model = rawItem.vehicle?.model || rawItem.model || '';
  const year = rawItem.vehicle?.year || rawItem.year || 0;
  const price = rawItem.vehicle?.price || rawItem.price || 0;
  const vin = rawItem.vehicle?.vin || rawItem.vin || '';
  const imageUrl = rawItem.vehicle?.imageUrl || rawItem.imageUrl;
  const color = rawItem.vehicle?.color || rawItem.color;
  const mileage = rawItem.vehicle?.mileage || rawItem.mileage;

  const vehicle: VehicleDTO = {
    ...(rawItem.vehicle || {}),
    id: vehicleId,
    vin,
    make,
    model,
    year,
    price,
    mileage,
    color,
    imageUrl: imageUrl || rawItem.vehicle?.imageUrl || rawItem.imageUrl || '',
    createdAt: rawItem.vehicle?.createdAt || rawItem.createdAt || new Date().toISOString(),
    updatedAt: rawItem.vehicle?.updatedAt || rawItem.updatedAt || new Date().toISOString(),
  };

  const quantity =
    typeof rawItem.quantity === 'number'
      ? rawItem.quantity
      : typeof rawItem.stockQuantity === 'number'
      ? rawItem.stockQuantity
      : rawItem.isAvailable === false
      ? 0
      : 1;

  const available =
    typeof rawItem.available === 'boolean'
      ? rawItem.available
      : typeof rawItem.isAvailable === 'boolean'
      ? rawItem.isAvailable
      : quantity > 0;

  const createdAt = rawItem.createdAt || rawItem.vehicle?.createdAt || new Date().toISOString();
  const updatedAt = rawItem.updatedAt || rawItem.vehicle?.updatedAt || new Date().toISOString();

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
    const response = await apiClient.patch<any>(
      `/v1/inventory/${id}`,
      data
    );
    return normalizeInventoryItem(response.data);
  },
};
