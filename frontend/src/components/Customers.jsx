import React, { useState, useEffect } from 'react';
import { API_URL } from '../App';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadCustomers = () => {
    fetch(`${API_URL}/customers`).then(res => res.json()).then(data => setCustomers(data));
  };

  useEffect(() => { loadCustomers(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      const res = await fetch(`${API_URL}/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Identity deployment failed');
      
      setSuccess('Customer identity registry verified and secured');
      setForm({ name: '', email: '', phone: '' });
      loadCustomers();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Erase this customer account profile from database layers?')) return;
    await fetch(`${API_URL}/customers/${id}`, { method: 'DELETE' });
    setSuccess('Profile record terminated cleanly');
    loadCustomers();
  };

  return (
    <div class="space-y-8 animate-fade-in">
      {/* View Header */}
      <div class="border-b border-slate-800/60 pb-6">
        <h2 class="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
          CRM Core
        </h2>
        <p class="text-slate-400 text-sm mt-1">Manage partner identities, secure lines, and communication access points.</p>
      </div>

      {/* Input Form Block */}
      <div class="bg-slate-950 p-6 rounded-2xl border border-slate-800/80 shadow-2xl">
        <div class="flex items-center gap-2 mb-6">
          <span class="w-2 h-2 rounded-full bg-indigo-500"></span>
          <h3 class="text-md font-bold text-slate-200 tracking-wide uppercase">Register Customer Profile</h3>
        </div>

        {error && <div class="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-3 rounded-xl mb-4 text-xs font-mono">{error}</div>}
        {success && <div class="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3 rounded-xl mb-4 text-xs font-mono">✓ {success}</div>}
        
        <form onSubmit={handleSubmit} class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="flex flex-col gap-1.5">
            <label class="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">Full Legal Name</label>
            <input type="text" placeholder="e.g. Acme Corp / Jane Doe" required value={form.name} onChange={e=>setForm({...form, name: e.target.value})} class="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-3 text-white placeholder-slate-600 font-medium text-sm focus:outline-none focus:border-indigo-500 focus:bg-slate-900/50 transition-all shadow-inner"/>
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">Communication Node (Email)</label>
            <input type="email" placeholder="e.g. partner@enterprise.com" required value={form.email} onChange={e=>setForm({...form, email: e.target.value})} class="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-3 text-white placeholder-slate-600 font-medium text-sm focus:outline-none focus:border-indigo-500 focus:bg-slate-900/50 transition-all shadow-inner"/>
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">Phone Secure Line</label>
            <input type="text" placeholder="e.g. +1 (555) 019-2834" required value={form.phone} onChange={e=>setForm({...form, phone: e.target.value})} class="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-3 text-white placeholder-slate-600 font-mono text-sm focus:outline-none focus:border-indigo-500 focus:bg-slate-900/50 transition-all shadow-inner"/>
          </div>

          <button type="submit" class="md:col-span-3 mt-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-sm tracking-wide py-3.5 rounded-xl transition-all duration-200 shadow-xl shadow-indigo-600/10 hover:shadow-indigo-600/20 active:scale-[0.99]">
            Commit System Entry Record
          </button>
        </form>
      </div>

      {/* Registry Table */}
      <div class="bg-slate-950 rounded-2xl border border-slate-800/80 shadow-2xl overflow-hidden">
        <div class="p-5 bg-slate-900/30 border-b border-slate-800/60 flex items-center justify-between">
          <h3 class="text-sm font-bold text-slate-400 uppercase tracking-widest">Active Client Ledger</h3>
          <span class="text-xs text-slate-500 font-mono">Total Records: {customers.length}</span>
        </div>

        {customers.length === 0 ? (
          <div class="flex flex-col items-center justify-center py-16 text-center">
            <span class="text-4xl opacity-30 filter grayscale mb-3">👥</span>
            <p class="text-sm font-bold text-slate-400">No customers registered</p>
            <p class="text-xs text-slate-600 mt-1 max-w-xs">Initialize profiles above to build out relational database anchors.</p>
          </div>
        ) : (
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-900/60 border-b border-slate-800 text-slate-400 text-[11px] tracking-wider uppercase font-mono">
                  <th class="p-4">Customer Base</th>
                  <th class="p-4">Secure Communications</th>
                  <th class="p-4">Line Trace</th>
                  <th class="p-4 text-right">Operations</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-900/40">
                {customers.map(c => (
                  <tr key={c.id} class="hover:bg-slate-900/20 text-sm group transition-colors">
                    <td class="p-4 font-semibold text-white group-hover:text-indigo-400 transition-colors">{c.name}</td>
                    <td class="p-4 text-slate-300 font-medium">{c.email}</td>
                    <td class="p-4 font-mono text-xs text-slate-400">{c.phone}</td>
                    <td class="p-4 text-right">
                      <button onClick={() => handleDelete(c.id)} class="text-rose-500 hover:text-rose-400 font-semibold text-xs uppercase tracking-wide transition-colors">Terminate Profile</button>
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