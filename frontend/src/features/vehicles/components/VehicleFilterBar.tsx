/**
 * Vehicle Filter Bar Component
 *
 * Reusable filter form for vehicle listing.
 * Supports make, model, year, price range, and availability filters.
 */

import { useForm } from 'react-hook-form';
import { VehicleFilters } from '../types/vehicle.types';

interface VehicleFilterBarProps {
  onFiltersChange: (filters: VehicleFilters) => void;
  isLoading?: boolean;
}

/**
 * VehicleFilterBar Component
 *
 * Renders filter inputs and handles form submission.
 * Does not manage state - calls parent callback with new filters.
 *
 * @param onFiltersChange - Callback fired when filters are applied
 * @param isLoading - Optional loading state to disable inputs
 */
export function VehicleFilterBar({
  onFiltersChange,
  isLoading = false,
}: VehicleFilterBarProps) {
  const { register, handleSubmit, reset } = useForm<VehicleFilters>({
    defaultValues: {
      make: '',
      model: '',
      year: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      availability: undefined,
    },
  });

  const onSubmit = (data: VehicleFilters) => {
    // Clean up empty values
    const cleanFilters = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== '' && value !== undefined && value !== null)
    ) as VehicleFilters;
    onFiltersChange(cleanFilters);
  };

  const handleReset = () => {
    reset();
    onFiltersChange({});
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <div className="space-y-4">
        {/* Filter Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Make */}
          <div>
            <label htmlFor="make" className="block text-sm font-medium text-gray-700">
              Make
            </label>
            <input
              id="make"
              type="text"
              placeholder="e.g., Toyota"
              {...register('make')}
              disabled={isLoading}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100"
            />
          </div>

          {/* Model */}
          <div>
            <label htmlFor="model" className="block text-sm font-medium text-gray-700">
              Model
            </label>
            <input
              id="model"
              type="text"
              placeholder="e.g., Camry"
              {...register('model')}
              disabled={isLoading}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100"
            />
          </div>

          {/* Year */}
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700">
              Year
            </label>
            <input
              id="year"
              type="number"
              placeholder="e.g., 2023"
              {...register('year', { valueAsNumber: true })}
              disabled={isLoading}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100"
            />
          </div>

          {/* Min Price */}
          <div>
            <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700">
              Min Price ($)
            </label>
            <input
              id="minPrice"
              type="number"
              placeholder="e.g., 10000"
              {...register('minPrice', { valueAsNumber: true })}
              disabled={isLoading}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100"
            />
          </div>

          {/* Max Price */}
          <div>
            <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700">
              Max Price ($)
            </label>
            <input
              id="maxPrice"
              type="number"
              placeholder="e.g., 50000"
              {...register('maxPrice', { valueAsNumber: true })}
              disabled={isLoading}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100"
            />
          </div>

          {/* Availability */}
          <div>
            <label htmlFor="availability" className="block text-sm font-medium text-gray-700">
              Availability
            </label>
            <select
              id="availability"
              {...register('availability', { valueAsNumber: false })}
              disabled={isLoading}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100"
            >
              <option value="">Any</option>
              <option value="true">Available</option>
              <option value="false">Unavailable</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={handleReset}
            disabled={isLoading}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </form>
  );
}
