import { NextRequest, NextResponse } from 'next/server';
import {
  analyzeUserIntent,
  generateResponse,
  generateRecommendation,
  extractSearchFilters
} from '@/lib/gemini';
import { mlService } from '@/lib/mercadolibre';
import { MLProduct } from '@/types';
import { extractFiltersFromProducts } from '@/lib/utils'; // New import

export async function POST(request: NextRequest) {
  try {
    const { message, lastProducts, filters } = await request.json();

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
    console.log('🔍 Intent Analysis Result:', JSON.stringify(analysis, null, 2));

    // 1. Saludo
    if (analysis.intent === 'greeting') {
      return NextResponse.json({
        response: '¡Hola! Soy tu asistente de compras de Multiplica. ¿Qué producto estás buscando hoy?',
        products: [],
        intent: 'greeting',
      });
    }

    // 2. Ayuda
    if (analysis.intent === 'help') {
      return NextResponse.json({
        response: 'Puedo ayudarte a encontrar productos, comparar modelos, o darte reseñas. Por ejemplo: "iPhone 15", "compara iPhone 15 vs Samsung S24", "reseña del Pixel 8".',
        products: [],
        intent: 'help',
      });
    }

    // 3. Agregar al carrito
    if (analysis.intent === 'add_to_cart') {
      let selectedProduct: MLProduct | undefined;

      // Estrategia 1: Buscar por nombre si se especificó
      if (analysis.products && analysis.products.length > 0) {
        const productName = analysis.products[0];
        // Intentar encontrar en lastProducts
        selectedProduct = lastProducts?.find((p: MLProduct) =>
          p.title.toLowerCase().includes(productName.toLowerCase())
        );

        // Si no está en contexto, buscarlo
        if (!selectedProduct) {
          const searchResult = await mlService.searchProducts(productName, 1);
          if (searchResult.results.length > 0) {
            selectedProduct = searchResult.results[0];
          }
        }
      }

      // Estrategia 2: Usar índice si no se encontró por nombre
      if (!selectedProduct) {
        const productIndex = analysis.productIndex || 0;
        if (lastProducts && lastProducts[productIndex]) {
          selectedProduct = lastProducts[productIndex];
        }
      }

      if (selectedProduct) {
        // Buscar productos relacionados
        let suggestedProducts: MLProduct[] = [];
        if (selectedProduct.relatedProducts && selectedProduct.relatedProducts.length > 0) {
          try {
            suggestedProducts = await mlService.getProductsByIds(selectedProduct.relatedProducts);
          } catch (error) {
            console.error('Error buscando productos relacionados:', error);
          }
        }

        return NextResponse.json({
          response: suggestedProducts.length > 0
            ? `¡Excelente elección! He agregado "${selectedProduct.title}" a tu carrito. También te podrían interesar estos accesorios:`
            : `¡Excelente elección! He agregado "${selectedProduct.title}" a tu carrito.`,
          products: [],
          intent: 'add_to_cart',
          productToAdd: selectedProduct,
          suggestedProducts: suggestedProducts
        });
      } else {
        return NextResponse.json({
          response: 'No pude encontrar el producto que quieres agregar. ¿Podrías ser más específico o buscarlo primero?',
          products: [],
          intent: 'add_to_cart',
        });
      }
    }

    // 4. Ver detalles
    if (analysis.intent === 'view_details') {
      const productIndex = analysis.productIndex || 0;
      if (lastProducts && lastProducts[productIndex]) {
        const selectedProduct = lastProducts[productIndex];
        return NextResponse.json({
          response: `Aquí tienes el detalle completo de "${selectedProduct.title}". Te estoy redirigiendo a la página del producto.`,
          products: [],
          intent: 'view_details',
          productId: selectedProduct.id,
        });
      } else {
        return NextResponse.json({
          response: 'Por favor, primero busca algunos productos para poder ver sus detalles.',
          products: [],
          intent: 'view_details',
        });
      }
    }

    // 5. Comparación
    if (analysis.intent === 'comparison') {
      let productsToCompare: MLProduct[] = [];
      // Si no especificó productos pero hay productos en contexto, usar los primeros 2
      if ((!analysis.products || analysis.products.length < 2) && lastProducts && lastProducts.length >= 2) {
        productsToCompare = lastProducts.slice(0, 2);
      } else if (analysis.products && analysis.products.length >= 2) {
        // Buscar los productos mencionados
        for (const productName of analysis.products) {
          const found = lastProducts?.find((p: MLProduct) =>
            p.title.toLowerCase().includes(productName.toLowerCase())
          );
          if (found) {
            productsToCompare.push(found);
          } else {
            const searchResult = await mlService.searchProducts(productName, 1);
            if (searchResult.results.length > 0) {
              productsToCompare.push(searchResult.results[0]);
            }
          }
        }
      }

      if (productsToCompare.length >= 2) {
        // ... Lógica de comparación (simplificada para el ejemplo, manteniendo la original)
        const comparisonPrompt = `Eres un experto en tecnología. Compara: ${productsToCompare.map(p => p.title).join(' vs ')}. Sé CONCISO (max 20 líneas).`;
        try {
          // Usar fetch directo a Gemini para la comparación
          const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + process.env.GOOGLE_API_KEY, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: comparisonPrompt }] }] })
          });
          const data = await response.json();
          const comparisonText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No pude generar la comparación.';

          return NextResponse.json({
            response: 'Aquí está la comparación detallada:',
            comparisonProducts: productsToCompare,
            geminiInsights: comparisonText,
            intent: 'comparison',
            isVisual: true,
          });
        } catch (error) {
          return NextResponse.json({
            response: `Aquí está la comparación de especificaciones:`,
            comparisonProducts: productsToCompare,
            intent: 'comparison',
            isVisual: true,
          });
        }
      } else {
        return NextResponse.json({
          response: 'Para hacer una comparación, necesito al menos 2 productos.',
          products: [],
          intent: 'comparison',
        });
      }
    }

    // 6. Reseña
    if (analysis.intent === 'review' && analysis.products && analysis.products.length > 0) {
      // ... Lógica de reseña (restaurando fetch directo)
      const reviewPrompt = `Reseña breve de: ${analysis.products[0]}. Max 150 palabras.`;
      try {
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + process.env.GOOGLE_API_KEY, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: reviewPrompt }] }] })
        });
        const data = await response.json();
        const reviewText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No pude generar la reseña.';
        return NextResponse.json({ response: reviewText, products: [], intent: 'review' });
      } catch (error) {
        return NextResponse.json({ response: 'No pude generar la reseña.', products: [], intent: 'review' });
      }
    }

    // 7. Búsqueda / Recomendación / Other (Fallback inteligente)
    if (analysis.intent === 'search' || analysis.intent === 'recommendation' || analysis.intent === 'other') {
      let searchResults;
      let searchFilters = { ...filters }; // Iniciar con filtros manuales/activos

      // Solo usar AI para extraer filtros si el mensaje NO es el genérico de "búsqueda filtrada"
      const shouldExtractWithAI = message !== 'búsqueda filtrada';

      if (shouldExtractWithAI) {
        const { extractSearchFilters } = await import('@/lib/gemini');
        const aiFilters = await extractSearchFilters(message);

        // COMBINAR filtros: Los filtros activos tienen prioridad, pero se pueden AGREGAR nuevos filtros del mensaje
        // Por ejemplo, si ya hay storage:["256GB"] activo, y el usuario dice "el negro",
        // entonces queremos storage:["256GB"] + cualquier filtro de color extraído del mensaje

        searchFilters = {
          // Empezar con filtros activos
          ...(filters || {}),
          // Agregar filtros extraídos de AI, sin sobrescribir los activos
          price: filters?.price || aiFilters?.price || analysis.priceRange,
          // Para arrays (brands, ram, storage), combinar en lugar de reemplazar
          brands: [...(filters?.brands || []), ...(aiFilters?.brands || [])].filter((v, i, a) => a.indexOf(v) === i),
          ram: [...(filters?.ram || []), ...(aiFilters?.ram || [])].filter((v, i, a) => a.indexOf(v) === i),
          storage: [...(filters?.storage || []), ...(aiFilters?.storage || [])].filter((v, i, a) => a.indexOf(v) === i),
        };

        // Limpiar arrays vacíos
        if (searchFilters.brands?.length === 0) delete searchFilters.brands;
        if (searchFilters.ram?.length === 0) delete searchFilters.ram;
        if (searchFilters.storage?.length === 0) delete searchFilters.storage;
      }

      console.log('🔍 Filtros activos:', searchFilters);

      if (analysis.intent === 'recommendation') {
        searchResults = await mlService.searchProducts(analysis.searchQuery || '', 10, 0, searchFilters);
      } else {
        searchResults = await mlService.searchProducts(analysis.searchQuery || '', 20, 0, searchFilters);
      }

      const products = searchResults.results;
      const { extractFiltersFromProducts } = await import('@/lib/utils');
      const availableFilters = extractFiltersFromProducts(products);

      console.log('📊 Available Filters:', JSON.stringify(availableFilters, null, 2));
      console.log('🎯 Active Filters:', JSON.stringify(searchFilters, null, 2));

      const { generateResponse } = await import('@/lib/gemini');
      const responseText = await generateResponse(message, products.length, analysis.searchQuery);

      return NextResponse.json({
        response: responseText,
        products: products,
        intent: analysis.intent,
        availableFilters,
        activeFilters: searchFilters
      });
    }

    // Fallback final
    return NextResponse.json({
      response: 'No estoy seguro de cómo ayudarte con eso. ¿Podrías intentar buscar un producto?',
      products: [],
      intent: 'unknown',
    });

  } catch (error) {
    console.error('Error general en chat API:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
