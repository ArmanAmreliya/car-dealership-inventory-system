/**
 * RecentPurchases Component
 *
 * Dashboard card showing the most recent purchases from the current
 * browser session. Because the backend exposes only POST /api/v1/purchases
 * with no list/history endpoint, this component reads from sessionStorage
 * using the same key as PurchasesPage.
 *
 * When no session purchases exist, renders an empty state with a
 * "Make a Purchase" shortcut.
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PurchaseDTO } from '../../purchases/types/purchase.types';
import { paths } from '../../../routes/paths';

// ── Session storage reader ─────────────────────────────────────────────────
// Matches the key used in PurchasesPage.tsx

const SESSION_KEY = 'dealerflow_session_purchases';

function readSessionPurchases(): PurchaseDTO[] {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as PurchaseDTO[];
  } catch {
    return [];
  }
}

// ── Types ──────────────────────────────────────────────────────────────────

interface RecentPurchasesProps {
  /** Max purchases to show (default 5) */
  maxVisible?: number;
}

// ── Helpers ────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function vehicleLabel(p: PurchaseDTO): string {
  if (p.vehicle) {
    return `${p.vehicle.year} ${p.vehicle.make} ${p.vehicle.model}`;
  }
  return `Vehicle …${p.vehicleId.slice(-6)}`;
}

// ── Row ────────────────────────────────────────────────────────────────────

interface RowProps {
  purchase: PurchaseDTO;
  onNavigate: (vehicleId: string) => void;
}

function PurchaseRow({ purchase, onNavigate }: RowProps) {
  const label = vehicleLabel(purchase);
  const price = purchase.vehicle
    ? new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      }).format(purchase.vehicle.price)
    : null;

  return (
    <li className="flex items-center justify-between gap-3 py-3">
      <div className="flex min-w-0 items-center gap-3">
        {/* Completed dot */}
        <span
          className="h-2 w-2 shrink-0 rounded-full bg-green-500"
          aria-hidden="true"
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-gray-900">{label}</p>
          <p className="text-xs text-gray-400">{formatDate(purchase.purchasedAt)}</p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {price && (
          <span className="text-sm font-semibold text-green-700">{price}</span>
        )}
        {purchase.vehicle && (
          <button
            type="button"
            onClick={() => onNavigate(purchase.vehicleId)}
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
 * RecentPurchases
 *
 * Reads session purchase history on mount (and re-reads on focus so the
 * dashboard stays in sync after a purchase is made on another tab/page).
 *
 * @example
 * ```tsx
 * <RecentPurchases maxVisible={5} />
 * ```
 */
export function RecentPurchases({ maxVisible = 5 }: RecentPurchasesProps) {
  const navigate = useNavigate();
  const [purchases, setPurchases] = useState<PurchaseDTO[]>(() =>
    readSessionPurchases()
  );

  // Re-read when the window regains focus (purchase made in another tab)
  useEffect(() => {
    const onFocus = () => setPurchases(readSessionPurchases());
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  const visible = purchases.slice(0, maxVisible);
  const hiddenCount = purchases.length - visible.length;
  const hasPurchases = purchases.length > 0;

  return (
    <div className="flex flex-col rounded-lg border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
        <h3 className="text-sm font-semibold text-gray-900">Recent Purchases</h3>
        <button
          type="button"
          onClick={() => navigate(paths.purchases)}
          className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
        >
          View all →
        </button>
      </div>

      {/* Content */}
      {!hasPurchases ? (
        <div className="flex flex-1 flex-col items-center justify-center px-5 py-8 text-center">
          <svg
            className="mb-3 h-10 w-10 text-gray-300"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
          </svg>
          <p className="text-sm font-medium text-gray-700">No purchases this session</p>
          <p className="mt-1 text-xs text-gray-400">
            Purchases you make will appear here.
          </p>
          <button
            type="button"
            onClick={() => navigate(paths.purchases)}
            className="mt-3 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 transition-colors"
          >
            Make a Purchase
          </button>
        </div>
      ) : (
        <>
          <ul className="divide-y divide-gray-100 px-5">
            {visible.map((p) => (
              <PurchaseRow
                key={p.id}
                purchase={p}
                onNavigate={(id) => navigate(paths.vehicleDetail(id))}
              />
            ))}
          </ul>

          {hiddenCount > 0 && (
            <button
              type="button"
              onClick={() => navigate(paths.purchases)}
              className="rounded-b-lg border-t border-gray-100 bg-gray-50 px-5 py-2.5 text-left text-xs font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            >
              +{hiddenCount} more purchase{hiddenCount !== 1 ? 's' : ''} →
            </button>
          )}
        </>
      )}
    </div>
  );
}
