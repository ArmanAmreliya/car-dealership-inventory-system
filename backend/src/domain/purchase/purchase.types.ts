export interface PurchaseRequest {
  vehicleId: string;
}

export interface PurchaseRecord {
  purchaseId: string;
  vehicleId: string;
  make: string;
  model: string;
  year: number;
  vin: string;
  price: number;
  purchasedAt: Date;
}
