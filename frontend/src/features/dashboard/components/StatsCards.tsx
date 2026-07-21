/**
 * StatsCards Component
 *
 * Four primary KPI cards for the dashboard overview.
 * Driven by InventoryStats from useDashboard — no additional API call.
 *
 * Cards:
 *   Total Vehicles     – totalVehicles   (blue)
 *   Available          – availableVehicles (green)
 *   Low / Out of Stock – lowStockCount + outOfStockCount (amber)
 *   Availability Rate  – availabilityRate % (indigo)
 */

import { useNavigate } from 'react-router-dom';
import { InventoryStats } from '../../inventory/types/inventory.types';
import { paths } from '../../../routes/paths';

// ── Types ──────────────────────────────────────────────────────────────────

interface StatsCardsProps {
  stats: InventoryStats | undefined;
  isLoading?: boolean;
}

// ── Skeleton ───────────────────────────────────────────────────────────────

function CardSkeleton() {
  return (
    <div className="animate-pulse rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-2">
          <div className="h-3.5 w-28 rounded bg-gray-200" />
          <div className="h-8 w-16 rounded bg-gray-200" />
          <div className="h-3 w-36 rounded bg-gray-100" />
        </div>
        <div className="h-10 w-10 rounded-lg bg-gray-200" />
      </div>
    </div>
  );
}

// ── Single card ────────────────────────────────────────────────────────────

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
  /** Optional route to navigate to on card click */
  linkTo?: string;
  /** Colour class for the value text */
  valueColor?: string;
}

function StatCard({
  title,
  value,
  description,
  icon,
  iconBg,
  linkTo,
  valueColor = 'text-gray-900',
}: StatCardProps) {
  const navigate = useNavigate();

  const inner = (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
          {title}
        </p>
        <p className={`mt-1 text-3xl font-bold tracking-tight ${valueColor}`}>
          {value}
        </p>
        <p className="mt-1 text-xs text-gray-400">{description}</p>
      </div>
      <div
        className={`shrink-0 rounded-lg p-2.5 ${iconBg}`}
        aria-hidden="true"
      >
        {icon}
      </div>
    </div>
  );

  if (linkTo) {
    return (
      <button
        type="button"
        onClick={() => navigate(linkTo)}
        className="w-full rounded-lg border border-gray-200 bg-white p-5 shadow-sm text-left hover:border-blue-300 hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
      >
        {inner}
      </button>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      {inner}
    </div>
  );
}

// ── Icons ──────────────────────────────────────────────────────────────────

function VehicleIcon() {
  return (
    <svg className="h-5 w-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="h-5 w-5 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg className="h-5 w-5 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  );
}

function RateIcon() {
  return (
    <svg className="h-5 w-5 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

/**
 * StatsCards
 *
 * Renders four KPI cards in a responsive 1/2/4-column grid.
 * Shows skeleton while loading. Cards link through to relevant pages.
 *
 * @example
 * ```tsx
 * <StatsCards stats={stats} isLoading={isLoading} />
 * ```
 */
export function StatsCards({ stats, isLoading = false }: StatsCardsProps) {
  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  const needsAttention = stats.outOfStockCount + stats.lowStockCount;
  const attentionColor =
    stats.outOfStockCount > 0
      ? 'text-red-600'
      : stats.lowStockCount > 0
      ? 'text-amber-600'
      : 'text-gray-900';

  const rateColor =
    stats.availabilityRate >= 75
      ? 'text-green-600'
      : stats.availabilityRate >= 50
      ? 'text-amber-600'
      : 'text-red-600';

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Vehicles"
        value={stats.totalVehicles}
        description={`${stats.totalStock} units tracked`}
        icon={<VehicleIcon />}
        iconBg="bg-blue-50"
        linkTo={paths.vehicles}
      />
      <StatCard
        title="Available"
        value={stats.availableVehicles}
        description="Ready for purchase"
        icon={<CheckIcon />}
        iconBg="bg-green-50"
        linkTo={paths.inventory}
        valueColor="text-green-600"
      />
      <StatCard
        title="Needs Attention"
        value={needsAttention}
        description={`${stats.outOfStockCount} out of stock · ${stats.lowStockCount} low`}
        icon={<AlertIcon />}
        iconBg="bg-amber-50"
        linkTo={paths.inventory}
        valueColor={attentionColor}
      />
      <StatCard
        title="Availability Rate"
        value={`${stats.availabilityRate}%`}
        description="Of fleet is available"
        icon={<RateIcon />}
        iconBg="bg-indigo-50"
        valueColor={rateColor}
      />
    </div>
  );
}
