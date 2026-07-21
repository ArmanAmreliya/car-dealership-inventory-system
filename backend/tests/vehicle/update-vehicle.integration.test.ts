import request from 'supertest';
import app from '../../src/app/app';

async function registerAndLogin(email: string): Promise<string> {
  await request(app).post('/api/v1/auth/register').send({
    email,
    password: 'password123',
    name: 'Test User',
  });

  const res = await request(app).post('/api/v1/auth/login').send({
    email,
    password: 'password123',
  });

  return res.body.token as string;
}

async function createVehicle(token: string, overrides: Record<string, unknown> = {}): Promise<Record<string, unknown>> {
  const body = {
    make: 'Toyota',
    model: 'Camry',
    year: 2024,
    price: 28000,
    vin: '1HGBH41JXMN109186',
    mileage: 0,
    color: 'White',
    ...overrides,
  };

  const res = await request(app)
    .post('/api/v1/vehicles')
    .set('Authorization', `Bearer ${token}`)
    .send(body);

  return res.body as Record<string, unknown>;
}

describe('PUT /api/v1/vehicles/:id', () => {
  let token: string;

  beforeAll(async () => {
    token = await registerAndLogin('vehicle-update@example.com');
  });

  it('returns 401 when no token is provided', async () => {
    const response = await request(app)
      .put('/api/v1/vehicles/any-id')
      .send({ price: 20000 });

    expect(response.status).toBe(401);
    expect(response.body.status).toBe('error');
  });

  it('returns 200 and the updated vehicle for an existing vehicle', async () => {
    const created = await createVehicle(token);
    const id = created.id as string;

    const response = await request(app)
      .put(`/api/v1/vehicles/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ price: 24000, isAvailable: false, color: 'Black' });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id,
      price: 24000,
      isAvailable: false,
      color: 'Black',
      make: 'Toyota',
      model: 'Camry',
    });
  });

  it('returns 404 for a non-existent vehicle ID', async () => {
    const response = await request(app)
      .put('/api/v1/vehicles/does-not-exist')
      .set('Authorization', `Bearer ${token}`)
      .send({ price: 10000 });

    expect(response.status).toBe(404);
    expect(response.body.status).toBe('error');
  });
});
