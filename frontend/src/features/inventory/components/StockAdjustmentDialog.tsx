/**
 * StockAdjustmentDialog Component
 *
 * Dialog for adjusting stock quantities.
 * Inventory-focused - only modifies stock-related data.
 * Does not allow editing vehicle specifications.
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Package } from 'lucide-react';
import { InventoryItemDTO } from '../types/inventory.types';

const stockSchema = z.object({
  quantity: z.coerce.number().int('Stock quantity must be an integer').nonnegative('Stock quantity cannot be negative'),
  reason: z.string().min(1, 'Reason is required'),
});

type StockFormData = z.infer<typeof stockSchema>;

interface StockAdjustmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  item?: InventoryItemDTO;
  onSubmit: (data: StockFormData) => void;
  isLoading?: boolean;
}

export function StockAdjustmentDialog({ isOpen, onClose, item, onSubmit, isLoading }: StockAdjustmentDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<StockFormData>({
    resolver: zodResolver(stockSchema),
    defaultValues: {
      quantity: item?.quantity ?? 0,
      reason: '',
    },
  });

  const handleFormSubmit = (data: StockFormData) => {
    onSubmit(data);
    reset();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
            className="fixed inset-0 bg-neutral-900/30 backdrop-blur-sm z-40"
            aria-hidden="true"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-100">
                    <Package className="h-5 w-5 text-accent-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-neutral-900">Adjust Stock</h2>
                    {item && (
                      <p className="text-sm text-neutral-500">
                        {item.vehicle?.make} {item.vehicle?.model}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
                  aria-label="Close dialog"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Content */}
              <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-4">
                {/* Current Stock Info */}
                {item && (
                  <div className="bg-neutral-50 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-neutral-500">Current Stock:</span>
                        <p className="font-semibold text-neutral-900">{item.quantity}</p>
                      </div>
                      <div>
                        <span className="text-neutral-500">Status:</span>
                        <p className={`font-semibold ${item.available ? 'text-status-success' : 'text-status-error'}`}>
                          {item.available ? 'Available' : 'Unavailable'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* New Quantity */}
                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-neutral-700 mb-1.5">
                    New Quantity
                  </label>
                  <input
                    id="quantity"
                    type="number"
                    {...register('quantity')}
                    className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                    placeholder="Enter new quantity"
                  />
                  {errors.quantity && (
                    <p className="mt-1 text-xs text-status-error">{errors.quantity.message}</p>
                  )}
                </div>

                {/* Reason */}
                <div>
                  <label htmlFor="reason" className="block text-sm font-medium text-neutral-700 mb-1.5">
                    Reason for Adjustment
                  </label>
                  <select
                    id="reason"
                    {...register('reason')}
                    className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                  >
                    <option value="">Select a reason</option>
                    <option value="restock">Restock</option>
                    <option value="sale">Sale</option>
                    <option value="damage">Damage</option>
                    <option value="return">Return</option>
                    <option value="correction">Inventory Correction</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.reason && (
                    <p className="mt-1 text-xs text-status-error">{errors.reason.message}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isLoading}
                    className="flex-1 px-4 py-2.5 border border-neutral-300 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 px-4 py-2.5 bg-accent-600 text-white rounded-lg text-sm font-medium hover:bg-accent-700 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? 'Adjusting...' : 'Adjust Stock'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
