/**
 * Search Utility Functions
 *
 * Pure, side-effect-free helpers for client-side full-text matching.
 * Used by GlobalSearch and the client-side inventory/purchase filter bars.
 * No React imports — safe to call from hooks, components, and tests.
 */

import { VehicleDTO } from '../api/api';
import { InventoryItemDTO } from '../features/inventory/types/inventory.types';
import { PurchaseDTO } from '../features/purchases/types/purchase.types';

// ── Core matching primitives ───────────────────────────────────────────────

/**
 * Normalise a string for case-insensitive, trimmed substring matching.
 *
 * @example
 * ```ts
 * norm('  Toyota  ') // → 'toyota'
 * ```
 */
export function norm(s: string | null | undefined): string {
  return (s ?? '').toLowerCase().trim();
}

/**
 * Return true when `haystack` contains every word in `needle`.
 * Word-splitting lets "camry toyota" match "Toyota Camry".
 *
 * @example
 * ```ts
 * matchesQuery('toyota camry 2022', 'camry 22') // → false ('22' ≠ '2022')
 * matchesQuery('toyota camry 2022', 'camry')    // → true
 * ```
 */
export function matchesQuery(haystack: string, needle: string): boolean {
  const h = norm(haystack);
  const words = norm(needle).split(/\s+/).filter(Boolean);
  if (words.length === 0) return true;
  return words.every((w) => h.includes(w));
}

// ── Domain-specific matchers ───────────────────────────────────────────────

/**
 * Build a searchable haystack string from a VehicleDTO.
 * Includes all fields a user might type to find a vehicle.
 *
 * @example
 * ```ts
 * vehicleHaystack(v)
 * // → "2022 toyota camry 1hgbh41jxmn109186 red 29999"
 * ```
 */
export function vehicleHaystack(v: VehicleDTO): string {
  return [
    String(v.year),
    v.make,
    v.model,
    v.vin,
    v.color,
    String(v.price),
    v.id,
  ]
    .filter(Boolean)
    .join(' ');
}

/**
 * Return true when a VehicleDTO matches the free-text query.
 *
 * @example
 * ```ts
 * matchesVehicle(vehicle, 'toyota camry')  // → true / false
 * ```
 */
export function matchesVehicle(v: VehicleDTO, query: string): boolean {
  if (!query.trim()) return true;
  return matchesQuery(vehicleHaystack(v), query);
}

/**
 * Build a searchable haystack string from an InventoryItemDTO.
 * Includes vehicle fields when the nested relation is present.
 *
 * @example
 * ```ts
 * inventoryHaystack(item) // → "2022 toyota camry 1hgbh..."
 * ```
 */
export function inventoryHaystack(item: InventoryItemDTO): string {
  const parts: string[] = [item.vehicleId];
  if (item.vehicle) {
    parts.push(
      String(item.vehicle.year),
      item.vehicle.make,
      item.vehicle.model,
      item.vehicle.vin,
      item.vehicle.color ?? '',
    );
  }
  return parts.filter(Boolean).join(' ');
}

/**
 * Return true when an InventoryItemDTO matches the free-text query.
 */
export function matchesInventoryItem(
  item: InventoryItemDTO,
  query: string
): boolean {
  if (!query.trim()) return true;
  return matchesQuery(inventoryHaystack(item), query);
}

/**
 * Build a searchable haystack string from a PurchaseDTO.
 */
export function purchaseHaystack(p: PurchaseDTO): string {
  const parts: string[] = [p.id, p.vehicleId, p.userId];
  if (p.vehicle) {
    parts.push(
      String(p.vehicle.year),
      p.vehicle.make,
      p.vehicle.model,
      p.vehicle.vin,
    );
  }
  return parts.filter(Boolean).join(' ');
}

/**
 * Return true when a PurchaseDTO matches the free-text query.
 */
export function matchesPurchase(p: PurchaseDTO, query: string): boolean {
  if (!query.trim()) return true;
  return matchesQuery(purchaseHaystack(p), query);
}

// ── Filter helpers ─────────────────────────────────────────────────────────

/**
 * Filter a vehicle array by a free-text query.
 * Returns the original array reference when query is empty
 * to avoid unnecessary re-renders.
 *
 * @example
 * ```ts
 * const results = filterVehicles(vehicles, 'toyota');
 * ```
 */
export function filterVehicles(
  vehicles: VehicleDTO[],
  query: string
): VehicleDTO[] {
  if (!query.trim()) return vehicles;
  return vehicles.filter((v) => matchesVehicle(v, query));
}

/**
 * Filter an inventory item array by a free-text query.
 */
export function filterInventoryItems(
  items: InventoryItemDTO[],
  query: string
): InventoryItemDTO[] {
  if (!query.trim()) return items;
  return items.filter((item) => matchesInventoryItem(item, query));
}

/**
 * Filter a purchase array by a free-text query.
 */
export function filterPurchases(
  purchases: PurchaseDTO[],
  query: string
): PurchaseDTO[] {
  if (!query.trim()) return purchases;
  return purchases.filter((p) => matchesPurchase(p, query));
}

// ── Search result types ────────────────────────────────────────────────────

/** A single hit returned by a global search */
export interface SearchResult {
  /** Unique key for React list rendering */
  key: string;
  /** Section this result belongs to */
  section: 'vehicle' | 'inventory' | 'purchase';
  /** Primary display label */
  label: string;
  /** Secondary detail line */
  sublabel?: string;
  /** Route to navigate to on selection */
  href: string;
}

/**
 * Build a flat list of SearchResults from all available data sources.
 * Deduplicates vehicles that also appear in inventory by vehicleId.
 *
 * @param query          - Raw search string (not yet normalised)
 * @param vehicles       - Full vehicle list
 * @param inventoryItems - Full inventory item list
 * @param purchases      - Session purchase list
 * @param vehicleDetailPath - Function that returns the vehicle detail URL
 * @param inventoryPath  - Inventory page URL
 *
 * @example
 * ```ts
 * const results = buildGlobalResults(
 *   'toyota',
 *   vehicles,
 *   items,
 *   purchases,
 *   (id) => `/vehicles/${id}`,
 *   '/inventory',
 * );
 * ```
 */
export function buildGlobalResults(
  query: string,
  vehicles: VehicleDTO[],
  inventoryItems: InventoryItemDTO[],
  purchases: PurchaseDTO[],
  vehicleDetailPath: (id: string) => string,
  inventoryPath: string
): SearchResult[] {
  if (!query.trim()) return [];

  const results: SearchResult[] = [];
  const usedKeys = new Set<string>();

  // ── Vehicles ─────────────────────────────────────────────────────────────
  for (let i = 0; i < vehicles.length; i++) {
    const v = vehicles[i];
    if (matchesVehicle(v, query)) {
      let key = `vehicle-${v.id}`;
      if (usedKeys.has(key)) {
        key = `vehicle-${v.id}-${i}`;
      }
      usedKeys.add(key);

      results.push({
        key,
        section: 'vehicle',
        label: `${v.year} ${v.make} ${v.model}`,
        sublabel: `VIN ${v.vin} · $${v.price.toLocaleString()}`,
        href: vehicleDetailPath(v.id),
      });
    }
  }

  // ── Inventory items with no matching vehicle already in results ───────────
  const vehicleIdsInResults = new Set(
    results
      .filter((r) => r.section === 'vehicle')
      .map((r) => r.key.replace(/^vehicle-/, '').replace(/-\d+$/, ''))
  );

  for (let i = 0; i < inventoryItems.length; i++) {
    const item = inventoryItems[i];
    if (vehicleIdsInResults.has(item.vehicleId)) continue; // deduplicate
    if (matchesInventoryItem(item, query)) {
      let key = `inventory-${item.id}`;
      if (usedKeys.has(key)) {
        key = `inventory-${item.id}-${i}`;
      }
      usedKeys.add(key);

      const vehicleLabel = item.vehicle
        ? `${item.vehicle.year} ${item.vehicle.make} ${item.vehicle.model}`
        : item.vehicleId.slice(0, 8) + '…';
      results.push({
        key,
        section: 'inventory',
        label: vehicleLabel,
        sublabel: `Stock: ${item.quantity} · ${item.available ? 'Available' : 'Unavailable'}`,
        href: inventoryPath,
      });
    }
  }

  // ── Purchases ─────────────────────────────────────────────────────────────
  for (let i = 0; i < purchases.length; i++) {
    const p = purchases[i];
    if (matchesPurchase(p, query)) {
      let key = `purchase-${p.id}`;
      if (usedKeys.has(key)) {
        key = `purchase-${p.id}-${i}`;
      }
      usedKeys.add(key);

      const vehicleLabel = p.vehicle
        ? `${p.vehicle.year} ${p.vehicle.make} ${p.vehicle.model}`
        : `Vehicle ${p.vehicleId.slice(0, 8)}`;
      results.push({
        key,
        section: 'purchase',
        label: vehicleLabel,
        sublabel: `Purchased ${new Date(p.purchasedAt).toLocaleDateString()}`,
        href: vehicleDetailPath(p.vehicleId),
      });
    }
  }

  return results;
}

// ── Highlight helper ───────────────────────────────────────────────────────

/**
 * Split a label string into alternating plain / highlighted segments
 * so the matched portion can be rendered in bold without innerHTML.
 *
 * Returns an array of `{ text, highlight }` tuples.
 *
 * @example
 * ```ts
 * highlightMatch('Toyota Camry', 'camry')
 * // → [{ text: 'Toyota ', highlight: false }, { text: 'Camry', highlight: true }]
 * ```
 */
export interface HighlightSegment {
  text: string;
  highlight: boolean;
}

export function highlightMatch(
  label: string,
  query: string
): HighlightSegment[] {
  const q = norm(query);
  if (!q) return [{ text: label, highlight: false }];

  const lower = norm(label);
  const idx = lower.indexOf(q);
  if (idx === -1) return [{ text: label, highlight: false }];

  return [
    { text: label.slice(0, idx), highlight: false },
    { text: label.slice(idx, idx + q.length), highlight: true },
    { text: label.slice(idx + q.length), highlight: false },
  ].filter((s) => s.text.length > 0);
}
