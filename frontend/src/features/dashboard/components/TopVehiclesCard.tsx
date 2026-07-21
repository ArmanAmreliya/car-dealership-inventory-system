/**
 * TopVehiclesCard Component
 *
 * Dashboard card listing the top-N vehicles by price from the current
 * fleet, enriched with live inventory stock data.
 *
 * "Top vehicles" is defined as highest-priced vehicles in the fleet
 * — a practical overview for sales staff in the absence of a purchase
 * history API endpoint.
 *
 * Each row shows rank, vehicle name, price, stock badge, and a
 * navigation link to the vehicle detail page.
 */

import { useNavigate } from 'react-router-dom';
import { useDashboard } from '../hooks/useDashboard';
import { useInventory } from '../../inventory/hooks/useInventory';
import {
  buildTopVehicles,
  TopVehicleRow,
  formatRevenue,
} from '../utils/dashboard.utils';
import { paths } from '../../../routes/paths';

// ── Skeleton ───────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="animate-pulse rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-5 py-4">
        <div className="h-5 w-36 rounded bg-gray-200" />
      </div>
      <ul className="divide-y divide-gray-100 px-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <li key={i} className="flex items-center justify-between gap-3 py-3">
            <div className="flex items-center gap-3">
              <div className="h-6 w-6 rounded-full bg-gray-200" />
              <div className="space-y-1">
                <div className="h-3.5 w-36 rounded bg-gray-200" />
                <div className="h-3 w-20 rounded bg-gray-100" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-5 w-16 rounded-full bg-gray-200" />
              <div className="h-4 w-14 rounded bg-gray-200" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Status badge ───────────────────────────────────────────────────────────

const STATUS_STYLE: Record<
  TopVehicleRow['status'],
  { label: string; classes: string; dot: string }
> = {
  available: {
    label: 'Available',
    classes: 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20',
    dot: 'bg-green-500',
  },
  'low-stock': {
    label: 'Low Stock',
    classes: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20',
    dot: 'bg-amber-500',
  },
  unavailable: {
    label: 'Unavailable',
    classes: 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20',
    dot: 'bg-red-500',
  },
};

function StatusBadge({ status }: { status: TopVehicleRow['status'] }) {
  const { label, classes, dot } = STATUS_STYLE[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${classes}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} aria-hidden="true" />
      {label}
    </span>
  );
}

// ── Rank badge ─────────────────────────────────────────────────────────────

const RANK_STYLE: Record<number, string> = {
  1: 'bg-yellow-100 text-yellow-800 ring-1 ring-inset ring-yellow-400/40',
  2: 'bg-gray-100 text-gray-600 ring-1 ring-inset ring-gray-300',
  3: 'bg-orange-50 text-orange-700 ring-1 ring-inset ring-orange-300',
};

function RankBadge({ rank }: { rank: number }) {
  const style =
    RANK_STYLE[rank] ?? 'bg-gray-50 text-gray-400 ring-1 ring-inset ring-gray-200';
  return (
    <span
      className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${style}`}
      aria-label={`Rank ${rank}`}
    >
      {rank}
    </span>
  );
}

// ── Row ────────────────────────────────────────────────────────────────────

interface RowProps {
  row: TopVehicleRow;
  onNavigate: (vehicleId: string) => void;
}

function VehicleRow({ row, onNavigate }: RowProps) {
  return (
    <li className="flex items-center justify-between gap-3 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <RankBadge rank={row.rank} />
        <div className="min-w-0">
          <button
            type="button"
            onClick={() => onNavigate(row.vehicleId)}
            className="truncate text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors text-left"
          >
            {row.label}
          </button>
          <p className="text-xs text-gray-400">
            {row.stockQuantity} unit{row.stockQuantity !== 1 ? 's' : ''} in stock
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <StatusBadge status={row.status} />
        <span className="text-sm font-semibold text-green-700">
          {formatRevenue(row.price)}
        </span>
      </div>
    </li>
  );
}

// ── Empty state ────────────────────────────────────────────────────────────

function EmptyState() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center px-5 py-10 text-center">
      <svg
        className="mb-3 h-10 w-10 text-gray-300"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
      <p className="text-sm font-medium text-gray-700">No vehicles yet</p>
      <button
        type="button"
        onClick={() => navigate(paths.vehiclesNew)}
        className="mt-3 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 transition-colors"
      >
        Add Vehicle
      </button>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

interface TopVehiclesCardProps {
  /** Max rows to display (default 5) */
  limit?: number;
  /** Optional wrapper className */
  className?: string;
}

/**
 * TopVehiclesCard
 *
 * Shows the top-N highest-priced vehicles with live inventory status.
 * Reads from the useDashboard cache — no extra API calls.
 * Each row links to the vehicle detail page.
 *
 * @example
 * ```tsx
 * <TopVehiclesCard limit={5} className="mb-6" />
 * ```
 */
export function TopVehiclesCard({
  limit = 5,
  className = '',
}: TopVehiclesCardProps) {
  const navigate = useNavigate();
  const { vehicles, isLoading } = useDashboard();
  const { data: inventoryData } = useInventory();

  if (isLoading) return <Skeleton />;

  const rows = buildTopVehicles(
    vehicles,
    inventoryData?.items ?? [],
    limit
  );

  return (
    <div
      className={`flex flex-col rounded-lg border border-gray-200 bg-white shadow-sm ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-700">
            Top Vehicles by Value
          </h3>
          <p className="mt-0.5 text-xs text-gray-400">Highest-priced fleet vehicles</p>
        </div>
        <button
          type="button"
          onClick={() => navigate(paths.vehicles)}
          className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
        >
          View all →
        </button>
      </div>

      {/* Rows or empty state */}
      {rows.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <ul className="divide-y divide-gray-100 px-5">
            {rows.map((row) => (
              <VehicleRow
                key={row.vehicleId}
                row={row}
                onNavigate={(id) => navigate(paths.vehicleDetail(id))}
              />
            ))}
          </ul>

          {/* Footer note */}
          <div className="rounded-b-lg border-t border-gray-100 bg-gray-50 px-5 py-2.5">
            <p className="text-xs text-gray-400">
              Ranked by list price · {vehicles.length} vehicles in fleet
            </p>
          </div>
        </>
      )}
    </div>
  );
}
