'use client';

import { createContext, useContext, useState, useMemo, ReactNode, useEffect } from 'react';

export type Sparepart = {
  id: string;
  code: string;
  name: string;
  merek: string;
  category: string;
  unit: string;
  hargaBeli: number;
  hargaJual: number;
  stock: number;
  minStock: number;
  location: string;
  supplierId: string;
  status: 'AMAN' | 'MENIPIS' | 'KOSONG';
};

export type Supplier = {
  id: string;
  code: string;
  name: string;
  contact: string;
  phone: string;
  email: string;
  address: string;
  status: 'Aktif' | 'Tidak Aktif';
};

export type Transaction = {
  id: string;
  nomorTransaksi: string;
  date: string;
  type: 'MASUK' | 'KELUAR' | 'OPNAME';
  sparepartId: string;
  quantity: number;
  supplierId?: string;
  keperluan?: string;
  harga: number;
  reference: string;
  officer: string;
  keterangan: string;
};

export type Notification = {
  id: string;
  sparepartId: string;
  type: 'MENIPIS' | 'KOSONG';
  title: string;
  message: string;
  date: string;
  read: boolean;
};

interface GlobalContextType {
  spareparts: Sparepart[];
  suppliers: Supplier[];
  transactions: Transaction[];
  notifications: Notification[];
  
  // Actions
  addStockIn: (data: Omit<Transaction, 'id' | 'type' | 'nomorTransaksi'>) => void;
  addStockOut: (data: Omit<Transaction, 'id' | 'type' | 'nomorTransaksi'>) => Promise<boolean>;
  addOpname: (sparepartId: string, physicalStock: number, keterangan: string) => void;
  addSparepart: (data: Omit<Sparepart, 'id' | 'status'>) => void;
  updateSparepart: (id: string, data: Partial<Sparepart>) => void;
  deleteSparepart: (id: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  
  // UI Actions
  toast: { message: string, type: 'success'|'error' } | null;
  showToast: (message: string, type?: 'success'|'error') => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

// --- DUMMY DATA INITIALIZATION ---
const initialSuppliers: Supplier[] = [
  { id: 'S1', code: 'SPL001', name: 'PT Auto Jaya', contact: 'Budi Santoso', phone: '081234567890', email: 'budi@autojaya.com', address: 'Jl. Otomotif Raya No 1', status: 'Aktif' },
  { id: 'S2', code: 'SPL002', name: 'PT Motorindo', contact: 'Agus Setiawan', phone: '081298765432', email: 'agus@motorindo.com', address: 'Jl. Mesin Industri No 12', status: 'Aktif' },
  { id: 'S3', code: 'SPL003', name: 'PT Sumber Motor', contact: 'Citra Kirana', phone: '081122334455', email: 'citra@sumbermotor.com', address: 'Kawasan Industri Kendaraan', status: 'Aktif' },
];

const calculateStatus = (stock: number, min: number): 'KOSONG' | 'MENIPIS' | 'AMAN' => {
  if (stock === 0) return 'KOSONG';
  if (stock <= min) return 'MENIPIS';
  return 'AMAN';
};

const initialSpareparts: Sparepart[] = [
  { id: '1', code: 'BRK001', name: 'Kampas Rem Depan', merek: 'Bendix', category: 'Rem', unit: 'set', hargaBeli: 100000, hargaJual: 125000, stock: 24, minStock: 10, location: 'Rak A1', supplierId: 'S1', status: 'AMAN' },
  { id: '2', code: 'BRK002', name: 'Kampas Rem Belakang', merek: 'Astra', category: 'Rem', unit: 'set', hargaBeli: 60000, hargaJual: 85000, stock: 5, minStock: 10, location: 'Rak A2', supplierId: 'S1', status: 'MENIPIS' },
  { id: '3', code: 'OLI001', name: 'Oli Mesin 10W-40', merek: 'Motul', category: 'Oli', unit: 'botol', hargaBeli: 140000, hargaJual: 165000, stock: 8, minStock: 15, location: 'Rak B1', supplierId: 'S3', status: 'MENIPIS' },
  { id: '4', code: 'OLI002', name: 'Oli Gardan', merek: 'Yamalube', category: 'Oli', unit: 'botol', hargaBeli: 35000, hargaJual: 45000, stock: 32, minStock: 10, location: 'Rak B2', supplierId: 'S3', status: 'AMAN' },
  { id: '5', code: 'BUS001', name: 'Busi Iridium', merek: 'NGK', category: 'Mesin', unit: 'pcs', hargaBeli: 75000, hargaJual: 95000, stock: 45, minStock: 20, location: 'Rak C1', supplierId: 'S2', status: 'AMAN' },
  { id: '6', code: 'FIL001', name: 'Filter Udara', merek: 'Ferrox', category: 'Filter', unit: 'pcs', hargaBeli: 350000, hargaJual: 450000, stock: 0, minStock: 5, location: 'Rak C2', supplierId: 'S1', status: 'KOSONG' },
  { id: '7', code: 'FIL002', name: 'Filter Oli', merek: 'K&N', category: 'Filter', unit: 'pcs', hargaBeli: 150000, hargaJual: 185000, stock: 12, minStock: 10, location: 'Rak C3', supplierId: 'S2', status: 'AMAN' },
  { id: '8', code: 'BAT001', name: 'Aki Motor', merek: 'GS Astra', category: 'Kelistrikan', unit: 'pcs', hargaBeli: 220000, hargaJual: 280000, stock: 0, minStock: 5, location: 'Rak D1', supplierId: 'S3', status: 'KOSONG' },
  { id: '9', code: 'RNT001', name: 'Rantai Motor', merek: 'SSS', category: 'Transmisi', unit: 'pcs', hargaBeli: 180000, hargaJual: 210000, stock: 3, minStock: 5, location: 'Rak E1', supplierId: 'S2', status: 'MENIPIS' },
  { id: '10', code: 'GRT001', name: 'Gear Set', merek: 'Sinnob', category: 'Transmisi', unit: 'set', hargaBeli: 300000, hargaJual: 350000, stock: 7, minStock: 10, location: 'Rak E2', supplierId: 'S2', status: 'MENIPIS' },
];

const initialTransactions: Transaction[] = [
  { id: 'T1', nomorTransaksi: 'TRX-001', date: '2026-09-28 09:15', type: 'MASUK', sparepartId: '3', quantity: 10, supplierId: 'S3', keperluan: '', harga: 140000, reference: 'PO-2609-001', officer: 'Admin', keterangan: 'Restock mingguan' },
  { id: 'T2', nomorTransaksi: 'TRX-002', date: '2026-09-28 10:30', type: 'KELUAR', sparepartId: '1', quantity: 1, supplierId: '', keperluan: 'Servis Kendaraan', harga: 125000, reference: 'SRV-2609-042', officer: 'Admin', keterangan: 'Penggantian kampas rem' },
];

export function GlobalProvider({ children }: { children: ReactNode }) {
  const [spareparts, setSpareparts] = useState<Sparepart[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [toast, setToast] = useState<{message: string, type: 'success'|'error'} | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Generate notifications dynamically based on current stock levels vs existing notifications
  useEffect(() => {
    setSpareparts(currentParts => {
      const newNotifs: Notification[] = [];
      let partsChanged = false;
      const updatedParts = currentParts.map(sp => {
        const newStatus = calculateStatus(sp.stock, sp.minStock);
        if (newStatus !== sp.status) partsChanged = true;

        if (newStatus === 'KOSONG') {
          newNotifs.push({
            id: `N-${sp.id}-0`,
            sparepartId: sp.id,
            type: 'KOSONG',
            title: 'Stok Kosong',
            message: `${sp.name} saat ini tidak tersedia.`,
            date: new Date().toISOString(),
            read: false
          });
        } else if (newStatus === 'MENIPIS') {
          newNotifs.push({
            id: `N-${sp.id}-1`,
            sparepartId: sp.id,
            type: 'MENIPIS',
            title: 'Stok Menipis',
            message: `${sp.name} hanya tersisa ${sp.stock} ${sp.unit}.`,
            date: new Date().toISOString(),
            read: false
          });
        }
        return { ...sp, status: newStatus };
      });

      if (newNotifs.length > 0) {
        setNotifications(prev => {
          // Merge avoiding duplicates (simple logic: don't add if a similar unread notification exists for the same sparepartId and type)
          const filteredNew = newNotifs.filter(nn => !prev.some(p => p.sparepartId === nn.sparepartId && p.type === nn.type && !p.read));
          return [...filteredNew, ...prev];
        });
      }

      return partsChanged ? updatedParts : currentParts;
    });
  }, [transactions]); // Recalculate whenever transactions occur (which change stock)

  // Initialization check for initial data
  useEffect(() => {
    fetch('/api/spareparts')
      .then(res => res.json())
      .then(data => {
        // Compute status for fetched data
        const processed = data.map((sp: any) => ({
          ...sp,
          status: calculateStatus(sp.stock, sp.minStock)
        }));
        setSpareparts(processed);
      })
      .catch(console.error);

    fetch('/api/transactions')
      .then(res => res.json())
      .then(data => {
        setTransactions(data);
      })
      .catch(console.error);
  }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const addStockIn = async (data: Omit<Transaction, 'id' | 'type' | 'nomorTransaksi'>) => {
    const sp = spareparts.find(s => s.id === data.sparepartId);
    if (!sp || data.quantity <= 0) return;
    
    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, type: 'MASUK' })
      });
      if (res.ok) {
        const newTx = await res.json();
        setSpareparts(prev => prev.map(s => s.id === data.sparepartId ? { ...s, stock: s.stock + data.quantity, status: calculateStatus(s.stock + data.quantity, s.minStock) } : s));
        setTransactions(prev => [newTx, ...prev]);
        showToast(`Stok ${sp.name} berhasil ditambahkan (+${data.quantity})`);
      } else {
        const err = await res.json();
        showToast(err.error || 'Gagal mencatat transaksi', 'error');
      }
    } catch (e) {
      showToast('Kesalahan jaringan', 'error');
    }
  };

  const addStockOut = async (data: Omit<Transaction, 'id' | 'type' | 'nomorTransaksi'>) => {
    const sp = spareparts.find(s => s.id === data.sparepartId);
    if (!sp) return false;
    if (data.quantity > sp.stock) {
      showToast(`Stok tidak mencukupi! Stok tersedia hanya ${sp.stock} ${sp.unit}.`, 'error');
      return false;
    }

    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, type: 'KELUAR' })
      });
      if (res.ok) {
        const newTx = await res.json();
        setSpareparts(prev => prev.map(s => s.id === data.sparepartId ? { ...s, stock: s.stock - data.quantity, status: calculateStatus(s.stock - data.quantity, s.minStock) } : s));
        setTransactions(prev => [newTx, ...prev]);
        showToast(`Stok ${sp.name} berhasil dikeluarkan (-${data.quantity})`);
        return true;
      } else {
        const err = await res.json();
        showToast(err.error || 'Gagal mencatat transaksi', 'error');
        return false;
      }
    } catch (e) {
      showToast('Kesalahan jaringan', 'error');
      return false;
    }
  };

  const addOpname = (sparepartId: string, physicalStock: number, keterangan: string) => {
    const sp = spareparts.find(s => s.id === sparepartId);
    if (!sp) return;
    const diff = physicalStock - sp.stock;
    setSpareparts(prev => prev.map(s => s.id === sparepartId ? { ...s, stock: physicalStock, status: calculateStatus(physicalStock, s.minStock) } : s));
    setTransactions(prev => [{
      id: `OPN${Math.floor(Math.random()*100000)}`, 
      nomorTransaksi: `OPN-${Math.floor(Math.random()*10000)}`,
      date: new Date().toISOString().slice(0, 16).replace('T', ' '), 
      type: 'OPNAME', 
      sparepartId, 
      quantity: Math.abs(diff), 
      harga: 0,
      reference: '-', 
      officer: 'Admin',
      keterangan
    }, ...prev]);
    showToast(`Stok Opname ${sp.name} berhasil disimpan.`);
  };

  const addSparepart = async (data: Omit<Sparepart, 'id' | 'status'>) => {
    try {
      const res = await fetch('/api/spareparts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        const newSp = await res.json();
        setSpareparts(prev => [{
          ...newSp,
          status: calculateStatus(newSp.stock, newSp.minStock)
        }, ...prev]);
        showToast(`Sparepart ${data.name} berhasil ditambahkan`);
      } else {
        const err = await res.json();
        showToast(err.error || 'Gagal menambahkan sparepart', 'error');
      }
    } catch (e) {
      showToast('Terjadi kesalahan jaringan', 'error');
    }
  };

  const updateSparepart = async (id: string, data: Partial<Sparepart>) => {
    try {
      const res = await fetch(`/api/spareparts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        const updated = await res.json();
        setSpareparts(prev => prev.map(s => {
          if (s.id === id) {
            return { ...updated, status: calculateStatus(updated.stock, updated.minStock) };
          }
          return s;
        }));
        showToast(`Sparepart berhasil diubah`);
      } else {
        showToast('Gagal mengubah sparepart', 'error');
      }
    } catch (e) {
      showToast('Terjadi kesalahan jaringan', 'error');
    }
  };

  const deleteSparepart = async (id: string) => {
    try {
      const res = await fetch(`/api/spareparts/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSpareparts(prev => prev.filter(s => s.id !== id));
        showToast('Sparepart berhasil dihapus');
      } else {
        const err = await res.json();
        showToast(err.error || 'Gagal menghapus sparepart', 'error');
      }
    } catch (e) {
      showToast('Terjadi kesalahan jaringan', 'error');
    }
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };
  
  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <GlobalContext.Provider value={{ 
      spareparts, suppliers, transactions, notifications,
      addStockIn, addStockOut, addOpname, addSparepart, updateSparepart, deleteSparepart,
      markNotificationRead, markAllNotificationsRead,
      toast, showToast 
    }}>
      {children}
    </GlobalContext.Provider>
  );
}

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (context === undefined) throw new Error('useGlobalContext must be used within GlobalProvider');
  return context;
};
