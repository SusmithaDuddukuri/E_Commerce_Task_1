import React from 'react';
import { CheckCircle2, Sparkles, X, AlertTriangle, Info } from 'lucide-react';

const ICONS = {
  success: CheckCircle2,
  error: AlertTriangle,
  info: Info,
  default: Sparkles
};

export default function Toast({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div aria-live="polite" className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => {
        const Icon = ICONS[t.type] || ICONS.default;
        const tone =
          t.type === 'error'
            ? 'border-rose-500/40 bg-rose-950/80'
            : t.type === 'info'
            ? 'border-sky-500/40 bg-sky-950/80'
            : 'border-indigo-500/30 bg-slate-50 dark:bg-slate-900/90';
        return (
          <div
            key={t.id}
            className={`pointer-events-auto glass-panel rounded-2xl border p-4 shadow-2xl flex items-start gap-3 animate-[slideIn_0.3s_ease-out] ${tone}`}
            role="status"
          >
            <div className="mt-0.5 shrink-0">
              <Icon className={`w-5 h-5 ${t.type === 'error' ? 'text-rose-400' : t.type === 'info' ? 'text-sky-400' : 'text-indigo-400'}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{t.title}</p>
              {t.message && <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">{t.message}</p>}
            </div>
            <button
              type="button"
              onClick={() => onDismiss(t.id)}
              className="p-1 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-white/10 transition-colors shrink-0"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(12px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
