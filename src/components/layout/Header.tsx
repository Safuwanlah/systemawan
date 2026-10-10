'use client';

import { useState } from 'react';
import { Search, Bell, ChevronDown, Menu, MessageSquare } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

interface HeaderProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (val: boolean) => void;
}

export default function Header({ isSidebarOpen, setIsSidebarOpen }: HeaderProps) {
  const [activeDropdown, setActiveDropdown] = useState(false);

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
          
          {/* Messages */}
          <button className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-full transition-all duration-200">
            <MessageSquare className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#FF4D67] border-[1.5px] border-background"></span>
          </button>

          {/* Notification */}
          <button className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-full transition-all duration-200">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary border-[1.5px] border-background"></span>
          </button>
        </div>

        <div className="w-[1px] h-6 bg-border hidden md:block"></div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setActiveDropdown(!activeDropdown)}
            className="flex items-center gap-3 rounded-full transition-all duration-200 border border-transparent hover:border-border hover:bg-card p-1 pr-3"
          >
            <div className="w-9 h-9 rounded-full bg-primary overflow-hidden flex items-center justify-center shrink-0">
              <span className="text-white text-sm font-bold">AJ</span>
            </div>
            <div className="hidden md:flex flex-col items-start text-left">
              <span className="text-[14px] font-semibold text-foreground leading-tight">Adam Joe</span>
              <span className="text-[12px] text-muted-foreground leading-tight">Admin</span>
            </div>
            <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-300 hidden md:block ${activeDropdown ? 'rotate-180' : ''}`} />
          </button>

          {activeDropdown && (
            <div className="absolute top-[calc(100%+8px)] right-0 w-48 bg-card border border-border rounded-xl shadow-xl py-2 z-50">
              <div className="px-4 py-2 border-b border-border mb-1">
                <span className="block text-sm font-semibold text-foreground">Adam Joe</span>
                <span className="block text-xs text-muted-foreground">admin@plainadmin.com</span>
              </div>
              <button className="w-full text-left px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                My Profile
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                Settings
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
