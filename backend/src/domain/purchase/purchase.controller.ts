import type { Request, Response, NextFunction } from 'express';
import type { PurchaseService } from './purchase.service';
import type { PurchaseRequest } from './purchase.types';

export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  purchase = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const record = await this.purchaseService.purchase(req.body as PurchaseRequest);
      res.status(201).json(record);
    } catch (err) {
      next(err);
    }
  };
}
