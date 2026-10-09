'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useGlobalContext } from '@/context/GlobalContext';
import { ChevronRight, FileText, Download, BarChart2, PieChart } from 'lucide-react';
import StaggerItem from '@/components/dashboard/StaggerItem';

export default function LaporanPage() {
  const { transactions, spareparts } = useGlobalContext();
  const [reportType, setReportType] = useState('Stok');
  
  const stats = {
    totalMasuk: transactions.filter(t => t.type === 'MASUK').reduce((acc, t) => acc + t.harga, 0),
    totalKeluar: transactions.filter(t => t.type === 'KELUAR').reduce((acc, t) => acc + t.harga, 0),
    totalStok: spareparts.reduce((acc, s) => acc + (s.stock * s.hargaBeli), 0),
  };

  return (
    <div className="space-y-6">
      <StaggerItem>
        <div className="flex items-center text-sm text-[#A7ADB4] mb-4">
          <Link href="/dashboard" className="hover:text-white transition-colors">Beranda</Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-[#F5F5F5] font-medium">Laporan Inventory</span>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#F5F5F5]">Laporan Inventory</h1>
            <p className="text-[#A7ADB4] text-sm mt-1">Analisis data inventory dan transaksi bengkel secara mendalam.</p>
          </div>
          <div className="flex gap-2">
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#171A1D] hover:bg-[#25292D] text-[#F5F5F5] font-bold rounded-lg border border-[#292D32] transition-colors">
              <Download className="w-4 h-4" /> Export PDF
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold rounded-lg transition-colors">
              <Download className="w-4 h-4" /> Export Excel
            </button>
          </div>
        </div>
      </StaggerItem>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* FILTERS */}
        <StaggerItem className="md:col-span-1">
          <div className="space-y-4 h-full">
            <div className="bg-[#171A1D] border border-[#292D32] rounded-xl p-4 shadow-lg h-full">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2"><FileText className="w-4 h-4"/> Parameter Laporan</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#A7ADB4] mb-1">Jenis Laporan</label>
                  <select value={reportType} onChange={e => setReportType(e.target.value)} className="w-full bg-[#0F1113] border border-[#292D32] text-sm text-white rounded-md px-3 py-2 outline-none focus:border-[#E53935]">
                    <option value="Stok">Laporan Stok</option>
                    <option value="Masuk">Laporan Barang Masuk</option>
                    <option value="Keluar">Laporan Barang Keluar</option>
                    <option value="Transaksi">Laporan Transaksi Umum</option>
                    <option value="Sparepart">Laporan Master Sparepart</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#A7ADB4] mb-1">Periode</label>
                  <select className="w-full bg-[#0F1113] border border-[#292D32] text-sm text-white rounded-md px-3 py-2 outline-none focus:border-[#E53935]">
                    <option>Bulan Ini</option>
                    <option>Bulan Lalu</option>
                    <option>Tahun Ini</option>
                    <option>Kustom (Pilih Tanggal)</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-[#A7ADB4] mb-1">Mulai</label>
                    <input type="date" className="w-full bg-[#0F1113] border border-[#292D32] text-xs text-white rounded-md px-2 py-2 outline-none focus:border-[#E53935]" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#A7ADB4] mb-1">Akhir</label>
                    <input type="date" className="w-full bg-[#0F1113] border border-[#292D32] text-xs text-white rounded-md px-2 py-2 outline-none focus:border-[#E53935]" />
                  </div>
                </div>
                <button className="w-full py-2 bg-[#E53935] hover:bg-[#D32F2F] text-white text-sm font-bold rounded-md transition-colors">Generate Laporan</button>
              </div>
            </div>
          </div>
        </StaggerItem>

        {/* CONTENT */}
        <div className="md:col-span-3 space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <StaggerItem>
              <div className="bg-[#171A1D] border border-[#292D32] rounded-xl p-4 shadow-lg h-full">
                <p className="text-xs font-medium text-[#A7ADB4] mb-1">Total Nilai Inventory</p>
                <p className="text-xl font-black text-white">Rp {stats.totalStok.toLocaleString('id-ID')}</p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="bg-[#171A1D] border border-[#292D32] rounded-xl p-4 shadow-lg h-full">
                <p className="text-xs font-medium text-[#A7ADB4] mb-1">Total Pembelian (Masuk)</p>
                <p className="text-xl font-black text-[#22C55E]">Rp {stats.totalMasuk.toLocaleString('id-ID')}</p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="bg-[#171A1D] border border-[#292D32] rounded-xl p-4 shadow-lg h-full">
                <p className="text-xs font-medium text-[#A7ADB4] mb-1">Total Penjualan (Keluar)</p>
                <p className="text-xl font-black text-[#E53935]">Rp {stats.totalKeluar.toLocaleString('id-ID')}</p>
              </div>
            </StaggerItem>
          </div>

          {/* CHART PLACEHOLDER */}
          <StaggerItem>
            <div className="bg-[#171A1D] border border-[#292D32] rounded-xl p-4 shadow-lg h-[250px] flex flex-col">
              <h3 className="font-bold text-white mb-2 text-sm">Grafik {reportType} Bulanan</h3>
              <div className="flex-1 border border-dashed border-[#292D32] rounded-lg flex items-center justify-center">
                 <div className="text-center text-[#292D32]">
                    <BarChart2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm font-medium">Area Visualisasi Grafik (Chart.js / Recharts)</p>
                 </div>
              </div>
            </div>
          </StaggerItem>

          {/* TABLE PREVIEW */}
          <StaggerItem>
            <div className="bg-[#171A1D] border border-[#292D32] rounded-xl shadow-lg overflow-hidden">
              <div className="px-4 py-3 border-b border-[#292D32]">
                <h3 className="font-bold text-white text-sm">Preview Data Laporan</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-[#0F1113] border-b border-[#292D32] text-[#A7ADB4]">
                    <tr>
                      <th className="px-4 py-3 font-bold">KODE</th>
                      <th className="px-4 py-3 font-bold">SPAREPART</th>
                      <th className="px-4 py-3 font-bold text-center">STOK AKHIR</th>
                      <th className="px-4 py-3 font-bold text-right">NILAI ASET</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#292D32]">
                    {spareparts.slice(0, 5).map(sp => (
                      <tr key={sp.id} className="hover:bg-[#25292D]/30">
                        <td className="px-4 py-3 text-[#F5F5F5]">{sp.code}</td>
                        <td className="px-4 py-3 text-[#F5F5F5] font-medium">{sp.name}</td>
                        <td className="px-4 py-3 text-center font-bold text-white">{sp.stock}</td>
                        <td className="px-4 py-3 text-right text-[#A7ADB4]">Rp {(sp.stock * sp.hargaBeli).toLocaleString('id-ID')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </StaggerItem>

        </div>
      </div>
    </div>
  );
}
