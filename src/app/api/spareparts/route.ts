import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || '';
  
  try {
    const spareparts = await prisma.sparepart.findMany({
      where: {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { code: { contains: search, mode: 'insensitive' } },
        ]
      },
      include: {
        category: true,
        supplier: true,
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(spareparts);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch spareparts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, name, merek, unit, hargaBeli, hargaJual, minStock, stock, location, categoryId, supplierId } = body;

    if (!code || !name) {
      return NextResponse.json({ error: 'Code and Name are required' }, { status: 400 });
    }

    const sparepart = await prisma.sparepart.create({
      data: { 
        code, 
        name, 
        merek, 
        unit: unit || 'pcs', 
        hargaBeli: Number(hargaBeli) || 0, 
        hargaJual: Number(hargaJual) || 0, 
        minStock: Number(minStock) || 5, 
        stock: Number(stock) || 0,
        location,
        categoryId, 
        supplierId 
      },
    });
    
    return NextResponse.json(sparepart, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Sparepart code already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create sparepart', details: error.message }, { status: 500 });
  }
}
