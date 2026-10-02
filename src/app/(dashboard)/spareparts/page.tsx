import Link from 'next/link';
import { Plus, Search, Edit, Trash2, Eye, PackageOpen } from 'lucide-react';
import prisma from '@/lib/prisma';

export const revalidate = 0; // Pastikan data selalu fresh

export default async function SparepartsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const q = params.q || '';

  // Mengambil data dari database dengan fitur pencarian (Search)
  const spareparts = await prisma.sparepart.findMany({
    where: {
      OR: [
        { name: { contains: q, mode: 'insensitive' } },
        { code: { contains: q, mode: 'insensitive' } },
      ]
    },
    include: {
      category: true,
      brand: true,
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Data Sparepart</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Kelola semua daftar barang inventaris Anda di sini.</p>
        </div>
        <Link 
          href="/spareparts/create"
          className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors shadow-sm font-medium"
        >
          <Plus className="w-5 h-5 mr-2" />
          Tambah Barang
        </Link>
      </div>

      {/* Area Pencarian */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center transition-colors">
        <form className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
          <input 
            type="text" 
            name="q"
            defaultValue={q}
            placeholder="Cari nama atau kode barang..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950/50 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:bg-white dark:focus:bg-slate-900 transition-all"
          />
          <button type="submit" className="hidden">Cari</button>
        </form>
      </div>

      {/* Tabel Data */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Kode/SKU</th>
                <th className="px-6 py-4 font-semibold">Nama Barang</th>
                <th className="px-6 py-4 font-semibold">Kategori</th>
                <th className="px-6 py-4 font-semibold">Harga</th>
                <th className="px-6 py-4 font-semibold text-center">Stok</th>
                <th className="px-6 py-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {spareparts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                    <div className="flex flex-col items-center justify-center">
                      <PackageOpen className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-3" />
                      <p className="text-base font-medium text-slate-600 dark:text-slate-300">Tidak ada barang ditemukan</p>
                      <p className="text-sm mt-1">Coba kata kunci lain atau tambahkan barang baru.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                spareparts.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">{item.code}</td>
                    <td className="px-6 py-4 font-semibold text-slate-800 dark:text-slate-200">{item.name}</td>
                    <td className="px-6 py-4">
                      {item.category?.name ? (
                        <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full text-xs font-medium">
                          {item.category.name}
                        </span>
                      ) : (
                        <span className="text-slate-400 dark:text-slate-500 italic text-xs">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      Rp {item.price.toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        item.stock === 0 
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400' 
                          : item.stock <= item.minStock 
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' 
                            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'
                      }`}>
                        {item.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end space-x-2">
                        <Link href={`/spareparts/${item.id}`} className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors" title="Detail">
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link href={`/spareparts/${item.id}/edit`} className="p-2 text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10 rounded-lg transition-colors" title="Edit">
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors" title="Hapus">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
