/**
 * Vehicles List Page
 *
 * Main page for browsing vehicle inventory.
 * Integrates filtering and table display.
 */

import { useState } from 'react';
import { VehicleFilterBar } from '../features/vehicles/components/VehicleFilterBar';
import { VehicleTable } from '../features/vehicles/components/VehicleTable';
import { useVehicles } from '../features/vehicles/hooks/useVehicles';
import { VehicleFilters } from '../features/vehicles/types/vehicle.types';
import { DashboardLayout } from '../layouts/DashboardLayout';

/**
 * VehiclesListPage Component
 *
 * Displays vehicle inventory with filtering and search.
 * Manages filter state and queries vehicle list.
 */
export function VehiclesListPage() {
  const [filters, setFilters] = useState<VehicleFilters>({});
  const { data: vehicles = [], isLoading, error } = useVehicles(filters);

  const handleFiltersChange = (newFilters: VehicleFilters) => {
    setFilters(newFilters);
  };

  return (
    <DashboardLayout pageTitle="Vehicles">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Vehicle Inventory</h2>
            <p className="mt-1 text-gray-600">
              {isLoading ? 'Loading...' : `${vehicles.length} vehicle${vehicles.length !== 1 ? 's' : ''} found`}
            </p>
          </div>
          <a
            href="/vehicles/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add New Vehicle
          </a>
        </div>

        {/* Filter Bar */}
        <VehicleFilterBar
          onFiltersChange={handleFiltersChange}
          isLoading={isLoading}
        />

        {/* Error State */}
        {error && (
          <div className="rounded-md bg-red-50 p-4 mb-6">
            <h3 className="text-sm font-medium text-red-800">
              Error loading vehicles
            </h3>
            <p className="mt-2 text-sm text-red-700">
              {error?.message || 'An error occurred while fetching vehicles.'}
            </p>
          </div>
        )}

        {/* Vehicle Table */}
        <VehicleTable vehicles={vehicles} isLoading={isLoading} />
      </div>
    </DashboardLayout>
  );
}
