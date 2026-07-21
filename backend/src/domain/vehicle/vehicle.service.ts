import type { IVehicleRepository } from './vehicle.repository';
import type { Vehicle, VehicleFilters } from './vehicle.types';

export class VehicleService {
  constructor(private readonly vehicleRepository: IVehicleRepository) {}

  list(filters?: VehicleFilters): Vehicle[] {
    return this.vehicleRepository.findAll(filters);
  }
}
