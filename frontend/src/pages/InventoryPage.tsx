/**
 * InventoryPage
 *
 * Stock management page. Shows summary stat cards, a search/filter bar,
 * and the full inventory table with inline stock update actions.
 *
 * All data fetching is handled by useInventory (via InventorySummary and
 * InventoryTable). Client-side filtering is done here before passing the
 * filtered slice to InventoryTable — the backend inventory endpoint does
 * not accept query parameters.
 */

import { useState, useMemo } from 'react';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { InventorySummary } from '../features/inventory/components/InventorySummary';
import { InventoryFilters, InventoryFilterValues, AvailabilityFilter } from '../features/inventory/components/InventoryFilters';
import { InventoryTable } from '../features/inventory/components/InventoryTable';
import { useInventory } from '../features/inventory/hooks/useInventory';
import { getAvailabilityStatus } from '../features/inventory/components/StockBadge';

// ── Helpers ────────────────────────────────────────────────────────────────

const DEFAULT_FILTERS: InventoryFilterValues = {
  search: '',
  availability: 'all',
};

/**
 * Normalise a string for loose substring matching.
 * Lower-cases and trims the value.
 */
function norm(s: string | undefined | null): string {
  return (s ?? '').toLowerCase().trim();
}

// ── Page ───────────────────────────────────────────────────────────────────

/**
 * InventoryPage
 *
 * Responsibilities:
 * - Holds client-side filter state (search + availability dropdown).
 * - Derives the filtered item slice via useMemo so InventoryTable
 *   always receives a stable, typed array.
 * - Provides a Retry button when the inventory query errors.
 * - Does NOT implement purchase functionality.
 */
export function InventoryPage() {
  const { data, isLoading, isError, error, refetch } = useInventory();
  const [filters, setFilters] = useState<InventoryFilterValues>(DEFAULT_FILTERS);

  const allItems = data?.items ?? [];

  // ── Client-side filtering ─────────────────────────────────────────────
  const filteredItems = useMemo(() => {
    const q = norm(filters.search);
    const av = filters.availability as AvailabilityFilter;

    return allItems.filter((item) => {
      // ── Availability filter ───────────────────────────────────────────
      if (av !== 'all') {
        const status = getAvailabilityStatus(item.quantity, item.available);
        if (status !== av) return false;
      }

      // ── Search filter ─────────────────────────────────────────────────
      if (q) {
        const v = item.vehicle;
        const haystack = [
          v?.make,
          v?.model,
          v?.vin,
          v?.year != null ? String(v.year) : null,
          item.vehicleId,
        ]
          .map(norm)
          .join(' ');

        if (!haystack.includes(q)) return false;
      }

      return true;
    });
  }, [allItems, filters]);

  // ── Error message extraction ──────────────────────────────────────────
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

  // ── Subtitle ──────────────────────────────────────────────────────────
  const subtitle = isLoading
    ? 'Loading inventory…'
    : isError
    ? 'Failed to load inventory'
    : filters.search || filters.availability !== 'all'
    ? `${filteredItems.length} of ${allItems.length} item${allItems.length !== 1 ? 's' : ''}`
    : `${allItems.length} item${allItems.length !== 1 ? 's' : ''}`;

  return (
    <DashboardLayout pageTitle="Inventory">
      <div className="p-6">
        <div className="mx-auto max-w-7xl">

          {/* ── Page header ──────────────────────────────────────────────── */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Stock Management</h1>
            <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
          </div>

          {/* ── Summary stat cards ───────────────────────────────────────── */}
          <InventorySummary />

          {/* ── Error state ──────────────────────────────────────────────── */}
          {isError && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
              <div className="flex items-start gap-3">
                <svg
                  className="mt-0.5 h-5 w-5 shrink-0 text-red-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-red-800">
                    Failed to load inventory
                  </h3>
                  <p className="mt-1 text-sm text-red-700">
                    {extractMessage(error) ?? 'An unexpected error occurred.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => refetch()}
                  className="shrink-0 rounded-md bg-red-100 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-200 transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {/* ── Search & filter bar ──────────────────────────────────────── */}
          {!isError && (
            <InventoryFilters
              filters={filters}
              onChange={setFilters}
              isLoading={isLoading}
              totalItems={allItems.length}
              filteredCount={filteredItems.length}
            />
          )}

          {/* ── Inventory table ──────────────────────────────────────────── */}
          <InventoryTable items={filteredItems} isLoading={isLoading} />

        </div>
      </div>
    </DashboardLayout>
  );
}
