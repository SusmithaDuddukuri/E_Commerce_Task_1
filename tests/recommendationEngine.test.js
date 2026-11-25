import { describe, it, expect } from 'vitest';
import { cosineSimilarity, recommendSimilar, recommendForCart, classifyUser } from '../src/engine/recommendationEngine.js';

describe('recommendationEngine', () => {
  it('computes cosine similarity accurately', () => {
    expect(cosineSimilarity([1, 0], [1, 0])).toBeCloseTo(1);
    expect(cosineSimilarity([1, 0], [0, 1])).toBeCloseTo(0);
  });

  it('recommends similar products and cart cross sells', () => {
    expect(recommendSimilar('aura-gen-00000', 4)).toHaveLength(4);
    const cartRecs = recommendForCart(['aura-gen-00000'], 3);
    expect(cartRecs).toHaveLength(3);
    expect(classifyUser(0, 0).id).toBe('seg-000');
  });
});
