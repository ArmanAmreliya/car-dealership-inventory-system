import { VehicleService } from '../../../../src/domain/vehicle/vehicle.service';
import type { IVehicleRepository } from '../../../../src/domain/vehicle/vehicle.repository';
import type { Vehicle } from '../../../../src/domain/vehicle/vehicle.types';
import { AppError } from '../../../../src/common/errors/AppError';

describe('VehicleService.getById()', () => {
  let vehicleService: VehicleService;
  let mockRepository: jest.Mocked<IVehicleRepository>;

  const mockVehicle: Vehicle = {
    id: 'v-123',
    make: 'Toyota',
    model: 'Camry',
    year: 2022,
    price: 25000,
    vin: 'VIN1234567890',
    mileage: 15000,
    color: 'Silver',
    createdAt: new Date(),
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

  it('returns vehicle when ID exists', async () => {
    mockRepository.findById.mockResolvedValue(mockVehicle);

    const result = await vehicleService.getById('v-123');

    expect(mockRepository.findById).toHaveBeenCalledWith('v-123');
    expect(result).toEqual(mockVehicle);
  });

  it('throws AppError not found error when ID does not exist', async () => {
    mockRepository.findById.mockResolvedValue(null);

    await expect(vehicleService.getById('non-existent-id')).rejects.toThrow(AppError);
    await expect(vehicleService.getById('non-existent-id')).rejects.toThrow(
      'Vehicle with ID "non-existent-id" not found',
    );
  });

  it('propagates repository failure errors', async () => {
    const dbError = new Error('Database connection failed');
    mockRepository.findById.mockRejectedValue(dbError);

    await expect(vehicleService.getById('v-123')).rejects.toThrow('Database connection failed');
  });

  it('throws AppError when ID format is invalid', async () => {
    await expect(vehicleService.getById('')).rejects.toThrow(AppError);
    await expect(vehicleService.getById('')).rejects.toThrow('Invalid vehicle ID');
  });
});
