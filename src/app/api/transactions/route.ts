import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const transactions = await prisma.stockTransaction.findMany({
      include: {
        sparepart: true,
        user: { select: { id: true, name: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    });
    return NextResponse.json(transactions);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sparepartId, type, quantity, notes, userId } = body;

    if (!sparepartId || !type || !quantity) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const qty = Number(quantity);
    if (qty <= 0) {
      return NextResponse.json({ error: 'Quantity must be positive' }, { status: 400 });
    }

    // Auto-assign admin user if no userId provided (since we don't have Auth yet)
    let finalUserId = userId;
    if (!finalUserId) {
      let sysUser = await prisma.user.findFirst();
      if (!sysUser) {
        sysUser = await prisma.user.create({
          data: { name: 'Admin', email: 'admin@system.local', password: '123', role: 'ADMIN' }
        });
      }
      finalUserId = sysUser.id;
    }

    // Gunakan transaksi database untuk memastikan data log dan stok sinkron
    const result = await prisma.$transaction(async (tx) => {
      // 1. Buat log transaksi
      const log = await tx.stockTransaction.create({
        data: {
          sparepartId,
          type,
          quantity: qty,
          notes,
          userId: finalUserId
        }
      });

      // 2. Update stok asli barang
      const sparepart = await tx.sparepart.update({
        where: { id: sparepartId },
        data: {
          stock: {
            [type === 'IN' ? 'increment' : 'decrement']: qty
          }
        }
      });

      // 3. Validasi stok tidak boleh minus jika transaksi keluar (OUT)
      if (sparepart.stock < 0) {
        throw new Error('Stok tidak mencukupi');
      }

      return log;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    if (error.message === 'Stok tidak mencukupi') {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to process transaction' }, { status: 500 });
  }
}
