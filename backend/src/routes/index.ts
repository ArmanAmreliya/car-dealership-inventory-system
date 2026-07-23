import { Router } from 'express';
import healthRouter from './health.route';
import { createAuthRouter } from '../domain/auth/auth.routes';
import { AuthController } from '../domain/auth/auth.controller';
import { AuthService } from '../domain/auth/auth.service';
import { AuthRepository } from '../domain/auth/auth.repository';
import { PrismaVehicleRepository } from '../infrastructure/prisma-vehicle.repository';
import { createVehicleRouter } from '../domain/vehicle/vehicle.routes';
import { createInventoryRouter } from '../domain/inventory/inventory.routes';
import { createPurchaseRouter } from '../domain/purchase/purchase.routes';

import { UploadController } from '../domain/vehicle/upload.controller';
import { authenticate } from '../middleware/authenticate';

const router = Router();

router.use('/health', healthRouter);

const uploadController = new UploadController();
router.get('/v1/upload-signature', authenticate, (req, res, next) => uploadController.getSignature(req as any, res, next));
router.post('/v1/upload-signature', authenticate, (req, res, next) => uploadController.getSignature(req as any, res, next));

const authRepository = new AuthRepository();
const authService = new AuthService(authRepository);
const authController = new AuthController(authService);
router.use('/v1/auth', createAuthRouter(authController));
router.use('/auth', createAuthRouter(authController));

// Single shared repository instance — all domain routers share one DB connection
const vehicleRepository = new PrismaVehicleRepository();

router.use('/v1/vehicles', createVehicleRouter(vehicleRepository));
router.use('/vehicles',    createVehicleRouter(vehicleRepository));
router.use('/v1/inventory', createInventoryRouter(vehicleRepository));
router.use('/inventory',    createInventoryRouter(vehicleRepository));
router.use('/v1/purchases', createPurchaseRouter(vehicleRepository));
router.use('/purchases',    createPurchaseRouter(vehicleRepository));

export default router;
