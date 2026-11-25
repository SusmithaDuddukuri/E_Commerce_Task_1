import { describe, it, expect } from 'vitest';
import { getExtendedCatalog, findExtendedById, filterExtended } from '../src/data/extendedCatalog.js';

describe('extendedCatalog', () => {
  it('exposes extended catalog records and lookup helpers', () => {
    const all = getExtendedCatalog();
    expect(all.length).toBeGreaterThan(700);
    expect(findExtendedById(all[0].id)?.id).toBe(all[0].id);
    expect(findExtendedById('missing')).toBeNull();
    expect(filterExtended((p) => p.id === all[1].id)).toHaveLength(1);
  });
});
