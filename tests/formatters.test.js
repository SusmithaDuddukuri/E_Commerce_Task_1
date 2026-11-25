import { describe, it, expect } from 'vitest';
import { formatPrice, formatPercent, calcDiscount, clamp, slugify } from '../src/utils/formatters.js';

describe('formatters', () => {
  it('formats currency prices cleanly', () => {
    expect(formatPrice(100)).toBe('$100.00');
    expect(formatPrice(null)).toBe('$0.00');
  });

  it('formats percentages and calculates discounts', () => {
    expect(formatPercent(25)).toBe('25%');
    expect(calcDiscount(80, 100)).toBe(20);
    expect(calcDiscount(120, 100)).toBe(0);
  });

  it('clamps numbers and slugifies text', () => {
    expect(clamp(15, 0, 10)).toBe(10);
    expect(slugify('Aura Horizon Headphones')).toBe('aura-horizon-headphones');
  });
});
