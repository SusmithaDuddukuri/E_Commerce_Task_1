import { describe, it, expect } from 'vitest';
import { t } from '../src/constants/i18n.js';

describe('i18n', () => {
  it('resolves known translation keys and falls back for missing keys', () => {
    expect(t('en-US', 'nav.home')).toBe('[en-US] nav home');
    expect(t('en-US', 'missing.key', 'Fallback')).toBe('Fallback');
  });
});
