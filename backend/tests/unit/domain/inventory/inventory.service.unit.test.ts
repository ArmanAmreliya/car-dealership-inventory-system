import { InventoryService } from '../../../../src/domain/inventory/inventory.service';
import type { IVehicleRepository } from '../../../../src/domain/vehicle/vehicle.repository';
import type { Vehicle } from '../../../../src/domain/vehicle/vehicle.types';
import { AppError } from '../../../../src/common/errors/AppError';

describe('InventoryService', () => {
  let inventoryService: InventoryService;
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
    id: 'v-002',
    make: 'Honda',
    model: 'Civic',
    year: 2021,
    price: 20000,
    vin: 'VIN002',
    mileage: 5000,
    color: 'Blue',
    createdAt: new Date(),
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

    inventoryService = new InventoryService(mockRepository);
  });

  describe('getStatus()', () => {
    it('returns zero counts for an empty inventory', () => {
      mockRepository.findAll.mockReturnValue([]);

      const status = inventoryService.getStatus();

      expect(status.totalVehicles).toBe(0);
      expect(status.availableVehicles).toBe(0);
      expect(status.unavailableVehicles).toBe(0);
      expect(status.items).toEqual([]);
    });

    it('returns correct aggregate counts', () => {
      mockRepository.findAll.mockReturnValue([availableVehicle, unavailableVehicle]);

      const status = inventoryService.getStatus();

      expect(status.totalVehicles).toBe(2);
      expect(status.availableVehicles).toBe(1);
      expect(status.unavailableVehicles).toBe(1);
    });

    it('maps a vehicle to an InventoryItem correctly', () => {
      mockRepository.findAll.mockReturnValue([availableVehicle]);

      const { items } = inventoryService.getStatus();

      expect(items[0]).toEqual({
        vehicleId: 'v-001',
        make: 'Toyota',
        model: 'Camry',
        year: 2022,
        vin: 'VIN001',
        price: 25000,
        stockQuantity: 1,
        isAvailable: true,
      });
    });

    it('treats vehicles with no isAvailable field as available', () => {
      const vehicleWithoutFlag: Vehicle = { ...availableVehicle, isAvailable: undefined };
      mockRepository.findAll.mockReturnValue([vehicleWithoutFlag]);

      const status = inventoryService.getStatus();

      expect(status.availableVehicles).toBe(1);
      expect(status.items[0].stockQuantity).toBe(1);
    });

    it('sets stockQuantity 0 for unavailable vehicles', () => {
      mockRepository.findAll.mockReturnValue([unavailableVehicle]);

      const { items } = inventoryService.getStatus();

      expect(items[0].stockQuantity).toBe(0);
      expect(items[0].isAvailable).toBe(false);
    });
  });

  describe('updateStock()', () => {
    it('marks vehicle as available when stockQuantity > 0', async () => {
      const updated: Vehicle = { ...unavailableVehicle, isAvailable: true };
      mockRepository.update.mockResolvedValue(updated);

      const item = await inventoryService.updateStock('v-002', { stockQuantity: 1 });

      expect(mockRepository.update).toHaveBeenCalledWith('v-002', { isAvailable: true });
      expect(item.isAvailable).toBe(true);
      expect(item.stockQuantity).toBe(1);
    });

    it('marks vehicle as unavailable when stockQuantity is 0', async () => {
      const updated: Vehicle = { ...availableVehicle, isAvailable: false };
      mockRepository.update.mockResolvedValue(updated);

      const item = await inventoryService.updateStock('v-001', { stockQuantity: 0 });

      expect(mockRepository.update).toHaveBeenCalledWith('v-001', { isAvailable: false });
      expect(item.isAvailable).toBe(false);
      expect(item.stockQuantity).toBe(0);
    });

    it('throws AppError 404 when vehicle is not found', async () => {
      mockRepository.update.mockResolvedValue(null);

      await expect(inventoryService.updateStock('ghost', { stockQuantity: 1 })).rejects.toThrow(AppError);
      await expect(inventoryService.updateStock('ghost', { stockQuantity: 1 })).rejects.toThrow(
        'Vehicle with ID "ghost" not found',
      );
    });

    it('throws AppError 400 for empty vehicle ID', async () => {
      await expect(inventoryService.updateStock('', { stockQuantity: 1 })).rejects.toThrow(AppError);
      await expect(inventoryService.updateStock('', { stockQuantity: 1 })).rejects.toThrow(
        'Invalid vehicle ID',
      );
      expect(mockRepository.update).not.toHaveBeenCalled();
    });

    it('throws AppError 400 for negative stockQuantity', async () => {
      await expect(inventoryService.updateStock('v-001', { stockQuantity: -1 })).rejects.toThrow(AppError);
      await expect(inventoryService.updateStock('v-001', { stockQuantity: -1 })).rejects.toThrow(
        'Stock quantity cannot be negative',
      );
      expect(mockRepository.update).not.toHaveBeenCalled();
    });

    it('propagates repository failures', async () => {
      mockRepository.update.mockRejectedValue(new Error('DB error'));

      await expect(inventoryService.updateStock('v-001', { stockQuantity: 1 })).rejects.toThrow('DB error');
    });
  });
});
