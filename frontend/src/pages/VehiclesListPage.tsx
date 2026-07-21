/**
 * VehiclesListPage
 *
 * Main page for browsing, filtering, and managing the vehicle inventory.
 * Owns the filter state, delete dialog state, and wires all vehicle
 * feature components together inside DashboardLayout.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { VehicleFilterBar } from '../features/vehicles/components/VehicleFilterBar';
import { VehicleTable } from '../features/vehicles/components/VehicleTable';
import { DeleteVehicleDialog } from '../features/vehicles/components/DeleteVehicleDialog';
import { useVehicles } from '../features/vehicles/hooks/useVehicles';
import { useDeleteVehicle } from '../features/vehicles/hooks/useVehicles';
import { VehicleFilters } from '../features/vehicles/types/vehicle.types';
import { VehicleDTO } from '../api/api';
import { paths } from '../routes/paths';

/**
 * VehiclesListPage
 *
 * Responsibilities:
 * - Holds applied filter state and passes it to `useVehicles`.
 * - Holds the delete-target vehicle and dialog open/close state.
 * - Passes `onDeleteRequest` down to VehicleTable → VehicleActions
 *   so a single dialog lives at this level.
 * - Shows a toast on successful deletion and lets React Query
 *   invalidate the list automatically via `useDeleteVehicle`.
 */
export function VehiclesListPage() {
  const navigate = useNavigate();

  // ── Filter state ──────────────────────────────────────────────────────────
  const [filters, setFilters] = useState<VehicleFilters>({});
  const { data: vehicles = [], isLoading, isError, error, refetch } = useVehicles(filters);

  // ── Delete dialog state ───────────────────────────────────────────────────
  const [deleteTarget, setDeleteTarget] = useState<VehicleDTO | null>(null);
  const { mutate: deleteVehicle, isPending: isDeleting, error: deleteError } = useDeleteVehicle();

  const extractMessage = (err: unknown): string | null => {
    if (err == null) return null;
    const e = err as { response?: { data?: unknown }; message?: string };
    if (
      e.response?.data != null &&
      typeof e.response.data === 'object' &&
      'message' in (e.response.data as object)
    ) {
      return String((e.response.data as Record<string, unknown>).message);
    }
    return e.message ?? null;
  };

  const handleDeleteRequest = (vehicle: VehicleDTO) => {
    setDeleteTarget(vehicle);
  };

  const handleDeleteConfirm = (vehicleId: string) => {
    deleteVehicle(vehicleId, {
      onSuccess: () => {
        toast.success(
          deleteTarget
            ? `${deleteTarget.make} ${deleteTarget.model} deleted.`
            : 'Vehicle deleted.'
        );
        setDeleteTarget(null);
        // useDeleteVehicle already invalidates the vehicles query key
      },
    });
  };

  const handleDeleteCancel = () => {
    setDeleteTarget(null);
  };

  // ── Derived ───────────────────────────────────────────────────────────────
  const resultLabel = isLoading
    ? 'Loading vehicles…'
    : `${vehicles.length} vehicle${vehicles.length !== 1 ? 's' : ''} found`;

  return (
    <DashboardLayout pageTitle="Vehicles">
      <div className="p-6">
        <div className="mx-auto max-w-7xl">
          {/* ── Page header ──────────────────────────────────────────────── */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Vehicle Inventory</h1>
              <p className="mt-1 text-sm text-gray-500">{resultLabel}</p>
            </div>

            <button
              type="button"
              onClick={() => navigate(paths.vehiclesNew)}
              className="inline-flex shrink-0 items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add Vehicle
            </button>
          </div>

          {/* ── Filter bar ───────────────────────────────────────────────── */}
          <VehicleFilterBar onFiltersChange={setFilters} isLoading={isLoading} />

          {/* ── Error state ──────────────────────────────────────────────── */}
          {isError && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
              <div className="flex items-start gap-3">
                <svg
                  className="mt-0.5 h-5 w-5 shrink-0 text-red-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-red-800">Failed to load vehicles</h3>
                  <p className="mt-1 text-sm text-red-700">
                    {extractMessage(error) ?? 'An unexpected error occurred.'}
                  </p>
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

          {/* ── Vehicle table / card grid ─────────────────────────────────── */}
          <VehicleTable
            vehicles={vehicles}
            isLoading={isLoading}
            onDeleteRequest={handleDeleteRequest}
          />
        </div>
      </div>

      {/* ── Delete confirmation dialog (single instance at page level) ─────── */}
      {deleteTarget && (
        <DeleteVehicleDialog
          vehicleId={deleteTarget.id}
          vehicleDisplayName={`${deleteTarget.make} ${deleteTarget.model} (${deleteTarget.year})`}
          isOpen={true}
          isDeleting={isDeleting}
          error={extractMessage(deleteError)}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      )}
    </DashboardLayout>
  );
}
