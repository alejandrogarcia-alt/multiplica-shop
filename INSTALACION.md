# Guía de Instalación - Multiplica Shop

## Problema Actual con npm

Hay un problema de permisos en el caché de npm que impide la instalación automática de dependencias.

## Solución Rápida

Ejecuta uno de estos comandos para arreglar el caché de npm:

### Opción 1: Arreglar permisos (Recomendado)
```bash
sudo chown -R $(whoami) ~/.npm
cd "/Users/amgarcia71/Development/AI Shop/multiplica-shop"
npm install
```

### Opción 2: Usar Yarn (Alternativa)
```bash
# Instalar yarn si no lo tienes
npm install -g yarn

cd "/Users/amgarcia71/Development/AI Shop/multiplica-shop"
yarn install
```

### Opción 3: Eliminar caché y reinstalar
```bash
rm -rf ~/.npm
cd "/Users/amgarcia71/Development/AI Shop/multiplica-shop"
npm install
```

## Después de Instalar Dependencias

1. **Configurar API Key de Gemini**

Edita el archivo `.env.local` y añade tu API key:
```env
GOOGLE_API_KEY=tu_api_key_de_gemini
```

Obtén tu API key en: https://makersuite.google.com/app/apikey

2. **Ejecutar el proyecto**
```bash
npm run dev
```

3. **Abrir en el navegador**
```
http://localhost:3000
```

## Verificación

Si todo funciona correctamente, deberías ver:
- ✅ El servidor corriendo en puerto 3000
- ✅ La interfaz con chat a la izquierda (1/4)
- ✅ Área de productos a la derecha (3/4)
- ✅ Productos destacados cargados desde Mercado Libre
- ✅ Chat respondiendo con el asistente de IA

## Problemas Comunes

### Error: GOOGLE_API_KEY no configurado
**Solución**: Edita `.env.local` y añade tu API key de Gemini

### Error: Cannot find module
**Solución**: Ejecuta `npm install` o `yarn install` nuevamente

### Puerto 3000 en uso
**Solución**: Ejecuta `npm run dev -- -p 3001` para usar otro puerto
