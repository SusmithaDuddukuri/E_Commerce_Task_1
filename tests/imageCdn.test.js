import { describe, it, expect } from 'vitest';
import { buildImageUrl } from '../src/lib/imageCdn.js';

describe('imageCdn', () => {
  it('appends transform dimensions quality and format params', () => {
    const url = buildImageUrl('/assets/shoe.jpg', 'xf-000');
    expect(url).toContain('w=100');
    expect(url).toContain('fm=webp');
  });
});
