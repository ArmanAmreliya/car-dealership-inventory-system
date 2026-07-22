/**
 * useInventoryStats Hook
 *
 * Derives aggregate inventory metrics synchronously from cached inventory data.
 */

import { useInventory } from './useInventory';
import { InventoryStats, LOW_STOCK_THRESHOLD } from '../types/inventory.types';
import { AxiosError } from 'axios';

export interface UseInventoryStatsResult {
  stats: InventoryStats | undefined;
  isLoading: boolean;
  isError: boolean;
  error: AxiosError | null;
  isSuccess: boolean;
}

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
  const reservedCount = items.filter((i) => i.reserved).length;

  const availabilityRate =
    totalVehicles === 0 ? 0 : Math.round((availableVehicles / totalVehicles) * 100);

  const totalStock = items.reduce((sum, item) => sum + item.quantity, 0);

  const outOfStockCount = items.filter((item) => item.quantity === 0).length;

  const lowStockCount = items.filter(
    (item) => item.quantity > 0 && item.quantity <= LOW_STOCK_THRESHOLD
  ).length;

  const totalValue = items.reduce(
    (sum, item) => sum + item.quantity * (item.vehicle?.price ?? 0),
    0
  );

  const stats: InventoryStats = {
    totalVehicles,
    availableVehicles,
    unavailableVehicles,
    reservedCount,
    availabilityRate,
    totalStock,
    outOfStockCount,
    lowStockCount,
    totalValue,
  };

  return {
    stats,
    isLoading,
    isError,
    error: error ?? null,
    isSuccess,
  };
}
