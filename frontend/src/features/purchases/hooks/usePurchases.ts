/**
 * usePurchases Hook
 *
 * TanStack Query hooks for the purchase feature.
 *
 * The backend exposes only one purchase endpoint:
 *   POST /api/v1/purchases
 *
 * There is no list, detail, or history endpoint, so this module
 * contains only the creation mutation.
 *
 * Mutation invalidation rules (per PLAN.md):
 *   Purchase -> invalidate `vehicles` and `inventory`
 *
 * Exports:
 *   purchaseQueryKeys  – centralised key factory (used for invalidation)
 *   useExecutePurchase – mutation hook for POST /api/v1/purchases
 */

import {
  useMutation,
  useQueryClient,
  UseMutationResult,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { purchaseService } from '../services/purchase.service';
import { PurchaseDTO, CreatePurchaseInput, PurchaseError } from '../types/purchase.types';

// ── Query key factory ──────────────────────────────────────────────────────

/**
 * Centralised query keys for the purchase feature.
 *
 * Although there is no GET endpoint, the root key is exported so that
 * other features (e.g. dashboard) can reference it for future
 * invalidation without importing from a different module.
 */
export const purchaseQueryKeys = {
  /** Root key – can be used to invalidate all purchase-related cache entries */
  all: ['purchases'] as const,
} as const;

/**
 * Cross-feature root keys used for invalidation after a purchase.
 * Kept here to avoid circular imports.
 */
const vehicleRootKey = ['vehicles'] as const;
const inventoryRootKey = ['inventory'] as const;

// ── Error extraction ───────────────────────────────────────────────────────

/**
 * Extract a structured PurchaseError from an AxiosError.
 * Returns null when the error is not an Axios response error.
 */
export function extractPurchaseError(err: unknown): PurchaseError | null {
  if (err == null) return null;

  const axiosErr = err as AxiosError<{ message?: string }>;
  if (!axiosErr.isAxiosError || axiosErr.response == null) return null;

  const status = axiosErr.response.status as PurchaseError['status'];
  const rawMessage =
    typeof axiosErr.response.data === 'object' &&
    axiosErr.response.data !== null &&
    'message' in axiosErr.response.data
      ? String((axiosErr.response.data as { message: unknown }).message)
      : axiosErr.message;

  return {
    status,
    message: rawMessage,
    isConflict: status === 409,
  };
}

// ── Mutations ──────────────────────────────────────────────────────────────

/**
 * useExecutePurchase
 *
 * Mutation for POST /api/v1/purchases.
 * Accepts `{ vehicleId }` and returns the created PurchaseDTO.
 *
 * On success:
 *   - Invalidates the `vehicles` root key so vehicle availability
 *     reflects the purchase immediately.
 *   - Invalidates the `inventory` root key so stock counts are refreshed.
 *
 * On 409 Conflict (vehicle no longer available):
 *   The `onError` callback receives an AxiosError. Call
 *   `extractPurchaseError(error)` to detect `isConflict === true`
 *   and show the appropriate "vehicle unavailable" warning in the UI.
 *
 * @returns TanStack Query mutation result typed to PurchaseDTO
 *
 * @example
 * ```tsx
 * const { mutate: executePurchase, isPending, error } = useExecutePurchase();
 *
 * const purchaseError = extractPurchaseError(error);
 *
 * executePurchase(
 *   { vehicleId: vehicle.id },
 *   {
 *     onSuccess: (receipt) => {
 *       toast.success(`Purchase confirmed! ID: ${receipt.id}`);
 *     },
 *     onError: (err) => {
 *       const pe = extractPurchaseError(err);
 *       if (pe?.isConflict) {
 *         toast.error('This vehicle is no longer available.');
 *       } else {
 *         toast.error(pe?.message ?? 'Purchase failed. Please try again.');
 *       }
 *     },
 *   }
 * );
 * ```
 */
export function useExecutePurchase(): UseMutationResult<
  PurchaseDTO,
  AxiosError,
  CreatePurchaseInput
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePurchaseInput) =>
      purchaseService.createPurchase(data),

    onSuccess: () => {
      // Refresh vehicle availability — purchase may have marked it sold
      queryClient.invalidateQueries({ queryKey: vehicleRootKey });

      // Refresh inventory stock counts
      queryClient.invalidateQueries({ queryKey: inventoryRootKey });
    },
  });
}
