'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { MLProduct } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { ArrowLeft, ShoppingCart, Truck, Star, Store, Check } from 'lucide-react';
import { mockProducts } from '@/mock-data/products';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<MLProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const productId = params.id as string;

    // En modo SIMULADO, buscar en mockProducts
    const foundProduct = mockProducts.find(p => p.id === productId);

    if (foundProduct) {
      setProduct(foundProduct);
    }
    setLoading(false);
  }, [params.id]);

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: currency === 'MXN' ? 'MXN' : currency,
    }).format(price);
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  const discountPercentage = product?.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Producto no encontrado</h1>
        <Link href="/" className="text-primary-600 hover:text-primary-700">
          Volver al inicio
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con navegación */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Galería de imágenes */}
          <div className="bg-white rounded-lg p-8 border border-gray-200">
            <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={product.thumbnail.replace('http://', 'https://')}
                alt={product.title}
                fill
                className="object-contain p-8"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {discountPercentage > 0 && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1.5 rounded-lg text-sm font-bold">
                  -{discountPercentage}%
                </div>
              )}
            </div>
          </div>

          {/* Información del producto */}
          <div className="space-y-6">
            {/* Condición y ventas */}
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="capitalize">{product.condition === 'new' ? 'Nuevo' : 'Usado'}</span>
              {product.sold_quantity && (
                <span className="text-gray-400">| {product.sold_quantity} vendidos</span>
              )}
            </div>

            {/* Título */}
            <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>

            {/* Calificación (simulada) */}
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">(4.0)</span>
            </div>

            {/* Precio */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              {product.original_price && (
                <p className="text-lg text-gray-500 line-through mb-1">
                  {formatPrice(product.original_price, product.currency_id)}
                </p>
              )}
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-gray-900">
                  {formatPrice(product.price, product.currency_id)}
                </span>
                {discountPercentage > 0 && (
                  <span className="text-lg text-green-600 font-semibold">
                    {discountPercentage}% OFF
                  </span>
                )}
              </div>
            </div>

            {/* Envío */}
            {product.shipping?.free_shipping && (
              <div className="flex items-center gap-3 text-primary-600 bg-primary-50 rounded-lg p-4">
                <Truck className="w-6 h-6" />
                <div>
                  <p className="font-semibold">Envío gratis a todo México</p>
                  <p className="text-sm text-gray-600">Llega en 2-5 días hábiles</p>
                </div>
              </div>
            )}

            {/* Stock */}
            {product.available_quantity && (
              <div className="text-sm text-gray-600">
                Stock disponible: <span className="font-semibold text-gray-900">{product.available_quantity} unidades</span>
              </div>
            )}

            {/* Botón agregar al carrito */}
            <button
              onClick={handleAddToCart}
              className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-lg font-semibold transition-all ${
                addedToCart
                  ? 'bg-green-500 text-white'
                  : 'bg-primary-500 text-white hover:bg-primary-600'
              }`}
            >
              {addedToCart ? (
                <>
                  <Check className="w-6 h-6" />
                  <span>Agregado al carrito</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-6 h-6" />
                  <span>Agregar al carrito</span>
                </>
              )}
            </button>

            {/* Vendedor */}
            {product.seller && (
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center gap-3">
                  <Store className="w-6 h-6 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Vendido por</p>
                    <p className="font-semibold text-gray-900">{product.seller.nickname}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Características del producto */}
        <div className="mt-8 bg-white rounded-lg p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Características principales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Condición</h3>
              <p className="text-gray-600 capitalize">{product.condition === 'new' ? 'Nuevo' : 'Usado'}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Garantía</h3>
              <p className="text-gray-600">12 meses de garantía del fabricante</p>
            </div>
            {product.shipping?.free_shipping && (
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Envío</h3>
                <p className="text-gray-600">Envío gratis a todo el país</p>
              </div>
            )}
            {product.sold_quantity && (
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Ventas</h3>
                <p className="text-gray-600">{product.sold_quantity} unidades vendidas</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
