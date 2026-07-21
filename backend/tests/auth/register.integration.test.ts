import request from 'supertest';
import app from '../../src/app/app';

describe('POST /api/v1/auth/register', () => {
  it('should return 501 Not Implemented currently', async () => {
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      });

    expect(response.status).toBe(501);
    expect(response.body).toEqual({ message: 'Not implemented' });
  });

  it('should return 409 Conflict when trying to register an already registered email', async () => {
    await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: 'duplicate@example.com',
        password: 'password123',
        name: 'First User',
      });

    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: 'duplicate@example.com',
        password: 'password123',
        name: 'Second User',
      });

    expect(response.status).toBe(409);
    expect(response.body).toEqual({
      status: 'error',
      message: 'Email already registered',
    });
  });
});
