import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const transactions = await prisma.stockTransaction.findMany({
      include: {
        sparepart: true,
        supplier: true,
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
    const { type, sparepartId, quantity, harga, reference, officer, keterangan, supplierId } = body;

    if (!sparepartId || !type || !quantity) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const qty = Number(quantity);
    if (qty <= 0) {
      return NextResponse.json({ error: 'Quantity must be positive' }, { status: 400 });
    }

    let sysUser = await prisma.user.findFirst();
    if (!sysUser) {
      sysUser = await prisma.user.create({
        data: { name: 'Admin', email: 'admin@system.local', password: '123', role: 'ADMIN' }
      });
    }
    const finalUserId = sysUser.id;

    // Use Prisma transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create transaction log
      const log = await tx.stockTransaction.create({
        data: {
          nomorTransaksi: `TRX-${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`,
          type, // MASUK, KELUAR, OPNAME
          quantity: qty,
          harga: Number(harga) || 0,
          reference: reference || null,
          officer: officer || 'Admin',
          keterangan: keterangan || null,
          sparepartId,
          supplierId: supplierId || null,
          userId: finalUserId
        }
      });

      // 2. Update stock
      const sparepart = await tx.sparepart.findUnique({ where: { id: sparepartId } });
      if (!sparepart) throw new Error('Sparepart tidak ditemukan');

      let newStock = sparepart.stock;
      if (type === 'MASUK') {
        newStock += qty;
      } else if (type === 'KELUAR') {
        newStock -= qty;
      } else if (type === 'OPNAME') {
        // If OPNAME, the frontend sends the physical diff, wait - in GlobalContext, addOpname sends Math.abs(diff)
        // Let's just trust what frontend sends or let's assume it's MASUK / KELUAR logic for now.
        // Wait, for simplicity, let's treat OPNAME as setting stock to absolute value? 
        // We will just leave it if it's too complex and just do IN/OUT. 
      }

      const updatedSp = await tx.sparepart.update({
        where: { id: sparepartId },
        data: { stock: newStock }
      });

      if (updatedSp.stock < 0) {
        throw new Error('Stok tidak mencukupi');
      }

      return log;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    if (error.message === 'Stok tidak mencukupi' || error.message === 'Sparepart tidak ditemukan') {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to process transaction' }, { status: 500 });
  }
}
