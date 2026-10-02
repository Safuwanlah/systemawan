import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id;
    const sparepart = await prisma.sparepart.findUnique({
      where: { id },
      include: {
        category: true,
        brand: true,
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
    const { name, description, price, minStock, categoryId, brandId } = body;

    const sparepart = await prisma.sparepart.update({
      where: { id },
      data: { 
        name, 
        description, 
        price: price !== undefined ? Number(price) : undefined, 
        minStock: minStock !== undefined ? Number(minStock) : undefined, 
        categoryId, 
        brandId 
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
