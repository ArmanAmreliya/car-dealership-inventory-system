import type { Request, Response, NextFunction } from 'express';
import type { PurchaseService } from './purchase.service';
import type { PurchaseRequest } from './purchase.types';

export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  purchase = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = req.body as Partial<PurchaseRequest>;

      if (!body.vehicleId) {
        res.status(400).json({ status: 'error', message: 'vehicleId is required' });
        return;
      }

      const record = await this.purchaseService.purchase({ vehicleId: body.vehicleId });
      res.status(201).json(record);
    } catch (err) {
      next(err);
    }
  };
}
