/**
 * Vehicle Edit Page — Premium Enterprise Edition (Compact No-Scroll Layout)
 *
 * Page for editing an existing vehicle.
 */

import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { VehicleForm } from '../features/vehicles/components/VehicleForm';
import { useVehicle } from '../features/vehicles/hooks/useVehicle';
import { useUpdateVehicle } from '../features/vehicles/hooks/useUpdateVehicle';
import { VehicleUpdateInput } from '../features/vehicles/validation/vehicle.schema';
import { PageLoader } from '../components/common/PageLoader';
import { paths } from '../routes/paths';

export function VehicleEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: vehicle, isLoading, error: fetchError } = useVehicle(id ?? '');
  const { mutate: updateVehicle, isPending, error: updateError } = useUpdateVehicle();

  const handleSubmit = (data: any) => {
    if (!id) return;
    updateVehicle(
      { id, data: data as VehicleUpdateInput },
      {
        onSuccess: (updated) => {
          toast.success(`Vehicle "${updated.make} ${updated.model}" updated successfully!`);
          navigate(paths.vehicleDetail(id), { replace: true });
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || err?.message || 'Failed to update vehicle');
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

  // ── Loading skeleton with car.gif ──────────────────────────────────────────
  if (isLoading) {
    return <PageLoader message="Loading vehicle details…" />;
  }

  // ── Fetch error ─────────────────────────────────────────────────────────────
  if (fetchError || !vehicle || !id) {
    return (
      <div className="p-6">
        <div className="mx-auto max-w-xl rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <h2 className="text-lg font-bold text-red-900">Failed to Load Vehicle</h2>
          <p className="mt-2 text-sm text-red-600">
            {extractMessage(fetchError) ?? 'The vehicle record could not be found.'}
          </p>
          <button
            onClick={() => navigate(paths.vehicles)}
            className="mt-6 inline-flex items-center gap-1.5 rounded-xl bg-red-100 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-200 transition-colors"
          >
            Back to Vehicles
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6">
      <div className="mx-auto max-w-4xl">
        {/* Header & Back row */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Edit Vehicle</h1>
            <p className="text-xs text-slate-500">
              Updating details for <span className="font-semibold text-slate-700 dark:text-slate-300">{vehicle.make} {vehicle.model} ({vehicle.year})</span>
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate(paths.vehicleDetail(id))}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Details
          </button>
        </div>

        {/* Form Card */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          {/* Top gradient accent */}
          <div className="h-1 bg-gradient-to-r from-teal-500 via-indigo-500 to-emerald-500" />
          <div className="p-6">
            <VehicleForm
              mode="edit"
              initialData={vehicle}
              onSubmit={handleSubmit}
              isPending={isPending}
              error={extractMessage(updateError)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
