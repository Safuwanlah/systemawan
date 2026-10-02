import Link from 'next/link';
import { Plus, ArrowRightLeft, Search, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import prisma from '@/lib/prisma';

export const revalidate = 0;

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const q = params.q || '';

  const transactions = await prisma.stockTransaction.findMany({
    where: {
      sparepart: {
        name: { contains: q, mode: 'insensitive' }
      }
    },
    include: {
      sparepart: true,
      user: true,
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Transaksi Stok</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Catatan histori barang masuk dan keluar (Stock In / Out).</p>
        </div>
        <Link 
          href="/transactions/create"
          className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors shadow-sm font-medium"
        >
          <Plus className="w-5 h-5 mr-2" />
          Transaksi Baru
        </Link>
      </div>

      {/* Area Pencarian */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <form className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
          <input 
            type="text" 
            name="q"
            defaultValue={q}
            placeholder="Cari transaksi berdasarkan nama barang..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950/50 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:bg-white dark:focus:bg-slate-900 transition-all"
          />
        </form>
      </div>

      {/* Tabel Data */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Waktu</th>
                <th className="px-6 py-4 font-semibold">Tipe</th>
                <th className="px-6 py-4 font-semibold">Barang</th>
                <th className="px-6 py-4 font-semibold text-center">Jumlah</th>
                <th className="px-6 py-4 font-semibold">Keterangan</th>
                <th className="px-6 py-4 font-semibold">Oleh</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                    <div className="flex flex-col items-center justify-center">
                      <ArrowRightLeft className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-3" />
                      <p className="text-base font-medium text-slate-600 dark:text-slate-300">Tidak ada transaksi ditemukan</p>
                    </div>
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(tx.createdAt).toLocaleString('id-ID', {
                        day: '2-digit', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      {tx.type === 'IN' ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400">
                          <ArrowDownRight className="w-3 h-3 mr-1" /> Masuk
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400">
                          <ArrowUpRight className="w-3 h-3 mr-1" /> Keluar
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">
                      <Link href={`/spareparts/${tx.sparepartId}`} className="hover:text-blue-500 hover:underline">
                        {tx.sparepart?.name || 'Barang Dihapus'}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-slate-800 dark:text-slate-200">
                      {tx.type === 'IN' ? '+' : '-'}{tx.quantity}
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400 italic">
                      {tx.notes || '-'}
                    </td>
                    <td className="px-6 py-4">
                      {tx.user?.name || 'Sistem'}
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
