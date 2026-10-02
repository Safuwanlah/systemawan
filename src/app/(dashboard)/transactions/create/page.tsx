'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';

export default function CreateTransactionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [spareparts, setSpareparts] = useState<any[]>([]);

  useEffect(() => {
    // Ambil daftar sparepart untuk dropdown
    fetch('/api/spareparts')
      .then(res => res.json())
      .then(data => setSpareparts(data))
      .catch(err => console.error(err));
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const type = formData.get('type') as string;
    const sparepartId = formData.get('sparepartId') as string;
    const quantity = Number(formData.get('quantity'));
    const notes = formData.get('notes') as string;

    if (!sparepartId) {
      setError('Harap pilih barang!');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, sparepartId, quantity, notes }),
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || 'Gagal menyimpan transaksi');
      }

      router.push('/transactions');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Link 
          href="/transactions"
          className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Catat Transaksi Stok</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Tambahkan data barang masuk (restock) atau barang keluar.</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20 rounded-lg text-sm font-medium">
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Tipe Transaksi <span className="text-rose-500">*</span></label>
            <div className="flex space-x-4">
              <label className="flex items-center p-3 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <input type="radio" name="type" value="IN" defaultChecked className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-slate-300" />
                <span className="ml-2 font-medium text-slate-800 dark:text-slate-200">Barang Masuk (IN)</span>
              </label>
              <label className="flex items-center p-3 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <input type="radio" name="type" value="OUT" className="w-4 h-4 text-rose-600 focus:ring-rose-500 border-slate-300" />
                <span className="ml-2 font-medium text-slate-800 dark:text-slate-200">Barang Keluar (OUT)</span>
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="sparepartId" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Pilih Barang <span className="text-rose-500">*</span></label>
            <select 
              id="sparepartId" 
              name="sparepartId" 
              required
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950/50 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:bg-white dark:focus:bg-slate-900 transition-all"
            >
              <option value="">-- Pilih Barang --</option>
              {spareparts.map(sp => (
                <option key={sp.id} value={sp.id}>
                  {sp.code} - {sp.name} (Stok: {sp.stock})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="quantity" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Jumlah Barang <span className="text-rose-500">*</span></label>
            <input 
              type="number" 
              id="quantity" 
              name="quantity" 
              required
              min="1"
              defaultValue="1"
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950/50 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:bg-white dark:focus:bg-slate-900 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="notes" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Keterangan / Catatan (Opsional)</label>
            <textarea 
              id="notes" 
              name="notes" 
              rows={3}
              placeholder="Contoh: Tambahan stok dari supplier A"
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950/50 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:bg-white dark:focus:bg-slate-900 transition-all"
            ></textarea>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end space-x-3">
            <Link 
              href="/transactions"
              className="px-6 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Batal
            </Link>
            <button 
              type="submit" 
              disabled={loading}
              className="inline-flex items-center px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Menyimpan...' : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Simpan Transaksi
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
