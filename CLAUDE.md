# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Multiplica Shop is an e-commerce platform that combines the Mercado Libre API with a conversational AI shopping assistant powered by Google Gemini. The application features a hybrid interface with a chat panel (1/4 width) and a product display area (3/4 width).

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI**: Google Gemini (gemini-2.5-flash model)
- **External API**: Mercado Libre API (MLM - México)
- **State Management**: React Context (CartContext)
- **Icons**: Lucide React

## Development Commands

```bash
# Install dependencies (see note below for npm permission issues)
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Lint code
npm run lint
```

### npm Permission Issues

If you encounter npm cache permission errors during installation, use one of these solutions from `INSTALACION.md`:
```bash
# Option 1: Fix permissions (recommended)
sudo chown -R $(whoami) ~/.npm
npm install

# Option 2: Clear cache
rm -rf ~/.npm
npm install
```

## Environment Configuration

Required environment variables in `.env.local`:

```env
# Google Gemini API Key (get from https://makersuite.google.com/app/apikey)
GOOGLE_API_KEY=your_api_key_here

# Mercado Libre API URL
NEXT_PUBLIC_ML_API_URL=https://api.mercadolibre.com

# API Mode: SIMULADO or REAL
NEXT_PUBLIC_API_MODE=SIMULADO
```

### API Modes

The application supports two operating modes:

**SIMULADO Mode** (Default for development):
- Uses mock data from `mock-data/products.ts`
- No internet connection required
- 16 mock products (iPhones, Samsung, Pixel, Xiaomi, Motorola)
- Instant responses, no API rate limits
- Set via: `NEXT_PUBLIC_API_MODE=SIMULADO`

**REAL Mode** (For production):
- Uses live Mercado Libre API
- Requires internet connection
- Full product catalog from Mercado Libre
- May have rate limits or localhost blocking issues
- Set via: `NEXT_PUBLIC_API_MODE=REAL`

See `MODO_SIMULADO.md` for detailed documentation on simulated mode.

## Architecture

### Directory Structure

```
app/
  api/
    chat/route.ts          # Main chat API endpoint
    products/route.ts      # Product search endpoint
    products/featured/route.ts  # Featured products endpoint
  product/[id]/page.tsx    # Product detail page
  page.tsx                 # Home page
  layout.tsx               # Root layout with CartProvider
  globals.css              # Global styles

components/
  chat/                    # Chat-related components
  ChatPanel.tsx            # Main chat interface (left 1/4)
  Header.tsx               # App header with cart button
  ProductCard.tsx          # Individual product display
  ProductsGrid.tsx         # Grid layout for products
  CartDrawer.tsx           # Shopping cart drawer

contexts/
  CartContext.tsx          # Global cart state management

lib/
  gemini.ts                # Gemini AI integration
  mercadolibre.ts          # Mercado Libre API service
  utils.ts                 # Utility functions

types/
  index.ts                 # TypeScript type definitions

mock-data/
  products.ts              # Mock product data for SIMULADO mode
```

### Key Architecture Patterns

**API Route Pattern**: The chat endpoint (`app/api/chat/route.ts`) serves as the orchestration layer:
1. Analyzes user intent with Gemini AI (`analyzeUserIntent`)
2. Routes to appropriate handler based on intent (search, comparison, review, add_to_cart, etc.)
3. Fetches products from MercadoLibreService
4. Generates conversational responses with Gemini
5. Returns structured JSON with products, filters, and metadata

**Dual-Mode Service Pattern**: `MercadoLibreService` (lib/mercadolibre.ts) checks `NEXT_PUBLIC_API_MODE`:
- SIMULADO: Routes to mock data functions (`searchMockProducts`, `getFeaturedMockProducts`)
- REAL: Makes HTTP requests to Mercado Libre API

**Intent-Based Chat Flow**: The chat system recognizes multiple intents:
- `search`: Basic product search
- `recommendation`: Personalized product suggestions
- `comparison`: Side-by-side product comparison
- `review`: Product reviews/opinions
- `add_to_cart`: Add product to cart
- `view_details`: Navigate to product detail page
- `greeting`, `help`, `other`

**Filter Extraction**: Two-phase filtering approach:
1. AI-based extraction via `extractSearchFilters` (Gemini analyzes user message)
2. Manual filters from UI (brands, RAM, storage, colors, price range)
3. Both are combined with manual filters taking precedence

## Working with Gemini AI

The `lib/gemini.ts` module provides several AI functions:

- `analyzeUserIntent(message)`: Returns intent classification and extracted entities
- `generateResponse(message, productsCount, searchQuery)`: Conversational response generation
- `generateRecommendation(message, budget)`: Personalized product recommendations
- `extractSearchFilters(message)`: Extract structured filters (brands, RAM, storage, colors, price)

All functions include fallback logic for when Gemini API fails or is unavailable.

## Product Data Schema

Products follow the `MLProduct` interface (types/index.ts):
- Basic fields: id, title, price, currency_id, thumbnail, condition, permalink
- Optional: specs (detailed specifications), relatedProducts (accessory IDs)
- Shipping info, seller info, quantities

Specs include: RAM, storage, processor, screen, camera, battery, connectivity, OS, weight, waterResistance.

## Cart Context

Global cart state is managed via `CartContext` (contexts/CartContext.tsx):
- Add/remove products
- Update quantities
- Calculate totals
- Temporary cart drawer display
- Persisted in React state (not localStorage)

## Common Development Scenarios

**Adding new intent types**:
1. Add to intent type union in `analyzeUserIntent` return type (lib/gemini.ts)
2. Update Gemini prompt with new intent description
3. Add handler case in chat API route (app/api/chat/route.ts)

**Adding mock products**:
Edit `mock-data/products.ts` and add objects to `mockProducts` array with all required MLProduct fields.

**Modifying AI behavior**:
Update prompts in `lib/gemini.ts`. Key prompts:
- Intent analysis: Line 56-102
- Response generation: Line 325-337
- Filter extraction: Line 453-478

**Testing with different API modes**:
Toggle `NEXT_PUBLIC_API_MODE` in `.env.local` and restart dev server (`npm run dev`).

## Port Configuration

Default port: 3000

To run on a different port:
```bash
npm run dev -- -p 3001
```

## Important Notes

- The chat panel maintains message history and product context
- Product searches support pagination (limit/offset parameters)
- Cart state is cleared on page refresh (not persisted)
- Gemini API calls have built-in error handling with fallbacks
- Mock data includes realistic specs for feature development without API dependency
