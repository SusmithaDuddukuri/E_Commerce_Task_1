import { describe, it, expect } from 'vitest';
import { convert } from '../src/engine/currencyEngine.js';

describe('currencyEngine', () => {
  it('converts matching currencies and returns null for unknown pairs', () => {
    expect(convert(100, 'USD', 'USD')).toBe(100);
    expect(convert(100, 'USD', 'EUR')).toBe(63);
    expect(convert(100, 'USD', 'ZZZ')).toBeNull();
  });
});
