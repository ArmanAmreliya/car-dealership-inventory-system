/**
 * Vehicle Create Page
 *
 * Page for creating a new vehicle.
 * Wrapped in DashboardLayout. Uses VehicleForm in create mode.
 */

import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { VehicleForm } from '../features/vehicles/components/VehicleForm';
import { useCreateVehicle } from '../features/vehicles/hooks/useCreateVehicle';
import { VehicleCreateInput } from '../features/vehicles/validation/vehicle.schema';
import { paths } from '../routes/paths';

/**
 * VehicleCreatePage
 *
 * Displays a form for adding a new vehicle to inventory.
 * On success, shows a toast and redirects to the vehicle list.
 * On error, surfaces the API error message inside the form.
 */
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
      <div className="p-6">
        <div className="mx-auto max-w-2xl">
          {/* Page Header */}
          <div className="mb-8">
            <button
              type="button"
              onClick={() => navigate(paths.vehicles)}
              className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back to Vehicles
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Add New Vehicle</h1>
            <p className="mt-2 text-gray-600">
              Fill in the details below to add a new vehicle to the inventory.
            </p>
          </div>

          {/* Form Card */}
          <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
            <VehicleForm
              mode="create"
              onSubmit={handleSubmit}
              isPending={isPending}
              error={errorMessage}
            />
          </div>

          {/* Cancel Link */}
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => navigate(paths.vehicles)}
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
