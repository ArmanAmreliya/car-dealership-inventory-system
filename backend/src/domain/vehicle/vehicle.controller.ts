import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middleware/authenticate';
import { Vehicle } from './vehicle.types';

const vehicles: Vehicle[] = [];

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
  create = (req: AuthenticatedRequest, res: Response, _next: NextFunction): void => {
    const { make, model, year, price, vin, mileage, color } = req.body as CreateVehicleBody;

    if (!make || !model || year == null || price == null || !vin) {
      res.status(400).json({ status: 'error', message: 'Missing required fields' });
      return;
    }

    const vehicle: Vehicle = {
      id: `vehicle-${vehicles.length + 1}`,
      make,
      model,
      year,
      price,
      vin,
      mileage: mileage ?? 0,
      color: color ?? '',
      createdAt: new Date(),
    };

    vehicles.push(vehicle);
    res.status(201).json(vehicle);
  };
}
