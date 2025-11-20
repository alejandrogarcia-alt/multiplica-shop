import axios from 'axios';
import { MLProduct, MLSearchResponse, MLCategory } from '@/types';

const ML_API_URL = process.env.NEXT_PUBLIC_ML_API_URL || 'https://api.mercadolibre.com';
const ML_SITE_ID = 'MLM'; // México

export class MercadoLibreService {
  private apiUrl: string;
  private siteId: string;

  constructor() {
    this.apiUrl = ML_API_URL;
    this.siteId = ML_SITE_ID;
  }

  /**
   * Buscar productos por término
   */
  async searchProducts(query: string, limit: number = 20, offset: number = 0): Promise<MLSearchResponse> {
    try {
      const response = await axios.get(`${this.apiUrl}/sites/${this.siteId}/search`, {
        params: {
          q: query,
          limit,
          offset,
        },
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          'Accept': 'application/json',
          'Accept-Language': 'es-MX,es;q=0.9',
        },
        timeout: 10000,
      });
      return response.data;
    } catch (error: any) {
      console.error('Error buscando productos:', error?.response?.status, error?.message);
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
  }

  /**
   * Obtener productos destacados (ofertas del día)
   */
  async getFeaturedProducts(): Promise<MLProduct[]> {
    try {
      // Buscar productos populares - búsqueda simple sin filtros especiales
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
      console.error('Error obteniendo productos destacados:', error?.response?.status, error?.message);
      // Retornar array vacío en lugar de lanzar error
      return [];
    }
  }

  /**
   * Obtener detalles de un producto
   */
  async getProductById(productId: string): Promise<MLProduct> {
    try {
      const response = await axios.get(`${this.apiUrl}/items/${productId}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo producto:', error);
      throw error;
    }
  }

  /**
   * Obtener categorías
   */
  async getCategories(): Promise<MLCategory[]> {
    try {
      const response = await axios.get(`${this.apiUrl}/sites/${this.siteId}/categories`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo categorías:', error);
      throw error;
    }
  }

  /**
   * Buscar productos por categoría
   */
  async searchByCategory(categoryId: string, limit: number = 20): Promise<MLProduct[]> {
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
      throw error;
    }
  }
}

export const mlService = new MercadoLibreService();
