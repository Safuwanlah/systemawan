'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useGlobalContext } from '@/context/GlobalContext';
import { Plus, ArrowUpRight, ArrowDownRight, Package, AlertTriangle, XCircle, CheckCircle2 } from 'lucide-react';

export default function InventoryLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { spareparts, toast } = useGlobalContext();

  const stats = {
    total: spareparts.length,
    inStock: spareparts.filter(s => s.stock > s.minStock).length,
    lowStock: spareparts.filter(s => s.stock > 0 && s.stock <= s.minStock).length,
    empty: spareparts.filter(s => s.stock === 0).length,
  };

  const tabs = [
    { name: 'Semua Sparepart', path: '/inventory' },
    { name: 'Stok Masuk', path: '/inventory/masuk' },
    { name: 'Stok Keluar', path: '/inventory/keluar' },
    { name: 'Stok Minimum', path: '/inventory/minimum' },
    { name: 'Stok Opname', path: '/inventory/opname' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 relative">
      {/* HEADER & STATS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#F5F5F5]">Inventory Sparepart</h1>
          <p className="text-[#A7ADB4] mt-1 text-sm md:text-base">Kelola, pantau, dan kontrol seluruh stok sparepart bengkel.</p>
        </div>
        <Link href="/sparepart" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#E53935] hover:bg-[#D32F2F] text-white font-bold rounded-lg transition-all shadow-[0_0_15px_rgba(229,57,53,0.3)]">
          <Plus className="w-5 h-5" />
          Tambah Sparepart
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#171A1D] border border-[#292D32] rounded-xl p-5 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1.5 h-full bg-[#3B82F6]"></div>
          <p className="text-sm font-medium text-[#A7ADB4] mb-1">Total Sparepart</p>
          <p className="text-3xl font-black text-[#F5F5F5]">{stats.total}</p>
          <p className="text-xs text-[#3B82F6] font-medium mt-2 flex items-center gap-1"><ArrowUpRight className="w-3 h-3"/> {stats.total} item terdaftar</p>
        </div>
        <div className="bg-[#171A1D] border border-[#292D32] rounded-xl p-5 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1.5 h-full bg-[#22C55E]"></div>
          <p className="text-sm font-medium text-[#A7ADB4] mb-1">Stok Tersedia</p>
          <p className="text-3xl font-black text-[#F5F5F5]">{stats.inStock}</p>
          <p className="text-xs text-[#22C55E] font-medium mt-2 flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> {Math.round((stats.inStock/stats.total)*100 || 0)}% dari total</p>
        </div>
        <div className="bg-[#171A1D] border border-[#292D32] rounded-xl p-5 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1.5 h-full bg-[#FF9800]"></div>
          <p className="text-sm font-medium text-[#A7ADB4] mb-1">Stok Menipis</p>
          <p className="text-3xl font-black text-[#F5F5F5]">{stats.lowStock}</p>
          <p className="text-xs text-[#FF9800] font-medium mt-2 flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> Perlu diperiksa</p>
        </div>
        
        <Link href="/inventory?status=Kosong" className="bg-[#171A1D] border border-[#292D32] rounded-xl p-5 shadow-lg relative overflow-hidden hover:border-[#EF4444]/50 transition-colors cursor-pointer group">
          <div className="absolute top-0 right-0 w-1.5 h-full bg-[#EF4444]"></div>
          <p className="text-sm font-medium text-[#A7ADB4] mb-1 group-hover:text-[#F5F5F5] transition-colors">Stok Kosong</p>
          <p className="text-3xl font-black text-[#F5F5F5]">{stats.empty}</p>
          <p className="text-xs text-[#EF4444] font-medium mt-2 flex items-center gap-1"><XCircle className="w-3 h-3"/> Klik untuk melihat</p>
        </Link>
      </div>

      <div className="border-b border-[#292D32]">
        <div className="flex space-x-8 overflow-x-auto hide-scrollbar">
          {tabs.map(tab => {
            const isActive = pathname === tab.path;
            return (
              <Link
                key={tab.path}
                href={tab.path}
                className={`pb-4 text-sm font-bold transition-colors relative whitespace-nowrap ${
                  isActive ? 'text-[#E53935]' : 'text-[#A7ADB4] hover:text-[#F5F5F5]'
                }`}
              >
                {tab.name}
                {isActive && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#E53935] shadow-[0_0_8px_rgba(229,57,53,0.6)]"></div>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="bg-[#171A1D] border border-[#292D32] rounded-xl shadow-xl overflow-hidden min-h-[400px]">
        {children}
      </div>

      {toast && (
        <div className={`fixed bottom-8 right-8 z-[200] flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl animate-in slide-in-from-bottom-8 ${
          toast.type === 'success' ? 'bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] backdrop-blur-md' : 'bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] backdrop-blur-md'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
          <p className="font-bold">{toast.message}</p>
        </div>
      )}
    </div>
  );
}
