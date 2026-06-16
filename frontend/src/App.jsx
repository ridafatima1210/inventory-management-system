import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import Products from './components/Products';
import Customers from './components/Customers';
import Orders from './components/Orders';

// Resolve environment configuration securely
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-900 text-slate-100 font-sans">
      
      {/* Sidebar Navigation Network Component */}
      <nav className="w-full md:w-64 bg-slate-950 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800/60 z-10 shadow-2xl">
        <div>
          {/* Brand Platform Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-indigo-600 p-2 rounded-xl font-black tracking-wider text-xl shadow-lg shadow-indigo-600/30 select-none">
              INV
            </div>
            <h1 className="text-xl font-extrabold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent tracking-tight">
              StockStream
            </h1>
          </div>

          {/* Interactive Navigation Control Blocks */}
          <div className="space-y-1.5">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: '📊' },
              { id: 'products', label: 'Products', icon: '📦' },
              { id: 'customers', label: 'Customers', icon: '👥' },
              { id: 'orders', label: 'Orders', icon: '🛒' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 text-left font-semibold text-sm tracking-wide ${
                  currentTab === tab.id 
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-600/15 border-l-4 border-indigo-400' 
                    : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-200'
                }`}
              >
                <span className="text-base filter drop-shadow">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* System Version Footprint */}
        <div className="text-[10px] font-mono font-semibold text-slate-600 mt-6 border-t border-slate-900 pt-4 tracking-widest uppercase">
          Client Instance v1.0.0
        </div>
      </nav>

      {/* Main View Sandbox Viewport Container */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950/40">
        <div className="max-w-7xl mx-auto">
          {currentTab === 'dashboard' && <Dashboard />}
          {currentTab === 'products' && <Products />}
          {currentTab === 'customers' && <Customers />}
          {currentTab === 'orders' && <Orders />}
        </div>
      </main>

    </div>
  );
}

export default App;