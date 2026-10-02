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
        brand: true,
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
    const { code, name, description, price, minStock, categoryId, brandId } = body;

    if (!code || !name) {
      return NextResponse.json({ error: 'Code and Name are required' }, { status: 400 });
    }

    const sparepart = await prisma.sparepart.create({
      data: { 
        code, 
        name, 
        description, 
        price: Number(price) || 0, 
        minStock: Number(minStock) || 5, 
        categoryId, 
        brandId 
      },
    });
    
    return NextResponse.json(sparepart, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Sparepart code already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create sparepart' }, { status: 500 });
  }
}
