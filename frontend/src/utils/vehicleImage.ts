/**
 * Vehicle Image Utility
 *
 * Checks for stored vehicle imagery (e.g., uploaded Cloudinary images) first.
 * If no stored image URL is present, provides a high-resolution fallback image
 * based on manufacturer or deterministic vehicle identifier hash.
 */

const MAKE_IMAGE_MAP: Record<string, string> = {
  toyota: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=1000&q=80',
  honda: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1000&q=80',
  ford: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1000&q=80',
  bmw: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1000&q=80',
  mercedes: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1000&q=80',
  'mercedes-benz': 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1000&q=80',
  audi: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1000&q=80',
  tesla: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1000&q=80',
  porsche: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=80',
  chevrolet: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1000&q=80',
  chevy: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1000&q=80',
  nissan: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=1000&q=80',
  hyundai: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1000&q=80',
  kia: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=1000&q=80',
  lexus: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1000&q=80',
  mazda: 'https://images.unsplash.com/photo-1541348263662-e082662d82da?auto=format&fit=crop&w=1000&q=80',
  subaru: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1000&q=80',
};

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=1000&q=80',
];

/**
 * Get the car image URL for a vehicle or inventory item.
 * Prioritizes stored Cloudinary/HTTP image URLs.
 */
export function getVehicleImage(vehicle?: {
  imageUrl?: string;
  make?: string;
  id?: string;
  vin?: string;
  vehicle?: {
    imageUrl?: string;
    make?: string;
    id?: string;
    vin?: string;
  };
} | null): string {
  // 1. Prioritize stored image URL (e.g. fetched from Cloudinary or database)
  const storedUrl = vehicle?.imageUrl || vehicle?.vehicle?.imageUrl;
  if (storedUrl && typeof storedUrl === 'string' && storedUrl.trim() !== '') {
    return storedUrl.trim();
  }

  // 2. Fallback to make matching if no stored image exists
  const makeKey = (vehicle?.make || vehicle?.vehicle?.make || '').toLowerCase().trim();
  if (makeKey && MAKE_IMAGE_MAP[makeKey]) {
    return MAKE_IMAGE_MAP[makeKey];
  }

  // 3. Fallback to a deterministic image indexed by vehicle ID / VIN
  const seedStr = vehicle?.id || vehicle?.vin || vehicle?.vehicle?.id || vehicle?.vehicle?.vin || vehicle?.make || 'car';
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = seedStr.charCodeAt(i) + ((hash << 5) - hash);
  }
  const idx = Math.abs(hash) % FALLBACK_IMAGES.length;

  return FALLBACK_IMAGES[idx];
}
