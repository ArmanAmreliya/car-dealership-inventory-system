/**
 * useSearchParams Hook
 *
 * Generic hook that keeps a typed filter object in sync with the URL
 * query string. Reading from the URL on mount means users can bookmark
 * filtered views and the back button restores the previous filter state.
 *
 * Type parameter `T` must be a flat record where every value is
 * string | number | boolean | undefined — matching what URLSearchParams
 * can represent without nesting.
 *
 * Supports all filter shapes used across the app:
 *   VehicleFilters   – make, model, year, minPrice, maxPrice, availability
 *   InventoryFilters – search, availability (client-side only)
 *
 * Encoding rules:
 *   string   → raw string
 *   number   → String(n)
 *   boolean  → "true" | "false"
 *   undefined/empty → key omitted
 *
 * @example
 * ```ts
 * // On VehiclesListPage
 * const [filters, setFilters] = useSearchParams<VehicleFilters>(
 *   VEHICLE_PARAM_CONFIG,
 *   {}
 * );
 * // ?make=Toyota&minPrice=10000 → { make: 'Toyota', minPrice: 10000 }
 * ```
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// ── Types ──────────────────────────────────────────────────────────────────

/** Primitive types that can round-trip through URLSearchParams */
export type ParamValue = string | number | boolean | undefined;

/** A flat filter object whose values are all ParamValues */
export type FilterRecord = Record<string, ParamValue>;

/** How to decode a single URL param string back to the typed value */
export type ParamDecoder<T extends ParamValue> = (raw: string) => T;

/**
 * Per-key configuration that tells the hook how to decode each param.
 * Every key in the filter type should have a corresponding entry.
 */
export type ParamConfig<T extends FilterRecord> = {
  [K in keyof T]-?: {
    /** Decode raw URL string → typed value */
    decode: ParamDecoder<NonNullable<T[K]>>;
    /** Optional default value when the param is absent from the URL */
    defaultValue?: T[K];
  };
};

// ── Built-in decoders ──────────────────────────────────────────────────────

/** Decode as string (identity) */
export const decodeString: ParamDecoder<string> = (raw) => raw;

/** Decode as integer (NaN → caller decides via defaultValue) */
export const decodeInt: ParamDecoder<number> = (raw) => parseInt(raw, 10);

/** Decode as float */
export const decodeFloat: ParamDecoder<number> = (raw) => parseFloat(raw);

/** Decode "true"/"false" → boolean */
export const decodeBoolean: ParamDecoder<boolean> = (raw) => raw === 'true';

// ── Encode helpers (internal) ──────────────────────────────────────────────

function encodeValue(v: ParamValue): string | null {
  if (v === undefined || v === null || v === '') return null;
  return String(v);
}

function buildSearch<T extends FilterRecord>(filters: T): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    const encoded = encodeValue(value as ParamValue);
    if (encoded !== null) params.set(key, encoded);
  }
  const s = params.toString();
  return s ? `?${s}` : '';
}

function parseSearch<T extends FilterRecord>(
  search: string,
  config: ParamConfig<T>,
  defaults: Partial<T>
): T {
  const params = new URLSearchParams(search);
  const result: FilterRecord = { ...defaults };

  for (const key of Object.keys(config) as (keyof T & string)[]) {
    const raw = params.get(key);
    if (raw !== null && raw !== '') {
      try {
        const decoded = config[key].decode(raw);
        // Guard against NaN from numeric decoders
        if (typeof decoded === 'number' && isNaN(decoded)) {
          result[key] = config[key].defaultValue as ParamValue;
        } else {
          result[key] = decoded as ParamValue;
        }
      } catch {
        result[key] = config[key].defaultValue as ParamValue;
      }
    } else if (config[key].defaultValue !== undefined) {
      result[key] = config[key].defaultValue as ParamValue;
    }
  }

  return result as T;
}

// ── Hook ───────────────────────────────────────────────────────────────────

/**
 * useSearchParams
 *
 * Bidirectionally syncs a typed filter object with the browser URL.
 *
 * - On mount: reads current URL params → initial filter state.
 * - On filter change: pushes a new history entry with updated params.
 * - Popstate (back/forward navigation): restores filter state from URL.
 *
 * @param config   - Per-key decode configuration
 * @param defaults - Default filter values when params are absent
 * @returns [filters, setFilters] — same API as useState
 */
export function useSearchParams<T extends FilterRecord>(
  config: ParamConfig<T>,
  defaults: Partial<T> = {}
): [T, (next: Partial<T>) => void] {
  const navigate = useNavigate();
  const location = useLocation();

  // Parse URL on first render
  const [filters, setFiltersState] = useState<T>(() =>
    parseSearch(location.search, config, defaults)
  );

  // Track whether the last update came from us (to avoid re-parse loops)
  const internalUpdate = useRef(false);

  // When the URL changes externally (back/forward), re-parse
  useEffect(() => {
    if (internalUpdate.current) {
      internalUpdate.current = false;
      return;
    }
    setFiltersState(parseSearch(location.search, config, defaults));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  const setFilters = useCallback(
    (next: Partial<T>) => {
      const merged: T = { ...filters, ...next };
      setFiltersState(merged);
      internalUpdate.current = true;
      navigate({ search: buildSearch(merged) }, { replace: true });
    },
    [filters, navigate]
  );

  return [filters, setFilters];
}

// ── Pre-built configs ──────────────────────────────────────────────────────

import type { VehicleFilters } from '../features/vehicles/types/vehicle.types';

/**
 * Ready-made ParamConfig for VehicleFilters.
 * Import and pass directly to useSearchParams on VehiclesListPage.
 *
 * @example
 * ```ts
 * const [filters, setFilters] = useSearchParams(VEHICLE_PARAM_CONFIG, {});
 * ```
 */
export const VEHICLE_PARAM_CONFIG: ParamConfig<VehicleFilters> = {
  make:         { decode: decodeString },
  model:        { decode: decodeString },
  year:         { decode: decodeInt },
  availability: { decode: decodeBoolean },
  minPrice:     { decode: decodeFloat },
  maxPrice:     { decode: decodeFloat },
};

/**
 * Minimal config for client-side inventory search bar.
 * (Inventory endpoint accepts no query params; filtering is client-side.)
 */
export interface InventorySearchParams {
  search?: string;
  availability?: string;
}

export const INVENTORY_PARAM_CONFIG: ParamConfig<InventorySearchParams> = {
  search:       { decode: decodeString, defaultValue: '' },
  availability: { decode: decodeString, defaultValue: 'all' },
};
