#!/bin/bash

echo "=== Arreglando problema de npm y instalando dependencias ==="
echo ""

# Opción 1: Arreglar permisos del caché de npm
echo "Paso 1: Arreglando permisos del caché de npm..."
sudo chown -R $(whoami) ~/.npm

echo ""
echo "Paso 2: Limpiando caché de npm..."
npm cache clean --force

echo ""
echo "Paso 3: Instalando dependencias..."
cd "/Users/amgarcia71/Development/AI Shop/multiplica-shop"
npm install

echo ""
echo "=== ¡Instalación completada! ==="
echo ""
echo "Ahora puedes ejecutar:"
echo "  npm run dev"
echo ""
echo "Y abrir http://localhost:3000 en tu navegador"
