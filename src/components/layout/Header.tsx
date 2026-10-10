'use client';

import { useState } from 'react';
import { Search, Bell, ChevronDown, Menu, HelpCircle, Check, Info } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';
import { useGlobalContext } from '@/context/GlobalContext';

interface HeaderProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (val: boolean) => void;
}

export default function Header({ isSidebarOpen, setIsSidebarOpen }: HeaderProps) {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useGlobalContext();
  const [activeDropdown, setActiveDropdown] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  
  const unreadNotifs = notifications.filter(n => !n.read);

  return (
    <header className="h-[72px] px-4 md:px-8 bg-background border-b border-border flex items-center justify-between sticky top-0 z-40">
      
      <div className="flex items-center gap-4">
        {/* Mobile & Desktop Sidebar Toggle */}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={`p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200 ${isSidebarOpen ? 'lg:hidden' : ''}`}
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search */}
        <div className="hidden md:flex relative w-full max-w-[320px] group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors duration-300">
            <Search className="h-[18px] w-[18px] text-muted-foreground group-focus-within:text-primary transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-4 py-2.5 bg-card border border-border rounded-full text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-[14px]"
            placeholder="Search..."
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4 md:gap-6">
        
        <div className="flex items-center gap-2">
          <ThemeToggle />
          
          {/* Help Guide */}
          <div className="relative">
            <button 
              onClick={() => { setShowGuide(!showGuide); setShowNotif(false); setActiveDropdown(false); }}
              className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-full transition-all duration-200"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
            <AnimatePresence>
              {showGuide && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-[calc(100%+8px)] right-[-60px] md:right-0 w-[320px] bg-card border border-border rounded-xl shadow-xl z-50 origin-top-right overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-border bg-muted flex items-center gap-2">
                    <Info className="w-4 h-4 text-primary" />
                    <span className="font-bold text-foreground text-sm">Panduan Sistem</span>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto p-4 space-y-4 text-sm text-muted-foreground">
                    <div>
                      <strong className="text-foreground block mb-1">🏠 Dashboard</strong>
                      Pusat informasi. Menampilkan ringkasan dan grafik pergerakan stok.
                    </div>
                    <div>
                      <strong className="text-foreground block mb-1">📦 Manajemen Sparepart</strong>
                      Digunakan HANYA untuk mendaftarkan identitas **barang baru** pertama kali.
                    </div>
                    <div>
                      <strong className="text-[#22C55E] block mb-1">📥 Stok Masuk</strong>
                      Digunakan setiap hari untuk mencatat penambahan stok dari Supplier.
                    </div>
                    <div>
                      <strong className="text-[#EF4444] block mb-1">📤 Stok Keluar</strong>
                      Digunakan setiap hari untuk mencatat pemakaian alat / stok untuk servis.
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Notification */}
          <div className="relative">
            <button 
              onClick={() => { setShowNotif(!showNotif); setShowGuide(false); setActiveDropdown(false); }}
              className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-full transition-all duration-200"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifs.length > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-primary border-[1.5px] border-background"></span>
              )}
            </button>
            <AnimatePresence>
              {showNotif && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-[calc(100%+8px)] right-[-20px] md:right-0 w-[320px] bg-card border border-border rounded-xl shadow-xl z-50 origin-top-right overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-border bg-muted flex justify-between items-center">
                    <span className="font-bold text-foreground text-sm">Notifikasi</span>
                    {unreadNotifs.length > 0 && (
                      <button onClick={markAllNotificationsRead} className="text-xs text-primary hover:underline font-medium">Tandai dibaca</button>
                    )}
                  </div>
                  <div className="max-h-[300px] overflow-y-auto">
                    {unreadNotifs.length === 0 ? (
                      <div className="p-6 text-center text-muted-foreground text-sm">
                        Tidak ada notifikasi baru.
                      </div>
                    ) : (
                      unreadNotifs.map(n => (
                        <div key={n.id} className="p-4 border-b border-border/50 hover:bg-accent/50 transition-colors flex gap-3 items-start">
                          <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.type === 'KOSONG' ? 'bg-[#EF4444]' : 'bg-[#EAB308]'}`}></div>
                          <div className="flex-1">
                            <p className="text-sm font-bold text-foreground">{n.title}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                          </div>
                          <button onClick={() => markNotificationRead(n.id)} className="text-muted-foreground hover:text-primary p-1">
                            <Check className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="w-[1px] h-6 bg-border hidden md:block"></div>

        {/* Profile Dropdown */}
        <div 
          className="relative"
          onMouseEnter={() => setActiveDropdown(true)}
          onMouseLeave={() => setActiveDropdown(false)}
        >
          <button 
            onClick={() => setActiveDropdown(!activeDropdown)}
            className="flex items-center gap-3 rounded-full transition-all duration-200 border border-transparent hover:border-border hover:bg-card p-1 pr-3"
          >
            <div className="w-9 h-9 rounded-full bg-primary overflow-hidden flex items-center justify-center shrink-0">
              <span className="text-white text-sm font-bold">AD</span>
            </div>
            <div className="hidden md:flex flex-col items-start text-left">
              <span className="text-[14px] font-semibold text-foreground leading-tight">Admin System</span>
              <span className="text-[12px] text-muted-foreground leading-tight">Administrator</span>
            </div>
            <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-300 hidden md:block ${activeDropdown ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {activeDropdown && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="absolute top-[calc(100%+8px)] right-0 w-48 bg-card border border-border rounded-xl shadow-xl py-2 z-50 origin-top-right"
              >
                <div className="px-4 py-2 border-b border-border mb-1">
                  <span className="block text-sm font-semibold text-foreground">Admin System</span>
                  <span className="block text-xs text-muted-foreground">admin@system.local</span>
                </div>
                <button className="w-full text-left px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                  My Profile
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                  Settings
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
