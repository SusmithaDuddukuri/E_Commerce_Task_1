import { describe, it, expect } from 'vitest';
import { chartForCategory } from '../src/domain/sizeCharts.js';

describe('sizeCharts', () => {
  it('returns matching charts for a category', () => {
    const charts = chartForCategory('Wearables');
    expect(charts.length).toBeGreaterThan(0);
    expect(charts.every((c) => c.category === 'Wearables')).toBe(true);
  });
});
