'use client';

import { useState, useEffect, useRef } from 'react';
import { SearchFilters as SearchFiltersType } from '@/types';
import { Filter, X } from 'lucide-react';

interface SearchFiltersProps {
    availableFilters: SearchFiltersType;
    activeFilters?: SearchFiltersType;
    onFiltersChange: (filters: SearchFiltersType) => void;
}

export default function SearchFilters({
    availableFilters,
    activeFilters,
    onFiltersChange,
}: SearchFiltersProps) {
    // Price State
    const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({
        min: availableFilters.price?.min || 0,
        max: availableFilters.price?.max || 50000,
    });

    // Other Filters State
    const [selectedBrands, setSelectedBrands] = useState<string[]>(activeFilters?.brands || []);
    const [selectedRam, setSelectedRam] = useState<string[]>(activeFilters?.ram || []);
    const [selectedStorage, setSelectedStorage] = useState<string[]>(activeFilters?.storage || []);

    const [isAdjustingPrice, setIsAdjustingPrice] = useState(false);

    // Debounce timer for price changes
    const priceDebounceTimer = useRef<NodeJS.Timeout | null>(null);

    // Update local state when props change
    useEffect(() => {
        if (availableFilters.price) {
            // Only update if we don't have active filters overriding, or if available range changes significantly
            // For now, let's respect active filters if present
            if (!activeFilters?.price) {
                setPriceRange({
                    min: availableFilters.price.min,
                    max: availableFilters.price.max
                });
            } else {
                setPriceRange(activeFilters.price);
            }
        }
    }, [availableFilters.price, activeFilters?.price]);

    // Cleanup debounce timer on unmount
    useEffect(() => {
        return () => {
            if (priceDebounceTimer.current) {
                clearTimeout(priceDebounceTimer.current);
            }
        };
    }, []);

    // Helper to trigger update
    const triggerUpdate = (
        newPrice?: { min: number; max: number },
        newBrands?: string[],
        newRam?: string[],
        newStorage?: string[]
    ) => {
        onFiltersChange({
            price: newPrice || priceRange,
            brands: newBrands || selectedBrands,
            ram: newRam || selectedRam,
            storage: newStorage || selectedStorage
        });
    };

    // Price Handlers
    const handlePriceChange = (type: 'min' | 'max', value: number) => {
        const newRange = { ...priceRange };
        if (type === 'min') newRange.min = value;
        else newRange.max = value;

        // Validate
        if (type === 'min' && value > newRange.max) newRange.min = newRange.max;
        if (type === 'max' && value < newRange.min) newRange.max = newRange.min;

        setPriceRange(newRange);
        setIsAdjustingPrice(true);

        // Clear existing timer
        if (priceDebounceTimer.current) {
            clearTimeout(priceDebounceTimer.current);
        }

        // Set new timer to trigger update after 500ms of inactivity
        priceDebounceTimer.current = setTimeout(() => {
            triggerUpdate(newRange);
            setIsAdjustingPrice(false);
        }, 500);
    };

    const handlePriceCommit = () => {
        // Clear debounce timer if exists
        if (priceDebounceTimer.current) {
            clearTimeout(priceDebounceTimer.current);
            priceDebounceTimer.current = null;
        }

        // Immediately trigger update if was adjusting
        if (isAdjustingPrice) {
            setIsAdjustingPrice(false);
            triggerUpdate(priceRange);
        }
    };

    // Toggle Handlers
    const toggleFilter = (
        item: string,
        current: string[],
        setter: (val: string[]) => void,
        type: 'brands' | 'ram' | 'storage'
    ) => {
        const newSelection = current.includes(item)
            ? current.filter(i => i !== item)
            : [...current, item];

        setter(newSelection);

        // Trigger update immediately for toggles
        if (type === 'brands') triggerUpdate(undefined, newSelection);
        if (type === 'ram') triggerUpdate(undefined, undefined, newSelection);
        if (type === 'storage') triggerUpdate(undefined, undefined, undefined, newSelection);
    };

    const formatPrice = (value: number) => {
        if (isNaN(value) || value === null || value === undefined) return '$0';
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    const absoluteMin = availableFilters.price?.min || 0;
    const absoluteMax = availableFilters.price?.max || 50000;

    // Avoid division by zero if min == max
    const range = absoluteMax - absoluteMin;
    const minPercent = range === 0 ? 0 : ((priceRange.min - absoluteMin) / range) * 100;
    const maxPercent = range === 0 ? 100 : ((priceRange.max - absoluteMin) / range) * 100;

    return (
        <div className="w-full bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-3 border-b border-gray-200 flex justify-between items-center">
                <h4 className="font-semibold text-gray-700 text-sm flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    <span>Filtros de Búsqueda</span>
                </h4>
                {(selectedBrands.length > 0 || selectedRam.length > 0 || selectedStorage.length > 0) && (
                    <button
                        onClick={() => {
                            setSelectedBrands([]);
                            setSelectedRam([]);
                            setSelectedStorage([]);
                            triggerUpdate(priceRange, [], [], []);
                        }}
                        className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1"
                    >
                        <X className="w-3 h-3" /> Limpiar
                    </button>
                )}
            </div>

            <div className="p-4 space-y-6">
                {/* Price Slider */}
                <div>
                    <div className="flex justify-between mb-2">
                        <span className="text-xs font-medium text-gray-500">Precio</span>
                        <span className="text-xs font-bold text-primary-600">
                            {formatPrice(priceRange.min)} - {formatPrice(priceRange.max)}
                        </span>
                    </div>
                    <div className="relative h-2 mb-4">
                        <div className="absolute w-full h-2 bg-gray-200 rounded-full"></div>
                        <div
                            className="absolute h-2 bg-primary-500 rounded-full"
                            style={{ left: `${Math.max(0, minPercent)}%`, right: `${Math.max(0, 100 - maxPercent)}%` }}
                        ></div>
                        <input
                            type="range"
                            min={absoluteMin}
                            max={absoluteMax}
                            step={500}
                            value={priceRange.min}
                            onChange={(e) => handlePriceChange('min', parseInt(e.target.value))}
                            onMouseUp={handlePriceCommit}
                            onTouchEnd={handlePriceCommit}
                            className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary-500 [&::-webkit-slider-thumb]:shadow-md cursor-pointer"
                        />
                        <input
                            type="range"
                            min={absoluteMin}
                            max={absoluteMax}
                            step={500}
                            value={priceRange.max}
                            onChange={(e) => handlePriceChange('max', parseInt(e.target.value))}
                            onMouseUp={handlePriceCommit}
                            onTouchEnd={handlePriceCommit}
                            className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary-500 [&::-webkit-slider-thumb]:shadow-md cursor-pointer"
                        />
                    </div>
                </div>

                {/* Brands */}
                {availableFilters.brands && availableFilters.brands.length > 0 && (
                    <div>
                        <span className="text-xs font-medium text-gray-500 mb-2 block">Marcas</span>
                        <div className="flex flex-wrap gap-2">
                            {availableFilters.brands.map(brand => (
                                <button
                                    key={brand}
                                    onClick={() => toggleFilter(brand, selectedBrands, setSelectedBrands, 'brands')}
                                    className={`px-3 py-1 rounded-full text-xs transition-colors border ${selectedBrands.includes(brand)
                                        ? 'bg-primary-100 text-primary-700 border-primary-200 font-medium'
                                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                                        }`}
                                >
                                    {brand}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* RAM */}
                {availableFilters.ram && availableFilters.ram.length > 0 && (
                    <div>
                        <span className="text-xs font-medium text-gray-500 mb-2 block">Memoria RAM</span>
                        <div className="flex flex-wrap gap-2">
                            {availableFilters.ram.map(ram => (
                                <button
                                    key={ram}
                                    onClick={() => toggleFilter(ram, selectedRam, setSelectedRam, 'ram')}
                                    className={`px-3 py-1 rounded-full text-xs transition-colors border ${selectedRam.includes(ram)
                                        ? 'bg-blue-100 text-blue-700 border-blue-200 font-medium'
                                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                                        }`}
                                >
                                    {ram}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Storage */}
                {availableFilters.storage && availableFilters.storage.length > 0 && (
                    <div>
                        <span className="text-xs font-medium text-gray-500 mb-2 block">Almacenamiento</span>
                        <div className="flex flex-wrap gap-2">
                            {availableFilters.storage.map(storage => (
                                <button
                                    key={storage}
                                    onClick={() => toggleFilter(storage, selectedStorage, setSelectedStorage, 'storage')}
                                    className={`px-3 py-1 rounded-full text-xs transition-colors border ${selectedStorage.includes(storage)
                                        ? 'bg-purple-100 text-purple-700 border-purple-200 font-medium'
                                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                                        }`}
                                >
                                    {storage}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
