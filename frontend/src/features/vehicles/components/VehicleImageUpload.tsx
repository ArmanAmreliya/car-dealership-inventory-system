import React, { useState } from 'react';
import { vehicleService } from '../../../api/api';

interface VehicleImageUploadProps {
  initialUrl?: string;
  onImageChange: (url: string | undefined) => void;
  disabled?: boolean;
}

export function VehicleImageUpload({
  initialUrl,
  onImageChange,
  disabled = false,
}: VehicleImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(initialUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, WebP)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image size must be less than 5MB');
      return;
    }

    setUploadError(null);
    setIsUploading(true);

    try {
      // 1. Get signed signature from backend
      const sigData = await vehicleService.getUploadSignature();

      // 2. Upload file directly to Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', sigData.apiKey);
      formData.append('timestamp', sigData.timestamp.toString());
      formData.append('signature', sigData.signature);
      formData.append('folder', sigData.folder);

      const cloudinaryRes = await fetch(
        `https://api.cloudinary.com/v1_1/${sigData.cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!cloudinaryRes.ok) {
        throw new Error('Failed to upload image to Cloudinary');
      }

      const uploadResult = await cloudinaryRes.json();
      const secureUrl = uploadResult.secure_url;

      setPreviewUrl(secureUrl);
      onImageChange(secureUrl);
    } catch (err: any) {
      setUploadError(err.message || 'Error uploading image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreviewUrl(undefined);
    onImageChange(undefined);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-slate-700">
        Vehicle Image <span className="text-xs font-normal text-slate-400">(optional)</span>
      </label>

      {previewUrl ? (
        <div className="relative group overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
          <img
            src={previewUrl}
            alt="Vehicle preview"
            className="h-48 w-full object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              type="button"
              onClick={handleRemove}
              disabled={disabled}
              className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white shadow-lg hover:bg-red-700 transition-colors"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
              Remove Image
            </button>
          </div>
        </div>
      ) : (
        <div className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-6 text-center transition-all hover:border-blue-400 hover:bg-blue-50/20">
          {isUploading ? (
            <div className="flex flex-col items-center gap-2 py-4">
              <svg className="h-8 w-8 animate-spin text-blue-600" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <p className="text-xs font-semibold text-slate-600">Uploading to Cloudinary…</p>
            </div>
          ) : (
            <>
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-slate-700">
                Click to upload <span className="text-slate-400 font-normal">or drag & drop</span>
              </p>
              <p className="mt-1 text-xs text-slate-400">PNG, JPG, or WebP (max 5MB)</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={disabled || isUploading}
                className="absolute inset-0 cursor-pointer opacity-0 disabled:cursor-not-allowed"
              />
            </>
          )}
        </div>
      )}

      {uploadError && (
        <p className="text-xs font-medium text-red-500">{uploadError}</p>
      )}
    </div>
  );
}
