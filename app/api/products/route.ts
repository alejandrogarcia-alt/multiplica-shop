import { NextRequest, NextResponse } from 'next/server';
import { mlService } from '@/lib/mercadolibre';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!query) {
      // Si no hay query, devolver productos destacados
      const products = await mlService.getFeaturedProducts();
      return NextResponse.json({ products });
    }

    // Buscar productos
    const results = await mlService.searchProducts(query, limit, offset);

    return NextResponse.json({
      products: results.results,
      paging: results.paging,
    });
  } catch (error) {
    console.error('Error en products API:', error);
    return NextResponse.json(
      { error: 'Error obteniendo productos' },
      { status: 500 }
    );
  }
}
