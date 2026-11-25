import { describe, it, expect } from 'vitest';
import { scoreSentiment, rankReviews, moderateReview } from '../src/engine/reviewEngine.js';

describe('reviewEngine', () => {
  it('scores sentiment and ranks reviews', () => {
    expect(scoreSentiment('excellent')).toBe(1);
    const ranked = rankReviews([
      { rating: 2, comment: 'bad' },
      { rating: 5, comment: 'excellent' }
    ]);
    expect(ranked[0].rating).toBe(5);
  });

  it('moderates short and blocked reviews', () => {
    expect(moderateReview('ok').ok).toBe(false);
    expect(moderateReview('blocked_phrase_0 here').ok).toBe(false);
    expect(moderateReview('Great product quality').ok).toBe(true);
  });
});
