#!/bin/bash

# ================================================
# DragNDrop Workflow Documentation Packager
# ================================================
# Crea un ZIP con toda la documentación de workflows

set -e

echo "📦 Empaquetando documentación de workflows..."

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Nombre del paquete
PACKAGE_NAME="dragndrop-workflow-docs-$(date +%Y%m%d)"
PACKAGE_DIR="$PACKAGE_NAME"

# Crear directorio temporal
echo -e "${BLUE}📁 Creando estructura...${NC}"
mkdir -p "$PACKAGE_DIR"

# Copiar documentos
echo -e "${BLUE}📄 Copiando documentos...${NC}"
cp IMPLEMENTATION_PLAN.md "$PACKAGE_DIR/"
cp TECHNICAL_SPECS.md "$PACKAGE_DIR/"
cp WORKFLOW_GUIDE.md "$PACKAGE_DIR/"
cp ROADMAP_V1.md "$PACKAGE_DIR/"
cp EXECUTIVE_SUMMARY.md "$PACKAGE_DIR/"
cp MULTI_AGENT_OPTION.md "$PACKAGE_DIR/"
cp SETUP_GUIDE.md "$PACKAGE_DIR/"
cp DOCUMENTATION_INDEX.md "$PACKAGE_DIR/"
cp .env.example "$PACKAGE_DIR/"
cp README.md "$PACKAGE_DIR/"
cp index.html "$PACKAGE_DIR/"

# Contar archivos
FILE_COUNT=$(ls -1 "$PACKAGE_DIR" | wc -l)
TOTAL_SIZE=$(du -sh "$PACKAGE_DIR" | cut -f1)

echo -e "${GREEN}✅ $FILE_COUNT archivos copiados ($TOTAL_SIZE)${NC}"

# Crear ZIP
echo -e "${BLUE}📦 Creando archivo ZIP...${NC}"
if command -v zip &> /dev/null; then
    zip -r "${PACKAGE_NAME}.zip" "$PACKAGE_DIR" > /dev/null
    echo -e "${GREEN}✅ ${PACKAGE_NAME}.zip creado${NC}"
else
    echo -e "${BLUE}ℹ️  'zip' no disponible, creando tar.gz...${NC}"
    tar -czf "${PACKAGE_NAME}.tar.gz" "$PACKAGE_DIR"
    echo -e "${GREEN}✅ ${PACKAGE_NAME}.tar.gz creado${NC}"
fi

# Limpiar directorio temporal
rm -rf "$PACKAGE_DIR"

# Mostrar resumen
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✅ Paquete creado exitosamente${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📦 Archivo: ${PACKAGE_NAME}.zip (o .tar.gz)"
echo "📊 Contenido: $FILE_COUNT documentos"
echo "💾 Tamaño: $TOTAL_SIZE"
echo ""
echo "📖 Para usar:"
echo "   1. Extraer archivo"
echo "   2. Abrir index.html en navegador"
echo "   3. Leer IMPLEMENTATION_PLAN.md"
echo ""
echo "🚀 ¡Listo para compartir o archivar!"
echo ""
