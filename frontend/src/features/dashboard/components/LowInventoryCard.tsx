/**
 * LowInventoryCard Component
 *
 * Dashboard card listing vehicles that need immediate stock attention.
 * Reads from the inventory cache via useDashboard's alertItems —
 * no extra API call.
 *
 * Shows out-of-stock items first (red), then low-stock (amber).
 * Provides a direct link to the Inventory page for restocking.
 */

import { useNavigate } from 'react-router-dom';
import { InventoryItemDTO } from '../../inventory/types/inventory.types';
import { getItemStatus, getVehicleLabel } from '../../inventory/utils/inventory.utils';
import { StockBadge } from '../../inventory/components/StockBadge';
import { paths } from '../../../routes/paths';

// ── Types ──────────────────────────────────────────────────────────────────

interface LowInventoryCardProps {
  /** Alert items returned by getAlertItems() — sorted most urgent first */
  alertItems: InventoryItemDTO[];
  isLoading?: boolean;
  /** Max rows to show before "View all" footer (default 5) */
  maxVisible?: number;
}

// ── Skeleton ───────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="animate-pulse rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-5 py-4">
        <div className="h-5 w-40 rounded bg-gray-200" />
      </div>
      <ul className="divide-y divide-gray-100 px-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <li key={i} className="flex items-center justify-between gap-3 py-3">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-gray-200" />
              <div className="space-y-1">
                <div className="h-3.5 w-40 rounded bg-gray-200" />
                <div className="h-3 w-24 rounded bg-gray-100" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-5 w-20 rounded-full bg-gray-200" />
              <div className="h-5 w-8 rounded bg-gray-200" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Row ────────────────────────────────────────────────────────────────────

interface RowProps {
  item: InventoryItemDTO;
  onNavigate: (vehicleId: string) => void;
}

function AlertRow({ item, onNavigate }: RowProps) {
  const label = getVehicleLabel(item);
  const status = getItemStatus(item);
  const isOutOfStock = item.quantity === 0;

  return (
    <li className="flex items-center justify-between gap-3 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <span
          className={`h-2 w-2 shrink-0 rounded-full ${
            isOutOfStock ? 'bg-red-500' : 'bg-amber-500'
          }`}
          aria-hidden="true"
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-gray-900">{label}</p>
          {item.vehicle && (
            <p className="truncate font-mono text-xs text-gray-400">
              {item.vehicle.vin}
            </p>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <StockBadge quantity={item.quantity} available={item.available} />
        <span className="w-8 text-right text-sm font-semibold text-gray-700">
          {item.quantity}
        </span>
        {item.vehicle && (
          <button
            type="button"
            onClick={() => onNavigate(item.vehicleId)}
            className="rounded p-1 text-gray-400 hover:text-blue-600 transition-colors"
            aria-label={`View ${label}`}
            title="View vehicle"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </button>
        )}
      </div>
    </li>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

/**
 * LowInventoryCard
 *
 * Dashboard card showing the most urgent stock alerts.
 * Renders a "All clear" state when no items need attention.
 *
 * @example
 * ```tsx
 * <LowInventoryCard alertItems={alertItems} isLoading={isLoading} />
 * ```
 */
export function LowInventoryCard({
  alertItems,
  isLoading = false,
  maxVisible = 5,
}: LowInventoryCardProps) {
  const navigate = useNavigate();

  if (isLoading) return <Skeleton />;

  const visible = alertItems.slice(0, maxVisible);
  const hiddenCount = alertItems.length - visible.length;
  const outOfStockCount = alertItems.filter((i) => i.quantity === 0).length;
  const hasAlerts = alertItems.length > 0;

  return (
    <div className="flex flex-col rounded-lg border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
        <div className="flex items-center gap-2">
          {hasAlerts && (
            <span
              className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold text-white ${
                outOfStockCount > 0 ? 'bg-red-500' : 'bg-amber-500'
              }`}
              aria-label={`${alertItems.length} alerts`}
            >
              {alertItems.length}
            </span>
          )}
          <h3 className="text-sm font-semibold text-gray-900">
            {hasAlerts ? 'Stock Alerts' : 'Stock Status'}
          </h3>
        </div>
        <button
          type="button"
          onClick={() => navigate(paths.inventory)}
          className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
        >
          Manage →
        </button>
      </div>

      {/* Content */}
      {!hasAlerts ? (
        /* All-clear state */
        <div className="flex flex-1 flex-col items-center justify-center px-5 py-8 text-center">
          <svg
            className="mb-3 h-10 w-10 text-green-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm font-medium text-gray-700">All stock levels are healthy</p>
          <p className="mt-1 text-xs text-gray-400">No vehicles need immediate attention.</p>
        </div>
      ) : (
        <>
          <ul className="divide-y divide-gray-100 px-5">
            {visible.map((item) => (
              <AlertRow
                key={item.id}
                item={item}
                onNavigate={(id) => navigate(paths.vehicleDetail(id))}
              />
            ))}
          </ul>

          {hiddenCount > 0 && (
            <button
              type="button"
              onClick={() => navigate(paths.inventory)}
              className="rounded-b-lg border-t border-gray-100 bg-gray-50 px-5 py-2.5 text-left text-xs font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            >
              +{hiddenCount} more item{hiddenCount !== 1 ? 's' : ''} need attention →
            </button>
          )}
        </>
      )}
    </div>
  );
}
