'use client';

import { useState } from 'react';
import { useGlobalContext } from '@/context/GlobalContext';
import { Search, Activity, Package } from 'lucide-react';

export default function StokOpnamePage() {
  const { spareparts, addOpname } = useGlobalContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [physicalStocks, setPhysicalStocks] = useState<Record<string, string>>({});

  const filteredSpareparts = spareparts.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStockChange = (id: string, value: string) => {
    setPhysicalStocks(prev => ({ ...prev, [id]: value }));
  };

  const handleSaveOpname = (id: string) => {
    const physicalStr = physicalStocks[id];
    if (physicalStr === undefined || physicalStr === '') return;
    const physical = parseInt(physicalStr);
    if (isNaN(physical) || physical < 0) return;
    
    addOpname(id, physical, 'Penyesuaian stok opname manual');
    
    // Clear input after save
    setPhysicalStocks(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  return (
    <div className="animate-in fade-in p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">Stok Opname</h2>
          <p className="text-muted-foreground text-sm">Cek dan sesuaikan stok fisik dengan stok sistem.</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari sparepart..." 
            className="w-full pl-9 pr-4 py-2 bg-muted text-sm text-foreground border border-border rounded-lg focus:outline-none focus:border-[#E53935] transition-colors"
          />
        </div>
      </div>

      <div className="overflow-x-auto border border-border rounded-lg">
        {filteredSpareparts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-card">
            <Package className="w-16 h-16 text-muted-foreground/50 mb-4" />
            <p className="text-foreground font-bold text-lg mb-1">Tidak ada data</p>
            <p className="text-muted-foreground text-sm mb-4">Sparepart yang Anda cari tidak ditemukan.</p>
          </div>
        ) : (
          <table className="w-full text-left text-sm whitespace-nowrap bg-card">
            <thead className="bg-muted border-b border-border text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-bold">KODE</th>
                <th className="px-6 py-4 font-bold">SPAREPART</th>
                <th className="px-6 py-4 font-bold text-center">STOK SISTEM</th>
                <th className="px-6 py-4 font-bold text-center">STOK FISIK</th>
                <th className="px-6 py-4 font-bold text-center">SELISIH</th>
                <th className="px-6 py-4 font-bold">KETERANGAN</th>
                <th className="px-6 py-4 font-bold text-right">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredSpareparts.map(sp => {
                const physicalInput = physicalStocks[sp.id];
                const hasInput = physicalInput !== undefined && physicalInput !== '';
                const physicalVal = hasInput ? parseInt(physicalInput) : sp.stock;
                const diff = hasInput ? physicalVal - sp.stock : 0;
                
                return (
                  <tr key={sp.id} className="hover:bg-accent/30 transition-colors">
                    <td className="px-6 py-4 text-foreground font-medium">{sp.code}</td>
                    <td className="px-6 py-4 text-foreground font-bold">{sp.name}</td>
                    <td className="px-6 py-4 text-center font-bold text-muted-foreground">{sp.stock} {sp.unit}</td>
                    <td className="px-6 py-4 text-center">
                      <input 
                        type="number" 
                        min="0"
                        placeholder={sp.stock.toString()}
                        value={physicalInput || ''}
                        onChange={(e) => handleStockChange(sp.id, e.target.value)}
                        className="w-20 px-2 py-1 text-center bg-muted border border-border text-foreground rounded focus:outline-none focus:border-[#E53935]"
                      />
                    </td>
                    <td className="px-6 py-4 text-center font-bold">
                      {hasInput ? (
                        <span className={diff > 0 ? 'text-[#22C55E]' : diff < 0 ? 'text-[#EF4444]' : 'text-muted-foreground'}>
                          {diff > 0 ? `+${diff}` : diff}
                        </span>
                      ) : (
                        <span className="text-muted-foreground/50">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {hasInput && diff !== 0 ? (
                        <span className="text-xs px-2 py-1 rounded bg-[#F59E0B]/10 text-[#F59E0B]">Selisih terdeteksi</span>
                      ) : hasInput && diff === 0 ? (
                        <span className="text-xs px-2 py-1 rounded bg-[#22C55E]/10 text-[#22C55E]">Sesuai</span>
                      ) : (
                        <span className="text-xs text-muted-foreground/50">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        disabled={!hasInput}
                        onClick={() => handleSaveOpname(sp.id)}
                        className={`px-4 py-1.5 rounded text-xs font-bold transition-colors ${
                          hasInput 
                            ? 'bg-[#3B82F6] hover:bg-[#2563EB] text-foreground' 
                            : 'bg-accent text-muted-foreground cursor-not-allowed'
                        }`}
                      >
                        Simpan
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
