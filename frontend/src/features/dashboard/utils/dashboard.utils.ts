/**
 * Dashboard Utility Functions
 *
 * Pure, side-effect-free helpers for transforming raw API data into
 * chart-ready structures used by the dashboard visualisation components.
 * No React or API imports — safe to call from hooks, components, and tests.
 */

import { VehicleDTO } from '../../../api/api';
import { InventoryItemDTO, InventoryStats } from '../../inventory/types/inventory.types';
import { getItemStatus } from '../../inventory/utils/inventory.utils';
import { PurchaseDTO } from '../../purchases/types/purchase.types';

// ── Types ──────────────────────────────────────────────────────────────────

/** One bar in the inventory-distribution chart */
export interface InventoryBar {
  label: string;
  value: number;
  color: string;
  percentage: number;
}

/** One point in the sales-trend sparkline */
export interface SalesTrendPoint {
  /** Short label shown on the x-axis, e.g. "Mon", "Jan" */
  label: string;
  /** Number of purchases in this bucket */
  count: number;
  /** Total revenue in this bucket (from vehicle.price, 0 when unknown) */
  revenue: number;
}

/** One row in the top-vehicles table */
export interface TopVehicleRow {
  vehicleId: string;
  label: string;
  make: string;
  model: string;
  year: number;
  price: number;
  /** Units currently in stock */
  stockQuantity: number;
  /** Derived availability status */
  status: 'available' | 'low-stock' | 'unavailable';
  /** Rank (1-based) */
  rank: number;
}

/** Segment in the price-range distribution chart */
export interface PriceRangeSegment {
  label: string;
  count: number;
  percentage: number;
  color: string;
}

// ── Inventory distribution ─────────────────────────────────────────────────

/**
 * Build a three-bar dataset (Available / Low Stock / Unavailable) from
 * InventoryStats for the InventoryChart component.
 *
 * @example
 * ```ts
 * const bars = buildInventoryDistribution(stats);
 * // [{ label: 'Available', value: 14, color: '#22c55e', percentage: 70 }, ...]
 * ```
 */
export function buildInventoryDistribution(
  stats: InventoryStats
): InventoryBar[] {
  const total = stats.totalVehicles || 1;
  const fullyAvailable = Math.max(
    0,
    stats.availableVehicles - stats.lowStockCount
  );

  const raw: Omit<InventoryBar, 'percentage'>[] = [
    { label: 'Available',    value: fullyAvailable,           color: '#22c55e' },
    { label: 'Low Stock',    value: stats.lowStockCount,      color: '#f59e0b' },
    { label: 'Unavailable',  value: stats.unavailableVehicles, color: '#ef4444' },
  ];

  return raw.map((b) => ({
    ...b,
    percentage: Math.round((b.value / total) * 100),
  }));
}

// ── Sales trend ────────────────────────────────────────────────────────────

type TrendPeriod = 'daily' | 'weekly';

/**
 * Bucket a list of session purchases into time-series trend points.
 *
 * Because the backend has no purchase history endpoint, this operates on
 * the session-local purchase list held in PurchasesPage / sessionStorage.
 *
 * When the list is empty, returns a zeroed placeholder series so charts
 * always have a defined shape to render.
 *
 * @param purchases - Session purchases (newest first)
 * @param period    - 'daily' (last 7 days) | 'weekly' (last 6 weeks)
 *
 * @example
 * ```ts
 * const trend = buildSalesTrend(purchases, 'daily');
 * ```
 */
export function buildSalesTrend(
  purchases: PurchaseDTO[],
  period: TrendPeriod = 'daily'
): SalesTrendPoint[] {
  const now = new Date();

  if (period === 'daily') {
    // Last 7 days, oldest first
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now);
      d.setDate(d.getDate() - (6 - i));
      return d;
    });

    return days.map((day) => {
      const dayStr = day.toISOString().slice(0, 10);
      const bucket = purchases.filter(
        (p) => p.purchasedAt.slice(0, 10) === dayStr
      );
      const label = day.toLocaleDateString('en-US', { weekday: 'short' });
      return {
        label,
        count: bucket.length,
        revenue: bucket.reduce((s, p) => s + (p.vehicle?.price ?? 0), 0),
      };
    });
  }

  // Weekly — last 6 weeks
  const weeks = Array.from({ length: 6 }, (_, i) => {
    const start = new Date(now);
    start.setDate(start.getDate() - (5 - i) * 7 - start.getDay());
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    return { start, end };
  });

  return weeks.map(({ start, end }, i) => {
    const bucket = purchases.filter((p) => {
      const d = new Date(p.purchasedAt);
      return d >= start && d <= end;
    });
    const label = `W${i + 1}`;
    return {
      label,
      count: bucket.length,
      revenue: bucket.reduce((s, p) => s + (p.vehicle?.price ?? 0), 0),
    };
  });
}

// ── Top vehicles ───────────────────────────────────────────────────────────

/**
 * Build a ranked list of vehicles sorted by descending price.
 * Enriches each entry with current stock data from the inventory list.
 *
 * "Top vehicles" in the absence of purchase history means the highest-priced
 * vehicles in the current fleet — a useful overview for sales staff.
 *
 * @param vehicles      - Full vehicle list from useVehicles
 * @param inventoryItems - Inventory items from useInventory
 * @param limit          - Max rows (default 5)
 *
 * @example
 * ```ts
 * const top = buildTopVehicles(vehicles, items, 5);
 * ```
 */
export function buildTopVehicles(
  vehicles: VehicleDTO[],
  inventoryItems: InventoryItemDTO[],
  limit = 5
): TopVehicleRow[] {
  // Build a quick lookup for inventory
  const inventoryMap = new Map(inventoryItems.map((i) => [i.vehicleId, i]));

  return [...vehicles]
    .sort((a, b) => b.price - a.price)
    .slice(0, limit)
    .map((v, idx) => {
      const inv = inventoryMap.get(v.id);
      const quantity = inv?.quantity ?? 0;
      const available = inv?.available ?? false;
      const status = getItemStatus({ quantity, available });

      return {
        vehicleId: v.id,
        label: `${v.year} ${v.make} ${v.model}`,
        make: v.make,
        model: v.model,
        year: v.year,
        price: v.price,
        stockQuantity: quantity,
        status,
        rank: idx + 1,
      };
    });
}

// ── Price range distribution ───────────────────────────────────────────────

const PRICE_RANGES: { label: string; min: number; max: number; color: string }[] = [
  { label: 'Under $15K',   min: 0,      max: 14999,  color: '#6366f1' },
  { label: '$15K–$30K',    min: 15000,  max: 29999,  color: '#3b82f6' },
  { label: '$30K–$50K',    min: 30000,  max: 49999,  color: '#22c55e' },
  { label: '$50K–$75K',    min: 50000,  max: 74999,  color: '#f59e0b' },
  { label: 'Over $75K',    min: 75000,  max: Infinity, color: '#ef4444' },
];

/**
 * Build a price-range distribution for the fleet.
 * Used by InventoryChart to show how vehicle prices are spread.
 *
 * @example
 * ```ts
 * const dist = buildPriceDistribution(vehicles);
 * ```
 */
export function buildPriceDistribution(
  vehicles: VehicleDTO[]
): PriceRangeSegment[] {
  const total = vehicles.length || 1;
  return PRICE_RANGES.map(({ label, min, max, color }) => {
    const count = vehicles.filter((v) => v.price >= min && v.price <= max).length;
    return {
      label,
      count,
      percentage: Math.round((count / total) * 100),
      color,
    };
  });
}

// ── Formatting ─────────────────────────────────────────────────────────────

/**
 * Format a USD price compactly: "$29K", "$1.2M".
 *
 * @example
 * ```ts
 * formatCompactCurrency(29999)   // → "$30K"
 * formatCompactCurrency(1250000) // → "$1.25M"
 * ```
 */
export function formatCompactCurrency(value: number): string {
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2).replace(/\.?0+$/, '')}M`;
  }
  if (value >= 1_000) {
    return `$${Math.round(value / 1_000)}K`;
  }
  return `$${value}`;
}

/**
 * Format a revenue total as a full USD string.
 *
 * @example
 * ```ts
 * formatRevenue(125000)  // → "$125,000"
 * ```
 */
export function formatRevenue(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}
