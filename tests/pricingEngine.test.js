import { describe, it, expect } from 'vitest';
import { computeCartTotals, applyPromo, resolveTaxRate } from '../src/engine/pricingEngine.js';

describe('pricingEngine', () => {
  it('computes subtotal tax and total for cart items', () => {
    const items = [
      { price: 100, quantity: 2 },
      { price: 50, quantity: 1 }
    ];
    const totals = computeCartTotals(items, { region: 'US-CA' });
    expect(totals.subtotal).toBe(250);
    expect(totals.tax).toBeGreaterThan(0);
    expect(totals.total).toBeGreaterThan(totals.subtotal);
  });

  it('applies AURA20 promo percent discount', () => {
    const result = applyPromo('AURA20', 200, 15);
    expect(result.ok).toBe(true);
    expect(result.discount).toBe(40);
  });

  it('resolves known tax rates', () => {
    expect(resolveTaxRate('US-CA')).toBeCloseTo(0.0875);
  });
});
