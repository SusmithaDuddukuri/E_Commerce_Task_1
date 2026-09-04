import React, { useMemo, useState } from 'react';
import { BarChart3, ClipboardList, Users, Package, ShieldCheck, Headphones, LogOut, Store, UserRound, Heart, Settings, Ticket, Boxes, LineChart, UserCog, FileText, CheckCircle2, Clock3, AlertTriangle } from 'lucide-react';

const roleConfig = {
  admin: { label:'Administrator', icon:ShieldCheck, tabs:['Overview','Users','Orders','Inventory','Settings'], desc:'Manage users, orders, inventory and platform settings.' },
  customer: { label:'Customer', icon:UserRound, tabs:['Overview','Orders','Wishlist','Profile'], desc:'View orders, saved products and account information.' },
  worker: { label:'Worker', icon:ClipboardList, tabs:['Overview','Tasks','Orders','Inventory'], desc:'Manage assigned fulfillment and store operations.' },
  support: { label:'Support', icon:Headphones, tabs:['Overview','Tickets','Customers','Orders'], desc:'Handle customer requests, tickets and order support.' },
  manager: { label:'Manager', icon:BarChart3, tabs:['Overview','Sales','Team','Reports'], desc:'Review business performance, sales and team operations.' },
  merchant: { label:'Merchant', icon:Store, tabs:['Overview','Products','Orders','Inventory'], desc:'Manage your catalog, stock and merchant orders.' }
};

const sampleOrders = [
  { id:'ORD-10482', customer:'Sophia Chen', item:'Aura Horizon Headphones', status:'Shipped', total:'$349.00' },
  { id:'ORD-10481', customer:'Marcus Vance', item:'Chronos Ceramic Smartwatch', status:'Processing', total:'$499.00' },
  { id:'ORD-10480', customer:'Elena Rostova', item:'Lumina Minimalist Light', status:'Delivered', total:'$219.00' },
  { id:'ORD-10479', customer:'David Miller', item:'Monolith Leather Chair', status:'Processing', total:'$899.00' }
];
const sampleUsers = [
  ['U-1001','Sophia Chen','Customer','Active'],['U-1002','Marcus Vance','Customer','Active'],['U-1003','Elena Rostova','Support','Active'],['U-1004','David Miller','Worker','Pending']
];
const sampleInventory = [
  ['Aura Horizon Headphones',18,'Healthy'],['Chronos Ceramic Smartwatch',7,'Low stock'],['Apex Wireless Earbuds',15,'Healthy'],['Monolith Leather Chair',4,'Critical']
];
const sampleTickets = [
  ['TKT-221','Payment issue','Sophia Chen','Open'],['TKT-220','Delivery update','Marcus Vance','In progress'],['TKT-219','Return request','Elena Rostova','Resolved']
];

function Status({ children }) {
  const v = String(children).toLowerCase();
  const cls = v.includes('resolved') || v.includes('active') || v.includes('delivered') || v.includes('healthy') ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/20' : v.includes('critical') || v.includes('open') || v.includes('low') || v.includes('pending') ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20' : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border-indigo-500/20';
  return <span className={`inline-flex px-2 py-1 rounded-full border text-[10px] font-semibold ${cls}`}>{children}</span>;
}

function SectionCard({ title, subtitle, icon: Icon, children }) {
  return <div className="glass-panel rounded-2xl p-5">
    <div className="flex items-start gap-3 mb-4"><div className="w-9 h-9 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500"><Icon className="w-4 h-4"/></div><div><h3 className="font-semibold text-slate-900 dark:text-white">{title}</h3>{subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}</div></div>{children}
  </div>;
}

function Table({ headers, rows }) {
  return <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800"><table className="w-full text-left text-xs"><thead className="bg-slate-50 dark:bg-slate-900"><tr>{headers.map(h=><th key={h} className="px-4 py-3 font-semibold text-slate-500 whitespace-nowrap">{h}</th>)}</tr></thead><tbody className="divide-y divide-slate-200 dark:divide-slate-800">{rows.map((row,i)=><tr key={i} className="hover:bg-slate-50/70 dark:hover:bg-slate-900/40">{row.map((cell,j)=><td key={j} className="px-4 py-3 text-slate-700 dark:text-slate-300 whitespace-nowrap">{cell}</td>)}</tr>)}</tbody></table></div>;
}

export default function RoleDashboard({ user, orders = [], wishlistCount = 0, onStore, onLogout }) {
  const cfg = roleConfig[user?.role] || roleConfig.customer;
  const Icon = cfg.icon;
  const [tab, setTab] = useState('Overview');
  const [refreshKey, setRefreshKey] = useState(0);
  const actualOrders = orders.length ? orders : sampleOrders;
  const stats = useMemo(() => {
    const common = [
      ['Orders', orders.length || sampleOrders.length, Package],
      ['Saved items', wishlistCount, Heart],
      ['Account', 'Active', CheckCircle2],
      ['Support', 'Available', Headphones]
    ];
    if (user?.role === 'admin') return [['Users', 248, Users],['Orders', 1429, Package],['Inventory', 864, Boxes],['System', 'Healthy', ShieldCheck]];
    if (user?.role === 'worker') return [['Assigned tasks', 12, ClipboardList],['Pending', 5, Clock3],['Orders today', 38, Package],['Stock alerts', 4, AlertTriangle]];
    if (user?.role === 'support') return [['Open tickets', 14, Ticket],['Resolved today', 31, CheckCircle2],['Customers', 642, Users],['Orders to review', 8, Package]];
    if (user?.role === 'manager') return [['Revenue', '$184.9K', LineChart],['Orders', '1,429', Package],['Team members', 28, Users],['Conversion', '3.84%', BarChart3]];
    if (user?.role === 'merchant') return [['Products', 86, Boxes],['Orders', 1429, Package],['Low stock', 7, AlertTriangle],['Revenue', '$184.9K', LineChart]];
    return common;
  }, [orders.length, wishlistCount, user?.role, refreshKey]);

  const renderTab = () => {
    const role = user?.role;
    if (tab === 'Overview') return <>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">{stats.map(([label,value,I])=><div className="glass-card rounded-xl p-5" key={label}><I className="w-5 h-5 text-indigo-500"/><p className="text-xs text-slate-500 mt-4">{label}</p><p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{value}</p></div>)}</div>
      <div className="grid lg:grid-cols-2 gap-5">
        <SectionCard title="Recent activity" subtitle="Latest activity for this workspace" icon={ActivityIcon}><div className="space-y-3">{actualOrders.slice(0,4).map((o,i)=><div key={o.id || i} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60"><div className="min-w-0"><p className="text-sm font-medium text-slate-800 dark:text-white truncate">{o.item || o.name || 'Order activity'}</p><p className="text-[11px] text-slate-500 mt-1">{o.id || `ACT-${i+1}`} · {o.customer || user?.name || 'Account'}</p></div><Status>{o.status || 'Processing'}</Status></div>)}</div></SectionCard>
        <SectionCard title="Workspace shortcuts" subtitle="Open a real section instead of a notification" icon={Store}><div className="grid sm:grid-cols-2 gap-3">{cfg.tabs.slice(1).map(t=><button type="button" key={t} onClick={()=>setTab(t)} className="secondary-cta justify-start">{t}</button>)}</div></SectionCard>
      </div>
    </>;

    if (tab === 'Users') return <SectionCard title="User management" subtitle="Registered accounts and access status" icon={Users}><Table headers={['ID','Name','Role','Status']} rows={sampleUsers.map(r=>[...r.slice(0,3),<Status key={r[3]}>{r[3]}</Status>])}/></SectionCard>;
    if (tab === 'Orders') return <SectionCard title="Order management" subtitle="Recent customer orders and fulfillment status" icon={Package}><Table headers={['Order','Customer','Product','Status','Total']} rows={actualOrders.slice(0,8).map((o,i)=>[o.id || `ORD-${10482-i}`,o.customer || user?.name || 'Customer',o.item || o.name || 'Product',<Status key={i}>{o.status || 'Processing'}</Status>,o.total || `$${(Number(o.price)||199).toFixed(2)}`])}/></SectionCard>;
    if (tab === 'Inventory') return <SectionCard title="Inventory" subtitle="Current stock health and replenishment priorities" icon={Boxes}><Table headers={['Product','Stock','Health','Action']} rows={sampleInventory.map((r,i)=>[r[0],r[1],<Status key={i}>{r[2]}</Status>,r[1] < 8 ? 'Replenish' : 'Monitor'])}/></SectionCard>;
    if (tab === 'Wishlist') return <SectionCard title="Saved products" subtitle={`${wishlistCount} item(s) currently saved`} icon={Heart}><div className="grid sm:grid-cols-2 gap-3">{['Aura Horizon Headphones','Chronos Ceramic Smartwatch','Apex Wireless Earbuds','Lumina Minimalist Light'].map((p,i)=><div key={p} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800"><p className="font-medium text-slate-800 dark:text-white">{p}</p><p className="text-xs text-slate-500 mt-1">Saved product #{i+1}</p></div>)}</div></SectionCard>;
    if (tab === 'Profile') return <SectionCard title="Profile" subtitle="Your account information" icon={UserRound}><div className="grid sm:grid-cols-2 gap-4 text-sm"><div><p className="text-xs text-slate-500">Name</p><p className="mt-1 font-medium text-slate-900 dark:text-white">{user?.name || 'Customer'}</p></div><div><p className="text-xs text-slate-500">Email</p><p className="mt-1 font-medium text-slate-900 dark:text-white">{user?.email || 'Not provided'}</p></div><div><p className="text-xs text-slate-500">Role</p><p className="mt-1 font-medium text-slate-900 dark:text-white">{cfg.label}</p></div><div><p className="text-xs text-slate-500">Status</p><p className="mt-1"><Status>Active</Status></p></div></div></SectionCard>;
    if (tab === 'Tasks') return <SectionCard title="Assigned tasks" subtitle="Fulfillment work currently assigned to you" icon={ClipboardList}><Table headers={['Task','Area','Priority','Status']} rows={['Pack order ORD-10482','Packing','High','In progress','Restock headphones','Inventory','Medium','Pending','Verify returned item','Returns','Low','Pending','Dispatch afternoon orders','Shipping','High','Completed'].reduce((a,v,i)=>{if(i%4===0)a.push([]);a[a.length-1].push(v);return a;},[]).map((r,i)=>[...r.slice(0,3),<Status key={i}>{r[3]}</Status>])}/></SectionCard>;
    if (tab === 'Tickets') return <SectionCard title="Support tickets" subtitle="Customer issues requiring attention" icon={Ticket}><Table headers={['Ticket','Issue','Customer','Status']} rows={sampleTickets.map((r,i)=>[...r.slice(0,3),<Status key={i}>{r[3]}</Status>])}/></SectionCard>;
    if (tab === 'Customers') return <SectionCard title="Customers" subtitle="Customer service directory" icon={Users}><Table headers={['Customer','Orders','Last activity','Status']} rows={[['Sophia Chen',8,'Today','Active'],['Marcus Vance',5,'Today','Active'],['Elena Rostova',12,'Yesterday','Active'],['David Miller',3,'3 days ago','Pending']].map((r,i)=>[...r.slice(0,3),<Status key={i}>{r[3]}</Status>])}/></SectionCard>;
    if (tab === 'Sales') return <SectionCard title="Sales performance" subtitle="Key commercial metrics" icon={LineChart}><div className="grid sm:grid-cols-3 gap-4">{[['Today','$18,420'],['This week','$184,920'],['Average order','$129.40']].map(([a,b])=><div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60" key={a}><p className="text-xs text-slate-500">{a}</p><p className="text-xl font-bold text-slate-900 dark:text-white mt-1">{b}</p><p className="text-xs text-emerald-500 mt-1">+8.4% vs previous</p></div>)}</div></SectionCard>;
    if (tab === 'Team') return <SectionCard title="Team operations" subtitle="Team workload and availability" icon={Users}><Table headers={['Member','Department','Workload','Status']} rows={[['Ava Patel','Operations','82%','Active'],['Noah Williams','Support','64%','Active'],['Mia Johnson','Warehouse','91%','Active'],['Leo Martin','Returns','42%','Away']].map((r,i)=>[...r.slice(0,3),<Status key={i}>{r[3]}</Status>])}/></SectionCard>;
    if (tab === 'Reports') return <SectionCard title="Business reports" subtitle="Available performance reports" icon={FileText}><div className="space-y-3">{['Weekly sales report','Inventory health report','Customer activity report','Order fulfillment report'].map((r,i)=><div key={r} className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800"><div><p className="font-medium text-slate-800 dark:text-white">{r}</p><p className="text-xs text-slate-500 mt-1">Updated {i+1} hour(s) ago</p></div><button type="button" onClick={()=>setRefreshKey(k=>k+1)} className="secondary-cta">View report</button></div>)}</div></SectionCard>;
    if (tab === 'Products') return <SectionCard title="Product catalog" subtitle="Published products and catalog health" icon={Boxes}><Table headers={['Product','Category','Price','Stock']} rows={[['Aura Horizon Headphones','Audio','$349.00',18],['Chronos Smartwatch','Wearables','$499.00',7],['Apex Earbuds','Audio','$199.00',15],['Monolith Chair','Furniture','$899.00',4]]}/></SectionCard>;
    if (tab === 'Settings') return <SectionCard title="Platform settings" subtitle="Account and operational preferences" icon={Settings}><div className="space-y-3">{['Email notifications','Order alerts','Inventory alerts','Two-factor authentication'].map((s,i)=><div key={s} className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800"><span className="text-sm text-slate-800 dark:text-white">{s}</span><span className="text-xs font-semibold text-emerald-500">{i===3?'Recommended':'Enabled'}</span></div>)}</div></SectionCard>;
    return <SectionCard title={tab} subtitle="Workspace information" icon={FileText}><p className="text-sm text-slate-500">This section contains the latest {tab.toLowerCase()} information for your account.</p></SectionCard>;
  };

  return <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <div className="glass-panel rounded-2xl p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-center gap-4"><div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-500/15 flex items-center justify-center text-indigo-600 dark:text-indigo-300"><Icon /></div><div><p className="eyebrow">Workspace</p><h1 className="text-2xl font-bold text-slate-900 dark:text-white">{cfg.label} Dashboard</h1><p className="text-sm text-slate-500 mt-1">Welcome, {user?.name || user?.email || 'User'}. {cfg.desc}</p></div></div>
        <div className="flex gap-2"><button type="button" className="secondary-cta" onClick={onStore}><Store className="w-4 h-4"/> Store</button><button type="button" className="primary-cta" onClick={onLogout}><LogOut className="w-4 h-4"/> Sign out</button></div>
      </div>
    </div>
    <div className="flex flex-wrap gap-2 mb-6">{cfg.tabs.map(t=><button type="button" key={t} onClick={()=>setTab(t)} className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${tab===t?'bg-slate-900 text-white dark:bg-white dark:text-slate-900':'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>{t}</button>)}</div>
    <div key={`${tab}-${refreshKey}`} className="animate-[fadeIn_.2s_ease-out]">{renderTab()}</div>
    {tab !== 'Overview' && <button type="button" onClick={()=>setTab('Overview')} className="mt-5 text-xs font-semibold text-indigo-500 hover:text-indigo-400">← Back to Overview</button>}
  </section>;
}
function ActivityIcon(props){ return <ClipboardList {...props}/>; }
