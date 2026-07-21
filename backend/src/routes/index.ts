import { Router } from 'express';
import healthRouter from './health.route';
import { createAuthRouter } from '../domain/auth/auth.routes';
import { AuthController } from '../domain/auth/auth.controller';
import { AuthService } from '../domain/auth/auth.service';
import { AuthRepository } from '../domain/auth/auth.repository';
import { VehicleRepository } from '../domain/vehicle/vehicle.repository';
import { createVehicleRouter } from '../domain/vehicle/vehicle.routes';
import { createInventoryRouter } from '../domain/inventory/inventory.routes';

const router = Router();

router.use('/health', healthRouter);

const authRepository = new AuthRepository();
const authService = new AuthService(authRepository);
const authController = new AuthController(authService);
router.use('/v1/auth', createAuthRouter(authController));

const vehicleRepository = new VehicleRepository();
router.use('/v1/vehicles', createVehicleRouter(vehicleRepository));
router.use('/v1/inventory', createInventoryRouter(vehicleRepository));

export default router;
