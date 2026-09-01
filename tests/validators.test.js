import { describe, it, expect } from 'vitest';
import { isValidEmail, isValidZip, validateShipping } from '../src/utils/validators.js';

describe('validators', () => {
  it('validates email', () => {
    expect(isValidEmail('a@b.com')).toBe(true);
    expect(isValidEmail('bad')).toBe(false);
  });

  it('validates zip', () => {
    expect(isValidZip('94107')).toBe(true);
    expect(isValidZip('abc')).toBe(false);
  });

  it('shipping form requires fields', () => {
    const errors = validateShipping({});
    expect(Object.keys(errors).length).toBeGreaterThan(0);
  });
});
