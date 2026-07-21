import { Request, Response, NextFunction } from 'express';
import { getUserByToken } from '../domain/auth/auth.service';
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
  const user = getUserByToken(token);
  if (!user) {
    res.status(401).json({ status: 'error', message: 'Unauthorized' });
    return;
  }
  (req as AuthenticatedRequest).user = user;
  next();
};
