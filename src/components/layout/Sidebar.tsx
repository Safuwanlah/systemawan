'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Box, Truck, FileText, Wrench, Menu, ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (val: boolean) => void;
}

export default function Sidebar({ isSidebarOpen, setIsSidebarOpen }: SidebarProps) {
  const pathname = usePathname();
  
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Stok Sparepart', icon: Box, path: '/sparepart' },
    { name: 'Supplier', icon: Truck, path: '/supplier' },
    { name: 'Laporan', icon: FileText, path: '/laporan' },
  ];

  return (
    <aside 
      className={`h-screen bg-[#0F1113] border-r border-[#25292D] flex flex-col shrink-0 transition-[width] ease-in-out duration-300 relative z-50 ${
        isSidebarOpen ? 'w-[260px]' : 'w-[84px]'
      }`}
    >
      {/* Brand & Toggle */}
      <div className="h-[72px] px-5 flex items-center justify-between border-b border-[#25292D] overflow-hidden">
        <div className={`flex items-center gap-3 transition-opacity duration-300 ease-in-out ${isSidebarOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#E53935] to-[#B71C1C] flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(229,57,53,0.4)]">
            <Wrench className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white text-[15px] tracking-widest">GARASI</span>
        </div>
        
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={`p-2 rounded-xl text-[#8A9098] hover:text-white hover:bg-[#1C2024] transition-all duration-200 shrink-0 ${!isSidebarOpen && 'mx-auto'}`}
          title="Toggle Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-8 px-4 space-y-2 overflow-hidden">
        {menuItems.map((item) => {
          const isActive = pathname === item.path || pathname.startsWith(item.path + '/');
          return (
            <Link
              key={item.name}
              href={item.path}
              title={!isSidebarOpen ? item.name : ''}
              className={`flex items-center gap-3.5 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isSidebarOpen ? 'px-4' : 'px-0 justify-center'
              } ${
                isActive 
                  ? 'bg-gradient-to-r from-[#1C2024] to-[#131517] text-white shadow-sm border border-[#2B3036]/50' 
                  : 'text-[#8A9098] hover:bg-[#1C2024]/40 hover:text-white border border-transparent'
              }`}
            >
              <item.icon className={`w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-[#E53935]' : 'text-[#5A6068] group-hover:text-[#A7ADB4]'}`} />
              <span className={`whitespace-nowrap transition-all duration-300 ease-in-out ${
                isSidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 hidden'
              }`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / User minimal info */}
      <div className={`p-4 border-t border-[#25292D] transition-all duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-[#1C2024] flex items-center justify-center shrink-0 border border-[#2B3036]">
            <span className="text-white text-xs font-bold">N</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-medium text-white">System Awan</span>
            <span className="text-[10px] text-[#5A6068]">v2.0.1</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
