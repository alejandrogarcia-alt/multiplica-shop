'use client';

import { MLProduct } from '@/types';
import { useState } from 'react';
import { Maximize2 } from 'lucide-react';

interface ComparisonTableProps {
    products: MLProduct[];
    geminiInsights?: string;
}

export default function ComparisonTable({ products, geminiInsights }: ComparisonTableProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (products.length < 2) {
        return <div className="text-gray-600">Se necesitan al menos 2 productos para comparar</div>;
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
        }).format(price);
    };

    const TableContent = () => (
        <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm text-xs">
            <thead>
                <tr className="bg-gradient-to-r from-primary-500 to-primary-600">
                    <th className="p-3 text-left text-white font-semibold sticky left-0 bg-primary-500">Característica</th>
                    {products.map((product) => (
                        <th key={product.id} className="p-3 text-left text-white font-semibold min-w-[150px]">
                            <div className="line-clamp-2">{product.title.split(' ').slice(0, 3).join(' ')}</div>
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {/* Precio */}
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="p-3 font-medium text-gray-700 sticky left-0 bg-white">💰 Precio</td>
                    {products.map((product) => (
                        <td key={product.id} className="p-3 font-bold text-primary-600">
                            {formatPrice(product.price)}
                        </td>
                    ))}
                </tr>

                {/* Procesador */}
                {products.some(p => p.specs?.processor) && (
                    <tr className="border-b border-gray-200 hover:bg-gray-50 bg-blue-50">
                        <td className="p-3 font-medium text-gray-700 sticky left-0 bg-blue-50">⚡ Procesador</td>
                        {products.map((product) => (
                            <td key={product.id} className="p-3 text-gray-800">
                                {product.specs?.processor || '-'}
                            </td>
                        ))}
                    </tr>
                )}

                {/* RAM */}
                {products.some(p => p.specs?.ram) && (
                    <tr className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="p-3 font-medium text-gray-700 sticky left-0 bg-white">💾 RAM</td>
                        {products.map((product) => (
                            <td key={product.id} className="p-3 text-gray-800">
                                {product.specs?.ram || '-'}
                            </td>
                        ))}
                    </tr>
                )}

                {/* Almacenamiento */}
                {products.some(p => p.specs?.storage) && (
                    <tr className="border-b border-gray-200 hover:bg-gray-50 bg-blue-50">
                        <td className="p-3 font-medium text-gray-700 sticky left-0 bg-blue-50">💿 Almacenamiento</td>
                        {products.map((product) => (
                            <td key={product.id} className="p-3 text-gray-800">
                                {product.specs?.storage || '-'}
                            </td>
                        ))}
                    </tr>
                )}

                {/* Pantalla */}
                {products.some(p => p.specs?.screen) && (
                    <tr className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="p-3 font-medium text-gray-700 sticky left-0 bg-white">📱 Pantalla</td>
                        {products.map((product) => (
                            <td key={product.id} className="p-3 text-gray-800">
                                {product.specs?.screen ? (
                                    <div>
                                        <div>{product.specs.screen.size} {product.specs.screen.type}</div>
                                        <div className="text-green-600 font-medium">{product.specs.screen.refresh}Hz</div>
                                    </div>
                                ) : '-'}
                            </td>
                        ))}
                    </tr>
                )}

                {/* Cámara Principal */}
                {products.some(p => p.specs?.camera) && (
                    <tr className="border-b border-gray-200 hover:bg-gray-50 bg-blue-50">
                        <td className="p-3 font-medium text-gray-700 sticky left-0 bg-blue-50">📷 Cámara</td>
                        {products.map((product) => (
                            <td key={product.id} className="p-3 text-gray-800">
                                {product.specs?.camera ? (
                                    <div className="text-xs">
                                        <div className="font-medium">{product.specs.camera.main}</div>
                                        {product.specs.camera.ultrawide && <div>UW: {product.specs.camera.ultrawide}</div>}
                                        {product.specs.camera.telephoto && <div>Tele: {product.specs.camera.telephoto}</div>}
                                    </div>
                                ) : '-'}
                            </td>
                        ))}
                    </tr>
                )}

                {/* Batería */}
                {products.some(p => p.specs?.battery) && (
                    <tr className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="p-3 font-medium text-gray-700 sticky left-0 bg-white">🔋 Batería</td>
                        {products.map((product) => (
                            <td key={product.id} className="p-3 text-gray-800">
                                {product.specs?.battery ? (
                                    <div className="text-xs">
                                        <div className="font-medium">{product.specs.battery.capacity}</div>
                                        <div className="text-gray-600">{product.specs.battery.charging}</div>
                                    </div>
                                ) : '-'}
                            </td>
                        ))}
                    </tr>
                )}

                {/* 5G */}
                {products.some(p => p.specs?.connectivity) && (
                    <tr className="border-b border-gray-200 hover:bg-gray-50 bg-blue-50">
                        <td className="p-3 font-medium text-gray-700 sticky left-0 bg-blue-50">📡 Conectividad</td>
                        {products.map((product) => (
                            <td key={product.id} className="p-3 text-gray-800">
                                {product.specs?.connectivity?.includes('5G') ? (
                                    <span className="text-green-600 font-medium">✓ 5G</span>
                                ) : (
                                    <span className="text-gray-400">-</span>
                                )}
                            </td>
                        ))}
                    </tr>
                )}

                {/* Peso */}
                {products.some(p => p.specs?.weight) && (
                    <tr className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="p-3 font-medium text-gray-700 sticky left-0 bg-white">⚖️ Peso</td>
                        {products.map((product) => (
                            <td key={product.id} className="p-3 text-gray-800">
                                {product.specs?.weight ? `${product.specs.weight}g` : '-'}
                            </td>
                        ))}
                    </tr>
                )}

                {/* Resistencia al agua */}
                {products.some(p => p.specs?.waterResistance) && (
                    <tr className="hover:bg-gray-50 bg-blue-50">
                        <td className="p-3 font-medium text-gray-700 sticky left-0 bg-blue-50">💧 Resistencia</td>
                        {products.map((product) => (
                            <td key={product.id} className="p-3 text-gray-800">
                                {product.specs?.waterResistance || '-'}
                            </td>
                        ))}
                    </tr>
                )}
            </tbody>
        </table>
    );

    return (
        <div className="relative">
            {/* Vista compacta en el chat con botón para expandir */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                        <span>📊</span>
                        <span>Comparación de {products.length} productos</span>
                    </h4>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                    >
                        <Maximize2 className="w-4 h-4" />
                        Ver comparación completa
                    </button>
                </div>
                <p className="text-xs text-gray-600">
                    Comparando: {products.map(p => p.title.split(' ').slice(0, 2).join(' ')).join(' vs ')}
                </p>
            </div>

            {/* Modal de comparación */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col">
                        {/* Header del modal */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-primary-500 to-primary-600">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <span>📊</span>
                                <span>Comparación Detallada</span>
                            </h3>
                        </div>

                        {/* Contenido del modal con scroll */}
                        <div className="flex-1 overflow-y-auto p-6">
                            <TableContent />

                            {/* Insights de Gemini */}
                            {geminiInsights && (
                                <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                                    <h4 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                                        <span>🤖</span>
                                        <span>Análisis IA</span>
                                    </h4>
                                    <div className="text-sm text-gray-700 whitespace-pre-wrap">{geminiInsights}</div>
                                </div>
                            )}
                        </div>

                        {/* Footer del modal */}
                        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
