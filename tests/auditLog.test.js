import { describe, it, expect } from 'vitest';
import { AUDIT_ACTIONS, buildAuditEntry } from '../src/domain/auditLog.js';

describe('auditLog', () => {
  it('exports audit action definitions', () => {
    expect(AUDIT_ACTIONS.length).toBeGreaterThan(0);
  });

  it('builds structured audit entries with timestamp', () => {
    const entry = buildAuditEntry('order.created', 'admin', 'ord-1', { total: 99 });
    expect(entry.action).toBe('order.created');
    expect(entry.actor).toBe('admin');
    expect(entry.resourceId).toBe('ord-1');
    expect(entry.meta.total).toBe(99);
    expect(typeof entry.at).toBe('string');
  });
});
