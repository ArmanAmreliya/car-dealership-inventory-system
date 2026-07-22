/**
 * Vehicle Image Resolver
 *
 * Prioritizes stored Cloudinary/backend vehicle image URLs.
 * If no image URL is present in the database, returns a high-res fallback
 * automotive showcase image matching the vehicle make so cards always look premium.
 */

const MAKE_FALLBACKS: Record<string, string> = {
  tesla: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800&q=80',
  bmw: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80',
  ford: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
  honda: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80',
  toyota: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=800&q=80',
  mercedes: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80',
  audi: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=800&q=80',
  porsche: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
  chevrolet: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
  chevy: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
};

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80';

export function resolveVehicleImage(v?: {
  imageUrl?: string;
  make?: string;
  vehicle?: { imageUrl?: string; make?: string };
} | null): string {
  const direct = v?.imageUrl || v?.vehicle?.imageUrl;
  if (direct && typeof direct === 'string' && direct.trim().length > 0) {
    return direct.trim();
  }

  const make = (v?.make || v?.vehicle?.make || '').toLowerCase().trim();
  for (const [key, url] of Object.entries(MAKE_FALLBACKS)) {
    if (make.includes(key)) return url;
  }

  return DEFAULT_IMAGE;
}
