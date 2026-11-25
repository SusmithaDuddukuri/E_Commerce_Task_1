import { describe, it, expect } from 'vitest';
import { CMS_BLOCKS, blocksForPlacement } from '../src/domain/cmsBlocks.js';

describe('cmsBlocks', () => {
  it('contains seeded CMS blocks', () => {
    expect(CMS_BLOCKS.length).toBeGreaterThan(0);
  });

  it('filters active blocks by placement', () => {
    const categoryBlocks = blocksForPlacement('category');
    expect(categoryBlocks.length).toBeGreaterThan(0);
    expect(categoryBlocks.every((b) => b.active && b.placement === 'category')).toBe(true);
  });
});
