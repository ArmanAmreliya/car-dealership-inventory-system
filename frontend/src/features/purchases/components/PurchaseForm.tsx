/**
 * PurchaseForm Component
 *
 * Reusable, production-ready form for executing a vehicle purchase.
 *
 * Two usage modes:
 *   1. Pre-selected vehicle  – pass `vehicleId` and optionally `vehicle`.
 *      The select is hidden; the form shows vehicle details and a confirm button.
 *   2. Vehicle selection mode – omit `vehicleId`.
 *      Renders a <select> populated from `availableVehicles`.
 *
 * The form validates client-side with Zod via React Hook Form, then checks
 * live inventory availability via usePurchaseValidation before allowing
 * submission. The mutation is delegated to useCreatePurchase.
 *
 * On success the caller receives the completed PurchaseDTO via `onSuccess`.
 * On conflict (HTTP 409) the form surfaces a specific "vehicle no longer
 * available" warning per PLAN.md requirements.
 */

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { purchaseSchema, PurchaseFormValues } from '../validation/purchase.schema';
import { usePurchaseValidation } from '../hooks/usePurchaseValidation';
import { useCreatePurchase, extractPurchaseError } from '../hooks/useCreatePurchase';
import {
  formatVehicleOption,
  formatVehicleLabel,
  formatPurchaseErrorMessage,
} from '../utils/purchase.utils';
import { VehicleDTO } from '../../../api/api';
import { PurchaseDTO } from '../types/purchase.types';

// ── Types ──────────────────────────────────────────────────────────────────

interface PurchaseFormProps {
  /**
   * Pre-selected vehicle UUID.
   * When provided the vehicle select is hidden and the form
   * acts as a single-click confirm flow.
   */
  vehicleId?: string;

  /**
   * Full VehicleDTO for the pre-selected vehicle.
   * Used to display make/model/price in the summary panel.
   * Optional — the form renders without it.
   */
  vehicle?: VehicleDTO;

  /**
   * List of vehicles to populate the select in selection mode.
   * Ignored when vehicleId is pre-set.
   */
  availableVehicles?: VehicleDTO[];

  /**
   * Called with the created PurchaseDTO after a successful purchase.
   * Use this to show a receipt, navigate away, or close a modal.
   */
  onSuccess: (receipt: PurchaseDTO) => void;

  /**
   * Called when the user clicks Cancel (if rendered).
   * When omitted no cancel button is shown.
   */
  onCancel?: () => void;

  /**
   * Label for the submit button. Defaults to "Confirm Purchase".
   */
  submitLabel?: string;
}

// ── Sub-components ─────────────────────────────────────────────────────────

interface VehicleSummaryProps {
  vehicle: VehicleDTO;
  stockQuantity: number;
}

function VehicleSummary({ vehicle, stockQuantity }: VehicleSummaryProps) {
  const price = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(vehicle.price);

  return (
    <div className="rounded-md border border-gray-200 bg-gray-50 px-4 py-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-semibold text-gray-900">
            {formatVehicleLabel(vehicle)}
          </p>
          <p className="mt-0.5 font-mono text-xs text-gray-400">{vehicle.vin}</p>
        </div>
        <span className="shrink-0 text-base font-bold text-green-700">{price}</span>
      </div>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
        <span>Year: {vehicle.year}</span>
        {vehicle.color && <span>Color: {vehicle.color}</span>}
        {vehicle.mileage != null && (
          <span>
            {new Intl.NumberFormat('en-US').format(vehicle.mileage)} mi
          </span>
        )}
        <span>
          Stock:{' '}
          <span
            className={
              stockQuantity === 0
                ? 'font-semibold text-red-600'
                : stockQuantity <= 3
                ? 'font-semibold text-amber-600'
                : 'font-semibold text-green-600'
            }
          >
            {stockQuantity} unit{stockQuantity !== 1 ? 's' : ''}
          </span>
        </span>
      </div>
    </div>
  );
}

// ── Availability warning ───────────────────────────────────────────────────

function AvailabilityWarning({ message }: { message: string }) {
  return (
    <div className="flex gap-2.5 rounded-md border border-amber-200 bg-amber-50 px-4 py-3">
      <svg
        className="mt-0.5 h-4 w-4 shrink-0 text-amber-500"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
        />
      </svg>
      <p className="text-sm text-amber-800">{message}</p>
    </div>
  );
}

// ── Conflict error banner ──────────────────────────────────────────────────

function ConflictBanner({ message }: { message: string }) {
  return (
    <div className="flex gap-2.5 rounded-md border border-red-200 bg-red-50 px-4 py-3">
      <svg
        className="mt-0.5 h-4 w-4 shrink-0 text-red-500"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
        />
      </svg>
      <p className="text-sm text-red-800">{message}</p>
    </div>
  );
}

// ── Spinner ────────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

/**
 * PurchaseForm
 *
 * @example — pre-selected vehicle (detail page / modal):
 * ```tsx
 * <PurchaseForm
 *   vehicleId={vehicle.id}
 *   vehicle={vehicle}
 *   onSuccess={(receipt) => {
 *     toast.success('Purchase confirmed!');
 *     navigate(paths.vehicles);
 *   }}
 *   onCancel={() => setOpen(false)}
 * />
 * ```
 *
 * @example — vehicle selection (standalone purchases page):
 * ```tsx
 * <PurchaseForm
 *   availableVehicles={vehicles}
 *   onSuccess={(receipt) => setReceipt(receipt)}
 * />
 * ```
 */
export function PurchaseForm({
  vehicleId: preselectedVehicleId,
  vehicle: preselectedVehicle,
  availableVehicles = [],
  onSuccess,
  onCancel,
  submitLabel = 'Confirm Purchase',
}: PurchaseFormProps) {
  const isPreselected = Boolean(preselectedVehicleId);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PurchaseFormValues>({
    resolver: zodResolver(purchaseSchema),
    defaultValues: {
      vehicleId: preselectedVehicleId ?? '',
    },
  });

  // Keep the hidden field in sync when prop changes (e.g. navigating between vehicles)
  useEffect(() => {
    if (preselectedVehicleId) {
      setValue('vehicleId', preselectedVehicleId, { shouldValidate: false });
    }
  }, [preselectedVehicleId, setValue]);

  const watchedVehicleId = watch('vehicleId');

  // ── Availability check ──────────────────────────────────────────────────
  const {
    isAvailable,
    unavailabilityReason,
    isCheckingAvailability,
    inventoryItem,
    stockQuantity,
  } = usePurchaseValidation(watchedVehicleId);

  // ── Mutation ─────────────────────────────────────────────────────────────
  const {
    mutate: createPurchase,
    isPending,
    error: mutationError,
    reset: resetMutation,
  } = useCreatePurchase();

  const purchaseError = extractPurchaseError(mutationError);
  const isConflictError = purchaseError?.isConflict === true;

  // Reset the mutation error whenever the selected vehicle changes
  useEffect(() => {
    resetMutation();
  }, [watchedVehicleId, resetMutation]);

  // ── Submit handler ────────────────────────────────────────────────────────
  const onSubmit = (values: PurchaseFormValues) => {
    // Client-side availability gate — stop before hitting the network
    if (!isAvailable) return;

    createPurchase(
      { vehicleId: values.vehicleId },
      {
        onSuccess: (receipt) => {
          onSuccess(receipt);
        },
      }
    );
  };

  // ── Derived display values ────────────────────────────────────────────────
  const selectedVehicle =
    preselectedVehicle ??
    (watchedVehicleId
      ? availableVehicles.find((v) => v.id === watchedVehicleId)
      : undefined);

  const isSubmitDisabled =
    isPending || isCheckingAvailability || !isAvailable || isConflictError;

  const errorMessage = mutationError
    ? formatPurchaseErrorMessage(purchaseError ?? mutationError)
    : null;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">

      {/* ── Vehicle select (selection mode only) ─────────────────────── */}
      {!isPreselected && (
        <div>
          <label
            htmlFor="purchase-vehicle"
            className="block text-sm font-medium text-gray-700"
          >
            Select Vehicle <span className="text-red-500">*</span>
          </label>
          <select
            id="purchase-vehicle"
            {...register('vehicleId')}
            disabled={isPending}
            className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 disabled:bg-gray-50 disabled:text-gray-400 ${
              errors.vehicleId
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }`}
          >
            <option value="">— Choose a vehicle —</option>
            {availableVehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {formatVehicleOption(v)}
              </option>
            ))}
          </select>
          {errors.vehicleId && (
            <p className="mt-1 text-xs text-red-600">
              {String(errors.vehicleId.message)}
            </p>
          )}
        </div>
      )}

      {/* Hidden field carries vehicleId in pre-selected mode */}
      {isPreselected && (
        <input type="hidden" {...register('vehicleId')} />
      )}

      {/* ── Vehicle summary panel ─────────────────────────────────────── */}
      {selectedVehicle && (
        <VehicleSummary
          vehicle={selectedVehicle}
          stockQuantity={stockQuantity}
        />
      )}

      {/* ── Inventory loading indicator ───────────────────────────────── */}
      {isCheckingAvailability && watchedVehicleId && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Spinner />
          Checking availability…
        </div>
      )}

      {/* ── Client-side availability warning ─────────────────────────── */}
      {!isCheckingAvailability &&
        unavailabilityReason &&
        !isConflictError &&
        watchedVehicleId && (
          <AvailabilityWarning message={unavailabilityReason} />
        )}

      {/* ── API error (non-conflict) ──────────────────────────────────── */}
      {errorMessage && !isConflictError && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm text-red-800">{errorMessage}</p>
        </div>
      )}

      {/* ── 409 Conflict banner ───────────────────────────────────────── */}
      {isConflictError && (
        <ConflictBanner
          message="This vehicle is no longer available. The inventory has been refreshed — please select another vehicle."
        />
      )}

      {/* ── Inventory item detail (stock visible to buyer) ───────────── */}
      {inventoryItem && !isCheckingAvailability && isAvailable && (
        <p className="text-xs text-gray-400">
          {stockQuantity} unit{stockQuantity !== 1 ? 's' : ''} available in
          inventory
        </p>
      )}

      {/* ── Action row ───────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 pt-1">
        <button
          type="submit"
          disabled={isSubmitDisabled}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
        >
          {isPending ? (
            <>
              <Spinner />
              Processing…
            </>
          ) : isCheckingAvailability ? (
            <>
              <Spinner />
              Checking…
            </>
          ) : (
            submitLabel
          )}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className="rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
