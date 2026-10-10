import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id;
    const sparepart = await prisma.sparepart.findUnique({
      where: { id },
      include: {
        category: true,
        supplier: true,
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        }
      }
    });

    if (!sparepart) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(sparepart);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id;
    const body = await request.json();
    const { name, merek, unit, hargaBeli, hargaJual, minStock, stock, location, categoryId, supplierId } = body;

    const sparepart = await prisma.sparepart.update({
      where: { id },
      data: { 
        name, 
        merek, 
        unit, 
        hargaBeli: hargaBeli !== undefined ? Number(hargaBeli) : undefined, 
        hargaJual: hargaJual !== undefined ? Number(hargaJual) : undefined, 
        minStock: minStock !== undefined ? Number(minStock) : undefined, 
        stock: stock !== undefined ? Number(stock) : undefined,
        location,
        categoryId, 
        supplierId 
      },
    });
    
    return NextResponse.json(sparepart);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id;
    await prisma.sparepart.delete({
      where: { id }
    });
    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error: any) {
    // Foreign key constraints will throw here if transactions exist
    return NextResponse.json({ error: 'Failed to delete. Pastikan barang ini tidak memiliki histori transaksi.' }, { status: 400 });
  }
}
