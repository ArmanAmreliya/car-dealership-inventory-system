import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../lib/jwt';
import { User } from '../domain/auth/auth.types';

export interface AuthenticatedRequest extends Request {
  user: User;
}

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ status: 'error', message: 'Unauthorized' });
    return;
  }
  const token = authHeader.slice(7);
  try {
    const payload = verifyAccessToken(token);
    // Since verifyAccessToken succeeded, mock a User object from the payload.
    // The request handler or other parts expect a complete User object.
    const user: User = {
      id: payload.userId,
      email: payload.email,
      role: payload.role,
      name: null, // JWT payload doesn't contain name, or we can look it up if repository was async and injected.
      // Since it's an in-memory/JWT setup without database lookup inside middleware, we map from payload.
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    (req as AuthenticatedRequest).user = user;
    next();
  } catch {
    res.status(401).json({ status: 'error', message: 'Unauthorized' });
    return;
  }
};
