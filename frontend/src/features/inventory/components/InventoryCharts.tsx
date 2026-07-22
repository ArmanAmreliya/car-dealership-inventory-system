/**
 * InventoryCharts Component
 *
 * Pure SVG analytics charts for the inventory feature.
 * No charting library — drawn with inline SVG so there are
 * zero additional dependencies.
 *
 * Exports:
 *   AvailabilityDonut  – three-segment donut: Available / Low Stock / Unavailable
 *   StockLevelBars     – horizontal bar chart of the lowest-stock vehicles
 *   InventoryCharts    – composite panel that renders both charts side-by-side
 */

import { useInventory } from '../hooks/useInventory';
import { useInventoryStats } from '../hooks/useInventoryStats';
import {
  buildAvailabilityChartData,
  buildStockBarData,
  ChartSegment,
  StockBarDatum,
  formatPercent,
  truncateLabel,
} from '../utils/inventory.utils';
import { LOW_STOCK_THRESHOLD } from '../types/inventory.types';

// ── Shared skeleton ───────────────────────────────────────────────────────

function ChartSkeleton({ height = 200 }: { height?: number }) {
  return (
    <div
      className="animate-pulse rounded-lg border border-gray-200 bg-white p-5"
      style={{ minHeight: height }}
    >
      <div className="mb-4 h-4 w-36 rounded bg-gray-200" />
      <div
        className="rounded bg-gray-100"
        style={{ height: height - 64 }}
      />
    </div>
  );
}

// ── Availability Donut ─────────────────────────────────────────────────────

interface DonutProps {
  segments: ChartSegment[];
  /** SVG radius of the donut ring (default 60) */
  radius?: number;
  /** Stroke width of the ring (default 20) */
  strokeWidth?: number;
}

function DonutChart({ segments, radius = 60, strokeWidth = 20 }: DonutProps) {
  const circumference = 2 * Math.PI * radius;
  const size = (radius + strokeWidth) * 2 + 4;
  const center = size / 2;
  const total = segments.reduce((s, seg) => s + seg.value, 0) || 1;

  // Build arc offsets
  let cumulativeOffset = 0;
  const arcs = segments.map((seg) => {
    const dash = (seg.value / total) * circumference;
    const gap = circumference - dash;
    const offset = -cumulativeOffset;
    cumulativeOffset += dash;
    return { ...seg, dash, gap, offset };
  });

  // Find the dominant segment for the centre label
  const dominant = [...segments].sort((a, b) => b.value - a.value)[0];

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-hidden="true"
      className="overflow-visible"
    >
      {/* Background track */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="#f3f4f6"
        strokeWidth={strokeWidth}
      />

      {/* Coloured arcs */}
      {arcs
        .filter((arc) => arc.value > 0)
        .map((arc) => (
          <circle
            key={arc.label}
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={arc.color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${arc.dash} ${arc.gap}`}
            strokeDashoffset={arc.offset}
            strokeLinecap="butt"
            style={{ transform: 'rotate(-90deg)', transformOrigin: `${center}px ${center}px` }}
          />
        ))}

      {/* Centre label */}
      {dominant && (
        <>
          <text
            x={center}
            y={center - 6}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={18}
            fontWeight={700}
            fill="#111827"
          >
            {dominant.value}
          </text>
          <text
            x={center}
            y={center + 14}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={10}
            fill="#6b7280"
          >
            {dominant.label}
          </text>
        </>
      )}
    </svg>
  );
}

interface AvailabilityDonutProps {
  /** Optional wrapper className */
  className?: string;
}

/**
 * AvailabilityDonut
 *
 * Donut chart showing the split between Available, Low Stock, and
 * Unavailable vehicles. Reads from the inventory cache.
 *
 * @example
 * ```tsx
 * <AvailabilityDonut />
 * ```
 */
export function AvailabilityDonut({ className = '' }: AvailabilityDonutProps) {
  const { stats, isLoading, isError } = useInventoryStats();

  if (isLoading) return <ChartSkeleton height={260} />;
  if (isError || !stats) return null;

  const segments = buildAvailabilityChartData(stats);
  const hasData = stats.totalVehicles > 0;

  return (
    <div className={`rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs ${className}`}>
      {/* Title */}
      <div className="mb-4">
        <h3 className="text-base font-bold text-slate-900">
          Stock Availability Distribution
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Proportion of available, low-stock, and out-of-stock units
        </p>
      </div>

      {hasData ? (
        <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
          {/* SVG donut */}
          <div className="shrink-0">
            <DonutChart segments={segments} />
          </div>

          {/* Legend */}
          <div className="flex w-full flex-col justify-center gap-2.5">
            {segments.map((seg) => (
              <div key={seg.label} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="h-3 w-3 shrink-0 rounded-sm"
                    style={{ backgroundColor: seg.color }}
                    aria-hidden="true"
                  />
                  <span className="truncate text-sm text-gray-600">{seg.label}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-sm font-semibold text-gray-900">
                    {seg.value}
                  </span>
                  <span className="w-12 text-right text-xs text-gray-400">
                    {formatPercent(seg.percentage)}
                  </span>
                </div>
              </div>
            ))}

            {/* Availability rate pill */}
            <div className="mt-1 rounded-md bg-gray-50 px-3 py-2 text-center">
              <p className="text-xs text-gray-500">Overall availability</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.availabilityRate}%
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <svg
            className="mb-3 h-10 w-10 text-gray-200"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18a8 8 0 110-16 8 8 0 010 16z" />
          </svg>
          <p className="text-sm text-gray-400">No inventory data</p>
        </div>
      )}
    </div>
  );
}

// ── Stock Level Bar Chart ──────────────────────────────────────────────────

const STATUS_BAR_COLOR: Record<string, string> = {
  'available': '#22c55e',
  'low-stock': '#f59e0b',
  'unavailable': '#ef4444',
};

interface StockLevelBarsProps {
  /**
   * Max vehicles to display (default 8).
   * Shows lowest-stock items first.
   */
  limit?: number;
  /** Optional wrapper className */
  className?: string;
}

/**
 * StockLevelBars
 *
 * Horizontal bar chart of the N lowest-stock vehicles.
 * Bar width is proportional to quantity relative to the max in the set.
 * Bar colour reflects the item's AvailabilityStatus.
 * Reads from the inventory cache — no extra request.
 *
 * @example
 * ```tsx
 * <StockLevelBars limit={8} />
 * ```
 */
export function StockLevelBars({
  limit = 8,
  className = '',
}: StockLevelBarsProps) {
  const { data, isLoading } = useInventory();

  if (isLoading) return <ChartSkeleton height={300} />;
  if (!data || data.items.length === 0) return null;

  const bars: StockBarDatum[] = buildStockBarData(data.items, limit);
  const maxQty = Math.max(...bars.map((b) => b.quantity), 1);

  return (
    <div className={`rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs ${className}`}>
      {/* Title */}
      <div className="mb-4 flex items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Lowest Stock Vehicles
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Key catalog units requiring stock monitoring
          </p>
        </div>
        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
          Top {bars.length} Units
        </span>
      </div>

      {/* Threshold reference line label */}
      <div className="mb-3 flex items-center gap-1.5">
        <span className="h-0.5 w-4 bg-amber-400" aria-hidden="true" />
        <span className="text-xs text-gray-400">
          Low-stock threshold: {LOW_STOCK_THRESHOLD} units
        </span>
      </div>

      {/* Bars */}
      <ol className="space-y-2.5" aria-label="Stock levels by vehicle">
        {bars.map((bar) => {
          const widthPct = maxQty === 0 ? 0 : (bar.quantity / maxQty) * 100;
          const thresholdPct = (LOW_STOCK_THRESHOLD / maxQty) * 100;
          const barColor = STATUS_BAR_COLOR[bar.status] ?? '#6b7280';

          return (
            <li key={bar.id}>
              <div className="mb-0.5 flex items-center justify-between gap-2">
                <span
                  className="truncate text-xs text-gray-600"
                  title={bar.label}
                >
                  {truncateLabel(bar.label, 22)}
                </span>
                <span className="shrink-0 text-xs font-semibold text-gray-800">
                  {bar.quantity}
                </span>
              </div>

              {/* Bar track */}
              <div
                className="relative h-4 w-full overflow-hidden rounded-sm bg-gray-100"
                aria-valuenow={bar.quantity}
                aria-valuemin={0}
                aria-valuemax={maxQty}
                role="progressbar"
                aria-label={bar.label}
              >
                {/* Filled segment */}
                <div
                  className="h-full rounded-sm transition-all duration-500"
                  style={{
                    width: `${widthPct}%`,
                    backgroundColor: barColor,
                  }}
                />

                {/* Threshold marker */}
                {thresholdPct <= 100 && (
                  <div
                    className="absolute inset-y-0 w-px bg-amber-400"
                    style={{ left: `${thresholdPct}%` }}
                    aria-hidden="true"
                  />
                )}
              </div>
            </li>
          );
        })}
      </ol>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5">
        {[
          { color: '#22c55e', label: 'Available' },
          { color: '#f59e0b', label: 'Low Stock' },
          { color: '#ef4444', label: 'Unavailable' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 rounded-sm"
              style={{ backgroundColor: color }}
              aria-hidden="true"
            />
            <span className="text-xs text-gray-500">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Composite panel ────────────────────────────────────────────────────────

interface InventoryChartsProps {
  /** Max vehicles shown in the bar chart (default 8) */
  barLimit?: number;
  /** Optional wrapper className */
  className?: string;
}

/**
 * InventoryCharts
 *
 * Composite panel that renders AvailabilityDonut and StockLevelBars
 * side-by-side on wide screens and stacked on mobile.
 *
 * Drop this anywhere that has access to the inventory query cache
 * (i.e. inside a component tree that has called useInventory at least once,
 * or where the QueryClient already has the inventory list cached).
 *
 * @example
 * ```tsx
 * // On the InventoryPage, below InventorySummary
 * <InventoryCharts barLimit={8} className="mb-6" />
 * ```
 */
export function InventoryCharts({
  barLimit = 8,
  className = '',
}: InventoryChartsProps) {
  const { isLoading } = useInventory();

  if (isLoading) {
    return (
      <div className={`grid grid-cols-1 gap-4 lg:grid-cols-2 ${className}`}>
        <ChartSkeleton height={260} />
        <ChartSkeleton height={260} />
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 gap-4 lg:grid-cols-2 ${className}`}>
      <AvailabilityDonut />
      <StockLevelBars limit={barLimit} />
    </div>
  );
}
