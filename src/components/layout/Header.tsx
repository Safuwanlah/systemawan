'use client';

import { useState } from 'react';
import { Search, Bell, ChevronDown, LogOut } from 'lucide-react';
import LogoutModal from '@/components/ui/LogoutModal';

export default function Header() {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(false);

  return (
    <>
      <header className="h-[72px] px-8 bg-[#0F1113] border-b border-[#25292D] flex items-center justify-between sticky top-0 z-40 shadow-sm">
        
        {/* Search */}
        <div className="relative w-full max-w-[320px] group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors duration-300 group-focus-within:text-[#3B82F6]">
            <Search className="h-4 w-4 text-[#5A6068] group-focus-within:text-[#3B82F6] transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-4 py-2.5 bg-[#171A1D] border border-[#25292D] rounded-xl text-white placeholder-[#5A6068] focus:outline-none focus:ring-1 focus:ring-[#3B82F6]/50 focus:border-[#3B82F6]/50 focus:bg-[#1C2024] transition-all text-[13px] shadow-inner"
            placeholder="Cari sparepart..."
          />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-7">
          {/* Notification */}
          <button className="relative p-2 text-[#5A6068] hover:text-[#A7ADB4] hover:bg-[#1C2024] rounded-lg transition-all duration-200">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#E53935] border-2 border-[#0F1113]"></span>
          </button>

          <div className="w-[1px] h-6 bg-[#25292D]"></div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setActiveDropdown(!activeDropdown)}
              className="flex items-center gap-3 p-1.5 pr-3 rounded-xl transition-all duration-200 border border-transparent hover:border-[#25292D] hover:bg-[#171A1D] group"
            >
              <div className="w-9 h-9 rounded-full bg-[#25292D] border border-[#3A4149] overflow-hidden flex items-center justify-center group-hover:border-[#5A6068] transition-colors">
                <div className="w-full h-full bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6]"></div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-semibold text-[#E8EAED]">Admin Garasi</span>
                <ChevronDown className={`w-4 h-4 text-[#5A6068] transition-transform duration-300 ${activeDropdown ? 'rotate-180' : ''}`} />
              </div>
            </button>

            {activeDropdown && (
              <div className="absolute top-[calc(100%+8px)] right-0 w-48 bg-[#171A1D] border border-[#2B3036] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <button 
                  onClick={() => setIsLogoutModalOpen(true)}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-[#E53935] hover:bg-[#E53935]/10 hover:px-5 transition-all duration-200"
                >
                  <LogOut className="w-4 h-4" /> Keluar
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* LOGOUT MODAL */}
      <LogoutModal isOpen={isLogoutModalOpen} onClose={() => setIsLogoutModalOpen(false)} />
    </>
  );
}
