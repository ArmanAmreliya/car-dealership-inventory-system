import type { Request, Response, NextFunction } from 'express';
import { Router } from 'express';
import type { AuthenticatedRequest } from '../../middleware/authenticate';
import { authenticate } from '../../middleware/authenticate';
import { VehicleRepository } from './vehicle.repository';
import { VehicleController } from './vehicle.controller';

export const createVehicleRouter = (): Router => {
  const router = Router();
  const vehicleController = new VehicleController(new VehicleRepository());

  router.post(
    '/',
    authenticate,
    (req: Request, res: Response, next: NextFunction) =>
      vehicleController.create(req as AuthenticatedRequest, res, next),
  );

  return router;
};
