import { describe, it, expect } from 'vitest';
import { PO_TEMPLATES, openPurchaseOrders } from '../src/domain/purchaseOrders.js';

describe('purchaseOrders', () => {
  it('excludes received purchase orders from open list', () => {
    const open = openPurchaseOrders();
    expect(open.length).toBeGreaterThan(0);
    expect(open.length).toBeLessThan(PO_TEMPLATES.length);
    expect(open.every((po) => po.status !== 'received')).toBe(true);
  });
});
