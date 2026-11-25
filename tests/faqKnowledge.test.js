import { describe, it, expect } from 'vitest';
import { searchFaq } from '../src/domain/faqKnowledge.js';

describe('faqKnowledge', () => {
  it('returns default slice for empty queries', () => {
    expect(searchFaq('')).toHaveLength(10);
  });

  it('matches FAQ questions by keyword', () => {
    const results = searchFaq('Aura');
    expect(results.length).toBeGreaterThan(0);
    expect(results.length).toBeLessThanOrEqual(20);
  });
});
