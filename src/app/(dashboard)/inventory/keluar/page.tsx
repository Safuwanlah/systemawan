'use client';

import { useState } from 'react';
import { useGlobalContext } from '@/context/GlobalContext';
import { ArrowUpRight, Package, X } from 'lucide-react';

export default function StokKeluarPage() {
  const { spareparts, transactions, addStockOut } = useGlobalContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const stockOutTransactions = transactions.filter(t => t.type === 'KELUAR');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const success = addStockOut({
      date: formData.get('date') as string,
      sparepartId: formData.get('sparepartId') as string,
      quantity: parseInt(formData.get('quantity') as string),
      harga: 0,
      keperluan: formData.get('needs') as string,
      reference: formData.get('reference') as string,
      officer: 'Admin',
      keterangan: ''
    });
    if (success) setIsModalOpen(false);
  };

  return (
    <div className="animate-in fade-in p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#F5F5F5]">Stok Keluar</h2>
          <p className="text-[#A7ADB4] text-sm">Catat pengeluaran inventory untuk servis atau lainnya.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="inline-flex items-center gap-2 px-4 py-2 bg-[#25292D] hover:bg-[#292D32] text-white text-sm font-bold rounded-lg border border-[#292D32] transition-colors">
          <ArrowUpRight className="w-4 h-4 text-[#EF4444]" />
          + Catat Stok Keluar
        </button>
      </div>

      <div className="overflow-x-auto border border-[#292D32] rounded-lg">
        {stockOutTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-[#171A1D]">
            <Package className="w-16 h-16 text-[#292D32] mb-4" />
            <p className="text-[#F5F5F5] font-bold text-lg mb-1">Belum ada transaksi</p>
            <p className="text-[#A7ADB4] text-sm mb-4">Belum ada transaksi stok keluar yang dicatat.</p>
            <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-[#25292D] text-white text-sm rounded-md hover:bg-[#292D32]">+ Catat Stok Keluar</button>
          </div>
        ) : (
          <table className="w-full text-left text-sm whitespace-nowrap bg-[#171A1D]">
            <thead className="bg-[#0F1113] border-b border-[#292D32] text-[#A7ADB4]">
              <tr>
                <th className="px-6 py-4 font-bold">TANGGAL</th>
                <th className="px-6 py-4 font-bold">KODE</th>
                <th className="px-6 py-4 font-bold">SPAREPART</th>
                <th className="px-6 py-4 font-bold">JUMLAH</th>
                <th className="px-6 py-4 font-bold">KEPERLUAN</th>
                <th className="px-6 py-4 font-bold">REFERENSI</th>
                <th className="px-6 py-4 font-bold">PETUGAS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#292D32]">
              {stockOutTransactions.map(tx => {
                const sp = spareparts.find(s => s.id === tx.sparepartId);
                return (
                  <tr key={tx.id} className="hover:bg-[#25292D]/30 transition-colors">
                    <td className="px-6 py-4 text-[#A7ADB4]">{tx.date}</td>
                    <td className="px-6 py-4 text-[#F5F5F5] font-medium">{sp?.code}</td>
                    <td className="px-6 py-4 text-[#F5F5F5] font-bold">{sp?.name}</td>
                    <td className="px-6 py-4"><span className="text-[#EF4444] font-bold bg-[#EF4444]/10 px-2 py-1 rounded border border-[#EF4444]/20">-{tx.quantity}</span></td>
                    <td className="px-6 py-4 text-[#A7ADB4]">{tx.keperluan}</td>
                    <td className="px-6 py-4 text-[#A7ADB4]">{tx.reference}</td>
                    <td className="px-6 py-4 text-[#A7ADB4]">{tx.officer}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-[#0F1113]/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#171A1D] border border-[#292D32] rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95">
            <div className="px-6 py-4 border-b border-[#292D32] flex justify-between items-center bg-[#0F1113]">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <ArrowUpRight className="w-5 h-5 text-[#EF4444]" />
                Form Stok Keluar
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-[#A7ADB4] hover:text-white"><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#A7ADB4] mb-1">Sparepart *</label>
                <select name="sparepartId" required className="w-full bg-[#0F1113] border border-[#292D32] rounded-lg px-4 py-2.5 text-white focus:border-[#E53935] outline-none">
                  <option value="" disabled selected>Pilih Sparepart...</option>
                  {spareparts.filter(s => s.stock > 0).map(s => <option key={s.id} value={s.id}>{s.code} - {s.name} (Stok: {s.stock})</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#A7ADB4] mb-1">Jumlah Keluar *</label>
                  <input type="number" name="quantity" min="1" required className="w-full bg-[#0F1113] border border-[#292D32] rounded-lg px-4 py-2.5 text-white focus:border-[#E53935] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#A7ADB4] mb-1">Tanggal *</label>
                  <input type="date" name="date" defaultValue={new Date().toISOString().split('T')[0]} required className="w-full bg-[#0F1113] border border-[#292D32] rounded-lg px-4 py-2.5 text-white focus:border-[#E53935] outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#A7ADB4] mb-1">Keperluan *</label>
                <input type="text" name="needs" required placeholder="Contoh: Servis B 1234 CD" className="w-full bg-[#0F1113] border border-[#292D32] rounded-lg px-4 py-2.5 text-white focus:border-[#E53935] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#A7ADB4] mb-1">No. Referensi (SPK)</label>
                <input type="text" name="reference" placeholder="Opsional" className="w-full bg-[#0F1113] border border-[#292D32] rounded-lg px-4 py-2.5 text-white focus:border-[#E53935] outline-none" />
              </div>
              <div className="flex gap-3 justify-end pt-4 mt-6 border-t border-[#292D32]">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-[#A7ADB4] hover:text-white font-medium">Batal</button>
                <button type="submit" className="px-6 py-2 bg-[#EF4444] hover:bg-[#DC2626] text-white font-bold rounded-lg transition-colors shadow-lg shadow-[#EF4444]/20">Keluarkan Stok</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
