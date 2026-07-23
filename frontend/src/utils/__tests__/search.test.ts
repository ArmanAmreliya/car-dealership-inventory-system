/**
 * search.ts — unit tests
 *
 * Covers:
 *   norm(), matchesQuery()
 *   vehicleHaystack(), matchesVehicle(), filterVehicles()
 *   inventoryHaystack(), matchesInventoryItem(), filterInventoryItems()
 *   purchaseHaystack(), matchesPurchase(), filterPurchases()
 *   buildGlobalResults()
 *   highlightMatch()
 */

import {
  norm,
  matchesQuery,
  vehicleHaystack,
  matchesVehicle,
  filterVehicles,
  inventoryHaystack,
  matchesInventoryItem,
  filterInventoryItems,
  purchaseHaystack,
  matchesPurchase,
  filterPurchases,
  buildGlobalResults,
  highlightMatch,
} from '../search';
import type { VehicleDTO } from '../../api/api';
import type { InventoryItemDTO } from '../../features/inventory/types/inventory.types';
import type { PurchaseDTO } from '../../features/purchases/types/purchase.types';

// ── Fixtures ──────────────────────────────────────────────────────────────

function makeVehicle(overrides: Partial<VehicleDTO> = {}): VehicleDTO {
  return {
    id:        overrides.id        ?? 'v1',
    vin:       overrides.vin       ?? '1HGBH41JXMN109186',
    make:      overrides.make      ?? 'Toyota',
    model:     overrides.model     ?? 'Camry',
    year:      overrides.year      ?? 2022,
    price:     overrides.price     ?? 29999,
    color:     overrides.color     ?? 'Silver',
    createdAt: '2026-07-01T00:00:00.000Z',
    updatedAt: '2026-07-01T00:00:00.000Z',
    ...overrides,
  };
}

function makeInventoryItem(overrides: Partial<InventoryItemDTO> = {}): InventoryItemDTO {
  return {
    id:        overrides.id        ?? 'i1',
    vehicleId: overrides.vehicleId ?? 'v1',
    quantity:  overrides.quantity  ?? 1,
    available: overrides.available ?? true,
    createdAt: '2026-07-01T00:00:00.000Z',
    updatedAt: '2026-07-01T00:00:00.000Z',
    vehicle:   overrides.vehicle   ?? makeVehicle(),
    ...overrides,
  };
}

function makePurchase(overrides: Partial<PurchaseDTO> = {}): PurchaseDTO {
  return {
    id:          overrides.id          ?? 'p1',
    vehicleId:   overrides.vehicleId   ?? 'v1',
    userId:      overrides.userId      ?? 'u1',
    quantity:    overrides.quantity    ?? 1,
    purchasedAt: overrides.purchasedAt ?? '2026-07-01T00:00:00.000Z',
    vehicle:     overrides.vehicle     ?? makeVehicle(),
    ...overrides,
  };
}

// ── norm() ─────────────────────────────────────────────────────────────────

describe('norm()', () => {
  it('lowercases',              () => expect(norm('Toyota')).toBe('toyota'));
  it('trims whitespace',        () => expect(norm('  BMW  ')).toBe('bmw'));
  it('handles null',            () => expect(norm(null)).toBe(''));
  it('handles undefined',       () => expect(norm(undefined)).toBe(''));
  it('handles empty string',    () => expect(norm('')).toBe(''));
  it('handles numbers',         () => expect(norm(2022 as any)).toBe('2022'));
});

// ── matchesQuery() ─────────────────────────────────────────────────────────

describe('matchesQuery()', () => {
  it('returns true for empty query',        () => expect(matchesQuery('toyota camry', '')).toBe(true));
  it('returns true for whitespace query',   () => expect(matchesQuery('toyota camry', '   ')).toBe(true));
  it('case-insensitive match',              () => expect(matchesQuery('Toyota Camry', 'camry')).toBe(true));
  it('partial word match',                  () => expect(matchesQuery('Toyota Camry 2022', 'cam')).toBe(true));
  it('multi-word query (all words present)',() => expect(matchesQuery('toyota camry 2022', 'camry 2022')).toBe(true));
  it('multi-word fails when one word absent',() => expect(matchesQuery('toyota camry', 'camry 2022')).toBe(false));
  it('returns false when haystack empty',   () => expect(matchesQuery('', 'toyota')).toBe(false));
  it('exact match works',                   () => expect(matchesQuery('ford f-150', 'ford f-150')).toBe(true));
});

// ── vehicleHaystack() ──────────────────────────────────────────────────────

describe('vehicleHaystack()', () => {
  it('includes year, make, model, vin, color, price, id', () => {
    const v = makeVehicle();
    const h = vehicleHaystack(v);
    expect(h).toContain('2022');
    expect(h).toContain('toyota');
    expect(h).toContain('camry');
    expect(h).toContain('1hgbh41jxmn109186');
    expect(h).toContain('29999');
  });
});

// ── matchesVehicle() ───────────────────────────────────────────────────────

describe('matchesVehicle()', () => {
  const v = makeVehicle({ make: 'BMW', model: '330i', year: 2023, vin: 'WBAFR7C57BC123456' });

  it('matches by make',     () => expect(matchesVehicle(v, 'bmw')).toBe(true));
  it('matches by model',    () => expect(matchesVehicle(v, '330i')).toBe(true));
  it('matches by year',     () => expect(matchesVehicle(v, '2023')).toBe(true));
  it('matches by VIN',      () => expect(matchesVehicle(v, 'WBAFR7C57BC123456')).toBe(true));
  it('no match for wrong make', () => expect(matchesVehicle(v, 'Toyota')).toBe(false));
  it('empty query returns true',() => expect(matchesVehicle(v, '')).toBe(true));
  it('whitespace query returns true',() => expect(matchesVehicle(v, '  ')).toBe(true));
});

// ── filterVehicles() ───────────────────────────────────────────────────────

describe('filterVehicles()', () => {
  const vehicles = [
    makeVehicle({ id: 'v1', make: 'BMW',   model: '330i' }),
    makeVehicle({ id: 'v2', make: 'Tesla', model: 'Model 3' }),
    makeVehicle({ id: 'v3', make: 'Ford',  model: 'F-150' }),
  ];

  it('returns all vehicles for empty query',    () => expect(filterVehicles(vehicles, '')).toBe(vehicles));
  it('returns matching vehicles for query',     () => expect(filterVehicles(vehicles, 'bmw')).toHaveLength(1));
  it('returns empty for no match',              () => expect(filterVehicles(vehicles, 'xyz')).toHaveLength(0));
  it('case-insensitive filter',                 () => expect(filterVehicles(vehicles, 'TESLA')).toHaveLength(1));
  it('matches model substring',                 () => expect(filterVehicles(vehicles, 'model')).toHaveLength(1));
});

// ── inventoryHaystack() ────────────────────────────────────────────────────

describe('inventoryHaystack()', () => {
  it('includes vehicleId', () => {
    const item = makeInventoryItem({ vehicleId: 'veh-abc' });
    expect(inventoryHaystack(item)).toContain('veh-abc');
  });

  it('includes vehicle fields when present', () => {
    const item = makeInventoryItem({ vehicle: makeVehicle({ make: 'Mercedes', model: 'C300' }) });
    const h = inventoryHaystack(item);
    expect(h).toContain('mercedes');
    expect(h).toContain('c300');
  });

  it('works without vehicle relation', () => {
    const item = makeInventoryItem({ vehicleId: 'veh-x', vehicle: undefined });
    expect(() => inventoryHaystack(item)).not.toThrow();
    expect(inventoryHaystack(item)).toContain('veh-x');
  });
});

// ── matchesInventoryItem() ─────────────────────────────────────────────────

describe('matchesInventoryItem()', () => {
  const item = makeInventoryItem({
    vehicleId: 'veh-001',
    vehicle:   makeVehicle({ make: 'Audi', model: 'A4', year: 2023 }),
  });

  it('matches by vehicleId',  () => expect(matchesInventoryItem(item, 'veh-001')).toBe(true));
  it('matches by make',       () => expect(matchesInventoryItem(item, 'audi')).toBe(true));
  it('matches by model',      () => expect(matchesInventoryItem(item, 'a4')).toBe(true));
  it('matches by year',       () => expect(matchesInventoryItem(item, '2023')).toBe(true));
  it('no match for wrong make',() => expect(matchesInventoryItem(item, 'bmw')).toBe(false));
  it('empty query returns true',() => expect(matchesInventoryItem(item, '')).toBe(true));
});

// ── filterInventoryItems() — search util ──────────────────────────────────

describe('filterInventoryItems() from search.ts', () => {
  const items = [
    makeInventoryItem({ id: 'i1', vehicle: makeVehicle({ make: 'BMW' }) }),
    makeInventoryItem({ id: 'i2', vehicle: makeVehicle({ make: 'Tesla' }) }),
  ];

  it('returns all for empty query', () => expect(filterInventoryItems(items, '')).toBe(items));
  it('filters by make',             () => expect(filterInventoryItems(items, 'bmw')).toHaveLength(1));
  it('no match returns empty',      () => expect(filterInventoryItems(items, 'ferrari')).toHaveLength(0));
});

// ── matchesPurchase() ──────────────────────────────────────────────────────

describe('matchesPurchase()', () => {
  const p = makePurchase({
    id:        'pur-001',
    vehicleId: 'veh-001',
    userId:    'usr-001',
    vehicle:   makeVehicle({ make: 'Porsche', model: '911' }),
  });

  it('matches by purchase id',  () => expect(matchesPurchase(p, 'pur-001')).toBe(true));
  it('matches by vehicleId',    () => expect(matchesPurchase(p, 'veh-001')).toBe(true));
  it('matches by vehicle make', () => expect(matchesPurchase(p, 'porsche')).toBe(true));
  it('matches by vehicle model',() => expect(matchesPurchase(p, '911')).toBe(true));
  it('no match for wrong make', () => expect(matchesPurchase(p, 'ferrari')).toBe(false));
  it('empty query returns true',() => expect(matchesPurchase(p, '')).toBe(true));
});

// ── filterPurchases() ─────────────────────────────────────────────────────

describe('filterPurchases()', () => {
  const purchases = [
    makePurchase({ id: 'p1', vehicle: makeVehicle({ make: 'Honda' }) }),
    makePurchase({ id: 'p2', vehicle: makeVehicle({ make: 'Kia' }) }),
  ];

  it('returns all for empty query', () => expect(filterPurchases(purchases, '')).toBe(purchases));
  it('filters by vehicle make',     () => expect(filterPurchases(purchases, 'honda')).toHaveLength(1));
  it('no match returns empty',      () => expect(filterPurchases(purchases, 'bmw')).toHaveLength(0));
});

// ── buildGlobalResults() ───────────────────────────────────────────────────

describe('buildGlobalResults()', () => {
  const vehicles = [
    makeVehicle({ id: 'v1', make: 'BMW',   model: '330i', vin: 'VIN001' }),
    makeVehicle({ id: 'v2', make: 'Tesla', model: 'Model 3', vin: 'VIN002' }),
  ];
  const inventoryItems: InventoryItemDTO[] = [
    makeInventoryItem({ id: 'i1', vehicleId: 'v3', vehicle: makeVehicle({ id: 'v3', make: 'Ford', model: 'F-150', vin: 'VIN003' }) }),
  ];
  const purchases: PurchaseDTO[] = [
    makePurchase({ id: 'p1', vehicleId: 'v1', vehicle: vehicles[0] }),
  ];

  const vehicleDetail = (id: string) => `/vehicles/${id}`;
  const invPath = '/inventory';

  it('returns empty for empty query', () => {
    expect(buildGlobalResults('', vehicles, inventoryItems, purchases, vehicleDetail, invPath)).toHaveLength(0);
  });

  it('returns empty for whitespace query', () => {
    expect(buildGlobalResults('   ', vehicles, [], [], vehicleDetail, invPath)).toHaveLength(0);
  });

  it('finds vehicles matching query', () => {
    const results = buildGlobalResults('bmw', vehicles, [], [], vehicleDetail, invPath);
    expect(results).toHaveLength(1);
    expect(results[0].section).toBe('vehicle');
    expect(results[0].label).toContain('BMW');
  });

  it('finds inventory items not already in vehicle results', () => {
    const results = buildGlobalResults('ford', [], inventoryItems, [], vehicleDetail, invPath);
    expect(results).toHaveLength(1);
    expect(results[0].section).toBe('inventory');
  });

  it('deduplicates vehicle already in inventory', () => {
    // v1 appears in both vehicles and purchases — only one result per vehicle
    const results = buildGlobalResults('bmw', vehicles, [], purchases, vehicleDetail, invPath);
    const vehicleResults = results.filter((r) => r.section === 'vehicle');
    const bmwResults = vehicleResults.filter((r) => r.label.includes('BMW'));
    expect(bmwResults).toHaveLength(1);
  });

  it('finds purchase results', () => {
    const results = buildGlobalResults('v1', [], [], purchases, vehicleDetail, invPath);
    const purchaseResults = results.filter((r) => r.section === 'purchase');
    expect(purchaseResults).toHaveLength(1);
  });

  it('each result has key, section, label, href', () => {
    const results = buildGlobalResults('bmw', vehicles, [], [], vehicleDetail, invPath);
    expect(results[0]).toHaveProperty('key');
    expect(results[0]).toHaveProperty('section');
    expect(results[0]).toHaveProperty('label');
    expect(results[0]).toHaveProperty('href');
  });

  it('href for vehicle result points to vehicle detail path', () => {
    const results = buildGlobalResults('bmw', vehicles, [], [], vehicleDetail, invPath);
    expect(results[0].href).toBe('/vehicles/v1');
  });

  it('all keys are unique', () => {
    const results = buildGlobalResults('a', vehicles, inventoryItems, purchases, vehicleDetail, invPath);
    const keys = results.map((r) => r.key);
    expect(new Set(keys).size).toBe(keys.length);
  });
});

// ── highlightMatch() ───────────────────────────────────────────────────────

describe('highlightMatch()', () => {
  it('returns single non-highlighted segment for empty query', () => {
    const segs = highlightMatch('Toyota Camry', '');
    expect(segs).toHaveLength(1);
    expect(segs[0]).toEqual({ text: 'Toyota Camry', highlight: false });
  });

  it('returns single non-highlighted segment for no match', () => {
    const segs = highlightMatch('Toyota Camry', 'BMW');
    expect(segs).toHaveLength(1);
    expect(segs[0].highlight).toBe(false);
  });

  it('highlights matching segment', () => {
    const segs = highlightMatch('Toyota Camry', 'Camry');
    const highlighted = segs.filter((s) => s.highlight);
    expect(highlighted).toHaveLength(1);
    expect(highlighted[0].text.toLowerCase()).toBe('camry');
  });

  it('splits label into before / match / after', () => {
    const segs = highlightMatch('Toyota Camry 2022', 'Camry');
    expect(segs.length).toBeGreaterThanOrEqual(2);
    const texts = segs.map((s) => s.text).join('');
    expect(texts).toBe('Toyota Camry 2022');
  });

  it('full string match → single highlighted segment', () => {
    const segs = highlightMatch('BMW', 'BMW');
    expect(segs).toHaveLength(1);
    expect(segs[0].highlight).toBe(true);
    expect(segs[0].text).toBe('BMW');
  });

  it('case-insensitive match preserves original case in output', () => {
    const segs = highlightMatch('Toyota', 'toyota');
    const highlighted = segs.filter((s) => s.highlight);
    expect(highlighted[0].text).toBe('Toyota'); // original case preserved
  });

  it('concatenating all segment texts reconstructs the original label', () => {
    const label = 'Ford F-150 2021';
    const segs = highlightMatch(label, 'F-150');
    expect(segs.map((s) => s.text).join('')).toBe(label);
  });
});
