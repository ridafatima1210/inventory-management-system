import React, { useState, useEffect } from 'react';
import { API_URL } from '../App';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({ customer_id: '', product_id: '', quantity: 1 });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadData = () => {
    fetch(`${API_URL}/orders`).then(res => res.json()).then(data => setOrders(data));
    fetch(`${API_URL}/products`).then(res => res.json()).then(data => setProducts(data));
    fetch(`${API_URL}/customers`).then(res => res.json()).then(data => setCustomers(data));
  };

  useEffect(() => { loadData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      const res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Allocation Failure');
      
      setSuccess('Transactional order pipeline manifest transacted and inventory locked');
      setForm({ customer_id: '', product_id: '', quantity: 1 });
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancel = async (id) => {
    if (!confirm('Void transaction and roll back allocated inventory stocks?')) return;
    await fetch(`${API_URL}/orders/${id}`, { method: 'DELETE' });
    setSuccess('Pipeline successfully voided. Stock counts replenished.');
    loadData();
  };

  return (
    <div class="space-y-8 animate-fade-in">
      {/* View Header */}
      <div class="border-b border-slate-800/60 pb-6">
        <h2 class="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
          Transaction Pipeline
        </h2>
        <p class="text-slate-400 text-sm mt-1">Trigger transactional order events, deduct stock pools, and audit cost totals.</p>
      </div>

      {/* Order Entry Form */}
      <div class="bg-slate-950 p-6 rounded-2xl border border-slate-800/80 shadow-2xl">
        <div class="flex items-center gap-2 mb-6">
          <span class="w-2 h-2 rounded-full bg-indigo-500"></span>
          <h3 class="text-md font-bold text-slate-200 tracking-wide uppercase">Execute Order Pipeline</h3>
        </div>

        {error && <div class="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-3 rounded-xl mb-4 text-xs font-mono">{error}</div>}
        {success && <div class="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3 rounded-xl mb-4 text-xs font-mono">✓ {success}</div>}
        
        <form onSubmit={handleSubmit} class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="flex flex-col gap-1.5">
            <label class="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">Target Customer Entity</label>
            <select required value={form.customer_id} onChange={e=>setForm({...form, customer_id: parseInt(e.target.value)})} class="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-3 text-white font-medium text-sm focus:outline-none focus:border-indigo-500 focus:bg-slate-900 transition-all shadow-inner h-[46px]">
              <option value="" class="text-slate-500">Select Entity...</option>
              {customers.map(c => <option key={c.id} value={c.id} class="bg-slate-950 text-white">{c.name} ({c.email})</option>)}
            </select>
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">Target Inventory Variant</label>
            <select required value={form.product_id} onChange={e=>setForm({...form, product_id: parseInt(e.target.value)})} class="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-3 text-white font-medium text-sm focus:outline-none focus:border-indigo-500 focus:bg-slate-900 transition-all shadow-inner h-[46px]">
              <option value="" class="text-slate-500">Select Product...</option>
              {products.map(p => <option key={p.id} value={p.id} class="bg-slate-950 text-white">{p.name} — ${p.price} ({p.quantity} left)</option>)}
            </select>
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">Allocation Units</label>
            <input type="number" min="1" placeholder="Quantity" required value={form.quantity} onChange={e=>setForm({...form, quantity: parseInt(e.target.value)})} class="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-3 text-white placeholder-slate-600 font-medium text-sm focus:outline-none focus:border-indigo-500 focus:bg-slate-900/50 transition-all shadow-inner"/>
          </div>

          <button type="submit" class="md:col-span-3 mt-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-sm tracking-wide py-3.5 rounded-xl transition-all duration-200 shadow-xl shadow-indigo-600/10 hover:shadow-indigo-600/20 active:scale-[0.99]">
            ⚡ Dispatch Pipeline Transaction Manifest
          </button>
        </form>
      </div>

      {/* Transaction History Table */}
      <div class="bg-slate-950 rounded-2xl border border-slate-800/80 shadow-2xl overflow-hidden">
        <div class="p-5 bg-slate-900/30 border-b border-slate-800/60 flex items-center justify-between">
          <h3 class="text-sm font-bold text-slate-400 uppercase tracking-widest">Active Transaction Log</h3>
          <span class="text-xs text-slate-500 font-mono">Dispatched Blocks: {orders.length}</span>
        </div>

        {orders.length === 0 ? (
          <div class="flex flex-col items-center justify-center py-16 text-center">
            <span class="text-4xl opacity-30 filter grayscale mb-3">🛒</span>
            <p class="text-sm font-bold text-slate-400">Order stream quiet</p>
            <p class="text-xs text-slate-600 mt-1 max-w-xs">No transactions executed yet. Connect components using the control engine module above.</p>
          </div>
        ) : (
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-900/60 border-b border-slate-800 text-slate-400 text-[11px] tracking-wider uppercase font-mono">
                  <th class="p-4">Pipeline Block</th>
                  <th class="p-4">Client Node</th>
                  <th class="p-4">Item Target</th>
                  <th class="p-4">Units</th>
                  <th class="p-4">Aggregate Valuation</th>
                  <th class="p-4 text-right">Operations</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-900/40">
                {orders.map(o => (
                  <tr key={o.id} class="hover:bg-slate-900/20 text-sm group transition-colors">
                    <td class="p-4 font-mono text-xs text-indigo-400 font-semibold">#TRX-00{o.id}</td>
                    <td class="p-4 font-semibold text-white">{o.customer?.name}</td>
                    <td class="p-4 text-slate-300 font-mono text-xs">{o.product?.name}</td>
                    <td class="p-4 text-slate-400 font-medium">{o.quantity}</td>
                    <td class="p-4 text-emerald-400 font-bold font-mono">${o.total_amount?.toFixed(2)}</td>
                    <td class="p-4 text-right">
                      <button onClick={() => handleCancel(o.id)} class="text-rose-500 hover:text-rose-400 font-semibold text-xs uppercase tracking-wide transition-colors">Void Pipeline</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}