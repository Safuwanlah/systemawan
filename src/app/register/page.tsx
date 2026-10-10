'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Wrench, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate registration and redirect to success page
    router.push('/register-success');
  };

  return (
    <div className="min-h-screen bg-muted text-foreground font-sans selection:bg-[#D97706] selection:text-white flex flex-col relative overflow-hidden">
      
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-gradient-to-b from-[#D97706]/10 to-transparent blur-[130px]"></div>
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#25292D 1px, transparent 1px)', backgroundSize: '32px 32px', opacity: 0.15 }}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 w-full px-6 py-6 border-b border-[#25292D] bg-muted/80 backdrop-blur-md">
        <Link href="/" className="inline-flex items-center gap-3 group">
          <div className="w-10 h-10 rounded bg-card border border-[#25292D] flex items-center justify-center shadow-inner group-hover:border-[#E53935]/50 transition-colors">
            <Wrench className="w-5 h-5 text-[#E53935]" />
          </div>
          <span className="font-bold text-lg tracking-wide text-white">GARASI INVENTORY</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 relative z-10">
        
        {/* Registration Card */}
        <div className="w-full max-w-[440px] bg-card border border-[#25292D] rounded-2xl p-8 shadow-[0_0_40px_rgba(217,119,6,0.08)] relative before:absolute before:inset-0 before:rounded-2xl before:border before:border-white/5 before:pointer-events-none hover:shadow-[0_0_50px_rgba(217,119,6,0.12)] transition-shadow duration-500">
          
          {/* Subtle top border highlight */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-[1px] bg-gradient-to-r from-transparent via-[#D97706] to-transparent opacity-60 shadow-[0_0_10px_rgba(217,119,6,0.8)]"></div>

          {/* Registration Icon */}
          <div className="mx-auto w-20 h-20 rounded-full bg-[#D97706]/10 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(217,119,6,0.15)] border border-[#D97706]/30">
            <Wrench className="w-10 h-10 text-[#D97706] drop-shadow-[0_0_8px_rgba(217,119,6,0.6)]" />
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">DAFTAR AKUN BARU</h1>
            <p className="text-muted-foreground text-sm font-medium">Mulai kelola stok bengkel Anda dengan mudah.</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white block">Email Utama</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-[#5A6068]" />
                </div>
                <input
                  type="email"
                  required
                  className="block w-full pl-10 pr-4 py-3 bg-muted border border-[#25292D] rounded-lg text-white placeholder-[#5A6068] focus:outline-none focus:ring-1 focus:ring-[#D97706] focus:border-[#D97706] transition-all text-sm"
                  placeholder="contoh: budi.daftar@garasi.id"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white block">Kata Sandi Baru</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-[#5A6068]" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="block w-full pl-10 pr-10 py-3 bg-muted border border-[#25292D] rounded-lg text-white placeholder-[#5A6068] focus:outline-none focus:ring-1 focus:ring-[#D97706] focus:border-[#D97706] transition-all text-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#5A6068] hover:text-muted-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#B45309] to-[#D97706] hover:from-[#92400E] hover:to-[#B45309] text-white py-3.5 px-4 rounded-lg font-bold text-sm transition-all shadow-[0_0_20px_rgba(217,119,6,0.3)] hover:shadow-[0_0_25px_rgba(217,119,6,0.4)] active:scale-[0.98] border border-[#F59E0B]/20"
              >
                DAFTAR SEKARANG
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-[#5A6068]">
              Sudah punya akun?{' '}
              <Link href="/" className="font-medium text-white hover:text-[#D97706] transition-colors underline decoration-[#5A6068] hover:decoration-[#D97706] underline-offset-4">
                Masuk di sini
              </Link>
            </p>
          </div>
        </div>

      </main>
    </div>
  );
}
