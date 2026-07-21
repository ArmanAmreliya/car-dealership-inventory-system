export interface InventoryItem {
  vehicleId: string;
  make: string;
  model: string;
  year: number;
  vin: string;
  price: number;
  stockQuantity: number;
  isAvailable: boolean;
}

export interface InventoryStatus {
  totalVehicles: number;
  availableVehicles: number;
  unavailableVehicles: number;
  items: InventoryItem[];
}

export interface StockUpdate {
  stockQuantity: number;
}
