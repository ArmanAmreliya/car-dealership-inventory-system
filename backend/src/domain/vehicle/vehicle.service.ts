import type { IVehicleRepository } from './vehicle.repository';
import type { Vehicle, VehicleFilters, VehicleUpdate } from './vehicle.types';
import { AppError } from '../../common/errors/AppError';

export interface CreateVehicleData {
  make: string;
  model: string;
  year: number;
  price: number;
  vin: string;
  mileage?: number;
  color?: string;
  imageUrl?: string;
}

export class VehicleService {
  constructor(private readonly vehicleRepository: IVehicleRepository) {}

  create(data: CreateVehicleData): Vehicle {
    const vehicle: Vehicle = {
      id: this.vehicleRepository.nextId(),
      make: data.make,
      model: data.model,
      year: data.year,
      price: data.price,
      vin: data.vin,
      mileage: data.mileage ?? 0,
      color: data.color ?? '',
      imageUrl: data.imageUrl,
      stockQuantity: 1,
      createdAt: new Date(),
    };
    this.vehicleRepository.save(vehicle);
    return vehicle;
  }

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

  async update(id: string, fields: VehicleUpdate): Promise<Vehicle> {
    this.validateId(id);

    const vehicle = await this.vehicleRepository.update(id, fields);
    if (!vehicle) {
      throw new AppError(`Vehicle with ID "${id}" not found`, 404);
    }

    return vehicle;
  }

  async delete(id: string): Promise<void> {
    this.validateId(id);

    const deleted = await this.vehicleRepository.delete(id);
    if (!deleted) {
      throw new AppError(`Vehicle with ID "${id}" not found`, 404);
    }
  }

  private validateId(id: string): void {
    if (!id || id.trim() === '') {
      throw new AppError('Invalid vehicle ID', 400);
    }
  }
}
