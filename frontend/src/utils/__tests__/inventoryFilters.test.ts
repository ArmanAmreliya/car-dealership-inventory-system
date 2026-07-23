/**
 * inventoryFilters.ts — unit tests
 *
 * Covers:
 *   norm()                    — normalisation helper
 *   filterInventoryItems()    — search, status, stockLevel, manufacturer
 *   sortInventoryItems()      — all SortOption values + ties
 *   applyInventoryFilters()   — combined filter + sort pipeline
 *   mergeVehiclesWithInventory() — merge logic, quantity priority
 */

import {
  norm,
  filterInventoryItems,
  sortInventoryItems,
  applyInventoryFilters,
  mergeVehiclesWithInventory,
} from '../inventoryFilters';
import type { InventoryItemDTO, InventoryFilterState } from '../../features/inventory/types/inventory.types';
import type { VehicleDTO } from '../../api/api';

// ── Fixtures ──────────────────────────────────────────────────────────────

const NOW  = '2026-07-23T10:00:00.000Z';
const THEN = '2026-07-01T08:00:00.000Z';
const OLD  = '2026-06-01T06:00:00.000Z';

function makeVehicle(overrides: Partial<VehicleDTO> = {}): VehicleDTO {
  return {
    id:        overrides.id        ?? 'veh-001',
    vin:       overrides.vin       ?? '1HGBH41JXMN109186',
    make:      overrides.make      ?? 'BMW',
    model:     overrides.model     ?? '330i',
    year:      overrides.year      ?? 2023,
    price:     overrides.price     ?? 45000,
    mileage:   overrides.mileage   ?? 12000,
    color:     overrides.color     ?? 'White',
    createdAt: overrides.createdAt ?? THEN,
    updatedAt: overrides.updatedAt ?? NOW,
    ...overrides,
  };
}

function makeItem(overrides: Partial<InventoryItemDTO> & { vehicle?: Partial<VehicleDTO> } = {}): InventoryItemDTO {
  const { vehicle: vOverrides, ...rest } = overrides;
  return {
    id:        rest.id        ?? 'inv-001',
    vehicleId: rest.vehicleId ?? 'veh-001',
    quantity:  rest.quantity  ?? 1,
    available: rest.available ?? true,
    reserved:  rest.reserved  ?? false,
    createdAt: rest.createdAt ?? THEN,
    updatedAt: rest.updatedAt ?? NOW,
    vehicle:   makeVehicle({ id: rest.vehicleId ?? 'veh-001', ...vOverrides }),
    ...rest,
  };
}

const BMW     = makeItem({ id: 'inv-1', vehicleId: 'veh-1', quantity: 5, available: true,  vehicle: { make: 'BMW',      model: '330i',  year: 2023, price: 45000 } });
const TESLA   = makeItem({ id: 'inv-2', vehicleId: 'veh-2', quantity: 2, available: true,  vehicle: { make: 'Tesla',    model: 'Model 3', year: 2022, price: 55000 } });
const FORD    = makeItem({ id: 'inv-3', vehicleId: 'veh-3', quantity: 0, available: false, vehicle: { make: 'Ford',     model: 'F-150',  year: 2021, price: 38000 } });
const TOYOTA  = makeItem({ id: 'inv-4', vehicleId: 'veh-4', quantity: 3, available: true,  vehicle: { make: 'Toyota',   model: 'Camry',  year: 2024, price: 30000 } });
const RESERVED = makeItem({ id: 'inv-5', vehicleId: 'veh-5', quantity: 1, available: true, reserved: true,  vehicle: { make: 'Audi', model: 'A4', year: 2023, price: 48000 } });

const ALL_ITEMS = [BMW, TESLA, FORD, TOYOTA, RESERVED];

const DEFAULT_FILTERS: InventoryFilterState = {
  search:       '',
  status:       'all',
  stockLevel:   'all',
  manufacturer: 'all',
  sortBy:       'updated-desc',
};

// ── norm() ─────────────────────────────────────────────────────────────────

describe('norm()', () => {
  it('lowercases a string', () => expect(norm('BMW')).toBe('bmw'));
  it('trims whitespace',    () => expect(norm('  BMW  ')).toBe('bmw'));
  it('handles null',        () => expect(norm(null)).toBe(''));
  it('handles undefined',   () => expect(norm(undefined)).toBe(''));
  it('handles a number',    () => expect(norm(2023)).toBe('2023'));
  it('handles empty string',() => expect(norm('')).toBe(''));
});

// ── filterInventoryItems() — search ───────────────────────────────────────

describe('filterInventoryItems() — search', () => {
  it('returns all items when search is empty', () => {
    expect(filterInventoryItems(ALL_ITEMS, DEFAULT_FILTERS)).toHaveLength(5);
  });

  it('filters by make (case-insensitive)', () => {
    const result = filterInventoryItems(ALL_ITEMS, { ...DEFAULT_FILTERS, search: 'bmw' });
    expect(result).toHaveLength(1);
    expect(result[0].vehicle?.make).toBe('BMW');
  });

  it('filters by model substring', () => {
    const result = filterInventoryItems(ALL_ITEMS, { ...DEFAULT_FILTERS, search: '330' });
    expect(result).toHaveLength(1);
    expect(result[0].vehicle?.model).toBe('330i');
  });

  it('filters by year string', () => {
    const result = filterInventoryItems(ALL_ITEMS, { ...DEFAULT_FILTERS, search: '2022' });
    expect(result).toHaveLength(1);
    expect(result[0].vehicle?.year).toBe(2022);
  });

  it('returns empty array when no match', () => {
    const result = filterInventoryItems(ALL_ITEMS, { ...DEFAULT_FILTERS, search: 'zzznomatch' });
    expect(result).toHaveLength(0);
  });

  it('matches partial make+model combo', () => {
    const result = filterInventoryItems(ALL_ITEMS, { ...DEFAULT_FILTERS, search: 'tesla model' });
    expect(result).toHaveLength(1);
  });

  it('returns all items when search is whitespace only', () => {
    const result = filterInventoryItems(ALL_ITEMS, { ...DEFAULT_FILTERS, search: '   ' });
    expect(result).toHaveLength(5);
  });
});

// ── filterInventoryItems() — status ───────────────────────────────────────

describe('filterInventoryItems() — status filter', () => {
  it('status=available returns only available items', () => {
    const result = filterInventoryItems(ALL_ITEMS, { ...DEFAULT_FILTERS, status: 'available' });
    expect(result.every((i) => i.available)).toBe(true);
    expect(result.some((i) => !i.available)).toBe(false);
  });

  it('status=unavailable returns only unavailable items', () => {
    const result = filterInventoryItems(ALL_ITEMS, { ...DEFAULT_FILTERS, status: 'unavailable' });
    expect(result.every((i) => !i.available)).toBe(true);
  });

  it('status=reserved returns only reserved items', () => {
    const result = filterInventoryItems(ALL_ITEMS, { ...DEFAULT_FILTERS, status: 'reserved' });
    expect(result).toHaveLength(1);
    expect(result[0].reserved).toBe(true);
  });

  it('status=low-stock returns items with quantity <= 3', () => {
    const result = filterInventoryItems(ALL_ITEMS, { ...DEFAULT_FILTERS, status: 'low-stock' });
    expect(result.every((i) => i.quantity <= 3)).toBe(true);
  });

  it('status=all returns everything', () => {
    expect(filterInventoryItems(ALL_ITEMS, DEFAULT_FILTERS)).toHaveLength(5);
  });
});

// ── filterInventoryItems() — stockLevel ───────────────────────────────────

describe('filterInventoryItems() — stockLevel filter', () => {
  it('in-stock excludes items with quantity 0', () => {
    const result = filterInventoryItems(ALL_ITEMS, { ...DEFAULT_FILTERS, stockLevel: 'in-stock' });
    expect(result.every((i) => i.quantity > 0)).toBe(true);
  });

  it('out-of-stock returns only quantity = 0', () => {
    const result = filterInventoryItems(ALL_ITEMS, { ...DEFAULT_FILTERS, stockLevel: 'out-of-stock' });
    expect(result).toHaveLength(1);
    expect(result[0].quantity).toBe(0);
  });

  it('low-stock returns items with quantity in (0, 3]', () => {
    const result = filterInventoryItems(ALL_ITEMS, { ...DEFAULT_FILTERS, stockLevel: 'low-stock' });
    expect(result.every((i) => i.quantity > 0 && i.quantity <= 3)).toBe(true);
  });

  it('stockLevel=all returns everything', () => {
    expect(
      filterInventoryItems(ALL_ITEMS, { ...DEFAULT_FILTERS, stockLevel: 'all' })
    ).toHaveLength(5);
  });
});

// ── filterInventoryItems() — manufacturer ─────────────────────────────────

describe('filterInventoryItems() — manufacturer filter', () => {
  it('filters to exact manufacturer match', () => {
    const result = filterInventoryItems(ALL_ITEMS, { ...DEFAULT_FILTERS, manufacturer: 'BMW' });
    expect(result).toHaveLength(1);
    expect(result[0].vehicle?.make).toBe('BMW');
  });

  it('manufacturer match is case-insensitive', () => {
    const result = filterInventoryItems(ALL_ITEMS, { ...DEFAULT_FILTERS, manufacturer: 'bmw' });
    expect(result).toHaveLength(1);
  });

  it('manufacturer=all returns everything', () => {
    expect(
      filterInventoryItems(ALL_ITEMS, { ...DEFAULT_FILTERS, manufacturer: 'all' })
    ).toHaveLength(5);
  });

  it('returns empty when manufacturer does not exist', () => {
    expect(
      filterInventoryItems(ALL_ITEMS, { ...DEFAULT_FILTERS, manufacturer: 'Ferrari' })
    ).toHaveLength(0);
  });
});

// ── filterInventoryItems() — multiple filters ─────────────────────────────

describe('filterInventoryItems() — multiple active filters', () => {
  it('search + manufacturer combined', () => {
    const result = filterInventoryItems(ALL_ITEMS, {
      ...DEFAULT_FILTERS,
      search:       '330',
      manufacturer: 'BMW',
    });
    expect(result).toHaveLength(1);
  });

  it('status=available + manufacturer=BMW', () => {
    const result = filterInventoryItems(ALL_ITEMS, {
      ...DEFAULT_FILTERS,
      status:       'available',
      manufacturer: 'BMW',
    });
    expect(result).toHaveLength(1);
    expect(result[0].vehicle?.make).toBe('BMW');
  });

  it('returns empty when filters are mutually exclusive', () => {
    const result = filterInventoryItems(ALL_ITEMS, {
      ...DEFAULT_FILTERS,
      status:       'unavailable',
      manufacturer: 'BMW',
    });
    expect(result).toHaveLength(0);
  });

  it('empty inventory always returns empty', () => {
    expect(filterInventoryItems([], { ...DEFAULT_FILTERS, search: 'BMW' })).toHaveLength(0);
  });
});

// ── sortInventoryItems() ──────────────────────────────────────────────────

describe('sortInventoryItems()', () => {
  it('price-asc sorts ascending by price', () => {
    const sorted = sortInventoryItems(ALL_ITEMS, 'price-asc');
    const prices = sorted.map((i) => i.vehicle?.price ?? 0);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  it('price-desc sorts descending by price', () => {
    const sorted = sortInventoryItems(ALL_ITEMS, 'price-desc');
    const prices = sorted.map((i) => i.vehicle?.price ?? 0);
    expect(prices).toEqual([...prices].sort((a, b) => b - a));
  });

  it('name-asc sorts alphabetically by make+model', () => {
    const sorted = sortInventoryItems(ALL_ITEMS, 'name-asc');
    const names = sorted.map((i) => `${i.vehicle?.make} ${i.vehicle?.model}`);
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
  });

  it('name-desc sorts reverse alphabetically', () => {
    const sorted = sortInventoryItems(ALL_ITEMS, 'name-desc');
    const names = sorted.map((i) => `${i.vehicle?.make} ${i.vehicle?.model}`);
    expect(names).toEqual([...names].sort((a, b) => b.localeCompare(a)));
  });

  it('quantity-asc sorts ascending by quantity', () => {
    const sorted = sortInventoryItems(ALL_ITEMS, 'quantity-asc');
    const qtys = sorted.map((i) => i.quantity);
    expect(qtys).toEqual([...qtys].sort((a, b) => a - b));
  });

  it('quantity-desc sorts descending by quantity', () => {
    const sorted = sortInventoryItems(ALL_ITEMS, 'quantity-desc');
    const qtys = sorted.map((i) => i.quantity);
    expect(qtys).toEqual([...qtys].sort((a, b) => b - a));
  });

  it('updated-desc sorts by most recently updated first', () => {
    const a = makeItem({ id: 'a', vehicleId: 'va', updatedAt: NOW  });
    const b = makeItem({ id: 'b', vehicleId: 'vb', updatedAt: THEN });
    const c = makeItem({ id: 'c', vehicleId: 'vc', updatedAt: OLD  });
    const sorted = sortInventoryItems([c, a, b], 'updated-desc');
    expect(sorted.map((i) => i.id)).toEqual(['a', 'b', 'c']);
  });

  it('does not mutate the original array', () => {
    const original = [BMW, TESLA, FORD];
    const sorted = sortInventoryItems(original, 'price-asc');
    expect(original[0]).toBe(BMW); // unchanged
    expect(sorted).not.toBe(original);
  });

  it('returns empty array for empty input', () => {
    expect(sortInventoryItems([], 'price-asc')).toHaveLength(0);
  });
});

// ── applyInventoryFilters() ───────────────────────────────────────────────

describe('applyInventoryFilters()', () => {
  it('applies filter then sort in the correct order', () => {
    const result = applyInventoryFilters(ALL_ITEMS, {
      ...DEFAULT_FILTERS,
      status: 'available',
      sortBy: 'price-asc',
    });
    expect(result.every((i) => i.available)).toBe(true);
    const prices = result.map((i) => i.vehicle?.price ?? 0);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  it('returns empty array when no items pass filter', () => {
    const result = applyInventoryFilters(ALL_ITEMS, {
      ...DEFAULT_FILTERS,
      manufacturer: 'NonExistent',
    });
    expect(result).toHaveLength(0);
  });
});

// ── mergeVehiclesWithInventory() ──────────────────────────────────────────

describe('mergeVehiclesWithInventory()', () => {
  const v1 = makeVehicle({ id: 'veh-1', make: 'BMW' });
  const v2 = makeVehicle({ id: 'veh-2', make: 'Tesla' });
  const inv1: InventoryItemDTO = {
    id: 'inv-1', vehicleId: 'veh-1', quantity: 5, available: true,
    reserved: false, createdAt: THEN, updatedAt: NOW,
  };

  it('returns empty array when vehicles list is empty', () => {
    expect(mergeVehiclesWithInventory([], [inv1])).toHaveLength(0);
  });

  it('merges quantity from inventory item', () => {
    const result = mergeVehiclesWithInventory([v1], [inv1]);
    expect(result[0].quantity).toBe(5);
  });

  it('defaults quantity to 1 when no inventory record exists', () => {
    const result = mergeVehiclesWithInventory([v2], []);
    expect(result[0].quantity).toBe(1);
  });

  it('reads vehicle.stockQuantity as fallback when no inventory record', () => {
    const v = { ...v2, stockQuantity: 7 } as any;
    const result = mergeVehiclesWithInventory([v], []);
    expect(result[0].quantity).toBe(7);
  });

  it('inventory quantity has priority over vehicle.stockQuantity', () => {
    const v = { ...v1, stockQuantity: 99 } as any;
    const result = mergeVehiclesWithInventory([v], [inv1]);
    expect(result[0].quantity).toBe(5); // from inv1
  });

  it('attaches full vehicle object to each item', () => {
    const result = mergeVehiclesWithInventory([v1, v2], [inv1]);
    expect(result[0].vehicle).toBe(v1);
    expect(result[1].vehicle).toBe(v2);
  });

  it('derives available from inventory record', () => {
    const unavail: InventoryItemDTO = { ...inv1, available: false };
    const result = mergeVehiclesWithInventory([v1], [unavail]);
    expect(result[0].available).toBe(false);
  });

  it('derives available from quantity when no inventory record', () => {
    const result = mergeVehiclesWithInventory([v2], []);
    expect(result[0].available).toBe(true); // quantity 1 > 0
  });

  it('sets reserved from inventory item', () => {
    const reserved: InventoryItemDTO = { ...inv1, reserved: true };
    const result = mergeVehiclesWithInventory([v1], [reserved]);
    expect(result[0].reserved).toBe(true);
  });

  it('defaults reserved to false when no inventory record', () => {
    const result = mergeVehiclesWithInventory([v2], []);
    expect(result[0].reserved).toBe(false);
  });

  it('uses inventory id when available', () => {
    const result = mergeVehiclesWithInventory([v1], [inv1]);
    expect(result[0].id).toBe('inv-1');
  });

  it('falls back to vehicle id when no inventory record', () => {
    const result = mergeVehiclesWithInventory([v2], []);
    expect(result[0].id).toBe('veh-2');
  });

  it('produces one item per vehicle', () => {
    const result = mergeVehiclesWithInventory([v1, v2], [inv1]);
    expect(result).toHaveLength(2);
  });
});
