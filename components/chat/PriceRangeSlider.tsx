'use client';

import { useState, useEffect } from 'react';

interface PriceRangeSliderProps {
    initialMin: number;
    initialMax: number;
    absoluteMin?: number;
    absoluteMax?: number;
    onRangeChange: (min: number, max: number) => void;
}

export default function PriceRangeSlider({
    initialMin,
    initialMax,
    absoluteMin = 1000,
    absoluteMax = 50000,
    onRangeChange,
}: PriceRangeSliderProps) {
    const [minValue, setMinValue] = useState(initialMin);
    const [maxValue, setMaxValue] = useState(initialMax);
    const [isAdjusting, setIsAdjusting] = useState(false);

    useEffect(() => {
        setMinValue(initialMin);
        setMaxValue(initialMax);
    }, [initialMin, initialMax]);

    const formatPrice = (value: number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        if (value <= maxValue) {
            setMinValue(value);
            setIsAdjusting(true);
        }
    };

    const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        if (value >= minValue) {
            setMaxValue(value);
            setIsAdjusting(true);
        }
    };

    const handleMouseUp = () => {
        if (isAdjusting) {
            setIsAdjusting(false);
            // Lanzar búsqueda automática
            onRangeChange(minValue, maxValue);
        }
    };

    const minPercent = ((minValue - absoluteMin) / (absoluteMax - absoluteMin)) * 100;
    const maxPercent = ((maxValue - absoluteMin) / (absoluteMax - absoluteMin)) * 100;

    return (
        <div className="w-full bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                    <span>💰</span>
                    <span>Ajusta el rango de precio</span>
                </h4>
                {isAdjusting && (
                    <span className="text-xs text-blue-600 animate-pulse">Ajustando...</span>
                )}
            </div>

            {/* Range Display */}
            <div className="flex items-center justify-between mb-4">
                <div className="bg-white px-3 py-2 rounded-md border border-gray-300">
                    <div className="text-xs text-gray-600">Mínimo</div>
                    <div className="font-bold text-primary-600">{formatPrice(minValue)}</div>
                </div>
                <div className="text-gray-400 font-bold">—</div>
                <div className="bg-white px-3 py-2 rounded-md border border-gray-300">
                    <div className="text-xs text-gray-600">Máximo</div>
                    <div className="font-bold text-primary-600">{formatPrice(maxValue)}</div>
                </div>
            </div>

            {/* Dual Range Slider */}
            <div className="relative h-2 mb-6">
                {/* Track completo */}
                <div className="absolute w-full h-2 bg-gray-300 rounded-full"></div>

                {/* Track activo (rango seleccionado) */}
                <div
                    className="absolute h-2 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"
                    style={{
                        left: `${minPercent}%`,
                        right: `${100 - maxPercent}%`,
                    }}
                ></div>

                {/* Slider para mínimo */}
                <input
                    type="range"
                    min={absoluteMin}
                    max={absoluteMax}
                    step={500}
                    value={minValue}
                    onChange={handleMinChange}
                    onMouseUp={handleMouseUp}
                    onTouchEnd={handleMouseUp}
                    className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-600 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white"
                />

                {/* Slider para máximo */}
                <input
                    type="range"
                    min={absoluteMin}
                    max={absoluteMax}
                    step={500}
                    value={maxValue}
                    onChange={handleMaxChange}
                    onMouseUp={handleMouseUp}
                    onTouchEnd={handleMouseUp}
                    className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-600 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white"
                />
            </div>

            {/* Helper text */}
            <p className="text-xs text-gray-600 text-center">
                Arrastra los controles para ajustar y buscar automáticamente
            </p>
        </div>
    );
}
