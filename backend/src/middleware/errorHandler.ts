import type { Request, Response, NextFunction } from 'express';
import { AppError } from '@common/errors/AppError';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
    return;
  }

  // Log unexpected errors (not AppErrors — those are operational)
  if (process.env.NODE_ENV !== 'test') {
    // eslint-disable-next-line no-console
    console.error(`[ERROR] ${req.method} ${req.path}`, {
      message: err.message,
      stack: err.stack,
    });
  }

  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
};
