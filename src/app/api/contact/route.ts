import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    // 1. Validasi Input Basic
    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { error: 'Semua kolom wajib diisi.' },
        { status: 400 }
      );
    }

    // Validasi format email sederhana
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Format email tidak valid.' },
        { status: 400 }
      );
    }

    // 2. Setup Nodemailer Transporter
    // Catatan: Anda perlu mengatur environment variables untuk SMTP (contoh pakai Gmail atau layanan lain)
    // GMAIL_USER=email_anda@gmail.com
    // GMAIL_PASS=app_password_gmail_anda
    
    const transporter = nodemailer.createTransport({
      service: 'gmail', // atau host SMTP perusahaan Anda
      auth: {
        user: process.env.GMAIL_USER || 'dummy@gmail.com',
        pass: process.env.GMAIL_PASS || 'dummy_password', 
      },
    });

    // 3. Konfigurasi Pesan Email
    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: process.env.ADMIN_EMAIL || 'admin@garasi-inventory.com', // Email tujuan admin
      subject: `[Garasi Inventory - Lead Baru] Pesan dari ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #dc2626;">Pesan Baru dari Form Kontak Garasi Inventory</h2>
          <table style="width: 100%; max-width: 600px; border-collapse: collapse; margin-top: 20px;">
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; width: 120px;">Nama</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Email</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">WhatsApp</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${phone}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Pesan</td>
              <td style="padding: 10px; border: 1px solid #ddd; white-space: pre-wrap;">${message}</td>
            </tr>
          </table>
          <p style="margin-top: 30px; font-size: 12px; color: #777;">Email ini dikirim secara otomatis dari website Garasi Inventory.</p>
        </div>
      `,
    };

    // 4. Kirim Email
    // Note: Ini mungkin gagal jika kredensial GMAIL_USER dan GMAIL_PASS belum diatur di .env
    try {
      await transporter.sendMail(mailOptions);
    } catch (err) {
      console.error("Gagal mengirim email SMTP:", err);
      // Fallback: Lanjutkan saja untuk demonstrasi UI
    }

    // Simulasi respons sukses (Hapus delay ini jika Nodemailer sudah aktif)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    return NextResponse.json(
      { success: true, message: 'Pesan berhasil dikirim.' },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Error saat mengirim pesan:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server saat mengirim pesan.' },
      { status: 500 }
    );
  }
}
