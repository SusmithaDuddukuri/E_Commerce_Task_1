import { describe, it, expect } from 'vitest';
import { bundlePrice } from '../src/engine/bundleEngine.js';

describe('bundleEngine', () => {
  it('computes discounted bundle price from lookup', () => {
    const price = bundlePrice(
      { productIds: ['p1', 'p2'], discountPercent: 10 },
      { p1: 100, p2: 100 }
    );
    expect(price).toBe(180);
  });
});
