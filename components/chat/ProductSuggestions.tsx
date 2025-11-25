'use client';

import { MLProduct } from '@/types';
import { ShoppingCart, Plus } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

interface ProductSuggestionsProps {
    products: MLProduct[];
}

export default function ProductSuggestions({ products }: ProductSuggestionsProps) {
    const { addToCart } = useCart();

    if (!products || products.length === 0) return null;

    return (
        <div className="mt-4 bg-gray-50 rounded-xl p-4 border border-gray-100">
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <span className="bg-primary-100 text-primary-700 p-1 rounded-md">
                    <Plus className="w-3 h-3" />
                </span>
                Comprados juntos frecuentemente
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm flex gap-3 items-center hover:shadow-md transition-shadow"
                    >
                        <div className="w-12 h-12 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                            <img
                                src={product.thumbnail}
                                alt={product.title}
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-800 line-clamp-2 leading-tight mb-1">
                                {product.title}
                            </p>
                            <p className="text-sm font-bold text-primary-600">
                                ${product.price.toLocaleString('es-MX')}
                            </p>
                        </div>
                        <button
                            onClick={() => addToCart(product)}
                            className="p-2 bg-primary-50 text-primary-600 rounded-full hover:bg-primary-600 hover:text-white transition-colors"
                            title="Agregar al carrito"
                        >
                            <ShoppingCart className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
