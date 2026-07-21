import type { Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from '../../middleware/authenticate';
import type { CreateVehicleData, VehicleService } from './vehicle.service';
import type { VehicleUpdate } from './vehicle.types';

interface CreateVehicleBody {
  make?: string;
  model?: string;
  year?: number;
  price?: number;
  vin?: string;
  mileage?: number;
  color?: string;
}

export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  create = (req: AuthenticatedRequest, res: Response, _next: NextFunction): void => {
    const { make, model, year, price, vin, mileage, color } = req.body as CreateVehicleBody;

    if (!make || !model || year == null || price == null || !vin) {
      res.status(400).json({ status: 'error', message: 'Missing required fields' });
      return;
    }

    const data: CreateVehicleData = { make, model, year, price, vin, mileage, color };
    const vehicle = this.vehicleService.create(data);
    res.status(201).json(vehicle);
  };

  getById = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const vehicle = await this.vehicleService.getById(req.params.id);
      res.status(200).json(vehicle);
    } catch (err) {
      next(err);
    }
  };

  update = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const fields = req.body as VehicleUpdate;
      const vehicle = await this.vehicleService.update(req.params.id, fields);
      res.status(200).json(vehicle);
    } catch (err) {
      next(err);
    }
  };
}
