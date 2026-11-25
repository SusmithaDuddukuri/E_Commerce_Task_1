import { describe, it, expect } from 'vitest';
import { can } from '../src/domain/rbac.js';

describe('rbac', () => {
  it('grants catalog write to admin and denies viewer', () => {
    expect(can('admin', 'catalog.write')).toBe(true);
    expect(can('viewer', 'catalog.write')).toBe(false);
    expect(can('unknown', 'catalog.read')).toBe(false);
  });
});
