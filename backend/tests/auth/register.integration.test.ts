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

  describe('Validation', () => {
    it('should return 400 Bad Request when name is missing', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'valid@example.com',
          password: 'password123',
        });
      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
    });

    it('should return 400 Bad Request when email is missing', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Test User',
          password: 'password123',
        });
      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
    });

    it('should return 400 Bad Request when password is missing', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Test User',
          email: 'valid@example.com',
        });
      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
    });

    it('should return 400 Bad Request when email format is invalid', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Test User',
          email: 'invalid-email',
          password: 'password123',
        });
      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
    });

    it('should return 400 Bad Request when password is shorter than minimum length', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Test User',
          email: 'valid@example.com',
          password: '123',
        });
      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
    });
  });
});
