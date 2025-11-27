# Guía de Deploy - Multiplica Shop

## 📦 Deploy en Render

### Paso 1: Crear Repositorio en GitHub

1. Ve a https://github.com/new
2. Nombre del repositorio: `multiplica-shop`
3. Descripción: "E-commerce con asistente IA - Integración Mercado Libre + Google Gemini"
4. Visibilidad: **Público** o **Privado** (tu elección)
5. **NO** inicialices con README, .gitignore, o licencia (ya los tenemos)
6. Clic en **"Create repository"**

### Paso 2: Conectar tu Proyecto Local con GitHub

Ejecuta estos comandos en tu terminal:

```bash
cd "/Users/amgarcia71/Development/AI Shop/multiplica-shop"

# Agregar el remote de GitHub (reemplaza TU_USUARIO con tu usuario de GitHub)
git remote add origin https://github.com/TU_USUARIO/multiplica-shop.git

# Cambiar nombre de la rama a main
git branch -M main

# Hacer push
git push -u origin main
```

### Paso 3: Configurar Deploy en Render

1. Ve a https://render.com/ y crea una cuenta (puedes usar tu cuenta de GitHub)
2. Clic en **"New +"** → **"Web Service"**
3. Conecta tu repositorio de GitHub `multiplica-shop`
4. Configuración:
   - **Name**: `multiplica-shop`
   - **Runtime**: **Node**
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: **Free**

5. **Variables de Entorno** (Environment Variables):
   Agrega estas variables:
   ```
   GOOGLE_API_KEY=tu_api_key_aqui
   NEXT_PUBLIC_ML_API_URL=https://api.mercadolibre.com
   NODE_VERSION=20
   ```

6. Clic en **"Create Web Service"**

### Paso 4: Esperar el Deploy

Render automáticamente:
- Clonará tu repositorio
- Instalará las dependencias
- Compilará la aplicación
- La desplegará

El proceso toma **5-10 minutos**.

### Paso 5: Obtener tu URL

Una vez completado, Render te dará una URL pública:
```
https://multiplica-shop.onrender.com
```

¡Tu aplicación estará disponible públicamente y la API de Mercado Libre ya no la bloqueará!

## 🔄 Actualizar la Aplicación

Cada vez que hagas cambios y quieras actualizar:

```bash
git add .
git commit -m "Descripción de cambios"
git push
```

Render detectará el push y automáticamente redesplegará la aplicación.

## ✅ Verificación

Una vez desplegado, prueba:
1. Abre tu URL de Render
2. Usa el chat para buscar "iPhone 15"
3. Deberías ver productos de Mercado Libre

## 🐛 Troubleshooting

### Error: Build failed
- Verifica que `NODE_VERSION=20` esté en las variables de entorno
- Revisa los logs en Render

### Error: Cannot find module
- Asegúrate de que todas las dependencias estén en `package.json`
- Verifica el build command: `npm install && npm run build`

### Error: Gemini API
- Verifica que `GOOGLE_API_KEY` esté configurada correctamente
- Asegúrate de no tener espacios extras en la variable

---

¿Necesitas ayuda? Revisa los logs en el dashboard de Render.
