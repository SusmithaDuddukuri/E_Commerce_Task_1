import { describe, it, expect } from 'vitest';
import { weightedAverageCost, fifoCost } from '../src/engine/valuationEngine.js';

describe('valuationEngine', () => {
  it('computes weighted average and fifo inventory costs', () => {
    expect(weightedAverageCost('SKU-00000')).toBeGreaterThan(0);
    expect(weightedAverageCost('UNKNOWN')).toBe(0);
    expect(fifoCost('SKU-00000', 1)).toBe(10);
  });
});
