/**
 * Vehicle Detail Page
 *
 * Page for viewing full details of a single vehicle.
 * Wrapped in DashboardLayout. Provides Edit and Delete actions.
 */

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { VehicleDetailsCard } from '../features/vehicles/components/VehicleDetailsCard';
import { DeleteVehicleDialog } from '../features/vehicles/components/DeleteVehicleDialog';
import { useVehicle } from '../features/vehicles/hooks/useVehicle';
import { useDeleteVehicle } from '../features/vehicles/hooks/useVehicles';
import { paths } from '../routes/paths';

/**
 * VehicleDetailPage
 *
 * Loads the vehicle identified by `:id` from the route.
 * Shows a skeleton while loading, an error state on failure, and
 * the full VehicleDetailsCard once data is available.
 * Allows navigating to the edit page or opening the delete confirmation dialog.
 */
export function VehicleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data: vehicle, isLoading, error: fetchError } = useVehicle(id ?? '');
  const { mutate: deleteVehicle, isPending: isDeleting, error: deleteError } = useDeleteVehicle();

  const extractMessage = (err: unknown): string | null => {
    if (err == null) return null;
    const axiosErr = err as { response?: { data?: unknown }; message?: string };
    if (
      axiosErr.response?.data != null &&
      typeof axiosErr.response.data === 'object' &&
      'message' in (axiosErr.response.data as object)
    ) {
      return String((axiosErr.response.data as Record<string, unknown>).message);
    }
    return axiosErr.message ?? null;
  };

  const handleDeleteConfirm = (vehicleId: string) => {
    deleteVehicle(vehicleId, {
      onSuccess: () => {
        toast.success('Vehicle deleted successfully.');
        navigate(paths.vehicles, { replace: true });
      },
    });
  };

  // ── Invalid ID ──────────────────────────────────────────────────────────────
  if (!id) {
    return (
      <DashboardLayout pageTitle="Vehicle Details">
        <div className="p-6">
          <div className="mx-auto max-w-2xl rounded-lg border border-red-200 bg-red-50 p-6 text-center">
            <h2 className="text-lg font-semibold text-red-900">Invalid Vehicle ID</h2>
            <p className="mt-2 text-red-700">No vehicle ID was provided in the URL.</p>
            <button
              onClick={() => navigate(paths.vehicles)}
              className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Back to Vehicles
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // ── Loading skeleton ────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <DashboardLayout pageTitle="Vehicle Details">
        <div className="p-6">
          <div className="mx-auto max-w-4xl animate-pulse">
            <div className="mb-6">
              <div className="h-4 w-32 rounded bg-gray-200 mb-4" />
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="h-8 w-64 rounded bg-gray-200" />
                  <div className="h-4 w-48 rounded bg-gray-200" />
                </div>
                <div className="flex gap-3">
                  <div className="h-10 w-28 rounded bg-gray-200" />
                  <div className="h-10 w-24 rounded bg-gray-200" />
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-6 space-y-6">
              <div className="h-6 w-40 rounded bg-gray-200" />
              <div className="grid grid-cols-2 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-3 w-20 rounded bg-gray-200" />
                    <div className="h-6 w-32 rounded bg-gray-100" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // ── Fetch error ─────────────────────────────────────────────────────────────
  if (fetchError) {
    return (
      <DashboardLayout pageTitle="Vehicle Details">
        <div className="p-6">
          <div className="mx-auto max-w-2xl rounded-lg border border-red-200 bg-red-50 p-6">
            <h2 className="text-lg font-semibold text-red-900">Failed to Load Vehicle</h2>
            <p className="mt-2 text-red-700">
              {extractMessage(fetchError) ?? 'An error occurred while fetching the vehicle.'}
            </p>
            <button
              onClick={() => navigate(paths.vehicles)}
              className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Back to Vehicles
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // ── Not found ───────────────────────────────────────────────────────────────
  if (!vehicle) {
    return (
      <DashboardLayout pageTitle="Vehicle Details">
        <div className="p-6">
          <div className="mx-auto max-w-2xl rounded-lg border border-gray-200 bg-gray-50 p-6 text-center">
            <h2 className="text-lg font-semibold text-gray-900">Vehicle Not Found</h2>
            <p className="mt-2 text-gray-600">The vehicle you are looking for does not exist.</p>
            <button
              onClick={() => navigate(paths.vehicles)}
              className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Back to Vehicles
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // ── Detail view ─────────────────────────────────────────────────────────────
  return (
    <DashboardLayout pageTitle={`${vehicle.make} ${vehicle.model}`}>
      <div className="p-6">
        <div className="mx-auto max-w-4xl">
          {/* Back navigation */}
          <button
            type="button"
            onClick={() => navigate(paths.vehicles)}
            className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Vehicles
          </button>

          {/* Page Header */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {vehicle.make} {vehicle.model}
              </h1>
              <p className="mt-2 text-gray-600">
                {vehicle.year} &bull;{' '}
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
                  vehicle.price
                )}
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex shrink-0 gap-3">
              <button
                type="button"
                onClick={() => navigate(paths.vehicleEdit(id))}
                className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
              <button
                type="button"
                onClick={() => setIsDeleteDialogOpen(true)}
                className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>
          </div>

          {/* Vehicle Details Card */}
          <VehicleDetailsCard vehicle={vehicle} />
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteVehicleDialog
        vehicleId={id}
        vehicleDisplayName={`${vehicle.make} ${vehicle.model} (${vehicle.year})`}
        isOpen={isDeleteDialogOpen}
        isDeleting={isDeleting}
        error={extractMessage(deleteError)}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setIsDeleteDialogOpen(false)}
      />
    </DashboardLayout>
  );
}
