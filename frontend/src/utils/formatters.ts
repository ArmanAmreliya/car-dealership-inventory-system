/**
 * Formatting Utilities
 *
 * Pure, side-effect-free functions for displaying numbers, currency,
 * dates and mileage.  Zero React / DOM dependencies — safe to import
 * in hooks, utilities and tests.
 */

// ── Currency ──────────────────────────────────────────────────────────────

/**
 * Format a number as USD currency with no decimal places.
 *
 * @example
 * formatCurrency(55200)   // → "$55,200"
 * formatCurrency(0)       // → "$0"
 * formatCurrency(-100)    // → "-$100"
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format a number as USD currency with exactly two decimal places.
 *
 * @example
 * formatCurrencyDecimal(1234.5)  // → "$1,234.50"
 */
export function formatCurrencyDecimal(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Format a sale price with a configurable discount percentage.
 * Returns the discounted value rounded to the nearest dollar.
 *
 * @example
 * formatSalePrice(60000, 8)  // → "$55,200"
 */
export function formatSalePrice(price: number, discountPct: number): string {
  const sale = Math.round(price * (1 - discountPct / 100));
  return formatCurrency(sale);
}

// ── Mileage ───────────────────────────────────────────────────────────────

/**
 * Format a mileage number with thousands separator and "mi" suffix.
 * Returns "0 mi" for falsy values so the UI never shows blank.
 *
 * @example
 * formatMileage(28000)   // → "28,000 mi"
 * formatMileage(0)       // → "0 mi"
 * formatMileage(null)    // → "0 mi"
 */
export function formatMileage(value: number | null | undefined): string {
  const n = value ?? 0;
  return `${n.toLocaleString('en-US')} mi`;
}

// ── Date ──────────────────────────────────────────────────────────────────

/**
 * Format an ISO date string or Date object into "MM/DD/YYYY".
 * Returns "—" for falsy or invalid inputs.
 *
 * @example
 * formatDate('2026-07-23T10:00:00.000Z')  // → "07/23/2026"
 * formatDate(new Date('2026-01-01'))        // → "01/01/2026"
 * formatDate('')                            // → "—"
 */
export function formatDate(value: string | Date | null | undefined): string {
  if (!value) return '—';
  const d = value instanceof Date ? value : new Date(value);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  });
}

/**
 * Format an ISO date string as a short relative label.
 * "Today", "Yesterday", or "MM/DD/YYYY".
 *
 * @example
 * formatDateRelative(new Date().toISOString())  // → "Today"
 */
export function formatDateRelative(
  value: string | Date | null | undefined
): string {
  if (!value) return '—';
  const d = value instanceof Date ? value : new Date(value);
  if (isNaN(d.getTime())) return '—';

  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / 86_400_000);

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  return formatDate(d);
}

// ── Number ────────────────────────────────────────────────────────────────

/**
 * Format a plain integer with thousands separator.
 *
 * @example
 * formatNumber(15000)  // → "15,000"
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

/**
 * Format a percentage with one decimal place.
 *
 * @example
 * formatPercent(0.9912)  // → "99.1%"
 */
export function formatPercent(ratio: number): string {
  return `${(ratio * 100).toFixed(1)}%`;
}
