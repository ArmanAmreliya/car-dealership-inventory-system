import type { Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from '../../middleware/authenticate';
import type { IVehicleRepository } from './vehicle.repository';
import type { Vehicle } from './vehicle.types';

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
  constructor(private readonly vehicleRepository: IVehicleRepository) {}

  create = (req: AuthenticatedRequest, res: Response, _next: NextFunction): void => {
    const { make, model, year, price, vin, mileage, color } = req.body as CreateVehicleBody;

    if (!make || !model || year == null || price == null || !vin) {
      res.status(400).json({ status: 'error', message: 'Missing required fields' });
      return;
    }

    const vehicle: Vehicle = {
      id: this.vehicleRepository.nextId(),
      make,
      model,
      year,
      price,
      vin,
      mileage: mileage ?? 0,
      color: color ?? '',
      createdAt: new Date(),
    };

    this.vehicleRepository.save(vehicle);
    res.status(201).json(vehicle);
  };
}
