import { describe, it, expect } from 'vitest';
import { createEvent, validateEvent, aggregateByType, revenueFromEvents } from '../src/engine/analyticsEngine.js';

describe('analyticsEngine', () => {
  it('creates and validates analytics events', () => {
    const evt = createEvent('purchase', { sessionId: 's1', value: 120 });
    expect(validateEvent(evt).ok).toBe(true);
    expect(validateEvent({}).ok).toBe(false);
  });

  it('aggregates event counts and sums purchase revenue', () => {
    const events = [
      createEvent('page_view', { sessionId: 's1' }),
      createEvent('purchase', { sessionId: 's1', value: 50 }),
      createEvent('purchase', { sessionId: 's2', value: 75 })
    ];
    expect(aggregateByType(events)).toEqual({ page_view: 1, purchase: 2 });
    expect(revenueFromEvents(events)).toBe(125);
  });
});
