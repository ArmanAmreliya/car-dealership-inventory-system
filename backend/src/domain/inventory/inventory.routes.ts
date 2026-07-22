import { Router } from 'express';
import type { IVehicleRepository } from '../vehicle/vehicle.repository';
import { authenticate } from '../../middleware/authenticate';
import { requireAdmin } from '../../middleware/requireAdmin';
import { validate } from '../../middleware/validate';
import { stockUpdateSchema } from '../../common/validation/schemas';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';

export const createInventoryRouter = (vehicleRepository: IVehicleRepository): Router => {
  const router = Router();
  const inventoryService = new InventoryService(vehicleRepository);
  const inventoryController = new InventoryController(inventoryService);

  router.get('/', authenticate, inventoryController.getStatus);
  router.patch('/:id', authenticate, requireAdmin, validate(stockUpdateSchema), inventoryController.updateStock);

  return router;
};
