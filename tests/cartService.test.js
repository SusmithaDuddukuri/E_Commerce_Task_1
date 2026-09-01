import { describe, it, expect } from 'vitest';
import { createEmptyCart, addLineItem, updateLineQty, removeLineItem, validateCart } from '../src/domain/cartService.js';

describe('cartService', () => {
  const product = {
    id: 'p1',
    name: 'Test',
    price: 99,
    inStock: true,
    stockCount: 10,
    colors: ['Black'],
    image: ''
  };

  it('adds a line item', () => {
    let cart = createEmptyCart();
    cart = addLineItem(cart, product, 1);
    expect(cart.items).toHaveLength(1);
    expect(cart.items[0].quantity).toBe(1);
  });

  it('updates quantity and removes at zero', () => {
    let cart = createEmptyCart();
    cart = addLineItem(cart, product, 2);
    cart = updateLineQty(cart, 'p1', 'Black', 0);
    expect(cart.items).toHaveLength(0);
  });

  it('validates positive quantities', () => {
    const cart = { items: [{ id: 'p1', quantity: 1, price: 10, maxStock: 5 }] };
    expect(validateCart(cart).ok).toBe(true);
  });
});
