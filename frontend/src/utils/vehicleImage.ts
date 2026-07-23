/**
 * Vehicle Image Resolver
 *
 * Resolution order:
 *   1. vehicle.imageUrl (direct Cloudinary URL set on the record)
 *   2. vehicle.vehicleImages[0].url (array relation if backend returns it)
 *   3. vehicle.vehicle.imageUrl (nested vehicle object on inventory items)
 *   4. Make-based Unsplash fallback
 *   5. Generic car fallback
 */

const MAKE_FALLBACKS: Record<string, string> = {
  tesla:
    'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800&q=80',
  bmw: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80',
  ford: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
  honda:
    'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80',
  toyota:
    'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=800&q=80',
  mercedes:
    'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80',
  audi: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=800&q=80',
  porsche:
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
  chevrolet:
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
  chevy:
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
  rolls:
    'https://images.unsplash.com/photo-1631295868223-63265b40d9e4?auto=format&fit=crop&w=800&q=80',
  bentley:
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
  lamborghini:
    'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=800&q=80',
  ferrari:
    'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80',
  range:
    'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=800&q=80',
  jeep: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
  hyundai:
    'https://images.unsplash.com/photo-1612825173281-9a193378527e?auto=format&fit=crop&w=800&q=80',
  kia: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&w=800&q=80',
  volvo:
    'https://images.unsplash.com/photo-1611859266238-4b98091d9d9b?auto=format&fit=crop&w=800&q=80',
  nissan:
    'https://images.unsplash.com/photo-1580274455191-1c62238fa333?auto=format&fit=crop&w=800&q=80',
};

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80';

type MaybeVehicle = {
  imageUrl?: string | null;
  make?: string;
  vehicleImages?: Array<{ url?: string; imageUrl?: string } | string> | null;
  vehicle?: {
    imageUrl?: string | null;
    make?: string;
    vehicleImages?: Array<{ url?: string; imageUrl?: string } | string> | null;
  } | null;
} | null | undefined;

function extractFromImages(
  images?: Array<{ url?: string; imageUrl?: string } | string> | null
): string | null {
  if (!Array.isArray(images) || images.length === 0) return null;
  for (const img of images) {
    if (typeof img === 'string' && img.trim()) return img.trim();
    if (typeof img === 'object') {
      const url = img.url || img.imageUrl;
      if (typeof url === 'string' && url.trim()) return url.trim();
    }
  }
  return null;
}

function isValidUrl(s: string | null | undefined): s is string {
  return typeof s === 'string' && s.trim().length > 0;
}

export function resolveVehicleImage(v?: MaybeVehicle): string {
  if (!v) return DEFAULT_IMAGE;

  // 1. Direct imageUrl on the object
  if (isValidUrl(v.imageUrl)) return v.imageUrl!.trim();

  // 2. vehicleImages array on the object
  const fromImages = extractFromImages(v.vehicleImages);
  if (fromImages) return fromImages;

  // 3. Nested vehicle.imageUrl (inventory item shape)
  if (isValidUrl(v.vehicle?.imageUrl)) return v.vehicle!.imageUrl!.trim();

  // 4. vehicleImages on nested vehicle
  const fromNestedImages = extractFromImages(v.vehicle?.vehicleImages);
  if (fromNestedImages) return fromNestedImages;

  // 5. Make-based fallback
  const make = (v.make || v.vehicle?.make || '').toLowerCase().trim();
  for (const [key, url] of Object.entries(MAKE_FALLBACKS)) {
    if (make.includes(key)) return url;
  }

  return DEFAULT_IMAGE;
}
