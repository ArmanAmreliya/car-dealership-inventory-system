import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn, Star, Image as ImageIcon } from 'lucide-react';
import { VehicleDTO } from '../../../api/api';

interface VehicleImageGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: VehicleDTO;
}

export function VehicleImageGalleryModal({ isOpen, onClose, vehicle }: VehicleImageGalleryModalProps) {
  // Collect images array or fallback to primary vehicle.imageUrl
  const images = vehicle.imageUrl
    ? [vehicle.imageUrl]
    : [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const currentImage = images[currentIndex];

  const handleNext = () => {
    if (images.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }
  };

  const handlePrev = () => {
    if (images.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative z-10 flex h-full max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl text-white"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
              <div>
                <h2 className="text-base font-bold text-white">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </h2>
                <p className="text-xs font-mono text-slate-400">VIN: {vehicle.vin}</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsZoomed((z) => !z)}
                  className="rounded-xl border border-slate-800 p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-all"
                  title="Toggle Zoom"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
                <button
                  onClick={onClose}
                  className="rounded-xl border border-slate-800 p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-all"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Main Stage */}
            <div className="relative flex-1 flex items-center justify-center overflow-hidden bg-slate-950 p-6">
              {currentImage ? (
                <motion.img
                  key={currentImage}
                  src={currentImage}
                  alt={`${vehicle.make} ${vehicle.model}`}
                  animate={{ scale: isZoomed ? 1.4 : 1 }}
                  transition={{ duration: 0.25 }}
                  className={`max-h-full max-w-full object-contain ${
                    isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
                  }`}
                  onClick={() => setIsZoomed((z) => !z)}
                />
              ) : (
                <div className="flex flex-col items-center gap-3 text-slate-500">
                  <ImageIcon className="h-16 w-16" />
                  <p className="text-sm font-medium">No high-res photo uploaded for this vehicle</p>
                </div>
              )}

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    className="absolute left-4 rounded-full border border-slate-800 bg-slate-900/80 p-3 text-white backdrop-blur-md hover:bg-slate-800 transition-all"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-4 rounded-full border border-slate-800 bg-slate-900/80 p-3 text-white backdrop-blur-md hover:bg-slate-800 transition-all"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Strip */}
            {images.length > 0 && (
              <div className="flex items-center justify-center gap-3 border-t border-slate-800 bg-slate-900 p-4">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`relative h-14 w-20 overflow-hidden rounded-xl border-2 transition-all ${
                      currentIndex === idx
                        ? 'border-teal-500 ring-2 ring-teal-500/30'
                        : 'border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumb" className="h-full w-full object-cover" />
                    {idx === 0 && (
                      <span className="absolute top-1 left-1 rounded bg-teal-500 p-0.5 text-[8px] font-bold text-white">
                        <Star className="h-2.5 w-2.5 fill-white" />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
