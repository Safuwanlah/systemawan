'use client';

import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LogoutModal({ isOpen, onClose }: LogoutModalProps) {
  const router = useRouter();

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLogout = () => {
    // Perform logout logic here (e.g., clear tokens)
    router.push('/');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Blurred Overlay */}
      <div 
        className="absolute inset-0 bg-[#0F1113]/60 backdrop-blur-[4px] transition-all animate-in fade-in duration-300"
        onClick={onClose}
      ></div>

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-[420px] bg-[#1B1F23] border border-[#292D32] rounded-2xl p-8 shadow-[0_0_40px_rgba(229,57,53,0.08)] mx-4 animate-in fade-in zoom-in-95 duration-300 before:absolute before:inset-0 before:rounded-2xl before:border before:border-white/5 before:pointer-events-none">
        
        {/* Subtle top border highlight */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[1px] bg-gradient-to-r from-transparent via-[#E53935] to-transparent opacity-60 shadow-[0_0_10px_rgba(229,57,53,0.8)]"></div>

        <div className="text-center">
          {/* Icon */}
          <div className="mx-auto w-16 h-16 rounded-full bg-[#E53935] flex items-center justify-center mb-5 shadow-[0_0_20px_rgba(229,57,53,0.4)] border border-[#FF6B6B]/30">
            <LogOut className="w-8 h-8 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">Konfirmasi Keluar</h2>
          <p className="text-[#A1A7B0] text-[15px] leading-relaxed mb-8">
            Apakah Anda yakin ingin keluar dari akun Garasi Inventory Anda?
          </p>

          {/* Buttons */}
          <div className="flex gap-4 w-full">
            <button 
              onClick={onClose}
              className="flex-1 bg-[#292D32] hover:bg-[#343A40] text-white py-3.5 px-4 rounded-xl font-semibold text-[15px] transition-all border border-[#40464D]"
            >
              Batal
            </button>
            <button 
              onClick={handleLogout}
              className="flex-1 bg-[#E53935] hover:bg-[#D32F2F] text-white py-3.5 px-4 rounded-xl font-bold text-[15px] transition-all shadow-[0_0_15px_rgba(229,57,53,0.3)] hover:shadow-[0_0_25px_rgba(229,57,53,0.4)] active:scale-[0.98]"
            >
              Ya, Keluar
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
