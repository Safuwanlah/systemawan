'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useGlobalContext } from '@/context/GlobalContext';
import { 
  Wrench, 
  Search, 
  Bell, 
  User, 
  ChevronDown, 
  Menu, 
  X,
  Settings,
  HelpCircle,
  LogOut,
  LayoutDashboard,
  Box,
  Truck,
  ShoppingCart,
  FileText,
  Activity
} from 'lucide-react';
import LogoutModal from '@/components/ui/LogoutModal';

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const { notifications } = useGlobalContext();
  const unreadCount = notifications.filter(n => !n.read).length;
  
  // Close dropdowns when clicking outside
  const navRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { 
      name: 'Inventory', 
      path: '/inventory',
      icon: Box,
      dropdown: [
        { name: 'Semua Sparepart', path: '/inventory' },
        { name: 'Stok Masuk', path: '/inventory/masuk' },
        { name: 'Stok Keluar', path: '/inventory/keluar' },
        { name: 'Stok Minimum', path: '/inventory/minimum' },
        { name: 'Stok Opname', path: '/inventory/opname' },
      ]
    },
    { name: 'Sparepart', path: '/sparepart', icon: Settings },
    { name: 'Supplier', path: '/supplier', icon: Truck },
    { 
      name: 'Transaksi', 
      path: '/transaksi',
      icon: ShoppingCart,
      dropdown: [
        { name: 'Pembelian', path: '/transaksi/pembelian' },
        { name: 'Barang Masuk', path: '/transaksi/masuk' },
        { name: 'Barang Keluar', path: '/transaksi/keluar' },
      ]
    },
    { name: 'Laporan', path: '/laporan', icon: FileText },
  ];

  return (
    <nav ref={navRef} className="sticky top-0 z-50 w-full h-16 md:h-[72px] bg-[#0F1113] border-b border-[#25292D] shadow-[0_4px_20px_rgba(0,0,0,0.4)] text-[#F5F5F5] font-sans selection:bg-[#E53935] selection:text-white relative">
      {/* Subtle automotive elements */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#F5F5F5 1px, transparent 1px)', backgroundSize: '12px 12px' }}></div>
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#E53935]/50 to-transparent"></div>
      
      <div className="h-full px-4 md:px-6 lg:px-8 mx-auto flex items-center justify-between relative z-10">
        
        {/* LEFT: BRAND */}
        <div className="flex items-center gap-3 mr-8 shrink-0">
          <Link href="/" className="flex items-center gap-3 group" onClick={closeMobileMenu}>
            <div className="w-10 h-10 rounded bg-gradient-to-br from-[#1B1F23] to-[#111315] border border-[#292D32] flex items-center justify-center shadow-inner group-hover:border-[#E53935]/50 transition-colors">
              <Wrench className="w-5 h-5 text-[#E53935]" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base md:text-lg tracking-wide leading-none text-white">GARASI INVENTORY</span>
              <span className="text-[10px] md:text-xs text-[#8A9098] font-medium tracking-widest mt-1">SPAREPART MANAGEMENT</span>
            </div>
          </Link>
        </div>

        {/* CENTER: DESKTOP NAVIGATION */}
        <div className="hidden lg:flex items-center h-full flex-1 justify-center space-x-1 xl:space-x-2">
          {navLinks.map((item) => {
            const isActive = pathname === item.path || pathname.startsWith(item.path + '/');
            const hasDropdown = !!item.dropdown;
            
            return (
              <div 
                key={item.name} 
                className="relative h-full flex items-center"
                onMouseEnter={() => hasDropdown && setActiveDropdown(item.name)}
                onMouseLeave={() => hasDropdown && setActiveDropdown(null)}
              >
                <Link 
                  href={item.path}
                  className={`px-3 xl:px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 flex items-center gap-2
                    ${isActive 
                      ? 'text-[#F5F5F5] bg-[#1B1F23] border-b-2 border-[#E53935]' 
                      : 'text-[#A1A7B0] hover:text-[#F5F5F5] hover:bg-[#1B1F23]/50'
                    }
                  `}
                >
                  {item.name}
                  {hasDropdown && <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === item.name ? 'rotate-180 text-[#E53935]' : ''}`} />}
                </Link>

                {/* Desktop Dropdown */}
                {hasDropdown && activeDropdown === item.name && (
                  <div className="absolute top-[calc(100%-4px)] left-0 w-48 bg-[#1B1F23] border border-[#292D32] rounded-md shadow-xl py-2 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                    <div className="absolute top-0 left-4 w-8 h-[2px] bg-[#E53935]"></div>
                    {item.dropdown.map((dropItem) => (
                      <Link 
                        key={dropItem.name} 
                        href={dropItem.path}
                        className="block px-4 py-2.5 text-sm text-[#A1A7B0] hover:text-white hover:bg-[#292D32]/50 transition-colors"
                        onClick={() => setActiveDropdown(null)}
                      >
                        {dropItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* RIGHT: ACTIONS */}
        <div className="hidden lg:flex items-center gap-3 shrink-0 ml-4">
          {/* Global Search */}
          <div className="relative flex items-center">
            {isSearchOpen && (
              <input 
                type="text" 
                placeholder="Cari sparepart..." 
                className="absolute right-10 w-64 h-9 bg-[#1B1F23] border border-[#292D32] rounded-md pl-3 pr-4 text-sm text-white placeholder-[#5A6068] focus:outline-none focus:border-[#E53935] focus:ring-1 focus:ring-[#E53935] transition-all animate-in fade-in slide-in-from-right-4"
                autoFocus
              />
            )}
            <button 
              aria-label="Search"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-[#A1A7B0] hover:text-white hover:bg-[#1B1F23] rounded-md transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          <Link href="/notifikasi"
            aria-label="Notifications"
            className="p-2 text-[#A1A7B0] hover:text-white hover:bg-[#1B1F23] rounded-md transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#E53935] text-[10px] font-bold text-white shadow-[0_0_0_2px_#111315]">
                {unreadCount}
              </span>
            )}
          </Link>

          <div className="w-[1px] h-8 bg-[#292D32] mx-2"></div>

          {/* User Profile */}
          <div 
            className="relative"
            onMouseEnter={() => setActiveDropdown('user')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button className="flex items-center gap-3 p-1 pr-2 rounded-md hover:bg-[#1B1F23] transition-colors text-left">
              <div className="w-8 h-8 rounded-full bg-[#292D32] border border-[#40464D] flex items-center justify-center overflow-hidden">
                <User className="w-4 h-4 text-[#A1A7B0]" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-white leading-tight">Admin</span>
                <span className="text-[11px] text-[#8A9098] font-medium leading-tight">Administrator</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-[#5A6068] transition-transform duration-200 ${activeDropdown === 'user' ? 'rotate-180' : ''}`} />
            </button>

            {/* User Dropdown */}
            {activeDropdown === 'user' && (
              <div className="absolute top-full right-0 mt-1 w-48 bg-[#1B1F23] border border-[#292D32] rounded-md shadow-xl py-1 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                <div className="px-4 py-2 border-b border-[#292D32] mb-1">
                  <p className="text-sm font-medium text-white">Admin</p>
                  <p className="text-xs text-[#8A9098]">admin@garasi.id</p>
                </div>
                <Link href="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-[#A1A7B0] hover:text-white hover:bg-[#292D32]/50 transition-colors">
                  <User className="w-4 h-4" /> Profil Saya
                </Link>
                <Link href="/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-[#A1A7B0] hover:text-white hover:bg-[#292D32]/50 transition-colors">
                  <Settings className="w-4 h-4" /> Pengaturan
                </Link>
                <Link href="/help" className="flex items-center gap-2 px-4 py-2 text-sm text-[#A1A7B0] hover:text-white hover:bg-[#292D32]/50 transition-colors">
                  <HelpCircle className="w-4 h-4" /> Bantuan
                </Link>
                <div className="h-[1px] bg-[#292D32] my-1"></div>
                <button 
                  onClick={() => setIsLogoutModalOpen(true)}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#E53935] hover:bg-[#E53935]/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Keluar
                </button>
              </div>
            )}
          </div>
        </div>

        {/* MOBILE MENU TOGGLE */}
        <div className="flex items-center gap-2 lg:hidden">
          <Link href="/notifikasi"
            aria-label="Notifications"
            className="p-2 text-[#A1A7B0] hover:text-white relative"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#E53935] text-[9px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </Link>
          <div className="w-8 h-8 rounded-full bg-[#292D32] ml-1 mr-2 flex items-center justify-center">
            <User className="w-4 h-4 text-[#A1A7B0]" />
          </div>
          <button 
            aria-label="Toggle Menu"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-[#F5F5F5] hover:bg-[#1B1F23] rounded-md transition-colors border border-[#292D32]"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* MOBILE MENU OVERLAY */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-[100%] left-0 w-full bg-[#111315] border-b border-[#292D32] shadow-xl overflow-y-auto max-h-[calc(100vh-64px)] z-40 animate-in slide-in-from-top-2">
          {/* Mobile Search */}
          <div className="p-4 border-b border-[#292D32]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5A6068]" />
              <input 
                type="text" 
                placeholder="Cari sparepart..." 
                className="w-full bg-[#1B1F23] border border-[#292D32] rounded-md py-2 pl-9 pr-4 text-sm text-white placeholder-[#5A6068] focus:outline-none focus:border-[#E53935]"
              />
            </div>
          </div>

          <div className="p-2 space-y-1">
            {navLinks.map((item) => {
              const isActive = pathname === item.path;
              const hasDropdown = !!item.dropdown;
              const isDropdownOpen = activeDropdown === item.name;

              return (
                <div key={item.name} className="flex flex-col">
                  <div 
                    className={`flex items-center justify-between px-4 py-3 rounded-md transition-colors ${
                      isActive ? 'bg-[#1B1F23] text-white border-l-2 border-[#E53935]' : 'text-[#A1A7B0]'
                    }`}
                  >
                    <Link 
                      href={item.path} 
                      className="flex items-center gap-3 flex-1 font-medium text-sm"
                      onClick={() => !hasDropdown && closeMobileMenu()}
                    >
                      <item.icon className={`w-4 h-4 ${isActive ? 'text-[#E53935]' : 'text-[#5A6068]'}`} />
                      {item.name}
                    </Link>
                    {hasDropdown && (
                      <button 
                        onClick={() => setActiveDropdown(isDropdownOpen ? null : item.name)}
                        className="p-1 -mr-2"
                      >
                        <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180 text-[#E53935]' : ''}`} />
                      </button>
                    )}
                  </div>

                  {/* Mobile Submenu */}
                  {hasDropdown && isDropdownOpen && (
                    <div className="ml-11 mt-1 mb-2 space-y-1 border-l border-[#292D32] pl-2">
                      {item.dropdown.map((dropItem) => {
                        const isDropActive = pathname === dropItem.path;
                        return (
                          <Link
                            key={dropItem.name}
                            href={dropItem.path}
                            className={`block px-3 py-2 text-sm rounded-md transition-colors ${
                              isDropActive ? 'text-[#E53935] bg-[#E53935]/10 font-medium' : 'text-[#8A9098] hover:text-white'
                            }`}
                            onClick={closeMobileMenu}
                          >
                            {dropItem.name}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="border-t border-[#292D32] p-4 mt-2">
            <button 
              onClick={() => setIsLogoutModalOpen(true)}
              className="flex items-center gap-3 text-sm text-[#E53935] font-medium px-4 py-2 w-full hover:bg-[#E53935]/10 rounded-md transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Keluar
            </button>
          </div>
        </div>
      )}

      {/* LOGOUT MODAL */}
      <LogoutModal isOpen={isLogoutModalOpen} onClose={() => setIsLogoutModalOpen(false)} />
    </nav>
  );
}
