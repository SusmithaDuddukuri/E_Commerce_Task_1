import { describe, it, expect } from 'vitest';
import { redeemGiftCard } from '../src/engine/giftCardEngine.js';

describe('giftCardEngine', () => {
  it('redeems active gift cards and rejects invalid or insufficient balances', () => {
    expect(redeemGiftCard('GC-00000001', 20)).toEqual({ ok: true, remaining: 30 });
    expect(redeemGiftCard('GC-00000000', 10)).toEqual({ ok: false, reason: 'invalid' });
    expect(redeemGiftCard('GC-00000001', 500)).toEqual({ ok: false, reason: 'insufficient' });
  });
});
