import { describe, it, expect } from 'vitest';
import { tokenize, buildIndex, searchIndex, expandQuery } from '../src/engine/searchEngine.js';

describe('searchEngine', () => {
  it('tokenizes text and builds searchable index', () => {
    expect(tokenize('The Aura Headphones')).toEqual(['aura', 'headphones']);
    const idx = buildIndex([
      { id: '1', name: 'Aura Headphones', tagline: 'Wireless', description: 'Crisp audio', category: 'Audio' }
    ]);
    const hits = searchIndex(idx, 'headphones');
    expect(hits).toHaveLength(1);
    expect(hits[0].id).toBe('1');
  });

  it('expands query terms with synonyms', () => {
    const terms = expandQuery('headphone');
    expect(terms).toContain('headphone');
    expect(terms).toContain('headset');
  });
});
