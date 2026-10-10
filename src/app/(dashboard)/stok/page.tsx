'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useGlobalContext } from '@/context/GlobalContext';
import { Search, ChevronRight, Package, ArrowDownRight, X, AlertTriangle } from 'lucide-react';

export default function StokPage() {
  const { spareparts, addStockIn } = useGlobalContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSparepartId, setSelectedSparepartId] = useState<string | null>(null);

  const filteredSpareparts = useMemo(() => {
    let result = spareparts;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(s => s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q));
    }
    if (statusFilter !== 'Semua') {
      result = result.filter(s => s.status === statusFilter.toUpperCase());
    }
    return result;
  }, [spareparts, searchQuery, statusFilter]);

  const stats = {
    total: spareparts.length,
    aman: spareparts.filter(s => s.status === 'AMAN').length,
    menipis: spareparts.filter(s => s.status === 'MENIPIS').length,
    kosong: spareparts.filter(s => s.status === 'KOSONG').length,
  };

  const handleRestock = (id: string) => {
    setSelectedSparepartId(id);
    setIsModalOpen(true);
  };

  const submitRestock = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    addStockIn({
      date: formData.get('date') as string,
      sparepartId: formData.get('sparepartId') as string,
      quantity: parseInt(formData.get('quantity') as string),
      supplierId: formData.get('supplierId') as string,
      harga: 0,
      reference: formData.get('reference') as string,
      keterangan: 'Restock otomatis',
      officer: 'Admin',
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex items-center text-sm text-muted-foreground">
        <Link href="/dashboard" className="hover:text-white transition-colors">Beranda</Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-foreground font-medium">Monitoring Stok</span>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-foreground">Monitoring Stok</h1>
        <p className="text-muted-foreground text-sm mt-1">Pantau kondisi stok sparepart secara cepat dan terstruktur.</p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4 shadow-lg cursor-pointer hover:border-[#3B82F6]/50 transition-colors" onClick={() => setStatusFilter('Semua')}>
          <p className="text-xs font-medium text-muted-foreground mb-1">Total Stok Item</p>
          <p className="text-2xl font-black text-white">{stats.total}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 shadow-lg cursor-pointer hover:border-[#22C55E]/50 transition-colors" onClick={() => setStatusFilter('Aman')}>
          <p className="text-xs font-medium text-muted-foreground mb-1">Stok Aman</p>
          <p className="text-2xl font-black text-[#22C55E]">{stats.aman}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 shadow-lg cursor-pointer hover:border-[#F59E0B]/50 transition-colors" onClick={() => setStatusFilter('Menipis')}>
          <p className="text-xs font-medium text-muted-foreground mb-1">Stok Menipis</p>
          <p className="text-2xl font-black text-[#F59E0B]">{stats.menipis}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 shadow-lg cursor-pointer hover:border-[#EF4444]/50 transition-colors" onClick={() => setStatusFilter('Kosong')}>
          <p className="text-xs font-medium text-muted-foreground mb-1">Stok Kosong</p>
          <p className="text-2xl font-black text-[#EF4444]">{stats.kosong}</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-xl overflow-hidden">
        <div className="p-4 border-b border-border flex flex-col md:flex-row gap-4 justify-between items-center bg-muted">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kode atau nama sparepart..." 
              className="w-full pl-9 pr-4 py-2 bg-card text-sm text-foreground border border-border rounded-lg focus:outline-none focus:border-[#E53935]"
            />
          </div>
          <div className="flex gap-2 p-1 bg-muted border border-border rounded-lg">
            {['Semua', 'Aman', 'Menipis', 'Kosong'].map(tab => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-4 py-1.5 text-sm font-bold rounded-md transition-colors ${
                  statusFilter === tab ? 'bg-accent text-white shadow-sm' : 'text-muted-foreground hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          {filteredSpareparts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Package className="w-16 h-16 text-[#292D32] mb-4" />
              <p className="text-white font-bold text-lg mb-1">Tidak ada data</p>
              <p className="text-muted-foreground text-sm mb-4">Sparepart dengan filter tersebut tidak ditemukan.</p>
            </div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-muted border-b border-border text-muted-foreground">
                <tr>
                  <th className="px-6 py-4 font-bold">KODE</th>
                  <th className="px-6 py-4 font-bold">SPAREPART</th>
                  <th className="px-6 py-4 font-bold">KATEGORI</th>
                  <th className="px-6 py-4 font-bold text-center">STOK SAAT INI</th>
                  <th className="px-6 py-4 font-bold text-center">STOK MINIMUM</th>
                  <th className="px-6 py-4 font-bold text-center">STATUS</th>
                  <th className="px-6 py-4 font-bold text-right">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#292D32]">
                {filteredSpareparts.map(sp => (
                  <tr key={sp.id} className="hover:bg-accent/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">{sp.code}</td>
                    <td className="px-6 py-4 font-bold text-white">{sp.name}</td>
                    <td className="px-6 py-4 text-muted-foreground">{sp.category}</td>
                    <td className="px-6 py-4 text-center font-black text-white">{sp.stock} <span className="text-xs text-muted-foreground font-normal">{sp.unit}</span></td>
                    <td className="px-6 py-4 text-center text-muted-foreground">{sp.minStock}</td>
                    <td className="px-6 py-4 text-center">
                      {sp.status === 'KOSONG' && <span className="px-2 py-1 bg-[#EF4444]/10 text-[#EF4444] rounded text-xs font-bold border border-[#EF4444]/20">KOSONG</span>}
                      {sp.status === 'MENIPIS' && <span className="px-2 py-1 bg-[#F59E0B]/10 text-[#F59E0B] rounded text-xs font-bold border border-[#F59E0B]/20">MENIPIS</span>}
                      {sp.status === 'AMAN' && <span className="px-2 py-1 bg-[#22C55E]/10 text-[#22C55E] rounded text-xs font-bold border border-[#22C55E]/20">AMAN</span>}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleRestock(sp.id)}
                        className="px-4 py-1.5 bg-[#E53935]/10 text-[#E53935] hover:bg-[#E53935]/20 font-bold text-xs rounded transition-colors border border-[#E53935]/20"
                      >
                        Restock
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-muted/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95">
            <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-muted">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <ArrowDownRight className="w-5 h-5 text-[#22C55E]" />
                Form Stok Masuk (Restock)
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-white"><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={submitRestock} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Sparepart *</label>
                <select name="sparepartId" defaultValue={selectedSparepartId || ""} required className="w-full bg-muted border border-border rounded-lg px-4 py-2.5 text-white focus:border-[#E53935] outline-none">
                  <option value="" disabled>Pilih Sparepart...</option>
                  {spareparts.map(s => <option key={s.id} value={s.id}>{s.code} - {s.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Jumlah Masuk *</label>
                  <input type="number" name="quantity" min="1" required className="w-full bg-muted border border-border rounded-lg px-4 py-2.5 text-white focus:border-[#E53935] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Tanggal *</label>
                  <input type="date" name="date" defaultValue={new Date().toISOString().split('T')[0]} required className="w-full bg-muted border border-border rounded-lg px-4 py-2.5 text-white focus:border-[#E53935] outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">No. Referensi (PO/Faktur)</label>
                <input type="text" name="reference" placeholder="Opsional" className="w-full bg-muted border border-border rounded-lg px-4 py-2.5 text-white focus:border-[#E53935] outline-none" />
              </div>
              <div className="flex gap-3 justify-end pt-4 mt-6 border-t border-border">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-muted-foreground hover:text-white font-medium">Batal</button>
                <button type="submit" className="px-6 py-2 bg-[#E53935] hover:bg-[#D32F2F] text-white font-bold rounded-lg transition-colors shadow-lg shadow-[#E53935]/20">Simpan Stok Masuk</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
