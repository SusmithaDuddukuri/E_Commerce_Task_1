import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, DollarSign, Package, Activity, Layers, Download, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';

export default function MerchantDashboard({ onTriggerToast }) {
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');

  // Dynamic KPIs based on selected timeframe
  const timeframeMultiplier = selectedTimeframe === '24h' ? 0.2 : selectedTimeframe === '7d' ? 1.0 : selectedTimeframe === '30d' ? 3.8 : 42.0;

  const baseRevenue = 184920.00;
  const baseOrders = 1429;

  const currentRevenue = (baseRevenue * timeframeMultiplier).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  const currentOrders = Math.floor(baseOrders * timeframeMultiplier).toLocaleString();

  const kpis = [
    { title: 'Gross Revenue', value: currentRevenue, change: '+14.2%', isPos: true, icon: DollarSign, color: 'indigo' },
    { title: 'Active Orders', value: currentOrders, change: '+8.4%', isPos: true, icon: Package, color: 'emerald' },
    { title: 'Conversion Rate', value: '3.84%', change: '+0.6%', isPos: true, icon: Activity, color: 'amber' },
    { title: 'Avg Order Value', value: '$129.40', change: '-1.2%', isPos: false, icon: TrendingUp, color: 'cyan' },
  ];

  // Dynamic live orders state
  const [ordersList, setOrdersList] = useState([
    { id: 'ORD-2026-9901', customer: 'Sophia Chen', item: 'Aura Horizon Headphones', region: 'North America', status: 'SHIPPED', amount: '$349.00', date: 'Just now' },
    { id: 'ORD-2026-9902', customer: 'Marcus Vance', item: 'Chronos Ceramic Smartwatch', region: 'Europe', status: 'DELIVERED', amount: '$499.00', date: '5 mins ago' },
    { id: 'ORD-2026-9903', customer: 'Elena Rostova', item: 'Lumina Minimalist Light', region: 'Asia Pacific', status: 'PROCESSING', amount: '$219.00', date: '12 mins ago' },
    { id: 'ORD-2026-9904', customer: 'David K. Miller', item: 'Monolith Leather Chair', region: 'North America', status: 'SHIPPED', amount: '$899.00', date: '25 mins ago' },
    { id: 'ORD-2026-9905', customer: 'Amara Okafor', item: 'Vortex Mechanical Keyboard', region: 'Latin America', status: 'PROCESSING', amount: '$189.00', date: '40 mins ago' },
  ]);

  // Working CSV Export Feature
  const handleExportCSV = () => {
    const headers = ['Order ID', 'Customer', 'Product', 'Region', 'Status', 'Amount', 'Timestamp'];
    const rows = ordersList.map(o => [o.id, o.customer, `"${o.item}"`, o.region, o.status, o.amount, o.date]);
    
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `aura_merchant_orders_${selectedTimeframe}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onTriggerToast && onTriggerToast('Export Successful', `Exported ${ordersList.length} orders to CSV.`);
  };

  // Real-time incoming order simulation
  const handleSimulateLiveOrder = () => {
    const sampleNames = ['Lucas Meyer', 'Claire Dupont', 'Hiroshi Tanaka', 'Isabella Rossi', 'Liam O’Connor'];
    const sampleItems = ['Aura Horizon Headphones', 'Apex ANC Earbuds', 'Chronos Smartwatch', 'Vortex Keyboard'];
    const sampleRegions = ['North America', 'Europe', 'Asia Pacific', 'Latin America'];
    const samplePrices = ['$199.00', '$349.00', '$499.00', '$189.00'];

    const newOrder = {
      id: `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      customer: sampleNames[Math.floor(Math.random() * sampleNames.length)],
      item: sampleItems[Math.floor(Math.random() * sampleItems.length)],
      region: sampleRegions[Math.floor(Math.random() * sampleRegions.length)],
      status: 'PROCESSING',
      amount: samplePrices[Math.floor(Math.random() * samplePrices.length)],
      date: 'Just now'
    };

    setOrdersList(prev => [newOrder, ...prev.slice(0, 9)]);
    onTriggerToast && onTriggerToast('Live Stream Event', `New order received from ${newOrder.customer}!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <h1 className="text-xl font-bold text-white">Merchant Intelligence & Analytics</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">Real-time telemetric monitoring and enterprise stock matrix</p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Timeframe selector */}
          <div className="flex bg-slate-900 rounded-full p-1 border border-slate-800 text-xs">
            {['24h', '7d', '30d', '1y'].map((tf) => (
              <button
                key={tf}
                onClick={() => setSelectedTimeframe(tf)}
                className={`px-3 py-1 rounded-full transition-all ${
                  selectedTimeframe === tf ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Export CSV Button */}
          <button
            onClick={handleExportCSV}
            className="glass-pill px-3.5 py-2 rounded-full text-xs font-semibold text-slate-300 hover:text-white hover:border-indigo-500 flex items-center space-x-1.5 border border-slate-800 transition-all active:scale-95"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="glass-card p-6 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">{kpi.title}</span>
                <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-indigo-400">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-white">{kpi.value}</span>
                <span className={`text-xs font-semibold ${kpi.isPos ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {kpi.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Graph & Stock Monitor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue Graph */}
        <div className="lg:col-span-2 glass-card p-6 rounded-3xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Revenue Telemetry</h3>
              <p className="text-[11px] text-slate-400">Hourly sales volume ({selectedTimeframe})</p>
            </div>
            <div className="flex items-center space-x-4 text-xs font-mono">
              <span className="flex items-center space-x-1.5 text-indigo-400">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                <span>Actual</span>
              </span>
              <span className="flex items-center space-x-1.5 text-slate-500">
                <span className="w-2 h-2 rounded-full bg-slate-700" />
                <span>Baseline Target</span>
              </span>
            </div>
          </div>

          <div className="h-44 flex items-end justify-between gap-2 pt-6 border-b border-slate-800/80">
            {[45, 60, 52, 78, 92, 68, 84, 95, 70, 88, 100, 85].map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                <div 
                  className="w-full bg-indigo-600/80 group-hover:bg-indigo-400 rounded-t-sm transition-all duration-300"
                  style={{ height: `${val}%` }}
                />
                <span className="text-[9px] font-mono text-slate-500 group-hover:text-slate-300">
                  {i + 1}h
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Stock Matrix Monitor */}
        <div className="glass-card p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              Stock Health
            </h3>
            <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
              Low Stock Matrix
            </span>
          </div>

          <div className="space-y-3">
            {[
              { name: 'Monolith Executive Chair', stock: 4, status: 'CRITICAL', color: 'text-rose-400' },
              { name: 'Chronos Ceramic Smartwatch', stock: 7, status: 'WARNING', color: 'text-amber-400' },
              { name: 'Apex Wireless Earbuds', stock: 15, status: 'HEALTHY', color: 'text-emerald-400' },
              { name: 'Aura Horizon Headphones', stock: 18, status: 'HEALTHY', color: 'text-emerald-400' },
            ].map((item, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-semibold text-white truncate max-w-[150px]">{item.name}</h4>
                  <span className="text-[10px] text-slate-400">{item.stock} units remaining</span>
                </div>
                <span className={`font-mono text-[10px] font-bold ${item.color}`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Transactional Stream Table */}
      <div className="glass-card rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Live Transaction Stream</h3>
            <p className="text-[11px] text-slate-400">Live order operations</p>
          </div>
          <button
            onClick={handleSimulateLiveOrder}
            className="px-3 py-1.5 rounded-full bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 text-xs font-semibold flex items-center space-x-1.5 hover:bg-indigo-600 hover:text-white transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Order Feed</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Region</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {ordersList.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-indigo-400">{ord.id}</td>
                  <td className="py-3.5 px-4 font-medium text-white">{ord.customer}</td>
                  <td className="py-3.5 px-4 text-slate-400">{ord.item}</td>
                  <td className="py-3.5 px-4 text-slate-400">{ord.region}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      ord.status === 'DELIVERED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      ord.status === 'SHIPPED' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                      'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {ord.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-white">{ord.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

// dashboard KPI refresh
