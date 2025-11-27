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

  // ====== FADE EFFECT - Comentar estas 2 líneas para deshacer ======
  const [isFading, setIsFading] = useState(false);
  const [pendingProducts, setPendingProducts] = useState<MLProduct[] | null>(null);
  // ==================================================================

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

  // ====== FADE EFFECT - Comentar esta función para deshacer ======
  const handleProductsFound = (newProducts: MLProduct[]) => {
    // Fade out
    setIsFading(true);
    setPendingProducts(newProducts);

    // Después de 300ms, cambiar productos y hacer fade in
    setTimeout(() => {
      setProducts(newProducts);
      setDisplayTitle('Resultados de búsqueda');
      setIsFading(false);
    }, 300);
  };
  // ==================================================================

  // ====== SIN FADE EFFECT - Descomentar esto para deshacer ======
  // const handleProductsFound = (newProducts: MLProduct[]) => {
  //   setProducts(newProducts);
  //   setDisplayTitle('Resultados de búsqueda');
  // };
  // ==================================================================

  return (
    <div className="flex flex-col h-screen">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        {/* Chat Panel - 30% de la pantalla */}
        <div className="w-[30%] min-w-[400px] max-w-[500px]">
          <ChatPanel onProductsFound={handleProductsFound} />
        </div>

        {/* Content Area - 70% de la pantalla */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="max-w-7xl mx-auto p-6">
            {/* Grid de productos */}
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
              </div>
            ) : (
              // ====== FADE EFFECT - Comentar el className y descomentar el de abajo para deshacer ======
              <div className={`transition-opacity duration-300 ${isFading ? 'opacity-0' : 'opacity-100'}`}>
              {/* <div> */}
              {/* ========================================================================================== */}
                <ProductsGrid products={products} title={displayTitle} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
