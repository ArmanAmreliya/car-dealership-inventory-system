import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Check, AlertCircle, Plus, Upload } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { InventoryItemDTO } from '../types/inventory.types';
import { vehicleService } from '../../../api/api';
import { inventoryService } from '../../../api/api';
import { VehicleImageUpload } from '../../vehicles/components/VehicleImageUpload';
import { toast } from 'sonner';

interface InventoryEditDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  item: InventoryItemDTO | null;
  onSuccess: () => void;
}

export function InventoryEditDrawer({ isOpen, onClose, item, onSuccess }: InventoryEditDrawerProps) {
  const queryClient = useQueryClient();
  const isCreate = !item;

  // Form states
  const [vin, setVin] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [trim, setTrim] = useState('');
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [price, setPrice] = useState<number>(0);
  const [salePrice, setSalePrice] = useState<number>(0);
  const [mileage, setMileage] = useState<number>(0);
  const [color, setColor] = useState('');
  const [arrivalDate, setArrivalDate] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState<number>(1);
  const [isAvailable, setIsAvailable] = useState<boolean>(true);
  const [isFeatured, setIsFeatured] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Sync drawer form state whenever `item` or `isOpen` changes
  useEffect(() => {
    if (!isOpen) return;

    if (item && item.vehicle) {
      const veh = item.vehicle;
      setVin(veh.vin || '');
      setMake(veh.make || '');
      setModel(veh.model || '');
      setTrim((veh as any).trim || '');
      setYear(veh.year || new Date().getFullYear());
      setPrice(veh.price || 0);
      setSalePrice((veh as any).salePrice || veh.price || 0);
      setMileage(veh.mileage || 0);
      setColor(veh.color || '');
      setArrivalDate((veh as any).arrivalDate || new Date().toISOString().split('T')[0]);
      setDescription((veh as any).description || '');
      setQuantity(item.quantity ?? 1);
      setIsAvailable(item.available ?? true);
      setIsFeatured((veh as any).isFeatured ?? false);

      const storedImage = veh.imageUrl || (item as any).imageUrl || '';
      setImageUrl(storedImage);
      setGalleryImages(storedImage ? [storedImage] : []);
    } else {
      setVin('');
      setMake('');
      setModel('');
      setTrim('');
      setYear(new Date().getFullYear());
      setPrice(0);
      setSalePrice(0);
      setMileage(0);
      setColor('');
      setArrivalDate(new Date().toISOString().split('T')[0]);
      setDescription('');
      setQuantity(1);
      setIsAvailable(true);
      setIsFeatured(false);
      setImageUrl('');
      setGalleryImages([]);
    }
    setErrorMsg('');
  }, [item, isOpen]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!make.trim() || !model.trim() || !vin.trim()) {
      setErrorMsg('Make, Model, and VIN are required fields.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      if (isCreate) {
        // Create vehicle via API endpoint
        await vehicleService.createVehicle({
          vin: vin.trim(),
          make: make.trim(),
          model: model.trim(),
          year: Number(year),
          price: Number(price),
          mileage: Number(mileage),
          color: color.trim(),
          imageUrl: imageUrl.trim() || undefined,
        });
        toast.success(`Created vehicle: ${year} ${make} ${model}`);
      } else if (item && item.vehicleId) {
        // Update vehicle details in backend database
        await vehicleService.updateVehicle(item.vehicleId, {
          vin: vin.trim(),
          make: make.trim(),
          model: model.trim(),
          year: Number(year),
          price: Number(price),
          mileage: Number(mileage),
          color: color.trim(),
          imageUrl: imageUrl.trim() || undefined,
        });

        // Update inventory stock quantity in backend database
        if (item.id) {
          await inventoryService.updateStock(item.id, {
            stockQuantity: Number(quantity),
          });
        }
        toast.success(`Updated ${make} ${model} in backend inventory`);
      }

      // Invalidate queries so live data refetches immediately from backend
      await queryClient.invalidateQueries({ queryKey: ['inventory'] });
      await queryClient.invalidateQueries({ queryKey: ['vehicles'] });

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Failed to save changes to backend database.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUploaded = (uploadedUrl: string | undefined) => {
    const finalUrl = uploadedUrl || '';
    setImageUrl(finalUrl);
    if (finalUrl && !galleryImages.includes(finalUrl)) {
      setGalleryImages([finalUrl, ...galleryImages]);
    }
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
            onClick={onClose}
            className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer Slide Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-xl bg-white shadow-2xl flex flex-col border-l border-slate-200 overflow-hidden"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/80">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {isCreate ? 'Add New Vehicle' : 'Edit Vehicle Details'}
                </h2>
                <p className="text-xs font-medium text-slate-500">
                  {isCreate ? 'Enter vehicle information to create stock entry' : `VIN: ${vin || '—'}`}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Form Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Error Notice */}
              {errorMsg && (
                <div className="rounded-xl bg-rose-50 border border-rose-200 p-4 text-xs font-semibold text-rose-800 flex items-start gap-3">
                  <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Cloudinary Vehicle Image Uploader */}
              <div className="space-y-3">
                <VehicleImageUpload
                  initialUrl={imageUrl}
                  onImageChange={handleImageUploaded}
                />

                {/* Optional Custom Image URL input */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Or Direct Image URL (Cloudinary / External)
                  </label>
                  <input
                    type="url"
                    placeholder="https://res.cloudinary.com/..."
                    value={imageUrl}
                    onChange={(e) => handleImageUploaded(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-xs font-mono text-slate-900 focus:bg-white focus:border-[#55E6D9] focus:outline-none transition-all"
                  />
                </div>
              </div>

              <hr className="border-slate-100" />

              {/* Form Fields: Details */}
              <form id="vehicle-edit-form" onSubmit={handleSave} className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Vehicle Specifications
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Year <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      value={year}
                      onChange={(e) => setYear(Number(e.target.value))}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-xs font-semibold text-slate-900 focus:bg-white focus:border-[#55E6D9] focus:outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Make <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. CHEVROLET"
                      value={make}
                      onChange={(e) => setMake(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-xs font-semibold text-slate-900 focus:bg-white focus:border-[#55E6D9] focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Model <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. MALIBU"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-xs font-semibold text-slate-900 focus:bg-white focus:border-[#55E6D9] focus:outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Trim</label>
                    <input
                      type="text"
                      placeholder="e.g. LS / Premier"
                      value={trim}
                      onChange={(e) => setTrim(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-xs font-semibold text-slate-900 focus:bg-white focus:border-[#55E6D9] focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Exterior Color</label>
                    <input
                      type="text"
                      placeholder="e.g. Silver"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-xs font-semibold text-slate-900 focus:bg-white focus:border-[#55E6D9] focus:outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Mileage</label>
                    <input
                      type="number"
                      placeholder="e.g. 135541"
                      value={mileage}
                      onChange={(e) => setMileage(Number(e.target.value))}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-xs font-semibold text-slate-900 focus:bg-white focus:border-[#55E6D9] focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Price ($)</label>
                    <input
                      type="number"
                      placeholder="e.g. 8900"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-xs font-semibold text-slate-900 focus:bg-white focus:border-[#55E6D9] focus:outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Sale Price ($)</label>
                    <input
                      type="number"
                      placeholder="e.g. 7900"
                      value={salePrice}
                      onChange={(e) => setSalePrice(Number(e.target.value))}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-xs font-semibold text-slate-900 focus:bg-white focus:border-[#55E6D9] focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      VIN <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="17-digit VIN"
                      value={vin}
                      onChange={(e) => setVin(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-xs font-mono font-semibold text-slate-900 focus:bg-white focus:border-[#55E6D9] focus:outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Arrival Date</label>
                    <input
                      type="date"
                      value={arrivalDate}
                      onChange={(e) => setArrivalDate(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-xs font-semibold text-slate-900 focus:bg-white focus:border-[#55E6D9] focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <hr className="border-slate-100 my-4" />

                {/* Inventory Control */}
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Inventory & Stock Quantity
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Stock Quantity</label>
                    <div className="flex items-center">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(0, quantity - 1))}
                        className="rounded-l-xl border border-slate-200 bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 transition-colors"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="0"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        className="w-full border-y border-slate-200 bg-white py-2 text-center text-xs font-bold text-slate-900 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setQuantity(quantity + 1)}
                        className="rounded-r-xl border border-slate-200 bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Availability Status</label>
                    <button
                      type="button"
                      onClick={() => setIsAvailable(!isAvailable)}
                      className={`w-full py-2 rounded-xl text-xs font-bold border transition-colors ${
                        isAvailable
                          ? 'border-[#55E6D9] bg-[#55E6D9]/10 text-slate-950'
                          : 'border-slate-200 bg-slate-100 text-slate-500'
                      }`}
                    >
                      {isAvailable ? 'Marked Available' : 'Marked Sold'}
                    </button>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                  <textarea
                    rows={4}
                    placeholder="Enter detailed vehicle description..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs text-slate-900 focus:bg-white focus:border-[#55E6D9] focus:outline-none transition-all resize-none"
                  />
                </div>
              </form>
            </div>

            {/* Drawer Footer (Sticky Actions) */}
            <div className="border-t border-slate-200 px-6 py-4 bg-slate-50/90 flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                form="vehicle-edit-form"
                disabled={isSubmitting}
                className="rounded-xl bg-slate-900 px-6 py-2.5 text-xs font-bold text-[#55E6D9] shadow-md hover:bg-slate-800 disabled:opacity-50 transition-all flex items-center gap-2"
              >
                {isSubmitting ? (
                  <span>Saving to Backend...</span>
                ) : (
                  <>
                    <Check className="h-4 w-4 stroke-[3]" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
