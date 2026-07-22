/**
 * Vehicle Create Page — Premium Enterprise Edition (Compact No-Scroll Layout)
 *
 * Page for creating a new vehicle.
 * Features:
 *   - Compact 2-column split layout fitting within standard viewports
 *   - Gradient accent header bar
 *   - Clear feedback toasts with Sonner
 */

import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { VehicleForm } from '../features/vehicles/components/VehicleForm';
import { useCreateVehicle } from '../features/vehicles/hooks/useCreateVehicle';
import { VehicleCreateInput } from '../features/vehicles/validation/vehicle.schema';
import { paths } from '../routes/paths';

export function VehicleCreatePage() {
  const navigate = useNavigate();
  const { mutate: createVehicle, isPending, error } = useCreateVehicle();

  const handleSubmit = (data: any) => {
    createVehicle(data as VehicleCreateInput, {
      onSuccess: (vehicle) => {
        toast.success(`Vehicle "${vehicle.make} ${vehicle.model}" created successfully!`);
        navigate(paths.vehicles, { replace: true });
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.message || err?.message || 'Failed to create vehicle');
      },
    });
  };

  const errorMessage =
    error?.response?.data != null &&
    typeof error.response.data === 'object' &&
    'message' in error.response.data
      ? String((error.response.data as Record<string, unknown>).message)
      : error?.message ?? null;

  return (
    <DashboardLayout pageTitle="Add Vehicle">
      <div className="p-4 lg:p-6">
        <div className="mx-auto max-w-4xl">
          {/* Header & Back row */}
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">Add New Vehicle</h1>
              <p className="text-xs text-slate-500">
                Enter details below to register a vehicle in the inventory.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate(paths.vehicles)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Back to List
            </button>
          </div>

          {/* Form Card */}
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {/* Top gradient accent */}
            <div className="h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500" />
            <div className="p-6">
              <VehicleForm
                mode="create"
                onSubmit={handleSubmit}
                isPending={isPending}
                error={errorMessage}
              />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
