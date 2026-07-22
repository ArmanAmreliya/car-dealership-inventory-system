/**
 * VehiclesListPage — Premium Enterprise Edition
 *
 * Main page for browsing, filtering, and managing the vehicle inventory.
 * Features:
 *   - Stats header with vehicle count metrics
 *   - Premium search + filter bar
 *   - Sortable data table with skeleton loading
 *   - Delete confirmation dialog
 *   - Gradient "Add Vehicle" CTA
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { VehicleFilterBar } from '../features/vehicles/components/VehicleFilterBar';
import { VehicleTable } from '../features/vehicles/components/VehicleTable';
import { DeleteVehicleDialog } from '../features/vehicles/components/DeleteVehicleDialog';
import { useVehicles } from '../features/vehicles/hooks/useVehicles';
import { useDeleteVehicle } from '../features/vehicles/hooks/useVehicles';
import { VehicleFilters } from '../features/vehicles/types/vehicle.types';
import { VehicleDTO } from '../api/api';
import { paths } from '../routes/paths';

export function VehiclesListPage() {
  const navigate = useNavigate();

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

  const handleDeleteCancel = () => {
    setDeleteTarget(null);
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
    <DashboardLayout pageTitle="Vehicles">
      <div className="p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          {/* ── Page header ──────────────────────────────────────────────── */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Vehicle Inventory
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Manage your vehicle catalog — add, edit, or remove vehicles from your inventory.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate(paths.vehiclesNew)}
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:from-blue-700 hover:to-blue-800 hover:shadow-blue-500/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add Vehicle
            </button>
          </div>

          {/* ── Stats bar ────────────────────────────────────────────────── */}
          {!isLoading && !isError && totalVehicles > 0 && (
            <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
              <StatCard
                label="Total Vehicles"
                value={String(totalVehicles)}
                icon={
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                  </svg>
                }
                accent="blue"
              />
              <StatCard
                label="Avg. Price"
                value={formatCurrency(avgPrice)}
                icon={
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
                accent="emerald"
              />
              <StatCard
                label="Makes"
                value={String(uniqueMakes)}
                icon={
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                  </svg>
                }
                accent="violet"
              />
              <StatCard
                label="Newest Year"
                value={String(latestYear)}
                icon={
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                }
                accent="amber"
              />
            </div>
          )}

          {/* ── Filter bar ─────────────────────────────────────────────────── */}
          <VehicleFilterBar onFiltersChange={setFilters} isLoading={isLoading} />

          {/* ── Error state ────────────────────────────────────────────────── */}
          {isError && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100">
                  <svg className="h-5 w-5 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-red-800">Failed to load vehicles</h3>
                  <p className="mt-1 text-sm text-red-600">
                    {extractMessage(error) ?? 'An unexpected error occurred. Please try again.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => refetch()}
                  className="shrink-0 rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {/* ── Vehicle table ──────────────────────────────────────────────── */}
          <VehicleTable
            vehicles={vehicles}
            isLoading={isLoading}
            onDeleteRequest={handleDeleteRequest}
          />
        </div>
      </div>

      {/* ── Delete confirmation dialog ─────────────────────────────────────── */}
      {deleteTarget && (
        <DeleteVehicleDialog
          vehicleId={deleteTarget.id}
          vehicleDisplayName={`${deleteTarget.make} ${deleteTarget.model} (${deleteTarget.year})`}
          isOpen={true}
          isDeleting={isDeleting}
          error={extractMessage(deleteError)}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      )}
    </DashboardLayout>
  );
}

// ── Stat Card ────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  accent: 'blue' | 'emerald' | 'violet' | 'amber';
}

const accentStyles = {
  blue: {
    bg: 'bg-blue-50',
    icon: 'text-blue-500',
    ring: 'ring-blue-100',
  },
  emerald: {
    bg: 'bg-emerald-50',
    icon: 'text-emerald-500',
    ring: 'ring-emerald-100',
  },
  violet: {
    bg: 'bg-violet-50',
    icon: 'text-violet-500',
    ring: 'ring-violet-100',
  },
  amber: {
    bg: 'bg-amber-50',
    icon: 'text-amber-500',
    ring: 'ring-amber-100',
  },
};

function StatCard({ label, value, icon, accent }: StatCardProps) {
  const styles = accentStyles[accent];
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${styles.bg} ring-4 ${styles.ring}`}>
          <span className={styles.icon}>{icon}</span>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
          <p className="text-lg font-bold text-slate-900">{value}</p>
        </div>
      </div>
    </div>
  );
}
