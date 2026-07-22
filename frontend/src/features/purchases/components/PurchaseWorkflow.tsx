/**
 * PurchaseWorkflow Component
 *
 * Workflow-based transaction flow for purchases.
 * Steps: Select Vehicle → Customer → Purchase Summary → Confirm Purchase
 * Converts inventory into sales transactions.
 */

import { useState } from 'react';
import { VehicleDTO } from '../../../api/api';
import { VehicleSelectionCard } from './VehicleSelectionCard';
import { PurchaseSummaryStep } from './PurchaseSummaryStep';

type PurchaseStep = 'select-vehicle' | 'customer' | 'summary' | 'confirm';

interface PurchaseWorkflowProps {
  availableVehicles: VehicleDTO[];
  onPurchaseComplete: (purchaseData: any) => void;
  onCancel: () => void;
}

export function PurchaseWorkflow({ availableVehicles, onPurchaseComplete, onCancel }: PurchaseWorkflowProps) {
  const [currentStep, setCurrentStep] = useState<PurchaseStep>('select-vehicle');
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleDTO | null>(null);
  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const steps = [
    { id: 'select-vehicle', label: 'Select Vehicle' },
    { id: 'customer', label: 'Customer' },
    { id: 'summary', label: 'Summary' },
    { id: 'confirm', label: 'Confirm' },
  ] as const;

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  const handleVehicleSelect = (vehicle: VehicleDTO) => {
    setSelectedVehicle(vehicle);
    setCurrentStep('customer');
  };

  const handleCustomerNext = () => {
    setCurrentStep('summary');
  };

  const handleSummaryConfirm = () => {
    setCurrentStep('confirm');
  };

  const handleFinalConfirm = () => {
    onPurchaseComplete({
      vehicleId: selectedVehicle?.id,
      customer: customerData,
    });
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1].id as PurchaseStep);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                    index <= currentStepIndex
                      ? 'bg-accent-600 text-white'
                      : 'bg-neutral-100 text-neutral-400'
                  }`}
                >
                  {index + 1}
                </div>
                <span className={`mt-2 text-xs font-medium ${
                  index <= currentStepIndex ? 'text-neutral-900' : 'text-neutral-400'
                }`}>
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 ${
                  index < currentStepIndex ? 'bg-accent-600' : 'bg-neutral-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
        {currentStep === 'select-vehicle' && (
          <div>
            <h2 className="text-xl font-bold text-neutral-900 mb-2">Select Vehicle</h2>
            <p className="text-sm text-neutral-500 mb-6">Choose a vehicle from your available inventory</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableVehicles.map(vehicle => (
                <VehicleSelectionCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  isSelected={selectedVehicle?.id === vehicle.id}
                  onSelect={() => handleVehicleSelect(vehicle)}
                />
              ))}
            </div>

            {availableVehicles.length === 0 && (
              <div className="text-center py-12">
                <p className="text-sm text-neutral-500">No vehicles available for purchase</p>
              </div>
            )}
          </div>
        )}

        {currentStep === 'customer' && (
          <div>
            <h2 className="text-xl font-bold text-neutral-900 mb-2">Customer Information</h2>
            <p className="text-sm text-neutral-500 mb-6">Enter customer details for this purchase</p>

            <div className="space-y-4 max-w-md">
              <div>
                <label htmlFor="customer-name" className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Full Name
                </label>
                <input
                  id="customer-name"
                  type="text"
                  value={customerData.name}
                  onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })}
                  className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="customer-email" className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Email
                </label>
                <input
                  id="customer-email"
                  type="email"
                  value={customerData.email}
                  onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })}
                  className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label htmlFor="customer-phone" className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Phone
                </label>
                <input
                  id="customer-phone"
                  type="tel"
                  value={customerData.phone}
                  onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value })}
                  className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                  placeholder="(555) 123-4567"
                />
              </div>

              <div>
                <label htmlFor="customer-address" className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Address
                </label>
                <textarea
                  id="customer-address"
                  rows={2}
                  value={customerData.address}
                  onChange={(e) => setCustomerData({ ...customerData, address: e.target.value })}
                  className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 resize-none"
                  placeholder="123 Main St, City, State 12345"
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 'summary' && selectedVehicle && (
          <PurchaseSummaryStep
            vehicle={selectedVehicle}
            customer={customerData}
            onConfirm={handleSummaryConfirm}
            onBack={handleBack}
          />
        )}

        {currentStep === 'confirm' && selectedVehicle && (
          <div>
            <h2 className="text-xl font-bold text-neutral-900 mb-2">Confirm Purchase</h2>
            <p className="text-sm text-neutral-500 mb-6">Review and confirm the purchase details</p>

            <div className="bg-accent- border border-accent-200 rounded-xl p-6 mb-6">
              <div className="flex items-center gap-4 mb-4">
                {selectedVehicle.imageUrl && (
                  <img
                    src={selectedVehicle.imageUrl}
                    alt={selectedVehicle.make}
                    className="h-20 w-32 object-cover rounded-lg"
                  />
                )}
                <div>
                  <h3 className="font-bold text-neutral-900">
                    {selectedVehicle.make} {selectedVehicle.model}
                  </h3>
                  <p className="text-sm text-neutral-500">{selectedVehicle.year} · {selectedVehicle.vin}</p>
                  <p className="text-lg font-bold text-accent-600 mt-1">
                    ${selectedVehicle.price.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="border-t border-accent-200 pt-4 mt-4">
                <h4 className="font-semibold text-neutral-900 mb-2">Customer</h4>
                <p className="text-sm text-neutral-700">{customerData.name}</p>
                <p className="text-sm text-neutral-500">{customerData.email}</p>
                <p className="text-sm text-neutral-500">{customerData.phone}</p>
              </div>
            </div>

            <div className="bg-status-warning/10 border border-status-warning/20 rounded-lg p-4 mb-6">
              <p className="text-sm text-status-warning font-medium">
                This action will reduce inventory and create a purchase record. This cannot be undone.
              </p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-neutral-200">
          <button
            type="button"
            onClick={currentStep === 'select-vehicle' ? onCancel : handleBack}
            className="px-4 py-2.5 border border-neutral-300 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
          >
            {currentStep === 'select-vehicle' ? 'Cancel' : 'Back'}
          </button>

          {currentStep === 'customer' && (
            <button
              type="button"
              onClick={handleCustomerNext}
              disabled={!customerData.name || !customerData.email}
              className="px-6 py-2.5 bg-accent-600 text-white rounded-lg text-sm font-medium hover:bg-accent-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue to Summary
            </button>
          )}

          {currentStep === 'confirm' && (
            <button
              type="button"
              onClick={handleFinalConfirm}
              className="px-6 py-2.5 bg-accent-600 text-white rounded-lg text-sm font-medium hover:bg-accent-700 transition-colors"
            >
              Confirm Purchase
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
