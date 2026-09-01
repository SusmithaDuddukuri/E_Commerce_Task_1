import React, { useState } from 'react';
import { loadUsersDb, saveUsersDb, saveUser } from '../utils/storage';

export default function AuthModal({ open, onClose, onAuth, mode: initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  if (!open) return null;

  const reset = () => {
    setError('');
    setInfo('');
    setPassword('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setInfo('');
    const em = email.trim().toLowerCase();
    if (!em || !em.includes('@')) {
      setError('Enter a valid email.');
      return;
    }
    if (mode !== 'forgot' && password.length < 4) {
      setError('Password must be at least 4 characters.');
      return;
    }

    const db = loadUsersDb();

    if (mode === 'signup') {
      if (!name.trim()) {
        setError('Name is required.');
        return;
      }
      if (db.some((u) => u.email === em)) {
        setError('An account with this email already exists.');
        return;
      }
      const user = {
        id: `user_${Date.now()}`,
        email: em,
        name: name.trim(),
        password,
        createdAt: new Date().toISOString(),
        loyaltyPoints: 100,
        loyaltyTier: 'Bronze'
      };
      saveUsersDb([user, ...db]);
      const session = { id: user.id, email: user.email, name: user.name, loyaltyPoints: user.loyaltyPoints, loyaltyTier: user.loyaltyTier };
      saveUser(session);
      onAuth?.(session);
      onClose?.();
      return;
    }

    if (mode === 'login') {
      const found = db.find((u) => u.email === em && u.password === password);
      if (!found) {
        // Allow demo login without prior signup
        if (em === 'demo@aura.com' && password === 'demo') {
          const session = {
            id: 'user_demo',
            email: em,
            name: 'Demo Shopper',
            loyaltyPoints: 1250,
            loyaltyTier: 'Silver'
          };
          saveUser(session);
          onAuth?.(session);
          onClose?.();
          return;
        }
        setError('Invalid email or password. Try demo@aura.com / demo');
        return;
      }
      const session = {
        id: found.id,
        email: found.email,
        name: found.name,
        loyaltyPoints: found.loyaltyPoints || 0,
        loyaltyTier: found.loyaltyTier || 'Bronze'
      };
      saveUser(session);
      onAuth?.(session);
      onClose?.();
      return;
    }

    if (mode === 'forgot') {
      setInfo('If an account exists, a reset link would be sent. (Demo: use signup or demo@aura.com / demo)');
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="font-semibold text-slate-900 dark:text-white">
            {mode === 'login' && 'Sign in'}
            {mode === 'signup' && 'Create account'}
            {mode === 'forgot' && 'Reset password'}
          </h2>
          <button type="button" onClick={onClose} className="text-sm text-slate-500 hover:text-slate-800 dark:hover:text-white">
            Close
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-3">
          {mode === 'signup' && (
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300">
              Name
              <input
                className="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-950 px-3 py-2 text-sm"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </label>
          )}
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-300">
            Email
            <input
              type="email"
              className="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-950 px-3 py-2 text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </label>
          {mode !== 'forgot' && (
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300">
              Password
              <input
                type="password"
                className="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-950 px-3 py-2 text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                required
              />
            </label>
          )}
          {error && <p className="text-sm text-rose-600">{error}</p>}
          {info && <p className="text-sm text-teal-700 dark:text-teal-300">{info}</p>}
          <button
            type="submit"
            className="w-full rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-2.5 text-sm font-semibold hover:opacity-90"
          >
            {mode === 'login' && 'Sign in'}
            {mode === 'signup' && 'Create account'}
            {mode === 'forgot' && 'Send reset link'}
          </button>
          <div className="flex flex-wrap gap-3 text-xs text-slate-500 pt-1">
            {mode !== 'login' && (
              <button type="button" className="hover:underline" onClick={() => { setMode('login'); reset(); }}>
                Sign in
              </button>
            )}
            {mode !== 'signup' && (
              <button type="button" className="hover:underline" onClick={() => { setMode('signup'); reset(); }}>
                Create account
              </button>
            )}
            {mode !== 'forgot' && (
              <button type="button" className="hover:underline" onClick={() => { setMode('forgot'); reset(); }}>
                Forgot password
              </button>
            )}
          </div>
          <p className="text-[11px] text-slate-400 pt-1">Demo: demo@aura.com / demo</p>
        </form>
      </div>
    </div>
  );
}
