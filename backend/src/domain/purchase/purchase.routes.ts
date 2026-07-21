import { Router } from 'express';
import type { IVehicleRepository } from '../vehicle/vehicle.repository';
import { authenticate } from '../../middleware/authenticate';
import { PurchaseService } from './purchase.service';
import { PurchaseController } from './purchase.controller';

export const createPurchaseRouter = (vehicleRepository: IVehicleRepository): Router => {
  const router = Router();
  const purchaseService = new PurchaseService(vehicleRepository);
  const purchaseController = new PurchaseController(purchaseService);

  router.post('/', authenticate, purchaseController.purchase);

  return router;
};
