/**
 * InventoryChart Component
 *
 * Dashboard panel showing two complementary inventory visualisations
 * built with inline SVG — no external chart library required.
 *
 * Visualisations:
 *   1. Availability bar chart  – stacked horizontal bars for
 *      Available / Low Stock / Unavailable counts.
 *   2. Price-range donut       – how the fleet is distributed across
 *      five price buckets.
 *
 * Both read from the useDashboard cache (no extra API calls).
 */

import { useDashboard } from '../hooks/useDashboard';
import { useInventory } from '../../inventory/hooks/useInventory';
import {
  buildInventoryDistribution,
  buildPriceDistribution,
  InventoryBar,
  PriceRangeSegment,
} from '../utils/dashboard.utils';

// ── Shared skeleton ────────────────────────────────────────────────────────

function ChartSkeleton({ height = 220 }: { height?: number }) {
  return (
    <div
      className="animate-pulse rounded-lg border border-gray-200 bg-white p-5"
      style={{ minHeight: height }}
    >
      <div className="mb-4 h-4 w-40 rounded bg-gray-200" />
      <div className="rounded bg-gray-100" style={{ height: height - 64 }} />
    </div>
  );
}

// ── Availability Bar Chart ─────────────────────────────────────────────────

interface AvailabilityBarsProps {
  bars: InventoryBar[];
  total: number;
}

function AvailabilityBars({ bars, total }: AvailabilityBarsProps) {
  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <p className="text-sm text-gray-400">No inventory data yet</p>
      </div>
    );
  }

  const maxVal = Math.max(...bars.map((b) => b.value), 1);

  return (
    <div className="space-y-3" role="list" aria-label="Inventory distribution">
      {bars.map((bar) => (
        <div key={bar.label} role="listitem">
          <div className="mb-1 flex items-center justify-between gap-2 text-sm">
            <div className="flex items-center gap-1.5">
              <span
                className="inline-block h-2.5 w-2.5 rounded-sm"
                style={{ backgroundColor: bar.color }}
                aria-hidden="true"
              />
              <span className="text-gray-600">{bar.label}</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-gray-900">{bar.value}</span>
              <span className="w-9 text-right text-gray-400">
                {bar.percentage}%
              </span>
            </div>
          </div>

          {/* Bar track */}
          <div
            className="h-5 w-full overflow-hidden rounded bg-gray-100"
            role="progressbar"
            aria-valuenow={bar.value}
            aria-valuemin={0}
            aria-valuemax={total}
            aria-label={bar.label}
          >
            <div
              className="h-full rounded transition-all duration-500"
              style={{
                width: `${(bar.value / maxVal) * 100}%`,
                backgroundColor: bar.color,
              }}
            />
          </div>
        </div>
      ))}

      {/* Total footer */}
      <p className="pt-1 text-right text-xs text-gray-400">
        {total} vehicle{total !== 1 ? 's' : ''} total
      </p>
    </div>
  );
}

// ── Price-Range Donut ──────────────────────────────────────────────────────

interface PriceDonutProps {
  segments: PriceRangeSegment[];
}

function PriceDonut({ segments }: PriceDonutProps) {
  const radius = 52;
  const strokeWidth = 16;
  const circumference = 2 * Math.PI * radius;
  const size = (radius + strokeWidth) * 2 + 4;
  const center = size / 2;
  const total = segments.reduce((s, seg) => s + seg.count, 0) || 1;

  let cumulativeOffset = 0;
  const arcs = segments.map((seg) => {
    const dash = (seg.count / total) * circumference;
    const gap = circumference - dash;
    const offset = -cumulativeOffset;
    cumulativeOffset += dash;
    return { ...seg, dash, gap, offset };
  });

  const dominant = [...segments].sort((a, b) => b.count - a.count)[0];

  if (total === 0 || segments.every((s) => s.count === 0)) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <p className="text-sm text-gray-400">No vehicle data</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
      {/* Donut SVG */}
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="shrink-0 overflow-visible"
        aria-hidden="true"
      >
        {/* Track */}
        <circle
          cx={center} cy={center} r={radius}
          fill="none" stroke="#f3f4f6" strokeWidth={strokeWidth}
        />
        {/* Arcs */}
        {arcs.filter((a) => a.count > 0).map((arc) => (
          <circle
            key={arc.label}
            cx={center} cy={center} r={radius}
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
            <text x={center} y={center - 7} textAnchor="middle" dominantBaseline="middle" fontSize={16} fontWeight={700} fill="#111827">
              {dominant.count}
            </text>
            <text x={center} y={center + 11} textAnchor="middle" dominantBaseline="middle" fontSize={9} fill="#6b7280">
              {dominant.label.length > 10 ? dominant.label.slice(0, 9) + '…' : dominant.label}
            </text>
          </>
        )}
      </svg>

      {/* Legend */}
      <ul className="flex w-full flex-col justify-center gap-2 text-sm">
        {segments.map((seg) => (
          <li key={seg.label} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-sm"
                style={{ backgroundColor: seg.color }}
                aria-hidden="true"
              />
              <span className="truncate text-xs text-gray-600">{seg.label}</span>
            </div>
            <div className="flex shrink-0 items-center gap-1.5 text-xs">
              <span className="font-semibold text-gray-900">{seg.count}</span>
              <span className="w-8 text-right text-gray-400">{seg.percentage}%</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

interface InventoryChartProps {
  /** Optional wrapper className */
  className?: string;
}

/**
 * InventoryChart
 *
 * Two-panel dashboard card:
 *   Left  – Availability distribution (horizontal bars)
 *   Right – Price-range distribution (donut + legend)
 *
 * Responsive: stacks on mobile, side-by-side on lg+.
 * Reads from the useDashboard cache — no additional API calls.
 *
 * @example
 * ```tsx
 * <InventoryChart className="mb-6" />
 * ```
 */
export function InventoryChart({ className = '' }: InventoryChartProps) {
  const { stats, vehicles, isLoading } = useDashboard();
  const { data: inventoryData } = useInventory();

  if (isLoading) {
    return (
      <div className={`grid grid-cols-1 gap-4 lg:grid-cols-2 ${className}`}>
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
    );
  }

  if (!stats) return null;

  const bars = buildInventoryDistribution(stats);
  const priceSegments = buildPriceDistribution(vehicles);

  return (
    <div className={`grid grid-cols-1 gap-4 lg:grid-cols-2 ${className}`}>

      {/* ── Availability distribution ─────────────────────────────────── */}
      <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-gray-700">
            Availability Distribution
          </h3>
          <span className="text-xs text-gray-400">
            {inventoryData?.items.length ?? 0} items
          </span>
        </div>
        <AvailabilityBars bars={bars} total={stats.totalVehicles} />
      </div>

      {/* ── Price-range distribution ──────────────────────────────────── */}
      <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-gray-700">
            Price Range Distribution
          </h3>
          <span className="text-xs text-gray-400">
            {vehicles.length} vehicles
          </span>
        </div>
        <PriceDonut segments={priceSegments} />
      </div>

    </div>
  );
}
