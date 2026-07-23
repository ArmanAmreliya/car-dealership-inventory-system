/**
 * resolveVehicleImage() — unit tests
 *
 * Covers every resolution branch:
 *   1. direct imageUrl
 *   2. vehicleImages array (object & string shapes)
 *   3. nested vehicle.imageUrl
 *   4. nested vehicle.vehicleImages
 *   5. make-based Unsplash fallback
 *   6. generic DEFAULT_IMAGE fallback
 *   7. null / undefined / empty / whitespace / invalid inputs
 *   8. priority ordering between branches
 */
import { resolveVehicleImage } from '../vehicleImage';

// ── Shared fixtures ────────────────────────────────────────────────────────

const CLOUDINARY = 'https://res.cloudinary.com/demo/image/upload/v1/car.jpg';
const CLOUDINARY_2 = 'https://res.cloudinary.com/demo/image/upload/v1/side.jpg';
const DEFAULT =
  'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80';

const MAKE_URLS: Record<string, string> = {
  bmw: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80',
  tesla: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800&q=80',
  ford: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
  mercedes: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80',
  toyota: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=800&q=80',
  porsche: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
};

// ── 1. Null / undefined inputs ────────────────────────────────────────────

describe('resolveVehicleImage — null/undefined inputs', () => {
  it('returns DEFAULT for null', () => {
    expect(resolveVehicleImage(null)).toBe(DEFAULT);
  });

  it('returns DEFAULT for undefined', () => {
    expect(resolveVehicleImage(undefined)).toBe(DEFAULT);
  });

  it('returns DEFAULT for empty object {}', () => {
    expect(resolveVehicleImage({})).toBe(DEFAULT);
  });
});

// ── 2. Direct imageUrl ────────────────────────────────────────────────────

describe('resolveVehicleImage — direct imageUrl', () => {
  it('returns imageUrl when set', () => {
    expect(resolveVehicleImage({ imageUrl: CLOUDINARY })).toBe(CLOUDINARY);
  });

  it('trims whitespace from imageUrl', () => {
    expect(resolveVehicleImage({ imageUrl: `  ${CLOUDINARY}  ` })).toBe(CLOUDINARY);
  });

  it('skips empty-string imageUrl and falls through', () => {
    expect(resolveVehicleImage({ imageUrl: '', make: 'BMW' })).toBe(MAKE_URLS.bmw);
  });

  it('skips whitespace-only imageUrl and falls through', () => {
    expect(resolveVehicleImage({ imageUrl: '   ', make: 'BMW' })).toBe(MAKE_URLS.bmw);
  });

  it('skips null imageUrl and falls through', () => {
    expect(resolveVehicleImage({ imageUrl: null, make: 'Tesla' })).toBe(MAKE_URLS.tesla);
  });
});

// ── 3. vehicleImages array ────────────────────────────────────────────────

describe('resolveVehicleImage — vehicleImages array', () => {
  it('reads url from first object entry', () => {
    expect(resolveVehicleImage({ vehicleImages: [{ url: CLOUDINARY }] })).toBe(CLOUDINARY);
  });

  it('reads imageUrl from first object entry when url is absent', () => {
    expect(resolveVehicleImage({ vehicleImages: [{ imageUrl: CLOUDINARY }] })).toBe(CLOUDINARY);
  });

  it('reads a plain string entry', () => {
    expect(resolveVehicleImage({ vehicleImages: [CLOUDINARY] })).toBe(CLOUDINARY);
  });

  it('skips empty-string entries and reads next valid entry', () => {
    expect(
      resolveVehicleImage({ vehicleImages: ['', CLOUDINARY_2] })
    ).toBe(CLOUDINARY_2);
  });

  it('falls through when vehicleImages is an empty array', () => {
    expect(resolveVehicleImage({ vehicleImages: [], make: 'BMW' })).toBe(MAKE_URLS.bmw);
  });

  it('falls through when vehicleImages is null', () => {
    expect(resolveVehicleImage({ vehicleImages: null, make: 'BMW' })).toBe(MAKE_URLS.bmw);
  });

  it('falls through when all entries have empty url', () => {
    expect(
      resolveVehicleImage({ vehicleImages: [{ url: '' }, { imageUrl: '' }], make: 'BMW' })
    ).toBe(MAKE_URLS.bmw);
  });
});

// ── 4. Nested vehicle.imageUrl ────────────────────────────────────────────

describe('resolveVehicleImage — nested vehicle.imageUrl', () => {
  it('reads nested vehicle.imageUrl', () => {
    expect(
      resolveVehicleImage({ vehicle: { imageUrl: CLOUDINARY } })
    ).toBe(CLOUDINARY);
  });

  it('trims nested vehicle.imageUrl', () => {
    expect(
      resolveVehicleImage({ vehicle: { imageUrl: `  ${CLOUDINARY}  ` } })
    ).toBe(CLOUDINARY);
  });

  it('skips empty nested vehicle.imageUrl', () => {
    expect(
      resolveVehicleImage({ vehicle: { imageUrl: '', make: 'BMW' } })
    ).toBe(MAKE_URLS.bmw);
  });

  it('skips null nested vehicle.imageUrl', () => {
    expect(
      resolveVehicleImage({ vehicle: { imageUrl: null, make: 'Tesla' } })
    ).toBe(MAKE_URLS.tesla);
  });
});

// ── 5. Nested vehicle.vehicleImages ───────────────────────────────────────

describe('resolveVehicleImage — nested vehicle.vehicleImages', () => {
  it('reads nested vehicle.vehicleImages[0].url', () => {
    expect(
      resolveVehicleImage({ vehicle: { vehicleImages: [{ url: CLOUDINARY }] } })
    ).toBe(CLOUDINARY);
  });

  it('reads nested vehicle.vehicleImages plain string', () => {
    expect(
      resolveVehicleImage({ vehicle: { vehicleImages: [CLOUDINARY] } })
    ).toBe(CLOUDINARY);
  });

  it('falls through for empty nested vehicleImages', () => {
    expect(
      resolveVehicleImage({ vehicle: { vehicleImages: [], make: 'BMW' } })
    ).toBe(MAKE_URLS.bmw);
  });
});

// ── 6. Make-based fallbacks ───────────────────────────────────────────────

describe('resolveVehicleImage — make-based fallbacks', () => {
  const cases: Array<[string, string]> = [
    ['BMW', MAKE_URLS.bmw],
    ['bmw', MAKE_URLS.bmw],         // case-insensitive
    ['Tesla', MAKE_URLS.tesla],
    ['TESLA', MAKE_URLS.tesla],
    ['Ford', MAKE_URLS.ford],
    ['Mercedes', MAKE_URLS.mercedes],
    ['Mercedes-Benz', MAKE_URLS.mercedes],  // substring match
    ['Toyota', MAKE_URLS.toyota],
    ['Porsche', MAKE_URLS.porsche],
  ];

  it.each(cases)('make "%s" → correct Unsplash URL', (make, expected) => {
    expect(resolveVehicleImage({ make })).toBe(expected);
  });

  it('reads make from nested vehicle object', () => {
    expect(resolveVehicleImage({ vehicle: { make: 'BMW' } })).toBe(MAKE_URLS.bmw);
  });

  it('returns DEFAULT for unknown make', () => {
    expect(resolveVehicleImage({ make: 'UnknownBrand' })).toBe(DEFAULT);
  });

  it('returns DEFAULT for empty make string', () => {
    expect(resolveVehicleImage({ make: '' })).toBe(DEFAULT);
  });
});

// ── 7. Priority ordering ──────────────────────────────────────────────────

describe('resolveVehicleImage — priority ordering', () => {
  it('direct imageUrl beats vehicleImages array', () => {
    expect(
      resolveVehicleImage({
        imageUrl: CLOUDINARY,
        vehicleImages: [CLOUDINARY_2],
      })
    ).toBe(CLOUDINARY);
  });

  it('direct imageUrl beats nested vehicle.imageUrl', () => {
    expect(
      resolveVehicleImage({
        imageUrl: CLOUDINARY,
        vehicle: { imageUrl: CLOUDINARY_2 },
      })
    ).toBe(CLOUDINARY);
  });

  it('vehicleImages array beats nested vehicle.imageUrl', () => {
    expect(
      resolveVehicleImage({
        vehicleImages: [CLOUDINARY],
        vehicle: { imageUrl: CLOUDINARY_2 },
      })
    ).toBe(CLOUDINARY);
  });

  it('nested vehicle.imageUrl beats make fallback', () => {
    expect(
      resolveVehicleImage({
        vehicle: { imageUrl: CLOUDINARY, make: 'BMW' },
      })
    ).toBe(CLOUDINARY);
  });

  it('make fallback beats DEFAULT when make is known', () => {
    const result = resolveVehicleImage({ make: 'BMW' });
    expect(result).not.toBe(DEFAULT);
    expect(result).toContain('unsplash.com');
  });

  it('DEFAULT returned when every source is missing', () => {
    expect(resolveVehicleImage({ vehicle: {} })).toBe(DEFAULT);
  });
});

// ── 8. Edge cases ─────────────────────────────────────────────────────────

describe('resolveVehicleImage — edge cases', () => {
  it('handles vehicle with all empty fields gracefully', () => {
    expect(
      resolveVehicleImage({ imageUrl: null, vehicleImages: null, make: '' })
    ).toBe(DEFAULT);
  });

  it('vehicleImages with mixed valid/empty entries returns first valid', () => {
    expect(
      resolveVehicleImage({
        vehicleImages: [{ url: '' }, '', { url: CLOUDINARY }],
      })
    ).toBe(CLOUDINARY);
  });

  it('returns a non-empty string in all branches', () => {
    const inputs = [
      null,
      undefined,
      {},
      { imageUrl: CLOUDINARY },
      { vehicleImages: [CLOUDINARY] },
      { vehicle: { imageUrl: CLOUDINARY } },
      { make: 'BMW' },
      { make: 'Unknown' },
    ];
    for (const input of inputs) {
      const result = resolveVehicleImage(input as any);
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    }
  });
});
