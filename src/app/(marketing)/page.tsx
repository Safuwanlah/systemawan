'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Wrench, User, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') {
      router.push('/dashboard');
    } else {
      alert('Username atau password salah!');
    }
  };

  return (
    <div className="min-h-screen bg-muted text-foreground font-sans selection:bg-[#E53935] selection:text-white flex flex-col relative overflow-hidden">
      
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-b from-[#E53935]/5 to-transparent blur-[120px]"></div>
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#25292D 1px, transparent 1px)', backgroundSize: '32px 32px', opacity: 0.15 }}></div>
      </div>

      {/* Header (Simplified) */}
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
        
        {/* Login Card */}
        <div className="w-full max-w-[440px] bg-card border border-[#25292D] rounded-2xl p-8 shadow-[0_0_40px_rgba(229,57,53,0.05)] relative before:absolute before:inset-0 before:rounded-2xl before:border before:border-white/5 before:pointer-events-none hover:shadow-[0_0_50px_rgba(229,57,53,0.08)] transition-shadow duration-500">
          
          {/* Subtle top border highlight */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[1px] bg-gradient-to-r from-transparent via-[#E53935] to-transparent opacity-50"></div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">MASUK KE GARASI INVENTORY</h1>
            <p className="text-muted-foreground text-sm font-medium">Kelola Bengkel Lebih Mudah</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Username/Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white block">Username atau Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-[#5A6068]" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 bg-muted border border-[#25292D] rounded-lg text-white placeholder-[#5A6068] focus:outline-none focus:ring-1 focus:ring-[#E53935] focus:border-[#E53935] transition-all text-sm"
                  placeholder="Contoh: admin"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white block">Kata Sandi</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-[#5A6068]" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 bg-muted border border-[#25292D] rounded-lg text-white placeholder-[#5A6068] focus:outline-none focus:ring-1 focus:ring-[#E53935] focus:border-[#E53935] transition-all text-sm"
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

            {/* Forgot Password Link */}
            <div className="flex justify-end pt-1">
              <a href="#" className="text-xs font-medium text-muted-foreground hover:text-white transition-colors">
                Lupa Kata Sandi?
              </a>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex justify-center items-center gap-2 bg-[#E53935] hover:bg-[#D32F2F] text-white py-3.5 px-4 rounded-lg font-bold text-sm transition-all shadow-[0_0_20px_rgba(229,57,53,0.3)] hover:shadow-[0_0_25px_rgba(229,57,53,0.4)] active:scale-[0.98]"
              >
                MASUK SEKARANG
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>


        </div>

      </main>
    </div>
  );
}
