/**
 * Validation Utilities
 *
 * Pure functions that validate individual field values.
 * Each returns `{ valid: true }` or `{ valid: false, message: string }`.
 * Zero side-effects — safe for unit testing without React.
 */

export interface ValidationResult {
  valid: boolean;
  message?: string;
}

const OK: ValidationResult = { valid: true };
const fail = (message: string): ValidationResult => ({ valid: false, message });

// ── Required ──────────────────────────────────────────────────────────────

/**
 * Fail when the value is null, undefined, or an empty / whitespace-only string.
 *
 * @example
 * validateRequired('hello')  // → { valid: true }
 * validateRequired('')       // → { valid: false, message: '...' }
 */
export function validateRequired(
  value: string | null | undefined,
  fieldName = 'This field'
): ValidationResult {
  if (value === null || value === undefined) {
    return fail(`${fieldName} is required`);
  }
  if (typeof value === 'string' && value.trim().length === 0) {
    return fail(`${fieldName} is required`);
  }
  return OK;
}

// ── VIN ───────────────────────────────────────────────────────────────────

/**
 * Validate a Vehicle Identification Number (VIN).
 *
 * Rules:
 *  - Required
 *  - Exactly 17 alphanumeric characters
 *  - Must not contain I, O, or Q (ISO 3779)
 *
 * @example
 * validateVin('1HGBH41JXMN109186')  // → { valid: true }
 * validateVin('1HGBH41JXMN10918')   // → { valid: false, message: '...' }
 */
export function validateVin(vin: string | null | undefined): ValidationResult {
  const req = validateRequired(vin, 'VIN');
  if (!req.valid) return req;

  const v = (vin as string).trim().toUpperCase();

  if (v.length !== 17) {
    return fail(`VIN must be exactly 17 characters (got ${v.length})`);
  }

  if (/[IOQ]/.test(v)) {
    return fail('VIN must not contain the letters I, O, or Q');
  }

  if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(v)) {
    return fail('VIN may only contain letters (except I, O, Q) and digits');
  }

  return OK;
}

// ── Price ─────────────────────────────────────────────────────────────────

/**
 * Validate a vehicle price.
 *
 * Rules:
 *  - Must be a finite number
 *  - Must be greater than 0
 *  - Must not exceed 10,000,000
 *
 * @example
 * validatePrice(55200)      // → { valid: true }
 * validatePrice(0)          // → { valid: false }
 * validatePrice(-100)       // → { valid: false }
 * validatePrice(NaN)        // → { valid: false }
 */
export function validatePrice(
  price: number | null | undefined
): ValidationResult {
  if (price === null || price === undefined || isNaN(price as number)) {
    return fail('Price is required');
  }
  const p = price as number;
  if (!isFinite(p)) return fail('Price must be a finite number');
  if (p <= 0) return fail('Price must be greater than 0');
  if (p > 10_000_000) return fail('Price exceeds the maximum allowed value');
  return OK;
}

// ── Year ──────────────────────────────────────────────────────────────────

const FIRST_CAR_YEAR = 1886; // Benz Patent-Motorwagen

/**
 * Validate a vehicle model year.
 *
 * Rules:
 *  - Integer
 *  - Between 1886 and currentYear + 2 (next model year)
 *
 * @example
 * validateYear(2024)  // → { valid: true }
 * validateYear(1885)  // → { valid: false }
 * validateYear(2099)  // → { valid: false }
 */
export function validateYear(
  year: number | null | undefined
): ValidationResult {
  if (year === null || year === undefined || isNaN(year as number)) {
    return fail('Year is required');
  }
  const y = year as number;
  if (!Number.isInteger(y)) return fail('Year must be a whole number');
  if (y < FIRST_CAR_YEAR) {
    return fail(`Year must be ${FIRST_CAR_YEAR} or later`);
  }
  const maxYear = new Date().getFullYear() + 2;
  if (y > maxYear) {
    return fail(`Year must be ${maxYear} or earlier`);
  }
  return OK;
}

// ── Mileage ───────────────────────────────────────────────────────────────

/**
 * Validate vehicle mileage (optional field — undefined/null are valid).
 *
 * Rules when provided:
 *  - Non-negative integer
 *  - Must not exceed 1,000,000
 *
 * @example
 * validateMileage(undefined)  // → { valid: true }
 * validateMileage(28000)      // → { valid: true }
 * validateMileage(-1)         // → { valid: false }
 */
export function validateMileage(
  mileage: number | null | undefined
): ValidationResult {
  if (mileage === null || mileage === undefined) return OK; // optional
  if (isNaN(mileage) || !isFinite(mileage)) {
    return fail('Mileage must be a valid number');
  }
  if (mileage < 0) return fail('Mileage cannot be negative');
  if (mileage > 1_000_000) return fail('Mileage exceeds the maximum allowed value');
  return OK;
}

// ── Email ─────────────────────────────────────────────────────────────────

/**
 * Validate an email address (basic RFC 5322 shape).
 *
 * @example
 * validateEmail('user@example.com')  // → { valid: true }
 * validateEmail('not-an-email')      // → { valid: false }
 */
export function validateEmail(
  email: string | null | undefined
): ValidationResult {
  const req = validateRequired(email, 'Email');
  if (!req.valid) return req;

  const e = (email as string).trim();
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!EMAIL_RE.test(e)) return fail('Please enter a valid email address');
  return OK;
}

// ── Password ──────────────────────────────────────────────────────────────

/**
 * Validate a password meets minimum security requirements.
 *
 * Rules:
 *  - Minimum 8 characters
 *  - At least one letter
 *  - At least one digit
 *
 * @example
 * validatePassword('admin123')  // → { valid: true }
 * validatePassword('short')     // → { valid: false }
 */
export function validatePassword(
  password: string | null | undefined
): ValidationResult {
  const req = validateRequired(password, 'Password');
  if (!req.valid) return req;

  const p = password as string;
  if (p.length < 8) return fail('Password must be at least 8 characters');
  if (!/[a-zA-Z]/.test(p)) return fail('Password must contain at least one letter');
  if (!/\d/.test(p)) return fail('Password must contain at least one number');
  return OK;
}

// ── Stock quantity ────────────────────────────────────────────────────────

/**
 * Validate an inventory stock quantity.
 *
 * Rules:
 *  - Non-negative integer
 *  - Must not exceed 9,999
 *
 * @example
 * validateStockQuantity(5)   // → { valid: true }
 * validateStockQuantity(-1)  // → { valid: false }
 */
export function validateStockQuantity(
  qty: number | null | undefined
): ValidationResult {
  if (qty === null || qty === undefined || isNaN(qty as number)) {
    return fail('Stock quantity is required');
  }
  const q = qty as number;
  if (!Number.isInteger(q)) return fail('Stock quantity must be a whole number');
  if (q < 0) return fail('Stock quantity cannot be negative');
  if (q > 9_999) return fail('Stock quantity exceeds the maximum allowed value');
  return OK;
}
