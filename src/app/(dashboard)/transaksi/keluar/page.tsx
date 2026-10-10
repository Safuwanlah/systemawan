"use client";

import React, { useState, useMemo } from "react";
import { 
  Search, Minus, X, Check, Download, AlertCircle, ChevronRight, PackageMinus, Info
} from "lucide-react";
import Link from "next/link";

// --- DUMMY DATA ---
const INITIAL_OUTBOUND = [
  { id: "OUT-2026-001", date: "2026-09-28 10:30", sparepart: "Kampas Rem Depan", qty: 1, reason: "Servis/PKB", reference: "B 1234 ABC / SRV-001", mechanic: "Budi", note: "Penggantian rutin" },
  { id: "OUT-2026-002", date: "2026-09-28 15:45", sparepart: "Oli Mesin 10W-40", qty: 2, reason: "Penjualan Langsung", reference: "INV-089", mechanic: "Admin", note: "Beli langsung ke kasir" },
  { id: "OUT-2026-003", date: "2026-09-29 11:20", sparepart: "Filter Udara", qty: 1, reason: "Scrap/Rusak", reference: "-", mechanic: "Admin", note: "Kemasan rusak / cacat" },
];

const SPAREPARTS = [
  { id: "SP001", name: "Oli Mesin 10W-40", price: 120000, stock: 45 },
  { id: "SP002", name: "Kampas Rem Depan", price: 85000, stock: 12 },
  { id: "SP003", name: "Busi Iridium", price: 45000, stock: 100 },
  { id: "SP004", name: "Filter Udara", price: 65000, stock: 0 }, // Out of stock example
];

const REASONS = ["Servis/PKB", "Penjualan Langsung", "Scrap/Rusak"];

export default function BarangKeluarPage() {
  const [data, setData] = useState(INITIAL_OUTBOUND);
  const [searchTerm, setSearchTerm] = useState("");
  const [reasonFilter, setReasonFilter] = useState("Semua");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const initialFormState = {
    sparepartId: "",
    qty: 1,
    date: new Date().toISOString().slice(0, 16),
    reason: "Servis/PKB",
    reference: "",
    mechanic: "",
    note: ""
  };
  const [form, setForm] = useState(initialFormState);

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchSearch = item.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.sparepart.toLowerCase().includes(searchTerm.toLowerCase());
      const matchReason = reasonFilter === "Semua" || item.reason === reasonFilter;
      return matchSearch && matchReason;
    });
  }, [data, searchTerm, reasonFilter]);

  const metrics = {
    todayQty: data.filter(d => d.date.startsWith("2026-09-29")).reduce((acc, curr) => acc + curr.qty, 0),
    topItem: "Oli Mesin 10W-40",
    totalValue: data.reduce((acc, curr) => {
      const sp = SPAREPARTS.find(s => s.name === curr.sparepart);
      return acc + (curr.qty * (sp ? sp.price : 0));
    }, 0),
  };

  const selectedSparepart = SPAREPARTS.find(s => s.id === form.sparepartId);
  const isQtyInvalid = selectedSparepart ? form.qty > selectedSparepart.stock : false;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.sparepartId || form.qty <= 0) {
      alert("Harap lengkapi data yang wajib diisi!");
      return;
    }
    
    if (isQtyInvalid) {
      alert("Kuantitas keluar tidak boleh melebihi stok tersedia!");
      return;
    }

    if (editingId) {
      setData(data.map(item => item.id === editingId ? { ...item, date: form.date.replace("T", " "), sparepart: selectedSparepart!.name, qty: form.qty, reason: form.reason, reference: form.reference || "-", mechanic: form.mechanic || "Admin", note: form.note || "-" } : item));
    } else {
      const newOutbound = {
        id: `OUT-2026-00${data.length + 1}`,
        date: form.date.replace("T", " "),
        sparepart: selectedSparepart!.name,
        qty: form.qty,
        reason: form.reason,
        reference: form.reference || "-",
        mechanic: form.mechanic || "Admin",
        note: form.note || "-"
      };
      setData([newOutbound, ...data]);
    }
    
    closeModal();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    const sp = SPAREPARTS.find(s => s.name === item.sparepart);
    setForm({
      sparepartId: sp ? sp.id : "",
      qty: item.qty,
      date: item.date.replace(" ", "T"),
      reason: item.reason,
      reference: item.reference === "-" ? "" : item.reference,
      mechanic: item.mechanic,
      note: item.note === "-" ? "" : item.note
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setForm(initialFormState);
  };

  const formatRp = (val: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(val);

  return (
    <div className="min-h-screen bg-[#0f172a] text-gray-200 p-6 font-sans">
      
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-6 right-6 bg-red-600 text-foreground px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50 animate-in fade-in slide-in-from-top-5">
          <div className="bg-white/20 p-1 rounded-full"><Check className="w-4 h-4" /></div>
          <div>
            <p className="font-semibold text-sm">Berhasil!</p>
            <p className="text-xs text-red-100">Data barang keluar berhasil dicatat. Stok berkurang.</p>
          </div>
        </div>
      )}

      {/* Header & Breadcrumb */}
      <div className="mb-8">
        <div className="flex items-center text-sm text-gray-400 mb-2">
          <Link href="/" className="hover:text-red-400 transition-colors">Beranda</Link>
          <ChevronRight className="w-4 h-4 mx-1" />
          <span>Transaksi</span>
          <ChevronRight className="w-4 h-4 mx-1" />
          <span className="text-gray-200 font-medium">Barang Keluar</span>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-foreground">Transaksi Barang Keluar</h1>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-red-600 hover:bg-red-700 text-foreground px-4 py-2.5 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors shadow-lg shadow-red-900/20"
          >
            <Minus className="w-4 h-4" />
            Catat Barang Keluar
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#1e293b] border border-gray-800 rounded-xl p-5 shadow-sm">
          <p className="text-sm text-gray-400 font-medium mb-1">Total Keluar Hari Ini</p>
          <div className="flex items-end gap-3">
            <h3 className="text-2xl font-bold text-red-500">-{metrics.todayQty}</h3>
            <span className="text-sm text-gray-400 mb-1">Items</span>
          </div>
        </div>
        <div className="bg-[#1e293b] border border-gray-800 rounded-xl p-5 shadow-sm">
          <p className="text-sm text-gray-400 font-medium mb-1">Terbanyak Keluar</p>
          <h3 className="text-2xl font-bold text-foreground truncate" title={metrics.topItem}>{metrics.topItem}</h3>
        </div>
        <div className="bg-[#1e293b] border border-gray-800 rounded-xl p-5 shadow-sm">
          <p className="text-sm text-gray-400 font-medium mb-1">Total Nilai Keluar (Estimasi)</p>
          <h3 className="text-2xl font-bold text-foreground">{formatRp(metrics.totalValue)}</h3>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="bg-[#1e293b] border border-gray-800 rounded-xl p-4 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-500" />
            <input 
              type="text" 
              placeholder="Cari No. TRX atau Sparepart..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0f172a] border border-gray-700 text-sm rounded-lg pl-9 pr-4 py-2.5 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none text-foreground placeholder-gray-500 transition-colors"
            />
          </div>
          <select 
            value={reasonFilter}
            onChange={(e) => setReasonFilter(e.target.value)}
            className="bg-[#0f172a] border border-gray-700 text-sm rounded-lg px-4 py-2.5 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none text-foreground w-full sm:w-auto"
          >
            <option value="Semua">Semua Alasan</option>
            {REASONS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-foreground bg-[#0f172a] border border-gray-700 px-4 py-2.5 rounded-lg transition-colors w-full md:w-auto justify-center">
          <Download className="w-4 h-4" />
          Export Data
        </button>
      </div>

      {/* Table */}
      <div className="bg-[#1e293b] border border-gray-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#0f172a]/50 text-gray-400 uppercase text-xs border-b border-gray-800 font-semibold">
              <tr>
                <th className="px-6 py-4">Waktu</th>
                <th className="px-6 py-4">No. TRX</th>
                <th className="px-6 py-4">Sparepart</th>
                <th className="px-6 py-4 text-center">Jumlah</th>
                <th className="px-6 py-4">Alasan</th>
                <th className="px-6 py-4">No. Polisi / Ref</th>
                <th className="px-6 py-4">Mekanik/Admin</th>
                <th className="px-6 py-4">Keterangan</th>
                <th className="px-6 py-4">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {filteredData.length > 0 ? (
                filteredData.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-4 text-gray-300">{row.date}</td>
                    <td className="px-6 py-4 font-medium text-foreground">{row.id}</td>
                    <td className="px-6 py-4 font-medium text-gray-200">{row.sparepart}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-500 border border-red-500/20">
                        -{row.qty}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{row.reason}</td>
                    <td className="px-6 py-4 text-gray-400">{row.reference}</td>
                    <td className="px-6 py-4 text-gray-300">{row.mechanic}</td>
                    <td className="px-6 py-4 text-gray-400">{row.note}</td>
                    <td className="px-6 py-4">
                      <button onClick={() => handleEdit(row)} className="text-blue-400 hover:text-blue-300 text-sm">Edit</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <PackageMinus className="w-10 h-10 mb-3 text-gray-600" />
                      <p className="text-base">Tidak ada transaksi barang keluar</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal / Form Catat Barang Keluar */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1e293b] border border-gray-700 rounded-2xl w-full max-w-lg flex flex-col max-h-[90vh] shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-800">
              <h2 className="text-xl font-bold text-foreground">{editingId ? 'Edit Barang Keluar' : 'Catat Barang Keluar'}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-foreground transition-colors p-1 bg-gray-800 rounded-lg hover:bg-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form id="outbound-form" onSubmit={handleSubmit} className="space-y-5">
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Pilih Sparepart <span className="text-red-500">*</span></label>
                  <select 
                    required
                    value={form.sparepartId}
                    onChange={(e) => setForm({...form, sparepartId: e.target.value})}
                    className="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-4 py-2.5 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none text-foreground text-sm"
                  >
                    <option value="">-- Cari Sparepart --</option>
                    {SPAREPARTS.map(sp => (
                      <option key={sp.id} value={sp.id} disabled={sp.stock === 0} className={sp.stock === 0 ? "text-gray-600" : ""}>
                        {sp.name} (Stok: {sp.stock}) {sp.stock === 0 ? '- HABIS' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Jumlah Keluar <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-red-500 font-bold">-</span>
                      <input 
                        type="number"
                        min="1"
                        required
                        value={form.qty}
                        onChange={(e) => setForm({...form, qty: parseInt(e.target.value) || 0})}
                        className={`w-full bg-[#0f172a] border rounded-lg pl-8 pr-4 py-2.5 outline-none text-foreground text-sm transition-colors
                          ${isQtyInvalid ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-gray-700 focus:border-red-500 focus:ring-1 focus:ring-red-500'}`}
                      />
                    </div>
                    {isQtyInvalid && (
                      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> Melebihi stok!
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Tanggal & Waktu <span className="text-red-500">*</span></label>
                    <input 
                      type="datetime-local"
                      required
                      value={form.date}
                      onChange={(e) => setForm({...form, date: e.target.value})}
                      className="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-3 py-2.5 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none text-foreground text-sm [color-scheme:dark]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Alasan Pengeluaran <span className="text-red-500">*</span></label>
                  <select 
                    required
                    value={form.reason}
                    onChange={(e) => setForm({...form, reason: e.target.value})}
                    className="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-4 py-2.5 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none text-foreground text-sm"
                  >
                    {REASONS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">No. Plat / Ref</label>
                    <input 
                      type="text"
                      value={form.reference}
                      onChange={(e) => setForm({...form, reference: e.target.value})}
                      placeholder="B 1234 ABC"
                      className="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-4 py-2.5 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none text-foreground text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Mekanik</label>
                    <input 
                      type="text"
                      value={form.mechanic}
                      onChange={(e) => setForm({...form, mechanic: e.target.value})}
                      placeholder="Nama mekanik..."
                      className="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-4 py-2.5 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none text-foreground text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Keterangan Tambahan</label>
                  <textarea 
                    rows={2}
                    value={form.note}
                    onChange={(e) => setForm({...form, note: e.target.value})}
                    placeholder="Catatan..."
                    className="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-4 py-2.5 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none text-foreground text-sm resize-none"
                  ></textarea>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-gray-800 bg-[#1e293b] rounded-b-2xl flex justify-end gap-3">
              <button 
                type="button" 
                onClick={closeModal}
                className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:text-foreground hover:bg-gray-800 transition-colors"
              >
                Batal
              </button>
              <button 
                type="submit" 
                form="outbound-form"
                disabled={isQtyInvalid}
                className="bg-red-600 hover:bg-red-700 text-foreground px-6 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-red-900/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check className="w-4 h-4" /> {editingId ? 'Simpan Perubahan' : 'Simpan Pengeluaran'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
