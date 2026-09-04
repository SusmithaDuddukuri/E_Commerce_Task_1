import React, { useState } from 'react';
import { loadUsersDb, saveUsersDb, saveUser } from '../utils/storage';

const ROLE_ACCOUNTS = {
  customer: { email:'customer@aura.com', password:'customer123', name:'AURA Customer' },
  admin: { email:'admin@aura.com', password:'admin123', name:'AURA Administrator' },
  worker: { email:'worker@aura.com', password:'worker123', name:'AURA Worker' },
  support: { email:'support@aura.com', password:'support123', name:'AURA Support' },
  merchant: { email:'merchant@aura.com', password:'merchant123', name:'AURA Merchant' },
  manager: { email:'manager@aura.com', password:'manager123', name:'AURA Manager' }
};

export default function AuthModal({ open, onClose, onAuth, mode: initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('customer');
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
        loyaltyTier: 'Bronze',
        role
      };
      saveUsersDb([user, ...db]);
      const session = { id: user.id, email: user.email, name: user.name, loyaltyPoints: user.loyaltyPoints, loyaltyTier: user.loyaltyTier, role: user.role };
      saveUser(session);
      onAuth?.(session);
      onClose?.();
      return;
    }

    if (mode === 'login') {
      const presetRole = Object.keys(ROLE_ACCOUNTS).find((r) => ROLE_ACCOUNTS[r].email === em && ROLE_ACCOUNTS[r].password === password);
      if (presetRole) {
        const account = ROLE_ACCOUNTS[presetRole];
        const session = { id:`preset_${presetRole}`, email:account.email, name:account.name, loyaltyPoints:250, loyaltyTier:'Silver', role:presetRole };
        saveUser(session); onAuth?.(session); onClose?.(); return;
      }
      const found = db.find((u) => u.email === em && u.password === password);
      if (!found) {
        setError('Invalid email or password. Use a valid account or one of the role accounts below.');
        return;
      }
      const session = {
        id: found.id,
        email: found.email,
        name: found.name,
        loyaltyPoints: found.loyaltyPoints || 0,
        loyaltyTier: found.loyaltyTier || 'Bronze',
        role: found.role || role || 'customer'
      };
      saveUser(session);
      onAuth?.(session);
      onClose?.();
      return;
    }

    if (mode === 'forgot') {
      setInfo('If an account exists, password reset instructions will be sent to the registered email address.');
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4">
      <div className="absolute inset-0 bg-slate-900/50" onClick={onClose} />
      <div className="relative w-full max-w-sm max-h-[calc(100vh-1.5rem)] sm:max-h-[calc(100vh-2rem)] overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl">
        <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700">
          <h2 className="font-semibold text-slate-900 dark:text-white">
            {mode === 'login' && 'Sign in'}
            {mode === 'signup' && 'Create account'}
            {mode === 'forgot' && 'Reset password'}
          </h2>
          <button type="button" onClick={onClose} className="text-sm text-slate-500 hover:text-slate-800 dark:hover:text-white">
            Close
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 sm:p-4 space-y-2.5">
          {mode === 'signup' && (
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300">
              Name
              <input
                className="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-950 px-3 py-1.5 text-sm"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </label>
          )}
          {mode !== 'forgot' && (
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300">
              Account type
              <select value={role} onChange={(e) => setRole(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-950 px-3 py-1.5 text-sm">
                <option value="customer">Customer</option>
                <option value="admin">Administrator</option>
                <option value="worker">Worker</option>
                <option value="support">Support</option>
                <option value="merchant">Merchant</option>
                <option value="manager">Manager</option>
              </select>
            </label>
          )}
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-300">
            Email
            <input
              type="email"
              className="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-950 px-3 py-1.5 text-sm"
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
                className="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-950 px-3 py-1.5 text-sm"
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
            className="w-full rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-2 text-sm font-semibold hover:opacity-90"
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
          {mode === 'login' && (
            <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-2.5 mt-1.5">
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 mb-2">Role accounts</p>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(ROLE_ACCOUNTS).map(([r,a]) => <button key={r} type="button" onClick={() => { setRole(r); setEmail(a.email); setPassword(a.password); }} className="text-left px-2 py-1.5 rounded-md bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] text-slate-600 dark:text-slate-300"><b className="block capitalize text-[10px]">{r}</b><span className="truncate block">{a.email}</span></button>)}
              </div>
            </div>
          )}
          <p className="text-[11px] text-slate-400 pt-1">Each role has its own workspace and permissions.</p>
        </form>
      </div>
    </div>
  );
}
