/**
 * useCreatePurchase Hook
 *
 * Focused re-export wrapper for the purchase creation mutation.
 *
 * Consumers import from this file instead of usePurchases directly,
 * matching the naming convention used across the feature layer
 * (useCreateVehicle, useUpdateVehicle, etc.) and the PLAN.md
 * hook name `useExecutePurchase`.
 *
 * Also re-exports the error extraction helper and relevant types
 * so call sites have a single import point.
 *
 * @example
 * ```tsx
 * import {
 *   useCreatePurchase,
 *   extractPurchaseError,
 * } from '../hooks/useCreatePurchase';
 *
 * const { mutate: createPurchase, isPending, error } = useCreatePurchase();
 * const purchaseError = extractPurchaseError(error);
 *
 * const handleBuy = () => {
 *   createPurchase(
 *     { vehicleId: vehicle.id },
 *     {
 *       onSuccess: (receipt) => {
 *         toast.success('Purchase confirmed!');
 *         navigate(paths.vehicles);
 *       },
 *       onError: (err) => {
 *         const pe = extractPurchaseError(err);
 *         if (pe?.isConflict) {
 *           toast.error('This vehicle is no longer available.');
 *         } else {
 *           toast.error(pe?.message ?? 'Purchase failed.');
 *         }
 *       },
 *     }
 *   );
 * };
 * ```
 */

export {
  useExecutePurchase as useCreatePurchase,
  extractPurchaseError,
  purchaseQueryKeys,
} from './usePurchases';

export type { CreatePurchaseInput, PurchaseDTO, PurchaseError, PurchaseReceipt } from '../types/purchase.types';
