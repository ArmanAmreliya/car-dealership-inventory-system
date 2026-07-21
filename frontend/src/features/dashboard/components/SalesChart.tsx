/**
 * SalesChart Component
 *
 * Dashboard sales-trend visualisation built with inline SVG.
 * No external chart library — consistent with the rest of the project.
 *
 * Because the backend has no purchase history endpoint, this chart
 * reads from the session purchase list stored in sessionStorage
 * (same key used by PurchasesPage).
 *
 * When the session is empty it renders a descriptive empty state
 * rather than a blank canvas.
 *
 * Visualisations:
 *   - Sparkline polyline showing purchase count per day (last 7 days)
 *   - Summary row: total session purchases + total session revenue
 *   - Period toggle: Daily / Weekly
 */

import { useState, useEffect, useMemo } from 'react';
import { PurchaseDTO } from '../../purchases/types/purchase.types';
import {
  buildSalesTrend,
  SalesTrendPoint,
  formatRevenue,
  formatCompactCurrency,
} from '../utils/dashboard.utils';

// ── Session storage ────────────────────────────────────────────────────────

const SESSION_KEY = 'dealerflow_session_purchases';

function readSessionPurchases(): PurchaseDTO[] {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as PurchaseDTO[]) : [];
  } catch {
    return [];
  }
}

// ── Types ──────────────────────────────────────────────────────────────────

type Period = 'daily' | 'weekly';

interface SalesChartProps {
  /** Optional wrapper className */
  className?: string;
}

// ── Sparkline SVG ──────────────────────────────────────────────────────────

interface SparklineProps {
  points: SalesTrendPoint[];
  /** Chart drawing area width (viewBox units) */
  vbWidth?: number;
  /** Chart drawing area height (viewBox units) */
  vbHeight?: number;
}

function Sparkline({ points, vbWidth = 340, vbHeight = 100 }: SparklineProps) {
  const paddingX = 24;
  const paddingY = 16;
  const w = vbWidth - paddingX * 2;
  const h = vbHeight - paddingY * 2;

  const maxCount = Math.max(...points.map((p) => p.count), 1);
  const n = points.length;

  // Map data points to SVG coordinates
  const coords = points.map((p, i) => ({
    x: paddingX + (i / (n - 1)) * w,
    y: paddingY + h - (p.count / maxCount) * h,
    ...p,
  }));

  // Build polyline string
  const polyline = coords.map((c) => `${c.x},${c.y}`).join(' ');

  // Build fill polygon (close to baseline)
  const fill = [
    `${coords[0].x},${paddingY + h}`,
    ...coords.map((c) => `${c.x},${c.y}`),
    `${coords[coords.length - 1].x},${paddingY + h}`,
  ].join(' ');

  return (
    <svg
      viewBox={`0 0 ${vbWidth} ${vbHeight}`}
      className="w-full"
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      {/* Subtle grid lines */}
      {[0.25, 0.5, 0.75, 1].map((t) => (
        <line
          key={t}
          x1={paddingX}
          x2={vbWidth - paddingX}
          y1={paddingY + h - t * h}
          y2={paddingY + h - t * h}
          stroke="#f3f4f6"
          strokeWidth={1}
        />
      ))}

      {/* Fill area */}
      <polygon points={fill} fill="#3b82f6" fillOpacity={0.08} />

      {/* Line */}
      <polyline
        points={polyline}
        fill="none"
        stroke="#3b82f6"
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Data point dots */}
      {coords.map((c) => (
        <circle
          key={c.label}
          cx={c.x}
          cy={c.y}
          r={c.count > 0 ? 4 : 2}
          fill={c.count > 0 ? '#3b82f6' : '#d1d5db'}
          stroke="white"
          strokeWidth={1.5}
        />
      ))}

      {/* X-axis labels */}
      {coords.map((c) => (
        <text
          key={`lbl-${c.label}`}
          x={c.x}
          y={vbHeight - 2}
          textAnchor="middle"
          fontSize={9}
          fill="#9ca3af"
        >
          {c.label}
        </text>
      ))}
    </svg>
  );
}

// ── Empty state ────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <svg
        className="mb-3 h-10 w-10 text-gray-200"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
      <p className="text-sm font-medium text-gray-500">No sales data this session</p>
      <p className="mt-1 text-xs text-gray-400">
        The chart will populate as purchases are made.
      </p>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

/**
 * SalesChart
 *
 * Reads session purchases from sessionStorage and renders a sparkline
 * trend chart with a period toggle (Daily / Weekly) and summary totals.
 * Re-reads on window focus so it stays fresh after purchases on other tabs.
 *
 * @example
 * ```tsx
 * <SalesChart className="mb-6" />
 * ```
 */
export function SalesChart({ className = '' }: SalesChartProps) {
  const [period, setPeriod] = useState<Period>('daily');
  const [purchases, setPurchases] = useState<PurchaseDTO[]>(() =>
    readSessionPurchases()
  );

  // Sync when window regains focus
  useEffect(() => {
    const onFocus = () => setPurchases(readSessionPurchases());
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  const trend: SalesTrendPoint[] = useMemo(
    () => buildSalesTrend(purchases, period),
    [purchases, period]
  );

  const totalCount = purchases.length;
  const totalRevenue = purchases.reduce(
    (s, p) => s + (p.vehicle?.price ?? 0),
    0
  );
  const hasData = totalCount > 0;
  const anyCount = trend.some((p) => p.count > 0);

  return (
    <div
      className={`rounded-lg border border-gray-200 bg-white shadow-sm ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-5 py-4">
        <h3 className="text-sm font-semibold text-gray-700">Sales Trend</h3>

        {/* Period toggle */}
        <div
          className="flex rounded-md border border-gray-200 bg-gray-50 p-0.5 text-xs font-medium"
          role="group"
          aria-label="Chart period"
        >
          {(['daily', 'weekly'] as Period[]).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              className={`rounded px-2.5 py-1 capitalize transition-colors ${
                period === p
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              aria-pressed={period === p}
            >
              {p === 'daily' ? 'Daily' : 'Weekly'}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 pb-5 pt-4">
        {/* Summary row */}
        <div className="mb-4 flex items-start gap-6">
          <div>
            <p className="text-xs text-gray-400">Session Purchases</p>
            <p className="mt-0.5 text-2xl font-bold text-gray-900">
              {totalCount}
            </p>
          </div>
          {totalRevenue > 0 && (
            <div>
              <p className="text-xs text-gray-400">Session Revenue</p>
              <p className="mt-0.5 text-2xl font-bold text-green-700">
                {formatRevenue(totalRevenue)}
              </p>
            </div>
          )}
        </div>

        {/* Chart or empty state */}
        {!hasData || !anyCount ? (
          <EmptyState />
        ) : (
          <>
            <div className="h-28 w-full">
              <Sparkline points={trend} />
            </div>

            {/* Peak callout */}
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400">
              {trend
                .filter((p) => p.count > 0)
                .slice(0, 3)
                .map((p) => (
                  <span key={p.label}>
                    <span className="font-medium text-gray-700">{p.label}</span>:{' '}
                    {p.count} sale{p.count !== 1 ? 's' : ''}
                    {p.revenue > 0 && (
                      <> · {formatCompactCurrency(p.revenue)}</>
                    )}
                  </span>
                ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
