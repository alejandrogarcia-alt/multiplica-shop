'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Send, Bot, User } from 'lucide-react';
import { Message, MLProduct, SearchFilters as SearchFiltersType } from '@/types';
import { useCart } from '@/contexts/CartContext';
import ComparisonTable from './chat/ComparisonTable';
import SearchFilters from './chat/SearchFilters';
import ProductSuggestions from './chat/ProductSuggestions';

interface ChatPanelProps {
  onProductsFound: (products: MLProduct[]) => void;
}

export default function ChatPanel({ onProductsFound }: ChatPanelProps) {
  const router = useRouter();
  const { addToCart, openCartTemporarily } = useCart();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '¡Hola! Soy tu asistente de compras de Multiplica. ¿Qué producto estás buscando hoy?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastProducts, setLastProducts] = useState<MLProduct[]>([]);
  const [activeFilters, setActiveFilters] = useState<SearchFiltersType | undefined>(undefined);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Función para búsqueda silenciosa con filtros
  const handleSilentSearch = async (filters: SearchFiltersType) => {
    if (isLoading) return;

    setIsLoading(true);
    setActiveFilters(filters); // Guardar filtros activos

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `búsqueda filtrada`, // Mensaje genérico, el backend usará los filtros
          lastProducts: lastProducts,
          filters: filters
        }),
      });

      const data = await response.json();

      // Actualizar el último mensaje que tenga filtros (el panel de filtros)
      setMessages((prev) => {
        const lastIndex = prev.length - 1;
        const lastMsg = prev[lastIndex];

        // Si el último mensaje tiene availableFilters, actualizarlo
        if (lastMsg && lastMsg.availableFilters) {
          const updated = [...prev];
          updated[lastIndex] = {
            ...lastMsg,
            products: data.products,
            activeFilters: filters,
            availableFilters: data.availableFilters || lastMsg.availableFilters, // Actualizar disponibles si cambian
            content: lastMsg.content,
          };
          return updated;
        }
        return prev;
      });

      // Actualizar productos en el área de contenido
      if (data.products && data.products.length > 0) {
        onProductsFound(data.products);
        setLastProducts(data.products);
      }
    } catch (error) {
      console.error('Error en búsqueda silenciosa:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          lastProducts: lastProducts,
          filters: activeFilters // Enviar filtros activos para mantener contexto
        }),
      });

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        products: data.products,
        comparisonProducts: data.comparisonProducts,
        geminiInsights: data.geminiInsights,
        priceRange: data.priceRange,
        availableFilters: data.availableFilters,
        activeFilters: data.activeFilters
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Actualizar activeFilters si cambió
      if (data.activeFilters) {
        setActiveFilters(data.activeFilters);
      }

      // Si hay productos, actualizar el grid principal
      if (data.products && data.products.length > 0) {
        onProductsFound(data.products);
        setLastProducts(data.products);
      }

      // Si hay intent de add_to_cart
      if (data.intent === 'add_to_cart' && data.productToAdd) {
        addToCart(data.productToAdd);
        openCartTemporarily(); // Auto-abrir carrito por 3 segundos
      }

      // Si hay intent de view_details
      if (data.intent === 'view_details' && data.productId) {
        router.push(`/product/${data.productId}`);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Lo siento, tuve un problema procesando tu mensaje. Por favor intenta de nuevo.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-screen flex flex-col bg-white border-r border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-primary-500 to-primary-600">
        <div className="flex items-center gap-2">
          <Bot className="w-6 h-6 text-white" />
          <h2 className="text-lg font-semibold text-white">Asistente Multiplica</h2>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
          >
            <div
              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${message.role === 'user'
                ? 'bg-secondary-500'
                : 'bg-primary-500'
                }`}
            >
              {message.role === 'user' ? (
                <User className="w-5 h-5 text-white" />
              ) : (
                <Bot className="w-5 h-5 text-white" />
              )}
            </div>
            <div
              className={`max-w-[90%] rounded-lg px-4 py-2 ${message.role === 'user'
                ? 'bg-secondary-100 text-secondary-900'
                : 'bg-gray-100 text-gray-900'
                }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>

              {/* Tabla de comparación visual */}
              {message.comparisonProducts && message.comparisonProducts.length > 0 && (
                <div className="mt-3">
                  <ComparisonTable
                    products={message.comparisonProducts}
                    geminiInsights={message.geminiInsights}
                  />
                </div>
              )}

              {/* Search Filters (replaces PriceRangeSlider) */}
              {message.availableFilters && (
                <div className="mt-3">
                  <SearchFilters
                    availableFilters={message.availableFilters}
                    activeFilters={message.activeFilters}
                    onFiltersChange={handleSilentSearch}
                  />
                </div>
              )}

              {/* Product Suggestions (Cross-selling) */}
              {message.suggestedProducts && message.suggestedProducts.length > 0 && (
                <div className="mt-3">
                  <ProductSuggestions products={message.suggestedProducts} />
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-primary-500">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="bg-gray-100 rounded-lg px-4 py-2">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Escribe lo que buscas..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
