# Multiplica Shop - E-commerce con Asistente IA

Plataforma de e-commerce moderna que combina la API de Mercado Libre con un asistente de compras inteligente potenciado por Google Gemini.

## Características

- 🤖 **Asistente de IA**: Chatbot conversacional que ayuda a buscar productos usando Gemini
- 🛒 **Integración con Mercado Libre**: Backend completo usando la API de desarrollo de Mercado Libre
- 💬 **Interfaz Híbrida**: Chat lateral (1/4) + Área de contenido multimedia (3/4)
- 🎨 **Diseño Moderno**: Inspirado en Mercado Libre con branding de Multiplica
- ⚡ **Next.js 15**: App Router, TypeScript, Tailwind CSS
- 📱 **Responsive**: Diseño adaptable a diferentes dispositivos

## Stack Tecnológico

- **Frontend**: Next.js 15, React 18, TypeScript
- **Estilos**: Tailwind CSS
- **IA**: Google Gemini (gemini-1.5-flash)
- **Backend**: Next.js API Routes
- **API Externa**: Mercado Libre API (MLM - México)
- **Iconos**: Lucide React

## Instalación

1. **Instalar dependencias**

\`\`\`bash
npm install
\`\`\`

2. **Configurar variables de entorno**

Edita el archivo \`.env.local\`:

\`\`\`env
# Gemini API Key (obtener en https://makersuite.google.com/app/apikey)
GOOGLE_API_KEY=tu_api_key_aqui

# Mercado Libre API
NEXT_PUBLIC_ML_API_URL=https://api.mercadolibre.com
\`\`\`

3. **Ejecutar en desarrollo**

\`\`\`bash
npm run dev
\`\`\`

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## Configuración de API Keys

### Google Gemini API

1. Ve a [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Crea una nueva API Key
3. Copia la key y agrégala al archivo \`.env.local\`

## Uso

1. **Inicio**: Al abrir la aplicación, verás productos destacados/ofertas
2. **Chat**: Usa el panel de chat a la izquierda para buscar productos
   - Ejemplo: "Busco una laptop para trabajo"
   - Ejemplo: "Necesito audífonos bluetooth"
3. **Productos**: Los resultados se muestran en tiempo real en el área principal

## Scripts Disponibles

\`\`\`bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción
npm run start    # Iniciar servidor de producción
npm run lint     # Ejecutar ESLint
\`\`\`

---

Desarrollado con ❤️ usando Next.js y Google Gemini
