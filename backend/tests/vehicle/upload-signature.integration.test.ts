import request from 'supertest';
import app from '../../src/app/app';
import { generateAccessToken } from '../../src/lib/jwt';

describe('GET /api/v1/vehicles/upload-signature', () => {
  let validToken: string;

  beforeAll(() => {
    validToken = generateAccessToken({
      userId: 'test-user-id',
      email: 'test@example.com',
      role: 'user',
    });
  });

  it('should return 401 Unauthorized when no token is provided', async () => {
    const res = await request(app).get('/api/v1/vehicles/upload-signature');
    expect(res.status).toBe(401);
  });

  it('should return 200 and Cloudinary upload signature parameters when authenticated', async () => {
    const res = await request(app)
      .get('/api/v1/vehicles/upload-signature')
      .set('Authorization', `Bearer ${validToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('signature');
    expect(res.body).toHaveProperty('timestamp');
    expect(res.body).toHaveProperty('apiKey', '258713927246861');
    expect(res.body).toHaveProperty('cloudName', 'dsrsmxkir');
    expect(res.body).toHaveProperty('folder', 'dealerflow_vehicles');
  });
});
