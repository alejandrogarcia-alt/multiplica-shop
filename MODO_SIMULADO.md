# Modo SIMULADO - Desarrollo Sin API Externa

Esta funcionalidad permite desarrollar y probar la aplicación sin depender de la API de Mercado Libre.

## 🎭 ¿Qué es el Modo SIMULADO?

El modo SIMULADO usa datos sintéticos locales en lugar de hacer llamadas reales a la API de Mercado Libre. Esto te permite:

- ✅ Desarrollar sin conexión a internet
- ✅ Evitar límites de rate de la API
- ✅ No depender de bloqueos de localhost por parte de ML
- ✅ Datos consistentes para testing
- ✅ Respuestas instantáneas

## 📦 Productos Disponibles en Modo SIMULADO

La carpeta `mock-data/products.ts` contiene **16 productos sintéticos**:

### iPhones (6 productos)
- iPhone 15 Pro Max 256GB Titanio Natural
- iPhone 15 128GB Azul
- iPhone 14 Plus 256GB Morado
- iPhone 13 128GB Starlight
- iPhone 15 Pro 256GB Titanio Negro
- iPhone SE (3ra gen) 128GB Negro

### Android - Samsung (4 productos)
- Samsung Galaxy S24 Ultra 256GB
- Samsung Galaxy S23 256GB
- Samsung Galaxy A54 5G 256GB
- Samsung Galaxy Z Fold5 512GB

### Android - Google Pixel (2 productos)
- Google Pixel 8 Pro 256GB
- Google Pixel 8 128GB

### Android - Xiaomi (2 productos)
- Xiaomi 13 Pro 256GB
- Xiaomi Redmi Note 13 Pro 256GB

### Android - Motorola (2 productos)
- Motorola Edge 40 Pro 256GB
- Motorola Moto G84 5G 256GB

## ⚙️ Configuración

### Activar Modo SIMULADO

Edita el archivo `.env.local`:

```env
# API Mode: SIMULADO (datos locales) o REAL (API de Mercado Libre)
NEXT_PUBLIC_API_MODE=SIMULADO
```

### Activar Modo REAL

Para usar la API real de Mercado Libre (requiere conexión a internet y puede tener bloqueos):

```env
NEXT_PUBLIC_API_MODE=REAL
```

## 🧪 Pruebas Sugeridas en Modo SIMULADO

1. **Productos Destacados**
   - Al cargar la página verás productos aleatorios

2. **Búsqueda por Marca**
   - "iPhone" → Mostrará todos los iPhones
   - "Samsung" → Mostrará todos los Samsung
   - "Pixel" → Mostrará los Google Pixel

3. **Búsqueda por Modelo**
   - "iPhone 15" → Modelos específicos de iPhone 15
   - "Galaxy S24" → Samsung Galaxy S24
   - "Xiaomi 13" → Xiaomi 13 Pro

4. **Búsqueda Genérica**
   - "celular" → Mostrará todos los productos
   - "android" → Filtrará productos Android
   - "5G" → Productos con 5G en el nombre

## 🔍 Cómo Funciona

El servicio `MercadoLibreService` verifica la variable `NEXT_PUBLIC_API_MODE`:

```typescript
if (this.mode === 'SIMULADO') {
  // Usar datos locales de mock-data/products.ts
  return searchMockProducts(query, limit);
} else {
  // Hacer llamada real a API de Mercado Libre
  return await axios.get(...);
}
```

## 📝 Agregar Más Productos Mock

Para agregar más productos, edita `mock-data/products.ts`:

```typescript
{
  id: 'MLM999',
  title: 'Nuevo Producto',
  price: 9999,
  currency_id: 'MXN',
  thumbnail: 'https://...',
  condition: 'new',
  // ... más campos
}
```

## 🚀 Deploy en Producción

**IMPORTANTE**: En producción (Render, Vercel, etc.) debes usar modo REAL:

```env
NEXT_PUBLIC_API_MODE=REAL
```

Render y otros servicios de hosting NO tienen el bloqueo de localhost, por lo que la API de Mercado Libre funcionará correctamente.

## 🔄 Cambiar entre Modos

1. Edita `.env.local`
2. Cambia `NEXT_PUBLIC_API_MODE=SIMULADO` o `REAL`
3. Reinicia el servidor (`npm run dev`)
4. Verás en consola: `🔧 Mercado Libre Service iniciado en modo: SIMULADO`

---

## 📊 Ventajas y Desventajas

### Modo SIMULADO
✅ No requiere internet
✅ Datos consistentes
✅ Respuestas instantáneas
✅ No hay límites de API
❌ Datos limitados (solo 16 productos)
❌ No refleja productos reales actuales

### Modo REAL
✅ Datos reales y actualizados
✅ Catálogo completo de ML
✅ Precios reales
❌ Requiere internet
❌ Puede tener bloqueos en localhost
❌ Límites de rate de API

---

¿Dudas? Revisa los logs en consola para ver qué modo está activo.
