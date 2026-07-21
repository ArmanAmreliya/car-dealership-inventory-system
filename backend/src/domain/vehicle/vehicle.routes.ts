import type { Request, Response, NextFunction } from 'express';
import { Router } from 'express';
import type { AuthenticatedRequest } from '../../middleware/authenticate';
import { authenticate } from '../../middleware/authenticate';
import { validate } from '../../middleware/validate';
import { createVehicleSchema, updateVehicleSchema } from '../../common/validation/schemas';
import { VehicleRepository } from './vehicle.repository';
import type { IVehicleRepository } from './vehicle.repository';
import { VehicleService } from './vehicle.service';
import { VehicleController } from './vehicle.controller';

export const createVehicleRouter = (
  vehicleRepository: IVehicleRepository = new VehicleRepository(),
): Router => {
  const router = Router();
  const vehicleService = new VehicleService(vehicleRepository);
  const vehicleController = new VehicleController(vehicleService);

  router.post(
    '/',
    authenticate,
    validate(createVehicleSchema),
    (req: Request, res: Response, next: NextFunction) =>
      vehicleController.create(req as AuthenticatedRequest, res, next),
  );

  router.get('/', authenticate, (req: Request, res: Response, next: NextFunction) =>
    vehicleController.list(req as AuthenticatedRequest, res, next),
  );

  router.get('/:id', authenticate, (req: Request, res: Response, next: NextFunction) =>
    vehicleController.getById(req as AuthenticatedRequest, res, next),
  );

  router.put(
    '/:id',
    authenticate,
    validate(updateVehicleSchema),
    (req: Request, res: Response, next: NextFunction) =>
      vehicleController.update(req as AuthenticatedRequest, res, next),
  );

  router.delete('/:id', authenticate, (req: Request, res: Response, next: NextFunction) =>
    vehicleController.delete(req as AuthenticatedRequest, res, next),
  );

  return router;
};
