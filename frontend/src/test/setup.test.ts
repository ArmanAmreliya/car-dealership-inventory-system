/**
 * Vitest infrastructure smoke test
 *
 * Verifies that:
 *  1. Vitest globals (describe / it / expect) are available
 *  2. @testing-library/jest-dom matchers are registered
 *  3. jsdom environment is active (document exists)
 *  4. resolveVehicleImage utility works correctly under test
 *
 * This file is intentionally kept minimal — it tests the test setup,
 * not application features. Feature tests live alongside their modules.
 */
import { resolveVehicleImage } from '../utils/vehicleImage';

// ── 1. Globals & jest-dom ─────────────────────────────────────────────────

describe('Vitest globals', () => {
  it('expect and matchers are available', () => {
    expect(true).toBe(true);
  });

  it('jest-dom toBeInTheDocument matcher is registered', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    expect(el).toBeInTheDocument();
    document.body.removeChild(el);
  });
});

// ── 2. jsdom environment ──────────────────────────────────────────────────

describe('jsdom environment', () => {
  it('document is defined', () => {
    expect(typeof document).toBe('object');
  });

  it('window is defined', () => {
    expect(typeof window).toBe('object');
  });
});

// ── 3. resolveVehicleImage utility ────────────────────────────────────────

const DEFAULT =
  'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80';

describe('resolveVehicleImage()', () => {
  it('returns DEFAULT_IMAGE for null input', () => {
    expect(resolveVehicleImage(null)).toBe(DEFAULT);
  });

  it('returns DEFAULT_IMAGE for undefined input', () => {
    expect(resolveVehicleImage(undefined)).toBe(DEFAULT);
  });

  it('returns imageUrl when directly set', () => {
    const url = 'https://res.cloudinary.com/test/image/upload/v1/car.jpg';
    expect(resolveVehicleImage({ imageUrl: url })).toBe(url);
  });

  it('ignores empty-string imageUrl and falls through', () => {
    const result = resolveVehicleImage({ imageUrl: '', make: 'BMW' });
    expect(result).toContain('unsplash.com');
    expect(result).not.toBe('');
  });

  it('reads first item from vehicleImages array (object shape)', () => {
    const url = 'https://res.cloudinary.com/test/image/upload/v1/side.jpg';
    expect(
      resolveVehicleImage({ vehicleImages: [{ url }] })
    ).toBe(url);
  });

  it('reads first item from vehicleImages array (string shape)', () => {
    const url = 'https://res.cloudinary.com/test/image/upload/v1/front.jpg';
    expect(resolveVehicleImage({ vehicleImages: [url] })).toBe(url);
  });

  it('reads nested vehicle.imageUrl', () => {
    const url = 'https://res.cloudinary.com/test/image/upload/v1/nested.jpg';
    expect(resolveVehicleImage({ vehicle: { imageUrl: url } })).toBe(url);
  });

  it('returns BMW fallback for make "BMW"', () => {
    const result = resolveVehicleImage({ make: 'BMW' });
    expect(result).toContain('unsplash.com');
    expect(result).not.toBe(DEFAULT);
  });

  it('returns Tesla fallback for make "Tesla"', () => {
    const result = resolveVehicleImage({ make: 'Tesla' });
    expect(result).toContain('unsplash.com');
  });

  it('returns DEFAULT_IMAGE for an unknown make', () => {
    expect(resolveVehicleImage({ make: 'Zonda' })).toBe(DEFAULT);
  });

  it('imageUrl takes priority over vehicleImages', () => {
    const direct = 'https://res.cloudinary.com/direct.jpg';
    const inArray = 'https://res.cloudinary.com/array.jpg';
    expect(
      resolveVehicleImage({ imageUrl: direct, vehicleImages: [inArray] })
    ).toBe(direct);
  });
});
