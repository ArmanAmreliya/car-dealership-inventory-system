/**
 * Purchase Utility Functions
 *
 * Pure, side-effect-free helpers used by purchase components and hooks.
 * No React imports — safe to use in hooks, components, and tests.
 */

import { VehicleDTO } from '../../../api/api';
import { InventoryItemDTO } from '../../inventory/types/inventory.types';
import { PurchaseDTO, PurchaseError, PurchaseReceipt } from '../types/purchase.types';

// ── Availability checks ────────────────────────────────────────────────────

/**
 * Find the inventory item for a given vehicleId.
 * Returns undefined when the vehicle has no inventory record.
 */
export function findInventoryItem(
  vehicleId: string,
  items: InventoryItemDTO[]
): InventoryItemDTO | undefined {
  return items.find((item) => item.vehicleId === vehicleId);
}

/**
 * Return true when the vehicle is purchasable according to cached inventory.
 *
 * Rules (mirrors backend logic):
 *   - There must be an inventory record for the vehicle.
 *   - available === true AND quantity > 0.
 *
 * This is a client-side pre-flight check. The backend always performs its
 * own authoritative validation and may return 409 even when this returns true
 * (race condition between two concurrent buyers).
 */
export function isVehicleAvailable(
  vehicleId: string,
  items: InventoryItemDTO[]
): boolean {
  const item = findInventoryItem(vehicleId, items);
  if (!item) return false;
  return item.available && item.quantity > 0;
}

/**
 * Derive a human-readable unavailability reason for a specific vehicle.
 * Returns null when the vehicle is available.
 *
 * @example
 * ```ts
 * getUnavailabilityReason('uuid', items)
 * // → 'This vehicle is out of stock.'
 * // → 'This vehicle is no longer available.'
 * // → 'No inventory record found for this vehicle.'
 * // → null  (vehicle is available)
 * ```
 */
export function getUnavailabilityReason(
  vehicleId: string,
  items: InventoryItemDTO[]
): string | null {
  const item = findInventoryItem(vehicleId, items);

  if (!item) return 'No inventory record found for this vehicle.';
  if (item.quantity === 0) return 'This vehicle is out of stock.';
  if (!item.available) return 'This vehicle is no longer available.';

  return null; // available
}

// ── Receipt building ───────────────────────────────────────────────────────

/**
 * Build a PurchaseReceipt display object from a completed PurchaseDTO.
 * Enriches the receipt with the vehicle label and price when the vehicle
 * data is available (either from the DTO relation or a separate lookup map).
 *
 * @param dto        - The purchase DTO returned by the API
 * @param vehicleMap - Optional map of vehicleId → VehicleDTO for enrichment
 *
 * @example
 * ```ts
 * const receipt = buildPurchaseReceipt(dto, { [vehicle.id]: vehicle });
 * ```
 */
export function buildPurchaseReceipt(
  dto: PurchaseDTO,
  vehicleMap?: Record<string, VehicleDTO>
): PurchaseReceipt {
  const vehicle = dto.vehicle ?? vehicleMap?.[dto.vehicleId];

  const vehicleLabel = vehicle
    ? `${vehicle.year} ${vehicle.make} ${vehicle.model}`
    : `Vehicle ${dto.vehicleId.slice(0, 8)}`;

  return {
    purchaseId: dto.id,
    vehicleId: dto.vehicleId,
    vehicleLabel,
    quantity: dto.quantity,
    purchasedAt: dto.purchasedAt,
    price: vehicle?.price,
  };
}

// ── Error formatting ───────────────────────────────────────────────────────

/**
 * Convert a raw unknown error into a user-facing message string.
 * Prefers the structured PurchaseError message when available,
 * then falls back to the raw message, then a generic fallback.
 *
 * @example
 * ```ts
 * const msg = formatPurchaseErrorMessage(error);
 * toast.error(msg);
 * ```
 */
export function formatPurchaseErrorMessage(err: unknown): string {
  if (err == null) return 'An unexpected error occurred.';

  // Structured PurchaseError
  const pe = err as Partial<PurchaseError>;
  if (pe.isConflict) {
    return 'This vehicle is no longer available. The inventory has been refreshed.';
  }
  if (typeof pe.message === 'string' && pe.message.length > 0) {
    return pe.message;
  }

  // AxiosError-like
  const ae = err as { response?: { data?: { message?: unknown } }; message?: string };
  if (
    ae.response?.data?.message != null &&
    typeof ae.response.data.message === 'string'
  ) {
    return ae.response.data.message;
  }
  if (typeof ae.message === 'string' && ae.message.length > 0) {
    return ae.message;
  }

  return 'Purchase failed. Please try again.';
}

// ── Display helpers ────────────────────────────────────────────────────────

/**
 * Format a VehicleDTO into a consistent option label for select menus.
 *
 * Format: "Year Make Model — $Price"
 *
 * @example
 * ```ts
 * formatVehicleOption(vehicle)
 * // → "2022 Toyota Camry — $29,999"
 * ```
 */
export function formatVehicleOption(vehicle: VehicleDTO): string {
  const price = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(vehicle.price);
  return `${vehicle.year} ${vehicle.make} ${vehicle.model} — ${price}`;
}

/**
 * Format a VehicleDTO into a short label without price.
 *
 * @example
 * ```ts
 * formatVehicleLabel(vehicle)
 * // → "2022 Toyota Camry"
 * ```
 */
export function formatVehicleLabel(vehicle: VehicleDTO): string {
  return `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
}

/**
 * Format an ISO date string as a localised purchase date-time string.
 *
 * @example
 * ```ts
 * formatPurchaseDate('2024-03-15T14:32:00.000Z')
 * // → "March 15, 2024 at 2:32 PM"
 * ```
 */
export function formatPurchaseDate(isoString: string): string {
  return new Date(isoString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}
