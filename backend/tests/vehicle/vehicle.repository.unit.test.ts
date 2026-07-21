import { VehicleRepository } from '../../src/domain/vehicle/vehicle.repository';
import type { Vehicle } from '../../src/domain/vehicle/vehicle.types';

describe('VehicleRepository.findAll()', () => {
  let repository: VehicleRepository;

  const v1: Vehicle = {
    id: '1',
    make: 'Toyota',
    model: 'Camry',
    year: 2022,
    price: 25000,
    vin: 'VIN1',
    mileage: 10000,
    color: 'Red',
    createdAt: new Date(),
    isAvailable: true,
  };

  const v2: Vehicle = {
    id: '2',
    make: 'Honda',
    model: 'Civic',
    year: 2020,
    price: 18000,
    vin: 'VIN2',
    mileage: 30000,
    color: 'Blue',
    createdAt: new Date(),
    isAvailable: false,
  };

  beforeEach(() => {
    repository = new VehicleRepository();
    repository.save(v1);
    repository.save(v2);
  });

  it('should return all vehicles when no filters are passed', () => {
    expect(repository.findAll()).toHaveLength(2);
  });

  it('should filter by make', () => {
    const results = repository.findAll({ make: 'toyota' });
    expect(results).toEqual([v1]);
  });

  it('should filter by model', () => {
    const results = repository.findAll({ model: 'civic' });
    expect(results).toEqual([v2]);
  });

  it('should filter by year', () => {
    const results = repository.findAll({ year: 2022 });
    expect(results).toEqual([v1]);
  });

  it('should filter by availability', () => {
    const results = repository.findAll({ availability: true });
    expect(results).toEqual([v1]);
  });

  it('should filter by minPrice and maxPrice range', () => {
    const results = repository.findAll({ minPrice: 20000, maxPrice: 30000 });
    expect(results).toEqual([v1]);
  });
});
