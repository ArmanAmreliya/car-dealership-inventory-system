import type { Vehicle, VehicleFilters, VehicleUpdate } from './vehicle.types';

export interface IVehicleRepository {
  save(vehicle: Vehicle): void;
  nextId(): string;
  findAll(filters?: VehicleFilters): Vehicle[];
  findById(id: string): Promise<Vehicle | null>;
  update(id: string, fields: VehicleUpdate): Promise<Vehicle | null>;
}

export class VehicleRepository implements IVehicleRepository {
  private readonly vehicles: Vehicle[] = [];

  save(vehicle: Vehicle): void {
    this.vehicles.push(vehicle);
  }

  nextId(): string {
    return `vehicle-${this.vehicles.length + 1}`;
  }

  findAll(filters?: VehicleFilters): Vehicle[] {
    if (!filters) {
      return [...this.vehicles];
    }

    return this.vehicles.filter((v) => {
      if (filters.make && v.make.toLowerCase() !== filters.make.toLowerCase()) {
        return false;
      }
      if (filters.model && v.model.toLowerCase() !== filters.model.toLowerCase()) {
        return false;
      }
      if (filters.year !== undefined && v.year !== filters.year) {
        return false;
      }
      if (filters.availability !== undefined && (v.isAvailable ?? true) !== filters.availability) {
        return false;
      }
      if (filters.minPrice !== undefined && v.price < filters.minPrice) {
        return false;
      }
      if (filters.maxPrice !== undefined && v.price > filters.maxPrice) {
        return false;
      }
      return true;
    });
  }

  async findById(id: string): Promise<Vehicle | null> {
    const vehicle = this.vehicles.find((v) => v.id === id);
    return vehicle ?? null;
  }

  async update(id: string, fields: VehicleUpdate): Promise<Vehicle | null> {
    const index = this.vehicles.findIndex((v) => v.id === id);
    if (index === -1) {
      return null;
    }
    this.vehicles[index] = { ...this.vehicles[index], ...fields };
    return this.vehicles[index];
  }
}
