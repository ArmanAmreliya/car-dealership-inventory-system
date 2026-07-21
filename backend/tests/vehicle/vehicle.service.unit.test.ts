import { VehicleService } from '../../src/domain/vehicle/vehicle.service';
import type { IVehicleRepository } from '../../src/domain/vehicle/vehicle.repository';
import type { Vehicle, VehicleFilters } from '../../src/domain/vehicle/vehicle.types';

describe('VehicleService.list()', () => {
  let vehicleService: VehicleService;
  let mockRepository: jest.Mocked<IVehicleRepository>;

  const mockVehicles: Vehicle[] = [
    {
      id: 'v1',
      make: 'Toyota',
      model: 'Camry',
      year: 2022,
      price: 25000,
      vin: 'VIN123',
      mileage: 15000,
      color: 'Black',
      createdAt: new Date(),
      isAvailable: true,
    },
    {
      id: 'v2',
      make: 'Honda',
      model: 'Civic',
      year: 2021,
      price: 20000,
      vin: 'VIN456',
      mileage: 25000,
      color: 'White',
      createdAt: new Date(),
      isAvailable: false,
    },
  ];

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      nextId: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
    };
    vehicleService = new VehicleService(mockRepository);
  });

  it('should return all vehicles when no filters are provided', () => {
    mockRepository.findAll.mockReturnValue(mockVehicles);

    const result = vehicleService.list();

    expect(mockRepository.findAll).toHaveBeenCalledWith(undefined);
    expect(result).toEqual(mockVehicles);
  });

  it('should pass filters to the repository when provided', () => {
    const filters: VehicleFilters = {
      make: 'Toyota',
      model: 'Camry',
      year: 2022,
      availability: true,
      minPrice: 20000,
      maxPrice: 30000,
    };
    mockRepository.findAll.mockReturnValue([mockVehicles[0]]);

    const result = vehicleService.list(filters);

    expect(mockRepository.findAll).toHaveBeenCalledWith(filters);
    expect(result).toEqual([mockVehicles[0]]);
  });
});
