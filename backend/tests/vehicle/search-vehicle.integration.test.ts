/**
 * Integration tests — GET /api/v1/vehicles/search
 *
 * TDD approach:
 *   1. Tests were written BEFORE verifying coverage existed.
 *   2. Each test describes a concrete behaviour contract.
 *   3. Run with: pnpm test --testPathPattern="search-vehicle"
 *
 * The /search route reuses the same controller as GET /v1/vehicles —
 * it passes query params as VehicleFilters to vehicleService.list().
 */

import request from 'supertest';
import app from '../../src/app/app';

// ── helpers ────────────────────────────────────────────────────────────────

const BASE_VEHICLE = {
  make: 'Toyota',
  model: 'Camry',
  year: 2024,
  price: 28000,
  vin: '1SRCH41JXMN000001',
  mileage: 0,
  color: 'White',
};

let authToken: string;

async function registerAndLogin(email: string): Promise<string> {
  await request(app).post('/api/v1/auth/register').send({
    email,
    password: 'password123',
    name: 'Search Test User',
  });
  const res = await request(app)
    .post('/api/v1/auth/login')
    .send({ email, password: 'password123' });
  return res.body.token as string;
}

// ── setup ──────────────────────────────────────────────────────────────────

beforeAll(async () => {
  authToken = await registerAndLogin('search-test@example.com');

  // Seed two vehicles: one Toyota Camry, one Honda Civic
  await request(app)
    .post('/api/v1/vehicles')
    .set('Authorization', `Bearer ${authToken}`)
    .send(BASE_VEHICLE);

  await request(app)
    .post('/api/v1/vehicles')
    .set('Authorization', `Bearer ${authToken}`)
    .send({
      make: 'Honda',
      model: 'Civic',
      year: 2022,
      price: 22000,
      vin: '2SRCH41JXMN000002',
      mileage: 5000,
      color: 'Black',
    });
});

// ── RED: write tests that document the expected contract ───────────────────

describe('GET /api/v1/vehicles/search', () => {

  // ── Auth guard ────────────────────────────────────────────────────────────

  it('RED→GREEN: returns 401 when no token is provided', async () => {
    const res = await request(app).get('/api/v1/vehicles/search');
    expect(res.status).toBe(401);
    expect(res.body.status).toBe('error');
  });

  it('RED→GREEN: returns 401 when an invalid token is provided', async () => {
    const res = await request(app)
      .get('/api/v1/vehicles/search')
      .set('Authorization', 'Bearer bad-token');
    expect(res.status).toBe(401);
  });

  // ── Happy path ────────────────────────────────────────────────────────────

  it('RED→GREEN: returns 200 and an array when authenticated with no filters', async () => {
    const res = await request(app)
      .get('/api/v1/vehicles/search')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('RED→GREEN: filters by make (case-insensitive)', async () => {
    const res = await request(app)
      .get('/api/v1/vehicles/search?make=Toyota')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    // Every returned vehicle must match the filter
    res.body.forEach((v: { make: string }) => {
      expect(v.make.toLowerCase()).toBe('toyota');
    });
  });

  it('RED→GREEN: filters by model', async () => {
    const res = await request(app)
      .get('/api/v1/vehicles/search?model=Civic')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    res.body.forEach((v: { model: string }) => {
      expect(v.model.toLowerCase()).toBe('civic');
    });
  });

  it('RED→GREEN: filters by exact year', async () => {
    const res = await request(app)
      .get('/api/v1/vehicles/search?year=2024')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    res.body.forEach((v: { year: number }) => {
      expect(v.year).toBe(2024);
    });
  });

  it('RED→GREEN: filters by maxPrice — excludes vehicles above the ceiling', async () => {
    const res = await request(app)
      .get('/api/v1/vehicles/search?maxPrice=25000')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    res.body.forEach((v: { price: number }) => {
      expect(v.price).toBeLessThanOrEqual(25000);
    });
  });

  it('RED→GREEN: filters by minPrice — excludes vehicles below the floor', async () => {
    const res = await request(app)
      .get('/api/v1/vehicles/search?minPrice=27000')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    res.body.forEach((v: { price: number }) => {
      expect(v.price).toBeGreaterThanOrEqual(27000);
    });
  });

  it('RED→GREEN: combined make + maxPrice filter returns correct subset', async () => {
    const res = await request(app)
      .get('/api/v1/vehicles/search?make=Honda&maxPrice=23000')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    res.body.forEach((v: { make: string; price: number }) => {
      expect(v.make.toLowerCase()).toBe('honda');
      expect(v.price).toBeLessThanOrEqual(23000);
    });
  });

  it('RED→GREEN: returns empty array when no vehicles match the filter', async () => {
    const res = await request(app)
      .get('/api/v1/vehicles/search?make=Ferrari')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });

  it('RED→GREEN: each vehicle in response has required fields (id, make, model, year, price, vin)', async () => {
    const res = await request(app)
      .get('/api/v1/vehicles/search')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);

    res.body.forEach((v: Record<string, unknown>) => {
      expect(v).toHaveProperty('id');
      expect(v).toHaveProperty('make');
      expect(v).toHaveProperty('model');
      expect(v).toHaveProperty('year');
      expect(v).toHaveProperty('price');
      expect(v).toHaveProperty('vin');
    });
  });
});

// ── Confirm the /v1/vehicles route also accepts the same filters ───────────
// (same controller, different path — both must behave identically)

describe('GET /api/v1/vehicles (same filter behaviour as /search)', () => {
  it('RED→GREEN: filters by make the same way /search does', async () => {
    const searchRes = await request(app)
      .get('/api/v1/vehicles/search?make=Toyota')
      .set('Authorization', `Bearer ${authToken}`);

    const listRes = await request(app)
      .get('/api/v1/vehicles?make=Toyota')
      .set('Authorization', `Bearer ${authToken}`);

    expect(searchRes.status).toBe(200);
    expect(listRes.status).toBe(200);
    // Both routes hit the same controller — results must be identical
    expect(listRes.body).toEqual(searchRes.body);
  });
});
