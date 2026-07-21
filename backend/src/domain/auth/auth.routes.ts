import { Router } from 'express';
import { AuthController } from './auth.controller';

export const createAuthRouter = (_authController: AuthController): Router => {
  const router = Router();

  router.post('/register', (_req, res) => {
    res.status(501).json({ message: 'Not implemented' });
  });

  return router;
};
