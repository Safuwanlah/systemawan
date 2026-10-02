import prisma from '@/lib/prisma';
import Link from 'next/link';

export const revalidate = 0; // Agar dashboard selalu fresh

export default async function Dashboard() {
  const totalSparepart = await prisma.sparepart.count();
  const outOfStock = await prisma.sparepart.count({ where: { stock: 0 } });
  
  const lowStockResult = await prisma.$queryRaw<Array<{ count: bigint }>>`
    SELECT COUNT(*) as count FROM "Sparepart" WHERE stock > 0 AND stock <= "minStock"
  `;
  const lowStock = Number(lowStockResult[0]?.count || 0);

  // Fetch spareparts for the table
  const spareparts = await prisma.sparepart.findMany({
    take: 10,
    orderBy: { stock: 'asc' },
    include: { category: true }
  });

  return (
    <div className="space-y-10 pb-10">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Dashboard</h1>
        <p className="text-[#8A9098] text-[15px]">Ringkasan kondisi inventaris Anda saat ini.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 xl:gap-8">
        {/* Total Item Card */}
        <div className="bg-gradient-to-b from-[#171A1D] to-[#0F1113] border border-[#25292D] rounded-2xl p-7 shadow-lg relative overflow-hidden group hover:border-[#3B82F6]/50 hover:shadow-[0_8px_30px_rgba(59,130,246,0.12)] transition-all duration-300 ease-out transform hover:-translate-y-1">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#3B82F6] to-transparent opacity-40 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute top-0 right-0 w-40 h-40 bg-[#3B82F6]/5 rounded-bl-full pointer-events-none group-hover:bg-[#3B82F6]/10 transition-colors duration-500 blur-xl"></div>
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#3B82F6]/10 rounded-full blur-2xl group-hover:bg-[#3B82F6]/20 transition-colors duration-500"></div>
          
          <h2 className="text-sm font-semibold text-[#8A9098] mb-4 uppercase tracking-wider">Total Item</h2>
          <p className="text-5xl font-black text-white tracking-tighter drop-shadow-sm">{totalSparepart}</p>
        </div>

        {/* Stok Menipis Card */}
        <div className="bg-gradient-to-b from-[#171A1D] to-[#0F1113] border border-[#25292D] rounded-2xl p-7 shadow-lg relative overflow-hidden group hover:border-[#D97706]/50 hover:shadow-[0_8px_30px_rgba(217,119,6,0.12)] transition-all duration-300 ease-out transform hover:-translate-y-1">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#D97706] to-transparent opacity-40 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute top-0 right-0 w-40 h-40 bg-[#D97706]/5 rounded-bl-full pointer-events-none group-hover:bg-[#D97706]/10 transition-colors duration-500 blur-xl"></div>
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#D97706]/10 rounded-full blur-2xl group-hover:bg-[#D97706]/20 transition-colors duration-500"></div>
          
          <h2 className="text-sm font-semibold text-[#8A9098] mb-4 uppercase tracking-wider">Stok Menipis</h2>
          <p className="text-5xl font-black text-white tracking-tighter drop-shadow-sm">{lowStock}</p>
        </div>

        {/* Stok Habis Card */}
        <div className="bg-gradient-to-b from-[#171A1D] to-[#0F1113] border border-[#25292D] rounded-2xl p-7 shadow-lg relative overflow-hidden group hover:border-[#E53935]/50 hover:shadow-[0_8px_30px_rgba(229,57,53,0.15)] transition-all duration-300 ease-out transform hover:-translate-y-1">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#E53935] to-transparent opacity-40 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute top-0 right-0 w-40 h-40 bg-[#E53935]/5 rounded-bl-full pointer-events-none group-hover:bg-[#E53935]/10 transition-colors duration-500 blur-xl"></div>
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#E53935]/10 rounded-full blur-2xl group-hover:bg-[#E53935]/20 transition-colors duration-500"></div>
          
          <h2 className="text-sm font-semibold text-[#8A9098] mb-4 uppercase tracking-wider">Stok Habis</h2>
          <p className="text-5xl font-black text-white tracking-tighter drop-shadow-sm">{outOfStock}</p>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-[#131517] border border-[#25292D] rounded-2xl shadow-xl overflow-hidden relative before:absolute before:inset-0 before:border before:border-white/5 before:rounded-2xl before:pointer-events-none">
        
        <div className="px-6 py-5 border-b border-[#25292D] flex items-center justify-between bg-[#171A1D]">
          <h3 className="font-bold text-white">Ringkasan Stok</h3>
          <Link href="/sparepart" className="text-sm font-medium text-[#3B82F6] hover:text-[#60A5FA] transition-colors">Lihat Semua</Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0F1113]/50 border-b border-[#25292D]">
                <th className="px-6 py-4 text-[11px] font-bold text-[#5A6068] uppercase tracking-widest whitespace-nowrap">Nama Barang</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#5A6068] uppercase tracking-widest whitespace-nowrap">Kategori</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#5A6068] uppercase tracking-widest whitespace-nowrap">Sisa Stok</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#5A6068] uppercase tracking-widest whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#25292D]/60">
              {spareparts.map((item) => {
                const isHabis = item.stock === 0;
                const isMenipis = item.stock > 0 && item.stock <= item.minStock;
                
                return (
                  <tr key={item.id} className="hover:bg-[#1C2024] transition-colors duration-200 group">
                    <td className="px-6 py-4.5">
                      <div className="text-[15px] font-medium text-[#E8EAED] group-hover:text-white transition-colors">{item.name}</div>
                      <div className="text-xs text-[#5A6068] mt-1">{item.code}</div>
                    </td>
                    <td className="px-6 py-4.5">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-[#1C2024] text-[#A7ADB4] border border-[#2B3036]">
                        {item.category?.name || 'Umum'}
                      </span>
                    </td>
                    <td className="px-6 py-4.5">
                      <div className={`text-[15px] font-bold ${isHabis ? 'text-[#E53935]' : 'text-white'}`}>{item.stock}</div>
                    </td>
                    <td className="px-6 py-4.5">
                      {isHabis ? (
                        <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold bg-[#E53935]/10 text-[#E53935] border border-[#E53935]/20 shadow-[0_0_10px_rgba(229,57,53,0.1)]">
                          Habis
                        </span>
                      ) : isMenipis ? (
                        <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold bg-[#D97706]/10 text-[#D97706] border border-[#D97706]/20 shadow-[0_0_10px_rgba(217,119,6,0.1)]">
                          Menipis
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20 shadow-[0_0_10px_rgba(59,130,246,0.1)]">
                          Aman
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {spareparts.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="text-[#5A6068] text-[15px]">Belum ada data barang tersedia.</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
