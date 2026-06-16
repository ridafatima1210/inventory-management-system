import React, { useState, useEffect } from 'react';
import { API_URL } from '../App';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', sku: '', price: '', quantity: '' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadProducts = () => {
    fetch(`${API_URL}/products`)
      .then(res => res.json())
      .then(data => setProducts(data));
  };

  useEffect(() => { loadProducts(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    const method = editingId ? 'PUT' : 'POST';
    const endpoint = editingId ? `${API_URL}/products/${editingId}` : `${API_URL}/products`;

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Transaction failed');
      
      setSuccess(editingId ? 'Product matrix altered successfully' : 'Product successfully deployed to inventory network');
      setForm({ name: '', sku: '', price: '', quantity: '' });
      setEditingId(null);
      loadProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (p) => {
    setEditingId(p.id);
    setForm({ name: p.name, sku: p.sku, price: p.price, quantity: p.quantity });
  };

  const handleDelete = async (id) => {
    if (!confirm('Confirm permanent node deletion from master registries?')) return;
    await fetch(`${API_URL}/products/${id}`, { method: 'DELETE' });
    setSuccess('Product purged cleanly from data layer');
    loadProducts();
  };

  return (
    <div class="space-y-8 animate-fade-in">
      {/* View Header */}
      <div class="border-b border-slate-800/60 pb-6">
        <h2 class="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
          Inventory Control
        </h2>
        <p class="text-slate-400 text-sm mt-1">Provision, modify, and track material SKU variants across distributed segments.</p>
      </div>

      {/* Input / Control Form Block */}
      <div class="bg-slate-950 p-6 rounded-2xl border border-slate-800/80 shadow-2xl">
        <div class="flex items-center gap-2 mb-6">
          <span class="w-2 h-2 rounded-full bg-indigo-500"></span>
          <h3 class="text-md font-bold text-slate-200 tracking-wide uppercase">
            {editingId ? 'Modify Inventory Node' : 'Initialize Inventory Node'}
          </h3>
        </div>

        {error && <div class="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-3 rounded-xl mb-4 text-xs font-mono">{error}</div>}
        {success && <div class="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3 rounded-xl mb-4 text-xs font-mono">✓ {success}</div>}
        
        <form onSubmit={handleSubmit} class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div class="flex flex-col gap-1.5">
            <label class="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">Item Label</label>
            <input type="text" placeholder="e.g. Server Core Rack" required value={form.name} onChange={e=>setForm({...form, name: e.target.value})} class="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-3 text-white placeholder-slate-600 font-medium text-sm focus:outline-none focus:border-indigo-500 focus:bg-slate-900/50 transition-all shadow-inner"/>
          </div>
          
          <div class="flex flex-col gap-1.5">
            <label class="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">SKU Code Signature</label>
            <input type="text" placeholder="e.g. SKU-SRV-01" required value={form.sku} onChange={e=>setForm({...form, sku: e.target.value})} class="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-3 text-white placeholder-slate-600 font-mono text-sm focus:outline-none focus:border-indigo-500 focus:bg-slate-900/50 transition-all shadow-inner"/>
          </div>
          
          <div class="flex flex-col gap-1.5">
            <label class="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">Unit Valuation ($)</label>
            <input type="number" step="0.01" placeholder="0.00" required value={form.price} onChange={e=>setForm({...form, price: e.target.value})} class="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-3 text-white placeholder-slate-600 font-medium text-sm focus:outline-none focus:border-indigo-500 focus:bg-slate-900/50 transition-all shadow-inner"/>
          </div>
          
          <div class="flex flex-col gap-1.5">
            <label class="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">Stock Base Capacity</label>
            <input type="number" placeholder="0" required value={form.quantity} onChange={e=>setForm({...form, quantity: e.target.value})} class="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-3 text-white placeholder-slate-600 font-medium text-sm focus:outline-none focus:border-indigo-500 focus:bg-slate-900/50 transition-all shadow-inner"/>
          </div>

          <button type="submit" class="sm:col-span-2 md:col-span-4 mt-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-sm tracking-wide py-3.5 rounded-xl transition-all duration-200 shadow-xl shadow-indigo-600/10 hover:shadow-indigo-600/20 active:scale-[0.99]">
            {editingId ? '⚡ Commit Node Modifications' : '➕ Deploy New Product Node'}
          </button>
        </form>
      </div>

      {/* Main Inventory Registry Data Table */}
      <div class="bg-slate-950 rounded-2xl border border-slate-800/80 shadow-2xl overflow-hidden">
        <div class="p-5 bg-slate-900/30 border-b border-slate-800/60 flex items-center justify-between">
          <h3 class="text-sm font-bold text-slate-400 uppercase tracking-widest">Active Stock Ledger</h3>
          <span class="text-xs text-slate-500 font-mono">Row Items: {products.length}</span>
        </div>

        {products.length === 0 ? (
          <div class="flex flex-col items-center justify-center py-16 text-center">
            <span class="text-4xl opacity-30 filter grayscale mb-3">📁</span>
            <p class="text-sm font-bold text-slate-400">Registry is empty</p>
            <p class="text-xs text-slate-600 mt-1 max-w-xs">Fill out and deploy using the master form generator module above to populate live elements.</p>
          </div>
        ) : (
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-900/60 border-b border-slate-800 text-slate-400 text-[11px] tracking-wider uppercase font-mono">
                  <th class="p-4">Product Context</th>
                  <th class="p-4">SKU Code</th>
                  <th class="p-4">Financial Cost</th>
                  <th class="p-4">Stock Level Status</th>
                  <th class="p-4 text-right">Operations</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-900/40">
                {products.map(p => (
                  <tr key={p.id} class="hover:bg-slate-900/20 text-sm group transition-colors">
                    <td class="p-4 font-semibold text-white group-hover:text-indigo-400 transition-colors">{p.name}</td>
                    <td class="p-4 font-mono text-xs text-slate-400 bg-slate-900/30 px-2 py-1 rounded border border-slate-800/40">{p.sku}</td>
                    <td class="p-4 font-medium text-slate-300">${p.price.toFixed(2)}</td>
                    <td class="p-4">
                      <span class={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${p.quantity < 10 ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                        <span class={`w-1.5 h-1.5 rounded-full ${p.quantity < 10 ? 'bg-rose-500' : 'bg-emerald-500'}`}></span>
                        {p.quantity} units
                      </span>
                    </td>
                    <td class="p-4 text-right space-x-3">
                      <button onClick={() => handleEdit(p)} class="text-indigo-400 hover:text-indigo-300 font-semibold text-xs uppercase tracking-wide transition-colors">Edit</button>
                      <button onClick={() => handleDelete(p.id)} class="text-rose-500 hover:text-rose-400 font-semibold text-xs uppercase tracking-wide transition-colors">Purge</button>
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