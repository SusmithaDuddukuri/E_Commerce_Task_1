import { describe, it, expect } from 'vitest';
import { canTransition, transitionOrder } from '../src/engine/orderLifecycle.js';

describe('orderLifecycle', () => {
  it('allows PAID from PENDING_PAYMENT', () => {
    expect(canTransition('PENDING_PAYMENT', 'PAID')).toBe(true);
  });

  it('rejects invalid transitions', () => {
    expect(canTransition('DRAFT', 'SHIPPED')).toBe(false);
  });

  it('transitions order and records history', () => {
    const order = { id: '1', status: 'DRAFT', statusHistory: [] };
    const result = transitionOrder(order, 'PENDING_PAYMENT');
    expect(result.ok).toBe(true);
    expect(result.order.status).toBe('PENDING_PAYMENT');
    expect(result.order.statusHistory).toHaveLength(1);
  });
});
