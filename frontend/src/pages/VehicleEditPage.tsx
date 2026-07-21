/**
 * Vehicle Edit Page
 *
 * Page for editing an existing vehicle.
 * Wrapped in DashboardLayout. Fetches vehicle by route param ID,
 * then renders VehicleForm in edit mode.
 */

import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { VehicleForm } from '../features/vehicles/components/VehicleForm';
import { useVehicle } from '../features/vehicles/hooks/useVehicle';
import { useUpdateVehicle } from '../features/vehicles/hooks/useUpdateVehicle';
import { VehicleUpdateInput } from '../features/vehicles/validation/vehicle.schema';
import { paths } from '../routes/paths';

/**
 * VehicleEditPage
 *
 * Loads the vehicle identified by `:id` from the route.
 * Shows skeleton while loading, error state on failure, and
 * the edit form once data is available.
 * On success, shows a toast and redirects to the vehicle detail page.
 */
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
      <DashboardLayout pageTitle="Edit Vehicle">
        <div className="p-6">
          <div className="mx-auto max-w-2xl animate-pulse space-y-4">
            <div className="h-4 w-32 rounded bg-gray-200" />
            <div className="h-8 w-56 rounded bg-gray-200" />
            <div className="h-4 w-72 rounded bg-gray-200" />
            <div className="mt-8 space-y-6 rounded-lg border border-gray-200 bg-white p-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-32 rounded bg-gray-200" />
                  <div className="h-10 w-full rounded bg-gray-100" />
                </div>
              ))}
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
        <div className="p-6">
          <div className="mx-auto max-w-2xl rounded-lg border border-red-200 bg-red-50 p-6">
            <h2 className="text-lg font-semibold text-red-900">Failed to Load Vehicle</h2>
            <p className="mt-2 text-red-700">
              {extractMessage(fetchError) ?? 'An error occurred while fetching the vehicle.'}
            </p>
            <div className="mt-4 flex gap-4">
              <button
                onClick={() => navigate(paths.vehicleDetail(id))}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Back to Details
              </button>
              <button
                onClick={() => navigate(paths.vehicles)}
                className="text-sm text-gray-500 hover:text-gray-700 font-medium"
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
      <DashboardLayout pageTitle="Edit Vehicle">
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

  // ── Form ────────────────────────────────────────────────────────────────────
  return (
    <DashboardLayout pageTitle="Edit Vehicle">
      <div className="p-6">
        <div className="mx-auto max-w-2xl">
          {/* Page Header */}
          <div className="mb-8">
            <button
              type="button"
              onClick={() => navigate(paths.vehicleDetail(id))}
              className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back to Details
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Edit Vehicle</h1>
            <p className="mt-2 text-gray-600">
              {vehicle.make} {vehicle.model} ({vehicle.year})
            </p>
          </div>

          {/* Form Card */}
          <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
            <VehicleForm
              mode="edit"
              initialData={vehicle}
              onSubmit={handleSubmit}
              isPending={isPending}
              error={extractMessage(updateError)}
            />
          </div>

          {/* Cancel Link */}
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => navigate(paths.vehicleDetail(id))}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
