import { describe, it, expect } from 'vitest';
import { isReturnEligible } from '../src/engine/returnsEngine.js';

describe('returnsEngine', () => {
  it('accepts recent orders and rejects expired return windows', () => {
    const now = Date.parse('2026-06-10T00:00:00.000Z');
    expect(isReturnEligible('2026-06-05T00:00:00.000Z', 'cat_0', now).eligible).toBe(true);
    expect(isReturnEligible('2025-01-01T00:00:00.000Z', 'cat_0', now).eligible).toBe(false);
  });
});
