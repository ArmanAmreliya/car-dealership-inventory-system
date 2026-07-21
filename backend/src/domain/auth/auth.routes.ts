import { Router } from 'express';
import { AuthController } from './auth.controller';

export const createAuthRouter = (authController: AuthController): Router => {
  const router = Router();

  router.post('/register', authController.register);

  return router;
};
