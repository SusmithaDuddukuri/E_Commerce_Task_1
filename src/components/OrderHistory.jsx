import React from 'react';
import { X, Package, CheckCircle2 } from 'lucide-react';
import { formatPrice, formatDate } from '../utils/formatters';

export default function OrderHistory({ isOpen, onClose, orders = [] }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md h-full glass-panel border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-indigo-400" />
            <h2 className="font-bold text-slate-900 dark:text-white">Order History</h2>
          </div>
          <button type="button" aria-label="Close order history" onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-16 text-slate-500 dark:text-slate-400 text-sm">
              No orders yet. Complete a checkout to see history here.
            </div>
          ) : (
            orders.map(order => (
              <div key={order.id} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-mono text-indigo-300">{order.id}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{formatDate(order.createdAt)}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">
                    <CheckCircle2 className="w-3 h-3" /> {order.status}
                  </span>
                </div>
                <ul className="space-y-2">
                  {(order.items || []).map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs">
                      {item.image && <img src={item.image} alt="" className="w-8 h-8 rounded-md object-cover" />}
                      <span className="flex-1 truncate text-slate-200">{item.name}</span>
                      <span className="text-slate-500 dark:text-slate-400">×{item.quantity}</span>
                      <span className="text-slate-900 dark:text-white font-medium">{formatPrice(item.price * item.quantity)}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Total</span>
                  <span className="font-bold text-slate-900 dark:text-white">{formatPrice(order.total)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
