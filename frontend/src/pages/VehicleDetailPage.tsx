/**
 * Vehicle Detail Page — Premium Enterprise Edition
 *
 * Page for viewing full details of a single vehicle.
 * Features:
 *   - Premium skeleton loading with shimmer
 *   - Dark gradient header on details card
 *   - Action buttons with hover states
 *   - Polished error and not-found states
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
        <div className="p-6 lg:p-8">
          <div className="mx-auto max-w-2xl">
            <div className="flex flex-col items-center rounded-2xl border border-red-200 bg-red-50 px-8 py-12 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100">
                <svg className="h-7 w-7 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-red-900">Invalid Vehicle ID</h2>
              <p className="mt-2 text-sm text-red-600">No vehicle ID was provided in the URL.</p>
              <button
                onClick={() => navigate(paths.vehicles)}
                className="mt-6 inline-flex items-center gap-1.5 rounded-xl bg-red-100 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-200 transition-colors"
              >
                Back to Vehicles
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // ── Loading skeleton ────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <DashboardLayout pageTitle="Vehicle Details">
        <div className="p-6 lg:p-8">
          <div className="mx-auto max-w-4xl animate-pulse">
            {/* Back button skeleton */}
            <div className="mb-6 h-8 w-36 rounded-lg bg-slate-200" />

            {/* Header skeleton */}
            <div className="mb-8 flex items-start justify-between">
              <div className="space-y-2.5">
                <div className="h-8 w-64 rounded-lg bg-slate-200" />
                <div className="h-4 w-40 rounded-lg bg-slate-100" />
              </div>
              <div className="flex gap-3">
                <div className="h-10 w-24 rounded-xl bg-slate-200" />
                <div className="h-10 w-24 rounded-xl bg-slate-200" />
              </div>
            </div>

            {/* Card skeleton */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="bg-slate-800 px-8 py-8">
                <div className="flex items-start justify-between">
                  <div className="space-y-3">
                    <div className="h-7 w-52 rounded-lg bg-slate-700" />
                    <div className="h-4 w-40 rounded-lg bg-slate-700" />
                  </div>
                  <div className="h-10 w-28 rounded-2xl bg-slate-700" />
                </div>
              </div>
              <div className="px-8 py-8">
                <div className="h-4 w-28 rounded-full bg-slate-200 mb-5" />
                <div className="grid grid-cols-3 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="rounded-xl bg-slate-50 p-4 space-y-2">
                      <div className="h-2.5 w-12 rounded-full bg-slate-200" />
                      <div className="h-5 w-24 rounded-full bg-slate-100" />
                    </div>
                  ))}
                </div>
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
        <div className="p-6 lg:p-8">
          <div className="mx-auto max-w-2xl">
            <div className="flex flex-col items-center rounded-2xl border border-red-200 bg-red-50 px-8 py-12 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100">
                <svg className="h-7 w-7 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-red-900">Failed to Load Vehicle</h2>
              <p className="mt-2 text-sm text-red-600">
                {extractMessage(fetchError) ?? 'An error occurred while fetching the vehicle.'}
              </p>
              <button
                onClick={() => navigate(paths.vehicles)}
                className="mt-6 inline-flex items-center gap-1.5 rounded-xl bg-red-100 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-200 transition-colors"
              >
                Back to Vehicles
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // ── Not found ───────────────────────────────────────────────────────────────
  if (!vehicle) {
    return (
      <DashboardLayout pageTitle="Vehicle Details">
        <div className="p-6 lg:p-8">
          <div className="mx-auto max-w-2xl">
            <div className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white px-8 py-12 text-center shadow-sm">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                <svg className="h-7 w-7 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-slate-900">Vehicle Not Found</h2>
              <p className="mt-2 text-sm text-slate-500">The vehicle you are looking for does not exist or may have been removed.</p>
              <button
                onClick={() => navigate(paths.vehicles)}
                className="mt-6 inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition-colors"
              >
                Back to Vehicles
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // ── Detail view ─────────────────────────────────────────────────────────────
  return (
    <DashboardLayout pageTitle={`${vehicle.make} ${vehicle.model}`}>
      <div className="p-6 lg:p-8">
        <div className="mx-auto max-w-4xl">
          {/* Back navigation */}
          <button
            type="button"
            onClick={() => navigate(paths.vehicles)}
            className="mb-6 inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors -ml-2"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Vehicles
          </button>

          {/* Page Header */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                {vehicle.make} {vehicle.model}
              </h1>
              <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                <span>{vehicle.year}</span>
                <span className="text-slate-300">·</span>
                <span className="font-semibold text-emerald-600">
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(vehicle.price)}
                </span>
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex shrink-0 gap-3">
              <button
                type="button"
                onClick={() => navigate(paths.vehicleEdit(id))}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-2.5 text-sm font-bold text-white shadow-sm shadow-blue-500/20 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487z" />
                </svg>
                Edit Vehicle
              </button>
              <button
                type="button"
                onClick={() => setIsDeleteDialogOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
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
