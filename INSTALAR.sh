#!/bin/bash

echo "========================================"
echo "  INSTALACIÓN MULTIPLICA SHOP"
echo "========================================"
echo ""

# Cambiar al directorio del proyecto
cd "/Users/amgarcia71/Development/AI Shop/multiplica-shop"

echo "✓ Arreglando permisos del caché de npm..."
sudo chown -R $(whoami) ~/.npm

echo ""
echo "✓ Instalando dependencias..."
npm install

if [ $? -eq 0 ]; then
    echo ""
    echo "========================================"
    echo "  ¡INSTALACIÓN COMPLETADA!"
    echo "========================================"
    echo ""
    echo "Ahora ejecuta:"
    echo "  npm run dev"
    echo ""
    echo "Y abre en tu navegador:"
    echo "  http://localhost:3000"
    echo ""
    echo "Recuerda configurar tu API key de Gemini en .env.local"
else
    echo ""
    echo "❌ Error en la instalación"
    echo "Intenta ejecutar manualmente:"
    echo "  sudo chown -R \$(whoami) ~/.npm"
    echo "  npm install"
fi
