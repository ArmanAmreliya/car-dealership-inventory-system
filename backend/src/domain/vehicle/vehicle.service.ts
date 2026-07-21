import type { IVehicleRepository } from './vehicle.repository';
import type { Vehicle, VehicleFilters } from './vehicle.types';
import { AppError } from '../../common/errors/AppError';

export class VehicleService {
  constructor(private readonly vehicleRepository: IVehicleRepository) {}

  list(filters?: VehicleFilters): Vehicle[] {
    return this.vehicleRepository.findAll(filters);
  }

  async getById(id: string): Promise<Vehicle> {
    this.validateId(id);

    const vehicle = await this.vehicleRepository.findById(id);
    if (!vehicle) {
      throw new AppError(`Vehicle with ID "${id}" not found`, 404);
    }

    return vehicle;
  }

  private validateId(id: string): void {
    if (!id || id.trim() === '') {
      throw new AppError('Invalid vehicle ID', 400);
    }
  }
}

