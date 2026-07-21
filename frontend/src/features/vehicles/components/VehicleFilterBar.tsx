/**
 * VehicleFilterBar Component
 *
 * Collapsible filter panel for the vehicle list.
 * Supports all backend filter params: make, model, year,
 * minPrice, maxPrice, and availability.
 * Fires onFiltersChange only on explicit Apply or Reset.
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { VehicleFilters } from '../types/vehicle.types';

interface VehicleFilterBarProps {
  /** Called with the cleaned filter object when the user applies or resets */
  onFiltersChange: (filters: VehicleFilters) => void;
  /** Disables all inputs while a query is in-flight */
  isLoading?: boolean;
}

/** Strip empty strings, NaN, null, and undefined from filter values */
function cleanFilters(raw: Record<string, unknown>): VehicleFilters {
  return Object.fromEntries(
    Object.entries(raw).filter(([, v]) => {
      if (v === '' || v === null || v === undefined) return false;
      if (typeof v === 'number' && isNaN(v)) return false;
      return true;
    })
  ) as VehicleFilters;
}

/** Count how many filter fields are currently active */
function countActiveFilters(filters: VehicleFilters): number {
  return Object.values(filters).filter(
    (v) => v !== undefined && v !== null && v !== ''
  ).length;
}

/**
 * VehicleFilterBar
 *
 * A collapsible panel that exposes all backend-supported filter parameters.
 * The panel is collapsed by default on mobile and expanded on desktop.
 * An active-filter badge on the toggle button signals how many filters
 * are currently applied.
 *
 * @example
 * ```tsx
 * <VehicleFilterBar
 *   onFiltersChange={(f) => setFilters(f)}
 *   isLoading={isLoading}
 * />
 * ```
 */
export function VehicleFilterBar({
  onFiltersChange,
  isLoading = false,
}: VehicleFilterBarProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeFilters, setActiveFilters] = useState<VehicleFilters>({});

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
    const cleaned = cleanFilters(data as Record<string, unknown>);
    setActiveFilters(cleaned);
    onFiltersChange(cleaned);
  };

  const handleReset = () => {
    reset({
      make: '',
      model: '',
      year: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      availability: undefined,
    });
    setActiveFilters({});
    onFiltersChange({});
  };

  const activeCount = countActiveFilters(activeFilters);

  return (
    <div className="mb-6 rounded-lg border border-gray-200 bg-white shadow-sm">
      {/* Panel toggle */}
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-2">
          <svg
            className="h-4 w-4 text-gray-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
          </svg>
          <span className="text-sm font-medium text-gray-700">Filters</span>
          {activeCount > 0 && (
            <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
              {activeCount} active
            </span>
          )}
        </div>
        <svg
          className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Collapsible body */}
      {isExpanded && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="border-t border-gray-100 px-5 pb-5 pt-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {/* Make */}
              <div>
                <label htmlFor="filter-make" className="block text-sm font-medium text-gray-700">
                  Make
                </label>
                <input
                  id="filter-make"
                  type="text"
                  placeholder="e.g. Toyota"
                  {...register('make')}
                  disabled={isLoading}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400"
                />
              </div>

              {/* Model */}
              <div>
                <label htmlFor="filter-model" className="block text-sm font-medium text-gray-700">
                  Model
                </label>
                <input
                  id="filter-model"
                  type="text"
                  placeholder="e.g. Camry"
                  {...register('model')}
                  disabled={isLoading}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400"
                />
              </div>

              {/* Year */}
              <div>
                <label htmlFor="filter-year" className="block text-sm font-medium text-gray-700">
                  Year
                </label>
                <input
                  id="filter-year"
                  type="number"
                  placeholder="e.g. 2023"
                  min={1886}
                  max={new Date().getFullYear() + 2}
                  {...register('year', { valueAsNumber: true })}
                  disabled={isLoading}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400"
                />
              </div>

              {/* Min Price */}
              <div>
                <label htmlFor="filter-minPrice" className="block text-sm font-medium text-gray-700">
                  Min Price ($)
                </label>
                <input
                  id="filter-minPrice"
                  type="number"
                  placeholder="e.g. 10 000"
                  min={0}
                  {...register('minPrice', { valueAsNumber: true })}
                  disabled={isLoading}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400"
                />
              </div>

              {/* Max Price */}
              <div>
                <label htmlFor="filter-maxPrice" className="block text-sm font-medium text-gray-700">
                  Max Price ($)
                </label>
                <input
                  id="filter-maxPrice"
                  type="number"
                  placeholder="e.g. 50 000"
                  min={0}
                  {...register('maxPrice', { valueAsNumber: true })}
                  disabled={isLoading}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400"
                />
              </div>

              {/* Availability */}
              <div>
                <label htmlFor="filter-availability" className="block text-sm font-medium text-gray-700">
                  Availability
                </label>
                <select
                  id="filter-availability"
                  {...register('availability')}
                  disabled={isLoading}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400"
                >
                  <option value="">Any</option>
                  <option value="true">Available</option>
                  <option value="false">Unavailable</option>
                </select>
              </div>
            </div>

            {/* Action row */}
            <div className="mt-5 flex items-center justify-between gap-3 border-t border-gray-100 pt-4">
              {/* Reset clears everything */}
              <button
                type="button"
                onClick={handleReset}
                disabled={isLoading}
                className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reset
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
              >
                {isLoading ? (
                  <>
                    <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Filtering…
                  </>
                ) : (
                  <>
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Apply Filters
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
