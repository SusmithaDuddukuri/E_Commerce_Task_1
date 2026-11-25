import { describe, it, expect } from 'vitest';
import { slugForProduct, buildMeta } from '../src/engine/seoEngine.js';

describe('seoEngine', () => {
  it('resolves product slugs and builds SEO metadata', () => {
    expect(slugForProduct('aura-gen-00000')).toBe('aura-product-00000');
    expect(slugForProduct('missing')).toBeNull();
    const meta = buildMeta({ name: 'Halo', tagline: 'Studio sound', category: 'Audio' });
    expect(meta.title).toContain('Halo');
    expect(meta.description).toContain('Studio sound');
  });
});
