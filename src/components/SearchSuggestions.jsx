import React, { useMemo } from 'react';
import { Search, Clock, Tag } from 'lucide-react';
import { searchProducts } from '../data/productsData';

export default function SearchSuggestions({ query, products, recent = [], onSelect, onClose }) {
  const matches = useMemo(() => {
    if (!query || query.length < 1) return [];
    return searchProducts(query, products).slice(0, 6);
  }, [query, products]);

  return (
    <div className="fixed inset-0 z-40" onClick={onClose}>
      <div
        className="absolute top-[60px] left-1/2 -translate-x-1/2 w-full max-w-xl px-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="glass-panel rounded-2xl border border-slate-700 shadow-2xl overflow-hidden">
          {recent.length > 0 && !query && (
            <div className="p-3 border-b border-slate-200 dark:border-slate-800">
              <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Recent
              </p>
              <div className="flex flex-wrap gap-2">
                {recent.map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => onSelect(r)}
                    className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-indigo-600 hover:text-slate-900 dark:text-white transition-colors"
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          )}
          {matches.length === 0 && query ? (
            <div className="p-6 text-center text-sm text-slate-500 dark:text-slate-400">
              No products match “{query}”
            </div>
          ) : (
            <ul className="max-h-80 overflow-y-auto">
              {matches.map(p => (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(p.name)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-indigo-500/10 text-left transition-colors"
                  >
                    <img src={p.image} alt="" className="w-10 h-10 rounded-lg object-cover bg-slate-50 dark:bg-slate-900" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{p.name}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Tag className="w-3 h-3" /> {p.category} · ${p.price}
                      </p>
                    </div>
                    <Search className="w-4 h-4 text-slate-500 shrink-0" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
