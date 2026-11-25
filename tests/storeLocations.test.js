import { describe, it, expect } from 'vitest';
import { nearestStores } from '../src/domain/storeLocations.js';

describe('storeLocations', () => {
  it('returns requested number of nearest stores sorted by distance', () => {
    const stores = nearestStores(30, -120, 3);
    expect(stores).toHaveLength(3);
    expect(stores[0].dist).toBeLessThanOrEqual(stores[1].dist);
    expect(stores[1].dist).toBeLessThanOrEqual(stores[2].dist);
  });
});
