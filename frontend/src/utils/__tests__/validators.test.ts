/**
 * validators.ts — unit tests
 *
 * Covers every exported validator:
 *   validateRequired, validateVin, validatePrice,
 *   validateYear, validateMileage, validateEmail,
 *   validatePassword, validateStockQuantity
 */

import {
  validateRequired,
  validateVin,
  validatePrice,
  validateYear,
  validateMileage,
  validateEmail,
  validatePassword,
  validateStockQuantity,
} from '../validators';

// ── Helper ────────────────────────────────────────────────────────────────

function expectValid(result: { valid: boolean }) {
  expect(result.valid).toBe(true);
}
function expectInvalid(result: { valid: boolean; message?: string }, msgSubstring?: string) {
  expect(result.valid).toBe(false);
  if (msgSubstring) expect(result.message).toContain(msgSubstring);
}

// ── validateRequired ───────────────────────────────────────────────────────

describe('validateRequired()', () => {
  it('valid for a non-empty string', () => expectValid(validateRequired('hello')));
  it('valid for string with spaces',  () => expectValid(validateRequired(' x ')));

  it('invalid for empty string',  () => expectInvalid(validateRequired(''),       'required'));
  it('invalid for whitespace',    () => expectInvalid(validateRequired('   '),    'required'));
  it('invalid for null',          () => expectInvalid(validateRequired(null),     'required'));
  it('invalid for undefined',     () => expectInvalid(validateRequired(undefined),'required'));

  it('includes custom fieldName in message', () => {
    const result = validateRequired('', 'VIN');
    expect(result.message).toContain('VIN');
  });
});

// ── validateVin ────────────────────────────────────────────────────────────

describe('validateVin()', () => {
  const VALID_VIN = '1HGBH41JXMN109186';

  it('valid for a correct 17-char VIN',    () => expectValid(validateVin(VALID_VIN)));
  it('valid for lowercase (normalised)',   () => expectValid(validateVin(VALID_VIN.toLowerCase())));

  it('invalid for null',                  () => expectInvalid(validateVin(null),   'required'));
  it('invalid for undefined',             () => expectInvalid(validateVin(undefined), 'required'));
  it('invalid for empty string',          () => expectInvalid(validateVin(''),     'required'));

  it('invalid for < 17 chars',            () => expectInvalid(validateVin('1HGBH41JXMN10918'), '17'));
  it('invalid for > 17 chars',            () => expectInvalid(validateVin('1HGBH41JXMN1091860'), '17'));

  it('invalid when contains "I"',         () => expectInvalid(validateVin('1HGBH41IXMN109186'), 'I, O, or Q'));
  it('invalid when contains "O"',         () => expectInvalid(validateVin('1HGBH41OXMN109186'), 'I, O, or Q'));
  it('invalid when contains "Q"',         () => expectInvalid(validateVin('1HGBH41QXMN109186'), 'I, O, or Q'));

  it('invalid for special characters',    () => expectInvalid(validateVin('1HGBH41JXM-109186'), 'letters'));

  it('reports actual length in message',  () => {
    const result = validateVin('SHORT');
    expect(result.message).toContain('5');
  });
});

// ── validatePrice ──────────────────────────────────────────────────────────

describe('validatePrice()', () => {
  it('valid for a positive price',         () => expectValid(validatePrice(55200)));
  it('valid for 1 (minimum positive)',     () => expectValid(validatePrice(1)));
  it('valid for 9_999_999',               () => expectValid(validatePrice(9_999_999)));

  it('invalid for 0',                     () => expectInvalid(validatePrice(0),         'greater than 0'));
  it('invalid for negative',              () => expectInvalid(validatePrice(-100),       'greater than 0'));
  it('invalid for NaN',                   () => expectInvalid(validatePrice(NaN),        'required'));
  it('invalid for null',                  () => expectInvalid(validatePrice(null),       'required'));
  it('invalid for undefined',             () => expectInvalid(validatePrice(undefined),  'required'));
  it('invalid for Infinity',              () => expectInvalid(validatePrice(Infinity),   'finite'));
  it('invalid for -Infinity',             () => expectInvalid(validatePrice(-Infinity),  'finite'));
  it('invalid for > 10_000_000',          () => expectInvalid(validatePrice(10_000_001), 'maximum'));
});

// ── validateYear ───────────────────────────────────────────────────────────

describe('validateYear()', () => {
  const currentYear = new Date().getFullYear();

  it('valid for current year',            () => expectValid(validateYear(currentYear)));
  it('valid for next year',               () => expectValid(validateYear(currentYear + 1)));
  it('valid for 1886 (first car)',        () => expectValid(validateYear(1886)));
  it('valid for 2000',                    () => expectValid(validateYear(2000)));

  it('invalid for null',                  () => expectInvalid(validateYear(null),      'required'));
  it('invalid for undefined',             () => expectInvalid(validateYear(undefined), 'required'));
  it('invalid for NaN',                   () => expectInvalid(validateYear(NaN),       'required'));

  it('invalid for 1885',                  () => expectInvalid(validateYear(1885),  '1886'));
  it('invalid for currentYear + 3',       () => expectInvalid(validateYear(currentYear + 3), String(currentYear + 2)));
  it('invalid for decimal year',          () => expectInvalid(validateYear(2023.5), 'whole'));
  it('invalid for 0',                     () => expectInvalid(validateYear(0),     '1886'));
  it('invalid for negative',              () => expectInvalid(validateYear(-1),    '1886'));
});

// ── validateMileage ────────────────────────────────────────────────────────

describe('validateMileage()', () => {
  it('valid for typical mileage',         () => expectValid(validateMileage(28000)));
  it('valid for 0',                       () => expectValid(validateMileage(0)));
  it('valid for null (optional)',         () => expectValid(validateMileage(null)));
  it('valid for undefined (optional)',    () => expectValid(validateMileage(undefined)));
  it('valid for 1_000_000 (boundary)',    () => expectValid(validateMileage(1_000_000)));

  it('invalid for negative',              () => expectInvalid(validateMileage(-1),        'negative'));
  it('invalid for > 1_000_000',           () => expectInvalid(validateMileage(1_000_001), 'maximum'));
  it('invalid for NaN',                   () => expectInvalid(validateMileage(NaN),       'valid number'));
  it('invalid for Infinity',              () => expectInvalid(validateMileage(Infinity),  'valid number'));
});

// ── validateEmail ──────────────────────────────────────────────────────────

describe('validateEmail()', () => {
  it('valid for typical email',           () => expectValid(validateEmail('user@example.com')));
  it('valid for subdomain email',         () => expectValid(validateEmail('user@mail.example.co.uk')));
  it('valid for + alias',                 () => expectValid(validateEmail('user+tag@example.com')));

  it('invalid for null',                  () => expectInvalid(validateEmail(null),      'required'));
  it('invalid for undefined',             () => expectInvalid(validateEmail(undefined), 'required'));
  it('invalid for empty string',          () => expectInvalid(validateEmail(''),        'required'));
  it('invalid without @',                 () => expectInvalid(validateEmail('notanemail'), 'valid email'));
  it('invalid without domain',            () => expectInvalid(validateEmail('user@'),   'valid email'));
  it('invalid without TLD',              () => expectInvalid(validateEmail('user@domain'), 'valid email'));
  it('invalid with spaces',               () => expectInvalid(validateEmail('us er@ex.com'), 'valid email'));
});

// ── validatePassword ───────────────────────────────────────────────────────

describe('validatePassword()', () => {
  it('valid for "admin123"',              () => expectValid(validatePassword('admin123')));
  it('valid for long alphanumeric',       () => expectValid(validatePassword('SecurePass1')));
  it('valid for exactly 8 chars',         () => expectValid(validatePassword('abcde123')));

  it('invalid for null',                  () => expectInvalid(validatePassword(null),      'required'));
  it('invalid for undefined',             () => expectInvalid(validatePassword(undefined), 'required'));
  it('invalid for empty string',          () => expectInvalid(validatePassword(''),        'required'));
  it('invalid for 7 chars',              () => expectInvalid(validatePassword('abc1234'), 'at least 8'));
  it('invalid for digits only',           () => expectInvalid(validatePassword('12345678'), 'letter'));
  it('invalid for letters only',          () => expectInvalid(validatePassword('abcdefgh'), 'number'));
});

// ── validateStockQuantity ──────────────────────────────────────────────────

describe('validateStockQuantity()', () => {
  it('valid for 0',                       () => expectValid(validateStockQuantity(0)));
  it('valid for 1',                       () => expectValid(validateStockQuantity(1)));
  it('valid for 9999 (boundary)',         () => expectValid(validateStockQuantity(9999)));

  it('invalid for null',                  () => expectInvalid(validateStockQuantity(null),      'required'));
  it('invalid for undefined',             () => expectInvalid(validateStockQuantity(undefined), 'required'));
  it('invalid for NaN',                   () => expectInvalid(validateStockQuantity(NaN),       'required'));
  it('invalid for negative',              () => expectInvalid(validateStockQuantity(-1),        'negative'));
  it('invalid for > 9999',               () => expectInvalid(validateStockQuantity(10000),     'maximum'));
  it('invalid for decimal',               () => expectInvalid(validateStockQuantity(1.5),       'whole'));
});
