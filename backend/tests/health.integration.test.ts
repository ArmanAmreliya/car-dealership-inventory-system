import request from 'supertest';
import app from '../src/app/app';

describe('GET /api/health integration', () => {
  it('should return 200 and health status details', async () => {
    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'ok');
    expect(response.body).toHaveProperty('version');
    expect(response.body).toHaveProperty('timestamp');
  });
});
