/**
 * InventoryFilters Component
 *
 * Search & Filter Card supporting:
 * - Free text search across VIN, Manufacturer (Make), Model, Year
 * - Status filter (Available, Low Stock, Reserved, Out of Stock)
 * - Stock Level filter (In Stock, Low Stock, Out of Stock)
 * - Manufacturer (Make) dropdown filter
 * - Sorting controls (Price, Quantity, Name, Date Updated)
 * - Reset Filters button
 */

import { useState } from 'react';
import { InventoryFilterState, SortOption, StockLevelFilter } from '../types/inventory.types';
import { Search, RotateCcw, SlidersHorizontal, ChevronDown } from 'lucide-react';

interface InventoryFiltersProps {
  filters: InventoryFilterState;
  onChange: (filters: InventoryFilterState) => void;
  manufacturers: string[];
  isLoading?: boolean;
  totalItems?: number;
  filteredCount?: number;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'updated-desc', label: 'Recently Updated' },
  { value: 'name-asc', label: 'Name (A to Z)' },
  { value: 'name-desc', label: 'Name (Z to A)' },
  { value: 'price-desc', label: 'Price (High to Low)' },
  { value: 'price-asc', label: 'Price (Low to High)' },
  { value: 'quantity-desc', label: 'Quantity (High to Low)' },
  { value: 'quantity-asc', label: 'Quantity (Low to High)' },
];

export function InventoryFilters({
  filters,
  onChange,
  manufacturers,
  isLoading = false,
  totalItems,
  filteredCount,
}: InventoryFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const hasActiveFilters =
    filters.search.trim() !== '' ||
    filters.status !== 'all' ||
    filters.stockLevel !== 'all' ||
    filters.manufacturer !== 'all' ||
    filters.sortBy !== 'updated-desc';

  const handleReset = () => {
    onChange({
      search: '',
      status: 'all',
      stockLevel: 'all',
      manufacturer: 'all',
      sortBy: 'updated-desc',
    });
  };

  return (
    <div className="mb-6 overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-xs">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
            <SlidersHorizontal className="h-4 w-4" />
          </div>
          <span className="text-sm font-semibold text-slate-900">Search & Filter</span>
          {hasActiveFilters && (
            <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 border border-blue-200/60">
              Active Filters
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {totalItems !== undefined && filteredCount !== undefined && !isLoading && (
            <span className="text-xs font-medium text-slate-500">
              Showing <span className="font-semibold text-slate-900">{filteredCount}</span> of{' '}
              <span className="font-semibold text-slate-900">{totalItems}</span>
            </span>
          )}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleReset}
              disabled={isLoading}
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
            >
              <RotateCcw className="h-3 w-3" />
              Reset Filters
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            aria-expanded={isExpanded}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter Body */}
      {isExpanded && (
        <div className="p-5 space-y-4">
          {/* Top Row: Search */}
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => onChange({ ...filters, search: e.target.value })}
              disabled={isLoading}
              placeholder="Search by VIN, Manufacturer, Model, or Year..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50"
            />
          </div>

          {/* Filter Grid */}
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
            {/* Status */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">Status</label>
              <select
                value={filters.status}
                onChange={(e) => onChange({ ...filters, status: e.target.value as any })}
                disabled={isLoading}
                className="w-full rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs font-medium text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="all">All Statuses</option>
                <option value="available">Available</option>
                <option value="low-stock">Low Stock</option>
                <option value="reserved">Reserved</option>
                <option value="unavailable">Out of Stock</option>
              </select>
            </div>

            {/* Stock Level */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">Stock Level</label>
              <select
                value={filters.stockLevel}
                onChange={(e) => onChange({ ...filters, stockLevel: e.target.value as StockLevelFilter })}
                disabled={isLoading}
                className="w-full rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs font-medium text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="all">All Stock Levels</option>
                <option value="in-stock">In Stock (&gt; 3 units)</option>
                <option value="low-stock">Low Stock (1 - 3 units)</option>
                <option value="out-of-stock">Out of Stock (0 units)</option>
              </select>
            </div>

            {/* Manufacturer */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">Manufacturer</label>
              <select
                value={filters.manufacturer}
                onChange={(e) => onChange({ ...filters, manufacturer: e.target.value })}
                disabled={isLoading}
                className="w-full rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs font-medium text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="all">All Manufacturers</option>
                {manufacturers.map((make) => (
                  <option key={make} value={make}>
                    {make}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">Sort By</label>
              <select
                value={filters.sortBy}
                onChange={(e) => onChange({ ...filters, sortBy: e.target.value as SortOption })}
                disabled={isLoading}
                className="w-full rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs font-medium text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
