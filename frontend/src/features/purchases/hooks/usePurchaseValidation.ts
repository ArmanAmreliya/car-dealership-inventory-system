/**
 * usePurchaseValidation Hook
 *
 * Derives real-time availability state for a given vehicleId by reading
 * from the cached inventory query. No extra network request is made.
 *
 * Responsibilities:
 *   - Look up the inventory item for the selected vehicle.
 *   - Return a typed availability result the form can act on immediately.
 *   - Surface the human-readable reason when unavailable so the form
 *     can render an inline warning before the user even submits.
 *   - Keep the form submit button enabled/disabled state in sync.
 *
 * This hook is intentionally decoupled from the mutation so it can be
 * used independently — e.g. on VehicleDetailPage to gate the purchase
 * button without rendering the full PurchaseForm.
 */

import { useMemo } from 'react';
import { useInventory } from '../../inventory/hooks/useInventory';
import {
  isVehicleAvailable,
  getUnavailabilityReason,
  findInventoryItem,
} from '../utils/purchase.utils';
import { InventoryItemDTO } from '../../inventory/types/inventory.types';

// ── Types ──────────────────────────────────────────────────────────────────

export interface VehicleAvailabilityResult {
  /**
   * True when the selected vehicle can be purchased right now
   * according to the cached inventory data.
   */
  isAvailable: boolean;

  /**
   * Human-readable reason why the vehicle cannot be purchased.
   * null when isAvailable === true.
   */
  unavailabilityReason: string | null;

  /**
   * True when the inventory query is still loading.
   * Callers should disable the submit button while this is true.
   */
  isCheckingAvailability: boolean;

  /**
   * The raw inventory item for the selected vehicle, if found.
   * Useful for displaying current stock quantity in the form.
   */
  inventoryItem: InventoryItemDTO | undefined;

  /**
   * Current stock quantity (0 when no inventory record exists).
   */
  stockQuantity: number;
}

// ── Hook ──────────────────────────────────────────────────────────────────

/**
 * usePurchaseValidation
 *
 * Validates a vehicleId against the cached inventory state.
 * Reads from useInventory — results update automatically whenever
 * the inventory cache is refreshed (e.g. after a stock update).
 *
 * Pass an empty string or undefined for `vehicleId` when no vehicle is
 * selected; the hook returns `isAvailable: false` with a prompt message.
 *
 * @param vehicleId - The UUID of the vehicle to validate, or ''
 *
 * @example
 * ```tsx
 * const { isAvailable, unavailabilityReason, isCheckingAvailability } =
 *   usePurchaseValidation(watchedVehicleId);
 *
 * // Disable submit while loading or unavailable
 * <button disabled={!isAvailable || isCheckingAvailability}>
 *   Confirm Purchase
 * </button>
 *
 * // Show inline warning
 * {unavailabilityReason && (
 *   <p className="text-amber-700">{unavailabilityReason}</p>
 * )}
 * ```
 */
export function usePurchaseValidation(
  vehicleId: string | undefined
): VehicleAvailabilityResult {
  const { data, isLoading } = useInventory();

  return useMemo<VehicleAvailabilityResult>(() => {
    // No vehicle selected yet
    if (!vehicleId || vehicleId.trim() === '') {
      return {
        isAvailable: false,
        unavailabilityReason: 'Please select a vehicle to purchase.',
        isCheckingAvailability: isLoading,
        inventoryItem: undefined,
        stockQuantity: 0,
      };
    }

    // Inventory still loading — treat as unknown / pending
    if (isLoading || !data) {
      return {
        isAvailable: false,
        unavailabilityReason: null,
        isCheckingAvailability: true,
        inventoryItem: undefined,
        stockQuantity: 0,
      };
    }

    const items = data.items;
    const inventoryItem = findInventoryItem(vehicleId, items);
    const available = isVehicleAvailable(vehicleId, items);
    const reason = available ? null : getUnavailabilityReason(vehicleId, items);

    return {
      isAvailable: available,
      unavailabilityReason: reason,
      isCheckingAvailability: false,
      inventoryItem,
      stockQuantity: inventoryItem?.quantity ?? 0,
    };
  }, [vehicleId, data, isLoading]);
}
