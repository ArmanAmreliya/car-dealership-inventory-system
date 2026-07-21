/**
 * PurchasesPage
 *
 * Purchase history and new-purchase entry point.
 *
 * IMPORTANT: The backend exposes only POST /api/v1/purchases.
 * There is no list or history endpoint. Purchase history is therefore
 * accumulated in sessionStorage-backed local state for the current browser
 * session. Records are added each time a purchase is completed on this page
 * or carried in via navigation state from CreatePurchasePage.
 *
 * Layout:
 *   ┌─────────────────────────────────────────┐
 *   │  Page header + "New Purchase" button    │
 *   ├─────────────────────────────────────────┤
 *   │  Session summary stats (if any)         │
 *   ├─────────────────────────────────────────┤
 *   │  Inline new-purchase form (collapsible) │
 *   ├─────────────────────────────────────────┤
 *   │  Purchase table (session history)       │
 *   └─────────────────────────────────────────┘
 */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { PurchaseTable } from '../features/purchases/components/PurchaseTable';
import { PurchaseSummary } from '../features/purchases/components/PurchaseSummary';
import { PurchaseForm } from '../features/purchases/components/PurchaseForm';
import { useVehicles } from '../features/vehicles/hooks/useVehicles';
import { PurchaseDTO } from '../features/purchases/types/purchase.types';
import { paths } from '../routes/paths';

// ── Session storage helpers ───────────────────────────────────────────────

const SESSION_KEY = 'dealerflow_session_purchases';

function loadSessionPurchases(): PurchaseDTO[] {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as PurchaseDTO[];
  } catch {
    return [];
  }
}

function saveSessionPurchases(purchases: PurchaseDTO[]): void {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(purchases));
  } catch {
    // sessionStorage unavailable — silently degrade
  }
}

// ── Sub-components ────────────────────────────────────────────────────────

function SessionStats({ purchases }: { purchases: PurchaseDTO[] }) {
  if (purchases.length === 0) return null;

  const totalSpent = purchases.reduce((sum, p) => {
    return sum + (p.vehicle?.price ?? 0);
  }, 0);

  return (
    <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
          Session Purchases
        </p>
        <p className="mt-1 text-2xl font-bold text-gray-900">{purchases.length}</p>
      </div>
      {totalSpent > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
            Total Spent
          </p>
          <p className="mt-1 text-2xl font-bold text-green-700">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              maximumFractionDigits: 0,
            }).format(totalSpent)}
          </p>
        </div>
      )}
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
          Last Purchase
        </p>
        <p className="mt-1 text-sm font-semibold text-gray-700 truncate">
          {purchases[0]?.vehicle
            ? `${purchases[0].vehicle.year} ${purchases[0].vehicle.make} ${purchases[0].vehicle.model}`
            : purchases[0]?.vehicleId.slice(0, 8) + '…'}
        </p>
      </div>
    </div>
  );
}

// ── Inline purchase form panel ────────────────────────────────────────────

interface InlinePurchasePanelProps {
  vehicles: ReturnType<typeof useVehicles>['data'];
  vehiclesLoading: boolean;
  vehiclesError: boolean;
  onRefetchVehicles: () => void;
  onSuccess: (receipt: PurchaseDTO) => void;
  onClose: () => void;
}

function InlinePurchasePanel({
  vehicles = [],
  vehiclesLoading,
  vehiclesError,
  onRefetchVehicles,
  onSuccess,
  onClose,
}: InlinePurchasePanelProps) {
  return (
    <div className="mb-6 rounded-lg border border-blue-200 bg-white shadow-sm">
      {/* Panel header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
        <h2 className="text-sm font-semibold text-gray-900">New Purchase</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="rounded p-1 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="px-5 py-5">
        {/* Vehicles loading */}
        {vehiclesLoading && (
          <div className="animate-pulse space-y-3">
            <div className="h-4 w-32 rounded bg-gray-200" />
            <div className="h-10 w-full rounded bg-gray-100" />
            <div className="h-10 w-full rounded bg-gray-200" />
          </div>
        )}

        {/* Vehicles error */}
        {vehiclesError && (
          <div className="flex items-start gap-3 rounded-md border border-red-200 bg-red-50 p-4">
            <svg className="mt-0.5 h-5 w-5 shrink-0 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">
                Failed to load available vehicles
              </p>
            </div>
            <button
              type="button"
              onClick={onRefetchVehicles}
              className="shrink-0 rounded-md bg-red-100 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-200 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* No available vehicles */}
        {!vehiclesLoading && !vehiclesError && vehicles.length === 0 && (
          <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-4 text-center">
            <p className="text-sm font-medium text-amber-900">
              No vehicles currently available for purchase.
            </p>
            <p className="mt-1 text-xs text-amber-700">
              Check inventory to restock available vehicles.
            </p>
          </div>
        )}

        {/* Form */}
        {!vehiclesLoading && !vehiclesError && vehicles.length > 0 && (
          <PurchaseForm
            availableVehicles={vehicles}
            onSuccess={onSuccess}
            onCancel={onClose}
            submitLabel="Confirm Purchase"
          />
        )}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────

/**
 * PurchasesPage
 *
 * Responsibilities:
 * - Maintains the session purchase history in state + sessionStorage.
 * - Accepts incoming receipt state from navigation (CreatePurchasePage).
 * - Owns the inline new-purchase panel open/close state.
 * - Passes vehicleMap to child components for receipt enrichment.
 */
export function PurchasesPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // ── Session purchase history ────────────────────────────────────────────
  const [purchases, setPurchases] = useState<PurchaseDTO[]>(() =>
    loadSessionPurchases()
  );

  // ── Latest receipt (shown inline above table after a purchase) ─────────
  const [latestReceipt, setLatestReceipt] = useState<PurchaseDTO | null>(null);

  // ── Inline purchase form visibility ────────────────────────────────────
  const [showForm, setShowForm] = useState(false);

  // Accept a receipt carried via navigation state (from CreatePurchasePage)
  useEffect(() => {
    const state = location.state as { purchase?: PurchaseDTO } | null;
    if (state?.purchase) {
      addPurchase(state.purchase);
      // Clear state so refreshing the page doesn't re-add it
      navigate(paths.purchases, { replace: true, state: null });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const addPurchase = useCallback((receipt: PurchaseDTO) => {
    setPurchases((prev) => {
      // Deduplicate by id
      if (prev.some((p) => p.id === receipt.id)) return prev;
      const updated = [receipt, ...prev];
      saveSessionPurchases(updated);
      return updated;
    });
  }, []);

  // ── Available vehicles for the purchase form ────────────────────────────
  const {
    data: vehicles = [],
    isLoading: vehiclesLoading,
    isError: vehiclesError,
    refetch: refetchVehicles,
  } = useVehicles({ availability: true });

  // Build vehicleMap for table / summary enrichment
  const vehicleMap = Object.fromEntries(vehicles.map((v) => [v.id, v]));

  // ── Handlers ────────────────────────────────────────────────────────────
  const handlePurchaseSuccess = (receipt: PurchaseDTO) => {
    toast.success('Purchase completed successfully!');
    addPurchase(receipt);
    setLatestReceipt(receipt);
    setShowForm(false);
  };

  const handleClearHistory = () => {
    setPurchases([]);
    setLatestReceipt(null);
    saveSessionPurchases([]);
    toast.success('Purchase history cleared.');
  };

  // ── Derived ─────────────────────────────────────────────────────────────
  const subtitle =
    purchases.length === 0
      ? 'No purchases this session'
      : `${purchases.length} purchase${purchases.length !== 1 ? 's' : ''} this session`;

  return (
    <DashboardLayout pageTitle="Purchases">
      <div className="p-6">
        <div className="mx-auto max-w-7xl">

          {/* ── Page header ──────────────────────────────────────────────── */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Purchase History</h1>
              <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              {purchases.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearHistory}
                  className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Clear History
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setShowForm((prev) => !prev);
                  setLatestReceipt(null);
                }}
                className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                New Purchase
              </button>
            </div>
          </div>

          {/* ── Session stats ─────────────────────────────────────────────── */}
          <SessionStats purchases={purchases} />

          {/* ── Inline new-purchase form ──────────────────────────────────── */}
          {showForm && (
            <InlinePurchasePanel
              vehicles={vehicles}
              vehiclesLoading={vehiclesLoading}
              vehiclesError={vehiclesError}
              onRefetchVehicles={refetchVehicles}
              onSuccess={handlePurchaseSuccess}
              onClose={() => setShowForm(false)}
            />
          )}

          {/* ── Latest receipt (shown immediately after purchase) ─────────── */}
          {latestReceipt && !showForm && (
            <div className="mb-6">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-700">
                  Latest Receipt
                </h2>
                <button
                  type="button"
                  onClick={() => setLatestReceipt(null)}
                  className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Dismiss
                </button>
              </div>
              <PurchaseSummary
                purchase={latestReceipt}
                vehicleMap={vehicleMap}
              />
            </div>
          )}

          {/* ── No-history empty prompt ───────────────────────────────────── */}
          {purchases.length === 0 && !showForm && (
            <div className="mb-6 rounded-lg border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
              <svg
                className="mx-auto mb-4 h-12 w-12 text-gray-300"
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
                Purchases you make this session will be recorded here.
              </p>
              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="mt-4 inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Make a Purchase
              </button>
            </div>
          )}

          {/* ── Session purchase table ────────────────────────────────────── */}
          {purchases.length > 0 && (
            <>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-700">
                  Session History
                </h2>
                <button
                  type="button"
                  onClick={() => navigate(paths.vehicles)}
                  className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Browse Vehicles →
                </button>
              </div>
              <PurchaseTable
                purchases={purchases}
                vehicleMap={vehicleMap}
              />
            </>
          )}

          {/* ── Info notice about session scope ──────────────────────────── */}
          <p className="mt-6 text-center text-xs text-gray-400">
            Purchase history is session-only — records are not persisted between browser sessions.
          </p>

        </div>
      </div>
    </DashboardLayout>
  );
}
