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
      // Optimistically patch the cached list so the UI updates immediately
      queryClient.setQueryData<InventoryResponse>(
        inventoryQueryKeys.list(),
        (prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            items: prev.items.map((item) => {
              const isMatch =
                item.id === updatedItem.id ||
                item.vehicleId === updatedItem.id ||
                item.vehicleId === updatedItem.vehicleId ||
                item.id === updatedItem.vehicleId;
              return isMatch
                ? {
                    ...item,
                    ...updatedItem,
                    quantity: updatedItem.quantity,
                    available: updatedItem.available,
                    vehicle: item.vehicle || updatedItem.vehicle,
                  }
                : item;
            }),
          };
        }
      );

      // Refetch to get fresh aggregate totals from the server immediately
      queryClient.invalidateQueries({ queryKey: inventoryQueryKeys.all, refetchType: 'all' });

      // Keep vehicle queries in sync (availability flag may have changed)
      queryClient.invalidateQueries({ queryKey: vehicleRootKey, refetchType: 'all' });
    },
  });
}
