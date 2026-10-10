'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import PageTransition from './PageTransition';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header setIsSidebarOpen={setIsSidebarOpen} isSidebarOpen={isSidebarOpen} />
        <main className="flex-1 overflow-y-auto bg-background p-4 md:p-8">
          <PageTransition>
            {children}
          </PageTransition>
        </main>
      </div>
      
      {/* Mobile Sidebar Overlay */}
      <div 
        className={`fixed inset-0 bg-background/80 z-40 lg:hidden backdrop-blur-sm transition-all duration-500 ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsSidebarOpen(false)}
      />
    </div>
  );
}
