/**
 * InventoryMetrics Component
 *
 * Analytics panel that displays computed inventory KPIs in a concise,
 * scannable layout. Complements InventorySummary (which shows raw counts)
 * by surfacing ratio and distribution metrics.
 *
 * Metrics displayed:
 *   - Availability Rate           – % vehicles marked available
 *   - Stock Health Score          – composite 0-100 score
 *   - Average Stock per Vehicle   – totalStock / totalVehicles
 *   - Critical Items              – out-of-stock + low-stock count
 *   - Stock Distribution          – segmented mini-bar (available/low/unavail)
 *   - Stock Coverage Breakdown    – labelled percentages for each status tier
 */

import { useInventoryStats } from '../hooks/useInventoryStats';
import { useInventory } from '../hooks/useInventory';
import {
  buildAvailabilityChartData,
  formatPercent,
  filterByStatus,
} from '../utils/inventory.utils';
import { LOW_STOCK_THRESHOLD } from '../types/inventory.types';

// ── Helpers ────────────────────────────────────────────────────────────────

/**
 * Compute a 0–100 stock health score.
 *
 * Formula:
 *   score = (availabilityRate * 0.6) + (fullStockRatio * 0.4)
 *
 * Where:
 *   fullStockRatio = items with quantity > LOW_STOCK_THRESHOLD / totalVehicles
 *
 * Higher is healthier. 0 = all unavailable, 100 = all fully stocked.
 */
function computeHealthScore(
  availabilityRate: number,
  fullStockCount: number,
  totalVehicles: number
): number {
  if (totalVehicles === 0) return 0;
  const fullStockRatio = (fullStockCount / totalVehicles) * 100;
  return Math.round(availabilityRate * 0.6 + fullStockRatio * 0.4);
}

function healthScoreColor(score: number): string {
  if (score >= 75) return 'text-green-600';
  if (score >= 50) return 'text-amber-600';
  return 'text-red-600';
}

function healthScoreLabel(score: number): string {
  if (score >= 75) return 'Good';
  if (score >= 50) return 'Fair';
  return 'Poor';
}

// ── Skeleton ───────────────────────────────────────────────────────────────

function MetricsSkeleton() {
  return (
    <div className="animate-pulse rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 h-5 w-40 rounded bg-gray-200" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-1.5">
            <div className="h-3 w-20 rounded bg-gray-200" />
            <div className="h-7 w-16 rounded bg-gray-200" />
            <div className="h-2.5 w-24 rounded bg-gray-100" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Metric cell ───────────────────────────────────────────────────────────

interface MetricCellProps {
  label: string;
  value: React.ReactNode;
  sub?: string;
  valueClassName?: string;
}

function MetricCell({ label, value, sub, valueClassName = '' }: MetricCellProps) {
  return (
    <div className="flex flex-col">
      <dt className="text-xs font-medium uppercase tracking-wider text-gray-400">
        {label}
      </dt>
      <dd className={`mt-1 text-2xl font-bold text-gray-900 ${valueClassName}`}>
        {value}
      </dd>
      {sub && (
        <p className="mt-0.5 text-xs text-gray-400">{sub}</p>
      )}
    </div>
  );
}

// ── Distribution mini-bar ─────────────────────────────────────────────────

interface DistBarProps {
  availablePct: number;
  lowStockPct: number;
  unavailablePct: number;
}

function DistributionBar({ availablePct, lowStockPct, unavailablePct }: DistBarProps) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-1.5">
        Stock Distribution
      </dt>
      <dd>
        {/* Segmented bar */}
        <div
          className="flex h-3 w-full overflow-hidden rounded-full bg-gray-100"
          role="img"
          aria-label={`Available ${availablePct.toFixed(0)}%, Low Stock ${lowStockPct.toFixed(0)}%, Unavailable ${unavailablePct.toFixed(0)}%`}
        >
          {availablePct > 0 && (
            <div
              className="bg-green-500 transition-all duration-500"
              style={{ width: `${availablePct}%` }}
            />
          )}
          {lowStockPct > 0 && (
            <div
              className="bg-amber-400 transition-all duration-500"
              style={{ width: `${lowStockPct}%` }}
            />
          )}
          {unavailablePct > 0 && (
            <div
              className="bg-red-400 transition-all duration-500"
              style={{ width: `${unavailablePct}%` }}
            />
          )}
        </div>

        {/* Labels */}
        <div className="mt-1.5 flex justify-between text-xs text-gray-400">
          <span className="text-green-600">{availablePct.toFixed(0)}%</span>
          <span className="text-amber-600">{lowStockPct.toFixed(0)}%</span>
          <span className="text-red-500">{unavailablePct.toFixed(0)}%</span>
        </div>
      </dd>
    </div>
  );
}

// ── Coverage breakdown ────────────────────────────────────────────────────

interface CoverageRowProps {
  label: string;
  count: number;
  total: number;
  colorClass: string;
}

function CoverageRow({ label, count, total, colorClass }: CoverageRowProps) {
  const pct = total === 0 ? 0 : Math.round((count / total) * 100);
  return (
    <div className="flex items-center justify-between gap-2 text-sm">
      <div className="flex items-center gap-1.5">
        <span className={`h-2 w-2 rounded-full ${colorClass}`} aria-hidden="true" />
        <span className="text-gray-600">{label}</span>
      </div>
      <div className="flex items-center gap-2 text-right">
        <span className="font-semibold text-gray-900">{count}</span>
        <span className="w-10 text-xs text-gray-400">{pct}%</span>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────

interface InventoryMetricsProps {
  /** Optional wrapper className */
  className?: string;
}

/**
 * InventoryMetrics
 *
 * Reads from useInventoryStats and useInventory (no extra requests)
 * and renders a two-section analytics panel:
 *
 *   Top grid – 6 KPI cells: availability rate, health score, avg stock,
 *              critical items, stock distribution bar, threshold note.
 *
 *   Bottom section – Coverage breakdown table with per-tier counts & %.
 *
 * @example
 * ```tsx
 * // Below the summary cards on InventoryPage
 * <InventoryMetrics className="mb-6" />
 *
 * // On DashboardPage
 * <InventoryMetrics />
 * ```
 */
export function InventoryMetrics({ className = '' }: InventoryMetricsProps) {
  const { stats, isLoading, isError } = useInventoryStats();
  const { data } = useInventory();

  if (isLoading) return <MetricsSkeleton />;
  if (isError || !stats) return null;

  const items = data?.items ?? [];
  const total = stats.totalVehicles;

  // Full-stock items: available AND quantity > threshold
  const fullStockItems = filterByStatus(items, 'available');
  const fullStockCount = fullStockItems.length;

  const healthScore = computeHealthScore(
    stats.availabilityRate,
    fullStockCount,
    total
  );

  const avgStock =
    total === 0 ? 0 : Math.round((stats.totalStock / total) * 10) / 10;

  const criticalCount = stats.outOfStockCount + stats.lowStockCount;

  // Distribution percentages (use item count, not vehicle count)
  const itemCount = items.length || 1;
  const availablePct = (fullStockCount / itemCount) * 100;
  const lowStockPct = (stats.lowStockCount / itemCount) * 100;
  const unavailablePct =
    ((stats.outOfStockCount + stats.unavailableVehicles - stats.outOfStockCount) /
      itemCount) *
    100;
  // simpler: just use unavailableVehicles for the red segment
  const unavailPct = (stats.unavailableVehicles / (total || 1)) * 100;
  const avSegments = buildAvailabilityChartData(stats);
  const availSegPct = avSegments.find((s) => s.label === 'Available')?.percentage ?? 0;
  const lowSegPct = avSegments.find((s) => s.label === 'Low Stock')?.percentage ?? 0;
  const unavailSegPct = avSegments.find((s) => s.label === 'Unavailable')?.percentage ?? 0;

  return (
    <div
      className={`rounded-lg border border-gray-200 bg-white shadow-sm ${className}`}
    >
      {/* Section header */}
      <div className="border-b border-gray-100 px-5 py-4">
        <h3 className="text-sm font-semibold text-gray-700">Inventory Analytics</h3>
        <p className="mt-0.5 text-xs text-gray-400">
          Computed from {total} tracked vehicle{total !== 1 ? 's' : ''}
        </p>
      </div>

      {/* KPI grid */}
      <div className="px-5 py-5">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3">
          <MetricCell
            label="Availability Rate"
            value={`${stats.availabilityRate}%`}
            sub="Available / total vehicles"
            valueClassName={
              stats.availabilityRate >= 75
                ? 'text-green-600'
                : stats.availabilityRate >= 50
                ? 'text-amber-600'
                : 'text-red-600'
            }
          />

          <MetricCell
            label="Health Score"
            value={
              <span className={healthScoreColor(healthScore)}>
                {healthScore}
                <span className="ml-1 text-sm font-medium">
                  / 100
                </span>
              </span>
            }
            sub={healthScoreLabel(healthScore)}
          />

          <MetricCell
            label="Avg Stock / Vehicle"
            value={avgStock}
            sub={`${stats.totalStock} total units`}
          />

          <MetricCell
            label="Critical Items"
            value={criticalCount}
            sub={`${stats.outOfStockCount} out-of-stock, ${stats.lowStockCount} low`}
            valueClassName={criticalCount > 0 ? 'text-red-600' : 'text-gray-900'}
          />

          <MetricCell
            label="Low-Stock Threshold"
            value={`≤ ${LOW_STOCK_THRESHOLD}`}
            sub="units triggers low-stock"
          />

          <MetricCell
            label="Full-Stock Items"
            value={fullStockCount}
            sub={`of ${total} tracked`}
            valueClassName="text-green-600"
          />
        </dl>

        {/* Distribution bar — spans full width */}
        <div className="mt-6">
          <DistributionBar
            availablePct={availSegPct}
            lowStockPct={lowSegPct}
            unavailablePct={unavailSegPct}
          />
        </div>
      </div>

      {/* Coverage breakdown */}
      {total > 0 && (
        <div className="border-t border-gray-100 px-5 py-4">
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Coverage Breakdown
          </h4>
          <div className="space-y-2">
            <CoverageRow
              label="Available (full stock)"
              count={fullStockCount}
              total={total}
              colorClass="bg-green-500"
            />
            <CoverageRow
              label="Low Stock"
              count={stats.lowStockCount}
              total={total}
              colorClass="bg-amber-400"
            />
            <CoverageRow
              label="Out of Stock"
              count={stats.outOfStockCount}
              total={total}
              colorClass="bg-red-500"
            />
            <CoverageRow
              label="Marked Unavailable"
              count={stats.unavailableVehicles}
              total={total}
              colorClass="bg-gray-400"
            />
          </div>
        </div>
      )}
    </div>
  );
}
