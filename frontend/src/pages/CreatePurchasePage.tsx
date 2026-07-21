/**
 * CreatePurchasePage
 *
 * Standalone page for initiating a purchase from the vehicle list.
 * Wraps PurchaseForm in vehicle-selection mode, then shows a receipt on success.
 *
 * Flow:
 *   1. User selects a vehicle from the available-vehicles list.
 *   2. PurchaseForm validates availability and submits.
 *   3. On success → receipt card is shown with a "Back to Vehicles" link.
 *   4. On cancel → navigate back to /vehicles.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { PurchaseForm } from '../features/purchases/components/PurchaseForm';
import { PurchaseSummary } from '../features/purchases/components/PurchaseSummary';
import { useVehicles } from '../features/vehicles/hooks/useVehicles';
import { PurchaseDTO } from '../features/purchases/types/purchase.types';
import { paths } from '../routes/paths';

/**
 * CreatePurchasePage
 *
 * Fetches available vehicles (`availability: true`) and passes them to
 * PurchaseForm for vehicle selection. On success, transitions in-place
 * to a receipt view without navigating away.
 */
export function CreatePurchasePage() {
  const navigate = useNavigate();
  const [completedPurchase, setCompletedPurchase] = useState<PurchaseDTO | null>(null);

  // Fetch only available vehicles for the select list
  const {
    data: vehicles = [],
    isLoading: vehiclesLoading,
    isError: vehiclesError,
    refetch,
  } = useVehicles({ availability: true });

  // Build vehicleMap for PurchaseSummary enrichment
  const vehicleMap = Object.fromEntries(vehicles.map((v) => [v.id, v]));

  const handleSuccess = (receipt: PurchaseDTO) => {
    toast.success('Purchase completed successfully!');
    setCompletedPurchase(receipt);
  };

  const handleCancel = () => {
    navigate(paths.vehicles);
  };

  // ── Receipt view (post-purchase) ─────────────────────────────────────────
  if (completedPurchase) {
    return (
      <DashboardLayout pageTitle="Purchase Confirmed">
        <div className="p-6">
          <div className="mx-auto max-w-lg">
            {/* Back nav */}
            <button
              type="button"
              onClick={() => navigate(paths.purchases)}
              className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Purchase History
            </button>

            <h1 className="mb-6 text-2xl font-bold text-gray-900">
              Purchase Confirmed
            </h1>

            <PurchaseSummary
              purchase={completedPurchase}
              vehicleMap={vehicleMap}
            />

            {/* Actions */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setCompletedPurchase(null)}
                className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Make Another Purchase
              </button>
              <button
                type="button"
                onClick={() => navigate(paths.vehicles)}
                className="flex-1 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
              >
                Back to Vehicles
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // ── Form view ────────────────────────────────────────────────────────────
  return (
    <DashboardLayout pageTitle="New Purchase">
      <div className="p-6">
        <div className="mx-auto max-w-lg">
          {/* Back nav */}
          <button
            type="button"
            onClick={handleCancel}
            className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Vehicles
          </button>

          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">New Purchase</h1>
            <p className="mt-1 text-sm text-gray-500">
              Select an available vehicle and confirm your purchase.
            </p>
          </div>

          {/* Vehicles loading skeleton */}
          {vehiclesLoading && (
            <div className="animate-pulse rounded-lg border border-gray-200 bg-white p-6 space-y-4">
              <div className="h-4 w-32 rounded bg-gray-200" />
              <div className="h-10 w-full rounded bg-gray-100" />
              <div className="h-10 w-full rounded bg-gray-200" />
            </div>
          )}

          {/* Vehicles error */}
          {vehiclesError && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
              <div className="flex items-start gap-3">
                <svg className="mt-0.5 h-5 w-5 shrink-0 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800">Failed to load available vehicles</p>
                </div>
                <button
                  type="button"
                  onClick={() => refetch()}
                  className="shrink-0 rounded-md bg-red-100 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-200 transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {/* No available vehicles */}
          {!vehiclesLoading && !vehiclesError && vehicles.length === 0 && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-5 py-6 text-center">
              <svg className="mx-auto mb-3 h-10 w-10 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              <h3 className="text-sm font-semibold text-amber-900">No vehicles available</h3>
              <p className="mt-1 text-sm text-amber-700">
                There are no vehicles currently available for purchase.
              </p>
              <button
                type="button"
                onClick={() => navigate(paths.inventory)}
                className="mt-3 text-sm font-medium text-amber-800 underline hover:text-amber-900"
              >
                View Inventory
              </button>
            </div>
          )}

          {/* Purchase form */}
          {!vehiclesLoading && !vehiclesError && vehicles.length > 0 && (
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <PurchaseForm
                availableVehicles={vehicles}
                onSuccess={handleSuccess}
                onCancel={handleCancel}
                submitLabel="Confirm Purchase"
              />
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
