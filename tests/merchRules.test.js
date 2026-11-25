import { describe, it, expect } from 'vitest';
import { applyBoosts } from '../src/engine/merchRules.js';

describe('merchRules', () => {
  it('scores and ranks boosted product ids', () => {
    const ranked = applyBoosts(['aura-gen-00000', 'unboosted']);
    expect(ranked[0][0]).toBe('aura-gen-00000');
    expect(ranked[0][1]).toBeGreaterThanOrEqual(ranked[1][1]);
  });
});
