'use client';

import StaggerItem from '@/components/dashboard/StaggerItem';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      
      {/* Header */}
      <StaggerItem>
        <div className="flex flex-col gap-1 mb-8">
          <h1 className="text-[24px] font-bold text-[#F5F7FF] tracking-tight">Pengaturan Sistem</h1>
          <div className="text-[13px] text-[#858BA8] flex items-center gap-2">
            <span>Dashboard</span>
            <span>/</span>
            <span className="text-[#3867FF]">Pengaturan</span>
          </div>
        </div>
      </StaggerItem>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Settings Navigation */}
        <StaggerItem className="lg:col-span-1">
          <div className="bg-[#151832] border border-[#252946] rounded-xl overflow-hidden shadow-sm">
            <nav className="flex flex-col p-2 space-y-1">
              <button className="text-left px-4 py-2.5 rounded-lg text-[14px] font-medium bg-[#3867FF]/10 text-[#3867FF]">
                Profil Pengguna
              </button>
              <button className="text-left px-4 py-2.5 rounded-lg text-[14px] font-medium text-[#858BA8] hover:bg-[#11142B] hover:text-[#F5F7FF] transition-colors">
                Keamanan & Password
              </button>
              <button className="text-left px-4 py-2.5 rounded-lg text-[14px] font-medium text-[#858BA8] hover:bg-[#11142B] hover:text-[#F5F7FF] transition-colors">
                Notifikasi
              </button>
              <button className="text-left px-4 py-2.5 rounded-lg text-[14px] font-medium text-[#858BA8] hover:bg-[#11142B] hover:text-[#F5F7FF] transition-colors">
                Tampilan (Theme)
              </button>
            </nav>
          </div>
        </StaggerItem>

        {/* Settings Content */}
        <StaggerItem className="lg:col-span-3">
          <div className="space-y-6">
            <div className="bg-[#151832] border border-[#252946] rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-[#F5F7FF] text-[16px] mb-6">Informasi Profil</h3>
              
              <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 pb-8 border-b border-[#252946]">
                <div className="w-20 h-20 rounded-full bg-[#3867FF] flex items-center justify-center text-white text-2xl font-bold">
                  AJ
                </div>
                <div className="flex flex-col gap-3 w-full sm:w-auto">
                  <button className="px-4 py-2 bg-[#3867FF] hover:bg-[#2B51D1] text-white text-[13px] font-medium rounded-lg transition-colors">
                    Ubah Foto
                  </button>
                  <button className="px-4 py-2 bg-transparent border border-[#252946] hover:bg-[#11142B] text-[#858BA8] hover:text-[#F5F7FF] text-[13px] font-medium rounded-lg transition-colors">
                    Hapus
                  </button>
                </div>
              </div>

              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-medium text-[#858BA8]">Nama Lengkap</label>
                    <input 
                      type="text" 
                      defaultValue="Adam Joe"
                      className="w-full px-4 py-2.5 bg-[#11142B] border border-[#252946] rounded-lg text-[#F5F7FF] text-[14px] focus:outline-none focus:border-[#3867FF] transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-medium text-[#858BA8]">Email</label>
                    <input 
                      type="email" 
                      defaultValue="admin@systemawan.com"
                      className="w-full px-4 py-2.5 bg-[#11142B] border border-[#252946] rounded-lg text-[#F5F7FF] text-[14px] focus:outline-none focus:border-[#3867FF] transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-medium text-[#858BA8]">Nomor Telepon</label>
                    <input 
                      type="text" 
                      defaultValue="081234567890"
                      className="w-full px-4 py-2.5 bg-[#11142B] border border-[#252946] rounded-lg text-[#F5F7FF] text-[14px] focus:outline-none focus:border-[#3867FF] transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-medium text-[#858BA8]">Peran (Role)</label>
                    <input 
                      type="text" 
                      defaultValue="Administrator"
                      disabled
                      className="w-full px-4 py-2.5 bg-[#080A1F] border border-[#252946] rounded-lg text-[#858BA8] text-[14px] cursor-not-allowed opacity-70"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button type="submit" className="px-6 py-2.5 bg-[#3867FF] hover:bg-[#2B51D1] text-white text-[14px] font-medium rounded-lg transition-colors">
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            </div>
          </div>
        </StaggerItem>
      </div>
    </div>
  );
}
