/**
 * PurchaseSummaryStep Component
 *
 * Summary step in the purchase workflow showing vehicle and customer info.
 * Used before final confirmation.
 */

import { VehicleDTO } from '../../../api/api';

interface CustomerData {
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface PurchaseSummaryStepProps {
  vehicle: VehicleDTO;
  customer: CustomerData;
  onConfirm: () => void;
  onBack: () => void;
}

export function PurchaseSummaryStep({ vehicle, customer, onConfirm, onBack }: PurchaseSummaryStepProps) {
  const formatPrice = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

  return (
    <div>
      <h2 className="text-xl font-bold text-neutral-900 mb-2">Purchase Summary</h2>
      <p className="text-sm text-neutral-500 mb-6">Review the purchase details before confirming</p>

      {/* Vehicle Summary */}
      <div className="bg-neutral-50 rounded-xl p-6 mb-6">
        <h3 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider mb-4">Vehicle</h3>
        
        <div className="flex items-start gap-4">
          {vehicle.imageUrl && (
            <img
              src={vehicle.imageUrl}
              alt={vehicle.make}
              className="h-24 w-32 object-cover rounded-lg"
            />
          )}
          <div className="flex-1">
            <h4 className="font-bold text-neutral-900 text-lg">
              {vehicle.make} {vehicle.model}
            </h4>
            <div className="mt-2 space-y-1 text-sm">
              <p className="text-neutral-600">
                <span className="font-medium">Year:</span> {vehicle.year}
              </p>
              <p className="text-neutral-600">
                <span className="font-medium">VIN:</span> {vehicle.vin}
              </p>
              {vehicle.mileage && (
                <p className="text-neutral-600">
                  <span className="font-medium">Mileage:</span> {vehicle.mileage.toLocaleString()} mi
                </p>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-accent-600">
              {formatPrice(vehicle.price)}
            </p>
          </div>
        </div>
      </div>

      {/* Customer Summary */}
      <div className="bg-neutral-50 rounded-xl p-6 mb-6">
        <h3 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider mb-4">Customer</h3>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-neutral-500">Name:</span>
            <span className="font-medium text-neutral-900">{customer.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">Email:</span>
            <span className="font-medium text-neutral-900">{customer.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">Phone:</span>
            <span className="font-medium text-neutral-900">{customer.phone}</span>
          </div>
          {customer.address && (
            <div className="flex justify-between">
              <span className="text-neutral-500">Address:</span>
              <span className="font-medium text-neutral-900">{customer.address}</span>
            </div>
          )}
        </div>
      </div>

      {/* Total */}
      <div className="border-t border-neutral-200 pt-4 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-neutral-900">Total</span>
          <span className="text-2xl font-bold text-accent-600">{formatPrice(vehicle.price)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 px-4 py-2.5 border border-neutral-300 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="flex-1 px-4 py-2.5 bg-accent-600 text-white rounded-lg text-sm font-medium hover:bg-accent-700 transition-colors"
        >
          Continue to Confirm
        </button>
      </div>
    </div>
  );
}
