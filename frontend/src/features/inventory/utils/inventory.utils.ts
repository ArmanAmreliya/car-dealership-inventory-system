/**
 * Inventory Utility Functions
 *
 * Pure, side-effect-free helpers used across inventory components.
 * Nothing here imports React or makes API calls — safe to use in
 * both components and hooks.
 */

import {
  InventoryItemDTO,
  InventoryStats,
  AvailabilityStatus,
  LOW_STOCK_THRESHOLD,
} from '../types/inventory.types';

// ── Status derivation ──────────────────────────────────────────────────────

/**
 * Derive the AvailabilityStatus for a single inventory item.
 *
 * Rules:
 *   - `unavailable` when available === false OR quantity === 0
 *   - `low-stock`   when quantity is in (0, LOW_STOCK_THRESHOLD]
 *   - `available`   otherwise
 *
 * @example
 * ```ts
 * getItemStatus({ quantity: 0, available: true })  // → 'unavailable'
 * getItemStatus({ quantity: 2, available: true })  // → 'low-stock'
 * getItemStatus({ quantity: 5, available: true })  // → 'available'
 * ```
 */
export function getItemStatus(
  item: Pick<InventoryItemDTO, 'quantity' | 'available'>
): AvailabilityStatus {
  if (!item.available || item.quantity === 0) return 'unavailable';
  if (item.quantity <= LOW_STOCK_THRESHOLD) return 'low-stock';
  return 'available';
}

// ── Item classification ────────────────────────────────────────────────────

/**
 * Return only the items whose status equals the requested AvailabilityStatus.
 *
 * @example
 * ```ts
 * const lowItems = filterByStatus(items, 'low-stock');
 * ```
 */
export function filterByStatus(
  items: InventoryItemDTO[],
  status: AvailabilityStatus
): InventoryItemDTO[] {
  return items.filter((item) => getItemStatus(item) === status);
}

/**
 * Return items that need attention — either low-stock or out-of-stock.
 * Sorted most urgent first (out-of-stock before low-stock, then by
 * ascending quantity within each tier).
 */
export function getAlertItems(items: InventoryItemDTO[]): InventoryItemDTO[] {
  return items
    .filter((item) => {
      const s = getItemStatus(item);
      return s === 'low-stock' || s === 'unavailable';
    })
    .sort((a, b) => {
      // Out-of-stock items (quantity 0) bubble to the top
      if (a.quantity === 0 && b.quantity !== 0) return -1;
      if (b.quantity === 0 && a.quantity !== 0) return 1;
      return a.quantity - b.quantity;
    });
}

// ── Stats derivation ───────────────────────────────────────────────────────

/**
 * Compute InventoryStats from the raw item list and backend aggregates.
 * This is the pure logic extracted from useInventoryStats so it can be
 * unit-tested and reused outside React.
 *
 * @param items              - Full inventory item list
 * @param totalVehicles      - Backend-provided aggregate
 * @param availableVehicles  - Backend-provided aggregate
 *
 * @example
 * ```ts
 * const stats = computeInventoryStats(items, 20, 14);
 * console.log(stats.availabilityRate); // 70
 * ```
 */
export function computeInventoryStats(
  items: InventoryItemDTO[],
  totalVehicles: number,
  availableVehicles: number
): InventoryStats {
  const unavailableVehicles = totalVehicles - availableVehicles;

  const availabilityRate =
    totalVehicles === 0
      ? 0
      : Math.round((availableVehicles / totalVehicles) * 100);

  const totalStock = items.reduce((sum, item) => sum + item.quantity, 0);

  const outOfStockCount = items.filter((item) => item.quantity === 0).length;

  const lowStockCount = items.filter(
    (item) => item.quantity > 0 && item.quantity <= LOW_STOCK_THRESHOLD
  ).length;

  return {
    totalVehicles,
    availableVehicles,
    unavailableVehicles,
    availabilityRate,
    totalStock,
    outOfStockCount,
    lowStockCount,
  };
}

// ── Chart data helpers ─────────────────────────────────────────────────────

/**
 * A single segment for a donut / pie chart.
 */
export interface ChartSegment {
  label: string;
  value: number;
  /** Percentage share of the total (0–100, rounded to 1 dp) */
  percentage: number;
  /** Tailwind fill/stroke colour token for this segment */
  color: string;
  /** Accessible foreground colour for labels on top of `color` */
  textColor: string;
}

/**
 * Build the three-segment data set used by the availability donut chart.
 *
 * Segments:
 *   Available   – green-500
 *   Low Stock   – amber-500
 *   Unavailable – red-500
 *
 * @example
 * ```ts
 * const segments = buildAvailabilityChartData(stats);
 * // [{ label: 'Available', value: 14, percentage: 70, color: '#22c55e' }, ...]
 * ```
 */
export function buildAvailabilityChartData(
  stats: InventoryStats
): ChartSegment[] {
  const total = stats.totalVehicles || 1; // guard division by zero

  const raw: Omit<ChartSegment, 'percentage'>[] = [
    {
      label: 'Available',
      value: Math.max(
        0,
        stats.availableVehicles - stats.lowStockCount
      ),
      color: '#22c55e',
      textColor: '#14532d',
    },
    {
      label: 'Low Stock',
      value: stats.lowStockCount,
      color: '#f59e0b',
      textColor: '#78350f',
    },
    {
      label: 'Unavailable',
      value: stats.unavailableVehicles,
      color: '#ef4444',
      textColor: '#7f1d1d',
    },
  ];

  return raw.map((seg) => ({
    ...seg,
    percentage: Math.round((seg.value / total) * 1000) / 10,
  }));
}

/**
 * A single bar in the stock-level bar chart.
 */
export interface StockBarDatum {
  /** Vehicle label: "Year Make Model" or vehicleId fallback */
  label: string;
  /** Raw quantity for this item */
  quantity: number;
  /** Derived status determines bar colour */
  status: AvailabilityStatus;
  /** Inventory item ID */
  id: string;
}

/**
 * Build sorted bar chart data from an item list.
 * Returns up to `limit` items ordered by ascending quantity
 * so the most critical items appear first.
 *
 * @param items  - Full or pre-filtered inventory item list
 * @param limit  - Max items to include (default 10)
 *
 * @example
 * ```ts
 * const bars = buildStockBarData(items, 8);
 * ```
 */
export function buildStockBarData(
  items: InventoryItemDTO[],
  limit = 10
): StockBarDatum[] {
  return [...items]
    .sort((a, b) => a.quantity - b.quantity)
    .slice(0, limit)
    .map((item) => ({
      id: item.id,
      label: item.vehicle
        ? `${item.vehicle.year} ${item.vehicle.make} ${item.vehicle.model}`
        : item.vehicleId.slice(0, 8),
      quantity: item.quantity,
      status: getItemStatus(item),
    }));
}

// ── Formatting helpers ────────────────────────────────────────────────────

/**
 * Format a number as USD currency with no decimal places.
 *
 * @example
 * ```ts
 * formatCurrency(29999)  // → "$29,999"
 * ```
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format a number with thousands separators.
 *
 * @example
 * ```ts
 * formatNumber(12500)  // → "12,500"
 * ```
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

/**
 * Format a percentage value with one decimal place.
 *
 * @example
 * ```ts
 * formatPercent(70)    // → "70.0%"
 * formatPercent(33.3)  // → "33.3%"
 * ```
 */
export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

/**
 * Return a human-readable vehicle label from an inventory item.
 * Falls back to a shortened vehicleId when vehicle data is absent.
 *
 * @example
 * ```ts
 * getVehicleLabel(item)  // → "2022 Toyota Camry"
 * ```
 */
export function getVehicleLabel(item: InventoryItemDTO): string {
  if (item.vehicle) {
    return `${item.vehicle.year} ${item.vehicle.make} ${item.vehicle.model}`;
  }
  return item.vehicleId.slice(0, 8) + '…';
}

/**
 * Truncate a vehicle label to a max character length, appending ellipsis.
 *
 * @example
 * ```ts
 * truncateLabel('2022 Toyota Camry SE', 14)  // → "2022 Toyota Ca…"
 * ```
 */
export function truncateLabel(label: string, maxLength = 18): string {
  if (label.length <= maxLength) return label;
  return label.slice(0, maxLength) + '…';
}
