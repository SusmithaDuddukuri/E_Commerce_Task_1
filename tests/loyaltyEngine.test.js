import { describe, it, expect } from 'vitest';
import { balanceForCustomer, tierForPoints } from '../src/engine/loyaltyEngine.js';

describe('loyaltyEngine', () => {
  it('resolves loyalty tier from point thresholds', () => {
    expect(tierForPoints(0).id).toBe('bronze');
    expect(tierForPoints(2500).id).toBe('gold');
    expect(tierForPoints(5000).id).toBe('diamond');
  });

  it('computes balance for a customer', () => {
    expect(typeof balanceForCustomer('cust-00000')).toBe('number');
  });
});
