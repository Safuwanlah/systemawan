'use client';

import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MessageCircle, 
  MapPin, 
  Send, 
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function KontakPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulasi pengiriman form
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 1500);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">Hubungi Kami</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Butuh bantuan teknis atau memiliki pertanyaan tentang System Awan? Tim support kami siap membantu.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Informasi Kontak Cards */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 transition-all hover:shadow-md">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-6">Informasi Kontak</h3>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-medium text-slate-800 dark:text-white">Telepon</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">+62 812 3456 7890</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Senin - Jumat, 08:00 - 17:00</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-xl">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-medium text-slate-800 dark:text-white">WhatsApp Support</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">+62 812 9876 5432</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Fast response 24/7</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-xl">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-medium text-slate-800 dark:text-white">Email</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">support@systemawan.com</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Balasan max 1x24 jam</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="p-3 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-xl">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-medium text-slate-800 dark:text-white">Kantor Pusat</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Gedung Cyber 1, Lt. 12<br/>
                    Jl. Kuningan Barat Raya No.8<br/>
                    Jakarta Selatan, 12710
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-sm p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-6 h-6 text-blue-200" />
              <h3 className="text-lg font-semibold">Status Sistem</h3>
            </div>
            <p className="text-blue-100 mb-4 text-sm">Semua sistem dan layanan berjalan normal tanpa ada gangguan teknis saat ini.</p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-full text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              All Systems Operational
            </div>
          </div>
        </div>

        {/* Form Kirim Pesan */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 md:p-8">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Kirim Pesan Bantuan</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-8">
              Isi form di bawah ini dan jelaskan kendala atau pertanyaan Anda secara detail.
            </p>

            {isSubmitted && (
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl flex items-start gap-3 animate-in slide-in-from-top-4">
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-green-800 dark:text-green-300">Pesan Terkirim!</h4>
                  <p className="text-sm text-green-700 dark:text-green-400/80 mt-1">
                    Terima kasih telah menghubungi kami. Tiket dukungan Anda telah dibuat dan tim kami akan segera merespon via email.
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-slate-700 dark:text-slate-300">Nama Lengkap</label>
                  <input 
                    type="text" 
                    id="name" 
                    required
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-white"
                    placeholder="Masukkan nama Anda"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">Alamat Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    required
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-white"
                    placeholder="nama@email.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium text-slate-700 dark:text-slate-300">Nomor Telepon (Opsional)</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-white"
                    placeholder="0812xxxxxx"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="category" className="text-sm font-medium text-slate-700 dark:text-slate-300">Kategori Bantuan</label>
                  <select 
                    id="category" 
                    required
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-white appearance-none cursor-pointer"
                  >
                    <option value="">Pilih kategori...</option>
                    <option value="technical">Kendala Teknis (Error/Bug)</option>
                    <option value="billing">Tagihan & Pembayaran</option>
                    <option value="feature">Pertanyaan Fitur</option>
                    <option value="feedback">Kritik & Saran</option>
                    <option value="other">Lainnya</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium text-slate-700 dark:text-slate-300">Subjek</label>
                <input 
                  type="text" 
                  id="subject" 
                  required
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-white"
                  placeholder="Ringkasan masalah Anda"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-slate-700 dark:text-slate-300">Detail Pesan</label>
                <textarea 
                  id="message" 
                  rows={5}
                  required
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none dark:text-white"
                  placeholder="Jelaskan secara rinci kendala atau pertanyaan Anda..."
                ></textarea>
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 pb-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <p>Informasi yang Anda kirimkan aman dan rahasia bersama kami.</p>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Kirim Pesan Sekarang
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
