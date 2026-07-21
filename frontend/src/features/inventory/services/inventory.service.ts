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
import {
  InventoryItemDTO,
  InventoryResponse,
  UpdateStockInput,
} from '../types/inventory.types';

/**
 * Inventory API service
 *
 * @example
 * ```ts
 * // Fetch all inventory items
 * const data = await inventoryService.getInventory();
 *
 * // Update stock for a specific item
 * const updated = await inventoryService.updateStock('item-uuid', { stockQuantity: 5 });
 * ```
 */
export const inventoryService = {
  /**
   * Fetch the full inventory list with aggregate totals.
   *
   * Calls GET /api/v1/inventory.
   * Returns the raw backend response shape:
   *   { items, totalVehicles, availableVehicles }
   *
   * @returns InventoryResponse
   */
  getInventory: async (): Promise<InventoryResponse> => {
    const response = await apiClient.get<InventoryResponse>('/v1/inventory');
    return response.data;
  },

  /**
   * Update the stock quantity for a single inventory item.
   *
   * Calls PATCH /api/v1/inventory/:id with { stockQuantity }.
   * The backend recalculates the `available` flag based on the new quantity.
   *
   * @param id   - Inventory item UUID
   * @param data - { stockQuantity: number } — must be a non-negative integer
   * @returns Updated InventoryItemDTO
   */
  updateStock: async (
    id: string,
    data: UpdateStockInput
  ): Promise<InventoryItemDTO> => {
    const response = await apiClient.patch<InventoryItemDTO>(
      `/v1/inventory/${id}`,
      data
    );
    return response.data;
  },
};
