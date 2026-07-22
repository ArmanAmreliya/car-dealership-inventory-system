/**
 * InventoryPage Component
 *
 * Complete Enterprise SaaS Inventory Management module following
 * linear/stripe/vercel design philosophy:
 * - Header with title, short description, and primary action
 * - 6 Statistics Cards (Total, Available, Reserved, Low Stock, Out of Stock, Inventory Value)
 * - Search & Filter Card (Search, Status, Stock Level, Manufacturer, Sort, Reset)
 * - Production-ready Inventory Table with Pagination & Stock Management Actions
 * - Error boundary notice & loading state handling
 */

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { InventorySummary } from '../features/inventory/components/InventorySummary';
import { InventoryFilters } from '../features/inventory/components/InventoryFilters';
import { InventoryTable } from '../features/inventory/components/InventoryTable';
import { useInventory } from '../features/inventory/hooks/useInventory';
import { InventoryFilterState, InventoryItemDTO } from '../features/inventory/types/inventory.types';
import { paths } from '../routes/paths';
import { Plus, RefreshCw, AlertCircle } from 'lucide-react';

const DEFAULT_FILTERS: InventoryFilterState = {
  search: '',
  status: 'all',
  stockLevel: 'all',
  manufacturer: 'all',
  sortBy: 'updated-desc',
};

function norm(str?: string | null): string {
  return (str ?? '').toLowerCase().trim();
}

export function InventoryPage() {
  const navigate = useNavigate();
  const { data, isLoading, isError, error, refetch, isRefetching } = useInventory();
  const [filters, setFilters] = useState<InventoryFilterState>(DEFAULT_FILTERS);

  const allItems: InventoryItemDTO[] = data?.items ?? [];

  // Extract unique manufacturers for dropdown filter
  const manufacturers = useMemo(() => {
    const makes = new Set<string>();
    allItems.forEach((item) => {
      if (item.vehicle?.make) makes.add(item.vehicle.make);
    });
    return Array.from(makes).sort();
  }, [allItems]);

  // Client-side filtering & sorting
  const filteredItems = useMemo(() => {
    return allItems
      .filter((item) => {
        const v = item.vehicle;
        const q = norm(filters.search);

        // Search match
        if (q) {
          const haystack = [v?.make, v?.model, v?.vin, v?.year ? String(v.year) : null, item.vehicleId]
            .map(norm)
            .join(' ');
          if (!haystack.includes(q)) return false;
        }

        // Status match
        if (filters.status !== 'all') {
          if (filters.status === 'reserved' && !item.reserved) return false;
          if (filters.status === 'unavailable' && item.available && item.quantity > 0) return false;
          if (filters.status === 'available' && (!item.available || item.quantity <= 3)) return false;
          if (filters.status === 'low-stock' && (item.quantity === 0 || item.quantity > 3)) return false;
        }

        // Stock Level match
        if (filters.stockLevel !== 'all') {
          if (filters.stockLevel === 'in-stock' && item.quantity <= 3) return false;
          if (filters.stockLevel === 'low-stock' && (item.quantity === 0 || item.quantity > 3)) return false;
          if (filters.stockLevel === 'out-of-stock' && item.quantity > 0) return false;
        }

        // Manufacturer match
        if (filters.manufacturer !== 'all') {
          if (norm(v?.make) !== norm(filters.manufacturer)) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const vA = a.vehicle;
        const vB = b.vehicle;

        switch (filters.sortBy) {
          case 'name-asc':
            return `${vA?.make} ${vA?.model}`.localeCompare(`${vB?.make} ${vB?.model}`);
          case 'name-desc':
            return `${vB?.make} ${vB?.model}`.localeCompare(`${vA?.make} ${vA?.model}`);
          case 'price-asc':
            return (vA?.price ?? 0) - (vB?.price ?? 0);
          case 'price-desc':
            return (vB?.price ?? 0) - (vA?.price ?? 0);
          case 'quantity-asc':
            return a.quantity - b.quantity;
          case 'quantity-desc':
            return b.quantity - a.quantity;
          case 'updated-desc':
          default:
            return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        }
      });
  }, [allItems, filters]);

  return (
    <DashboardLayout pageTitle="Inventory Management">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="p-6 md:p-8 mx-auto max-w-[1400px] space-y-6"
      >
        {/* Header Section */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-slate-200/80 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Inventory Management</h1>
              <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600 border border-slate-200">
                Live Sync
              </span>
            </div>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Monitor vehicle stock levels, track valuation, adjust quantities, and review audit history logs.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isLoading || isRefetching}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 transition-all"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefetching ? 'animate-spin' : ''}`} />
              Refresh Data
            </button>

            <button
              type="button"
              onClick={() => navigate(paths.vehiclesNew)}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4.5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-700 transition-all"
            >
              <Plus className="h-4 w-4" />
              Add New Vehicle
            </button>
          </div>
        </div>

        {/* 6 Statistics Cards Grid */}
        <InventorySummary />

        {/* Error Alert */}
        {isError && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-800 flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
              <div>
                <p className="text-sm font-bold">Failed to load inventory data</p>
                <p className="text-xs text-rose-700 mt-0.5">
                  {(error as any)?.message || 'An unexpected error occurred while communicating with the API.'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => refetch()}
              className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-rose-700 transition-colors"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* Search & Filter Card */}
        {!isError && (
          <InventoryFilters
            filters={filters}
            onChange={setFilters}
            manufacturers={manufacturers}
            isLoading={isLoading}
            totalItems={allItems.length}
            filteredCount={filteredItems.length}
          />
        )}

        {/* Main Inventory Table with Pagination & Action Modals */}
        <InventoryTable items={filteredItems} isLoading={isLoading} />
      </motion.div>
    </DashboardLayout>
  );
}
