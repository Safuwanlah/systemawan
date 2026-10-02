const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const sparepart = await prisma.sparepart.findFirst({ where: { code: '123' } });
  
  let user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({ data: { name: 'Admin', email: 'admin@system.local', password: '123', role: 'ADMIN' } });
  }
  
  if (sparepart) {
    if (sparepart.stock === 0) {
      await prisma.$transaction(async (tx) => {
        // 1. Buat catatan transaksi stok masuk (IN)
        await tx.stockTransaction.create({
          data: {
            type: 'IN',
            quantity: 25,
            notes: 'Penyesuaian stok awal otomatis oleh sistem',
            sparepart: { connect: { id: sparepart.id } },
            user: { connect: { id: user.id } }
          }
        });
        
        // 2. Tambah total stok di barang terkait
        await tx.sparepart.update({
          where: { id: sparepart.id },
          data: { stock: { increment: 25 } }
        });
      });
      console.log('Stok berhasil di-update menjadi 25 melalui transaksi!');
    } else {
      console.log('Barang sudah memiliki stok.');
    }
  } else {
    console.log('Barang dengan kode 123 tidak ditemukan.');
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
