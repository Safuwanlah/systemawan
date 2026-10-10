"use client";

import React, { useState, useReducer, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Minus, 
  Package, 
  AlertTriangle, 
  ArrowDownToLine, 
  TrendingUp,
  History,
  X,
  Boxes,
  LayoutDashboard,
  LogOut
} from 'lucide-react';
import Link from 'next/link';

// --- TIPE DATA ---
type Product = {
  id: string;
  sku: string;
  name: string;
  category: string;
  stock: number;
  minStock: number;
  unit: string;
  price: number;
};

type ActivityLog = {
  id: string;
  timestamp: Date;
  type: 'IN' | 'OUT' | 'NEW';
  productName: string;
  qty: number;
  user: string;
};

// --- DATA DUMMY AWAL ---
const initialProducts: Product[] = [
  { id: '1', sku: 'SKU-001', name: 'MacBook Pro 14" M3', category: 'Elektronik', stock: 15, minStock: 5, unit: 'pcs', price: 25000000 },
  { id: '2', sku: 'SKU-002', name: 'Logitech MX Master 3S', category: 'Aksesoris', stock: 3, minStock: 10, unit: 'pcs', price: 1500000 },
  { id: '3', sku: 'SKU-003', name: 'Kertas HVS A4 80gr', category: 'ATK', stock: 120, minStock: 50, unit: 'rim', price: 55000 },
  { id: '4', sku: 'SKU-004', name: 'Tinta Printer Epson Black', category: 'ATK', stock: 8, minStock: 10, unit: 'botol', price: 85000 },
  { id: '5', sku: 'SKU-005', name: 'Kursi Ergonomis', category: 'Furniture', stock: 2, minStock: 5, unit: 'pcs', price: 2500000 },
];

const initialLogs: ActivityLog[] = [
  { id: 'l1', timestamp: new Date(Date.now() - 3600000 * 2), type: 'IN', productName: 'Kertas HVS A4 80gr', qty: 50, user: 'Admin 1' },
  { id: 'l2', timestamp: new Date(Date.now() - 3600000 * 5), type: 'OUT', productName: 'Logitech MX Master 3S', qty: 2, user: 'Admin 1' },
];

// --- REDUCER STATE MANAGEMENT ---
type Action = 
  | { type: 'ADD_STOCK'; id: string; qty: number }
  | { type: 'REDUCE_STOCK'; id: string; qty: number }
  | { type: 'ADD_PRODUCT'; product: Omit<Product, 'id'> };

function inventoryReducer(state: { products: Product[], logs: ActivityLog[] }, action: Action): { products: Product[], logs: ActivityLog[] } {
  const newLogId = Math.random().toString(36).substr(2, 9);
  const timestamp = new Date();

  switch (action.type) {
    case 'ADD_STOCK':
      return {
        products: state.products.map(p => 
          p.id === action.id ? { ...p, stock: p.stock + action.qty } : p
        ),
        logs: [
          { id: newLogId, timestamp, type: 'IN', productName: state.products.find(p => p.id === action.id)?.name || '', qty: action.qty, user: 'Admin (You)' },
          ...state.logs
        ]
      };
    case 'REDUCE_STOCK':
      return {
        products: state.products.map(p => 
          p.id === action.id ? { ...p, stock: Math.max(0, p.stock - action.qty) } : p
        ),
        logs: [
          { id: newLogId, timestamp, type: 'OUT', productName: state.products.find(p => p.id === action.id)?.name || '', qty: action.qty, user: 'Admin (You)' },
          ...state.logs
        ]
      };
    case 'ADD_PRODUCT': {
      const newProduct = { ...action.product, id: Math.random().toString(36).substr(2, 9) };
      return {
        products: [newProduct, ...state.products],
        logs: [
          { id: newLogId, timestamp, type: 'NEW', productName: newProduct.name, qty: newProduct.stock, user: 'Admin (You)' },
          ...state.logs
        ]
      };
    }
    default:
      return state;
  }
}

export default function StandaloneAdminStok() {
  const [state, dispatch] = useReducer(inventoryReducer, { products: initialProducts, logs: initialLogs });
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Semua');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State untuk Tambah Barang
  const [newProduct, setNewProduct] = useState({ name: '', sku: '', category: '', stock: 0, minStock: 0, unit: 'pcs', price: 0 });

  // --- DERIVED DATA & STATISTICS ---
  const categories = ['Semua', ...Array.from(new Set(state.products.map(p => p.category)))];
  
  const filteredProducts = useMemo(() => {
    return state.products.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
      const matchCategory = categoryFilter === 'Semua' || p.category === categoryFilter;
      return matchSearch && matchCategory;
    });
  }, [state.products, search, categoryFilter]);

  const totalItems = state.products.length;
  const totalUnits = state.products.reduce((acc, curr) => acc + curr.stock, 0);
  const lowStockCount = state.products.filter(p => p.stock <= p.minStock).length;
  const itemsInToday = state.logs
    .filter(l => l.type === 'IN' && new Date(l.timestamp).toDateString() === new Date().toDateString())
    .reduce((acc, curr) => acc + curr.qty, 0);

  // --- HANDLERS ---
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: 'ADD_PRODUCT', product: newProduct });
    setIsAddModalOpen(false);
    setNewProduct({ name: '', sku: '', category: '', stock: 0, minStock: 0, unit: 'pcs', price: 0 });
  };

  return (
    <div className="flex h-screen bg-muted font-sans text-slate-200 overflow-hidden">
      
      {/* SIDEBAR MINIMALIS */}
      <aside className="w-64 bg-[#141619] border-r border-border flex flex-col shrink-0 hidden md:flex">
        {/* Logo */}
        <div className="h-20 flex items-center px-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Boxes className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-white leading-tight">Admin Stok</h1>
              <p className="text-[11px] text-slate-400 font-medium tracking-wide">DASHBOARD</p>
            </div>
          </div>
        </div>
        
        {/* Navigasi Minimal */}
        <nav className="flex-1 p-4">
          <div className="flex items-center gap-3 px-4 py-3 bg-indigo-500/10 text-indigo-400 rounded-xl font-medium border border-indigo-500/20">
            <LayoutDashboard className="w-5 h-5" /> 
            <span>Ringkasan Stok</span>
          </div>
        </nav>
        
        {/* Footer Sidebar */}
        <div className="p-4 border-t border-border">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-[#1B1F23] rounded-xl transition-colors w-full">
            <LogOut className="w-5 h-5" />
            <span>Kembali ke Web Utama</span>
          </Link>
        </div>
      </aside>

      {/* AREA KONTEN UTAMA */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        
        {/* HEADER AREA */}
        <header className="px-8 py-6 shrink-0 flex flex-col sm:flex-row sm:items-end justify-between gap-4 mt-2">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Ringkasan Stok</h2>
            <p className="text-sm text-slate-400">Pantau pergerakan seluruh stok inventaris secara real-time.</p>
          </div>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
          >
            <Plus className="w-4 h-4" /> Tambah Barang Baru
          </button>
        </header>

        <div className="px-8 pb-8 space-y-6 flex-1">
          {/* STATS CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#1B1F23] p-5 rounded-2xl border border-border flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center"><Package className="w-6 h-6" /></div>
              <div>
                <p className="text-sm text-slate-400 font-medium">Total Jenis Barang</p>
                <p className="text-2xl font-bold text-white">{totalItems}</p>
              </div>
            </div>
            <div className="bg-[#1B1F23] p-5 rounded-2xl border border-border flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center"><Boxes className="w-6 h-6" /></div>
              <div>
                <p className="text-sm text-slate-400 font-medium">Total Unit Fisik</p>
                <p className="text-2xl font-bold text-white">{totalUnits}</p>
              </div>
            </div>
            <div className="bg-[#1B1F23] p-5 rounded-2xl border border-border flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center"><ArrowDownToLine className="w-6 h-6" /></div>
              <div>
                <p className="text-sm text-slate-400 font-medium">Barang Masuk (Hari Ini)</p>
                <p className="text-2xl font-bold text-white">{itemsInToday}</p>
              </div>
            </div>
            <div className="bg-[#1B1F23] p-5 rounded-2xl border border-red-500/20 flex items-center gap-4">
              <div className="w-12 h-12 bg-red-500/10 text-red-400 rounded-xl flex items-center justify-center"><AlertTriangle className="w-6 h-6" /></div>
              <div>
                <p className="text-sm text-slate-400 font-medium">Stok Menipis</p>
                <p className="text-2xl font-bold text-red-400">{lowStockCount}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* KOLOM KIRI (TABEL) */}
            <div className="lg:col-span-2 bg-[#1B1F23] border border-border rounded-2xl overflow-hidden flex flex-col shadow-sm">
              <div className="p-5 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="font-semibold text-white">Daftar Barang</h3>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Cari SKU / Nama..." 
                      className="pl-9 pr-4 py-2 bg-muted border border-border rounded-lg text-sm w-full sm:w-56 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-200 placeholder-slate-500 transition-all"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <select 
                    className="bg-muted border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 text-slate-200"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#141619] text-slate-400 text-xs uppercase tracking-wider">
                      <th className="px-6 py-4 font-semibold border-b border-border">Barang & SKU</th>
                      <th className="px-6 py-4 font-semibold border-b border-border text-center">Status</th>
                      <th className="px-6 py-4 font-semibold border-b border-border text-center">Stok</th>
                      <th className="px-6 py-4 font-semibold border-b border-border text-center">Aksi Cepat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredProducts.length > 0 ? filteredProducts.map((product) => {
                      const isLowStock = product.stock <= product.minStock;
                      return (
                        <tr key={product.id} className="hover:bg-[#141619]/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-medium text-slate-200">{product.name}</div>
                            <div className="text-xs text-slate-500 mt-0.5">{product.sku} • {product.category}</div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            {isLowStock ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-500/10 text-red-400 rounded-lg text-xs font-semibold border border-red-500/20">
                                <AlertTriangle className="w-3.5 h-3.5" /> Menipis
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 text-emerald-400 rounded-lg text-xs font-semibold border border-emerald-500/20">
                                <TrendingUp className="w-3.5 h-3.5" /> Aman
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex items-baseline justify-center gap-1">
                              <span className={`text-xl font-bold ${isLowStock ? 'text-red-400' : 'text-slate-100'}`}>{product.stock}</span>
                              <span className="text-xs text-slate-500">{product.unit}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button 
                                onClick={() => dispatch({ type: 'REDUCE_STOCK', id: product.id, qty: 1 })}
                                disabled={product.stock === 0}
                                className="w-8 h-8 flex items-center justify-center bg-muted border border-border text-slate-400 hover:bg-accent hover:text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Kurangi 1"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => dispatch({ type: 'ADD_STOCK', id: product.id, qty: 1 })}
                                className="w-8 h-8 flex items-center justify-center bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-600 hover:text-white rounded-lg transition-colors"
                                title="Tambah 1"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    }) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                          Tidak ada data barang ditemukan.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* KOLOM KANAN (LOG) */}
            <div className="bg-[#1B1F23] border border-border rounded-2xl overflow-hidden shadow-sm flex flex-col h-[500px]">
              <div className="p-5 border-b border-border flex items-center gap-2 shrink-0">
                <History className="w-5 h-5 text-slate-400" />
                <h3 className="font-semibold text-white">Log Aktivitas</h3>
              </div>
              <div className="flex-1 overflow-y-auto divide-y divide-border">
                {state.logs.length > 0 ? state.logs.map(log => (
                  <div key={log.id} className="p-4 flex items-center gap-3 hover:bg-[#141619]/50 transition-colors">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      log.type === 'IN' || log.type === 'NEW' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-orange-500/10 text-orange-400'
                    }`}>
                      {log.type === 'IN' || log.type === 'NEW' ? <ArrowDownToLine className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-300 truncate">
                        {log.type === 'NEW' ? 'Barang Baru:' : log.type === 'IN' ? 'Stok Masuk:' : 'Stok Keluar:'} <span className="font-semibold text-white">{log.productName}</span>
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">Oleh {log.user} • {log.timestamp.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                    <div className={`text-sm font-bold ${log.type === 'IN' || log.type === 'NEW' ? 'text-emerald-400' : 'text-orange-400'}`}>
                      {log.type === 'IN' || log.type === 'NEW' ? '+' : '-'}{log.qty}
                    </div>
                  </div>
                )) : (
                  <div className="p-6 text-center text-sm text-slate-500 h-full flex items-center justify-center">Belum ada aktivitas.</div>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* MODAL TAMBAH BARANG (SEDERHANA) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1B1F23] border border-border rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-5 border-b border-border flex items-center justify-between bg-[#141619]">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center"><Package className="w-4 h-4" /></div>
                Tambah Barang Baru
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-accent transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddProduct} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-5 text-slate-200">
                <div className="col-span-2">
                  <label className="block text-[11px] font-bold text-slate-400 mb-2 uppercase tracking-wide">Nama Barang</label>
                  <input required type="text" className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none placeholder-slate-600 transition-colors" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} placeholder="Contoh: Busi Motor NMAX" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-2 uppercase tracking-wide">SKU / Kode</label>
                  <input required type="text" className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none placeholder-slate-600 transition-colors" value={newProduct.sku} onChange={e => setNewProduct({...newProduct, sku: e.target.value})} placeholder="SKU-XXX" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-2 uppercase tracking-wide">Kategori</label>
                  <input required type="text" className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none placeholder-slate-600 transition-colors" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} placeholder="Oli / Busi" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-2 uppercase tracking-wide">Stok Awal</label>
                  <input required type="number" min="0" className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none placeholder-slate-600 transition-colors" value={newProduct.stock || ''} onChange={e => setNewProduct({...newProduct, stock: parseInt(e.target.value) || 0})} />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-2 uppercase tracking-wide">Satuan</label>
                  <input required type="text" className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none placeholder-slate-600 transition-colors" value={newProduct.unit} onChange={e => setNewProduct({...newProduct, unit: e.target.value})} placeholder="pcs, botol" />
                </div>
                <div className="col-span-2">
                  <label className="block text-[11px] font-bold text-slate-400 mb-2 uppercase tracking-wide">Minimal Stok (Peringatan)</label>
                  <input required type="number" min="0" className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none placeholder-slate-600 transition-colors" value={newProduct.minStock || ''} onChange={e => setNewProduct({...newProduct, minStock: parseInt(e.target.value) || 0})} placeholder="Misal: 5" />
                </div>
              </div>
              <div className="pt-6 mt-2 border-t border-border flex justify-end gap-3">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-5 py-2.5 text-sm font-medium text-slate-300 bg-transparent hover:bg-accent rounded-xl transition-colors">Batal</button>
                <button type="submit" className="px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20">Simpan Ke Database</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
