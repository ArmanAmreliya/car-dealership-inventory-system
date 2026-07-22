import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { PlusCircle, Car, DollarSign, Layers, Calendar } from 'lucide-react';
import { VehicleFilterBar } from '../features/vehicles/components/VehicleFilterBar';
import { VehicleTable } from '../features/vehicles/components/VehicleTable';
import { VehicleGridCard } from '../features/vehicles/components/VehicleGridCard';
import { ViewToggle } from '../features/vehicles/components/ViewToggle';
import { VehicleEditDrawer } from '../features/vehicles/components/VehicleEditDrawer';
import { VehicleImageGalleryModal } from '../features/vehicles/components/VehicleImageGalleryModal';
import { DeleteVehicleDialog } from '../features/vehicles/components/DeleteVehicleDialog';

import { EmptyVehicles } from '../components/feedback/EmptyState';
import { useVehicles, useDeleteVehicle } from '../features/vehicles/hooks/useVehicles';
import { VehicleFilters } from '../features/vehicles/types/vehicle.types';
import { VehicleDTO } from '../api/api';
import { paths } from '../routes/paths';

export function VehiclesListPage() {
  const navigate = useNavigate();

  // ── View mode state ───────────────────────────────────────────────────────────
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(() => {
    try {
      return (localStorage.getItem('dealerflow_vehicles_view_mode') as 'grid' | 'list') || 'grid';
    } catch {
      return 'grid';
    }
  });

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode);
    try {
      localStorage.setItem('dealerflow_vehicles_view_mode', mode);
    } catch {
      // ignore
    }
  };

  // ── Edit Drawer & Gallery State ────────────────────────────────────────────
  const [editingVehicle, setEditingVehicle] = useState<VehicleDTO | null>(null);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [galleryVehicle, setGalleryVehicle] = useState<VehicleDTO | null>(null);

  // ── Filter state ────────────────────────────────────────────────────────────
  const [filters, setFilters] = useState<VehicleFilters>({});
  const { data: vehicles = [], isLoading, isError, error, refetch } = useVehicles(filters);

  // ── Delete dialog state ─────────────────────────────────────────────────────
  const [deleteTarget, setDeleteTarget] = useState<VehicleDTO | null>(null);
  const { mutate: deleteVehicle, isPending: isDeleting, error: deleteError } = useDeleteVehicle();

  const extractMessage = (err: unknown): string | null => {
    if (err == null) return null;
    const e = err as { response?: { data?: unknown }; message?: string };
    if (
      e.response?.data != null &&
      typeof e.response.data === 'object' &&
      'message' in (e.response.data as object)
    ) {
      return String((e.response.data as Record<string, unknown>).message);
    }
    return e.message ?? null;
  };

  const handleDeleteRequest = (vehicle: VehicleDTO) => {
    setDeleteTarget(vehicle);
  };

  const handleDeleteConfirm = (vehicleId: string) => {
    deleteVehicle(vehicleId, {
      onSuccess: () => {
        toast.success(
          deleteTarget
            ? `${deleteTarget.make} ${deleteTarget.model} deleted.`
            : 'Vehicle deleted.'
        );
        setDeleteTarget(null);
      },
    });
  };

  const handleEditQuick = (vehicle: VehicleDTO) => {
    setEditingVehicle(vehicle);
    setIsEditDrawerOpen(true);
  };

  // ── Derived stats ───────────────────────────────────────────────────────────
  const totalVehicles = vehicles.length;
  const avgPrice =
    totalVehicles > 0
      ? vehicles.reduce((sum, v) => sum + v.price, 0) / totalVehicles
      : 0;
  const uniqueMakes = new Set(vehicles.map((v) => v.make)).size;
  const latestYear = totalVehicles > 0 ? Math.max(...vehicles.map((v) => v.year)) : 0;

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Vehicle Fleet Catalogue
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            Manage, inspect, and update dealership vehicle inventory.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <ViewToggle mode={viewMode} onModeChange={handleViewModeChange} />
          <button
            type="button"
            onClick={() => navigate(paths.vehiclesNew)}
            className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-gradient-to-r from-teal-500 to-teal-600 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-teal-500/20 hover:from-teal-600 hover:to-teal-700 transition-all"
          >
            <PlusCircle className="h-4 w-4" />
            Add Vehicle
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      {!isLoading && !isError && totalVehicles > 0 && (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard
            label="Total Fleet"
            value={String(totalVehicles)}
            icon={<Car className="h-5 w-5 text-teal-600 dark:text-teal-400" />}
            bg="bg-teal-50 dark:bg-teal-950/50"
          />
          <StatCard
            label="Average Price"
            value={formatCurrency(avgPrice)}
            icon={<DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />}
            bg="bg-emerald-50 dark:bg-emerald-950/50"
          />
          <StatCard
            label="Manufacturers"
            value={String(uniqueMakes)}
            icon={<Layers className="h-5 w-5 text-purple-600 dark:text-purple-400" />}
            bg="bg-purple-50 dark:bg-purple-950/50"
          />
          <StatCard
            label="Latest Model Year"
            value={String(latestYear)}
            icon={<Calendar className="h-5 w-5 text-amber-600 dark:text-amber-400" />}
            bg="bg-amber-50 dark:bg-amber-950/50"
          />
        </div>
      )}

      {/* Filter Bar */}
      <VehicleFilterBar onFiltersChange={setFilters} isLoading={isLoading} />

      {/* Error Banner */}
      {isError && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 dark:border-rose-900/50 dark:bg-rose-950/40">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-rose-900 dark:text-rose-200">Failed to load vehicles</h3>
              <p className="mt-1 text-xs text-rose-700 dark:text-rose-300">
                {extractMessage(error) ?? 'An unexpected network error occurred.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => refetch()}
              className="rounded-xl border border-rose-200 bg-white px-4 py-2 text-xs font-bold text-rose-700 shadow-subtle hover:bg-rose-50"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Vehicle Display Area */}
      {viewMode === 'grid' ? (
        isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-3xl border border-slate-200 bg-white p-5 h-72 shadow-card dark:border-slate-800 dark:bg-slate-900/50" />
            ))}
          </div>
        ) : vehicles.length === 0 ? (
          <EmptyVehicles onAction={() => navigate(paths.vehiclesNew)} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle) => (
              <VehicleGridCard
                key={vehicle.id}
                vehicle={vehicle}
                onEditRequest={handleEditQuick}
                onInventoryRequest={() => navigate(paths.inventory)}
                onImageGalleryRequest={(v) => setGalleryVehicle(v)}
              />
            ))}
          </div>
        )
      ) : (
        <VehicleTable
          vehicles={vehicles}
          isLoading={isLoading}
          onDeleteRequest={handleDeleteRequest}
        />
      )}

      {/* Quick Edit Drawer with Enterprise Tabs */}
      <VehicleEditDrawer
        isOpen={isEditDrawerOpen}
        onClose={() => setIsEditDrawerOpen(false)}
        vehicle={editingVehicle || undefined}
        onOpenFullEdit={
          editingVehicle
            ? () => {
                setIsEditDrawerOpen(false);
                navigate(paths.vehicleEdit(editingVehicle.id));
              }
            : undefined
        }
      />

      {/* Fullscreen Photo Gallery Modal */}
      {galleryVehicle && (
        <VehicleImageGalleryModal
          isOpen={!!galleryVehicle}
          onClose={() => setGalleryVehicle(null)}
          vehicle={galleryVehicle}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {deleteTarget && (
        <DeleteVehicleDialog
          vehicleId={deleteTarget.id}
          vehicleDisplayName={`${deleteTarget.make} ${deleteTarget.model} (${deleteTarget.year})`}
          isOpen={true}
          isDeleting={isDeleting}
          error={extractMessage(deleteError)}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}

function StatCard({ label, value, icon, bg }: { label: string; value: string; icon: React.ReactNode; bg: string }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-card dark:border-slate-800 dark:bg-slate-900/60">
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${bg}`}>
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 truncate">{label}</p>
          <p className="text-base font-extrabold text-slate-900 dark:text-slate-100 truncate">{value}</p>
        </div>
      </div>
    </div>
  );
}

