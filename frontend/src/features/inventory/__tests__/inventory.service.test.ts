/**
 * normalizeInventoryItem() + inventoryService — unit tests
 *
 * normalizeInventoryItem covers:
 *   - flat API response (shape A)
 *   - nested vehicle response (shape B)
 *   - imageUrl preservation from both shapes
 *   - quantity: stockQuantity priority, quantity fallback, isAvailable fallback
 *   - availability: available boolean, isAvailable boolean
 *   - reserved flag defaulting to false
 *   - timestamps from root and nested vehicle
 *   - missing / malformed / null / undefined input
 *
 * inventoryService covers:
 *   - successful GET /v1/inventory → normalization applied
 *   - 404 error propagated
 *   - 500 error propagated
 *   - network failure propagated
 *   - PATCH /v1/inventory/:id success
 *   - PATCH error propagated
 */

import { vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import {
  normalizeInventoryItem,
  inventoryService,
} from '../services/inventory.service';

// ── Mock axios-client so no real HTTP calls are made ──────────────────────

vi.mock('../../../api/axios-client', () => ({
  apiClient: {
    get: vi.fn(),
    patch: vi.fn(),
  },
}));

import { apiClient } from '../../../api/axios-client';

const mockGet   = apiClient.get   as ReturnType<typeof vi.fn>;
const mockPatch = apiClient.patch as ReturnType<typeof vi.fn>;

// ── Fixtures ──────────────────────────────────────────────────────────────

const NOW = '2026-07-23T10:00:00.000Z';
const THEN = '2026-07-01T08:00:00.000Z';
const CLOUDINARY = 'https://res.cloudinary.com/demo/image/upload/v1/car.jpg';

/** Flat backend shape (from /v1/inventory) */
const FLAT_RAW = {
  id:           'inv-001',
  vehicleId:    'veh-001',
  make:         'BMW',
  model:        '330i',
  year:         2023,
  vin:          '1HGBH41JXMN109186',
  price:        45000,
  mileage:      12000,
  color:        'White',
  imageUrl:     CLOUDINARY,
  stockQuantity: 3,
  isAvailable:  true,
  createdAt:    THEN,
  updatedAt:    NOW,
};

/** Nested vehicle shape (from PATCH /v1/inventory/:id) */
const NESTED_RAW = {
  id:        'inv-002',
  vehicleId: 'veh-002',
  quantity:  2,
  available: true,
  reserved:  false,
  createdAt: THEN,
  updatedAt: NOW,
  vehicle: {
    id:        'veh-002',
    vin:       'WBAFR7C57BC123456',
    make:      'Mercedes',
    model:     'C300',
    year:      2022,
    price:     52000,
    mileage:   8000,
    color:     'Black',
    imageUrl:  CLOUDINARY,
    createdAt: THEN,
    updatedAt: NOW,
  },
};

// ═════════════════════════════════════════════════════════════════════════
// normalizeInventoryItem
// ═════════════════════════════════════════════════════════════════════════

describe('normalizeInventoryItem()', () => {

  // ── IDs ────────────────────────────────────────────────────────────────

  describe('IDs', () => {
    it('reads id and vehicleId from flat response', () => {
      const result = normalizeInventoryItem(FLAT_RAW);
      expect(result.id).toBe('inv-001');
      expect(result.vehicleId).toBe('veh-001');
    });

    it('reads id and vehicleId from nested response', () => {
      const result = normalizeInventoryItem(NESTED_RAW);
      expect(result.id).toBe('inv-002');
      expect(result.vehicleId).toBe('veh-002');
    });

    it('falls back to vehicleId when id is absent', () => {
      const result = normalizeInventoryItem({ vehicleId: 'veh-x', stockQuantity: 1 });
      expect(result.id).toBe('veh-x');
      expect(result.vehicleId).toBe('veh-x');
    });

    it('falls back to empty string when both id and vehicleId are absent', () => {
      const result = normalizeInventoryItem({ stockQuantity: 1 });
      expect(result.id).toBe('');
    });
  });

  // ── Vehicle scalar fields ──────────────────────────────────────────────

  describe('vehicle scalar fields — flat response', () => {
    it('maps make, model, year, vin, price from flat', () => {
      const r = normalizeInventoryItem(FLAT_RAW);
      expect(r.vehicle?.make).toBe('BMW');
      expect(r.vehicle?.model).toBe('330i');
      expect(r.vehicle?.year).toBe(2023);
      expect(r.vehicle?.vin).toBe('1HGBH41JXMN109186');
      expect(r.vehicle?.price).toBe(45000);
    });

    it('maps mileage and color from flat', () => {
      const r = normalizeInventoryItem(FLAT_RAW);
      expect(r.vehicle?.mileage).toBe(12000);
      expect(r.vehicle?.color).toBe('White');
    });
  });

  describe('vehicle scalar fields — nested vehicle object', () => {
    it('reads make/model from nested vehicle (priority over flat)', () => {
      const r = normalizeInventoryItem({
        ...FLAT_RAW,
        make: 'OldMake',
        vehicle: { make: 'Mercedes', model: 'C300', vin: 'X', year: 2022, price: 52000 },
      });
      expect(r.vehicle?.make).toBe('Mercedes');
      expect(r.vehicle?.model).toBe('C300');
    });

    it('falls back to flat make when nested vehicle.make is absent', () => {
      const r = normalizeInventoryItem({ ...FLAT_RAW, vehicle: { model: 'X' } });
      expect(r.vehicle?.make).toBe('BMW');
    });

    it('defaults make and model to empty string when both absent', () => {
      const r = normalizeInventoryItem({ id: 'x', vehicleId: 'x' });
      expect(r.vehicle?.make).toBe('');
      expect(r.vehicle?.model).toBe('');
    });

    it('defaults year and price to 0 when absent', () => {
      const r = normalizeInventoryItem({ id: 'x', vehicleId: 'x' });
      expect(r.vehicle?.year).toBe(0);
      expect(r.vehicle?.price).toBe(0);
    });
  });

  // ── imageUrl preservation ──────────────────────────────────────────────

  describe('imageUrl preservation', () => {
    it('preserves imageUrl from flat response', () => {
      const r = normalizeInventoryItem(FLAT_RAW);
      expect(r.vehicle?.imageUrl).toBe(CLOUDINARY);
    });

    it('preserves imageUrl from nested vehicle', () => {
      const r = normalizeInventoryItem(NESTED_RAW);
      expect(r.vehicle?.imageUrl).toBe(CLOUDINARY);
    });

    it('nested vehicle.imageUrl has priority over flat imageUrl', () => {
      const r = normalizeInventoryItem({
        ...FLAT_RAW,
        imageUrl:  'https://flat.example.com/old.jpg',
        vehicle:   { imageUrl: CLOUDINARY },
      });
      expect(r.vehicle?.imageUrl).toBe(CLOUDINARY);
    });

    it('omits imageUrl from vehicle when both sources are empty', () => {
      const r = normalizeInventoryItem({ id: 'x', vehicleId: 'x', imageUrl: '' });
      expect(r.vehicle?.imageUrl).toBeUndefined();
    });

    it('omits imageUrl when imageUrl is null', () => {
      const r = normalizeInventoryItem({ id: 'x', vehicleId: 'x', imageUrl: null });
      expect(r.vehicle?.imageUrl).toBeUndefined();
    });
  });

  // ── Quantity ───────────────────────────────────────────────────────────

  describe('quantity resolution', () => {
    it('uses stockQuantity when present (flat shape)', () => {
      expect(normalizeInventoryItem({ ...FLAT_RAW, stockQuantity: 5 }).quantity).toBe(5);
    });

    it('uses stockQuantity = 0 correctly', () => {
      expect(normalizeInventoryItem({ ...FLAT_RAW, stockQuantity: 0 }).quantity).toBe(0);
    });

    it('falls back to quantity field when stockQuantity absent', () => {
      const raw = { id: 'x', vehicleId: 'x', quantity: 4 };
      expect(normalizeInventoryItem(raw).quantity).toBe(4);
    });

    it('stockQuantity has priority over quantity', () => {
      const raw = { id: 'x', vehicleId: 'x', stockQuantity: 7, quantity: 2 };
      expect(normalizeInventoryItem(raw).quantity).toBe(7);
    });

    it('defaults to 1 when neither field present and isAvailable not false', () => {
      expect(normalizeInventoryItem({ id: 'x', vehicleId: 'x' }).quantity).toBe(1);
    });

    it('defaults to 0 when neither field present and isAvailable is false', () => {
      expect(
        normalizeInventoryItem({ id: 'x', vehicleId: 'x', isAvailable: false }).quantity
      ).toBe(0);
    });
  });

  // ── Availability ───────────────────────────────────────────────────────

  describe('availability', () => {
    it('reads available boolean (true)', () => {
      expect(normalizeInventoryItem({ ...NESTED_RAW, available: true }).available).toBe(true);
    });

    it('reads available boolean (false)', () => {
      expect(normalizeInventoryItem({ ...NESTED_RAW, available: false }).available).toBe(false);
    });

    it('falls back to isAvailable when available absent', () => {
      expect(
        normalizeInventoryItem({ id: 'x', vehicleId: 'x', isAvailable: false }).available
      ).toBe(false);
    });

    it('derives available from quantity when both boolean fields absent', () => {
      const r = normalizeInventoryItem({ id: 'x', vehicleId: 'x', stockQuantity: 0 });
      expect(r.available).toBe(false);
    });

    it('available = true when derived from positive quantity', () => {
      const r = normalizeInventoryItem({ id: 'x', vehicleId: 'x', stockQuantity: 2 });
      expect(r.available).toBe(true);
    });
  });

  // ── Reserved flag ──────────────────────────────────────────────────────

  describe('reserved flag', () => {
    it('defaults reserved to false when absent', () => {
      expect(normalizeInventoryItem(FLAT_RAW).reserved).toBe(false);
    });

    it('preserves reserved = true', () => {
      expect(normalizeInventoryItem({ ...FLAT_RAW, reserved: true }).reserved).toBe(true);
    });
  });

  // ── Timestamps ────────────────────────────────────────────────────────

  describe('timestamps', () => {
    it('reads createdAt and updatedAt from flat root', () => {
      const r = normalizeInventoryItem(FLAT_RAW);
      expect(r.createdAt).toBe(THEN);
      expect(r.updatedAt).toBe(NOW);
    });

    it('reads timestamps from nested vehicle when root is absent', () => {
      const raw = {
        id: 'x', vehicleId: 'x',
        vehicle: { createdAt: THEN, updatedAt: NOW },
      };
      const r = normalizeInventoryItem(raw);
      expect(r.createdAt).toBe(THEN);
      expect(r.updatedAt).toBe(NOW);
    });

    it('root timestamps have priority over nested vehicle timestamps', () => {
      const raw = {
        ...FLAT_RAW,
        createdAt: NOW,
        vehicle: { createdAt: THEN, updatedAt: THEN },
      };
      expect(normalizeInventoryItem(raw).createdAt).toBe(NOW);
    });

    it('generates ISO timestamp when both sources absent', () => {
      const r = normalizeInventoryItem({ id: 'x', vehicleId: 'x' });
      expect(r.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
      expect(r.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    });
  });

  // ── Malformed / null / undefined ──────────────────────────────────────

  describe('malformed / edge-case inputs', () => {
    it('handles completely empty object without throwing', () => {
      expect(() => normalizeInventoryItem({})).not.toThrow();
    });

    it('handles null without throwing', () => {
      expect(() => normalizeInventoryItem(null)).not.toThrow();
    });

    it('handles undefined without throwing', () => {
      expect(() => normalizeInventoryItem(undefined)).not.toThrow();
    });

    it('returns an InventoryItemDTO shape for null input', () => {
      const r = normalizeInventoryItem(null);
      expect(r).toHaveProperty('id');
      expect(r).toHaveProperty('vehicleId');
      expect(r).toHaveProperty('quantity');
      expect(r).toHaveProperty('available');
      expect(r).toHaveProperty('vehicle');
    });

    it('preserves extra fields from nested vehicle via spread', () => {
      const raw = {
        id: 'x', vehicleId: 'x',
        vehicle: { make: 'BMW', model: 'X5', customField: 'extra', vin: 'X', year: 2022, price: 1 },
      };
      const r = normalizeInventoryItem(raw);
      expect((r.vehicle as any).customField).toBe('extra');
    });
  });
});

// ═════════════════════════════════════════════════════════════════════════
// inventoryService — API calls
// ═════════════════════════════════════════════════════════════════════════

describe('inventoryService.getInventory()', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns normalized items from a successful response', async () => {
    mockGet.mockResolvedValueOnce({
      data: {
        items: [FLAT_RAW],
        totalVehicles: 1,
        availableVehicles: 1,
      },
    });

    const result = await inventoryService.getInventory();

    expect(result.items).toHaveLength(1);
    expect(result.items[0].vehicle?.make).toBe('BMW');
    expect(result.items[0].quantity).toBe(3); // from stockQuantity
    expect(result.totalVehicles).toBe(1);
  });

  it('handles array-shaped response (no .items wrapper)', async () => {
    mockGet.mockResolvedValueOnce({ data: [FLAT_RAW] });
    const result = await inventoryService.getInventory();
    expect(result.items).toHaveLength(1);
  });

  it('returns empty items for empty response', async () => {
    mockGet.mockResolvedValueOnce({ data: { items: [], totalVehicles: 0, availableVehicles: 0 } });
    const result = await inventoryService.getInventory();
    expect(result.items).toHaveLength(0);
  });

  it('propagates a 404 error', async () => {
    const err = Object.assign(new Error('Not Found'), { response: { status: 404 } });
    mockGet.mockRejectedValueOnce(err);
    await expect(inventoryService.getInventory()).rejects.toThrow('Not Found');
  });

  it('propagates a 500 error', async () => {
    const err = Object.assign(new Error('Internal Server Error'), { response: { status: 500 } });
    mockGet.mockRejectedValueOnce(err);
    await expect(inventoryService.getInventory()).rejects.toThrow('Internal Server Error');
  });

  it('propagates a network failure', async () => {
    mockGet.mockRejectedValueOnce(new Error('Network Error'));
    await expect(inventoryService.getInventory()).rejects.toThrow('Network Error');
  });

  it('computes availableVehicles from items when backend omits it', async () => {
    const items = [
      { ...FLAT_RAW, isAvailable: true },
      { ...FLAT_RAW, id: 'inv-002', vehicleId: 'veh-002', isAvailable: false, available: false },
    ];
    mockGet.mockResolvedValueOnce({ data: { items } });
    const result = await inventoryService.getInventory();
    // available is derived from `available` boolean (both present) or `isAvailable`
    const availCount = result.items.filter((i) => i.available).length;
    expect(result.availableVehicles).toBe(availCount);
  });
});

describe('inventoryService.updateStock()', () => {
  beforeEach(() => vi.clearAllMocks());

  it('PATCHes the correct endpoint and returns normalized item', async () => {
    mockPatch.mockResolvedValueOnce({
      data: { ...FLAT_RAW, stockQuantity: 5, isAvailable: true },
    });

    const result = await inventoryService.updateStock('inv-001', { stockQuantity: 5 });

    expect(mockPatch).toHaveBeenCalledWith(
      '/v1/inventory/inv-001',
      expect.objectContaining({ stockQuantity: 5 })
    );
    expect(result.quantity).toBe(5);
    expect(result.available).toBe(true);
  });

  it('sets available = false when stockQuantity is 0', async () => {
    mockPatch.mockResolvedValueOnce({ data: {} });
    const result = await inventoryService.updateStock('inv-001', { stockQuantity: 0 });
    expect(result.available).toBe(false);
  });

  it('propagates PATCH 403 error', async () => {
    const err = Object.assign(new Error('Forbidden'), { response: { status: 403 } });
    mockPatch.mockRejectedValueOnce(err);
    await expect(
      inventoryService.updateStock('inv-001', { stockQuantity: 1 })
    ).rejects.toThrow('Forbidden');
  });

  it('uses returned stockQuantity over payload qty when both present', async () => {
    mockPatch.mockResolvedValueOnce({
      data: { id: 'inv-001', vehicleId: 'veh-001', stockQuantity: 8 },
    });
    const result = await inventoryService.updateStock('inv-001', { stockQuantity: 3 });
    expect(result.quantity).toBe(8);
  });
});
