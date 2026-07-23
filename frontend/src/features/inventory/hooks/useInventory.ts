/**
 * useInventory Hook
 *
 * TanStack Query hooks for the inventory feature:
 *   useInventory()    – fetches the full inventory list + totals
 *   useUpdateStock()  – mutation for updating a single item's stock quantity
 *
 * Mutation invalidation rules (per PLAN.md):
 *   Stock Update -> invalidate `inventory` and `vehicles`
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryResult,
  UseMutationResult,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { inventoryService } from '../services/inventory.service';
import {
  InventoryItemDTO,
  InventoryResponse,
  UpdateStockArgs,
} from '../types/inventory.types';

// ── Query key factory ──────────────────────────────────────────────────────

/**
 * Centralised query keys for all inventory queries.
 * Mirrors the structure used in the vehicle hooks for consistency.
 */
export const inventoryQueryKeys = {
  /** Root key — invalidating this clears all inventory cache entries */
  all: ['inventory'] as const,
  /** Key for the full inventory list query */
  list: () => [...inventoryQueryKeys.all, 'list'] as const,
} as const;

/**
 * Vehicle query root key used for cross-feature invalidation.
 * Kept here to avoid importing from the vehicles feature.
 */
const vehicleRootKey = ['vehicles'] as const;

// ── Queries ────────────────────────────────────────────────────────────────

/**
 * useInventory
 *
 * Fetches the full inventory response from GET /api/v1/inventory.
 * Includes the item list and backend-computed aggregate totals
 * (`totalVehicles`, `availableVehicles`).
 *
 * Cache is kept fresh for 2 minutes and refetched on window focus
 * so the inventory page reflects external stock changes promptly.
 *
 * @returns TanStack Query result typed to `InventoryResponse`
 *
 * @example
 * ```tsx
 * const { data, isLoading, isError, error } = useInventory();
 *
 * if (isLoading) return <Skeleton />;
 * if (isError)   return <ErrorState message={error.message} />;
 *
 * const { items, totalVehicles, availableVehicles } = data;
 * ```
 */
export function useInventory(): UseQueryResult<InventoryResponse, AxiosError> {
  return useQuery({
    queryKey: inventoryQueryKeys.list(),
    queryFn: () => inventoryService.getInventory(),
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}

export function useUpdateStock(): UseMutationResult<
  InventoryItemDTO,
  AxiosError,
  UpdateStockArgs
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdateStockArgs) =>
      inventoryService.updateStock(id, data),

    onSuccess: (updatedItem) => {
      const updatedVehicleId = updatedItem.vehicleId || updatedItem.id;
      const newQuantity = updatedItem.quantity;
      const newAvailable = updatedItem.available;

      // ── 1. Patch inventory cache ─────────────────────────────────────────
      // Updates the raw inventory list (used by useInventory()).
      queryClient.setQueryData<InventoryResponse>(
        inventoryQueryKeys.list(),
        (prev) => {
          if (!prev) return prev;
          const updatedItems = prev.items.map((item) => {
            const isMatch =
              item.id === updatedItem.id ||
              item.vehicleId === updatedVehicleId ||
              item.id === updatedVehicleId;
            if (!isMatch) return item;
            return {
              ...item,
              quantity: newQuantity,
              available: newAvailable,
              // Preserve the full vehicle object (imageUrl etc.) from cache
              vehicle: item.vehicle
                ? { ...item.vehicle }
                : updatedItem.vehicle,
            };
          });
          return {
            ...prev,
            items: updatedItems,
            availableVehicles: updatedItems.filter((i) => i.available).length,
          };
        }
      );

      // ── 2. Patch vehicles cache ──────────────────────────────────────────
      // InventoryPage derives its display list from useVehicles(), so we
      // must update that cache too, otherwise the card/table keeps showing
      // the stale quantity until the next full refetch.
      //
      // setQueriesData is v5-only — use getQueriesData + setQueryData loop
      // for compatibility with the current TanStack Query version.
      const vehicleQueryEntries = queryClient.getQueriesData<unknown>({
        queryKey: vehicleRootKey,
      });
      for (const [queryKey, cacheData] of vehicleQueryEntries) {
        if (!Array.isArray(cacheData)) continue;
        const patched = cacheData.map((v: any) => {
          if (v?.id !== updatedVehicleId) return v;
          return {
            ...v,
            isAvailable: newAvailable,
            // stockQuantity is not part of VehicleDTO officially but the
            // backend now returns it; store it so InventoryPage merge can
            // pick it up as the quantity source of truth.
            stockQuantity: newQuantity,
          };
        });
        queryClient.setQueryData(queryKey, patched);
      }

      // ── 3. Hard-refetch both caches from the server ──────────────────────
      // This reconciles aggregate totals and any other in-flight changes.
      queryClient.invalidateQueries({ queryKey: inventoryQueryKeys.all, refetchType: 'all' });
      queryClient.invalidateQueries({ queryKey: vehicleRootKey, refetchType: 'all' });
    },
  });
}
