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
        className={`fixed lg:relative h-full bg-[#11142B] border-[#252946] flex flex-col shrink-0 transition-[width,transform,border-width] ease-in-out duration-300 z-50 ${
          isSidebarOpen ? 'w-[260px] translate-x-0 border-r' : 'w-0 -translate-x-full lg:translate-x-0 border-r-0 overflow-hidden'
        }`}
      >
        {/* Brand & Toggle */}
        <div className={`h-[72px] flex items-center border-b border-[#252946] overflow-hidden shrink-0 transition-all duration-300 ${
          isSidebarOpen ? 'px-5 justify-start' : 'px-0 justify-center'
        }`}>
          <div className={`flex items-center transition-all duration-300 ${isSidebarOpen ? 'gap-3' : 'gap-0'}`}>
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-xl text-[#858BA8] hover:text-[#F5F7FF] hover:bg-[#151832] transition-all duration-200 shrink-0"
              title="Toggle Sidebar"
            >
              <Menu className="w-6 h-6" />
            </button>
            {isSidebarOpen && (
              <span className={`font-bold text-[#F5F7FF] text-[16px] tracking-wide whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out opacity-100 translate-x-0 max-w-[150px]`}>
                System Awan
              </span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className={`flex-1 py-6 px-4 space-y-1.5 overflow-y-auto overflow-x-hidden ${!isSidebarOpen ? 'hidden' : ''}`}>
          {menuItems.map((item) => {
            // Using precise path matching or starting path for active state
            const isActive = pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path + '/'));
            return (
              <Link
                key={item.name}
                href={item.path}
                onClick={(e) => handleNavClick(e, item.path)}
                title={!isSidebarOpen ? item.name : ''}
                className={`relative flex items-center py-3 rounded-xl text-[14px] font-medium transition-colors duration-200 group z-10 ${
                  isSidebarOpen ? 'px-4 gap-3.5' : 'px-0 justify-center gap-0'
                } ${
                  isActive 
                    ? 'text-white' 
                    : 'text-[#858BA8] hover:text-[#F5F7FF] hover:bg-[#151832]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-indicator"
                    className="absolute inset-0 bg-[#3867FF] rounded-xl shadow-[0_4px_12px_rgba(56,103,255,0.25)] -z-10"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <item.icon className={`w-[20px] h-[20px] shrink-0 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-white' : 'text-[#858BA8] group-hover:text-[#F5F7FF]'}`} />
                <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${
                  isSidebarOpen ? 'opacity-100 translate-x-0 max-w-[150px]' : 'opacity-0 -translate-x-4 max-w-0'
                }`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Action */}
        <div className={`p-4 border-t border-[#252946] shrink-0 ${!isSidebarOpen ? 'hidden' : ''}`}>
          <button
            onClick={() => setIsLogoutModalOpen(true)}
            title={!isSidebarOpen ? "Logout" : ""}
            className={`w-full flex items-center py-3 rounded-xl text-[14px] font-medium transition-all duration-200 group ${
              isSidebarOpen ? 'px-4 gap-3.5' : 'px-0 justify-center gap-0'
            } text-[#858BA8] hover:bg-[#FF4D67]/10 hover:text-[#FF4D67]`}
          >
            <LogOut className="w-[20px] h-[20px] shrink-0 transition-transform duration-200 group-hover:scale-110" />
            <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${
              isSidebarOpen ? 'opacity-100 translate-x-0 max-w-[150px]' : 'opacity-0 -translate-x-4 max-w-0'
            }`}>
              Logout
            </span>
          </button>
        </div>
      </aside>

      <LogoutModal isOpen={isLogoutModalOpen} onClose={() => setIsLogoutModalOpen(false)} />
    </>
  );
}
