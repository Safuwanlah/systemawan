'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useGlobalContext, Sparepart } from '@/context/GlobalContext';
import { Search, Plus, Package, Edit, Trash2, AlertTriangle, X, Eye, ChevronRight } from 'lucide-react';

export default function SparepartPage() {
  const { spareparts, suppliers, addSparepart, updateSparepart, deleteSparepart } = useGlobalContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Semua');
  const [merekFilter, setMerekFilter] = useState('Semua');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<Sparepart | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const categories = ['Semua', ...Array.from(new Set(spareparts.map(s => s.category)))];
  const mereks = ['Semua', ...Array.from(new Set(spareparts.map(s => s.merek)))];

  const filteredSpareparts = useMemo(() => {
    let result = spareparts;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(s => s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q));
    }
    if (categoryFilter !== 'Semua') result = result.filter(s => s.category === categoryFilter);
    if (merekFilter !== 'Semua') result = result.filter(s => s.merek === merekFilter);
    return result;
  }, [spareparts, searchQuery, categoryFilter, merekFilter]);

  const stats = {
    total: spareparts.length,
    categories: new Set(spareparts.map(s => s.category)).size,
    mereks: new Set(spareparts.map(s => s.merek)).size,
    active: spareparts.length // Assuming all are active for now
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      code: formData.get('code') as string,
      name: formData.get('name') as string,
      merek: formData.get('merek') as string,
      category: formData.get('category') as string,
      unit: formData.get('unit') as string,
      hargaBeli: parseInt(formData.get('hargaBeli') as string),
      hargaJual: parseInt(formData.get('hargaJual') as string),
      minStock: parseInt(formData.get('minStock') as string),
      location: formData.get('location') as string,
      supplierId: formData.get('supplierId') as string,
    };

    if (editingData) {
      updateSparepart(editingData.id, data);
    } else {
      addSparepart({ ...data, stock: 0 });
    }
    closeModal();
  };

  const openEditModal = (sp: Sparepart) => {
    setEditingData(sp);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingData(null);
  };

  const confirmDelete = () => {
    if (selectedId) {
      deleteSparepart(selectedId);
      setIsDeleteModalOpen(false);
      setSelectedId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* BREADCRUMB */}
      <div className="flex items-center text-sm text-[#A7ADB4]">
        <Link href="/dashboard" className="hover:text-white transition-colors">Beranda</Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-[#F5F5F5] font-medium">Manajemen Sparepart</span>
      </div>

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#F5F5F5]">Manajemen Sparepart</h1>
          <p className="text-[#A7ADB4] text-sm mt-1">Kelola seluruh master data sparepart yang digunakan dalam inventory bengkel.</p>
        </div>
        <button onClick={() => { setEditingData(null); setIsModalOpen(true); }} className="inline-flex items-center gap-2 px-4 py-2 bg-[#E53935] hover:bg-[#D32F2F] text-white font-bold rounded-lg transition-all shadow-[0_0_15px_rgba(229,57,53,0.3)]">
          <Plus className="w-5 h-5" />
          Tambah Sparepart
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#171A1D] border border-[#292D32] rounded-xl p-4 shadow-lg">
          <p className="text-xs font-medium text-[#A7ADB4] mb-1">Total Sparepart</p>
          <p className="text-2xl font-black text-white">{stats.total}</p>
        </div>
        <div className="bg-[#171A1D] border border-[#292D32] rounded-xl p-4 shadow-lg">
          <p className="text-xs font-medium text-[#A7ADB4] mb-1">Kategori</p>
          <p className="text-2xl font-black text-white">{stats.categories}</p>
        </div>
        <div className="bg-[#171A1D] border border-[#292D32] rounded-xl p-4 shadow-lg">
          <p className="text-xs font-medium text-[#A7ADB4] mb-1">Merek</p>
          <p className="text-2xl font-black text-white">{stats.mereks}</p>
        </div>
        <div className="bg-[#171A1D] border border-[#292D32] rounded-xl p-4 shadow-lg">
          <p className="text-xs font-medium text-[#A7ADB4] mb-1">Sparepart Aktif</p>
          <p className="text-2xl font-black text-[#22C55E]">{stats.active}</p>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="bg-[#171A1D] border border-[#292D32] rounded-xl shadow-xl overflow-hidden">
        <div className="p-4 border-b border-[#292D32] flex flex-col md:flex-row gap-4 justify-between items-center bg-[#0F1113]">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A7ADB4]" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kode atau nama sparepart..." 
              className="w-full pl-9 pr-4 py-2 bg-[#171A1D] text-sm text-[#F5F5F5] border border-[#292D32] rounded-lg focus:outline-none focus:border-[#E53935] transition-colors"
            />
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="bg-[#171A1D] border border-[#292D32] text-[#A7ADB4] text-sm rounded-lg px-3 py-2 outline-none focus:border-[#E53935]">
              {categories.map(c => <option key={c} value={c}>Kategori: {c}</option>)}
            </select>
            <select value={merekFilter} onChange={e => setMerekFilter(e.target.value)} className="bg-[#171A1D] border border-[#292D32] text-[#A7ADB4] text-sm rounded-lg px-3 py-2 outline-none focus:border-[#E53935]">
              {mereks.map(m => <option key={m} value={m}>Merek: {m}</option>)}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          {filteredSpareparts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Package className="w-16 h-16 text-[#292D32] mb-4" />
              <p className="text-white font-bold text-lg mb-1">Belum ada data</p>
              <p className="text-[#A7ADB4] text-sm mb-4">Belum ada sparepart yang terdaftar.</p>
              <button onClick={() => { setEditingData(null); setIsModalOpen(true); }} className="px-4 py-2 bg-[#25292D] text-white text-sm rounded-md hover:bg-[#292D32]">+ Tambah Sparepart</button>
            </div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[#0F1113] border-b border-[#292D32] text-[#A7ADB4]">
                <tr>
                  <th className="px-6 py-4 font-bold">KODE</th>
                  <th className="px-6 py-4 font-bold">NAMA SPAREPART</th>
                  <th className="px-6 py-4 font-bold">MEREK</th>
                  <th className="px-6 py-4 font-bold">KATEGORI</th>
                  <th className="px-6 py-4 font-bold text-right">HARGA BELI</th>
                  <th className="px-6 py-4 font-bold text-right">HARGA JUAL</th>
                  <th className="px-6 py-4 font-bold text-center">STOK MIN</th>
                  <th className="px-6 py-4 font-bold text-center">LOKASI</th>
                  <th className="px-6 py-4 font-bold text-right">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#292D32]">
                {filteredSpareparts.map(sp => (
                  <tr key={sp.id} className="hover:bg-[#25292D]/30 transition-colors group">
                    <td className="px-6 py-4 font-medium text-[#F5F5F5]">{sp.code}</td>
                    <td className="px-6 py-4 font-bold text-white">{sp.name}</td>
                    <td className="px-6 py-4 text-[#A7ADB4]">{sp.merek}</td>
                    <td className="px-6 py-4"><span className="px-2.5 py-1 bg-[#25292D] text-[#A7ADB4] rounded text-xs">{sp.category}</span></td>
                    <td className="px-6 py-4 text-right text-[#A7ADB4]">Rp {sp.hargaBeli.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4 text-right text-[#F5F5F5] font-medium">Rp {sp.hargaJual.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4 text-center text-[#A7ADB4]">{sp.minStock} {sp.unit}</td>
                    <td className="px-6 py-4 text-center text-[#A7ADB4]">{sp.location}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEditModal(sp)} className="p-1.5 text-[#A7ADB4] hover:text-[#3B82F6] bg-[#25292D] rounded transition-colors" title="Edit"><Edit className="w-4 h-4"/></button>
                        <button onClick={() => { setSelectedId(sp.id); setIsDeleteModalOpen(true); }} className="p-1.5 text-[#A7ADB4] hover:text-[#EF4444] bg-[#25292D] rounded transition-colors" title="Hapus"><Trash2 className="w-4 h-4"/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* FORM MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#0F1113]/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#171A1D] border border-[#292D32] rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95">
            <div className="px-6 py-4 border-b border-[#292D32] flex justify-between items-center bg-[#0F1113]">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-[#E53935]" />
                {editingData ? 'Edit Sparepart' : 'Tambah Sparepart Baru'}
              </h2>
              <button onClick={closeModal} className="text-[#A7ADB4] hover:text-white"><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-[#A7ADB4] mb-1">Kode Sparepart *</label>
                  <input type="text" name="code" defaultValue={editingData?.code} required className="w-full bg-[#0F1113] border border-[#292D32] rounded-lg px-4 py-2 text-white focus:border-[#E53935] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#A7ADB4] mb-1">Nama Sparepart *</label>
                  <input type="text" name="name" defaultValue={editingData?.name} required className="w-full bg-[#0F1113] border border-[#292D32] rounded-lg px-4 py-2 text-white focus:border-[#E53935] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#A7ADB4] mb-1">Merek *</label>
                  <input type="text" name="merek" defaultValue={editingData?.merek} required className="w-full bg-[#0F1113] border border-[#292D32] rounded-lg px-4 py-2 text-white focus:border-[#E53935] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#A7ADB4] mb-1">Kategori *</label>
                  <input type="text" name="category" defaultValue={editingData?.category} required className="w-full bg-[#0F1113] border border-[#292D32] rounded-lg px-4 py-2 text-white focus:border-[#E53935] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#A7ADB4] mb-1">Satuan *</label>
                  <input type="text" name="unit" defaultValue={editingData?.unit} required placeholder="pcs, set, botol" className="w-full bg-[#0F1113] border border-[#292D32] rounded-lg px-4 py-2 text-white focus:border-[#E53935] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#A7ADB4] mb-1">Lokasi Rak *</label>
                  <input type="text" name="location" defaultValue={editingData?.location} required className="w-full bg-[#0F1113] border border-[#292D32] rounded-lg px-4 py-2 text-white focus:border-[#E53935] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#A7ADB4] mb-1">Harga Beli *</label>
                  <input type="number" name="hargaBeli" defaultValue={editingData?.hargaBeli} min="0" required className="w-full bg-[#0F1113] border border-[#292D32] rounded-lg px-4 py-2 text-white focus:border-[#E53935] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#A7ADB4] mb-1">Harga Jual *</label>
                  <input type="number" name="hargaJual" defaultValue={editingData?.hargaJual} min="0" required className="w-full bg-[#0F1113] border border-[#292D32] rounded-lg px-4 py-2 text-white focus:border-[#E53935] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#A7ADB4] mb-1">Stok Minimum *</label>
                  <input type="number" name="minStock" defaultValue={editingData?.minStock} min="1" required className="w-full bg-[#0F1113] border border-[#292D32] rounded-lg px-4 py-2 text-white focus:border-[#E53935] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#A7ADB4] mb-1">Supplier Utama *</label>
                  <select name="supplierId" defaultValue={editingData?.supplierId || ""} required className="w-full bg-[#0F1113] border border-[#292D32] rounded-lg px-4 py-2 text-white focus:border-[#E53935] outline-none">
                    <option value="" disabled>Pilih Supplier...</option>
                    {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 justify-end pt-4 mt-6 border-t border-[#292D32]">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-[#A7ADB4] hover:text-white font-medium">Batal</button>
                <button type="submit" className="px-6 py-2 bg-[#E53935] hover:bg-[#D32F2F] text-white font-bold rounded-lg transition-colors shadow-lg shadow-[#E53935]/20">Simpan Data</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-[#0F1113]/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#171A1D] border border-[#292D32] rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-[#EF4444]/10 border border-[#EF4444]/20 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-[#EF4444]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Hapus Sparepart?</h3>
            <p className="text-[#A7ADB4] mb-6">Apakah Anda yakin ingin menghapus data sparepart ini? Tindakan ini tidak dapat dibatalkan.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setIsDeleteModalOpen(false)} className="px-6 py-2 bg-[#25292D] text-white rounded-lg hover:bg-[#292D32] font-medium transition-colors">Batal</button>
              <button onClick={confirmDelete} className="px-6 py-2 bg-[#EF4444] text-white rounded-lg hover:bg-[#DC2626] font-bold transition-colors">Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
