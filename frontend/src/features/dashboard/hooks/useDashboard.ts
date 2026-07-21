/**
 * useDashboard Hook
 *
 * Aggregates data from the inventory and vehicle queries into a single
 * dashboard-ready object. No additional API calls are made — this hook
 * composes useInventoryStats and useVehicles so the dashboard page has
 * one clean import instead of wiring three separate queries.
 *
 * API calls used (per PLAN.md):
 *   GET /api/v1/inventory  →  inventory items + aggregates
 *   GET /api/v1/vehicles   →  full vehicle list
 *
 * The purchase feature has no list/history endpoint, so recent-purchase
 * data must come from session state managed by the page layer.
 */

import { useMemo } from 'react';
import { useInventoryStats } from '../../inventory/hooks/useInventoryStats';
import { useInventory } from '../../inventory/hooks/useInventory';
import { useVehicles } from '../../vehicles/hooks/useVehicles';
import { getAlertItems } from '../../inventory/utils/inventory.utils';
import { InventoryItemDTO, InventoryStats } from '../../inventory/types/inventory.types';
import { VehicleDTO } from '../../../api/api';

// ── Types ──────────────────────────────────────────────────────────────────

export interface DashboardData {
  /** Derived inventory KPIs */
  stats: InventoryStats | undefined;
  /** Full vehicle list */
  vehicles: VehicleDTO[];
  /** Inventory items that need restocking attention */
  alertItems: InventoryItemDTO[];
  /** Total vehicle count from vehicle query (used as a cross-check) */
  totalVehicleCount: number;
  /** True while any underlying query is loading */
  isLoading: boolean;
  /** True when any underlying query has errored */
  isError: boolean;
  /** Refetch both underlying queries */
  refetch: () => void;
}

// ── Hook ──────────────────────────────────────────────────────────────────

/**
 * useDashboard
 *
 * Combines inventory stats + vehicle list into a single dashboard data object.
 * Both queries share the React Query cache so landing on the dashboard
 * pre-warms the cache for the Vehicles and Inventory pages.
 *
 * @example
 * ```tsx
 * const { stats, vehicles, alertItems, isLoading } = useDashboard();
 * ```
 */
export function useDashboard(): DashboardData {
  const {
    stats,
    isLoading: statsLoading,
    isError: statsError,
  } = useInventoryStats();

  const {
    data: inventoryData,
    isLoading: inventoryLoading,
    refetch: refetchInventory,
  } = useInventory();

  const {
    data: vehicles = [],
    isLoading: vehiclesLoading,
    isError: vehiclesError,
    refetch: refetchVehicles,
  } = useVehicles();

  const alertItems = useMemo(
    () => getAlertItems(inventoryData?.items ?? []),
    [inventoryData]
  );

  const isLoading = statsLoading || inventoryLoading || vehiclesLoading;
  const isError = statsError || vehiclesError;

  const refetch = () => {
    refetchInventory();
    refetchVehicles();
  };

  return {
    stats,
    vehicles,
    alertItems,
    totalVehicleCount: vehicles.length,
    isLoading,
    isError,
    refetch,
  };
}
