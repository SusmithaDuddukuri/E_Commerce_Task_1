import { describe, it, expect } from 'vitest';
import { suppliersByCountry } from '../src/domain/suppliers.js';

describe('suppliers', () => {
  it('returns active suppliers for a matching country', () => {
    const list = suppliersByCountry('JP');
    expect(list.length).toBeGreaterThan(0);
    expect(list.every((s) => s.country === 'JP' && s.active)).toBe(true);
  });
});
