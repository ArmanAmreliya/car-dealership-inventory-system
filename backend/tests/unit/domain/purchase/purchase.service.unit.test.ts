import { PurchaseService } from '../../../../src/domain/purchase/purchase.service';
import type { IVehicleRepository } from '../../../../src/domain/vehicle/vehicle.repository';
import type { Vehicle } from '../../../../src/domain/vehicle/vehicle.types';
import { AppError } from '../../../../src/common/errors/AppError';

describe('PurchaseService', () => {
  let purchaseService: PurchaseService;
  let mockRepository: jest.Mocked<IVehicleRepository>;

  const availableVehicle: Vehicle = {
    id: 'v-001',
    make: 'Toyota',
    model: 'Camry',
    year: 2022,
    price: 25000,
    vin: 'VIN001',
    mileage: 0,
    color: 'Silver',
    createdAt: new Date(),
    isAvailable: true,
  };

  const unavailableVehicle: Vehicle = {
    ...availableVehicle,
    id: 'v-002',
    vin: 'VIN002',
    isAvailable: false,
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

    purchaseService = new PurchaseService(mockRepository);
  });

  describe('purchase()', () => {
    it('returns a PurchaseRecord with vehicle details on success', async () => {
      mockRepository.findById.mockResolvedValue(availableVehicle);
      mockRepository.update.mockResolvedValue({ ...availableVehicle, isAvailable: false });

      const record = await purchaseService.purchase({ vehicleId: 'v-001' });

      expect(record.vehicleId).toBe('v-001');
      expect(record.make).toBe('Toyota');
      expect(record.model).toBe('Camry');
      expect(record.year).toBe(2022);
      expect(record.vin).toBe('VIN001');
      expect(record.price).toBe(25000);
      expect(record.purchaseId).toBeDefined();
      expect(record.purchasedAt).toBeInstanceOf(Date);
    });

    it('reduces inventory by marking the vehicle unavailable', async () => {
      mockRepository.findById.mockResolvedValue(availableVehicle);
      mockRepository.update.mockResolvedValue({ ...availableVehicle, isAvailable: false });

      await purchaseService.purchase({ vehicleId: 'v-001' });

      expect(mockRepository.update).toHaveBeenCalledWith('v-001', { isAvailable: false });
    });

    it('generates a unique purchaseId for each purchase', async () => {
      mockRepository.findById.mockResolvedValue(availableVehicle);
      mockRepository.update.mockResolvedValue({ ...availableVehicle, isAvailable: false });

      const [a, b] = await Promise.all([
        purchaseService.purchase({ vehicleId: 'v-001' }),
        purchaseService.purchase({ vehicleId: 'v-001' }),
      ]);

      expect(a.purchaseId).not.toBe(b.purchaseId);
    });

    it('throws AppError 404 when the vehicle does not exist', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(purchaseService.purchase({ vehicleId: 'ghost' })).rejects.toThrow(AppError);
      await expect(purchaseService.purchase({ vehicleId: 'ghost' })).rejects.toMatchObject({
        statusCode: 404,
        message: 'Vehicle with ID "ghost" not found',
      });
      expect(mockRepository.update).not.toHaveBeenCalled();
    });

    it('throws AppError 409 when the vehicle is already unavailable', async () => {
      mockRepository.findById.mockResolvedValue(unavailableVehicle);

      await expect(purchaseService.purchase({ vehicleId: 'v-002' })).rejects.toThrow(AppError);
      await expect(purchaseService.purchase({ vehicleId: 'v-002' })).rejects.toMatchObject({
        statusCode: 409,
        message: 'Vehicle with ID "v-002" is not available for purchase',
      });
      expect(mockRepository.update).not.toHaveBeenCalled();
    });

    it('treats vehicles with no isAvailable field as available', async () => {
      const vehicleWithoutFlag: Vehicle = { ...availableVehicle, isAvailable: undefined };
      mockRepository.findById.mockResolvedValue(vehicleWithoutFlag);
      mockRepository.update.mockResolvedValue({ ...vehicleWithoutFlag, isAvailable: false });

      const record = await purchaseService.purchase({ vehicleId: 'v-001' });

      expect(record.vehicleId).toBe('v-001');
      expect(mockRepository.update).toHaveBeenCalledWith('v-001', { isAvailable: false });
    });

    it('throws AppError 400 when vehicleId is empty', async () => {
      await expect(purchaseService.purchase({ vehicleId: '' })).rejects.toThrow(AppError);
      await expect(purchaseService.purchase({ vehicleId: '' })).rejects.toMatchObject({
        statusCode: 400,
        message: 'vehicleId is required',
      });
      expect(mockRepository.findById).not.toHaveBeenCalled();
    });

    it('propagates unexpected repository failures', async () => {
      mockRepository.findById.mockRejectedValue(new Error('DB connection lost'));

      await expect(purchaseService.purchase({ vehicleId: 'v-001' })).rejects.toThrow(
        'DB connection lost',
      );
    });
  });
});
