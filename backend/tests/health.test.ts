import request from 'supertest';
import app from '../src/app/app';
import pkg from '../package.json';

describe('GET /api/health', () => {
  it('should return 200 and health status details', async () => {
    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: 'ok',
      version: pkg.version,
      timestamp: expect.any(String) as string,
    });

    // Validate timestamp is a valid ISO string
    const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
    expect(response.body.timestamp).toMatch(isoRegex);
  });
});
