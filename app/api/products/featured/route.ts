import { NextResponse } from 'next/server';
import { mlService } from '@/lib/mercadolibre';

export async function GET() {
  try {
    const products = await mlService.getFeaturedProducts();
    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error obteniendo productos destacados:', error);
    return NextResponse.json(
      { error: 'Error obteniendo productos destacados' },
      { status: 500 }
    );
  }
}
