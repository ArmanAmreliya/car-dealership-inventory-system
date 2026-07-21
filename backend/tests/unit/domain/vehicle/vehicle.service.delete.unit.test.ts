import { VehicleService } from '../../../../src/domain/vehicle/vehicle.service';
import type { IVehicleRepository } from '../../../../src/domain/vehicle/vehicle.repository';
import { AppError } from '../../../../src/common/errors/AppError';

describe('VehicleService.delete()', () => {
  let vehicleService: VehicleService;
  let mockRepository: jest.Mocked<IVehicleRepository>;

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

  it('resolves without error when vehicle is deleted', async () => {
    mockRepository.delete.mockResolvedValue(true);

    await expect(vehicleService.delete('v-001')).resolves.toBeUndefined();
    expect(mockRepository.delete).toHaveBeenCalledWith('v-001');
  });

  it('throws AppError 404 when vehicle does not exist', async () => {
    mockRepository.delete.mockResolvedValue(false);

    await expect(vehicleService.delete('ghost-id')).rejects.toThrow(AppError);
    await expect(vehicleService.delete('ghost-id')).rejects.toThrow(
      'Vehicle with ID "ghost-id" not found',
    );
  });

  it('throws AppError 400 when ID is empty', async () => {
    await expect(vehicleService.delete('')).rejects.toThrow(AppError);
    await expect(vehicleService.delete('')).rejects.toThrow('Invalid vehicle ID');
    expect(mockRepository.delete).not.toHaveBeenCalled();
  });

  it('propagates repository failures', async () => {
    mockRepository.delete.mockRejectedValue(new Error('DB connection lost'));

    await expect(vehicleService.delete('v-001')).rejects.toThrow('DB connection lost');
  });
});
