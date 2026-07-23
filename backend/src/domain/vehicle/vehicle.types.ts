export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  vin: string;
  mileage: number;
  color: string;
  imageUrl?: string;
  createdAt: Date;
  isAvailable?: boolean;
  /** Actual stock quantity stored per vehicle. Defaults to 1 on creation. */
  stockQuantity?: number;
}

export interface VehicleUpdate {
  make?: string;
  model?: string;
  year?: number;
  price?: number;
  mileage?: number;
  color?: string;
  imageUrl?: string;
  isAvailable?: boolean;
  stockQuantity?: number;
}

export interface VehicleFilters {
  make?: string;
  model?: string;
  year?: number;
  availability?: boolean;
  minPrice?: number;
  maxPrice?: number;
}
