import type { Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from '../../middleware/authenticate';
import type { CreateVehicleData, VehicleService } from './vehicle.service';
import type { VehicleFilters, VehicleUpdate } from './vehicle.types';

export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  create = (req: AuthenticatedRequest, res: Response, _next: NextFunction): void => {
    const data = req.body as CreateVehicleData;
    const vehicle = this.vehicleService.create(data);
    res.status(201).json(vehicle);
  };

  list = (req: AuthenticatedRequest, res: Response, _next: NextFunction): void => {
    const { make, model, year, availability, minPrice, maxPrice } = req.query as Record<string, string>;

    const filters: VehicleFilters = {};
    if (make) filters.make = make;
    if (model) filters.model = model;
    if (year !== undefined) filters.year = parseInt(year, 10);
    if (availability !== undefined) filters.availability = availability === 'true';
    if (minPrice !== undefined) filters.minPrice = parseFloat(minPrice);
    if (maxPrice !== undefined) filters.maxPrice = parseFloat(maxPrice);

    const vehicles = this.vehicleService.list(Object.keys(filters).length ? filters : undefined);
    res.status(200).json(vehicles);
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

  delete = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.vehicleService.delete(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  };
}
