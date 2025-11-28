import axios from 'axios';
import { MLProduct, MLSearchResponse, MLCategory } from '@/types';
import { searchMockProducts, getFeaturedMockProducts } from '@/mock-data/products';
import { memoryCache } from './cache';

const ML_API_URL = process.env.NEXT_PUBLIC_ML_API_URL || 'https://api.mercadolibre.com';
const ML_SITE_ID = 'MLM'; // México
const API_MODE = process.env.NEXT_PUBLIC_API_MODE || 'REAL'; // REAL o SIMULADO

// Cache TTL: 1 hour for ML API calls
const ML_CACHE_TTL = 60 * 60 * 1000;

export class MercadoLibreService {
  private apiUrl: string;
  private siteId: string;
  private mode: string;

  constructor() {
    this.apiUrl = ML_API_URL;
    this.siteId = ML_SITE_ID;
    this.mode = API_MODE;

    console.log(`🔧 Mercado Libre Service iniciado en modo: ${this.mode}`);
  }

  /**
   * Buscar productos por término
   */
  async searchProducts(query: string, limit: number = 20, offset: number = 0, filters?: any): Promise<MLSearchResponse> {
    // Create cache key from all parameters
    const cachePayload = {
      method: 'searchProducts',
      mode: this.mode,
      query,
      limit,
      offset,
      filters,
    };

    return memoryCache.withCache(
      cachePayload,
      async () => {
        // Modo SIMULADO: usar datos mock
        if (this.mode === 'SIMULADO') {
          console.log(`🎭 Modo SIMULADO: Buscando "${query}" en datos locales con filtros:`, filters);
          const results = searchMockProducts(query, limit, filters);
          return {
            site_id: this.siteId,
            query: query,
            results,
            paging: {
              total: results.length,
              offset,
              limit,
            },
          };
        }

        // Modo REAL: usar API de Mercado Libre
        try {
          console.log(`🌐 Modo REAL: Buscando "${query}" en Mercado Libre API`);
          const params: any = {
            q: query,
            limit,
            offset,
          };

          // Agregar filtros de precio si existen
          if (filters?.price?.min) params.price_min = filters.price.min;
          if (filters?.price?.max) params.price_max = filters.price.max;

          // Nota: La API de ML tiene filtros específicos (BRAND, RAM, etc) que se pasan diferente
          // Por ahora en modo REAL solo implementamos precio, ya que los IDs de filtro son complejos
          // Para una implementación completa se requeriría mapear los IDs de filtro de ML

          const response = await axios.get(`${this.apiUrl}/sites/${this.siteId}/search`, {
            params,
            headers: {
              'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
              'Accept': 'application/json',
              'Accept-Language': 'es-MX,es;q=0.9',
            },
            timeout: 10000,
          });
          return response.data;
        } catch (error: any) {
          console.error('❌ Error buscando productos en API real:', error?.response?.status, error?.message);
          // Retornar estructura vacía en caso de error
          return {
            site_id: this.siteId,
            query: query,
            results: [],
            paging: {
              total: 0,
              offset: 0,
              limit: limit,
            },
          };
        }
      },
      ML_CACHE_TTL
    );
  }

  /**
   * Obtener productos destacados (ofertas del día)
   */
  async getFeaturedProducts(): Promise<MLProduct[]> {
    const cachePayload = {
      method: 'getFeaturedProducts',
      mode: this.mode,
    };

    return memoryCache.withCache(
      cachePayload,
      async () => {
        // Modo SIMULADO: usar datos mock
        if (this.mode === 'SIMULADO') {
          console.log('🎭 Modo SIMULADO: Obteniendo productos destacados de datos locales');
          return getFeaturedMockProducts(12);
        }

        // Modo REAL: usar API de Mercado Libre
        try {
          console.log('🌐 Modo REAL: Obteniendo productos destacados de Mercado Libre API');
          const response = await axios.get(`${this.apiUrl}/sites/${this.siteId}/search`, {
            params: {
              q: 'electronica',
              limit: 12,
            },
            headers: {
              'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
              'Accept': 'application/json',
              'Accept-Language': 'es-MX,es;q=0.9',
            },
            timeout: 10000,
          });
          return response.data.results || [];
        } catch (error: any) {
          console.error('❌ Error obteniendo productos destacados de API real:', error?.response?.status, error?.message);
          // Retornar array vacío en lugar de lanzar error
          return [];
        }
      },
      ML_CACHE_TTL
    );
  }

  /**
   * Obtener detalles de un producto
   */
  async getProductById(productId: string): Promise<MLProduct | null> {
    // Modo SIMULADO: buscar en datos mock
    if (this.mode === 'SIMULADO') {
      console.log(`🎭 Modo SIMULADO: Buscando producto ${productId} en datos locales`);
      const allProducts = getFeaturedMockProducts(100);
      const product = allProducts.find(p => p.id === productId);
      return product || null;
    }

    // Modo REAL: usar API de Mercado Libre
    try {
      const response = await axios.get(`${this.apiUrl}/items/${productId}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo producto:', error);
      return null;
    }
  }

  /**
   * Obtener categorías
   */
  async getCategories(): Promise<MLCategory[]> {
    // Modo SIMULADO: categorías mock
    if (this.mode === 'SIMULADO') {
      return [
        { id: 'MLM1051', name: 'Celulares y Teléfonos' },
        { id: 'MLM1000', name: 'Electrónica, Audio y Video' },
        { id: 'MLM1144', name: 'Consolas y Videojuegos' },
      ];
    }

    // Modo REAL: usar API de Mercado Libre
    try {
      const response = await axios.get(`${this.apiUrl}/sites/${this.siteId}/categories`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo categorías:', error);
      return [];
    }
  }

  /**
   * Buscar productos por categoría
   */
  async searchByCategory(categoryId: string, limit: number = 20): Promise<MLProduct[]> {
    // Modo SIMULADO: filtrar por categoría en datos mock
    if (this.mode === 'SIMULADO') {
      // Por ahora retornamos productos aleatorios
      return getFeaturedMockProducts(limit);
    }

    // Modo REAL: usar API de Mercado Libre
    try {
      const response = await axios.get(`${this.apiUrl}/sites/${this.siteId}/search`, {
        params: {
          category: categoryId,
          limit,
        },
      });
      return response.data.results;
    } catch (error) {
      console.error('Error buscando por categoría:', error);
      return [];
    }
  }
  /**
   * Obtener múltiples productos por ID
   */
  async getProductsByIds(ids: string[]): Promise<MLProduct[]> {
    if (!ids || ids.length === 0) return [];

    // Modo SIMULADO: buscar en datos mock
    if (this.mode === 'SIMULADO') {
      const allProducts = getFeaturedMockProducts(100);
      return allProducts.filter(p => ids.includes(p.id));
    }

    // Modo REAL: usar API de Mercado Libre
    try {
      const promises = ids.map(id => this.getProductById(id));
      const results = await Promise.all(promises);
      return results.filter((p): p is MLProduct => p !== null);
    } catch (error) {
      console.error('Error obteniendo productos por IDs:', error);
      return [];
    }
  }
}

export const mlService = new MercadoLibreService();
