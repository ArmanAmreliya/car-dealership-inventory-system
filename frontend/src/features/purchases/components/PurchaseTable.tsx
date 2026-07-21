/**
 * PurchaseTable Component
 *
 * Displays a list of PurchaseDTO records in a responsive table (desktop)
 * and card grid (mobile).
 *
 * Because the backend has no purchase list/history endpoint, this component
 * is designed to render session-local purchases collected during the current
 * browser session. The caller (PurchasesPage) owns the list and passes it
 * as a prop.
 *
 * Handles loading skeleton, empty, and populated states.
 * Each row/card shows vehicle label, price, quantity, date, and a status badge.
 */

import { useNavigate } from 'react-router-dom';
import { PurchaseDTO } from '../types/purchase.types';
import { PurchaseStatusBadge } from './PurchaseStatusBadge';
import { buildPurchaseReceipt, formatPurchaseDate } from '../utils/purchase.utils';
import { VehicleDTO } from '../../../api/api';
import { paths } from '../../../routes/paths';

const SKELETON_ROWS = 4;

interface PurchaseTableProps {
  /** Purchases to display */
  purchases: PurchaseDTO[];
  /** Show skeleton while a query / state initialisation is pending */
  isLoading?: boolean;
  /** Optional map of vehicleId → VehicleDTO for enriching display labels */
  vehicleMap?: Record<string, VehicleDTO>;
}

// ── Skeleton ──────────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {[160, 96, 48, 120, 88].map((w, i) => (
        <td key={i} className="px-4 py-3 whitespace-nowrap">
          <div className="h-4 rounded bg-gray-200" style={{ width: w }} />
        </td>
      ))}
    </tr>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────

function EmptyRow() {
  return (
    <tr>
      <td colSpan={5}>
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
          <svg
            className="mb-4 h-12 w-12 text-gray-300"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
            />
          </svg>
          <h3 className="text-sm font-semibold text-gray-900">No purchases yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Completed purchases will appear here.
          </p>
        </div>
      </td>
    </tr>
  );
}

// ── Mobile card ───────────────────────────────────────────────────────────

interface MobileCardProps {
  purchase: PurchaseDTO;
  vehicleMap?: Record<string, VehicleDTO>;
  onNavigate: (vehicleId: string) => void;
}

function MobileCard({ purchase, vehicleMap, onNavigate }: MobileCardProps) {
  const receipt = buildPurchaseReceipt(purchase, vehicleMap);
  const formattedPrice =
    receipt.price != null
      ? new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          maximumFractionDigits: 0,
        }).format(receipt.price)
      : null;

  return (
    <article className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-semibold text-gray-900">{receipt.vehicleLabel}</p>
          <p className="mt-0.5 text-xs text-gray-400">
            {formatPurchaseDate(receipt.purchasedAt)}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          {formattedPrice && (
            <span className="text-sm font-bold text-green-700">{formattedPrice}</span>
          )}
          <PurchaseStatusBadge status="completed" />
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
        <span className="text-xs text-gray-500">
          Qty: <span className="font-medium text-gray-700">{receipt.quantity}</span>
        </span>
        {purchase.vehicle && (
          <button
            type="button"
            onClick={() => onNavigate(purchase.vehicleId)}
            className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            View Vehicle →
          </button>
        )}
      </div>
    </article>
  );
}

// ── Main component ────────────────────────────────────────────────────────

const TABLE_HEADERS = ['Vehicle', 'Price', 'Qty', 'Purchase Date', 'Status'];

/**
 * PurchaseTable
 *
 * Desktop: horizontal table with 5 columns.
 * Mobile: single-column card grid.
 * Both views share the same empty state and loading skeleton.
 */
export function PurchaseTable({
  purchases,
  isLoading = false,
  vehicleMap,
}: PurchaseTableProps) {
  const navigate = useNavigate();

  // ── Mobile grid ─────────────────────────────────────────────────────────
  const mobileGrid = (
    <div className="md:hidden">
      {isLoading ? (
        <div className="grid gap-3">
          {Array.from({ length: SKELETON_ROWS }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-lg border border-gray-200 bg-white p-4 space-y-3"
            >
              <div className="flex justify-between">
                <div className="space-y-1.5">
                  <div className="h-4 w-40 rounded bg-gray-200" />
                  <div className="h-3 w-28 rounded bg-gray-100" />
                </div>
                <div className="space-y-1.5 items-end flex flex-col">
                  <div className="h-4 w-16 rounded bg-gray-200" />
                  <div className="h-5 w-20 rounded-full bg-gray-200" />
                </div>
              </div>
              <div className="h-px bg-gray-100" />
              <div className="h-3 w-24 rounded bg-gray-200" />
            </div>
          ))}
        </div>
      ) : purchases.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white px-6 py-16 text-center">
          <svg
            className="mb-4 h-12 w-12 text-gray-300"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
          </svg>
          <h3 className="text-sm font-semibold text-gray-900">No purchases yet</h3>
          <p className="mt-1 text-sm text-gray-500">Completed purchases will appear here.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {purchases.map((p) => (
            <MobileCard
              key={p.id}
              purchase={p}
              vehicleMap={vehicleMap}
              onNavigate={(id) => navigate(paths.vehicleDetail(id))}
            />
          ))}
        </div>
      )}
    </div>
  );

  // ── Desktop table ────────────────────────────────────────────────────────
  const desktopTable = (
    <div className="hidden md:block overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {TABLE_HEADERS.map((h) => (
                <th
                  key={h}
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 bg-white">
            {isLoading ? (
              Array.from({ length: SKELETON_ROWS }).map((_, i) => (
                <SkeletonRow key={i} />
              ))
            ) : purchases.length === 0 ? (
              <EmptyRow />
            ) : (
              purchases.map((p) => {
                const receipt = buildPurchaseReceipt(p, vehicleMap);
                const formattedPrice =
                  receipt.price != null
                    ? new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        maximumFractionDigits: 0,
                      }).format(receipt.price)
                    : '—';

                return (
                  <tr key={p.id} className="transition-colors hover:bg-gray-50">
                    {/* Vehicle */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      {p.vehicle ? (
                        <button
                          type="button"
                          onClick={() => navigate(paths.vehicleDetail(p.vehicleId))}
                          className="text-left font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                        >
                          {receipt.vehicleLabel}
                        </button>
                      ) : (
                        <span className="text-sm font-medium text-gray-900">
                          {receipt.vehicleLabel}
                        </span>
                      )}
                    </td>

                    {/* Price */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-sm font-semibold text-green-700">
                        {formattedPrice}
                      </span>
                    </td>

                    {/* Quantity */}
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                      {receipt.quantity}
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {formatPurchaseDate(receipt.purchasedAt)}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <PurchaseStatusBadge status="completed" />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <>
      {mobileGrid}
      {desktopTable}
    </>
  );
}
