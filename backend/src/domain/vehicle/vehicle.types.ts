export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  vin: string;
  mileage: number;
  color: string;
  createdAt: Date;
  isAvailable?: boolean;
}

export interface VehicleFilters {
  make?: string;
  model?: string;
  year?: number;
  availability?: boolean;
  minPrice?: number;
  maxPrice?: number;
}

