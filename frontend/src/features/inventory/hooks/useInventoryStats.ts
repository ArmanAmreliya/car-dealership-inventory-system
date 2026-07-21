/**
 * useInventoryStats Hook
 *
 * Derives dashboard-level statistics from the inventory query.
 * No additional network request is made — this hook reads directly
 * from the `useInventory` cache and computes summary values.
 *
 * Consumers (e.g. DashboardPage stat cards) import this hook instead
 * of calling useInventory directly so the derivation logic stays in
 * one place and can be updated without touching the UI layer.
 */

import { useInventory } from './useInventory';
import {
  InventoryStats,
  LOW_STOCK_THRESHOLD,
} from '../types/inventory.types';
import { AxiosError } from 'axios';

/**
 * Return shape of useInventoryStats.
 * Extends the standard query state flags with the derived stats object.
 */
export interface UseInventoryStatsResult {
  /** Derived dashboard statistics — undefined while loading or on error */
  stats: InventoryStats | undefined;
  /** True while the underlying inventory query is in-flight */
  isLoading: boolean;
  /** True when the underlying query has settled with an error */
  isError: boolean;
  /** The raw Axios error, if any */
  error: AxiosError | null;
  /** True once data has been successfully fetched at least once */
  isSuccess: boolean;
}

/**
 * useInventoryStats
 *
 * Computes an `InventoryStats` summary from the cached inventory data.
 * All values are derived synchronously — no additional API call is made.
 *
 * Derived fields:
 * - `totalVehicles`      – from backend aggregate
 * - `availableVehicles`  – from backend aggregate
 * - `unavailableVehicles`– totalVehicles − availableVehicles
 * - `availabilityRate`   – percentage of available vehicles (0 when no items)
 * - `totalStock`         – sum of all item quantities
 * - `outOfStockCount`    – items with quantity === 0
 * - `lowStockCount`      – items with 0 < quantity <= LOW_STOCK_THRESHOLD
 *
 * @example
 * ```tsx
 * const { stats, isLoading, isError } = useInventoryStats();
 *
 * if (isLoading) return <StatCardSkeleton />;
 * if (isError || !stats) return <ErrorState />;
 *
 * return (
 *   <>
 *     <StatCard title="Total Vehicles"  value={stats.totalVehicles} />
 *     <StatCard title="Available"       value={stats.availableVehicles} />
 *     <StatCard title="Out of Stock"    value={stats.outOfStockCount} />
 *     <StatCard title="Availability"    value={`${stats.availabilityRate}%`} />
 *   </>
 * );
 * ```
 */
export function useInventoryStats(): UseInventoryStatsResult {
  const { data, isLoading, isError, error, isSuccess } = useInventory();

  if (!data) {
    return {
      stats: undefined,
      isLoading,
      isError,
      error: error ?? null,
      isSuccess,
    };
  }

  const { items, totalVehicles, availableVehicles } = data;

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

  const stats: InventoryStats = {
    totalVehicles,
    availableVehicles,
    unavailableVehicles,
    availabilityRate,
    totalStock,
    outOfStockCount,
    lowStockCount,
  };

  return {
    stats,
    isLoading,
    isError,
    error: error ?? null,
    isSuccess,
  };
}
