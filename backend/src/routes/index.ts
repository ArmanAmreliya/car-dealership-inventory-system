import { Router } from 'express';
import healthRouter from './health.route';
import { createAuthRouter } from '../domain/auth/auth.routes';
import { AuthController } from '../domain/auth/auth.controller';
import { AuthService } from '../domain/auth/auth.service';
import { AuthRepository } from '../domain/auth/auth.repository';
import { createVehicleRouter } from '../domain/vehicle/vehicle.routes';

const router = Router();

router.use('/health', healthRouter);

const authRepository = new AuthRepository();
const authService = new AuthService(authRepository);
const authController = new AuthController(authService);
router.use('/v1/auth', createAuthRouter(authController));
router.use('/v1/vehicles', createVehicleRouter());

export default router;

