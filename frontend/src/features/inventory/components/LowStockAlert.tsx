/**
 * LowStockAlert Component
 *
 * Dismissible alert panel that lists vehicles with critically low or
 * zero stock. Intended for placement near the top of the Inventory page
 * or on the Dashboard so staff can act quickly.
 *
 * Uses getAlertItems() from inventory.utils to sort items by urgency
 * (out-of-stock first, then ascending quantity).
 * Hidden automatically when there are no alert items.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInventory } from '../hooks/useInventory';
import { getAlertItems, getItemStatus, getVehicleLabel } from '../utils/inventory.utils';
import { StockBadge } from './StockBadge';
import { paths } from '../../../routes/paths';
import { InventoryItemDTO } from '../types/inventory.types';

// ── Sub-components ────────────────────────────────────────────────────────

interface AlertRowProps {
  item: InventoryItemDTO;
  onNavigate: (id: string) => void;
}

function AlertRow({ item, onNavigate }: AlertRowProps) {
  const label = getVehicleLabel(item);
  const status = getItemStatus(item);
  const isOutOfStock = item.quantity === 0;

  return (
    <li className="flex items-center justify-between gap-4 py-2.5 first:pt-0 last:pb-0">
      <div className="flex min-w-0 items-center gap-3">
        {/* Urgency indicator dot */}
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

      <div className="flex shrink-0 items-center gap-3">
        <StockBadge quantity={item.quantity} available={item.available} />
        <span className="text-sm font-semibold text-gray-700">
          {item.quantity} unit{item.quantity !== 1 ? 's' : ''}
        </span>
        {item.vehicle && (
          <button
            type="button"
            onClick={() => onNavigate(item.vehicleId)}
            className="rounded-md border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            aria-label={`View ${label}`}
          >
            View
          </button>
        )}
      </div>
    </li>
  );
}

// ── Loading skeleton ──────────────────────────────────────────────────────

function AlertSkeleton() {
  return (
    <div className="animate-pulse rounded-lg border border-amber-200 bg-amber-50 p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="h-5 w-48 rounded bg-amber-200" />
        <div className="h-4 w-16 rounded bg-amber-200" />
      </div>
      <ul className="divide-y divide-amber-100">
        {Array.from({ length: 3 }).map((_, i) => (
          <li key={i} className="flex items-center justify-between gap-4 py-2.5">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-amber-200" />
              <div className="space-y-1">
                <div className="h-3.5 w-40 rounded bg-amber-200" />
                <div className="h-3 w-24 rounded bg-amber-100" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-5 w-20 rounded-full bg-amber-200" />
              <div className="h-5 w-12 rounded bg-amber-200" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────

interface LowStockAlertProps {
  /**
   * Maximum number of alert items to display before showing a "+N more" footer.
   * Defaults to 5.
   */
  maxVisible?: number;
  /**
   * Additional Tailwind classes to apply to the outer wrapper.
   */
  className?: string;
}

/**
 * LowStockAlert
 *
 * Reads inventory data from the TanStack Query cache (no extra request)
 * and renders a dismissible amber/red alert panel listing all vehicles
 * that are out of stock or below LOW_STOCK_THRESHOLD.
 *
 * - Hidden when there are no alert items (returns null).
 * - Hidden after the user dismisses it (local state; reappears on mount).
 * - Shows a skeleton while loading.
 * - Truncates to `maxVisible` items with a "+N more" row.
 * - Each row links to the vehicle detail page.
 *
 * @example
 * ```tsx
 * // On the inventory page, above the table
 * <LowStockAlert maxVisible={5} />
 *
 * // On the dashboard, more compact
 * <LowStockAlert maxVisible={3} className="mb-4" />
 * ```
 */
export function LowStockAlert({
  maxVisible = 5,
  className = '',
}: LowStockAlertProps) {
  const navigate = useNavigate();
  const { data, isLoading } = useInventory();
  const [dismissed, setDismissed] = useState(false);

  if (isLoading) return <AlertSkeleton />;
  if (!data) return null;

  const alertItems = getAlertItems(data.items);

  // Nothing to show
  if (alertItems.length === 0 || dismissed) return null;

  const outOfStockCount = alertItems.filter((i) => i.quantity === 0).length;
  const lowStockCount = alertItems.length - outOfStockCount;
  const visible = alertItems.slice(0, maxVisible);
  const hiddenCount = alertItems.length - visible.length;

  // Use red styling when any item is completely out of stock
  const hasOutOfStock = outOfStockCount > 0;
  const borderClass = hasOutOfStock
    ? 'border-red-200 bg-red-50'
    : 'border-amber-200 bg-amber-50';
  const headerTextClass = hasOutOfStock ? 'text-red-800' : 'text-amber-800';
  const dividerClass = hasOutOfStock ? 'divide-red-100' : 'divide-amber-100';
  const footerBgClass = hasOutOfStock
    ? 'bg-red-100/50 text-red-700'
    : 'bg-amber-100/50 text-amber-700';

  const title = [
    outOfStockCount > 0
      ? `${outOfStockCount} out of stock`
      : null,
    lowStockCount > 0
      ? `${lowStockCount} low stock`
      : null,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <div
      role="alert"
      className={`rounded-lg border ${borderClass} ${className}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-2">
          <svg
            className={`h-5 w-5 shrink-0 ${hasOutOfStock ? 'text-red-500' : 'text-amber-500'}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
          <h3 className={`text-sm font-semibold ${headerTextClass}`}>
            Stock Alert — {title}
          </h3>
        </div>

        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss alert"
          className={`rounded p-0.5 ${hasOutOfStock ? 'text-red-400 hover:text-red-600' : 'text-amber-400 hover:text-amber-600'} transition-colors`}
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Item list */}
      <div className="border-t border-inherit px-4">
        <ul className={`divide-y ${dividerClass}`}>
          {visible.map((item) => (
            <AlertRow
              key={item.id}
              item={item}
              onNavigate={(id) => navigate(paths.vehicleDetail(id))}
            />
          ))}
        </ul>
      </div>

      {/* "+N more" footer */}
      {hiddenCount > 0 && (
        <div className={`rounded-b-lg px-4 py-2 text-xs font-medium ${footerBgClass}`}>
          +{hiddenCount} more item{hiddenCount !== 1 ? 's' : ''} need attention
        </div>
      )}
    </div>
  );
}
