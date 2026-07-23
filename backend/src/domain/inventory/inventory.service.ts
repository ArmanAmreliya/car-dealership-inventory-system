import type { IVehicleRepository } from '../vehicle/vehicle.repository';
import type { InventoryItem, InventoryStatus, StockUpdate } from './inventory.types';
import { AppError } from '../../common/errors/AppError';

function toInventoryItem(vehicle: {
  id: string;
  make: string;
  model: string;
  year: number;
  vin: string;
  price: number;
  createdAt?: Date;
  isAvailable?: boolean;
  stockQuantity?: number;
}): InventoryItem {
  const isAvailable = vehicle.isAvailable ?? true;
  // Use the stored stockQuantity when present; only fall back to the
  // binary 1/0 derived from isAvailable for vehicles that predate this field.
  const stockQuantity =
    typeof vehicle.stockQuantity === 'number'
      ? vehicle.stockQuantity
      : isAvailable
      ? 1
      : 0;
  const dateStr = vehicle.createdAt
    ? new Date(vehicle.createdAt).toISOString()
    : new Date().toISOString();
  return {
    id: vehicle.id,
    vehicleId: vehicle.id,
    make: vehicle.make,
    model: vehicle.model,
    year: vehicle.year,
    vin: vehicle.vin,
    price: vehicle.price,
    stockQuantity,
    isAvailable,
    createdAt: dateStr,
    updatedAt: new Date().toISOString(),
  };
}

export class InventoryService {
  constructor(private readonly vehicleRepository: IVehicleRepository) {}

  getStatus(): InventoryStatus {
    const vehicles = this.vehicleRepository.findAll();
    const items = vehicles.map(toInventoryItem);

    return {
      totalVehicles: items.length,
      availableVehicles: items.filter((i) => i.isAvailable).length,
      unavailableVehicles: items.filter((i) => !i.isAvailable).length,
      items,
    };
  }

  async updateStock(vehicleId: string, update: StockUpdate): Promise<InventoryItem> {
    if (!vehicleId || vehicleId.trim() === '') {
      throw new AppError('Invalid vehicle ID', 400);
    }

    if (update.stockQuantity < 0) {
      throw new AppError('Stock quantity cannot be negative', 400);
    }

    const isAvailable = update.stockQuantity > 0;

    // Persist both the real quantity AND the derived availability flag so
    // that getStatus() returns the correct stockQuantity on subsequent reads.
    const vehicle = await this.vehicleRepository.update(vehicleId, {
      isAvailable,
      stockQuantity: update.stockQuantity,
    });

    if (!vehicle) {
      throw new AppError(`Vehicle with ID "${vehicleId}" not found`, 404);
    }

    return toInventoryItem(vehicle);
  }
}
