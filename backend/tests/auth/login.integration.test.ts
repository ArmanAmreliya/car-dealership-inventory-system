import request from 'supertest';
import app from '../../src/app/app';

describe('POST /api/v1/auth/login', () => {
  it('should return 200 and auth payload on successful login', async () => {
    // Register the user first
    await request(app).post('/api/v1/auth/register').send({
      email: 'login-success@example.com',
      password: 'password123',
      name: 'Success User',
    });

    const response = await request(app).post('/api/v1/auth/login').send({
      email: 'login-success@example.com',
      password: 'password123',
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body.user).toEqual(
      expect.objectContaining({
        email: 'login-success@example.com',
        name: 'Success User',
      }),
    );
  });

  it('should return 401 Unauthorized when email is not found', async () => {
    const response = await request(app).post('/api/v1/auth/login').send({
      email: `nonexistent-${Date.now()}@example.com`,
      password: 'password123',
    });

    expect(response.status).toBe(401);
    expect(response.body.status).toBe('error');
  });

  it('should return 401 Unauthorized when password is incorrect', async () => {
    await request(app).post('/api/v1/auth/register').send({
      email: 'login-wrong-pwd@example.com',
      password: 'password123',
      name: 'Wrong Password User',
    });

    const response = await request(app).post('/api/v1/auth/login').send({
      email: 'login-wrong-pwd@example.com',
      password: 'wrongpassword',
    });

    expect(response.status).toBe(401);
    expect(response.body.status).toBe('error');
  });

  describe('Validation', () => {
    it('should return 400 Bad Request when email is missing', async () => {
      const response = await request(app).post('/api/v1/auth/login').send({
        password: 'password123',
      });

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
    });

    it('should return 400 Bad Request when password is missing', async () => {
      const response = await request(app).post('/api/v1/auth/login').send({
        email: 'valid@example.com',
      });

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
    });
  });
});
