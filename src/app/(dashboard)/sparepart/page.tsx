'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useGlobalContext, Sparepart } from '@/context/GlobalContext';
import { Search, Plus, Package, Edit, Trash2, AlertTriangle, X, Eye, ChevronRight } from 'lucide-react';
import StaggerItem from '@/components/dashboard/StaggerItem';

export default function SparepartPage() {
  const { spareparts, suppliers, addSparepart, updateSparepart, deleteSparepart } = useGlobalContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Semua');
  const [merekFilter, setMerekFilter] = useState('Semua');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<Sparepart | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

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
    
    const code = editingData ? editingData.code : (formData.get('code') as string || `SPR-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`);
    
    const data = {
      code,
      name: formData.get('name') as string,
      merek: (formData.get('merek') as string) || '-',
      category: formData.get('category') as string,
      unit: (formData.get('unit') as string) || 'pcs',
      hargaBeli: parseInt(formData.get('hargaBeli') as string) || 0,
      hargaJual: parseInt(formData.get('hargaJual') as string) || 0,
      minStock: parseInt(formData.get('minStock') as string) || 5,
      location: (formData.get('location') as string) || '-',
      supplierId: (formData.get('supplierId') as string) || null,
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
    setShowAdvanced(false);
  };

  const confirmDelete = () => {
    if (selectedId) {
      deleteSparepart(selectedId);
      setIsDeleteModalOpen(false);
      setSelectedId(null);
      setNotification('Sparepart berhasil dihapus!');
      setTimeout(() => setNotification(null), 3000);
    }
  };

  return (
    <div className="space-y-6">
      <StaggerItem>
        {/* BREADCRUMB */}
        <div className="flex items-center text-sm text-muted-foreground mb-4">
          <Link href="/dashboard" className="hover:text-white transition-colors">Beranda</Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-foreground font-medium">Manajemen Sparepart</span>
        </div>

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Manajemen Sparepart</h1>
            <p className="text-muted-foreground text-sm mt-1">Kelola seluruh master data sparepart yang digunakan dalam inventory bengkel.</p>
          </div>
          <button onClick={() => { setEditingData(null); setIsModalOpen(true); }} className="inline-flex items-center gap-2 px-4 py-2 bg-[#E53935] hover:bg-[#D32F2F] text-white font-bold rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(229,57,53,0.25)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#080A1F] focus:ring-[#E53935]">
            <Plus className="w-5 h-5" />
            Tambah Sparepart
          </button>
        </div>
      </StaggerItem>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StaggerItem>
          <div className="bg-card border border-border rounded-xl p-4 shadow-lg h-full">
            <p className="text-xs font-medium text-muted-foreground mb-1">Total Sparepart</p>
            <p className="text-2xl font-black text-white">{stats.total}</p>
          </div>
        </StaggerItem>
        <StaggerItem>
          <div className="bg-card border border-border rounded-xl p-4 shadow-lg h-full">
            <p className="text-xs font-medium text-muted-foreground mb-1">Kategori</p>
            <p className="text-2xl font-black text-white">{stats.categories}</p>
          </div>
        </StaggerItem>
        <StaggerItem>
          <div className="bg-card border border-border rounded-xl p-4 shadow-lg h-full">
            <p className="text-xs font-medium text-muted-foreground mb-1">Merek</p>
            <p className="text-2xl font-black text-white">{stats.mereks}</p>
          </div>
        </StaggerItem>
        <StaggerItem>
          <div className="bg-card border border-border rounded-xl p-4 shadow-lg h-full">
            <p className="text-xs font-medium text-muted-foreground mb-1">Sparepart Aktif</p>
            <p className="text-2xl font-black text-[#22C55E]">{stats.active}</p>
          </div>
        </StaggerItem>
      </div>

      {/* MAIN CONTENT */}
      <StaggerItem>
        <div className="bg-card border border-border rounded-xl shadow-xl overflow-hidden">
          <div className="p-4 border-b border-border flex flex-col md:flex-row gap-4 justify-between items-center bg-muted">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari kode atau nama sparepart..." 
                className="w-full pl-9 pr-4 py-2 bg-card text-sm text-foreground border border-border rounded-lg focus:outline-none focus:border-[#E53935] focus:ring-1 focus:ring-[#E53935] transition-all"
              />
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="bg-card border border-border text-muted-foreground text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#E53935] focus:ring-1 focus:ring-[#E53935] transition-all">
                {categories.map(c => <option key={c} value={c}>Kategori: {c}</option>)}
              </select>
              <select value={merekFilter} onChange={e => setMerekFilter(e.target.value)} className="bg-card border border-border text-muted-foreground text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#E53935] focus:ring-1 focus:ring-[#E53935] transition-all">
                {mereks.map(m => <option key={m} value={m}>Merek: {m}</option>)}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            {filteredSpareparts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Package className="w-16 h-16 text-[#292D32] mb-4" />
                <p className="text-white font-bold text-lg mb-1">Belum ada data</p>
                <p className="text-muted-foreground text-sm mb-4">Belum ada sparepart yang terdaftar.</p>
                <button onClick={() => { setEditingData(null); setIsModalOpen(true); }} className="px-4 py-2 bg-accent text-white text-sm rounded-md hover:bg-accent">+ Tambah Sparepart</button>
              </div>
            ) : (
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-muted border-b border-border text-muted-foreground">
                  <tr>
                    <th className="px-6 py-4 font-bold">NAMA SPAREPART</th>
                    <th className="px-6 py-4 font-bold">MEREK</th>
                    <th className="px-6 py-4 font-bold text-right">HARGA BELI</th>
                    <th className="px-6 py-4 font-bold text-right">HARGA JUAL</th>
                    <th className="px-6 py-4 font-bold text-center">STOK MIN</th>
                    <th className="px-6 py-4 font-bold text-right">AKSI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#292D32]">
                  <AnimatePresence mode="popLayout">
                    {filteredSpareparts.map(sp => (
                      <motion.tr 
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        key={sp.id} 
                        className="hover:bg-accent/30 transition-colors group"
                      >
                        <td className="px-6 py-4 font-bold text-white">{sp.name}</td>
                        <td className="px-6 py-4 text-muted-foreground">{sp.merek}</td>
                        <td className="px-6 py-4 text-right text-muted-foreground">Rp {sp.hargaBeli.toLocaleString('id-ID')}</td>
                        <td className="px-6 py-4 text-right text-foreground font-medium">Rp {sp.hargaJual.toLocaleString('id-ID')}</td>
                        <td className="px-6 py-4 text-center text-muted-foreground">{sp.minStock} {sp.unit}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => openEditModal(sp)} className="p-1.5 text-muted-foreground hover:text-[#3B82F6] bg-accent rounded transition-colors" title="Edit"><Edit className="w-4 h-4"/></button>
                            <button onClick={() => { setSelectedId(sp.id); setIsDeleteModalOpen(true); }} className="p-1.5 text-muted-foreground hover:text-[#EF4444] bg-accent rounded transition-colors" title="Hapus"><Trash2 className="w-4 h-4"/></button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
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
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={closeModal}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", duration: 0.4, bounce: 0 }}
              className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden relative z-10"
            >
              <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-muted">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#E53935]" />
                  {editingData ? 'Edit Sparepart' : 'Tambah Sparepart Baru'}
                </h2>
                <button onClick={closeModal} className="text-muted-foreground hover:text-white transition-colors p-1 hover:bg-accent rounded-md"><X className="w-5 h-5"/></button>
              </div>
              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Nama Sparepart *</label>
                    <input type="text" name="name" defaultValue={editingData?.name} required className="w-full bg-muted border border-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#E53935] focus:ring-1 focus:ring-[#E53935] transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Kategori *</label>
                    <input type="text" name="category" defaultValue={editingData?.category} required className="w-full bg-muted border border-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#E53935] focus:ring-1 focus:ring-[#E53935] transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Harga Beli *</label>
                    <input type="number" name="hargaBeli" defaultValue={editingData?.hargaBeli} min="0" required className="w-full bg-muted border border-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#E53935] focus:ring-1 focus:ring-[#E53935] transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Harga Jual *</label>
                    <input type="number" name="hargaJual" defaultValue={editingData?.hargaJual} min="0" required className="w-full bg-muted border border-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#E53935] focus:ring-1 focus:ring-[#E53935] transition-all" />
                  </div>
                </div>

                <div className="mb-4">
                  <button type="button" onClick={() => setShowAdvanced(!showAdvanced)} className="text-sm text-[#E53935] hover:text-[#D32F2F] font-medium transition-colors flex items-center gap-1">
                    {showAdvanced ? 'Sembunyikan Opsi Lanjutan' : 'Tampilkan Opsi Lanjutan'}
                    <ChevronRight className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-90' : ''}`} />
                  </button>
                </div>

                <AnimatePresence>
                  {showAdvanced && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pt-2 border-t border-border">
                        {editingData && (
                          <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1">Kode Sparepart (Auto)</label>
                            <input type="text" name="code" defaultValue={editingData.code} readOnly className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2 text-muted-foreground cursor-not-allowed" />
                          </div>
                        )}
                        <div>
                          <label className="block text-sm font-medium text-muted-foreground mb-1">Merek</label>
                          <input type="text" name="merek" defaultValue={editingData?.merek} placeholder="-" className="w-full bg-muted border border-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#E53935] focus:ring-1 focus:ring-[#E53935] transition-all" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-muted-foreground mb-1">Satuan</label>
                          <input type="text" name="unit" defaultValue={editingData?.unit || 'pcs'} className="w-full bg-muted border border-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#E53935] focus:ring-1 focus:ring-[#E53935] transition-all" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-muted-foreground mb-1">Lokasi Rak</label>
                          <input type="text" name="location" defaultValue={editingData?.location} placeholder="-" className="w-full bg-muted border border-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#E53935] focus:ring-1 focus:ring-[#E53935] transition-all" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-muted-foreground mb-1">Stok Minimum</label>
                          <input type="number" name="minStock" defaultValue={editingData?.minStock || 5} min="1" className="w-full bg-muted border border-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#E53935] focus:ring-1 focus:ring-[#E53935] transition-all" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-muted-foreground mb-1">Supplier Utama</label>
                          <select name="supplierId" defaultValue={editingData?.supplierId || ""} className="w-full bg-muted border border-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#E53935] focus:ring-1 focus:ring-[#E53935] transition-all">
                            <option value="">Pilih Supplier... (Opsional)</option>
                            {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                          </select>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="flex gap-3 justify-end pt-4 mt-6 border-t border-border">
                  <button type="button" onClick={closeModal} className="px-4 py-2 text-muted-foreground hover:text-white font-medium transition-colors hover:bg-accent rounded-lg">Batal</button>
                  <button type="submit" className="px-6 py-2 bg-[#E53935] hover:bg-[#D32F2F] text-white font-bold rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(229,57,53,0.25)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#171A1D] focus:ring-[#E53935]">Simpan Data</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setIsDeleteModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", duration: 0.4, bounce: 0 }}
              className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-md overflow-hidden p-6 text-center relative z-10"
            >
              <div className="w-16 h-16 rounded-full bg-[#EF4444]/10 border border-[#EF4444]/20 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-[#EF4444]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Hapus Sparepart?</h3>
              <p className="text-muted-foreground mb-6">Apakah Anda yakin ingin menghapus data sparepart ini? Tindakan ini tidak dapat dibatalkan.</p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => setIsDeleteModalOpen(false)} className="px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent font-medium transition-colors">Batal</button>
                <button onClick={confirmDelete} className="px-6 py-2 bg-[#EF4444] text-white rounded-lg hover:bg-[#DC2626] font-bold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#171A1D] focus:ring-[#EF4444]">Ya, Hapus</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* NOTIFICATION TOAST */}
      {notification && (
        <div className="fixed bottom-6 right-6 bg-[#22C55E] text-white px-6 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-in slide-in-from-bottom-5 fade-in duration-300 z-[200]">
          <div className="bg-white/20 p-1.5 rounded-full">
            <Trash2 className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold">{notification}</span>
          <button onClick={() => setNotification(null)} className="ml-2 hover:bg-white/20 p-1 rounded-full transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
