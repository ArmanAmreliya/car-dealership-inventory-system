import { motion, AnimatePresence } from 'framer-motion';
import { X, Filter, RotateCcw } from 'lucide-react';
import { InventoryFilterState } from '../types/inventory.types';

interface InventoryFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: InventoryFilterState;
  onChange: (filters: InventoryFilterState) => void;
  manufacturers: string[];
  totalCount: number;
  filteredCount: number;
}

export function InventoryFilterDrawer({
  isOpen,
  onClose,
  filters,
  onChange,
  manufacturers,
  totalCount,
  filteredCount,
}: InventoryFilterDrawerProps) {
  const handleReset = () => {
    onChange({
      search: filters.search,
      status: 'all',
      stockLevel: 'all',
      manufacturer: 'all',
      sortBy: 'updated-desc',
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-xs transition-opacity"
          />

          {/* Filter Popover/Drawer */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className="fixed top-24 right-8 z-50 w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 space-y-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-slate-700" />
                <h3 className="text-sm font-bold text-slate-900">Inventory Filters</h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
                >
                  <RotateCcw className="h-3 w-3" />
                  Reset
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Filter Controls */}
            <div className="space-y-4 text-xs font-semibold">
              {/* Manufacturer Filter */}
              <div>
                <label className="block text-slate-600 mb-1.5 font-bold uppercase tracking-wider text-[11px]">
                  Manufacturer / Brand
                </label>
                <select
                  value={filters.manufacturer}
                  onChange={(e) => onChange({ ...filters, manufacturer: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-900 focus:bg-white focus:border-[#55E6D9] focus:outline-none transition-all"
                >
                  <option value="all">All Makes ({manufacturers.length})</option>
                  {manufacturers.map((make) => (
                    <option key={make} value={make}>
                      {make}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-slate-600 mb-1.5 font-bold uppercase tracking-wider text-[11px]">
                  Availability Status
                </label>
                <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200/60">
                  <button
                    type="button"
                    onClick={() => onChange({ ...filters, status: 'all' })}
                    className={`py-1.5 rounded-lg text-center font-bold transition-all ${
                      filters.status === 'all'
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    All
                  </button>
                  <button
                    type="button"
                    onClick={() => onChange({ ...filters, status: 'available' })}
                    className={`py-1.5 rounded-lg text-center font-bold transition-all ${
                      filters.status === 'available'
                        ? 'bg-[#55E6D9] text-slate-950 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Available
                  </button>
                  <button
                    type="button"
                    onClick={() => onChange({ ...filters, status: 'reserved' })}
                    className={`py-1.5 rounded-lg text-center font-bold transition-all ${
                      filters.status === 'reserved'
                        ? 'bg-slate-900 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Sold
                  </button>
                </div>
              </div>

              {/* Stock Level Filter */}
              <div>
                <label className="block text-slate-600 mb-1.5 font-bold uppercase tracking-wider text-[11px]">
                  Stock Quantity Level
                </label>
                <select
                  value={filters.stockLevel}
                  onChange={(e) => onChange({ ...filters, stockLevel: e.target.value as any })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-900 focus:bg-white focus:border-[#55E6D9] focus:outline-none transition-all"
                >
                  <option value="all">All Stock Levels</option>
                  <option value="in-stock">In Stock (&gt; 3 units)</option>
                  <option value="low-stock">Low Stock (1 - 3 units)</option>
                  <option value="out-of-stock">Out of Stock (0 units)</option>
                </select>
              </div>

              {/* Sorting Option */}
              <div>
                <label className="block text-slate-600 mb-1.5 font-bold uppercase tracking-wider text-[11px]">
                  Sort By
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => onChange({ ...filters, sortBy: e.target.value as any })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-900 focus:bg-white focus:border-[#55E6D9] focus:outline-none transition-all"
                >
                  <option value="updated-desc">Newest Listings First</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="name-asc">Vehicle Name: A to Z</option>
                  <option value="quantity-desc">Stock Quantity: Highest</option>
                </select>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-xs">
              <span className="font-semibold text-slate-500">
                Showing <strong className="text-slate-900">{filteredCount}</strong> of {totalCount} vehicles
              </span>
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl bg-slate-900 px-4 py-2 font-bold text-[#55E6D9] hover:bg-slate-800 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
