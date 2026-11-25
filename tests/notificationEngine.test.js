import { describe, it, expect } from 'vitest';
import { renderTemplate } from '../src/engine/notificationEngine.js';

describe('notificationEngine', () => {
  it('renders existing templates and returns null for missing ids', () => {
    const rendered = renderTemplate('tmpl-0000', { orderId: 'ORD-1' });
    expect(rendered).not.toBeNull();
    expect(rendered.channel).toBe('email');
    expect(renderTemplate('missing')).toBeNull();
  });
});
