import { describe, it, expect } from 'vitest';
import { nextBillingDate } from '../src/engine/subscriptionEngine.js';

describe('subscriptionEngine', () => {
  it('advances billing date by interval days', () => {
    const next = nextBillingDate('2026-01-01T00:00:00.000Z', 30);
    expect(next.startsWith('2026-01-31')).toBe(true);
  });
});
