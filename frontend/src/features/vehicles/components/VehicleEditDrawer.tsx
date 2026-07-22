/**
 * VehicleEditDrawer Component
 *
 * Right-side drawer for editing vehicles (40-50% width).
 * Never navigates away - opens as an overlay.
 * Blurred background with smooth Framer Motion animation.
 * Fullscreen on mobile.
 */

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { VehicleDTO } from '../../../api/api';

interface VehicleEditDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle?: VehicleDTO;
  children: React.ReactNode;
}

export function VehicleEditDrawer({ isOpen, onClose, vehicle, children }: VehicleEditDrawerProps) {
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
            onClick={onClose}
            className="fixed inset-0 bg-neutral-900/30 backdrop-blur-sm z-40"
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 right-0 z-50 w-full md:w-[45%] lg:w-[40%] bg-white shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
              <div>
                <h2 className="text-lg font-bold text-neutral-900">
                  {vehicle ? 'Edit Vehicle' : 'Add Vehicle'}
                </h2>
                {vehicle && (
                  <p className="text-sm text-neutral-500 mt-0.5">
                    {vehicle.make} {vehicle.model} · {vehicle.vin}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
                aria-label="Close drawer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
