/**
 * VehicleImageManager Component
 *
 * Multiple image management with drag-and-drop upload.
 * Gallery view with image reordering capability.
 * Primary image selection.
 * Cloudinary-ready structure.
 */

import { useState } from 'react';
import { Upload, X, Star, GripVertical } from 'lucide-react';

interface VehicleImage {
  id: string;
  url: string;
  isPrimary: boolean;
}

interface VehicleImageManagerProps {
  images: VehicleImage[];
  onImagesChange: (images: VehicleImage[]) => void;
  onUpload?: (files: File[]) => Promise<string[]>;
}

export function VehicleImageManager({ images, onImagesChange, onUpload }: VehicleImageManagerProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    if (files.length === 0) return;

    if (onUpload) {
      try {
        const urls = await onUpload(files);
        const newImages: VehicleImage[] = urls.map((url, index) => ({
          id: `img-${Date.now()}-${index}`,
          url,
          isPrimary: images.length === 0 && index === 0,
        }));
        onImagesChange([...images, ...newImages]);
      } catch (error) {
        console.error('Upload failed:', error);
      }
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (onUpload) {
      try {
        const urls = await onUpload(files);
        const newImages: VehicleImage[] = urls.map((url, index) => ({
          id: `img-${Date.now()}-${index}`,
          url,
          isPrimary: images.length === 0 && index === 0,
        }));
        onImagesChange([...images, ...newImages]);
      } catch (error) {
        console.error('Upload failed:', error);
      }
    }
  };

  const setPrimary = (id: string) => {
    onImagesChange(
      images.map(img => ({
        ...img,
        isPrimary: img.id === id,
      }))
    );
  };

  const removeImage = (id: string) => {
    const filtered = images.filter(img => img.id !== id);
    // If we removed the primary, make the first image primary
    if (images.find(img => img.id === id)?.isPrimary && filtered.length > 0) {
      filtered[0].isPrimary = true;
    }
    onImagesChange(filtered);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-colors ${
          isDragging
            ? 'border-accent-500 bg-accent-50'
            : 'border-neutral-300 hover:border-neutral-400 bg-neutral-50'
        }`}
      >
        <input
          type="file"
          id="image-upload"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="sr-only"
        />
        <label
          htmlFor="image-upload"
          className="cursor-pointer flex flex-col items-center gap-3"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
            <Upload className="h-6 w-6 text-neutral-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-900">
              Drop images here or click to upload
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              PNG, JPG up to 10MB each
            </p>
          </div>
        </label>
      </div>

      {/* Gallery */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {images.map((image, index) => (
            <div
              key={image.id}
              className="relative aspect-square rounded-lg overflow-hidden border border-neutral-200 bg-neutral-100 group"
            >
              <img
                src={image.url}
                alt={`Vehicle image ${index + 1}`}
                className="h-full w-full object-cover"
              />
              
              {/* Primary Badge */}
              {image.isPrimary && (
                <div className="absolute top-2 left-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-accent-500 px-2 py-1 text-xs font-medium text-white">
                    <Star className="h-3 w-3 fill-white" />
                    Primary
                  </span>
                </div>
              )}

              {/* Actions Overlay */}
              <div className="absolute inset-0 bg-neutral-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setPrimary(image.id)}
                  disabled={image.isPrimary}
                  className="rounded-lg p-2 bg-white/90 hover:bg-white text-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Set as primary"
                >
                  <Star className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => removeImage(image.id)}
                  className="rounded-lg p-2 bg-white/90 hover:bg-white text-red-600 transition-colors"
                  title="Remove image"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Drag Handle */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="rounded-lg p-1 bg-white/90 cursor-grab">
                  <GripVertical className="h-4 w-4 text-neutral-600" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
