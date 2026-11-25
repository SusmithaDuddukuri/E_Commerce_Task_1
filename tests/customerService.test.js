import { describe, it, expect } from 'vitest';
import { findCustomer, customersByTier, topCustomersByLtv } from '../src/domain/customerService.js';

describe('customerService', () => {
  it('finds customer by id and returns null for unknown', () => {
    expect(findCustomer('cust-00000')?.id).toBe('cust-00000');
    expect(findCustomer('missing')).toBeNull();
  });

  it('filters by tier and sorts top customers by lifetime value', () => {
    const gold = customersByTier('gold');
    expect(gold.every((c) => c.tier === 'gold')).toBe(true);
    const top = topCustomersByLtv(5);
    expect(top).toHaveLength(5);
    expect(top[0].lifetimeValue).toBeGreaterThanOrEqual(top[4].lifetimeValue);
  });
});
