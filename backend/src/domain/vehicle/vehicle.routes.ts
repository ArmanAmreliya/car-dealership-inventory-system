import type { Request, Response, NextFunction } from 'express';
import { Router } from 'express';
import type { AuthenticatedRequest } from '../../middleware/authenticate';
import { authenticate } from '../../middleware/authenticate';
import { requireAdmin } from '../../middleware/requireAdmin';
import { validate } from '../../middleware/validate';
import { createVehicleSchema, updateVehicleSchema, restockSchema } from '../../common/validation/schemas';
import { VehicleRepository } from './vehicle.repository';
import type { IVehicleRepository } from './vehicle.repository';
import { VehicleService } from './vehicle.service';
import { VehicleController } from './vehicle.controller';
import { UploadController } from './upload.controller';
import { InventoryService } from '../inventory/inventory.service';
import { InventoryController } from '../inventory/inventory.controller';
import { PurchaseService } from '../purchase/purchase.service';
import { PurchaseController } from '../purchase/purchase.controller';

export const createVehicleRouter = (
  vehicleRepository: IVehicleRepository = new VehicleRepository(),
): Router => {
  const router = Router();
  const vehicleService = new VehicleService(vehicleRepository);
  const vehicleController = new VehicleController(vehicleService);
  const uploadController = new UploadController();
  const inventoryController = new InventoryController(new InventoryService(vehicleRepository));
  const purchaseController = new PurchaseController(new PurchaseService(vehicleRepository));

  router.get('/upload-signature', authenticate, (req: Request, res: Response, next: NextFunction) =>
    uploadController.getSignature(req as AuthenticatedRequest, res, next),
  );

  router.post('/upload-signature', authenticate, (req: Request, res: Response, next: NextFunction) =>
    uploadController.getSignature(req as AuthenticatedRequest, res, next),
  );

  router.post(
    '/',
    authenticate,
    validate(createVehicleSchema),
    (req: Request, res: Response, next: NextFunction) =>
      vehicleController.create(req as AuthenticatedRequest, res, next),
  );

  router.get('/search', authenticate, (req: Request, res: Response, next: NextFunction) =>
    vehicleController.list(req as AuthenticatedRequest, res, next),
  );

  router.get('/', authenticate, (req: Request, res: Response, next: NextFunction) =>
    vehicleController.list(req as AuthenticatedRequest, res, next),
  );

  // POST /vehicles/:id/purchase — inject vehicleId from URL param into body
  router.post(
    '/:id/purchase',
    authenticate,
    (req: Request, res: Response, next: NextFunction) => {
      req.body = { ...req.body, vehicleId: req.params.id };
      return purchaseController.purchase(req, res, next);
    },
  );

  // POST /vehicles/:id/restock — admin only, map quantity → stockQuantity
  router.post(
    '/:id/restock',
    authenticate,
    requireAdmin,
    validate(restockSchema),
    (req: Request, res: Response, next: NextFunction) => {
      const restockRequest = req as Request & { body: { stockQuantity: number } };
      restockRequest.body = { stockQuantity: req.body.quantity };
      return inventoryController.updateStock(restockRequest, res, next);
    },
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

  router.delete(
    '/:id',
    authenticate,
    requireAdmin,
    (req: Request, res: Response, next: NextFunction) =>
      vehicleController.delete(req as AuthenticatedRequest, res, next),
  );

  return router;
};
