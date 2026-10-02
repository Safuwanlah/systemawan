import Link from 'next/link';
import { ArrowLeft, Edit, Package, AlertTriangle, Clock } from 'lucide-react';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';

export const revalidate = 0;

export default async function SparepartDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const sparepart = await prisma.sparepart.findUnique({
    where: { id },
    include: {
      category: true,
      brand: true,
      transactions: {
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: {
          user: { select: { name: true } }
        }
      }
    }
  });

  if (!sparepart) {
    notFound();
  }

  const isLowStock = sparepart.stock > 0 && sparepart.stock <= sparepart.minStock;
  const isOutOfStock = sparepart.stock === 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-4">
          <Link href="/spareparts" className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Detail Sparepart</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Informasi lengkap dan histori stok barang.</p>
          </div>
        </div>
        <Link 
          href={`/spareparts/${sparepart.id}/edit`}
          className="inline-flex items-center px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm font-medium"
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit Data
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Info Utama */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Kode / SKU</p>
                <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{sparepart.code}</p>
              </div>
              <div className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full text-xs font-medium">
                {sparepart.category?.name || 'Tanpa Kategori'}
              </div>
            </div>
            
            <div className="mt-6">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{sparepart.name}</h2>
              <p className="text-slate-600 dark:text-slate-400 mt-2">{sparepart.description || 'Tidak ada deskripsi.'}</p>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-6 pt-6 border-t border-slate-100 dark:border-slate-800">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Harga Satuan</p>
                <p className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-1">Rp {sparepart.price.toLocaleString('id-ID')}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Merk / Brand</p>
                <p className="text-base font-semibold text-slate-800 dark:text-slate-100 mt-1">{sparepart.brand?.name || '-'}</p>
              </div>
            </div>
          </div>

          {/* Histori Transaksi */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 transition-colors">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-slate-400 dark:text-slate-500" />
              10 Histori Transaksi Terakhir
            </h3>
            {sparepart.transactions.length === 0 ? (
              <p className="text-slate-500 dark:text-slate-400 text-center py-6">Belum ada pergerakan stok untuk barang ini.</p>
            ) : (
              <div className="space-y-4">
                {sparepart.transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
                    <div>
                      <p className="font-medium text-slate-800 dark:text-slate-200">
                        {tx.type === 'IN' ? 'Stok Masuk' : 'Stok Keluar'}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {new Date(tx.createdAt).toLocaleString('id-ID')} • {tx.notes || '-'}
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                      tx.type === 'IN' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400'
                    }`}>
                      {tx.type === 'IN' ? '+' : '-'}{tx.quantity}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Panel Stok */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 transition-colors">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-4">Status Ketersediaan</h3>
            
            <div className="flex flex-col items-center justify-center py-6">
              <div className={`w-24 h-24 rounded-full border-4 flex items-center justify-center mb-4 ${
                isOutOfStock ? 'border-rose-100 bg-rose-50 text-rose-600 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400' :
                isLowStock ? 'border-amber-100 bg-amber-50 text-amber-600 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400' :
                'border-emerald-100 bg-emerald-50 text-emerald-600 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400'
              }`}>
                {isOutOfStock ? <AlertTriangle className="w-10 h-10" /> : <Package className="w-10 h-10" />}
              </div>
              <p className="text-4xl font-black text-slate-800 dark:text-slate-100">{sparepart.stock}</p>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-2">Stok Saat Ini</p>
            </div>

            <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 dark:text-slate-400">Batas Minimum:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{sparepart.minStock}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
