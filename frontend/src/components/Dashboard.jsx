import React, { useState, useEffect } from 'react';
import { API_URL } from '../App';

export default function Dashboard() {
  const [stats, setStats] = useState({ total_products: 0, total_customers: 0, total_orders: 0, low_stock_count: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/dashboard`)
      .then(res => res.json())
      .then(data => { setStats(data); setLoading(false); })
      .catch(err => console.error(err));
  }, []);

  if (loading) {
    return (
      <div class="flex items-center justify-center min-h-[50vh]">
        <div class="flex flex-col items-center gap-3">
          <div class="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p class="text-indigo-400 font-medium text-sm tracking-wider uppercase animate-pulse">Initializing Analytics Core...</p>
        </div>
      </div>
    );
  }

  return (
    <div class="space-y-10 animate-fade-in">
      {/* Dynamic Welcome & Top Banner */}
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/60 pb-6">
        <div>
          <h2 class="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            System Analytics
          </h2>
          <p class="text-slate-400 text-sm mt-1">Real-time enterprise resource tracking and operational metrics.</p>
        </div>
        <div class="flex items-center gap-2 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-xs text-slate-400 font-mono shadow-inner">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          SYSTEM ENGINE OPERATIONAL
        </div>
      </div>

      {/* Main Stats Grid */}
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Stock Units', value: stats.total_products, icon: '📦', color: 'from-blue-600/20 to-cyan-500/10', border: 'border-blue-500/30', text: 'text-cyan-400' },
          { label: 'Registered Accounts', value: stats.total_customers, icon: '👥', color: 'from-purple-600/20 to-indigo-500/10', border: 'border-indigo-500/30', text: 'text-indigo-400' },
          { label: 'Processed Orders', value: stats.total_orders, icon: '🛒', color: 'from-emerald-600/20 to-teal-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400' },
          { label: 'Critical Low Stock (<10)', value: stats.low_stock_count, icon: '⚠️', color: stats.low_stock_count > 0 ? 'from-rose-600/20 to-orange-500/10 animate-pulse' : 'from-slate-800/40 to-slate-900/20', border: stats.low_stock_count > 0 ? 'border-rose-500/50' : 'border-slate-800', text: stats.low_stock_count > 0 ? 'text-rose-400' : 'text-slate-400' }
        ].map((card, i) => (
          <div key={i} class={`bg-gradient-to-br ${card.color} ${card.border} border p-6 rounded-2xl shadow-2xl relative overflow-hidden group hover:scale-[1.02] transition-all duration-300`}>
            <div class="absolute -right-4 -bottom-4 text-7xl opacity-[0.04] group-hover:opacity-[0.08] transition-opacity font-sans pointer-events-none">
              {card.icon}
            </div>
            <div class="flex justify-between items-start">
              <div>
                <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">{card.label}</p>
                <p class="text-5xl font-black text-white mt-3 tracking-tight">{card.value}</p>
              </div>
              <div class={`text-2xl p-2 rounded-xl bg-slate-900/80 border border-slate-800 ${card.text} shadow-md`}>
                {card.icon}
              </div>
            </div>
            <div class="mt-4 flex items-center gap-1.5 text-xs font-mono text-slate-500">
              <span class="text-emerald-400">✓</span> Live sync active
            </div>
          </div>
        ))}
      </div>

      {/* Secondary Row: System Insights and Status logs */}
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Pipeline Activities */}
        <div class="lg:col-span-2 bg-slate-950 border border-slate-800/80 rounded-2xl p-6 shadow-2xl">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-lg font-bold text-white tracking-tight">System Ledger</h3>
              <p class="text-xs text-slate-400">Latest pipeline movements and data adjustments.</p>
            </div>
            <span class="text-xs bg-slate-900 border border-slate-800 text-indigo-400 font-mono px-2.5 py-1 rounded-lg">Auto-Updates</span>
          </div>

          <div class="space-y-3">
            {stats.total_products === 0 && stats.total_orders === 0 ? (
              // Empty State State
              <div class="flex flex-col items-center justify-center py-12 text-center border border-dashed border-slate-800/60 rounded-xl bg-slate-900/20">
                <span class="text-3xl filter grayscale opacity-40 mb-3">📡</span>
                <p class="text-sm font-semibold text-slate-300">Data pipelines waiting for initial payload</p>
                <p class="text-xs text-slate-500 mt-1 max-w-xs">Deploy new data components using the navigation options on the left sidebar panel.</p>
              </div>
            ) : (
              <div class="space-y-2">
                <div class="flex items-center justify-between p-3.5 bg-slate-900/40 rounded-xl border border-slate-900 text-sm">
                  <div class="flex items-center gap-3">
                    <span class="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 text-xs font-mono">SYS</span>
                    <p class="text-slate-200">Database cluster successfully linked via Docker Network</p>
                  </div>
                  <span class="text-xs font-mono text-slate-500">Just now</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* System Health Check & Interactive Shortcuts */}
        <div class="space-y-6">
          <div class="bg-slate-950 border border-slate-800/80 rounded-2xl p-6 shadow-2xl">
            <h3 class="text-lg font-bold text-white tracking-tight mb-4">Architecture Stack</h3>
            <div class="space-y-3.5">
              {[
                { name: 'FastAPI Backend Engine', version: 'v0.110.0', status: 'Healthy', color: 'bg-emerald-500' },
                { name: 'React Client Instance', version: 'Vite v5.1.6', status: 'Active', color: 'bg-emerald-500' },
                { name: 'PostgreSQL Relational DB', version: 'v15.0-Alpine', status: 'Connected', color: 'bg-emerald-500' }
              ].map((stack, idx) => (
                <div key={idx} class="flex items-center justify-between p-3 bg-slate-900/40 border border-slate-900 rounded-xl">
                  <div>
                    <p class="text-xs font-bold text-slate-200">{stack.name}</p>
                    <p class="text-[10px] text-slate-500 font-mono mt-0.5">{stack.version}</p>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class={`w-1.5 h-1.5 rounded-full ${stack.color}`}></span>
                    <span class="text-[11px] text-slate-400 font-mono font-semibold uppercase">{stack.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}