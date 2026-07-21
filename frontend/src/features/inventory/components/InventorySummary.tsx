/**
 * InventorySummary Component
 *
 * Four stat cards rendered in a responsive grid, driven by
 * the InventoryStats object from useInventoryStats.
 *
 * Cards:
 *   Total Vehicles    – totalVehicles
 *   Available         – availableVehicles  (green)
 *   Low Stock         – lowStockCount      (amber)
 *   Out of Stock      – outOfStockCount    (red)
 */

import { useInventoryStats } from '../hooks/useInventoryStats';

// ── Types ──────────────────────────────────────────────────────────────────

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  accentClass: string; /** Tailwind bg colour applied to the icon wrapper */
  isLoading?: boolean;
}

// ── Sub-components ─────────────────────────────────────────────────────────

function StatCard({ title, value, description, icon, accentClass, isLoading }: StatCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-gray-500">{title}</p>
          {isLoading ? (
            <div className="mt-2 h-8 w-16 animate-pulse rounded bg-gray-200" />
          ) : (
            <p className="mt-1 text-3xl font-bold tracking-tight text-gray-900">{value}</p>
          )}
          {description && !isLoading && (
            <p className="mt-1 text-xs text-gray-400">{description}</p>
          )}
        </div>
        <div className={`shrink-0 rounded-lg p-2.5 ${accentClass}`} aria-hidden="true">
          {icon}
        </div>
      </div>
    </div>
  );
}

function StatCardSkeleton() {
  return (
    <div className="animate-pulse rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <div className="h-4 w-24 rounded bg-gray-200" />
          <div className="h-8 w-16 rounded bg-gray-200" />
          <div className="h-3 w-32 rounded bg-gray-100" />
        </div>
        <div className="h-10 w-10 rounded-lg bg-gray-200" />
      </div>
    </div>
  );
}

// ── Icons ──────────────────────────────────────────────────────────────────

function TotalIcon() {
  return (
    <svg className="h-5 w-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
    </svg>
  );
}

function AvailableIcon() {
  return (
    <svg className="h-5 w-5 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function LowStockIcon() {
  return (
    <svg className="h-5 w-5 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  );
}

function OutOfStockIcon() {
  return (
    <svg className="h-5 w-5 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
    </svg>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

/**
 * InventorySummary
 *
 * Reads from useInventoryStats (no extra API call) and renders
 * four stat cards in a responsive 1/2/4-column grid.
 * Shows skeleton cards while loading and a subtle error notice on failure.
 *
 * @example
 * ```tsx
 * <InventorySummary />
 * ```
 */
export function InventorySummary() {
  const { stats, isLoading, isError } = useInventoryStats();

  if (isError) {
    return (
      <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
        <p className="text-sm text-red-700">Unable to load inventory statistics.</p>
      </div>
    );
  }

  if (isLoading || !stats) {
    return (
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Vehicles"
        value={stats.totalVehicles}
        description={`${stats.totalStock} total units in stock`}
        icon={<TotalIcon />}
        accentClass="bg-blue-50"
      />
      <StatCard
        title="Available"
        value={stats.availableVehicles}
        description={`${stats.availabilityRate}% availability rate`}
        icon={<AvailableIcon />}
        accentClass="bg-green-50"
      />
      <StatCard
        title="Low Stock"
        value={stats.lowStockCount}
        description="Vehicles at or below threshold"
        icon={<LowStockIcon />}
        accentClass="bg-amber-50"
      />
      <StatCard
        title="Out of Stock"
        value={stats.outOfStockCount}
        description="Zero units remaining"
        icon={<OutOfStockIcon />}
        accentClass="bg-red-50"
      />
    </div>
  );
}
