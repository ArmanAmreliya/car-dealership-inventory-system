import type { IVehicleRepository } from './vehicle.repository';
import type { Vehicle, VehicleFilters } from './vehicle.types';

export class VehicleService {
  constructor(private readonly vehicleRepository: IVehicleRepository) {}

  list(filters?: VehicleFilters): Vehicle[] {
    return this.vehicleRepository.findAll(filters);
  }

  async getById(_id: string): Promise<Vehicle | null> {
    throw new Error('Not implemented');
  }
}
