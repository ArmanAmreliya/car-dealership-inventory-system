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

async function createVehicle(token: string): Promise<string> {
  const res = await request(app)
    .post('/api/v1/vehicles')
    .set('Authorization', `Bearer ${token}`)
    .send({
      make: 'Honda',
      model: 'Civic',
      year: 2023,
      price: 22000,
      vin: '2HGFB2F59DH542172',
      mileage: 0,
      color: 'Blue',
    });

  return res.body.id as string;
}

describe('DELETE /api/v1/vehicles/:id', () => {
  let token: string;

  beforeAll(async () => {
    token = await registerAndLogin('vehicle-delete@example.com');
  });

  it('returns 401 when no token is provided', async () => {
    const response = await request(app).delete('/api/v1/vehicles/any-id');

    expect(response.status).toBe(401);
    expect(response.body.status).toBe('error');
  });

  it('returns 204 with no body on successful deletion', async () => {
    const id = await createVehicle(token);

    const response = await request(app)
      .delete(`/api/v1/vehicles/${id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(204);
    expect(response.body).toEqual({});
  });

  it('returns 404 for a non-existent vehicle ID', async () => {
    const response = await request(app)
      .delete('/api/v1/vehicles/does-not-exist')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body.status).toBe('error');
  });
});
