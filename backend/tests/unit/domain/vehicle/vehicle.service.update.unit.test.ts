import { VehicleService } from '../../../../src/domain/vehicle/vehicle.service';
import type { IVehicleRepository } from '../../../../src/domain/vehicle/vehicle.repository';
import type { Vehicle } from '../../../../src/domain/vehicle/vehicle.types';
import { AppError } from '../../../../src/common/errors/AppError';

describe('VehicleService.update()', () => {
  let vehicleService: VehicleService;
  let mockRepository: jest.Mocked<IVehicleRepository>;

  const existingVehicle: Vehicle = {
    id: 'v-001',
    make: 'Toyota',
    model: 'Camry',
    year: 2022,
    price: 25000,
    vin: 'VIN1234567890',
    mileage: 15000,
    color: 'Silver',
    createdAt: new Date('2024-01-01'),
    isAvailable: true,
  };

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      nextId: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<IVehicleRepository>;

    vehicleService = new VehicleService(mockRepository);
  });

  it('returns the updated vehicle when ID exists', async () => {
    const updated: Vehicle = { ...existingVehicle, price: 22000, isAvailable: false };
    mockRepository.update.mockResolvedValue(updated);

    const result = await vehicleService.update('v-001', { price: 22000, isAvailable: false });

    expect(mockRepository.update).toHaveBeenCalledWith('v-001', { price: 22000, isAvailable: false });
    expect(result).toEqual(updated);
  });

  it('throws AppError 404 when ID does not exist', async () => {
    mockRepository.update.mockResolvedValue(null);

    await expect(vehicleService.update('ghost-id', { price: 1000 })).rejects.toThrow(AppError);
    await expect(vehicleService.update('ghost-id', { price: 1000 })).rejects.toThrow(
      'Vehicle with ID "ghost-id" not found',
    );
  });

  it('propagates repository failures', async () => {
    mockRepository.update.mockRejectedValue(new Error('DB timeout'));

    await expect(vehicleService.update('v-001', { price: 1000 })).rejects.toThrow('DB timeout');
  });

  it('throws AppError 400 when ID is empty', async () => {
    await expect(vehicleService.update('', { price: 1000 })).rejects.toThrow(AppError);
    await expect(vehicleService.update('', { price: 1000 })).rejects.toThrow('Invalid vehicle ID');
    expect(mockRepository.update).not.toHaveBeenCalled();
  });

  it('applies only the supplied fields', async () => {
    const patchedVehicle: Vehicle = { ...existingVehicle, color: 'Red' };
    mockRepository.update.mockResolvedValue(patchedVehicle);

    const result = await vehicleService.update('v-001', { color: 'Red' });

    expect(mockRepository.update).toHaveBeenCalledWith('v-001', { color: 'Red' });
    expect(result.color).toBe('Red');
    expect(result.price).toBe(existingVehicle.price);
  });
});
