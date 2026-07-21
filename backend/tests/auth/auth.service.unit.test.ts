import jwt from 'jsonwebtoken';
import type { TokenPayload } from '../../src/lib/jwt';
import { generateAccessToken, verifyAccessToken } from '../../src/lib/jwt';

const validPayload: TokenPayload = {
  userId: 'user-123',
  email: 'test@example.com',
  role: 'user',
};

describe('generateAccessToken', () => {
  it('should return a non-empty string', () => {
    const token = generateAccessToken(validPayload);

    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(0);
  });

  it('should produce a verifiable JWT with three segments', () => {
    const token = generateAccessToken(validPayload);
    const segments = token.split('.');

    expect(segments).toHaveLength(3);
  });

  it('should embed the payload claims in the token', () => {
    const token = generateAccessToken(validPayload);
    const decoded = jwt.decode(token) as Record<string, unknown>;

    expect(decoded['userId']).toBe(validPayload.userId);
    expect(decoded['email']).toBe(validPayload.email);
    expect(decoded['role']).toBe(validPayload.role);
  });

  it('should include an expiry claim', () => {
    const token = generateAccessToken(validPayload);
    const decoded = jwt.decode(token) as Record<string, unknown>;

    expect(decoded['exp']).toBeDefined();
  });
});

describe('verifyAccessToken', () => {
  it('should return the original payload for a valid token', () => {
    const token = generateAccessToken(validPayload);
    const result = verifyAccessToken(token);

    expect(result.userId).toBe(validPayload.userId);
    expect(result.email).toBe(validPayload.email);
    expect(result.role).toBe(validPayload.role);
  });

  it('should throw when the token is an arbitrary invalid string', () => {
    expect(() => verifyAccessToken('not.a.token')).toThrow();
  });

  it('should throw when the token is signed with a different secret', () => {
    const tampered = jwt.sign(validPayload, 'wrong-secret');

    expect(() => verifyAccessToken(tampered)).toThrow();
  });

  it('should throw when the token has expired', () => {
    const expired = jwt.sign(
      { ...validPayload, exp: Math.floor(Date.now() / 1000) - 10 },
      process.env['JWT_SECRET'] ?? 'test-secret',
    );

    expect(() => verifyAccessToken(expired)).toThrow();
  });
});
