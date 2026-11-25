import { describe, it, expect } from 'vitest';
import { isEnabled } from '../src/lib/featureFlags.js';

describe('featureFlags', () => {
  it('resolves default values overrides and missing flags', () => {
    expect(isEnabled('flag_0')).toBe(true);
    expect(isEnabled('flag_0', { flag_0: false })).toBe(false);
    expect(isEnabled('nonexistent')).toBe(false);
  });
});
