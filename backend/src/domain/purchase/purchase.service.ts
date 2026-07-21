import { randomUUID } from 'crypto';
import type { IVehicleRepository } from '../vehicle/vehicle.repository';
import type { PurchaseRecord, PurchaseRequest } from './purchase.types';
import { AppError } from '../../common/errors/AppError';

export class PurchaseService {
  constructor(private readonly vehicleRepository: IVehicleRepository) {}

  async purchase(request: PurchaseRequest): Promise<PurchaseRecord> {
    const { vehicleId } = request;

    if (!vehicleId || vehicleId.trim() === '') {
      throw new AppError('vehicleId is required', 400);
    }

    const vehicle = await this.vehicleRepository.findById(vehicleId);
    if (!vehicle) {
      throw new AppError(`Vehicle with ID "${vehicleId}" not found`, 404);
    }

    const isAvailable = vehicle.isAvailable ?? true;
    if (!isAvailable) {
      throw new AppError(`Vehicle with ID "${vehicleId}" is not available for purchase`, 409);
    }

    // Atomically reduce inventory: mark the vehicle unavailable (stockQuantity → 0)
    await this.vehicleRepository.update(vehicleId, { isAvailable: false });

    return {
      purchaseId: randomUUID(),
      vehicleId: vehicle.id,
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      vin: vehicle.vin,
      price: vehicle.price,
      purchasedAt: new Date(),
    };
  }
}
