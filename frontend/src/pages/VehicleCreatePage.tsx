/**
 * Vehicle Create Page — Premium Enterprise Edition
 *
 * Page for creating a new vehicle.
 * Features:
 *   - Breadcrumb-style back navigation
 *   - Gradient accent on form card
 *   - Premium form with grouped sections
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

  const handleSubmit = (data: VehicleCreateInput) => {
    createVehicle(data, {
      onSuccess: (vehicle) => {
        toast.success(`${vehicle.make} ${vehicle.model} added to inventory.`);
        navigate(paths.vehicles, { replace: true });
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
      <div className="p-6 lg:p-8">
        <div className="mx-auto max-w-2xl">
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
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Add New Vehicle</h1>
            <p className="mt-2 text-sm text-slate-500">
              Fill in the details below to add a new vehicle to your inventory catalog.
            </p>
          </div>

          {/* Form Card */}
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {/* Top gradient accent */}
            <div className="h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500" />
            <div className="p-8">
              <VehicleForm
                mode="create"
                onSubmit={handleSubmit}
                isPending={isPending}
                error={errorMessage}
              />
            </div>
          </div>

          {/* Cancel Link */}
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => navigate(paths.vehicles)}
              className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
            >
              Cancel and return to vehicle list
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
