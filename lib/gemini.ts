import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GOOGLE_API_KEY || '';

if (!apiKey) {
  console.warn('GOOGLE_API_KEY no está configurado en las variables de entorno');
}

const genAI = new GoogleGenerativeAI(apiKey);

export const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash-latest',
  generationConfig: {
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 1024,
  },
});

/**
 * Analiza el mensaje del usuario y extrae la intención de búsqueda
 */
export async function analyzeUserIntent(userMessage: string): Promise<{
  intent: 'search' | 'greeting' | 'help' | 'other';
  searchQuery: string;
  category?: string;
}> {
  const prompt = `
Eres un asistente de compras inteligente. Analiza el siguiente mensaje del usuario y determina:
1. La intención (search, greeting, help, other)
2. Si es una búsqueda, extrae el término de búsqueda optimizado
3. Si menciona una categoría específica

Mensaje del usuario: "${userMessage}"

Responde SOLO en formato JSON:
{
  "intent": "search" | "greeting" | "help" | "other",
  "searchQuery": "término optimizado para búsqueda",
  "category": "categoría si se menciona"
}
`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Limpiar la respuesta para obtener solo el JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    return {
      intent: 'other',
      searchQuery: userMessage,
    };
  } catch (error) {
    console.error('Error analizando intención:', error);
    return {
      intent: 'search',
      searchQuery: userMessage,
    };
  }
}

/**
 * Genera una respuesta conversacional basada en los productos encontrados
 */
export async function generateResponse(
  userMessage: string,
  productsCount: number,
  searchQuery: string
): Promise<string> {
  const prompt = `
Eres un asistente de compras amigable y profesional de Multiplica Shop.

El usuario preguntó: "${userMessage}"
Búsqueda realizada: "${searchQuery}"
Productos encontrados: ${productsCount}

Genera una respuesta breve (máximo 2-3 líneas) que:
1. Sea amigable y conversacional
2. Confirme lo que el usuario buscó
3. Indique cuántos productos se encontraron
4. Invite al usuario a explorar los resultados

NO incluyas listas de productos, solo texto conversacional.
`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error('Error generando respuesta:', error);
    return `He encontrado ${productsCount} productos relacionados con "${searchQuery}". ¡Explora los resultados!`;
  }
}

/**
 * Genera sugerencias de productos basadas en el contexto
 */
export async function generateProductSuggestions(userMessage: string): Promise<string[]> {
  const prompt = `
Basándote en este mensaje del usuario: "${userMessage}"

Genera 3 sugerencias de búsqueda relacionadas que podrían interesarle.

Responde SOLO con un array JSON de strings:
["sugerencia 1", "sugerencia 2", "sugerencia 3"]
`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    return [];
  } catch (error) {
    console.error('Error generando sugerencias:', error);
    return [];
  }
}
