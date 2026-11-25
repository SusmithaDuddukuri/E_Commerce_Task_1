import { describe, it, expect } from 'vitest';
import { detectCardBrand, scoreFraud } from '../src/engine/paymentEngine.js';

describe('paymentEngine', () => {
  it('detects common card brands', () => {
    expect(detectCardBrand('4111 1111')).toBe('visa');
    expect(detectCardBrand('5100 0000')).toBe('mastercard');
    expect(detectCardBrand('3400 0000')).toBe('amex');
    expect(detectCardBrand('9999')).toBe('unknown');
  });

  it('computes fraud score and risk tier', () => {
    const low = scoreFraud({ amount: 0 });
    expect(['low', 'medium', 'high']).toContain(low.risk);
  });
});
