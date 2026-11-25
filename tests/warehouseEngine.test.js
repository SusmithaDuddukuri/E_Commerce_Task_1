import { describe, it, expect } from 'vitest';
import { binsForSku, pickPath } from '../src/engine/warehouseEngine.js';

describe('warehouseEngine', () => {
  it('finds warehouse bins and produces sorted pick paths', () => {
    expect(binsForSku('SKU-00000').length).toBeGreaterThan(0);
    const path = pickPath(['SKU-00001', 'SKU-00000']);
    expect(path).toHaveLength(2);
    expect(path[0].aisle).toBeLessThanOrEqual(path[1].aisle);
  });
});
