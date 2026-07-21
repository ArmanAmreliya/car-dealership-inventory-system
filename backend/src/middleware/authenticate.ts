import type { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../lib/jwt';
import type { User } from '../domain/auth/auth.types';

export interface AuthenticatedRequest extends Request {
  user: User;
}

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ status: 'error', message: 'Unauthorized' });
    return;
  }

  const token = authHeader.substring(7);
  try {
    const payload = verifyAccessToken(token);
    
    (req as AuthenticatedRequest).user = {
      id: payload.userId,
      email: payload.email,
      role: payload.role,
      name: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    next();
  } catch {
    res.status(401).json({ status: 'error', message: 'Unauthorized' });
  }
};
