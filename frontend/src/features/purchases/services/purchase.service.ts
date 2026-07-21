/**
 * Purchase Service
 *
 * Wraps the single purchase endpoint exposed by the backend:
 *   POST /api/v1/purchases  –  execute a vehicle purchase
 *
 * The backend has no list, detail, or history endpoint for purchases.
 * This service therefore exposes only the creation method.
 *
 * Uses the shared Axios client so JWT injection and 401 handling
 * are applied automatically via the global interceptors.
 */

import { apiClient } from '../../../api/axios-client';
import { PurchaseDTO, CreatePurchaseInput } from '../types/purchase.types';

/**
 * Purchase API service
 *
 * @example
 * ```ts
 * const receipt = await purchaseService.createPurchase({ vehicleId: 'uuid' });
 * ```
 */
export const purchaseService = {
  /**
   * Execute a vehicle purchase transaction.
   *
   * Calls POST /api/v1/purchases with `{ vehicleId }`.
   * The backend:
   *   - Validates the vehicle exists and is available.
   *   - Decrements inventory stock.
   *   - Creates a Purchase record linked to the authenticated user.
   *   - Returns the created purchase record.
   *
   * Possible error responses:
   *   400 – Invalid payload (vehicleId missing or malformed)
   *   401 – Not authenticated
   *   404 – Vehicle not found
   *   409 – Vehicle no longer available / out of stock
   *
   * @param data - { vehicleId: string }
   * @returns Created PurchaseDTO
   */
  createPurchase: async (data: CreatePurchaseInput): Promise<PurchaseDTO> => {
    const response = await apiClient.post<PurchaseDTO>('/v1/purchases', data);
    return response.data;
  },
};
