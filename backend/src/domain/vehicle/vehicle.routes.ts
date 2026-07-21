import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { VehicleController } from './vehicle.controller';

export const createVehicleRouter = (): Router => {
  const router = Router();
  const vehicleController = new VehicleController();

  router.post('/', authenticate, (req, res, next) =>
    vehicleController.create(req as any, res, next)
  );

  return router;
};
