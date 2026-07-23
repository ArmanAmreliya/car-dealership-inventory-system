/**
 * Inventory Filter & Sort Utilities
 *
 * Pure functions extracted from InventoryPage so they can be unit-tested
 * independently of React state.  No imports from React or any UI library.
 */

import {
  InventoryItemDTO,
  InventoryFilterState,
  SortOption,
} from '../features/inventory/types/inventory.types';
import { VehicleDTO } from '../api/api';

// ── Normalise ─────────────────────────────────────────────────────────────

/** Lower-case, trimmed string — used for case-insensitive comparisons. */
export function norm(value: string | number | null | undefined): string {
  return String(value ?? '').toLowerCase().trim();
}

// ── Filter ────────────────────────────────────────────────────────────────

/**
 * Apply all active filters to an inventory item list.
 *
 * Filters applied (all are AND-ed):
 *  1. Free-text search  — make, model, vin, year, vehicleId
 *  2. Availability status — available | unavailable | reserved | low-stock
 *  3. Stock level        — in-stock | out-of-stock | low-stock
 *  4. Manufacturer       — exact make match (case-insensitive)
 *
 * @example
 * const results = filterInventoryItems(items, { search: 'bmw', ... });
 */
export function filterInventoryItems(
  items: InventoryItemDTO[],
  filters: InventoryFilterState
): InventoryItemDTO[] {
  return items.filter((item) => {
    const v = item.vehicle;
    const make  = v?.make  ?? '';
    const model = v?.model ?? '';
    const vin   = v?.vin   ?? '';
    const year  = v?.year  ?? '';
    const q = norm(filters.search);

    // ── 1. Text search ───────────────────────────────────────────────────
    if (q) {
      const haystack = [make, model, vin, String(year), item.vehicleId]
        .map(norm)
        .join(' ');
      if (!haystack.includes(q)) return false;
    }

    // ── 2. Availability status ───────────────────────────────────────────
    if (filters.status !== 'all') {
      if (filters.status === 'available'   && !item.available)       return false;
      if (filters.status === 'unavailable' &&  item.available)       return false;
      if (filters.status === 'reserved'    && !item.reserved)        return false;
      if (filters.status === 'low-stock'   && item.quantity > 3)     return false;
    }

    // ── 3. Stock level ───────────────────────────────────────────────────
    if (filters.stockLevel !== 'all') {
      if (filters.stockLevel === 'in-stock'     && item.quantity <= 0)               return false;
      if (filters.stockLevel === 'out-of-stock' && item.quantity > 0)                return false;
      if (filters.stockLevel === 'low-stock'    &&
          (item.quantity <= 0 || item.quantity > 3))                                 return false;
    }

    // ── 4. Manufacturer ──────────────────────────────────────────────────
    if (
      filters.manufacturer !== 'all' &&
      norm(make) !== norm(filters.manufacturer)
    ) return false;

    return true;
  });
}

// ── Sort ──────────────────────────────────────────────────────────────────

/**
 * Sort an inventory item list by the given sort option.
 * Returns a new array — does not mutate the input.
 *
 * @example
 * const sorted = sortInventoryItems(items, 'price-asc');
 */
export function sortInventoryItems(
  items: InventoryItemDTO[],
  sortBy: SortOption
): InventoryItemDTO[] {
  return [...items].sort((a, b) => {
    const av = a.vehicle;
    const bv = b.vehicle;

    switch (sortBy) {
      case 'price-asc':
        return (av?.price ?? 0) - (bv?.price ?? 0);

      case 'price-desc':
        return (bv?.price ?? 0) - (av?.price ?? 0);

      case 'name-asc':
        return `${av?.make} ${av?.model}`.localeCompare(`${bv?.make} ${bv?.model}`);

      case 'name-desc':
        return `${bv?.make} ${bv?.model}`.localeCompare(`${av?.make} ${av?.model}`);

      case 'quantity-asc':
        return a.quantity - b.quantity;

      case 'quantity-desc':
        return b.quantity - a.quantity;

      case 'updated-desc':
      default:
        return (
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
    }
  });
}

/**
 * Apply filters then sort — convenience wrapper used by InventoryPage.
 */
export function applyInventoryFilters(
  items: InventoryItemDTO[],
  filters: InventoryFilterState
): InventoryItemDTO[] {
  return sortInventoryItems(filterInventoryItems(items, filters), filters.sortBy);
}

// ── Merge ─────────────────────────────────────────────────────────────────

/**
 * Merge a vehicles list (source of truth for imageUrl / make / model) with
 * an inventory list (source of truth for quantity / availability).
 *
 * Priority for quantity:
 *   1. inventoryItems cache entry
 *   2. vehicle.stockQuantity (patched by optimistic update)
 *   3. Default 1
 *
 * Returns an empty array when the vehicles list is empty.
 */
export function mergeVehiclesWithInventory(
  vehicles: VehicleDTO[],
  inventoryItems: InventoryItemDTO[]
): InventoryItemDTO[] {
  if (vehicles.length === 0) return [];

  const stockByVehicleId = new Map(
    inventoryItems.map((item) => [item.vehicleId, item])
  );

  return vehicles.map((vehicle) => {
    const stockItem = stockByVehicleId.get(vehicle.id);

    const quantity =
      typeof stockItem?.quantity === 'number'
        ? stockItem.quantity
        : typeof (vehicle as any).stockQuantity === 'number'
        ? (vehicle as any).stockQuantity
        : 1;

    const available =
      typeof stockItem?.available === 'boolean'
        ? stockItem.available
        : quantity > 0;

    return {
      id:         stockItem?.id ?? vehicle.id,
      vehicleId:  vehicle.id,
      vehicle,
      quantity,
      available,
      reserved:   stockItem?.reserved ?? false,
      createdAt:  stockItem?.createdAt ?? vehicle.createdAt,
      updatedAt:  stockItem?.updatedAt ?? vehicle.updatedAt,
    } satisfies InventoryItemDTO;
  });
}
