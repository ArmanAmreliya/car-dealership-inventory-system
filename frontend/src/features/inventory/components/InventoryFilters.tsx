/**
 * InventoryFilters Component
 *
 * Client-side search and availability filter panel for the inventory table.
 * Unlike VehicleFilterBar (which sends params to the API), inventory filtering
 * is done locally against the already-fetched item list — the inventory
 * endpoint does not accept filter query params.
 *
 * Exposes:
 *   search       – free-text match against vehicle make/model/VIN/year
 *   availability – "all" | "available" | "low-stock" | "unavailable"
 */

import { useState } from 'react';
import { AvailabilityStatus } from '../types/inventory.types';

export type AvailabilityFilter = 'all' | AvailabilityStatus;

export interface InventoryFilterValues {
  search: string;
  availability: AvailabilityFilter;
}

interface InventoryFiltersProps {
  /** Current filter values (controlled) */
  filters: InventoryFilterValues;
  /** Called on every input change — parent holds state */
  onChange: (filters: InventoryFilterValues) => void;
  /** Disables inputs while data is loading */
  isLoading?: boolean;
  /** Total items before filtering, used in the result hint */
  totalItems?: number;
  /** Items after filtering, used in the result hint */
  filteredCount?: number;
}

const AVAILABILITY_OPTIONS: { value: AvailabilityFilter; label: string }[] = [
  { value: 'all', label: 'All statuses' },
  { value: 'available', label: 'Available' },
  { value: 'low-stock', label: 'Low Stock' },
  { value: 'unavailable', label: 'Unavailable' },
];

/**
 * InventoryFilters
 *
 * A compact horizontal filter row with:
 * - A search text input (debounce handled by the parent via onChange)
 * - An availability select
 * - A clear button that appears when any filter is active
 * - A soft result hint showing filtered/total counts
 *
 * @example
 * ```tsx
 * const [filters, setFilters] = useState<InventoryFilterValues>({
 *   search: '',
 *   availability: 'all',
 * });
 *
 * <InventoryFilters
 *   filters={filters}
 *   onChange={setFilters}
 *   isLoading={isLoading}
 *   totalItems={items.length}
 *   filteredCount={filtered.length}
 * />
 * ```
 */
export function InventoryFilters({
  filters,
  onChange,
  isLoading = false,
  totalItems,
  filteredCount,
}: InventoryFiltersProps) {
  const [expanded, setExpanded] = useState(true);

  const hasActiveFilter =
    filters.search.trim() !== '' || filters.availability !== 'all';

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filters, search: e.target.value });
  };

  const handleAvailabilityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...filters, availability: e.target.value as AvailabilityFilter });
  };

  const handleClear = () => {
    onChange({ search: '', availability: 'all' });
  };

  return (
    <div className="mb-4 rounded-lg border border-gray-200 bg-white shadow-sm">
      {/* Toggle header */}
      <button
        type="button"
        onClick={() => setExpanded((p) => !p)}
        className="flex w-full items-center justify-between px-5 py-3.5 text-left"
        aria-expanded={expanded}
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
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="text-sm font-medium text-gray-700">Search & Filter</span>
          {hasActiveFilter && (
            <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
              active
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {/* Result hint */}
          {totalItems !== undefined && filteredCount !== undefined && !isLoading && (
            <span className="text-xs text-gray-400">
              {filteredCount} / {totalItems}
            </span>
          )}
          <svg
            className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Collapsible body */}
      {expanded && (
        <div className="border-t border-gray-100 px-5 pb-4 pt-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            {/* Search input */}
            <div className="flex-1">
              <label htmlFor="inv-search" className="block text-sm font-medium text-gray-700">
                Search
              </label>
              <div className="relative mt-1">
                <svg
                  className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-gray-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  id="inv-search"
                  type="text"
                  value={filters.search}
                  onChange={handleSearchChange}
                  disabled={isLoading}
                  placeholder="Make, model, VIN, or year…"
                  className="block w-full rounded-md border border-gray-300 py-2 pl-9 pr-3 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400"
                />
              </div>
            </div>

            {/* Availability select */}
            <div className="sm:w-44">
              <label htmlFor="inv-availability" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                id="inv-availability"
                value={filters.availability}
                onChange={handleAvailabilityChange}
                disabled={isLoading}
                className="mt-1 block w-full rounded-md border border-gray-300 py-2 pl-3 pr-8 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400"
              >
                {AVAILABILITY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear button */}
            {hasActiveFilter && (
              <button
                type="button"
                onClick={handleClear}
                disabled={isLoading}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
