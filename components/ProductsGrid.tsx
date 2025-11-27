'use client';

import { MLProduct } from '@/types';
import ProductCard from './ProductCard';

interface ProductsGridProps {
  products: MLProduct[];
  title?: string;
}

export default function ProductsGrid({ products, title = 'Productos' }: ProductsGridProps) {
  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <p className="text-lg">No hay productos para mostrar</p>
        <p className="text-sm mt-2">Usa el chat para buscar productos</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* ====== FADE EFFECT - Comentar el map con animación y descomentar el de abajo para deshacer ====== */}
        {products.map((product, index) => (
          <div
            key={product.id}
            className="animate-fadeIn"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <ProductCard product={product} />
          </div>
        ))}
        {/* {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))} */}
        {/* ================================================================================================= */}
      </div>
    </div>
  );
}
