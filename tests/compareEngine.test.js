import { describe, it, expect } from 'vitest';
import { compareProducts } from '../src/engine/compareEngine.js';

describe('compareEngine', () => {
  it('returns comparison attributes and matching product rows', () => {
    const result = compareProducts(['aura-gen-00000', 'aura-gen-00001']);
    expect(result.attributes).toHaveLength(10);
    expect(result.rows).toHaveLength(2);
  });
});
