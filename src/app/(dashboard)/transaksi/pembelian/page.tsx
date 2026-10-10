"use client";

import React, { useState, useMemo } from "react";
import { 
  Search, Plus, FileText, X, Check, Printer, XCircle, 
  ChevronRight, Calendar, Filter, AlertCircle, Download
} from "lucide-react";
import Link from "next/link";

// --- DUMMY DATA ---
const INITIAL_PO = [
  { id: "PO-2026-001", date: "2026-09-25", supplier: "PT Auto Parts Jaya", items: 50, total: 12500000, status: "Selesai" },
  { id: "PO-2026-002", date: "2026-09-27", supplier: "CV Maju Motor", items: 20, total: 4500000, status: "Menunggu" },
  { id: "PO-2026-003", date: "2026-09-28", supplier: "Bintang Sparepart", items: 15, total: 3200000, status: "Draft" },
];

const SUPPLIERS = ["PT Auto Parts Jaya", "CV Maju Motor", "Bintang Sparepart", "Global Mandiri"];
const SPAREPARTS = [
  { id: "SP001", name: "Oli Mesin 10W-40", price: 120000 },
  { id: "SP002", name: "Kampas Rem Depan", price: 85000 },
  { id: "SP003", name: "Busi Iridium", price: 45000 },
  { id: "SP004", name: "Filter Udara", price: 65000 },
];

export default function PembelianPage() {
  const [data, setData] = useState(INITIAL_PO);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const initialFormState = {
    supplier: "",
    date: new Date().toISOString().split('T')[0],
    notes: "",
    items: [{ sparepartId: "", qty: 1, price: 0 }]
  };
  const [form, setForm] = useState(initialFormState);

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchSearch = item.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === "Semua" || item.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [data, searchTerm, statusFilter]);

  const metrics = {
    total: data.reduce((acc, curr) => acc + curr.total, 0),
    count: data.length,
    pending: data.filter(d => d.status === "Menunggu").length,
    selesai: data.filter(d => d.status === "Selesai").length,
  };

  const handleAddItem = () => {
    setForm({ ...form, items: [...form.items, { sparepartId: "", qty: 1, price: 0 }] });
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...form.items];
    if (field === 'sparepartId') {
      const sp = SPAREPARTS.find(s => s.id === value);
      newItems[index] = { ...newItems[index], sparepartId: value, price: sp ? sp.price : 0 };
    } else {
      newItems[index] = { ...newItems[index], [field]: value };
    }
    setForm({ ...form, items: newItems });
  };

  const handleRemoveItem = (index: number) => {
    const newItems = form.items.filter((_, i) => i !== index);
    setForm({ ...form, items: newItems });
  };

  const formTotal = form.items.reduce((acc, item) => acc + (item.qty * item.price), 0);
  const formTotalItems = form.items.reduce((acc, item) => acc + Number(item.qty), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.supplier || form.items.length === 0 || !form.items[0].sparepartId) {
      alert("Harap lengkapi data supplier dan item!");
      return;
    }

    if (editingId) {
      setData(data.map(po => po.id === editingId ? { ...po, date: form.date, supplier: form.supplier, items: formTotalItems, total: formTotal } : po));
    } else {
      const newPO = {
        id: `PO-2026-00${data.length + 1}`,
        date: form.date,
        supplier: form.supplier,
        items: formTotalItems,
        total: formTotal,
        status: "Menunggu"
      };
      setData([newPO, ...data]);
    }

    closeModal();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleEdit = (po: any) => {
    setEditingId(po.id);
    setForm({
      supplier: po.supplier,
      date: po.date,
      notes: "",
      items: [{ sparepartId: "SP001", qty: po.items, price: Math.floor(po.total / po.items) }] // Simulated items for edit
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
        <div className="fixed top-6 right-6 bg-green-600 text-foreground px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50 animate-in fade-in slide-in-from-top-5">
          <CheckCircle2 className="w-5 h-5" />
          <div>
            <p className="font-semibold text-sm">Berhasil!</p>
            <p className="text-xs text-green-100">Data pembelian (PO) berhasil disimpan.</p>
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
          <span className="text-gray-200 font-medium">Pembelian</span>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-foreground">Pembelian Sparepart</h1>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-red-600 hover:bg-red-700 text-foreground px-4 py-2.5 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors shadow-lg shadow-red-900/20"
          >
            <Plus className="w-4 h-4" />
            Buat Pembelian Baru
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#1e293b] border border-gray-800 rounded-xl p-5 shadow-sm">
          <p className="text-sm text-gray-400 font-medium mb-1">Total Pembelian Bulan Ini</p>
          <div className="flex items-end gap-3">
            <h3 className="text-2xl font-bold text-foreground">{formatRp(metrics.total)}</h3>
            <span className="text-sm text-gray-400 mb-1">({metrics.count} PO)</span>
          </div>
        </div>
        <div className="bg-[#1e293b] border border-gray-800 rounded-xl p-5 shadow-sm">
          <p className="text-sm text-gray-400 font-medium mb-1">Menunggu Konfirmasi</p>
          <h3 className="text-2xl font-bold text-amber-500">{metrics.pending} <span className="text-sm font-normal text-gray-400">Pesanan</span></h3>
        </div>
        <div className="bg-[#1e293b] border border-gray-800 rounded-xl p-5 shadow-sm">
          <p className="text-sm text-gray-400 font-medium mb-1">Selesai / Diterima</p>
          <h3 className="text-2xl font-bold text-green-500">{metrics.selesai} <span className="text-sm font-normal text-gray-400">Pesanan</span></h3>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="bg-[#1e293b] border border-gray-800 rounded-xl p-4 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-500" />
            <input 
              type="text" 
              placeholder="Cari No. PO atau Supplier..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0f172a] border border-gray-700 text-sm rounded-lg pl-9 pr-4 py-2.5 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none text-foreground placeholder-gray-500 transition-colors"
            />
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#0f172a] border border-gray-700 text-sm rounded-lg px-4 py-2.5 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none text-foreground w-full sm:w-auto"
          >
            <option value="Semua">Semua Status</option>
            <option value="Draft">Draft</option>
            <option value="Menunggu">Menunggu</option>
            <option value="Diproses">Diproses</option>
            <option value="Selesai">Selesai</option>
            <option value="Dibatalkan">Dibatalkan</option>
          </select>
        </div>
        <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-foreground bg-[#0f172a] border border-gray-700 px-4 py-2.5 rounded-lg transition-colors w-full md:w-auto justify-center">
          <Download className="w-4 h-4" />
          Export Excel
        </button>
      </div>

      {/* Table */}
      <div className="bg-[#1e293b] border border-gray-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#0f172a]/50 text-gray-400 uppercase text-xs border-b border-gray-800 font-semibold">
              <tr>
                <th className="px-6 py-4">Tanggal</th>
                <th className="px-6 py-4">No. PO</th>
                <th className="px-6 py-4">Supplier</th>
                <th className="px-6 py-4">Total Item</th>
                <th className="px-6 py-4">Total Biaya</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {filteredData.length > 0 ? (
                filteredData.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-4 text-gray-300">{row.date}</td>
                    <td className="px-6 py-4 font-medium text-foreground">{row.id}</td>
                    <td className="px-6 py-4 text-gray-300">{row.supplier}</td>
                    <td className="px-6 py-4 text-gray-300">{row.items} Pcs</td>
                    <td className="px-6 py-4 font-medium text-foreground">{formatRp(row.total)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border
                        ${row.status === 'Selesai' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                          row.status === 'Menunggu' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                          'bg-gray-500/10 text-gray-400 border-gray-500/20'}`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-3 text-gray-400">
                        <button onClick={() => handleEdit(row)} className="hover:text-blue-400 transition-colors" title="Edit"><FileText className="w-4 h-4" /></button>
                        <button className="hover:text-foreground transition-colors" title="Cetak"><Printer className="w-4 h-4" /></button>
                        <button className="hover:text-red-400 transition-colors" title="Batalkan"><XCircle className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <AlertCircle className="w-10 h-10 mb-3 text-gray-600" />
                      <p className="text-base">Data pembelian tidak ditemukan</p>
                      <p className="text-sm mt-1">Coba sesuaikan filter atau kata kunci pencarian Anda.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal / Form Create PO */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1e293b] border border-gray-700 rounded-2xl w-full max-w-3xl flex flex-col max-h-[90vh] shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-800">
              <h2 className="text-xl font-bold text-foreground">{editingId ? 'Edit Pembelian' : 'Buat Pembelian Baru (PO)'}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-foreground transition-colors p-1 bg-gray-800 rounded-lg hover:bg-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <form id="po-form" onSubmit={handleSubmit} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Supplier <span className="text-red-500">*</span></label>
                    <select 
                      required
                      value={form.supplier}
                      onChange={(e) => setForm({...form, supplier: e.target.value})}
                      className="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-4 py-2.5 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none text-foreground text-sm"
                    >
                      <option value="">-- Pilih Supplier --</option>
                      {SUPPLIERS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Tanggal Pembelian <span className="text-red-500">*</span></label>
                    <input 
                      type="date"
                      required
                      value={form.date}
                      onChange={(e) => setForm({...form, date: e.target.value})}
                      className="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-4 py-2.5 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none text-foreground text-sm [color-scheme:dark]"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-sm font-medium text-gray-300">Item Sparepart <span className="text-red-500">*</span></label>
                    <button type="button" onClick={handleAddItem} className="text-xs text-red-400 hover:text-red-300 font-medium flex items-center gap-1">
                      <Plus className="w-3 h-3" /> Tambah Item
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {form.items.map((item, index) => (
                      <div key={index} className="flex gap-3 items-start bg-[#0f172a] p-3 rounded-lg border border-gray-800">
                        <div className="flex-1">
                          <select 
                            required
                            value={item.sparepartId}
                            onChange={(e) => handleItemChange(index, 'sparepartId', e.target.value)}
                            className="w-full bg-[#1e293b] border border-gray-700 rounded-md px-3 py-2 text-sm focus:border-red-500 outline-none text-foreground"
                          >
                            <option value="">Pilih Sparepart</option>
                            {SPAREPARTS.map(sp => <option key={sp.id} value={sp.id}>{sp.id} - {sp.name}</option>)}
                          </select>
                        </div>
                        <div className="w-24">
                          <input 
                            type="number" min="1" required
                            value={item.qty}
                            onChange={(e) => handleItemChange(index, 'qty', parseInt(e.target.value) || 0)}
                            className="w-full bg-[#1e293b] border border-gray-700 rounded-md px-3 py-2 text-sm focus:border-red-500 outline-none text-foreground text-center"
                            placeholder="Qty"
                          />
                        </div>
                        <div className="w-36">
                          <input 
                            type="number" min="0" required
                            value={item.price}
                            onChange={(e) => handleItemChange(index, 'price', parseInt(e.target.value) || 0)}
                            className="w-full bg-[#1e293b] border border-gray-700 rounded-md px-3 py-2 text-sm focus:border-red-500 outline-none text-foreground text-right"
                            placeholder="Harga Satuan"
                          />
                        </div>
                        <div className="w-36 pt-2 text-right font-medium text-sm text-gray-300">
                          {formatRp(item.qty * item.price)}
                        </div>
                        <button type="button" onClick={() => handleRemoveItem(index)} disabled={form.items.length === 1} className="p-2 text-gray-500 hover:text-red-500 transition-colors disabled:opacity-30">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-end mt-4 pt-4 border-t border-gray-800">
                    <div className="text-right">
                      <p className="text-sm text-gray-400 mb-1">Total Estimasi Pembelian</p>
                      <p className="text-2xl font-bold text-foreground">{formatRp(formTotal)}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Catatan PO / Keterangan (Opsional)</label>
                  <textarea 
                    rows={3}
                    value={form.notes}
                    onChange={(e) => setForm({...form, notes: e.target.value})}
                    placeholder="Masukkan instruksi khusus atau estimasi kedatangan..."
                    className="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-4 py-3 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none text-foreground text-sm resize-none"
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
                form="po-form"
                className="bg-red-600 hover:bg-red-700 text-foreground px-6 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-red-900/20 flex items-center gap-2"
              >
                <Check className="w-4 h-4" /> Simpan PO
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CheckCircle2(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
