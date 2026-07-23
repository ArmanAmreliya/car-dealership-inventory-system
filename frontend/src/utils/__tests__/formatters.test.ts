/**
 * formatters.ts — unit tests
 *
 * Covers every exported formatter:
 *   formatCurrency, formatCurrencyDecimal, formatSalePrice,
 *   formatMileage, formatDate, formatDateRelative,
 *   formatNumber, formatPercent
 */

import {
  formatCurrency,
  formatCurrencyDecimal,
  formatSalePrice,
  formatMileage,
  formatDate,
  formatDateRelative,
  formatNumber,
  formatPercent,
} from '../formatters';

// ── formatCurrency ─────────────────────────────────────────────────────────

describe('formatCurrency()', () => {
  it('formats a typical price', () => {
    expect(formatCurrency(55200)).toBe('$55,200');
  });

  it('formats zero', () => {
    expect(formatCurrency(0)).toBe('$0');
  });

  it('formats a negative value', () => {
    expect(formatCurrency(-1000)).toBe('-$1,000');
  });

  it('rounds down fractional cents (no decimal places)', () => {
    expect(formatCurrency(55200.99)).toBe('$55,201');
  });

  it('formats large values with correct separators', () => {
    expect(formatCurrency(1_000_000)).toBe('$1,000,000');
  });

  it('formats values below 1000 without commas', () => {
    expect(formatCurrency(500)).toBe('$500');
  });
});

// ── formatCurrencyDecimal ──────────────────────────────────────────────────

describe('formatCurrencyDecimal()', () => {
  it('shows two decimal places', () => {
    expect(formatCurrencyDecimal(1234.5)).toBe('$1,234.50');
  });

  it('shows two decimal places for whole numbers', () => {
    expect(formatCurrencyDecimal(1000)).toBe('$1,000.00');
  });

  it('formats zero with decimals', () => {
    expect(formatCurrencyDecimal(0)).toBe('$0.00');
  });

  it('rounds to two decimal places', () => {
    expect(formatCurrencyDecimal(1.999)).toBe('$2.00');
  });
});

// ── formatSalePrice ────────────────────────────────────────────────────────

describe('formatSalePrice()', () => {
  it('applies 8% discount correctly', () => {
    // 60000 * 0.92 = 55200
    expect(formatSalePrice(60000, 8)).toBe('$55,200');
  });

  it('applies 0% discount (same as original)', () => {
    expect(formatSalePrice(50000, 0)).toBe('$50,000');
  });

  it('applies 100% discount → $0', () => {
    expect(formatSalePrice(50000, 100)).toBe('$0');
  });

  it('rounds to nearest dollar', () => {
    // 10000 * 0.97 = 9700 exactly
    expect(formatSalePrice(10000, 3)).toBe('$9,700');
  });
});

// ── formatMileage ──────────────────────────────────────────────────────────

describe('formatMileage()', () => {
  it('formats typical mileage with commas', () => {
    expect(formatMileage(28000)).toBe('28,000 mi');
  });

  it('formats zero as "0 mi"', () => {
    expect(formatMileage(0)).toBe('0 mi');
  });

  it('formats null as "0 mi"', () => {
    expect(formatMileage(null)).toBe('0 mi');
  });

  it('formats undefined as "0 mi"', () => {
    expect(formatMileage(undefined)).toBe('0 mi');
  });

  it('formats large mileage correctly', () => {
    expect(formatMileage(150000)).toBe('150,000 mi');
  });

  it('formats sub-1000 mileage without commas', () => {
    expect(formatMileage(500)).toBe('500 mi');
  });
});

// ── formatDate ─────────────────────────────────────────────────────────────

describe('formatDate()', () => {
  it('formats an ISO string as MM/DD/YYYY', () => {
    expect(formatDate('2026-07-23T10:00:00.000Z')).toMatch(/\d{2}\/\d{2}\/2026/);
  });

  it('formats a Date object', () => {
    const d = new Date('2026-01-15T00:00:00.000Z');
    const result = formatDate(d);
    expect(result).toContain('2026');
    expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}/);
  });

  it('returns "—" for null', () => {
    expect(formatDate(null)).toBe('—');
  });

  it('returns "—" for undefined', () => {
    expect(formatDate(undefined)).toBe('—');
  });

  it('returns "—" for empty string', () => {
    expect(formatDate('')).toBe('—');
  });

  it('returns "—" for an invalid date string', () => {
    expect(formatDate('not-a-date')).toBe('—');
  });
});

// ── formatDateRelative ─────────────────────────────────────────────────────

describe('formatDateRelative()', () => {
  it('returns "Today" for today\'s date', () => {
    expect(formatDateRelative(new Date().toISOString())).toBe('Today');
  });

  it('returns "Yesterday" for yesterday', () => {
    const yesterday = new Date(Date.now() - 86_400_000).toISOString();
    expect(formatDateRelative(yesterday)).toBe('Yesterday');
  });

  it('returns formatted date for older dates', () => {
    const old = '2025-01-01T00:00:00.000Z';
    const result = formatDateRelative(old);
    expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    expect(result).not.toBe('Today');
    expect(result).not.toBe('Yesterday');
  });

  it('returns "—" for null', () => {
    expect(formatDateRelative(null)).toBe('—');
  });

  it('returns "—" for undefined', () => {
    expect(formatDateRelative(undefined)).toBe('—');
  });

  it('returns "—" for invalid date', () => {
    expect(formatDateRelative('garbage')).toBe('—');
  });
});

// ── formatNumber ───────────────────────────────────────────────────────────

describe('formatNumber()', () => {
  it('formats large integers with commas', () => {
    expect(formatNumber(15000)).toBe('15,000');
  });

  it('formats zero', () => {
    expect(formatNumber(0)).toBe('0');
  });

  it('formats single-digit number', () => {
    expect(formatNumber(7)).toBe('7');
  });

  it('formats negative number', () => {
    expect(formatNumber(-5000)).toBe('-5,000');
  });

  it('formats 1 million', () => {
    expect(formatNumber(1_000_000)).toBe('1,000,000');
  });
});

// ── formatPercent ──────────────────────────────────────────────────────────

describe('formatPercent()', () => {
  it('formats 1.0 as "100.0%"', () => {
    expect(formatPercent(1.0)).toBe('100.0%');
  });

  it('formats 0.9912 as "99.1%"', () => {
    expect(formatPercent(0.9912)).toBe('99.1%');
  });

  it('formats 0 as "0.0%"', () => {
    expect(formatPercent(0)).toBe('0.0%');
  });

  it('formats 0.5 as "50.0%"', () => {
    expect(formatPercent(0.5)).toBe('50.0%');
  });

  it('rounds to one decimal place', () => {
    expect(formatPercent(0.3333)).toBe('33.3%');
  });
});
