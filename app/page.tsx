'use client';

import { useState, useEffect } from 'react';
import ChatPanel from '@/components/ChatPanel';
import ProductsGrid from '@/components/ProductsGrid';
import Header from '@/components/Header';
import { MLProduct } from '@/types';
import { Sparkles } from 'lucide-react';

export default function Home() {
  const [products, setProducts] = useState<MLProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [displayTitle, setDisplayTitle] = useState('Productos Destacados');

  useEffect(() => {
    // Cargar productos destacados al inicio
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/products/featured');
      const data = await response.json();
      setProducts(data.products);
      setDisplayTitle('Productos Destacados');
    } catch (error) {
      console.error('Error cargando productos destacados:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductsFound = (newProducts: MLProduct[]) => {
    setProducts(newProducts);
    setDisplayTitle('Resultados de búsqueda');
  };

  return (
    <div className="flex flex-col h-screen">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        {/* Chat Panel - 1/4 de la pantalla */}
        <div className="w-1/4 min-w-[300px] max-w-[400px]">
          <ChatPanel onProductsFound={handleProductsFound} />
        </div>

        {/* Content Area - 3/4 de la pantalla */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="max-w-7xl mx-auto p-6">
            {/* Banner informativo */}
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg p-6 mb-8 text-white">
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="w-6 h-6" />
                <h2 className="text-2xl font-bold">Compra con Inteligencia Artificial</h2>
              </div>
              <p className="text-primary-50">
                Usa el chat para decirle a nuestro asistente qué necesitas y te ayudaremos a encontrar
                los mejores productos al mejor precio.
              </p>
            </div>

            {/* Grid de productos */}
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
              </div>
            ) : (
              <ProductsGrid products={products} title={displayTitle} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
