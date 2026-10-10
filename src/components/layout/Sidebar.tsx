'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  Box, 
  ShoppingCart, 
  UserCircle, 
  BarChart2, 
  FileText, 
  Settings, 
  LogOut,
  Menu,
  Wrench
} from 'lucide-react';
import { useState } from 'react';
import LogoutModal from '@/components/ui/LogoutModal';

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (val: boolean) => void;
}

export default function Sidebar({ isSidebarOpen, setIsSidebarOpen }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Stok Sparepart', icon: Box, path: '/sparepart' },
    { name: 'Data Supplier', icon: Users, path: '/supplier' },
    { name: 'Transaksi', icon: ShoppingCart, path: '/transaksi' },
    { name: 'Laporan', icon: FileText, path: '/laporan' },
    { name: 'Pengaturan', icon: Settings, path: '/settings' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    // Always close sidebar on mobile when a link is clicked
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <>
      <aside 
        className={`fixed lg:relative h-full w-[260px] bg-card border-border flex flex-col shrink-0 transition-all ease-[cubic-bezier(0.22,1,0.36,1)] duration-500 z-50 ${
          isSidebarOpen ? 'translate-x-0 ml-0 border-r' : '-translate-x-full lg:ml-[-260px] border-r-0'
        }`}
      >
        {/* Brand & Toggle */}
        <div className="h-[72px] px-5 flex items-center justify-start border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200 shrink-0"
              title="Toggle Sidebar"
            >
              <Menu className="w-6 h-6" />
            </button>
            <span className="font-bold text-foreground text-[16px] tracking-wide whitespace-nowrap">
              System Awan
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto overflow-x-hidden">
          {menuItems.map((item) => {
            const isActive = pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path + '/'));
            return (
              <Link
                key={item.name}
                href={item.path}
                onClick={(e) => handleNavClick(e, item.path)}
                className={`relative flex items-center py-3 px-4 gap-3.5 rounded-xl text-[14px] font-medium transition-colors duration-200 group z-10 ${
                  isActive 
                    ? 'text-primary-foreground' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-indicator"
                    className="absolute inset-0 bg-primary rounded-xl shadow-[0_4px_12px_rgba(56,103,255,0.25)] -z-10"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <item.icon className={`w-[20px] h-[20px] shrink-0 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground'}`} />
                <span className="whitespace-nowrap">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Action */}
        <div className="p-4 border-t border-border shrink-0">
          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className="w-full flex items-center py-3 px-4 gap-3.5 rounded-xl text-[14px] font-medium transition-all duration-200 group text-muted-foreground hover:bg-[#FF4D67]/10 hover:text-[#FF4D67]"
          >
            <LogOut className="w-[20px] h-[20px] shrink-0 transition-transform duration-200 group-hover:scale-110" />
            <span className="whitespace-nowrap">
              Logout
            </span>
          </button>
        </div>
      </aside>

      <LogoutModal isOpen={isLogoutModalOpen} onClose={() => setIsLogoutModalOpen(false)} />
    </>
  );
}
