import type { Request, Response, NextFunction } from 'express';
import type { InventoryService } from './inventory.service';
import type { StockUpdate, RestockInput } from './inventory.types';

export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  getStatus = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const status = await this.inventoryService.getStatus();
      res.status(200).json(status);
    } catch (err) {
      next(err);
    }
  };

  updateStock = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const item = await this.inventoryService.updateStock(req.params.id, req.body as StockUpdate);
      res.status(200).json(item);
    } catch (err) {
      next(err);
    }
  };

  restock = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const item = await this.inventoryService.restock(req.params.id, req.body as RestockInput);
      res.status(200).json(item);
    } catch (err) {
      next(err);
    }
  };
}
