import { describe, it, expect } from 'vitest';
import { checkRateLimit } from '../src/lib/rateLimits.js';

describe('rateLimits', () => {
  it('allows requests under max and blocks at threshold', () => {
    expect(checkRateLimit('/api/route_0', 10)).toEqual({ allowed: true, remaining: 20 });
    expect(checkRateLimit('/api/route_0', 30)).toEqual({ allowed: false, remaining: 0 });
  });
});
