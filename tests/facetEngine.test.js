import { describe, it, expect } from 'vitest';
import { filterByFacets } from '../src/engine/facetEngine.js';

describe('facetEngine', () => {
  it('filters rows matching selected facet values', () => {
    const rows = filterByFacets({ color: ['Black'] });
    expect(rows.length).toBeGreaterThan(0);
    expect(rows.every((r) => r.color === 'Black')).toBe(true);
  });
});
