/**
 * Vehicle Edit Page — Premium Enterprise Edition
 *
 * Page for editing an existing vehicle.
 * Features:
 *   - Consistent premium styling with create page
 *   - Gradient accent on form card
 *   - Polished skeleton, error, and not-found states
 */

import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { VehicleForm } from '../features/vehicles/components/VehicleForm';
import { useVehicle } from '../features/vehicles/hooks/useVehicle';
import { useUpdateVehicle } from '../features/vehicles/hooks/useUpdateVehicle';
import { VehicleUpdateInput } from '../features/vehicles/validation/vehicle.schema';
import { paths } from '../routes/paths';

export function VehicleEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: vehicle, isLoading, error: fetchError } = useVehicle(id ?? '');
  const { mutate: updateVehicle, isPending, error: updateError } = useUpdateVehicle();

  const handleSubmit = (data: VehicleUpdateInput) => {
    if (!id) return;
    updateVehicle(
      { id, data },
      {
        onSuccess: (updated) => {
          toast.success(`${updated.make} ${updated.model} updated successfully.`);
          navigate(paths.vehicleDetail(id), { replace: true });
        },
      }
    );
  };

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

  // ── Invalid ID ──────────────────────────────────────────────────────────────
  if (!id) {
    return (
      <DashboardLayout pageTitle="Edit Vehicle">
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
      <DashboardLayout pageTitle="Edit Vehicle">
        <div className="p-6 lg:p-8">
          <div className="mx-auto max-w-2xl animate-pulse space-y-6">
            <div className="h-8 w-36 rounded-lg bg-slate-200" />
            <div className="h-7 w-48 rounded-lg bg-slate-200" />
            <div className="h-4 w-64 rounded-lg bg-slate-100" />
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="h-1 bg-slate-200" />
              <div className="p-8 space-y-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 w-24 rounded-full bg-slate-200" />
                    <div className="h-12 w-full rounded-xl bg-slate-100" />
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
      <DashboardLayout pageTitle="Edit Vehicle">
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
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => navigate(paths.vehicleDetail(id))}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-red-100 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-200 transition-colors"
                >
                  Back to Details
                </button>
                <button
                  onClick={() => navigate(paths.vehicles)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Back to Vehicles
                </button>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // ── Not found ───────────────────────────────────────────────────────────────
  if (!vehicle) {
    return (
      <DashboardLayout pageTitle="Edit Vehicle">
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

  // ── Form ────────────────────────────────────────────────────────────────────
  return (
    <DashboardLayout pageTitle="Edit Vehicle">
      <div className="p-6 lg:p-8">
        <div className="mx-auto max-w-2xl">
          {/* Back navigation */}
          <button
            type="button"
            onClick={() => navigate(paths.vehicleDetail(id))}
            className="mb-6 inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors -ml-2"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Details
          </button>

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Edit Vehicle</h1>
            <p className="mt-2 text-sm text-slate-500">
              Update details for{' '}
              <span className="font-semibold text-slate-700">
                {vehicle.make} {vehicle.model} ({vehicle.year})
              </span>
            </p>
          </div>

          {/* Form Card */}
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {/* Top accent */}
            <div className="h-1 bg-gradient-to-r from-indigo-500 via-blue-500 to-emerald-500" />
            <div className="p-8">
              <VehicleForm
                mode="edit"
                initialData={vehicle}
                onSubmit={handleSubmit}
                isPending={isPending}
                error={extractMessage(updateError)}
              />
            </div>
          </div>

          {/* Cancel Link */}
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => navigate(paths.vehicleDetail(id))}
              className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
            >
              Cancel and return to vehicle details
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
