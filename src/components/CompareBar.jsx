import React from 'react';
import { X, GitCompare, Eye } from 'lucide-react';
import { formatPrice } from '../utils/formatters';

export default function CompareBar({ compareIds, products, onClear, onRemove, onSelectProduct }) {
  if (!compareIds || compareIds.length === 0) return null;
  const items = compareIds.map(id => products.find(p => p.id === id)).filter(Boolean);
  if (!items.length) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-30 p-3 pointer-events-none">
      <div className="max-w-5xl mx-auto pointer-events-auto glass-panel rounded-2xl border border-indigo-500/30 shadow-2xl p-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold shrink-0">
          <GitCompare className="w-4 h-4" />
          Compare ({items.length}/4)
        </div>
        <div className="flex-1 flex gap-2 overflow-x-auto">
          {items.map(p => (
            <div key={p.id} className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900/80 rounded-xl px-2 py-1.5 border border-slate-700 min-w-[140px]">
              <img src={p.image} alt="" className="w-8 h-8 rounded-md object-cover" />
              <div className="min-w-0 flex-1">
                <p className="text-[11px] text-slate-900 dark:text-white truncate font-medium">{p.name}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">{formatPrice(p.price)}</p>
              </div>
              <button type="button" aria-label={`Remove ${p.name} from compare`} onClick={() => onRemove(p.id)} className="p-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            type="button"
            onClick={() => items[0] && onSelectProduct(items[0])}
            className="text-xs px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-slate-900 dark:text-white font-semibold flex items-center gap-1"
          >
            <Eye className="w-3.5 h-3.5" /> View
          </button>
          <button
            type="button"
            onClick={onClear}
            className="text-xs px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-700 text-slate-600 dark:text-slate-300"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
