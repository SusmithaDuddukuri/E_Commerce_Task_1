import { describe, it, expect } from 'vitest';
import { quoteShipping } from '../src/engine/shippingEngine.js';

describe('shippingEngine', () => {
  it('quotes matching zone rate cards and handles missing routes', () => {
    const quote = quoteShipping('Z000', 2, 'standard');
    expect(quote.ok).toBe(true);
    expect(quote.price).toBe(5);
    expect(quoteShipping('UNKNOWN', 2, 'standard')).toEqual({ ok: false, price: null });
  });
});
