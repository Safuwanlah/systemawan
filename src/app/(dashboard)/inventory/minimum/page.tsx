'use client';

import { useState } from 'react';
import { useGlobalContext } from '@/context/GlobalContext';
import { AlertTriangle, ArrowDownRight, Package, X } from 'lucide-react';

export default function StokMinimumPage() {
  const { spareparts, addStockIn } = useGlobalContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSparepartId, setSelectedSparepartId] = useState<string | null>(null);

  const minimumStockSpareparts = spareparts.filter(s => s.stock <= s.minStock);

  const handleRestockClick = (id: string) => {
    setSelectedSparepartId(id);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    addStockIn({
      date: formData.get('date') as string,
      sparepartId: formData.get('sparepartId') as string,
      quantity: parseInt(formData.get('quantity') as string),
      harga: 0,
      supplierId: formData.get('supplier') as string,
      reference: formData.get('reference') as string,
      officer: 'Admin',
      keterangan: ''
    });
    setIsModalOpen(false);
  };

  return (
    <div className="animate-in fade-in">
      <div className="p-4 border-b border-border bg-card">
        <h2 className="text-lg font-bold text-foreground">Perhatian Stok Minimum</h2>
        <p className="text-muted-foreground text-sm mt-1">Daftar sparepart yang perlu diperhatikan karena stok berada pada atau di bawah batas minimum.</p>
      </div>

      <div className="overflow-x-auto">
        {minimumStockSpareparts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-card">
            <Package className="w-16 h-16 text-muted-foreground/50 mb-4" />
            <p className="text-foreground font-bold text-lg mb-1">Semua stok berada dalam kondisi aman.</p>
            <p className="text-muted-foreground text-sm">Tidak ada sparepart yang memerlukan perhatian saat ini.</p>
          </div>
        ) : (
          <table className="w-full text-left text-sm whitespace-nowrap bg-card">
            <thead className="bg-muted border-b border-border text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-bold">KODE</th>
                <th className="px-6 py-4 font-bold">SPAREPART</th>
                <th className="px-6 py-4 font-bold">KATEGORI</th>
                <th className="px-6 py-4 font-bold text-center">STOK SAAT INI</th>
                <th className="px-6 py-4 font-bold text-center">STOK MINIMUM</th>
                <th className="px-6 py-4 font-bold text-center">SELISIH</th>
                <th className="px-6 py-4 font-bold">SUPPLIER</th>
                <th className="px-6 py-4 font-bold">STATUS</th>
                <th className="px-6 py-4 font-bold text-right">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {minimumStockSpareparts.map(sp => {
                const diff = sp.stock - sp.minStock;
                const isKosong = sp.stock === 0;
                return (
                  <tr key={sp.id} className="hover:bg-accent/30 transition-colors">
                    <td className="px-6 py-4 text-foreground font-medium">{sp.code}</td>
                    <td className="px-6 py-4 text-foreground font-bold">{sp.name}</td>
                    <td className="px-6 py-4 text-muted-foreground">{sp.category}</td>
                    <td className="px-6 py-4 text-center font-bold text-foreground">{sp.stock}</td>
                    <td className="px-6 py-4 text-center text-muted-foreground">{sp.minStock}</td>
                    <td className="px-6 py-4 text-center text-[#EF4444] font-bold">{diff}</td>
                    <td className="px-6 py-4 text-muted-foreground">{sp.supplierId}</td>
                    <td className="px-6 py-4">
                      {isKosong ? (
                        <span className="px-2.5 py-1 bg-[#EF4444]/10 text-[#EF4444] text-xs font-bold rounded border border-[#EF4444]/20">KOSONG</span>
                      ) : (
                        <span className="px-2.5 py-1 bg-[#F59E0B]/10 text-[#F59E0B] text-xs font-bold rounded border border-[#F59E0B]/20">MENIPIS</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleRestockClick(sp.id)}
                        className="px-3 py-1.5 bg-[#E53935]/10 text-[#E53935] hover:bg-[#E53935]/20 font-bold text-xs rounded transition-colors"
                      >
                        Restock
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* FORM STOK MASUK (Restock) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-muted/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95">
            <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-muted">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <ArrowDownRight className="w-5 h-5 text-[#22C55E]" />
                Form Stok Masuk
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Sparepart *</label>
                <select name="sparepartId" defaultValue={selectedSparepartId || ""} required className="w-full bg-muted border border-border rounded-lg px-4 py-2.5 text-foreground focus:border-[#E53935] outline-none">
                  <option value="" disabled>Pilih Sparepart...</option>
                  {spareparts.map(s => <option key={s.id} value={s.id}>{s.code} - {s.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Jumlah Masuk *</label>
                  <input type="number" name="quantity" min="1" required className="w-full bg-muted border border-border rounded-lg px-4 py-2.5 text-foreground focus:border-[#E53935] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Tanggal *</label>
                  <input type="date" name="date" defaultValue={new Date().toISOString().split('T')[0]} required className="w-full bg-muted border border-border rounded-lg px-4 py-2.5 text-foreground focus:border-[#E53935] outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Supplier *</label>
                <input type="text" name="supplier" required placeholder="Nama supplier" className="w-full bg-muted border border-border rounded-lg px-4 py-2.5 text-foreground focus:border-[#E53935] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">No. Referensi (PO/Faktur)</label>
                <input type="text" name="reference" placeholder="Opsional" className="w-full bg-muted border border-border rounded-lg px-4 py-2.5 text-foreground focus:border-[#E53935] outline-none" />
              </div>
              <div className="flex gap-3 justify-end pt-4 mt-6 border-t border-border">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-muted-foreground hover:text-foreground font-medium">Batal</button>
                <button type="submit" className="px-6 py-2 bg-[#E53935] hover:bg-[#D32F2F] text-white font-bold rounded-lg transition-colors shadow-lg shadow-[#E53935]/20">Simpan Stok Masuk</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
