import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { InventoryFilters } from '../features/inventory/components/InventoryFilters';
import { InventoryCardView } from '../features/inventory/components/InventoryCardView';
import { InventoryTable } from '../features/inventory/components/InventoryTable';
import { InventoryEditDrawer } from '../features/inventory/components/InventoryEditDrawer';
import { InventoryFilterDrawer } from '../features/inventory/components/InventoryFilterDrawer';
import { useInventory } from '../features/inventory/hooks/useInventory';
import { InventoryFilterState, InventoryItemDTO } from '../features/inventory/types/inventory.types';
import { RefreshCw, AlertCircle } from 'lucide-react';

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
  const { data, isLoading, isError, error, refetch, isRefetching } = useInventory();
  const [filters, setFilters] = useState<InventoryFilterState>(DEFAULT_FILTERS);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Edit Drawer state
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItemDTO | null>(null);

  // Filter Drawer state
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const allItems: InventoryItemDTO[] = data?.items ?? [];

  // Unique manufacturers for filter
  const manufacturers = useMemo(() => {
    const makes = new Set<string>();
    allItems.forEach((item) => {
      const make = item.vehicle?.make || (item as any).make;
      if (make) makes.add(make);
    });
    return Array.from(makes).sort();
  }, [allItems]);

  // Client-side filtering & sorting
  const filteredItems = useMemo(() => {
    return allItems
      .filter((item) => {
        const v = item.vehicle;
        const make = v?.make || (item as any).make;
        const model = v?.model || (item as any).model;
        const vin = v?.vin || (item as any).vin;
        const year = v?.year || (item as any).year;
        const q = norm(filters.search);

        // Search match across VIN, Make, Model, Year
        if (q) {
          const haystack = [make, model, vin, year ? String(year) : null, item.vehicleId]
            .map(norm)
            .join(' ');
          if (!haystack.includes(q)) return false;
        }

        // Status match
        if (filters.status !== 'all') {
          if (filters.status === 'reserved' && !item.reserved) return false;
          if (filters.status === 'unavailable' && item.available && item.quantity > 0) return false;
          if (filters.status === 'available' && (!item.available || item.quantity <= 0)) return false;
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
          if (norm(make) !== norm(filters.manufacturer)) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const vA = a.vehicle;
        const vB = b.vehicle;
        const makeA = vA?.make || (a as any).make || '';
        const modelA = vA?.model || (a as any).model || '';
        const makeB = vB?.make || (b as any).make || '';
        const modelB = vB?.model || (b as any).model || '';
        const priceA = vA?.price ?? (a as any).price ?? 0;
        const priceB = vB?.price ?? (b as any).price ?? 0;

        switch (filters.sortBy) {
          case 'name-asc':
            return `${makeA} ${modelA}`.localeCompare(`${makeB} ${modelB}`);
          case 'name-desc':
            return `${makeB} ${modelB}`.localeCompare(`${makeA} ${modelA}`);
          case 'price-asc':
            return priceA - priceB;
          case 'price-desc':
            return priceB - priceA;
          case 'quantity-asc':
            return a.quantity - b.quantity;
          case 'quantity-desc':
            return b.quantity - a.quantity;
          case 'updated-desc':
          default:
            return new Date(b.updatedAt || Date.now()).getTime() - new Date(a.updatedAt || Date.now()).getTime();
        }
      });
  }, [allItems, filters]);

  const handleOpenEdit = (item: InventoryItemDTO) => {
    setEditingItem(item);
    setIsEditDrawerOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setIsEditDrawerOpen(true);
  };

  return (
    <DashboardLayout pageTitle="Vehicle Inventory Software">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="p-6 md:p-8 mx-auto max-w-[1600px] space-y-6"
      >
        {/* Top Header Section */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between pb-2">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-950">Inventory</h1>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Manage your vehicles, availability, and listings in one place.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isLoading || isRefetching}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 disabled:opacity-50 transition-all cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefetching ? 'animate-spin' : ''}`} />
              Sync Data
            </button>
          </div>
        </div>

        {/* Top Toolbar (Grid/List Toggle, Instant Search, Filter Trigger, Sort & Add Vehicle CTA) */}
        <InventoryFilters
          filters={filters}
          onChange={setFilters}
          manufacturers={manufacturers}
          isLoading={isLoading}
          totalItems={allItems.length}
          filteredCount={filteredItems.length}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onOpenFilterDrawer={() => setIsFilterDrawerOpen(true)}
          onAddVehicle={handleOpenAdd}
        />

        {/* Connection Error Notice */}
        {isError && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-rose-800 flex items-start justify-between gap-4 shadow-2xs">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
              <div>
                <p className="text-sm font-bold">Failed to load inventory dataset</p>
                <p className="text-xs text-rose-700 mt-0.5">
                  {(error as any)?.message || 'Could not communicate with the backend inventory service.'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => refetch()}
              className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Vehicle Showcase (Grid View as Default or Power-User List View) */}
        {!isError && (
          <AnimatePresence mode="wait">
            {viewMode === 'grid' ? (
              <motion.div
                key="grid-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <InventoryCardView
                  items={filteredItems}
                  isLoading={isLoading}
                  onEditItem={handleOpenEdit}
                />
              </motion.div>
            ) : (
              <motion.div
                key="table-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <InventoryTable
                  items={filteredItems}
                  isLoading={isLoading}
                  onEditItem={handleOpenEdit}
                />
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Right-Side Edit Drawer */}
        <InventoryEditDrawer
          isOpen={isEditDrawerOpen}
          onClose={() => setIsEditDrawerOpen(false)}
          item={editingItem}
          onSuccess={() => refetch()}
        />

        {/* Popover Filter Drawer */}
        <InventoryFilterDrawer
          isOpen={isFilterDrawerOpen}
          onClose={() => setIsFilterDrawerOpen(false)}
          filters={filters}
          onChange={setFilters}
          manufacturers={manufacturers}
          totalCount={allItems.length}
          filteredCount={filteredItems.length}
        />
      </motion.div>
    </DashboardLayout>
  );
}
