import { SetStateAction, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertCircle,
  PackageCheck,
  RefreshCw,
  Truck,
  Warehouse,
  Plus,
  BarChart3,
  TrendingUp,
} from 'lucide-react';
import { InventoryFilters } from '../features/inventory/components/InventoryFilters';
import { InventoryCardView } from '../features/inventory/components/InventoryCardView';
import { InventoryTable } from '../features/inventory/components/InventoryTable';
import { InventoryEditDrawer } from '../features/inventory/components/InventoryEditDrawer';
import { InventoryFilterDrawer } from '../features/inventory/components/InventoryFilterDrawer';
import { useInventory } from '../features/inventory/hooks/useInventory';
import { useVehicles } from '../features/vehicles/hooks/useVehicles';
import { useIsAdmin } from '../hooks/useIsAdmin';
import {
  InventoryFilterState,
  InventoryItemDTO,
} from '../features/inventory/types/inventory.types';
import { paths } from '../routes/paths';

// ── Filter defaults ────────────────────────────────────────────────────────

const DEFAULT_FILTERS: InventoryFilterState = {
  search: '',
  status: 'all',
  stockLevel: 'all',
  manufacturer: 'all',
  sortBy: 'updated-desc',
};

// ── Helpers ────────────────────────────────────────────────────────────────

function norm(str?: string | number | null): string {
  return String(str ?? '').toLowerCase().trim();
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

// ── Component ──────────────────────────────────────────────────────────────

export function InventoryPage() {
  const navigate = useNavigate();

  const isAdmin = useIsAdmin();

  // ── Data fetching ────────────────────────────────────────────────────────
  // useVehicles is the source of truth for imageUrl (Cloudinary), make, model, etc.
  // useInventory is the source of truth for stock quantity and availability.
  const {
    data: inventoryData,
    isLoading: isInventoryLoading,
    isError: isInventoryError,
    error: inventoryError,
    refetch: refetchInventory,
  } = useInventory();

  const {
    data: vehicles = [],
    isLoading: isVehiclesLoading,
    isError: isVehiclesError,
    error: vehiclesError,
    refetch: refetchVehicles,
  } = useVehicles();

  // ── Local state ──────────────────────────────────────────────────────────
  const [filters, setFilters] = useState<InventoryFilterState>(DEFAULT_FILTERS);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItemDTO | null>(null);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const isLoading = isInventoryLoading || isVehiclesLoading;
  const isError = isInventoryError || isVehiclesError;
  const error = inventoryError ?? vehiclesError;

  const inventoryItems = inventoryData?.items ?? [];

  // ── Merge vehicles + inventory ───────────────────────────────────────────
  // Vehicles from /v1/vehicles → source of truth for imageUrl, make, model etc.
  // Inventory items from /v1/inventory → source of truth for quantity/availability.
  //
  // Priority for quantity resolution:
  //   1. inventoryItems cache (patched immediately on stock update)
  //   2. vehicle.stockQuantity (patched into vehicles cache by useUpdateStock)
  //   3. Default 1
  const allItems = useMemo<InventoryItemDTO[]>(() => {
    if (vehicles.length === 0) return [];

    // Index inventory by vehicleId for O(1) lookup
    const stockByVehicleId = new Map(
      inventoryItems.map((item) => [item.vehicleId, item])
    );

    return vehicles.map((vehicle) => {
      const stockItem = stockByVehicleId.get(vehicle.id);

      // Use the inventory cache quantity as the primary source.
      // Fall back to stockQuantity patched onto the vehicle cache entry,
      // then to 1 for brand-new vehicles with no inventory record yet.
      const quantity =
        typeof stockItem?.quantity === 'number'
          ? stockItem.quantity
          : typeof (vehicle as any).stockQuantity === 'number'
          ? (vehicle as any).stockQuantity
          : 1;

      // Derive availability from quantity so it stays consistent
      const available =
        typeof stockItem?.available === 'boolean'
          ? stockItem.available
          : quantity > 0;

      const reserved = stockItem?.reserved ?? false;
      const createdAt = stockItem?.createdAt ?? vehicle.createdAt;
      const updatedAt = stockItem?.updatedAt ?? vehicle.updatedAt;

      return {
        id: stockItem?.id ?? vehicle.id,
        vehicleId: vehicle.id,
        vehicle,
        quantity,
        available,
        reserved,
        createdAt,
        updatedAt,
      } satisfies InventoryItemDTO;
    });
  }, [inventoryItems, vehicles]);

  // ── Derived filter options ───────────────────────────────────────────────
  const manufacturers = useMemo(() => {
    const makes = new Set<string>();
    allItems.forEach((item) => {
      const make = item.vehicle?.make;
      if (make) makes.add(make);
    });
    return Array.from(makes).sort();
  }, [allItems]);

  // ── Filtered + sorted items ──────────────────────────────────────────────
  const filteredItems = useMemo(() => {
    return allItems
      .filter((item) => {
        const v = item.vehicle;
        const make = v?.make ?? '';
        const model = v?.model ?? '';
        const vin = v?.vin ?? '';
        const year = v?.year ?? '';
        const q = norm(filters.search);

        // Text search
        if (q) {
          const haystack = [make, model, vin, String(year), item.vehicleId]
            .map(norm)
            .join(' ');
          if (!haystack.includes(q)) return false;
        }

        // Availability status
        if (filters.status !== 'all') {
          if (filters.status === 'available' && !item.available) return false;
          if (filters.status === 'unavailable' && item.available) return false;
          if (filters.status === 'reserved' && !item.reserved) return false;
          if (filters.status === 'low-stock' && item.quantity > 3) return false;
        }

        // Stock level
        if (filters.stockLevel !== 'all') {
          if (filters.stockLevel === 'in-stock' && item.quantity <= 0) return false;
          if (filters.stockLevel === 'out-of-stock' && item.quantity > 0) return false;
          if (filters.stockLevel === 'low-stock' && (item.quantity <= 0 || item.quantity > 3))
            return false;
        }

        // Manufacturer
        if (
          filters.manufacturer !== 'all' &&
          norm(make) !== norm(filters.manufacturer)
        )
          return false;

        return true;
      })
      .sort((a, b) => {
        const av = a.vehicle;
        const bv = b.vehicle;
        switch (filters.sortBy) {
          case 'price-asc':
            return (av?.price ?? 0) - (bv?.price ?? 0);
          case 'price-desc':
            return (bv?.price ?? 0) - (av?.price ?? 0);
          case 'name-asc': {
            const aName = `${av?.make} ${av?.model}`;
            const bName = `${bv?.make} ${bv?.model}`;
            return aName.localeCompare(bName);
          }
          case 'name-desc': {
            const aName = `${av?.make} ${av?.model}`;
            const bName = `${bv?.make} ${bv?.model}`;
            return bName.localeCompare(aName);
          }
          case 'quantity-asc':
            return a.quantity - b.quantity;
          case 'quantity-desc':
            return b.quantity - a.quantity;
          case 'updated-desc':
          default:
            return (
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
            );
        }
      });
  }, [allItems, filters]);

  // ── Stats ────────────────────────────────────────────────────────────────
  const totalVehicles = inventoryData?.totalVehicles ?? allItems.length;
  const availableVehicles =
    inventoryData?.availableVehicles ?? allItems.filter((i) => i.available).length;
  const totalStock = allItems.reduce((sum, i) => sum + i.quantity, 0);
  const totalValue = allItems.reduce(
    (sum, i) => sum + (i.vehicle?.price ?? 0) * i.quantity,
    0
  );

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleEditItem = (item: InventoryItemDTO) => {
    setEditingItem(item);
    setIsEditDrawerOpen(true);
  };

  const handleRefetch = () => {
    refetchInventory();
    refetchVehicles();
  };

  // ── Error state ──────────────────────────────────────────────────────────
  if (isError && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500">
          <AlertCircle className="h-8 w-8" />
        </div>
        <div className="text-center">
          <h2 className="text-lg font-bold text-slate-900">Failed to load inventory</h2>
          <p className="mt-1 text-sm text-slate-500 max-w-sm">
            {(error as any)?.message ?? 'An unexpected error occurred. Please try again.'}
          </p>
        </div>
        <button
          type="button"
          onClick={handleRefetch}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-[#55E6D9] hover:bg-slate-800 transition-all"
        >
          <RefreshCw className="h-4 w-4" />
          Retry
        </button>
      </div>
    );
  }

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="space-y-8">

      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Inventory
            </h1>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/10 px-3 py-1 text-xs font-semibold text-teal-700 border border-teal-500/20">
              <BarChart3 className="h-3.5 w-3.5" />
              Stock Management
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">
            Manage vehicle stock levels, availability, and dealership inventory status.
          </p>
        </div>

        {/* Header CTA — admin only */}
        {isAdmin && (
        <button
          type="button"
          onClick={() => navigate(paths.vehiclesNew)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-[#55E6D9] shadow-md hover:bg-slate-800 transition-all shrink-0"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          Add Vehicle
        </button>
        )}
      </div>

      {/* ── Stats Row ───────────────────────────────────────────────────── */}
      <AnimatePresence>
        {!isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 gap-4 sm:grid-cols-4"
          >
            <StatCard
              icon={<Warehouse className="h-5 w-5" />}
              label="Total Vehicles"
              value={totalVehicles}
              accent="slate"
            />
            <StatCard
              icon={<PackageCheck className="h-5 w-5" />}
              label="Available"
              value={availableVehicles}
              accent="teal"
            />
            <StatCard
              icon={<Truck className="h-5 w-5" />}
              label="Total Stock"
              value={totalStock}
              accent="slate"
            />
            <StatCard
              icon={<TrendingUp className="h-5 w-5" />}
              label="Inventory Value"
              value={formatCurrency(totalValue)}
              accent="teal"
              isString
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Filters Bar ─────────────────────────────────────────────────── */}
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
        onAddVehicle={() => navigate(paths.vehiclesNew)}
      />

      {/* ── Results count ───────────────────────────────────────────────── */}
      {!isLoading && (
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-slate-500">
            Showing{' '}
            <span className="font-bold text-slate-900">{filteredItems.length}</span>{' '}
            of{' '}
            <span className="font-bold text-slate-900">{allItems.length}</span>{' '}
            vehicles
            {filters.search && (
              <span className="text-slate-400">
                {' '}for &ldquo;{filters.search}&rdquo;
              </span>
            )}
          </p>

          {(filters.search ||
            filters.status !== 'all' ||
            filters.stockLevel !== 'all' ||
            filters.manufacturer !== 'all') && (
            <button
              type="button"
              onClick={() => setFilters(DEFAULT_FILTERS)}
              className="text-xs font-bold text-slate-400 hover:text-teal-600 transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* ── Card / Table View ───────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {viewMode === 'grid' ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <InventoryCardView
              items={filteredItems}
              isLoading={isLoading}
              onEditItem={handleEditItem}
            />
          </motion.div>
        ) : (
          <motion.div
            key="table"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <InventoryTable
              items={filteredItems}
              isLoading={isLoading}
              onEditItem={handleEditItem}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Edit Drawer ─────────────────────────────────────────────────── */}
      {isEditDrawerOpen && editingItem && (
        <InventoryEditDrawer
          item={editingItem}
          isOpen={isEditDrawerOpen}
          onClose={() => {
            setIsEditDrawerOpen(false);
            setEditingItem(null);
          }}
          onSuccess={() => {
            setIsEditDrawerOpen(false);
            setEditingItem(null);
            refetchInventory();
            refetchVehicles();
          }}
        />
      )}

      {/* ── Filter Drawer ───────────────────────────────────────────────── */}
      {isFilterDrawerOpen && (
        <InventoryFilterDrawer
          filters={filters}
          onChange={setFilters}
          manufacturers={manufacturers}
          totalCount={allItems.length}
          filteredCount={filteredItems.length}
          isOpen={isFilterDrawerOpen}
          onClose={() => setIsFilterDrawerOpen(false)}
        />
      )}
    </div>
  );
}

// ── StatCard sub-component ─────────────────────────────────────────────────

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  accent: 'slate' | 'teal';
  isString?: boolean;
}

function StatCard({ icon, label, value, accent }: StatCardProps) {
  const isTeal = accent === 'teal';
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
      <div
        className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl ${
          isTeal
            ? 'bg-[#55E6D9]/15 text-teal-700'
            : 'bg-slate-100 text-slate-600'
        }`}
      >
        {icon}
      </div>
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-black tracking-tight text-slate-900">{value}</p>
      {isTeal && (
        <div className="absolute right-0 top-0 h-full w-1 rounded-r-2xl bg-[#55E6D9]" />
      )}
    </div>
  );
}
