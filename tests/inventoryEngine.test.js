import { describe, it, expect } from 'vitest';
import { InventoryLedger, createLedgerFromSeed, needsReorder } from '../src/engine/inventoryEngine.js';

describe('inventoryEngine', () => {
  it('reserves releases and commits stock correctly', () => {
    const ledger = new InventoryLedger({ 'SKU-1': 10 });
    expect(ledger.reserve('ord-1', 'SKU-1', 4)).toEqual({ ok: true, available: 6 });
    expect(ledger.getAvailable('SKU-1')).toBe(6);
    expect(ledger.commit('ord-1', 'SKU-1')).toBe(true);
    expect(ledger.getAvailable('SKU-1')).toBe(6);
    expect(ledger.reserve('ord-2', 'SKU-1', 99).ok).toBe(false);
  });

  it('creates seed ledger and checks reorder threshold', () => {
    const ledger = createLedgerFromSeed([{ sku: 'A', onHand: 2 }]);
    expect(ledger.getAvailable('A')).toBe(2);
    expect(needsReorder({ onHand: 5, reorderPoint: 10 })).toBe(true);
  });
});
