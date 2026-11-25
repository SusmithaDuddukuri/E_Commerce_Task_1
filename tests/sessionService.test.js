import { describe, it, expect } from 'vitest';
import { createSession, touchSession } from '../src/domain/sessionService.js';

describe('sessionService', () => {
  it('creates a session and increments page views on touch', () => {
    const sess = createSession('user-1');
    expect(sess.userId).toBe('user-1');
    expect(sess.pageViews).toBe(0);
    const touched = touchSession(sess);
    expect(touched.pageViews).toBe(1);
    expect(touched.id).toBe(sess.id);
  });
});
