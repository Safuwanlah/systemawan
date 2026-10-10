'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useGlobalContext } from '@/context/GlobalContext';
import { Search, Package, Eye, Edit } from 'lucide-react';

function SemuaSparepartContent() {
  const { spareparts } = useGlobalContext();
  const searchParams = useSearchParams();
  const router = useRouter();

  // URL State Sync
  const initialStatus = searchParams.get('status') || 'Semua';
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Semua');
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [supplierFilter, setSupplierFilter] = useState('Semua');

  // Sync status filter if URL changes
  useEffect(() => {
    const qStatus = searchParams.get('status');
    if (qStatus) setStatusFilter(qStatus);
  }, [searchParams]);

  const updateUrlStatus = (status: string) => {
    setStatusFilter(status);
    if (status === 'Semua') {
      router.push('/inventory');
    } else {
      router.push(`/inventory?status=${status}`);
    }
  };

  const getStatus = (stock: number, min: number) => {
    if (stock === 0) return 'KOSONG';
    if (stock <= min) return 'MENIPIS';
    return 'AMAN';
  };

  const filteredSpareparts = useMemo(() => {
    let result = spareparts;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(s => 
        s.name.toLowerCase().includes(q) || 
        s.code.toLowerCase().includes(q) ||
        s.supplierId.toLowerCase().includes(q)
      );
    }
    if (categoryFilter !== 'Semua') result = result.filter(s => s.category === categoryFilter);
    if (supplierFilter !== 'Semua') result = result.filter(s => s.supplierId === supplierFilter);
    if (statusFilter !== 'Semua') {
      result = result.filter(s => getStatus(s.stock, s.minStock) === statusFilter.toUpperCase());
    }
    return result;
  }, [spareparts, searchQuery, categoryFilter, statusFilter, supplierFilter]);

  const renderStatusBadge = (stock: number, min: number) => {
    const status = getStatus(stock, min);
    if (status === 'KOSONG') return <span className="px-2.5 py-1 bg-[#EF4444]/10 text-[#EF4444] text-xs font-bold rounded border border-[#EF4444]/20">KOSONG</span>;
    if (status === 'MENIPIS') return <span className="px-2.5 py-1 bg-[#F59E0B]/10 text-[#F59E0B] text-xs font-bold rounded border border-[#F59E0B]/20">MENIPIS</span>;
    return <span className="px-2.5 py-1 bg-[#22C55E]/10 text-[#22C55E] text-xs font-bold rounded border border-[#22C55E]/20">AMAN</span>;
  };

  const categories = ['Semua', ...Array.from(new Set(spareparts.map(s => s.category)))];
  const suppliers = ['Semua', ...Array.from(new Set(spareparts.map(s => s.supplierId)))];

  return (
    <div className="animate-in fade-in">
      {/* TOOLBAR */}
      <div className="p-4 border-b border-border flex flex-col xl:flex-row gap-4 justify-between items-center bg-card">
        <div className="relative w-full xl:w-96 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kode atau nama sparepart..." 
            className="w-full pl-9 pr-4 py-2 bg-muted text-sm text-foreground border border-border rounded-lg focus:outline-none focus:border-[#E53935] transition-colors"
          />
        </div>
        <div className="flex gap-3 w-full xl:w-auto overflow-x-auto hide-scrollbar">
          <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="bg-muted border border-border text-muted-foreground text-sm rounded-lg px-3 py-2 outline-none focus:border-[#E53935] min-w-[140px]">
            {categories.map(c => <option key={c} value={c}>Kategori: {c}</option>)}
          </select>
          <select value={supplierFilter} onChange={e => setSupplierFilter(e.target.value)} className="bg-muted border border-border text-muted-foreground text-sm rounded-lg px-3 py-2 outline-none focus:border-[#E53935] min-w-[140px]">
            {suppliers.map(c => <option key={c} value={c}>Supplier: {c}</option>)}
          </select>
          <select value={statusFilter} onChange={e => updateUrlStatus(e.target.value)} className="bg-muted border border-border text-muted-foreground text-sm rounded-lg px-3 py-2 outline-none focus:border-[#E53935] min-w-[130px]">
            <option value="Semua">Status: Semua</option>
            <option value="Aman">Aman</option>
            <option value="Menipis">Menipis</option>
            <option value="Kosong">Kosong</option>
          </select>
          {(searchQuery || categoryFilter !== 'Semua' || statusFilter !== 'Semua' || supplierFilter !== 'Semua') && (
            <button 
              onClick={() => { setSearchQuery(''); setCategoryFilter('Semua'); updateUrlStatus('Semua'); setSupplierFilter('Semua'); }}
              className="text-xs text-[#E53935] hover:underline whitespace-nowrap px-2"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        {filteredSpareparts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Package className="w-16 h-16 text-muted-foreground/50 mb-4" />
            <p className="text-foreground font-bold text-lg mb-1">Belum ada data</p>
            <p className="text-muted-foreground text-sm mb-4">Tidak ada sparepart yang sesuai dengan filter Anda.</p>
            <button onClick={() => { setSearchQuery(''); setCategoryFilter('Semua'); updateUrlStatus('Semua'); setSupplierFilter('Semua'); }} className="px-4 py-2 bg-accent text-foreground text-sm rounded-md hover:bg-accent">Reset Pencarian</button>
          </div>
        ) : (
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-muted border-b border-border text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-bold">KODE</th>
                <th className="px-6 py-4 font-bold">NAMA SPAREPART</th>
                <th className="px-6 py-4 font-bold">KATEGORI</th>
                <th className="px-6 py-4 font-bold text-center">STOK</th>
                <th className="px-6 py-4 font-bold">HARGA</th>
                <th className="px-6 py-4 font-bold">SUPPLIER</th>
                <th className="px-6 py-4 font-bold">STATUS</th>
                <th className="px-6 py-4 font-bold text-right">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredSpareparts.map(sp => (
                <tr key={sp.id} className="hover:bg-accent/30 transition-colors group">
                  <td className="px-6 py-4 font-medium text-foreground">{sp.code}</td>
                  <td className="px-6 py-4 font-bold text-foreground">{sp.name}</td>
                  <td className="px-6 py-4"><span className="px-2.5 py-1 bg-accent text-muted-foreground rounded text-xs">{sp.category}</span></td>
                  <td className="px-6 py-4 text-center font-black text-foreground">{sp.stock} <span className="text-xs font-normal text-muted-foreground">{sp.unit}</span></td>
                  <td className="px-6 py-4 text-muted-foreground">Rp {sp.hargaJual.toLocaleString('id-ID')}</td>
                  <td className="px-6 py-4 text-muted-foreground">{sp.supplierId}</td>
                  <td className="px-6 py-4">{renderStatusBadge(sp.stock, sp.minStock)}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-muted-foreground hover:text-foreground bg-accent rounded transition-colors" title="Detail"><Eye className="w-4 h-4"/></button>
                      <button className="p-1.5 text-muted-foreground hover:text-[#3B82F6] bg-accent rounded transition-colors" title="Edit"><Edit className="w-4 h-4"/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* PAGINATION */}
      <div className="border-t border-border p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-sm text-muted-foreground">Menampilkan 1–{filteredSpareparts.length} dari {spareparts.length} sparepart</p>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 bg-accent text-muted-foreground rounded hover:text-foreground transition-colors">&lt;</button>
          <button className="px-3 py-1.5 bg-[#E53935] text-white rounded font-bold">1</button>
          <button className="px-3 py-1.5 bg-accent text-muted-foreground rounded hover:text-foreground transition-colors">&gt;</button>
        </div>
      </div>
    </div>
  );
}

export default function SemuaSparepartPage() {
  return (
    <Suspense fallback={<div className="p-10 text-muted-foreground">Memuat data...</div>}>
      <SemuaSparepartContent />
    </Suspense>
  );
}
