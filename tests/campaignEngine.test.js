import { describe, it, expect } from 'vitest';
import { activeCampaigns, campaignsForSegment } from '../src/engine/campaignEngine.js';

describe('campaignEngine', () => {
  it('returns active campaigns within date window', () => {
    const active = activeCampaigns('2026-08-29');
    expect(active.length).toBeGreaterThan(0);
    expect(active.every((c) => c.active && c.start <= '2026-08-29' && c.end >= '2026-08-29')).toBe(true);
  });

  it('filters campaigns by segment id', () => {
    const seg = campaignsForSegment('missing-segment');
    expect(seg).toEqual([]);
  });
});
