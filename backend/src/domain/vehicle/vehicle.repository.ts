import type { Vehicle } from './vehicle.types';

export interface IVehicleRepository {
  save(vehicle: Vehicle): void;
  nextId(): string;
}

export class VehicleRepository implements IVehicleRepository {
  private readonly vehicles: Vehicle[] = [];

  save(vehicle: Vehicle): void {
    this.vehicles.push(vehicle);
  }

  nextId(): string {
    return `vehicle-${this.vehicles.length + 1}`;
  }
}
