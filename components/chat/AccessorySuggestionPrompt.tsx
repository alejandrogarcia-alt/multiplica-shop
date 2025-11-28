'use client';

import { MLProduct } from '@/types';
import { Package, Check, X } from 'lucide-react';

interface AccessorySuggestionPromptProps {
    product: MLProduct;
    onResponse: (wantsAccessories: boolean) => void;
}

export default function AccessorySuggestionPrompt({ product, onResponse }: AccessorySuggestionPromptProps) {
    return (
        <div className="mt-4 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-4 border border-primary-200">
            <div className="flex items-start gap-3">
                <div className="bg-primary-100 text-primary-700 p-2 rounded-lg">
                    <Package className="w-5 h-5" />
                </div>
                <div className="flex-1">
                    <h4 className="text-sm font-semibold text-gray-800 mb-2">
                        ¿Te gustaría ver accesorios para tu {product.title}?
                    </h4>
                    <p className="text-xs text-gray-600 mb-3">
                        Tenemos fundas, cargadores, protectores de pantalla y más accesorios compatibles.
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => onResponse(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
                        >
                            <Check className="w-4 h-4" />
                            Sí, mostrar accesorios
                        </button>
                        <button
                            onClick={() => onResponse(false)}
                            className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors border border-gray-300"
                        >
                            <X className="w-4 h-4" />
                            No, gracias
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
