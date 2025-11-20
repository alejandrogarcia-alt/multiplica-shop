import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GOOGLE_API_KEY || '';

if (!apiKey) {
  console.warn('⚠️  GOOGLE_API_KEY no está configurado en las variables de entorno');
}

const ai = new GoogleGenAI({ apiKey });
const modelName = 'gemini-2.5-flash';

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
  intent: 'search' | 'greeting' | 'help' | 'comparison' | 'review' | 'add_to_cart' | 'other';
  searchQuery: string;
  category?: string;
  products?: string[];
  productIndex?: number;
}> {
  // Intentar con Gemini primero
  const prompt = `Eres un asistente de compras inteligente. Analiza el siguiente mensaje del usuario y determina:
1. La intención principal:
   - "search": Buscar productos
   - "greeting": Saludos (hola, buenos días, etc.)
   - "help": Pedir ayuda
   - "comparison": Comparar productos (ej: "compara iPhone 15 vs Samsung S24")
   - "review": Pedir reseña o opinión de un producto (ej: "qué opinas del iPhone 15", "reseña del Galaxy S24")
   - "add_to_cart": Quiere agregar un producto al carrito (ej: "lo quiero", "agrégalo al carrito", "me lo llevo", "sí, ese", "el primero", "el segundo")
   - "other": Otro tipo de consulta

2. Si es búsqueda, comparación o reseña: extrae los productos mencionados
3. Si es add_to_cart y menciona un número: extrae el índice (0-based)
4. Si menciona una categoría específica

Mensaje del usuario: "${userMessage}"

Responde SOLO en formato JSON:
{
  "intent": "search" | "greeting" | "help" | "comparison" | "review" | "add_to_cart" | "other",
  "searchQuery": "término optimizado para búsqueda",
  "category": "categoría si se menciona",
  "products": ["producto1", "producto2"],
  "productIndex": 0
}

Ejemplos:
- "compara iPhone 15 vs Samsung S24" → {"intent": "comparison", "products": ["iPhone 15", "Samsung S24"]}
- "qué opinas del iPhone 15 Pro" → {"intent": "review", "products": ["iPhone 15 Pro"]}
- "quiero un iPhone" → {"intent": "search", "searchQuery": "iPhone"}
- "lo quiero" → {"intent": "add_to_cart", "productIndex": 0}
- "el segundo" → {"intent": "add_to_cart", "productIndex": 1}
- "me llevo ese" → {"intent": "add_to_cart", "productIndex": 0}`;

  try {
    console.log('🤖 Analizando intención con Gemini...');
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt
    });

    let text = response.text;
    
    if(!text) text = "";
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0]);
      console.log('✅ Gemini análisis:', result);
      return result;
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

  // Detectar comparaciones
  const comparisonKeywords = ['compara', 'comparar', 'vs', 'versus', 'diferencia', 'mejor que', 'cuál es mejor'];
  if (comparisonKeywords.some(k => lowerMessage.includes(k))) {
    // Intentar extraer los productos mencionados
    const brands = ['iphone', 'samsung', 'galaxy', 'pixel', 'xiaomi', 'motorola', 'moto', 'redmi'];
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
    const brands = ['iphone', 'samsung', 'galaxy', 'pixel', 'xiaomi', 'motorola', 'moto', 'redmi'];

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

  // Búsqueda con keywords extraídos
  const searchQuery = extractKeywords(userMessage);
  console.log('🔍 Fallback - Keywords extraídos:', searchQuery);
  return { intent: 'search', searchQuery };
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

  try {
    console.log('🤖 Generando respuesta con Gemini...');
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt
    });
  
    let text = response.text;
    
    if(!text) text = "";

    console.log('✅ Gemini respuesta generada');
    return text;
  } catch (error) {
    console.warn('⚠️  Gemini falló, usando respuesta simple');
  }

  // Fallback: respuestas simples
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
    
    if(!text) text = "";


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
