import { describe, it, expect } from 'vitest';
import { assignVariant } from '../src/engine/experimentEngine.js';

describe('experimentEngine', () => {
  it('falls back to control for draft or missing experiments', () => {
    expect(assignVariant('exp-000', 'user-1')).toBe('control');
    expect(assignVariant('missing', 'user-1')).toBe('control');
  });

  it('deterministically assigns a running experiment variant', () => {
    const v1 = assignVariant('exp-001', 'user-42');
    const v2 = assignVariant('exp-001', 'user-42');
    expect(v1).toBe(v2);
    expect(['control', 'treatment_a', 'treatment_b']).toContain(v1);
  });
});
