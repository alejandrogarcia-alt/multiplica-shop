import { GoogleGenAI } from '@google/genai';
import { memoryCache } from './cache';

const apiKey = process.env.GOOGLE_API_KEY || '';

if (!apiKey) {
  console.warn('⚠️  GOOGLE_API_KEY no está configurado en las variables de entorno');
}

const ai = new GoogleGenAI({ apiKey });
const modelName = 'gemini-2.5-flash';

// Cache TTL: 1 hour for Gemini API calls (intent analysis can be cached longer)
const GEMINI_CACHE_TTL = 60 * 60 * 1000;

/**
 * Analiza el mensaje del usuario y extrae la intención de búsqueda
 */
/**
 * Extrae keywords de búsqueda usando reglas simples
 */
function extractKeywords(message: string): string {
  const lowerMessage = message.toLowerCase();

  // Palabras a ignorar (stopwords en español)
  const stopwords = ['quiero', 'busco', 'necesito', 'me', 'gustaría', 'un', 'una', 'el', 'la', 'los', 'las', 'de', 'para', 'con', 'en'];

  // Marcas y productos conocidos
  const brands = ['iphone', 'samsung', 'galaxy', 'pixel', 'xiaomi', 'motorola', 'moto', 'redmi'];

  // Buscar si menciona alguna marca
  for (const brand of brands) {
    if (lowerMessage.includes(brand)) {
      // Extraer el contexto alrededor de la marca
      const words = message.split(/\s+/);
      const brandIndex = words.findIndex(w => w.toLowerCase().includes(brand));

      // Tomar la marca y la palabra siguiente si existe (ej: "iPhone 15")
      if (brandIndex !== -1) {
        const extracted = words.slice(brandIndex, brandIndex + 3).join(' ');
        return extracted;
      }
    }
  }

  // Si no encuentra marca, filtrar stopwords
  const words = message.split(/\s+/).filter(word => !stopwords.includes(word.toLowerCase()));
  return words.join(' ') || message;
}

export async function analyzeUserIntent(userMessage: string): Promise<{
  intent: 'search' | 'greeting' | 'help' | 'comparison' | 'review' | 'add_to_cart' | 'recommendation' | 'view_details' | 'other';
  searchQuery: string;
  category?: string;
  products?: string[];
  productIndex?: number;
  priceRange?: { min?: number; max?: number };
}> {
  // Intentar con Gemini primero
  const prompt = `Eres un asistente de compras inteligente. Analiza el siguiente mensaje del usuario y determina:
1. La intención principal:
   - "search": Buscar productos específicos
   - "greeting": Saludos (hola, buenos días, etc.)
   - "help": Pedir ayuda
   - "comparison": Comparar productos (ej: "compara iPhone 15 vs Samsung S24")
   - "review": Pedir reseña o opinión de un producto (ej: "qué opinas del iPhone 15", "reseña del Galaxy S24")
   - "add_to_cart": Quiere agregar un producto al carrito (ej: "lo quiero", "agrégalo al carrito", "me lo llevo", "sí, ese", "el primero", "el segundo")
   - "recommendation": Pedir recomendaciones personalizadas (ej: "recomiéndame un celular para gaming", "qué me conviene", "cuál es mejor para fotografía")
   - "view_details": Ver detalles de un producto (ej: "quiero ver el detalle", "más información", "especificaciones del primero", "detalles de ese")
   - "other": Otro tipo de consulta

2. Si es búsqueda o recomendación: extrae el término de búsqueda y rango de precios si se menciona.
   IMPORTANTE: Convierte SIEMPRE los términos de búsqueda a SINGULAR, especialmente colores y tipos de producto.
   Ejemplo: "teléfonos negros" -> "teléfono negro", "celulares azules" -> "celular azul".

3. Si es comparación o reseña: extrae los productos mencionados
4. Si es add_to_cart o view_details y menciona un número: extrae el índice (0-based)
5. Si menciona una categoría específica

Mensaje del usuario: "${userMessage}"

Responde SOLO en formato JSON:
{
  "intent": "search" | "greeting" | "help" | "comparison" | "review" | "add_to_cart" | "recommendation" | "view_details" | "other",
  "searchQuery": "término optimizado para búsqueda en SINGULAR",
  "category": "categoría si se menciona",
  "products": ["producto1", "producto2"],
  "productIndex": 0,
  "priceRange": { "min": 10000, "max": 20000 }
}

Ejemplos:
- "compara iPhone 15 vs Samsung S24" → {"intent": "comparison", "products": ["iPhone 15", "Samsung S24"]}
- "qué opinas del iPhone 15 Pro" → {"intent": "review", "products": ["iPhone 15 Pro"]}
- "quiero un iPhone" → {"intent": "search", "searchQuery": "iPhone"}
- "celulares entre 10000 y 20000" → {"intent": "search", "searchQuery": "celular", "priceRange": {"min": 10000, "max": 20000}}
- "teléfonos negros" → {"intent": "search", "searchQuery": "teléfono negro"}
- "menos de 15000 pesos" → {"intent": "search", "searchQuery": "celular", "priceRange": {"max": 15000}}
- "menor a 15000" → {"intent": "search", "searchQuery": "celular", "priceRange": {"max": 15000}}
- "más de 10000" → {"intent": "search", "searchQuery": "celular", "priceRange": {"min": 10000}}
- "desde 10000 hasta 20000" → {"intent": "search", "searchQuery": "celular", "priceRange": {"min": 10000, "max": 20000}}
- "entre 5000 y 10000 pesos" → {"intent": "search", "searchQuery": "celular", "priceRange": {"min": 5000, "max": 10000}}
- "precio máximo 15000" → {"intent": "search", "searchQuery": "celular", "priceRange": {"max": 15000}}
- "recomiéndame un celular para gaming" → {"intent": "recommendation", "searchQuery": "celular gaming"}
- "qué me conviene para fotografía" → {"intent": "recommendation", "searchQuery": "celular fotografía"}
- "quiero ver el detalle del primero" → {"intent": "view_details", "productIndex": 0}
- "más información de ese" → {"intent": "view_details", "productIndex": 0}
- "especificaciones del segundo" → {"intent": "view_details", "productIndex": 1}
- "lo quiero" → {"intent": "add_to_cart", "productIndex": 0}
- "el segundo" → {"intent": "add_to_cart", "productIndex": 1}
- "me llevo ese" → {"intent": "add_to_cart", "productIndex": 0}`;

  // Create cache payload
  const cachePayload = {
    function: 'analyzeUserIntent',
    userMessage,
    prompt: prompt.substring(0, 100), // Include first 100 chars of prompt for cache key variation
  };

  // Try with cache
  const cachedResult = memoryCache.get(cachePayload);
  if (cachedResult) {
    return cachedResult;
  }

  try {
    console.log('🤖 Analizando intención con Gemini...');
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt
    });

    let text = response.text;

    if (!text) text = "";

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0]);
      // Ensure all required fields are present
      const normalizedResult = {
        intent: result.intent || 'other',
        searchQuery: result.searchQuery || '',
        category: result.category,
        products: result.products,
        productIndex: result.productIndex,
        priceRange: result.priceRange,
      };
      console.log('✅ Gemini análisis:', normalizedResult);
      // Cache the result
      memoryCache.set(cachePayload, normalizedResult, GEMINI_CACHE_TTL);
      return normalizedResult;
    }
  } catch (error) {
    console.warn('⚠️  Gemini falló, usando fallback de keywords:', error);
  }

  // Fallback: extracción simple de keywords
  const lowerMessage = userMessage.toLowerCase();

  // Detectar saludos
  const greetings = ['hola', 'buenos días', 'buenas tardes', 'buenas noches', 'hey', 'qué tal'];
  if (greetings.some(g => lowerMessage.includes(g))) {
    return { intent: 'greeting', searchQuery: '' };
  }

  // Detectar pedidos de ayuda
  const helpKeywords = ['ayuda', 'help', 'cómo funciona', 'qué puedes hacer'];
  if (helpKeywords.some(h => lowerMessage.includes(h))) {
    return { intent: 'help', searchQuery: '' };
  }

  // Detectar recomendaciones
  const recommendationKeywords = [
    'recomienda', 'recomendación', 'sugieres', 'sugerencia', 'qué me conviene',
    'cuál me conviene', 'qué es mejor', 'cuál es mejor', 'para gaming',
    'para fotografía', 'para foto', 'para jugar', 'para trabajo',
    'para estudiante', 'para negocio', 'bueno para', 'ideal para'
  ];
  if (recommendationKeywords.some(k => lowerMessage.includes(k))) {
    const searchQuery = extractKeywords(userMessage);
    console.log('🔍 Fallback - Recomendación detectada:', searchQuery);
    return { intent: 'recommendation', searchQuery };
  }

  // Detectar comparaciones
  const comparisonKeywords = ['compara', 'comparar', 'vs', 'versus', 'diferencia', 'mejor que', 'cuál es mejor'];
  if (comparisonKeywords.some(k => lowerMessage.includes(k))) {
    // Intentar extraer los productos mencionados
    const brands = ['iphone', 'samsung', 'galaxy', 'pixel', 'xiaomi', 'motorola', 'moto', 'redmi', 'oneplus', 'nothing', 'realme'];
    const products: string[] = [];

    for (const brand of brands) {
      if (lowerMessage.includes(brand)) {
        const words = userMessage.split(/\s+/);
        const brandIndex = words.findIndex(w => w.toLowerCase().includes(brand));
        if (brandIndex !== -1) {
          products.push(words.slice(brandIndex, brandIndex + 3).join(' '));
        }
      }
    }

    if (products.length >= 2) {
      console.log('🔍 Fallback - Comparación detectada:', products);
      return { intent: 'comparison', searchQuery: '', products };
    }
  }

  // Detectar reseñas
  const reviewKeywords = ['reseña', 'review', 'opinión', 'qué opinas', 'qué tal', 'vale la pena', 'es bueno'];
  if (reviewKeywords.some(k => lowerMessage.includes(k))) {
    const brands = ['iphone', 'samsung', 'galaxy', 'pixel', 'xiaomi', 'motorola', 'moto', 'redmi', 'oneplus', 'nothing', 'realme'];

    for (const brand of brands) {
      if (lowerMessage.includes(brand)) {
        const words = userMessage.split(/\s+/);
        const brandIndex = words.findIndex(w => w.toLowerCase().includes(brand));
        if (brandIndex !== -1) {
          const product = words.slice(brandIndex, brandIndex + 3).join(' ');
          console.log('🔍 Fallback - Reseña detectada:', product);
          return { intent: 'review', searchQuery: '', products: [product] };
        }
      }
    }
  }

  // Detectar "agregar al carrito"
  const addToCartKeywords = ['lo quiero', 'me lo llevo', 'agrégalo', 'añádelo', 'agregar al carrito', 'sí ese', 'ese'];
  const numberWords = ['primero', 'primer', 'segundo', 'tercero', 'cuarto', 'quinto'];

  if (addToCartKeywords.some(k => lowerMessage.includes(k))) {
    console.log('🔍 Fallback - Agregar al carrito detectado');
    return { intent: 'add_to_cart', searchQuery: '', productIndex: 0 };
  }

  // Detectar números o posiciones
  for (let i = 0; i < numberWords.length; i++) {
    if (lowerMessage.includes(numberWords[i])) {
      console.log(`🔍 Fallback - Agregar al carrito (posición ${i})`);
      return { intent: 'add_to_cart', searchQuery: '', productIndex: i };
    }
  }

  // Detectar números directos (1, 2, 3, etc.)
  const numberMatch = lowerMessage.match(/\b([1-9]|1[0-2])\b/);
  if (numberMatch && lowerMessage.length < 20) {
    const index = parseInt(numberMatch[1]) - 1;
    console.log(`🔍 Fallback - Agregar al carrito (número ${index + 1})`);
    return { intent: 'add_to_cart', searchQuery: '', productIndex: index };
  }

  // Detectar "ver detalles"
  const viewDetailsKeywords = [
    'ver detalle', 'ver detalles', 'más información', 'más info',
    'especificaciones', 'especificación', 'características',
    'quiero ver', 'muéstrame', 'enseñame', 'info del', 'detalle del'
  ];

  if (viewDetailsKeywords.some(k => lowerMessage.includes(k))) {
    // Buscar si menciona un número o posición
    for (let i = 0; i < numberWords.length; i++) {
      if (lowerMessage.includes(numberWords[i])) {
        console.log(`🔍 Fallback - Ver detalles (posición ${i})`);
        return { intent: 'view_details', searchQuery: '', productIndex: i };
      }
    }

    // Buscar número directo
    const detailsNumberMatch = lowerMessage.match(/\b([1-9]|1[0-2])\b/);
    if (detailsNumberMatch) {
      const index = parseInt(detailsNumberMatch[1]) - 1;
      console.log(`🔍 Fallback - Ver detalles (número ${index + 1})`);
      return { intent: 'view_details', searchQuery: '', productIndex: index };
    }

    // Por defecto, si solo dice "ver detalle" sin número, asumir el primero
    console.log('🔍 Fallback - Ver detalles (primero por defecto)');
    return { intent: 'view_details', searchQuery: '', productIndex: 0 };
  }

  // Detectar búsqueda por rango de precios
  let priceRange: { min?: number; max?: number } | undefined;

  // Normalizar "mil", "k" y separadores de miles a números
  const normalizedMessage = userMessage
    .replace(/(\d+),(\d{3})/g, '$1$2') // Eliminar comas de miles: 15,000 → 15000
    .replace(/(\d+)\s*mil/gi, (match, num) => String(parseInt(num) * 1000)) // 15 mil → 15000
    .replace(/(\d+)k/gi, (match, num) => String(parseInt(num) * 1000)); // 15k → 15000

  // Detectar "entre X y Y" o "desde X hasta Y"
  const rangePatterns = [
    /entre\s+(\d+)\s*(?:y|a)\s*(\d+)/i,
    /desde\s+(\d+)\s*(?:hasta|a)\s*(\d+)/i,
    /de\s+(\d+)\s*(?:a|hasta)\s*(\d+)/i
  ];

  for (const pattern of rangePatterns) {
    const rangeMatch = normalizedMessage.match(pattern);
    if (rangeMatch) {
      priceRange = {
        min: parseInt(rangeMatch[1]),
        max: parseInt(rangeMatch[2])
      };
      console.log('🔍 Fallback - Rango de precio detectado:', priceRange);
      break;
    }
  }

  // Detectar "menos de X", "menor a X", "hasta X", "máximo X"
  if (!priceRange) {
    const maxPricePatterns = [
      /menos\s+de\s+(\d+)/i,
      /menor\s+(?:a|de|que)\s+(\d+)/i,
      /hasta\s+(\d+)/i,
      /máximo\s+(\d+)/i,
      /no\s+más\s+de\s+(\d+)/i,
      /precio\s+(?:máximo|max)\s+(\d+)/i,
    ];

    for (const pattern of maxPricePatterns) {
      const match = normalizedMessage.match(pattern);
      if (match) {
        priceRange = { max: parseInt(match[1]) };
        console.log('🔍 Fallback - Precio máximo detectado:', priceRange);
        break;
      }
    }
  }

  // Detectar "más de X", "mayor a X", "desde X", "mínimo X"
  if (!priceRange) {
    const minPricePatterns = [
      /más\s+de\s+(\d+)/i,
      /mayor\s+(?:a|de|que)\s+(\d+)/i,
      /desde\s+(\d+)(?!\s*(?:hasta|a))/i, // Desde X pero NO "desde X hasta Y"
      /a\s+partir\s+de\s+(\d+)/i,
      /mínimo\s+(\d+)/i,
      /arriba\s+de\s+(\d+)/i,
      /precio\s+(?:mínimo|min)\s+(\d+)/i,
    ];

    for (const pattern of minPricePatterns) {
      const match = normalizedMessage.match(pattern);
      if (match) {
        priceRange = { min: parseInt(match[1]) };
        console.log('🔍 Fallback - Precio mínimo detectado:', priceRange);
        break;
      }
    }
  }

  // Búsqueda con keywords extraídos
  const searchQuery = extractKeywords(userMessage);
  console.log('🔍 Fallback - Keywords extraídos:', searchQuery);

  return {
    intent: 'search',
    searchQuery,
    ...(priceRange && { priceRange })
  };
}

/**
 * Genera una respuesta conversacional basada en los productos encontrados
 */
export async function generateResponse(
  userMessage: string,
  productsCount: number,
  searchQuery: string
): Promise<string> {
  // Intentar con Gemini primero
  const prompt = `Eres un asistente de compras amigable y profesional de Multiplica Shop.

El usuario preguntó: "${userMessage}"
Búsqueda realizada: "${searchQuery}"
Productos encontrados: ${productsCount}

Genera una respuesta breve (máximo 2-3 líneas) que:
1. Sea amigable y conversacional
2. Confirme lo que el usuario buscó
3. Indique cuántos productos se encontraron
4. Invite al usuario a explorar los resultados

NO incluyas listas de productos, solo texto conversacional.`;

  // Create cache payload
  const cachePayload = {
    function: 'generateResponse',
    userMessage,
    productsCount,
    searchQuery,
  };

  return memoryCache.withCache(
    cachePayload,
    async () => {
      try {
        console.log('🤖 Generando respuesta con Gemini...');
        const response = await ai.models.generateContent({
          model: modelName,
          contents: prompt
        });

        let text = response.text;

        if (!text) text = "";

        console.log('✅ Gemini respuesta generada');
        return text;
      } catch (error) {
        console.warn('⚠️  Gemini falló, usando respuesta simple:', error);
        // Fallback response
        if (productsCount > 0) {
          const responses = [
            `¡Perfecto! Encontré ${productsCount} opciones de ${searchQuery}. Aquí están los mejores resultados para ti.`,
            `Excelente elección. Te muestro ${productsCount} productos de ${searchQuery} que podrían interesarte.`,
            `¡Genial! Hay ${productsCount} opciones de ${searchQuery} disponibles. Échales un vistazo.`,
          ];
          return responses[Math.floor(Math.random() * responses.length)];
        } else {
          return `No encontré productos con "${searchQuery}". Intenta buscar por marca (iPhone, Samsung, Xiaomi) o por tipo de producto.`;
        }
      }
    },
    GEMINI_CACHE_TTL
  );

}

/**
 * Genera sugerencias de productos basadas en el contexto
 */
export async function generateProductSuggestions(userMessage: string): Promise<string[]> {
  const prompt = `Basándote en este mensaje del usuario: "${userMessage}"

Genera 3 sugerencias de búsqueda relacionadas que podrían interesarle.

Responde SOLO con un array JSON de strings:
["sugerencia 1", "sugerencia 2", "sugerencia 3"]`;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt
    });

    let text = response.text;

    if (!text) text = "";


    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    return [];
  } catch (error) {
    console.error('❌ Error generando sugerencias con Gemini:', error);
    return [];
  }
}

/**
 * Genera una recomendación personalizada basada en el contexto del usuario
 */
export async function generateRecommendation(
  userMessage: string,
  budget?: { min?: number; max?: number }
): Promise<string> {
  const budgetText = budget
    ? `Presupuesto: ${budget.min ? `desde $${budget.min}` : ''} ${budget.max ? `hasta $${budget.max}` : ''} MXN`
    : 'Sin restricción de presupuesto especificada';

  const prompt = `Eres un experto en tecnología y smartphones. El usuario está buscando recomendaciones.

Mensaje del usuario: "${userMessage}"
${budgetText}

IMPORTANTE: Proporciona una recomendación CONCISA sobre qué tipo de smartphone buscar (máximo 15-20 líneas).

Analiza la necesidad del usuario y recomienda:
1. Características clave que debe buscar (2-3 puntos)
2. Rango de precio sugerido si no lo especificó
3. Marcas/modelos recomendados (2-3 opciones)
4. Por qué son buenas opciones para su caso

Sé directo y profesional. NO escribas listas muy largas.`;

  try {
    console.log('🤖 Generando recomendación con Gemini...');
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt
    });

    let text = response.text;
    if (!text) text = "";

    console.log('✅ Recomendación generada');
    return text;
    console.warn('⚠️  Gemini falló generando recomendación');
    return 'Basándome en tu consulta, te recomendaría buscar dispositivos que se ajusten a tus necesidades específicas. ¿Podrías darme más detalles sobre tu presupuesto o uso principal?';
  } catch (error) {
    console.warn('⚠️  Gemini falló generando recomendación');
    return 'Basándome en tu consulta, te recomendaría buscar dispositivos que se ajusten a tus necesidades específicas. ¿Podrías darme más detalles sobre tu presupuesto o uso principal?';
  }
}

/**
 * Extrae filtros estructurados del mensaje del usuario para la búsqueda
 */
export async function extractSearchFilters(userMessage: string): Promise<any> {
  const prompt = `Eres un experto en extraer parámetros de búsqueda de productos.
Analiza el siguiente mensaje del usuario y extrae los filtros de búsqueda explícitos.

Mensaje del usuario: "${userMessage}"

Extrae la siguiente información estructurada (si se menciona):
- brands: Array de marcas mencionadas (ej: ["Samsung", "Apple"]). Normaliza nombres.
- ram: Array de memoria RAM mencionada (ej: ["8GB", "12GB"]). Normaliza formato.
- storage: Array de almacenamiento mencionado (ej: ["256GB", "512GB"]). Normaliza formato.
- colors: Array de colores mencionados (ej: ["Negro", "Azul", "Titanio"]). Normaliza a Capital Case.
- price: Objeto con min y/o max si se menciona rango de precio. IMPORTANTE: Extrae SIEMPRE los precios mencionados.

Reglas:
- Si no se menciona un atributo, devuélvelo como null o undefined.
- Sé preciso. Si dice "Samsung de 8GB", brands=["Samsung"] y ram=["8GB"].
- IMPORTANTE: Para precios, detecta todas estas variaciones:
  * "menos de 15000" → {"max": 15000}
  * "menor a 15000" → {"max": 15000}
  * "más de 10000" → {"min": 10000}
  * "mayor a 10000" → {"min": 10000}
  * "entre 10000 y 20000" → {"min": 10000, "max": 20000}
  * "desde 10000 hasta 20000" → {"min": 10000, "max": 20000}
  * "precio máximo 15000" → {"max": 15000}
- Si dice "barato" o "económico" sin precio exacto, usa {"max": 10000}.
- Si dice "celulares", no es un filtro, es la categoría.

Responde SOLO con un JSON válido:
{
  "brands": ["Samsung"] | null,
  "ram": ["8GB"] | null,
  "storage": ["256GB"] | null,
  "colors": ["Negro"] | null,
  "price": { "min": 1000, "max": 5000 } | null
}

Ejemplos:
- "menos de 15000 pesos" → {"price": {"max": 15000}}
- "entre 10000 y 20000" → {"price": {"min": 10000, "max": 20000}}
- "más de 20000" → {"price": {"min": 20000}}
- "Samsung de 8GB y menos de 15000" → {"brands": ["Samsung"], "ram": ["8GB"], "price": {"max": 15000}}`;

  // Create cache payload
  const cachePayload = {
    function: 'extractSearchFilters',
    userMessage,
  };

  return memoryCache.withCache(
    cachePayload,
    async () => {
      try {
        console.log('🤖 Extrayendo filtros con Gemini...');
        const response = await ai.models.generateContent({
          model: modelName,
          contents: prompt
        });

        let text = response.text;
        if (!text) return null;

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const filters = JSON.parse(jsonMatch[0]);
          console.log('✅ Filtros extraídos:', filters);

          // Limpiar nulos para que no estorben en el spread operator
          const cleanFilters: any = {};
          if (filters.brands && filters.brands.length > 0) cleanFilters.brands = filters.brands;
          if (filters.ram && filters.ram.length > 0) cleanFilters.ram = filters.ram;
          if (filters.storage && filters.storage.length > 0) cleanFilters.storage = filters.storage;
          if (filters.colors && filters.colors.length > 0) cleanFilters.colors = filters.colors;
          if (filters.price) cleanFilters.price = filters.price;

          return Object.keys(cleanFilters).length > 0 ? cleanFilters : null;
        }

        return null;
      } catch (error) {
        console.error('⚠️  Error extrayendo filtros:', error);
        return null;
      }
    },
    GEMINI_CACHE_TTL
  );
}
