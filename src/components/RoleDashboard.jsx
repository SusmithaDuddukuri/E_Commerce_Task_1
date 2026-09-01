import React, { useMemo, useState } from 'react';
import { BarChart3, ClipboardList, Users, Package, ShieldCheck, Headphones, Truck, Settings, LogOut, Store, UserRound } from 'lucide-react';

const roleConfig = {
  admin: { label:'Administrator', icon:ShieldCheck, tabs:['Overview','Users','Orders','Inventory','Settings'], desc:'Manage the store, users, orders and operational controls.' },
  customer: { label:'Customer', icon:UserRound, tabs:['Overview','Orders','Wishlist','Profile'], desc:'View your orders, saved products and account information.' },
  worker: { label:'Worker', icon:ClipboardList, tabs:['Overview','Tasks','Orders','Inventory'], desc:'Manage assigned fulfillment and store operations.' },
  support: { label:'Support', icon:Headphones, tabs:['Overview','Tickets','Customers','Orders'], desc:'Handle customer requests and order support.' },
  merchant: { label:'Merchant', icon:Store, tabs:['Overview','Products','Orders','Inventory'], desc:'Manage your catalog, stock and merchant orders.' },
  manager: { label:'Manager', icon:BarChart3, tabs:['Overview','Sales','Team','Reports'], desc:'Review business performance and team operations.' }
};

export default function RoleDashboard({ user, orders = [], wishlistCount = 0, onStore, onLogout, onToast }) {
  const cfg = roleConfig[user?.role] || roleConfig.customer;
  const Icon = cfg.icon;
  const [tab, setTab] = useState(cfg.tabs[0]);
  const stats = useMemo(() => [
    ['Orders', orders.length, Package],
    ['Saved items', wishlistCount, Users],
    ['Account status', 'Active', ShieldCheck],
    ['Service', 'Available', Headphones]
  ], [orders.length, wishlistCount]);

  const action = (label) => onToast?.(label, `${label} is ready for ${cfg.label.toLowerCase()} access.`);
  return <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <div className="glass-panel rounded-2xl p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-500/15 flex items-center justify-center text-indigo-600 dark:text-indigo-300"><Icon /></div>
          <div><p className="eyebrow">Workspace</p><h1 className="text-2xl font-bold text-slate-900 dark:text-white">{cfg.label} Dashboard</h1><p className="text-sm text-slate-500 mt-1">Welcome, {user?.name || user?.email}. {cfg.desc}</p></div>
        </div>
        <div className="flex gap-2"><button className="secondary-cta" onClick={onStore}><Store className="w-4 h-4"/> Store</button><button className="primary-cta" onClick={onLogout}><LogOut className="w-4 h-4"/> Sign out</button></div>
      </div>
    </div>
    <div className="flex flex-wrap gap-2 mb-6">{cfg.tabs.map(t=><button key={t} onClick={()=>setTab(t)} className={`px-4 py-2 rounded-lg text-sm font-medium border ${tab===t?'bg-slate-900 text-white dark:bg-white dark:text-slate-900':'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'}`}>{t}</button>)}</div>
    {tab==='Overview' ? <>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">{stats.map(([label,value,I])=><div className="glass-card rounded-xl p-5" key={label}><I className="w-5 h-5 text-indigo-500"/><p className="text-xs text-slate-500 mt-4">{label}</p><p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{value}</p></div>)}</div>
      <div className="grid lg:grid-cols-2 gap-5"><div className="glass-panel rounded-xl p-5"><h2 className="font-semibold text-slate-900 dark:text-white">Quick actions</h2><div className="grid sm:grid-cols-2 gap-3 mt-4">{cfg.tabs.slice(1).map(t=><button key={t} onClick={()=>setTab(t)} className="secondary-cta justify-start">{t}</button>)}</div></div><div className="glass-panel rounded-xl p-5"><h2 className="font-semibold text-slate-900 dark:text-white">Account</h2><p className="text-sm text-slate-500 mt-2">{user?.email}</p><button className="secondary-cta mt-4" onClick={()=>action('Profile settings')}><Settings className="w-4 h-4"/> Manage account</button></div></div>
    </> : <div className="glass-panel rounded-2xl p-8"><h2 className="text-xl font-bold text-slate-900 dark:text-white">{tab}</h2><p className="text-sm text-slate-500 mt-2">This {tab.toLowerCase()} workspace is connected to your current session.</p><div className="mt-6 flex flex-wrap gap-3"><button className="primary-cta" onClick={()=>action(`Refresh ${tab}`)}>Refresh data</button><button className="secondary-cta" onClick={()=>action(`Create ${tab} item`)}>Create new</button></div></div>}
  </section>;
}
