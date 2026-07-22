import request from 'supertest';
import app from '../../src/app/app';

const validVehicle = {
  make: 'Toyota',
  model: 'Camry',
  year: 2024,
  price: 28000,
  vin: '1HGBH41JXMN109186',
  mileage: 0,
  color: 'White',
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

describe('POST /api/v1/vehicles', () => {
  it('should return 401 Unauthorized when no token is provided', async () => {
    const response = await request(app).post('/api/v1/vehicles').send(validVehicle);

    expect(response.status).toBe(401);
    expect(response.body.status).toBe('error');
  });

  it('should return 401 Unauthorized when an invalid token is provided', async () => {
    const response = await request(app)
      .post('/api/v1/vehicles')
      .set('Authorization', 'Bearer invalid-token')
      .send(validVehicle);

    expect(response.status).toBe(401);
    expect(response.body.status).toBe('error');
  });

  it('should return 201 and the created vehicle on success', async () => {
    const token = await registerAndLogin('vehicle-create@example.com');

    const response = await request(app)
      .post('/api/v1/vehicles')
      .set('Authorization', `Bearer ${token}`)
      .send(validVehicle);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      make: validVehicle.make,
      model: validVehicle.model,
      year: validVehicle.year,
      price: validVehicle.price,
      vin: validVehicle.vin,
    });
    expect(response.body).toHaveProperty('id');
  });

  describe('Validation', () => {
    let token: string;

    beforeAll(async () => {
      token = await registerAndLogin('vehicle-validation@example.com');
    });

    it('should return 400 when make is missing', async () => {
      const { make: _, ...body } = validVehicle;
      const response = await request(app)
        .post('/api/v1/vehicles')
        .set('Authorization', `Bearer ${token}`)
        .send(body);

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
    });

    it('should return 400 when model is missing', async () => {
      const { model: _, ...body } = validVehicle;
      const response = await request(app)
        .post('/api/v1/vehicles')
        .set('Authorization', `Bearer ${token}`)
        .send(body);

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
    });

    it('should return 400 when year is missing', async () => {
      const { year: _, ...body } = validVehicle;
      const response = await request(app)
        .post('/api/v1/vehicles')
        .set('Authorization', `Bearer ${token}`)
        .send(body);

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
    });

    it('should return 400 when price is missing', async () => {
      const { price: _, ...body } = validVehicle;
      const response = await request(app)
        .post('/api/v1/vehicles')
        .set('Authorization', `Bearer ${token}`)
        .send(body);

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
    });

    it('should return 400 when vin is missing', async () => {
      const { vin: _, ...body } = validVehicle;
      const response = await request(app)
        .post('/api/v1/vehicles')
        .set('Authorization', `Bearer ${token}`)
        .send(body);

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
    });
  });
});

describe('GET /api/vehicles/search', () => {
  it('should return vehicles filtered by query params through the compatibility route', async () => {
    const token = await registerAndLogin('vehicle-search@example.com');

    await request(app)
      .post('/api/v1/vehicles')
      .set('Authorization', `Bearer ${token}`)
      .send(validVehicle);

    const response = await request(app)
      .get('/api/vehicles/search?make=Toyota')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.some((vehicle: { make: string }) => vehicle.make === 'Toyota')).toBe(true);
  });
});
