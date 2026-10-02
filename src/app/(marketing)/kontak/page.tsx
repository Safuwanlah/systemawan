'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function KontakGarasi() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Terjadi kesalahan saat mengirim pesan.');
      }

      setStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error: any) {
      setStatus('error');
      setErrorMessage(error.message || 'Gagal terhubung ke server.');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            Hubungi <span className="text-red-600">Garasi Inventory</span>
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Punya pertanyaan seputar sistem kami atau ingin menjadwalkan demo khusus untuk bengkel Anda? Tim kami siap membantu kapan saja.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          
          {/* Contact Information (Left Sidebar) */}
          <div className="lg:col-span-1 space-y-8 animate-in fade-in slide-in-from-left-8 duration-700 delay-100">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 space-y-8">
              <h3 className="text-2xl font-bold text-white mb-6">Info Kontak</h3>
              
              <div className="flex items-start gap-4">
                <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-red-500">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-semibold text-white">WhatsApp / Telepon</p>
                  <p className="text-zinc-400 mt-1">+62 812-3456-7890</p>
                  <p className="text-sm text-zinc-500 mt-1">Senin - Sabtu (08:00 - 17:00)</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-red-500">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-semibold text-white">Email Support</p>
                  <p className="text-zinc-400 mt-1">support@garasi-inventory.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-red-500">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-semibold text-white">Kantor Pusat</p>
                  <p className="text-zinc-400 mt-1 leading-relaxed">
                    Jl. Otomotif Raya No. 88<br/>
                    Kawasan Industri Otomotif<br/>
                    Jakarta Selatan, 12710
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form (Right Side) */}
          <div className="lg:col-span-2 animate-in fade-in slide-in-from-right-8 duration-700 delay-200">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 md:p-10">
              <h3 className="text-2xl font-bold text-white mb-6">Kirim Pesan ke Kami</h3>
              
              {/* Status Alerts */}
              {status === 'success' && (
                <div className="mb-8 p-4 bg-red-950/30 border border-red-900/50 rounded-xl flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-red-400">Pesan Terkirim!</h4>
                    <p className="text-sm text-red-300/80 mt-1">
                      Terima kasih telah menghubungi Garasi Inventory. Tim kami akan segera menghubungi Anda kembali.
                    </p>
                  </div>
                </div>
              )}

              {status === 'error' && (
                <div className="mb-8 p-4 bg-zinc-950 border border-red-900/50 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-red-400">Gagal Mengirim</h4>
                    <p className="text-sm text-zinc-400 mt-1">{errorMessage}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nama */}
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-zinc-300">Nama Lengkap</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all text-white placeholder:text-zinc-600"
                      placeholder="Nama Anda atau Bengkel"
                    />
                  </div>
                  
                  {/* WhatsApp */}
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium text-zinc-300">No. WhatsApp</label>
                    <input 
                      type="tel" 
                      id="phone" 
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all text-white placeholder:text-zinc-600"
                      placeholder="Contoh: 081234567890"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-zinc-300">Alamat Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all text-white placeholder:text-zinc-600"
                    placeholder="nama@email.com"
                  />
                </div>

                {/* Pesan */}
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-zinc-300">Pesan / Kebutuhan Anda</label>
                  <textarea 
                    id="message" 
                    name="message"
                    rows={5}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all resize-none text-white placeholder:text-zinc-600"
                    placeholder="Ceritakan detail kebutuhan bengkel Anda di sini..."
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button 
                  type="submit" 
                  disabled={status === 'loading'}
                  className="w-full px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-red-600/20 hover:shadow-red-600/40 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed group"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Mengirim...
                    </>
                  ) : (
                    <>
                      Kirim Pesan Sekarang
                      <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
