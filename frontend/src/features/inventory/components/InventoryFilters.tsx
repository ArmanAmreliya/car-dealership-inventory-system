import { Search, Filter, Plus, LayoutGrid, List } from 'lucide-react';
import { InventoryFilterState } from '../types/inventory.types';

interface InventoryFiltersProps {
  filters: InventoryFilterState;
  onChange: (filters: InventoryFilterState) => void;
  manufacturers: string[];
  isLoading?: boolean;
  totalItems: number;
  filteredCount: number;
  viewMode: 'grid' | 'table';
  onViewModeChange: (mode: 'grid' | 'table') => void;
  onOpenFilterDrawer: () => void;
  onAddVehicle: () => void;
}

export function InventoryFilters({
  filters,
  onChange,
  viewMode,
  onViewModeChange,
  onOpenFilterDrawer,
  onAddVehicle,
}: InventoryFiltersProps) {
  const activeFiltersCount =
    (filters.manufacturer !== 'all' ? 1 : 0) +
    (filters.status !== 'all' ? 1 : 0) +
    (filters.stockLevel !== 'all' ? 1 : 0);

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-white rounded-2xl p-3 border border-slate-200 shadow-2xs">
      {/* Left: View Mode Toggle + Search Bar */}
      <div className="flex items-center gap-3 flex-1">
        {/* Grid / List Switcher */}
        <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200/60 shrink-0">
          <button
            type="button"
            onClick={() => onViewModeChange('grid')}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
              viewMode === 'grid'
                ? 'bg-slate-900 text-[#55E6D9] shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            Grid
          </button>

          <button
            type="button"
            onClick={() => onViewModeChange('table')}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
              viewMode === 'table'
                ? 'bg-slate-900 text-[#55E6D9] shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <List className="h-3.5 w-3.5" />
            List
          </button>
        </div>

        {/* Always Visible Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search make, model, year, VIN..."
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-4 py-2 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#55E6D9] focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* Right: Filters Button, Sort Selector & Add Vehicle CTA */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Filter Drawer Trigger */}
        <button
          type="button"
          onClick={onOpenFilterDrawer}
          className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-bold transition-all shadow-2xs ${
            activeFiltersCount > 0
              ? 'border-slate-900 bg-slate-900 text-[#55E6D9]'
              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Filter className="h-3.5 w-3.5" />
          <span>Filters</span>
          {activeFiltersCount > 0 && (
            <span className="ml-0.5 rounded-full bg-[#55E6D9] px-1.5 py-0.2 text-[10px] font-black text-slate-950">
              {activeFiltersCount}
            </span>
          )}
        </button>

        {/* Sort Selector */}
        <select
          value={filters.sortBy}
          onChange={(e) => onChange({ ...filters, sortBy: e.target.value as any })}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-2xs focus:border-[#55E6D9] focus:outline-none transition-all cursor-pointer"
        >
          <option value="updated-desc">Newest</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="name-asc">Make/Model: A-Z</option>
          <option value="quantity-desc">Stock: Highest</option>
        </select>

        {/* Primary CTA: + Add Vehicle */}
        <button
          type="button"
          onClick={onAddVehicle}
          className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-[#55E6D9] shadow-md hover:bg-slate-800 transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          <span>Add Vehicle</span>
        </button>
      </div>
    </div>
  );
}
