import { NextRequest, NextResponse } from 'next/server';
import { analyzeUserIntent, generateResponse } from '@/lib/gemini';
import { mlService } from '@/lib/mercadolibre';

export async function POST(request: NextRequest) {
  try {
    const { message, lastProducts } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Mensaje inválido' },
        { status: 400 }
      );
    }

    // Crear contexto con los productos previos
    let contextMessage = message;
    if (lastProducts && lastProducts.length > 0) {
      const productsContext = lastProducts.map((p: any, idx: number) =>
        `${idx + 1}. ${p.title} - $${p.price}`
      ).join('\n');
      contextMessage = `Contexto: El usuario está viendo estos productos:\n${productsContext}\n\nMensaje del usuario: ${message}`;
    }

    // Analizar la intención del usuario con Gemini
    const analysis = await analyzeUserIntent(contextMessage);

    // Si es un saludo, responder directamente
    if (analysis.intent === 'greeting') {
      return NextResponse.json({
        response: '¡Hola! Soy tu asistente de compras de Multiplica. ¿Qué producto estás buscando hoy?',
        products: [],
        intent: 'greeting',
      });
    }

    // Si es ayuda, responder directamente
    if (analysis.intent === 'help') {
      return NextResponse.json({
        response: 'Puedo ayudarte a encontrar productos, comparar modelos, o darte reseñas. Por ejemplo: "iPhone 15", "compara iPhone 15 vs Samsung S24", "reseña del Pixel 8".',
        products: [],
        intent: 'help',
      });
    }

    // Si quiere agregar al carrito
    if (analysis.intent === 'add_to_cart') {
      const productIndex = analysis.productIndex || 0;

      if (lastProducts && lastProducts[productIndex]) {
        const selectedProduct = lastProducts[productIndex];
        return NextResponse.json({
          response: `¡Excelente elección! He agregado "${selectedProduct.title}" a tu carrito.`,
          products: [],
          intent: 'add_to_cart',
          productToAdd: selectedProduct,
        });
      } else {
        return NextResponse.json({
          response: 'Por favor, primero busca algunos productos para poder agregarlos al carrito.',
          products: [],
          intent: 'add_to_cart',
        });
      }
    }

    // Si es comparación, generar comparativa con Gemini
    if (analysis.intent === 'comparison') {
      let productsToCompare: string[] = [];

      // Si no especificó productos pero hay productos en contexto, usar los primeros 2
      if ((!analysis.products || analysis.products.length < 2) && lastProducts && lastProducts.length >= 2) {
        productsToCompare = lastProducts.slice(0, 2).map((p: any) => p.title);
      } else if (analysis.products && analysis.products.length >= 2) {
        productsToCompare = analysis.products;
      }

      if (productsToCompare.length >= 2) {
        const comparisonPrompt = `Eres un experto en tecnología. Compara los siguientes smartphones: ${productsToCompare.join(' vs ')}.

IMPORTANTE: Sé EXTREMADAMENTE CONCISO. Máximo 20-25 líneas en total.

Proporciona una comparación objetiva en 4-5 puntos clave (1-2 líneas cada uno):
- Rendimiento y procesador
- Cámara
- Batería
- Precio/valor
- Conclusión breve: cuál recomendarías y por qué (2-3 líneas)

Responde en español de manera MUY concisa y profesional. Sin introducciones largas.`;

      try {
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + process.env.GOOGLE_API_KEY, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: comparisonPrompt }] }]
          })
        });

        const data = await response.json();
        const comparisonText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No pude generar la comparación.';

        return NextResponse.json({
          response: comparisonText,
          products: [],
          intent: 'comparison',
        });
      } catch (error) {
        console.error('Error generando comparación:', error);
        return NextResponse.json({
          response: `Para comparar ${productsToCompare.join(' vs ')}, te recomiendo buscar cada modelo individualmente para ver sus especificaciones.`,
          products: [],
          intent: 'comparison',
        });
      }
      } else {
        return NextResponse.json({
          response: 'Para hacer una comparación, necesito al menos 2 productos. Por favor busca algunos productos primero o especifica cuáles quieres comparar.',
          products: [],
          intent: 'comparison',
        });
      }
    }

    // Si es reseña, generar reseña con Gemini
    if (analysis.intent === 'review' && analysis.products && analysis.products.length > 0) {
      const reviewPrompt = `Eres un experto en tecnología. Proporciona una reseña objetiva del smartphone: ${analysis.products[0]}.

IMPORTANTE: Sé EXTREMADAMENTE CONCISO. Máximo 20-25 líneas en total.

Incluye (cada sección 2-3 líneas máximo):
- Características principales (2-3 líneas)
- Puntos fuertes (2-3 puntos en 1-2 líneas)
- Puntos débiles (2-3 puntos en 1-2 líneas)
- Para quién es recomendable (1-2 líneas)
- Conclusión final (2-3 líneas)

Responde en español de manera MUY concisa y profesional. Sin introducciones largas. Máximo 150 palabras.`;

      try {
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + process.env.GOOGLE_API_KEY, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: reviewPrompt }] }]
          })
        });

        const data = await response.json();
        const reviewText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No pude generar la reseña.';

        return NextResponse.json({
          response: reviewText,
          products: [],
          intent: 'review',
        });
      } catch (error) {
        console.error('Error generando reseña:', error);
        return NextResponse.json({
          response: `Para obtener más información sobre ${analysis.products[0]}, te recomiendo buscarlo en nuestra tienda.`,
          products: [],
          intent: 'review',
        });
      }
    }

    // Buscar productos (intent: search por defecto)
    let searchQuery = analysis.searchQuery || message;

    // Si el mensaje original contiene búsqueda por precio, usar el mensaje original
    const priceKeywords = [
      'precio similar', 'parecido al', 'similar al', 'más barato', 'más caro',
      'entre', 'menos de', 'más de', 'rango de precio', 'o más', 'o menos',
      'desde', 'hasta', 'a partir de', 'mínimo', 'máximo', 'arriba de',
      'no más de', 'pesos'
    ];
    const hasPriceSearch = priceKeywords.some(keyword => message.toLowerCase().includes(keyword));

    if (hasPriceSearch) {
      // Usar mensaje original para preservar contexto de precio
      searchQuery = message;
    }

    const searchResults = await mlService.searchProducts(searchQuery, 12);
    const products = searchResults.results;

    // Generar respuesta conversacional con Gemini
    const aiResponse = await generateResponse(
      message,
      products.length,
      searchQuery
    );

    return NextResponse.json({
      response: aiResponse,
      products,
      intent: 'search',
      searchQuery,
    });
  } catch (error) {
    console.error('Error en chat API:', error);
    return NextResponse.json(
      { error: 'Error procesando el mensaje' },
      { status: 500 }
    );
  }
}
