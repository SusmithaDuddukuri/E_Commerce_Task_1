import { describe, it, expect } from 'vitest';
import { serializeWebhook } from '../src/lib/webhooks.js';

describe('webhooks', () => {
  it('serializes webhook event with type payload and timestamp', () => {
    const parsed = JSON.parse(serializeWebhook('evt.webhook.0', { orderId: '1' }));
    expect(parsed.type).toBe('evt.webhook.0');
    expect(parsed.payload.orderId).toBe('1');
    expect(typeof parsed.sentAt).toBe('string');
  });
});
