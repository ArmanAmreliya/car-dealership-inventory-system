import request from 'supertest';
import app from '../../src/app/app';

const validVehicle = {
  make: 'Honda',
  model: 'Accord',
  year: 2023,
  price: 30000,
  vin: '2HGBH41JXMN109999',
  mileage: 0,
  color: 'Black',
};

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

async function createVehicle(token: string): Promise<string> {
  const res = await request(app)
    .post('/api/v1/vehicles')
    .set('Authorization', `Bearer ${token}`)
    .send(validVehicle);

  return res.body.id as string;
}

describe('POST /api/v1/purchases', () => {
  it('should return 401 when no token is provided', async () => {
    const response = await request(app).post('/api/v1/purchases').send({ vehicleId: 'any' });

    expect(response.status).toBe(401);
    expect(response.body.status).toBe('error');
  });

  it('should return 201 with a purchase record on success', async () => {
    const token = await registerAndLogin('purchase-success@example.com');
    const vehicleId = await createVehicle(token);

    const response = await request(app)
      .post('/api/v1/purchases')
      .set('Authorization', `Bearer ${token}`)
      .send({ vehicleId });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      vehicleId,
      make: validVehicle.make,
      model: validVehicle.model,
      year: validVehicle.year,
      vin: validVehicle.vin,
      price: validVehicle.price,
    });
    expect(response.body).toHaveProperty('purchaseId');
    expect(response.body).toHaveProperty('purchasedAt');
  });

  it('should reduce inventory — vehicle becomes unavailable after purchase', async () => {
    const token = await registerAndLogin('purchase-inventory@example.com');
    const vehicleId = await createVehicle(token);

    await request(app)
      .post('/api/v1/purchases')
      .set('Authorization', `Bearer ${token}`)
      .send({ vehicleId });

    const inventoryRes = await request(app)
      .get('/api/v1/inventory')
      .set('Authorization', `Bearer ${token}`);

    const item = inventoryRes.body.items.find(
      (i: { vehicleId: string }) => i.vehicleId === vehicleId,
    );
    expect(item).toBeDefined();
    expect(item.isAvailable).toBe(false);
    expect(item.stockQuantity).toBe(0);
  });

  it('should return 409 when the vehicle is already unavailable', async () => {
    const token = await registerAndLogin('purchase-conflict@example.com');
    const vehicleId = await createVehicle(token);

    // First purchase succeeds
    await request(app)
      .post('/api/v1/purchases')
      .set('Authorization', `Bearer ${token}`)
      .send({ vehicleId });

    // Second purchase is rejected
    const response = await request(app)
      .post('/api/v1/purchases')
      .set('Authorization', `Bearer ${token}`)
      .send({ vehicleId });

    expect(response.status).toBe(409);
  });

  it('should return 404 when the vehicle does not exist', async () => {
    const token = await registerAndLogin('purchase-notfound@example.com');

    const response = await request(app)
      .post('/api/v1/purchases')
      .set('Authorization', `Bearer ${token}`)
      .send({ vehicleId: 'nonexistent-id' });

    expect(response.status).toBe(404);
  });

  it('should return 400 when vehicleId is missing', async () => {
    const token = await registerAndLogin('purchase-missing@example.com');

    const response = await request(app)
      .post('/api/v1/purchases')
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(response.status).toBe(400);
  });
});
