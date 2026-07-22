import type { Request, Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from './authenticate';

export const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
  const user = (req as AuthenticatedRequest).user;

  if (!user || user.role !== 'admin') {
    res.status(403).json({ status: 'error', message: 'Forbidden' });
    return;
  }

  next();
};
