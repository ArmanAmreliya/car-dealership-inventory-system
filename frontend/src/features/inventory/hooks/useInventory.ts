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
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchOnWindowFocus: true,
  });
}

// ── Mutations ──────────────────────────────────────────────────────────────

/**
 * useUpdateStock
 *
 * Mutation for PATCH /api/v1/inventory/:id.
 * Accepts `{ id, data: { stockQuantity } }` and returns the updated item.
 *
 * On success:
 * - Writes the updated item directly into the inventory list cache
 *   (optimistic-style cache write without a round-trip).
 * - Invalidates the full inventory list to pull fresh aggregate totals.
 * - Invalidates the vehicles root key so vehicle queries reflect the
 *   latest availability flag (per PLAN.md invalidation rules).
 *
 * @returns TanStack Query mutation result
 *
 * @example
 * ```tsx
 * const { mutate: updateStock, isPending, error } = useUpdateStock();
 *
 * updateStock(
 *   { id: item.id, data: { stockQuantity: 5 } },
 *   {
 *     onSuccess: () => toast.success('Stock updated.'),
 *     onError: (err) => toast.error(err.message),
 *   }
 * );
 * ```
 */
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
            items: prev.items.map((item) =>
              item.id === updatedItem.id ? updatedItem : item
            ),
          };
        }
      );

      // Refetch to get fresh aggregate totals from the server
      queryClient.invalidateQueries({ queryKey: inventoryQueryKeys.list() });

      // Keep vehicle queries in sync (availability flag may have changed)
      queryClient.invalidateQueries({ queryKey: vehicleRootKey });
    },
  });
}
