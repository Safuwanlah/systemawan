'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';

export default function CreateSparepartPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      fetch('/api/categories').then(res => res.json()),
      fetch('/api/brands').then(res => res.json())
    ]).then(([catData, brandData]) => {
      if (Array.isArray(catData)) setCategories(catData);
      if (Array.isArray(brandData)) setBrands(brandData);
    }).catch(err => console.error(err));
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const data = {
      code: formData.get('code'),
      name: formData.get('name'),
      description: formData.get('description'),
      price: Number(formData.get('price')),
      minStock: Number(formData.get('minStock')),
      categoryId: formData.get('categoryId') || undefined,
      brandId: formData.get('brandId') || undefined,
    };
    
    const initialStock = Number(formData.get('initialStock'));

    try {
      const res = await fetch('/api/spareparts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || 'Terjadi kesalahan saat menyimpan data');
      }

      const newSparepart = await res.json();

      if (initialStock > 0) {
        const txRes = await fetch('/api/transactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'IN',
            sparepartId: newSparepart.id,
            quantity: initialStock,
            notes: 'Stok awal saat pendaftaran barang'
          }),
        });
        if (!txRes.ok) {
          console.error("Gagal menambahkan stok awal");
        }
      }

      router.push('/spareparts');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Link 
          href="/spareparts"
          className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Tambah Sparepart Baru</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Masukkan informasi detail barang baru ke dalam sistem.</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20 rounded-lg text-sm font-medium">
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="code" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Kode Barang / SKU <span className="text-rose-500">*</span></label>
              <input 
                type="text" 
                id="code" 
                name="code" 
                required
                placeholder="Contoh: BRG-001"
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950/50 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:bg-white dark:focus:bg-slate-900 transition-all"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Nama Barang <span className="text-rose-500">*</span></label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                required
                placeholder="Contoh: Busi Motor Honda"
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950/50 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:bg-white dark:focus:bg-slate-900 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="categoryId" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Kategori</label>
              <select 
                id="categoryId" 
                name="categoryId"
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950/50 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:bg-white dark:focus:bg-slate-900 transition-all"
              >
                <option value="">-- Pilih Kategori --</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="brandId" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Merk / Brand</label>
              <select 
                id="brandId" 
                name="brandId"
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950/50 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:bg-white dark:focus:bg-slate-900 transition-all"
              >
                <option value="">-- Pilih Merk --</option>
                {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Deskripsi (Opsional)</label>
            <textarea 
              id="description" 
              name="description" 
              rows={3}
              placeholder="Tambahkan keterangan barang di sini..."
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950/50 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:bg-white dark:focus:bg-slate-900 transition-all"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label htmlFor="price" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Harga Satuan (Rp)</label>
              <input 
                type="number" 
                id="price" 
                name="price" 
                defaultValue="0"
                min="0"
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950/50 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:bg-white dark:focus:bg-slate-900 transition-all"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="initialStock" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Stok Awal</label>
              <input 
                type="number" 
                id="initialStock" 
                name="initialStock" 
                defaultValue="0"
                min="0"
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950/50 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:bg-white dark:focus:bg-slate-900 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="minStock" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Batas Stok Minimum</label>
              <input 
                type="number" 
                id="minStock" 
                name="minStock" 
                defaultValue="5"
                min="0"
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950/50 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:bg-white dark:focus:bg-slate-900 transition-all"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end space-x-3">
            <Link 
              href="/spareparts"
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
                  Simpan Barang
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
