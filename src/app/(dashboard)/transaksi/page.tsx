'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useGlobalContext } from '@/context/GlobalContext';
import { Search, ChevronRight, ArrowDownRight, ArrowUpRight, FileText, X } from 'lucide-react';
import StaggerItem from '@/components/dashboard/StaggerItem';

export default function TransaksiPage() {
  const { transactions, spareparts, addStockIn, addStockOut } = useGlobalContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [tabFilter, setTabFilter] = useState('Semua');

  const [isMasukOpen, setIsMasukOpen] = useState(false);
  const [isKeluarOpen, setIsKeluarOpen] = useState(false);

  const filteredTransactions = useMemo(() => {
    let result = transactions;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(t => 
        t.nomorTransaksi.toLowerCase().includes(q) || 
        spareparts.find(s => s.id === t.sparepartId)?.name.toLowerCase().includes(q)
      );
    }
    if (tabFilter !== 'Semua') {
      result = result.filter(t => t.type === tabFilter.toUpperCase().replace('BARANG ', ''));
    }
    return result;
  }, [transactions, searchQuery, tabFilter, spareparts]);

  const stats = {
    today: transactions.filter(t => t.date.startsWith(new Date().toISOString().split('T')[0])).length,
    masuk: transactions.filter(t => t.type === 'MASUK').length,
    keluar: transactions.filter(t => t.type === 'KELUAR').length,
    nilai: transactions.reduce((acc, t) => acc + t.harga, 0),
  };

  const handleMasukSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const sp = spareparts.find(s => s.id === formData.get('sparepartId'));
    addStockIn({
      date: formData.get('date') as string,
      sparepartId: formData.get('sparepartId') as string,
      quantity: parseInt(formData.get('quantity') as string),
      harga: parseInt(formData.get('harga') as string) || (sp?.hargaBeli || 0) * parseInt(formData.get('quantity') as string),
      supplierId: formData.get('supplierId') as string,
      reference: formData.get('reference') as string,
      officer: formData.get('officer') as string,
      keterangan: formData.get('keterangan') as string,
    });
    setIsMasukOpen(false);
  };

  const handleKeluarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const sp = spareparts.find(s => s.id === formData.get('sparepartId'));
    const success = addStockOut({
      date: formData.get('date') as string,
      sparepartId: formData.get('sparepartId') as string,
      quantity: parseInt(formData.get('quantity') as string),
      harga: (sp?.hargaJual || 0) * parseInt(formData.get('quantity') as string),
      keperluan: formData.get('keperluan') as string,
      reference: formData.get('reference') as string,
      officer: formData.get('officer') as string,
      keterangan: formData.get('keterangan') as string,
    });
    if (success) setIsKeluarOpen(false);
  };

  return (
    <div className="space-y-6">
      <StaggerItem>
        <div className="flex items-center text-sm text-[#A7ADB4] mb-4">
          <Link href="/dashboard" className="hover:text-white transition-colors">Beranda</Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-[#F5F5F5] font-medium">Transaksi Inventory</span>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#F5F5F5]">Transaksi Inventory</h1>
            <p className="text-[#A7ADB4] text-sm mt-1">Kelola dan pantau seluruh transaksi barang masuk dan keluar.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setIsKeluarOpen(true)} className="inline-flex items-center gap-2 px-4 py-2 bg-[#171A1D] hover:bg-[#25292D] text-[#EF4444] font-bold rounded-lg border border-[#292D32] transition-colors">
              <ArrowUpRight className="w-4 h-4" />
              Barang Keluar
            </button>
            <button onClick={() => setIsMasukOpen(true)} className="inline-flex items-center gap-2 px-4 py-2 bg-[#E53935] hover:bg-[#D32F2F] text-white font-bold rounded-lg transition-all shadow-[0_0_15px_rgba(229,57,53,0.3)]">
              <ArrowDownRight className="w-4 h-4" />
              Barang Masuk
            </button>
          </div>
        </div>
      </StaggerItem>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StaggerItem>
          <div className="bg-[#171A1D] border border-[#292D32] rounded-xl p-4 shadow-lg h-full">
            <p className="text-xs font-medium text-[#A7ADB4] mb-1">Transaksi Hari Ini</p>
            <p className="text-2xl font-black text-white">{stats.today}</p>
          </div>
        </StaggerItem>
        <StaggerItem>
          <div className="bg-[#171A1D] border border-[#292D32] rounded-xl p-4 shadow-lg h-full">
            <p className="text-xs font-medium text-[#A7ADB4] mb-1">Total Barang Masuk</p>
            <p className="text-2xl font-black text-[#22C55E]">{stats.masuk}</p>
          </div>
        </StaggerItem>
        <StaggerItem>
          <div className="bg-[#171A1D] border border-[#292D32] rounded-xl p-4 shadow-lg h-full">
            <p className="text-xs font-medium text-[#A7ADB4] mb-1">Total Barang Keluar</p>
            <p className="text-2xl font-black text-[#EF4444]">{stats.keluar}</p>
          </div>
        </StaggerItem>
        <StaggerItem>
          <div className="bg-[#171A1D] border border-[#292D32] rounded-xl p-4 shadow-lg h-full">
            <p className="text-xs font-medium text-[#A7ADB4] mb-1">Total Nilai Transaksi</p>
            <p className="text-2xl font-black text-white">Rp {stats.nilai.toLocaleString('id-ID')}</p>
          </div>
        </StaggerItem>
      </div>

      <StaggerItem>
        <div className="bg-[#171A1D] border border-[#292D32] rounded-xl shadow-xl overflow-hidden">
          <div className="p-4 border-b border-[#292D32] flex flex-col md:flex-row gap-4 justify-between items-center bg-[#0F1113]">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A7ADB4]" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari transaksi..." 
                className="w-full pl-9 pr-4 py-2 bg-[#171A1D] text-sm text-[#F5F5F5] border border-[#292D32] rounded-lg focus:outline-none focus:border-[#E53935]"
              />
            </div>
            <div className="flex gap-2 p-1 bg-[#0F1113] border border-[#292D32] rounded-lg">
              {['Semua', 'Barang Masuk', 'Barang Keluar'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setTabFilter(tab)}
                  className={`px-4 py-1.5 text-sm font-bold rounded-md transition-colors ${
                    tabFilter === tab ? 'bg-[#25292D] text-white shadow-sm' : 'text-[#A7ADB4] hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            {filteredTransactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <FileText className="w-16 h-16 text-[#292D32] mb-4" />
                <p className="text-white font-bold text-lg mb-1">Belum ada transaksi</p>
                <p className="text-[#A7ADB4] text-sm mb-4">Mulai kelola stok dengan mencatat barang masuk atau keluar.</p>
                <div className="flex gap-2">
                  <button onClick={() => setIsMasukOpen(true)} className="px-4 py-2 bg-[#E53935] text-white text-sm font-bold rounded-md hover:bg-[#D32F2F]">+ Barang Masuk</button>
                </div>
              </div>
            ) : (
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-[#0F1113] border-b border-[#292D32] text-[#A7ADB4]">
                  <tr>
                    <th className="px-6 py-4 font-bold">TANGGAL</th>
                    <th className="px-6 py-4 font-bold">NO. TRX</th>
                    <th className="px-6 py-4 font-bold">SPAREPART</th>
                    <th className="px-6 py-4 font-bold">JENIS</th>
                    <th className="px-6 py-4 font-bold">JUMLAH</th>
                    <th className="px-6 py-4 font-bold text-right">NILAI</th>
                    <th className="px-6 py-4 font-bold">PETUGAS</th>
                    <th className="px-6 py-4 font-bold">KETERANGAN</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#292D32]">
                  {filteredTransactions.map(tx => {
                    const sp = spareparts.find(s => s.id === tx.sparepartId);
                    const isMasuk = tx.type === 'MASUK';
                    return (
                      <tr key={tx.id} className="hover:bg-[#25292D]/30 transition-colors">
                        <td className="px-6 py-4 text-[#A7ADB4]">{tx.date}</td>
                        <td className="px-6 py-4 font-medium text-white">{tx.nomorTransaksi}</td>
                        <td className="px-6 py-4 font-bold text-white">{sp?.name || 'Unknown'}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 text-xs font-bold rounded border ${isMasuk ? 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20' : 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20'}`}>
                            {tx.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-black text-white">{isMasuk ? '+' : '-'}{tx.quantity}</td>
                        <td className="px-6 py-4 text-right font-medium text-[#A7ADB4]">Rp {tx.harga.toLocaleString('id-ID')}</td>
                        <td className="px-6 py-4 text-[#A7ADB4]">{tx.officer}</td>
                        <td className="px-6 py-4 text-[#A7ADB4] max-w-[200px] truncate">{tx.keterangan || '-'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </StaggerItem>

      {/* FORM BARANG MASUK */}
      {isMasukOpen && (
        <div className="fixed inset-0 bg-[#0F1113]/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#171A1D] border border-[#292D32] rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95">
            <div className="px-6 py-4 border-b border-[#292D32] flex justify-between items-center bg-[#0F1113]">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <ArrowDownRight className="w-5 h-5 text-[#22C55E]" />
                Form Barang Masuk
              </h2>
              <button onClick={() => setIsMasukOpen(false)} className="text-[#A7ADB4] hover:text-white"><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handleMasukSubmit} className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-[#A7ADB4] mb-1">Tanggal *</label>
                  <input type="datetime-local" name="date" defaultValue={new Date().toISOString().slice(0, 16)} required className="w-full bg-[#0F1113] border border-[#292D32] rounded-lg px-4 py-2 text-white outline-none focus:border-[#E53935]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#A7ADB4] mb-1">Petugas *</label>
                  <input type="text" name="officer" defaultValue="Admin" required className="w-full bg-[#0F1113] border border-[#292D32] rounded-lg px-4 py-2 text-white outline-none focus:border-[#E53935]" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-[#A7ADB4] mb-1">Sparepart *</label>
                  <select name="sparepartId" required className="w-full bg-[#0F1113] border border-[#292D32] rounded-lg px-4 py-2 text-white outline-none focus:border-[#E53935]">
                    <option value="" disabled selected>Pilih Sparepart...</option>
                    {spareparts.map(s => <option key={s.id} value={s.id}>{s.code} - {s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#A7ADB4] mb-1">Jumlah Masuk *</label>
                  <input type="number" name="quantity" min="1" required className="w-full bg-[#0F1113] border border-[#292D32] rounded-lg px-4 py-2 text-white outline-none focus:border-[#E53935]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#A7ADB4] mb-1">Harga Total (Opsional)</label>
                  <input type="number" name="harga" min="0" placeholder="Biarkan kosong untuk harga standar" className="w-full bg-[#0F1113] border border-[#292D32] rounded-lg px-4 py-2 text-white outline-none focus:border-[#E53935]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#A7ADB4] mb-1">Nomor Referensi</label>
                  <input type="text" name="reference" placeholder="PO / Faktur" className="w-full bg-[#0F1113] border border-[#292D32] rounded-lg px-4 py-2 text-white outline-none focus:border-[#E53935]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#A7ADB4] mb-1">Keterangan</label>
                  <input type="text" name="keterangan" className="w-full bg-[#0F1113] border border-[#292D32] rounded-lg px-4 py-2 text-white outline-none focus:border-[#E53935]" />
                </div>
              </div>
              <div className="flex gap-3 justify-end pt-4 mt-6 border-t border-[#292D32]">
                <button type="button" onClick={() => setIsMasukOpen(false)} className="px-4 py-2 text-[#A7ADB4] hover:text-white font-medium">Batal</button>
                <button type="submit" className="px-6 py-2 bg-[#E53935] hover:bg-[#D32F2F] text-white font-bold rounded-lg transition-colors shadow-lg shadow-[#E53935]/20">Simpan Barang Masuk</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FORM BARANG KELUAR */}
      {isKeluarOpen && (
        <div className="fixed inset-0 bg-[#0F1113]/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#171A1D] border border-[#292D32] rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95">
            <div className="px-6 py-4 border-b border-[#292D32] flex justify-between items-center bg-[#0F1113]">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <ArrowUpRight className="w-5 h-5 text-[#EF4444]" />
                Form Barang Keluar
              </h2>
              <button onClick={() => setIsKeluarOpen(false)} className="text-[#A7ADB4] hover:text-white"><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handleKeluarSubmit} className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-[#A7ADB4] mb-1">Tanggal *</label>
                  <input type="datetime-local" name="date" defaultValue={new Date().toISOString().slice(0, 16)} required className="w-full bg-[#0F1113] border border-[#292D32] rounded-lg px-4 py-2 text-white outline-none focus:border-[#E53935]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#A7ADB4] mb-1">Petugas *</label>
                  <input type="text" name="officer" defaultValue="Admin" required className="w-full bg-[#0F1113] border border-[#292D32] rounded-lg px-4 py-2 text-white outline-none focus:border-[#E53935]" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-[#A7ADB4] mb-1">Sparepart *</label>
                  <select name="sparepartId" required className="w-full bg-[#0F1113] border border-[#292D32] rounded-lg px-4 py-2 text-white outline-none focus:border-[#E53935]">
                    <option value="" disabled selected>Pilih Sparepart...</option>
                    {spareparts.filter(s => s.stock > 0).map(s => <option key={s.id} value={s.id}>{s.code} - {s.name} (Stok: {s.stock})</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#A7ADB4] mb-1">Jumlah Keluar *</label>
                  <input type="number" name="quantity" min="1" required className="w-full bg-[#0F1113] border border-[#292D32] rounded-lg px-4 py-2 text-white outline-none focus:border-[#E53935]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#A7ADB4] mb-1">Keperluan *</label>
                  <input type="text" name="keperluan" required placeholder="Contoh: Servis Pelanggan" className="w-full bg-[#0F1113] border border-[#292D32] rounded-lg px-4 py-2 text-white outline-none focus:border-[#E53935]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#A7ADB4] mb-1">Nomor Referensi</label>
                  <input type="text" name="reference" placeholder="SPK / Invoice" className="w-full bg-[#0F1113] border border-[#292D32] rounded-lg px-4 py-2 text-white outline-none focus:border-[#E53935]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#A7ADB4] mb-1">Keterangan</label>
                  <input type="text" name="keterangan" className="w-full bg-[#0F1113] border border-[#292D32] rounded-lg px-4 py-2 text-white outline-none focus:border-[#E53935]" />
                </div>
              </div>
              <div className="flex gap-3 justify-end pt-4 mt-6 border-t border-[#292D32]">
                <button type="button" onClick={() => setIsKeluarOpen(false)} className="px-4 py-2 text-[#A7ADB4] hover:text-white font-medium">Batal</button>
                <button type="submit" className="px-6 py-2 bg-[#EF4444] hover:bg-[#DC2626] text-white font-bold rounded-lg transition-colors shadow-lg shadow-[#EF4444]/20">Proses Barang Keluar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
