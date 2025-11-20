import { NextRequest, NextResponse } from 'next/server';
import { analyzeUserIntent, generateResponse } from '@/lib/gemini';
import { mlService } from '@/lib/mercadolibre';

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Mensaje inválido' },
        { status: 400 }
      );
    }

    // Analizar la intención del usuario con Gemini
    const analysis = await analyzeUserIntent(message);

    // Si es un saludo o ayuda, responder directamente
    if (analysis.intent === 'greeting') {
      return NextResponse.json({
        response: '¡Hola! Soy tu asistente de compras de Multiplica. ¿Qué producto estás buscando hoy?',
        products: [],
        intent: 'greeting',
      });
    }

    if (analysis.intent === 'help') {
      return NextResponse.json({
        response: 'Puedo ayudarte a encontrar productos en Mercado Libre. Solo dime qué estás buscando, por ejemplo: "Busco una laptop para trabajo" o "Necesito audífonos bluetooth".',
        products: [],
        intent: 'help',
      });
    }

    // Si es una búsqueda, buscar productos
    if (analysis.intent === 'search' && analysis.searchQuery) {
      const searchResults = await mlService.searchProducts(analysis.searchQuery, 12);
      const products = searchResults.results;

      // Generar respuesta conversacional con Gemini
      const aiResponse = await generateResponse(
        message,
        products.length,
        analysis.searchQuery
      );

      return NextResponse.json({
        response: aiResponse,
        products,
        intent: 'search',
        searchQuery: analysis.searchQuery,
      });
    }

    // Respuesta por defecto
    return NextResponse.json({
      response: 'No estoy seguro de cómo ayudarte con eso. ¿Podrías ser más específico sobre qué producto buscas?',
      products: [],
      intent: 'other',
    });
  } catch (error) {
    console.error('Error en chat API:', error);
    return NextResponse.json(
      { error: 'Error procesando el mensaje' },
      { status: 500 }
    );
  }
}
