/**
 * VehicleFilterBar Component — Premium Enterprise Edition
 *
 * An inline search + filter strip inspired by Linear's command bar.
 * Features:
 *   - Prominent search input with magnifying glass icon
 *   - Collapsible advanced filters (Make, Model, Year, Price range, Availability)
 *   - Active filter pills with individual clear
 *   - Smooth expand/collapse animation
 */

import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { VehicleFilters } from '../types/vehicle.types';

interface VehicleFilterBarProps {
  onFiltersChange: (filters: VehicleFilters) => void;
  isLoading?: boolean;
}

function cleanFilters(raw: Record<string, unknown>): VehicleFilters {
  return Object.fromEntries(
    Object.entries(raw).filter(([, v]) => {
      if (v === '' || v === null || v === undefined) return false;
      if (typeof v === 'number' && isNaN(v)) return false;
      return true;
    })
  ) as VehicleFilters;
}

function countActiveFilters(filters: VehicleFilters): number {
  return Object.values(filters).filter(
    (v) => v !== undefined && v !== null && v !== ''
  ).length;
}

export function VehicleFilterBar({ onFiltersChange, isLoading = false }: VehicleFilterBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeFilters, setActiveFilters] = useState<VehicleFilters>({});
  const [searchQuery, setSearchQuery] = useState('');

  const { register, handleSubmit, reset, setValue, watch } = useForm<VehicleFilters>({
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

  const handleReset = useCallback(() => {
    reset({
      make: '',
      model: '',
      year: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      availability: undefined,
    });
    setActiveFilters({});
    setSearchQuery('');
    onFiltersChange({});
  }, [reset, onFiltersChange]);

  const removeFilter = (key: keyof VehicleFilters) => {
    const updated = { ...activeFilters };
    delete updated[key];
    setActiveFilters(updated);
    setValue(key, undefined as never);
    onFiltersChange(updated);
  };

  const activeCount = countActiveFilters(activeFilters);

  // Input styling
  const inputCls =
    'block w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:outline-none disabled:bg-slate-100 disabled:text-slate-400';

  const labelCls = 'block text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1.5';

  return (
    <div className="mb-6 space-y-3">
      {/* Search bar row */}
      <div className="flex items-center gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <svg
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            placeholder="Search by make, model, or VIN..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              const val = e.target.value.trim();
              if (val) {
                onFiltersChange({ ...activeFilters, make: val });
              } else {
                onFiltersChange(activeFilters);
              }
            }}
            disabled={isLoading}
            className="block w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 focus:outline-none disabled:bg-slate-50 disabled:text-slate-400"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                onFiltersChange(activeFilters);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="Clear search"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Filter toggle button */}
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          className={`inline-flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${
            isExpanded || activeCount > 0
              ? 'border-blue-200 bg-blue-50 text-blue-700 shadow-sm'
              : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300 shadow-sm'
          }`}
          aria-expanded={isExpanded}
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
          </svg>
          Filters
          {activeCount > 0 && (
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
              {activeCount}
            </span>
          )}
        </button>
      </div>

      {/* Active filter pills */}
      {activeCount > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-slate-400">Active:</span>
          {Object.entries(activeFilters).map(([key, value]) => (
            <span
              key={key}
              className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/10"
            >
              <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>: {String(value)}
              <button
                type="button"
                onClick={() => removeFilter(key as keyof VehicleFilters)}
                className="ml-0.5 rounded-full p-0.5 hover:bg-blue-100 transition-colors"
                aria-label={`Remove ${key} filter`}
              >
                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))}
          <button
            type="button"
            onClick={handleReset}
            className="text-xs font-medium text-slate-500 hover:text-red-500 transition-colors"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Expandable advanced filters */}
      {isExpanded && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Make */}
            <div>
              <label htmlFor="filter-make" className={labelCls}>Make</label>
              <input
                id="filter-make"
                type="text"
                placeholder="e.g. Toyota"
                {...register('make')}
                disabled={isLoading}
                className={inputCls}
              />
            </div>

            {/* Model */}
            <div>
              <label htmlFor="filter-model" className={labelCls}>Model</label>
              <input
                id="filter-model"
                type="text"
                placeholder="e.g. Camry"
                {...register('model')}
                disabled={isLoading}
                className={inputCls}
              />
            </div>

            {/* Year */}
            <div>
              <label htmlFor="filter-year" className={labelCls}>Year</label>
              <input
                id="filter-year"
                type="number"
                placeholder="e.g. 2024"
                min={1886}
                max={new Date().getFullYear() + 2}
                {...register('year', { valueAsNumber: true })}
                disabled={isLoading}
                className={inputCls}
              />
            </div>

            {/* Min Price */}
            <div>
              <label htmlFor="filter-minPrice" className={labelCls}>Min Price ($)</label>
              <input
                id="filter-minPrice"
                type="number"
                placeholder="e.g. 10,000"
                min={0}
                {...register('minPrice', { valueAsNumber: true })}
                disabled={isLoading}
                className={inputCls}
              />
            </div>

            {/* Max Price */}
            <div>
              <label htmlFor="filter-maxPrice" className={labelCls}>Max Price ($)</label>
              <input
                id="filter-maxPrice"
                type="number"
                placeholder="e.g. 50,000"
                min={0}
                {...register('maxPrice', { valueAsNumber: true })}
                disabled={isLoading}
                className={inputCls}
              />
            </div>

            {/* Availability */}
            <div>
              <label htmlFor="filter-availability" className={labelCls}>Availability</label>
              <select
                id="filter-availability"
                {...register('availability')}
                disabled={isLoading}
                className={inputCls}
              >
                <option value="">Any</option>
                <option value="true">Available</option>
                <option value="false">Unavailable</option>
              </select>
            </div>
          </div>

          {/* Action row */}
          <div className="mt-5 flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={handleReset}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
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
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                  Apply Filters
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
