import { describe, it, expect } from 'vitest';
import { validateAddress } from '../src/domain/addressValidation.js';

describe('addressValidation', () => {
  it('accepts a valid address for rule C000', () => {
    const res = validateAddress({ line1: '123 Market St', state: 'CA', zip: '94107' }, 'C000');
    expect(res.ok).toBe(true);
    expect(res.errors).toEqual({});
  });

  it('flags missing required fields', () => {
    const res = validateAddress({}, 'C000');
    expect(res.ok).toBe(false);
    expect(res.errors.line1).toBe('required');
    expect(res.errors.state).toBe('required');
  });
});
