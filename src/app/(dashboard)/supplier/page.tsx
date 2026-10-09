'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useGlobalContext } from '@/context/GlobalContext';
import { Search, Plus, Truck, Edit, Trash2, AlertTriangle, X, Eye, ChevronRight } from 'lucide-react';
import StaggerItem from '@/components/dashboard/StaggerItem';

export default function SupplierPage() {
  const { suppliers, spareparts } = useGlobalContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<any>(null);

  const filteredSuppliers = useMemo(() => {
    let result = suppliers;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(s => s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q) || s.contact.toLowerCase().includes(q));
    }
    if (statusFilter !== 'Semua') {
      result = result.filter(s => s.status === statusFilter);
    }
    return result;
  }, [suppliers, searchQuery, statusFilter]);

  const stats = {
    total: suppliers.length,
    aktif: suppliers.filter(s => s.status === 'Aktif').length,
    tidakAktif: suppliers.filter(s => s.status === 'Tidak Aktif').length,
  };

  return (
    <div className="space-y-6">
      <StaggerItem>
        {/* BREADCRUMB */}
        <div className="flex items-center text-sm text-[#A7ADB4] mb-4">
          <Link href="/dashboard" className="hover:text-white transition-colors">Beranda</Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-[#F5F5F5] font-medium">Supplier</span>
        </div>

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#F5F5F5]">Supplier</h1>
            <p className="text-[#A7ADB4] text-sm mt-1">Kelola data supplier dan hubungan pembelian sparepart.</p>
          </div>
          <button onClick={() => { setEditingData(null); setIsModalOpen(true); }} className="inline-flex items-center gap-2 px-4 py-2 bg-[#E53935] hover:bg-[#D32F2F] text-white font-bold rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(229,57,53,0.25)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#080A1F] focus:ring-[#E53935]">
            <Plus className="w-5 h-5" />
            Tambah Supplier
          </button>
        </div>
      </StaggerItem>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StaggerItem>
          <div className="bg-[#171A1D] border border-[#292D32] rounded-xl p-4 shadow-lg h-full">
            <p className="text-xs font-medium text-[#A7ADB4] mb-1">Total Supplier</p>
            <p className="text-2xl font-black text-white">{stats.total}</p>
          </div>
        </StaggerItem>
        <StaggerItem>
          <div className="bg-[#171A1D] border border-[#292D32] rounded-xl p-4 shadow-lg h-full">
            <p className="text-xs font-medium text-[#A7ADB4] mb-1">Supplier Aktif</p>
            <p className="text-2xl font-black text-[#22C55E]">{stats.aktif}</p>
          </div>
        </StaggerItem>
        <StaggerItem>
          <div className="bg-[#171A1D] border border-[#292D32] rounded-xl p-4 shadow-lg h-full">
            <p className="text-xs font-medium text-[#A7ADB4] mb-1">Supplier Tidak Aktif</p>
            <p className="text-2xl font-black text-[#EF4444]">{stats.tidakAktif}</p>
          </div>
        </StaggerItem>
      </div>

      {/* MAIN CONTENT */}
      <StaggerItem>
        <div className="bg-[#171A1D] border border-[#292D32] rounded-xl shadow-xl overflow-hidden">
          <div className="p-4 border-b border-[#292D32] flex flex-col md:flex-row gap-4 justify-between items-center bg-[#0F1113]">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A7ADB4]" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari kode, nama, atau kontak..." 
                className="w-full pl-9 pr-4 py-2 bg-[#171A1D] text-sm text-[#F5F5F5] border border-[#292D32] rounded-lg focus:outline-none focus:border-[#E53935] focus:ring-1 focus:ring-[#E53935] transition-all"
              />
            </div>
            <div className="flex gap-2 p-1 bg-[#0F1113] border border-[#292D32] rounded-lg">
              {['Semua', 'Aktif', 'Tidak Aktif'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`px-4 py-1.5 text-sm font-bold rounded-md transition-colors ${
                    statusFilter === tab ? 'bg-[#25292D] text-white shadow-sm' : 'text-[#A7ADB4] hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            {filteredSuppliers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Truck className="w-16 h-16 text-[#292D32] mb-4" />
                <p className="text-white font-bold text-lg mb-1">Belum ada data</p>
                <p className="text-[#A7ADB4] text-sm mb-4">Belum ada supplier yang terdaftar atau sesuai pencarian.</p>
                <button onClick={() => { setEditingData(null); setIsModalOpen(true); }} className="px-4 py-2 bg-[#25292D] text-white text-sm rounded-md hover:bg-[#292D32]">+ Tambah Supplier</button>
              </div>
            ) : (
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-[#0F1113] border-b border-[#292D32] text-[#A7ADB4]">
                  <tr>
                    <th className="px-6 py-4 font-bold">KODE</th>
                    <th className="px-6 py-4 font-bold">NAMA SUPPLIER</th>
                    <th className="px-6 py-4 font-bold">KONTAK</th>
                    <th className="px-6 py-4 font-bold">TELEPON</th>
                    <th className="px-6 py-4 font-bold">EMAIL</th>
                    <th className="px-6 py-4 font-bold text-center">ITEM</th>
                    <th className="px-6 py-4 font-bold text-center">STATUS</th>
                    <th className="px-6 py-4 font-bold text-right">AKSI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#292D32]">
                  <AnimatePresence mode="popLayout">
                    {filteredSuppliers.map(sp => {
                      const itemsCount = spareparts.filter(s => s.supplierId === sp.id).length;
                      return (
                        <motion.tr 
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          key={sp.id} 
                          className="hover:bg-[#25292D]/30 transition-colors group"
                        >
                          <td className="px-6 py-4 font-medium text-[#F5F5F5]">{sp.code}</td>
                          <td className="px-6 py-4 font-bold text-white">{sp.name}</td>
                          <td className="px-6 py-4 text-[#A7ADB4]">{sp.contact}</td>
                          <td className="px-6 py-4 text-[#A7ADB4]">{sp.phone}</td>
                          <td className="px-6 py-4 text-[#A7ADB4]">{sp.email}</td>
                          <td className="px-6 py-4 text-center font-bold text-white">{itemsCount}</td>
                          <td className="px-6 py-4 text-center">
                            <span className={`px-2.5 py-1 text-xs font-bold rounded ${sp.status === 'Aktif' ? 'bg-[#22C55E]/10 text-[#22C55E]' : 'bg-[#EF4444]/10 text-[#EF4444]'}`}>
                              {sp.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button className="p-1.5 text-[#A7ADB4] hover:text-white bg-[#25292D] rounded transition-colors" title="Detail"><Eye className="w-4 h-4"/></button>
                              <button onClick={() => { setEditingData(sp); setIsModalOpen(true); }} className="p-1.5 text-[#A7ADB4] hover:text-[#3B82F6] bg-[#25292D] rounded transition-colors" title="Edit"><Edit className="w-4 h-4"/></button>
                              <button onClick={() => { setSelectedId(sp.id); setIsDeleteModalOpen(true); }} className="p-1.5 text-[#A7ADB4] hover:text-[#EF4444] bg-[#25292D] rounded transition-colors" title="Hapus"><Trash2 className="w-4 h-4"/></button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            )}
          </div>
        </div>
      </StaggerItem>

      {/* FORM MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-[#080A1F]/80 backdrop-blur-sm"
              onClick={() => { setIsModalOpen(false); setEditingData(null); }}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", duration: 0.4, bounce: 0 }}
              className="bg-[#171A1D] border border-[#292D32] rounded-xl shadow-2xl w-full max-w-lg overflow-hidden relative z-10"
            >
              <div className="px-6 py-4 border-b border-[#292D32] flex justify-between items-center bg-[#0F1113]">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Truck className="w-5 h-5 text-[#E53935]" />
                  {editingData ? 'Edit Supplier' : 'Tambah Supplier'}
                </h2>
                <button onClick={() => { setIsModalOpen(false); setEditingData(null); }} className="text-[#A7ADB4] hover:text-white transition-colors p-1 hover:bg-[#25292D] rounded-md"><X className="w-5 h-5"/></button>
              </div>
              <form onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); setEditingData(null); alert('Supplier disimpan (demo)'); }} className="p-6">
                <div className="space-y-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-[#A7ADB4] mb-1">Kode Supplier *</label>
                    <input type="text" defaultValue={editingData?.code} required className="w-full bg-[#0F1113] border border-[#292D32] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#E53935] focus:ring-1 focus:ring-[#E53935] transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#A7ADB4] mb-1">Nama Supplier *</label>
                    <input type="text" defaultValue={editingData?.name} required className="w-full bg-[#0F1113] border border-[#292D32] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#E53935] focus:ring-1 focus:ring-[#E53935] transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#A7ADB4] mb-1">Kontak Person *</label>
                    <input type="text" defaultValue={editingData?.contact} required className="w-full bg-[#0F1113] border border-[#292D32] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#E53935] focus:ring-1 focus:ring-[#E53935] transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#A7ADB4] mb-1">Telepon *</label>
                    <input type="text" defaultValue={editingData?.phone} required className="w-full bg-[#0F1113] border border-[#292D32] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#E53935] focus:ring-1 focus:ring-[#E53935] transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#A7ADB4] mb-1">Email *</label>
                    <input type="email" defaultValue={editingData?.email} required className="w-full bg-[#0F1113] border border-[#292D32] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#E53935] focus:ring-1 focus:ring-[#E53935] transition-all" />
                  </div>
                </div>
                <div className="flex gap-3 justify-end pt-4 mt-6 border-t border-[#292D32]">
                  <button type="button" onClick={() => { setIsModalOpen(false); setEditingData(null); }} className="px-4 py-2 text-[#A7ADB4] hover:text-white font-medium transition-colors hover:bg-[#25292D] rounded-lg">Batal</button>
                  <button type="submit" className="px-6 py-2 bg-[#E53935] hover:bg-[#D32F2F] text-white font-bold rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(229,57,53,0.25)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#171A1D] focus:ring-[#E53935]">Simpan Data</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
