#!/bin/bash

# Script para organizar versiones del proyecto DragNDrop
# Crea estructura separada para cada versión con su propia documentación

BASE_DIR="/home/admin/DragNDrop"
ORGANIZED_DIR="$BASE_DIR/versions-organized"
DOCS_ARCHIVE="$BASE_DIR/docs-archive"

echo "🚀 Iniciando organización de versiones..."

# Crear estructura para cada versión
create_version_structure() {
    local version=$1
    local version_dir="$BASE_DIR/versions/$version"
    local organized_version_dir="$ORGANIZED_DIR/$version"
    
    if [ ! -d "$version_dir" ]; then
        echo "⚠️  Versión $version no encontrada"
        return
    fi
    
    echo "📦 Procesando $version..."
    
    # Crear directorio de versión organizada
    mkdir -p "$organized_version_dir"
    
    # Copiar archivos de la versión
    cp -r "$version_dir"/* "$organized_version_dir/" 2>/dev/null || true
    
    # Crear directorio de documentación dentro de la versión
    mkdir -p "$organized_version_dir/docs"
    
    # Copiar README si existe
    if [ -f "$version_dir/README.md" ]; then
        cp "$version_dir/README.md" "$organized_version_dir/docs/README.md"
    fi
    
    echo "✅ $version organizada"
}

# Procesar todas las versiones
for version in v1-vanilla-standalone v2-landing-page v3-backend-python v4-backend-nodejs v5-npm-package v6-frontend-react v7-backend-python-fullstack v8-backend-nodejs-fullstack v9-frontend-react-vite; do
    create_version_structure "$version"
done

# Copiar documentación general al archivo
echo "📚 Archivando documentación general..."
mkdir -p "$DOCS_ARCHIVE"
cp "$BASE_DIR/README.md" "$DOCS_ARCHIVE/README-MAIN.md" 2>/dev/null || true
cp "$BASE_DIR/docs/guides/BLACKBOX.md" "$DOCS_ARCHIVE/BLACKBOX-GUIDE.md" 2>/dev/null || true

echo "✅ Organización completada"
echo "📁 Versiones organizadas en: $ORGANIZED_DIR"
echo "📚 Documentación archivada en: $DOCS_ARCHIVE"
