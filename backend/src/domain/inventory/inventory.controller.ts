import type { Request, Response, NextFunction } from 'express';
import type { InventoryService } from './inventory.service';
import type { StockUpdate } from './inventory.types';

export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  getStatus = (_req: Request, res: Response, next: NextFunction): void => {
    try {
      const status = this.inventoryService.getStatus();
      res.status(200).json(status);
    } catch (err) {
      next(err);
    }
  };

  updateStock = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const update = req.body as Partial<StockUpdate>;

      if (update.stockQuantity === undefined || update.stockQuantity === null) {
        res.status(400).json({ status: 'error', message: 'stockQuantity is required' });
        return;
      }

      const item = await this.inventoryService.updateStock(req.params.id, {
        stockQuantity: update.stockQuantity,
      });
      res.status(200).json(item);
    } catch (err) {
      next(err);
    }
  };
}
