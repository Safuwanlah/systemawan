'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useGlobalContext } from '@/context/GlobalContext';
import { ChevronRight, Bell, AlertTriangle, XCircle, CheckCircle2 } from 'lucide-react';

export default function NotifikasiPage() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useGlobalContext();
  const [tabFilter, setTabFilter] = useState('Semua');
  const router = useRouter();

  const filteredNotifications = useMemo(() => {
    let result = notifications;
    if (tabFilter === 'Stok Menipis') result = result.filter(n => n.type === 'MENIPIS');
    if (tabFilter === 'Stok Kosong') result = result.filter(n => n.type === 'KOSONG');
    return result;
  }, [notifications, tabFilter]);

  const handleRestockClick = (sparepartId: string) => {
    // Navigate to transaction IN or inventory masuk page with pre-selected ID
    router.push(`/inventory/masuk?sparepartId=${sparepartId}`);
  };

  return (
    <div className="space-y-6 animate-in fade-in max-w-4xl mx-auto">
      <div className="flex items-center text-sm text-muted-foreground">
        <Link href="/dashboard" className="hover:text-foreground transition-colors">Beranda</Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-foreground font-medium">Notifikasi Stok</span>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Notifikasi Stok</h1>
          <p className="text-muted-foreground text-sm mt-1">Pantau sparepart yang membutuhkan perhatian untuk restock.</p>
        </div>
        <button 
          onClick={markAllNotificationsRead}
          className="inline-flex items-center gap-2 px-4 py-2 bg-card hover:bg-accent text-muted-foreground hover:text-foreground font-medium rounded-lg border border-border transition-colors"
        >
          <CheckCircle2 className="w-4 h-4" />
          Tandai Semua Dibaca
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-border bg-muted flex gap-2">
          {['Semua', 'Stok Menipis', 'Stok Kosong'].map(tab => (
            <button
              key={tab}
              onClick={() => setTabFilter(tab)}
              className={`px-4 py-1.5 text-sm font-bold rounded-md transition-colors ${
                tabFilter === tab ? 'bg-accent text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="divide-y divide-border">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Bell className="w-16 h-16 text-muted-foreground/50 mb-4" />
              <p className="text-foreground font-bold text-lg mb-1">Tidak ada notifikasi baru</p>
              <p className="text-muted-foreground text-sm">Semua stok berada dalam kondisi aman.</p>
            </div>
          ) : (
            filteredNotifications.map(notif => {
              const isKosong = notif.type === 'KOSONG';
              return (
                <div key={notif.id} className={`p-4 md:p-6 flex gap-4 transition-colors hover:bg-accent/30 ${!notif.read ? 'bg-accent/10' : ''}`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${isKosong ? 'bg-[#EF4444]/10 text-[#EF4444]' : 'bg-[#F59E0B]/10 text-[#F59E0B]'}`}>
                    {isKosong ? <XCircle className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className={`font-bold ${!notif.read ? 'text-foreground' : 'text-muted-foreground'}`}>{notif.title}</h3>
                      <span className="text-xs text-[#737A82]">{new Date(notif.date).toLocaleDateString('id-ID', { hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                    <p className={`text-sm mb-4 ${!notif.read ? 'text-foreground' : 'text-[#737A82]'}`}>{notif.message}</p>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => handleRestockClick(notif.sparepartId)}
                        className="px-4 py-1.5 bg-[#E53935] hover:bg-[#D32F2F] text-white text-xs font-bold rounded transition-colors"
                      >
                        Restock Sekarang
                      </button>
                      {!notif.read && (
                        <button 
                          onClick={() => markNotificationRead(notif.id)}
                          className="px-4 py-1.5 bg-card border border-border hover:bg-accent text-muted-foreground hover:text-foreground text-xs font-bold rounded transition-colors"
                        >
                          Tandai Dibaca
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
