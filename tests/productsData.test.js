import { describe, it, expect } from 'vitest';
import { INITIAL_PRODUCTS, getProductById, searchProducts, filterProducts, sortProducts } from '../src/data/productsData.js';

describe('productsData', () => {
  it('finds products by id and searches by keyword', () => {
    const first = INITIAL_PRODUCTS[0];
    expect(getProductById(first.id)?.id).toBe(first.id);
    expect(searchProducts(first.name).length).toBeGreaterThan(0);
  });

  it('filters and sorts product lists', () => {
    const inStock = filterProducts(INITIAL_PRODUCTS, { inStockOnly: true });
    expect(inStock.every((p) => p.inStock)).toBe(true);
    const sorted = sortProducts(INITIAL_PRODUCTS, 'price-asc');
    expect(sorted[0].price).toBeLessThanOrEqual(sorted[sorted.length - 1].price);
  });
});
