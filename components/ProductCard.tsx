'use client';

import { MLProduct } from '@/types';
import Image from 'next/image';
import { ShoppingCart, Truck } from 'lucide-react';

interface ProductCardProps {
  product: MLProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: currency === 'MXN' ? 'MXN' : currency,
    }).format(price);
  };

  const discountPercentage = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  return (
    <a
      href={product.permalink}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-white rounded-lg border border-gray-200 hover:border-primary-500 hover:shadow-lg transition-all duration-200"
    >
      <div className="relative aspect-square overflow-hidden rounded-t-lg bg-gray-100">
        <Image
          src={product.thumbnail.replace('http://', 'https://')}
          alt={product.title}
          fill
          className="object-contain p-4 group-hover:scale-105 transition-transform duration-200"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />
        {discountPercentage > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold">
            -{discountPercentage}%
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-sm text-gray-900 line-clamp-2 mb-2 group-hover:text-primary-600 transition-colors">
          {product.title}
        </h3>

        <div className="space-y-1">
          {product.original_price && (
            <p className="text-xs text-gray-500 line-through">
              {formatPrice(product.original_price, product.currency_id)}
            </p>
          )}
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-gray-900">
              {formatPrice(product.price, product.currency_id)}
            </span>
          </div>
        </div>

        {product.shipping?.free_shipping && (
          <div className="flex items-center gap-1 mt-2 text-primary-600">
            <Truck className="w-4 h-4" />
            <span className="text-xs font-medium">Envío gratis</span>
          </div>
        )}

        <div className="mt-3">
          <button className="w-full flex items-center justify-center gap-2 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors">
            <ShoppingCart className="w-4 h-4" />
            <span className="text-sm font-medium">Ver producto</span>
          </button>
        </div>
      </div>
    </a>
  );
}
