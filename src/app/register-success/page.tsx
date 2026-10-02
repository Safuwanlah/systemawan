'use client';

import Link from 'next/link';
import { Wrench, CheckCircle2, ArrowRight } from 'lucide-react';

export default function RegisterSuccessPage() {
  return (
    <div className="min-h-screen bg-[#0F1113] text-[#F5F5F5] font-sans selection:bg-[#E53935] selection:text-white flex flex-col relative overflow-hidden">
      
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-b from-emerald-500/5 to-transparent blur-[120px]"></div>
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#25292D 1px, transparent 1px)', backgroundSize: '32px 32px', opacity: 0.15 }}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 w-full px-6 py-6">
        <Link href="/" className="inline-flex items-center gap-3 group">
          <div className="w-10 h-10 rounded bg-[#171A1D] border border-[#25292D] flex items-center justify-center shadow-inner group-hover:border-[#E53935]/50 transition-colors">
            <Wrench className="w-5 h-5 text-[#E53935]" />
          </div>
          <span className="font-bold text-lg tracking-wide text-white">GARASI INVENTORY</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 relative z-10">
        
        {/* Success Modal */}
        <div className="w-full max-w-[500px] bg-[#171A1D] border border-[#25292D] rounded-3xl p-10 text-center shadow-[0_0_60px_rgba(16,185,129,0.15)] relative before:absolute before:inset-0 before:rounded-3xl before:border before:border-white/5 before:pointer-events-none transition-shadow duration-500 hover:shadow-[0_0_80px_rgba(16,185,129,0.2)]">
          
          {/* Subtle top border highlight */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-70 shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>

          {/* Success Icon */}
          <div className="mx-auto w-24 h-24 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.2)] border border-emerald-500/20">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
          </div>

          <h1 className="text-3xl font-extrabold text-white mb-4 tracking-tight">
            PENDAFTARAN BERHASIL!
          </h1>
          
          <div className="space-y-4 mb-10">
            <p className="text-[#A7ADB4] text-[15px] leading-relaxed">
              Selamat! Akun Garasi Inventory Anda telah dibuat dengan email: <span className="text-white font-semibold">budi.sukses@garasi.id</span>.
            </p>
            <p className="text-[#A7ADB4] text-[15px] leading-relaxed">
              Sekarang, silakan gunakan kredensial tersebut untuk masuk dan mulai mengelola stok bengkel Anda.
            </p>
          </div>

          {/* CTA Button */}
          <div className="space-y-4">
            <Link
              href="/"
              className="w-full flex justify-center items-center gap-2 bg-[#E53935] hover:bg-[#D32F2F] text-white py-4 px-6 rounded-xl font-bold text-[15px] transition-all shadow-[0_0_25px_rgba(229,57,53,0.4)] hover:shadow-[0_0_35px_rgba(229,57,53,0.5)] active:scale-[0.98]"
            >
              MASUK KE DASHBOARD
              <ArrowRight className="w-5 h-5" />
            </Link>
            
            <p className="text-[#5A6068] text-xs font-medium">
              Anda akan diarahkan ke halaman login.
            </p>
          </div>

        </div>

      </main>
    </div>
  );
}
