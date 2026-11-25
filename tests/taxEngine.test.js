import { describe, it, expect } from 'vitest';
import { resolveJurisdiction } from '../src/engine/taxEngine.js';

describe('taxEngine', () => {
  it('resolves known jurisdiction and falls back to default', () => {
    expect(resolveJurisdiction('R0').rate).toBe(0.04);
    expect(resolveJurisdiction('MISSING').id).toBe('tax-0000');
  });
});
