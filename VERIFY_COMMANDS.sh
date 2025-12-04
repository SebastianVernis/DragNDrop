#!/bin/bash

# Script de Verificación Post-Reorganización
# DragNDrop HTML Editor v2.0
# Fecha: 2024-12-04

echo "╔══════════════════════════════════════════════════════════════════════╗"
echo "║                                                                      ║"
echo "║              VERIFICACIÓN POST-REORGANIZACIÓN                        ║"
echo "║                                                                      ║"
echo "╚══════════════════════════════════════════════════════════════════════╝"
echo ""

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}1. Verificando estructura de directorios...${NC}"
echo ""

echo "📁 config/"
ls -1 config/ 2>/dev/null | head -10
echo ""

echo "📁 docs/current/"
ls -1 docs/current/ 2>/dev/null | head -10
echo ""

echo "📁 docs/archive/v1.0/"
ls -1 docs/archive/v1.0/ 2>/dev/null | head -10
echo ""

echo "📁 scripts/deployment/"
ls -1 scripts/deployment/ 2>/dev/null | head -10
echo ""

echo -e "${BLUE}2. Verificando archivos de configuración...${NC}"
echo ""

for file in config/babel.config.js config/jest.config.js config/playwright.config.js config/vite.config.js config/wrangler.toml; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file"
    else
        echo -e "${YELLOW}✗${NC} $file (no encontrado)"
    fi
done
echo ""

echo -e "${BLUE}3. Verificando documentación nueva...${NC}"
echo ""

for file in docs/current/INDEX.md docs/current/PATH_MAPPING.md README.md REORGANIZATION_SUMMARY.md PROJECT_STRUCTURE.md VERIFICATION_CHECKLIST.md REORGANIZATION_COMPLETE.md; do
    if [ -f "$file" ]; then
        lines=$(wc -l < "$file" 2>/dev/null)
        echo -e "${GREEN}✓${NC} $file ($lines líneas)"
    else
        echo -e "${YELLOW}✗${NC} $file (no encontrado)"
    fi
done
echo ""

echo -e "${BLUE}4. Verificando archivos principales (sin cambios)...${NC}"
echo ""

for file in index.html script.js style.css package.json; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file"
    else
        echo -e "${YELLOW}✗${NC} $file (no encontrado)"
    fi
done
echo ""

echo -e "${BLUE}5. Verificando sintaxis de archivos principales...${NC}"
echo ""

if node -c script.js 2>/dev/null; then
    echo -e "${GREEN}✓${NC} script.js - Sintaxis válida"
else
    echo -e "${YELLOW}✗${NC} script.js - Error de sintaxis"
fi

if node -c config/vite.config.js 2>/dev/null; then
    echo -e "${GREEN}✓${NC} config/vite.config.js - Sintaxis válida"
else
    echo -e "${YELLOW}✗${NC} config/vite.config.js - Error de sintaxis"
fi

if node -c config/jest.config.js 2>/dev/null; then
    echo -e "${GREEN}✓${NC} config/jest.config.js - Sintaxis válida"
else
    echo -e "${YELLOW}✗${NC} config/jest.config.js - Error de sintaxis"
fi
echo ""

echo -e "${BLUE}6. Estadísticas del proyecto...${NC}"
echo ""

echo "Archivos JavaScript en src/:"
find src -name "*.js" -type f 2>/dev/null | wc -l

echo "Archivos de documentación:"
find docs -name "*.md" -type f 2>/dev/null | wc -l

echo "Scripts de deployment:"
ls -1 scripts/deployment/*.sh 2>/dev/null | wc -l

echo "Archivos de configuración:"
ls -1 config/* 2>/dev/null | wc -l
echo ""

echo "╔══════════════════════════════════════════════════════════════════════╗"
echo "║                                                                      ║"
echo "║                    ✅ VERIFICACIÓN COMPLETADA                        ║"
echo "║                                                                      ║"
echo "╚══════════════════════════════════════════════════════════════════════╝"
echo ""

echo -e "${BLUE}Próximos pasos:${NC}"
echo ""
echo "1. Leer documentación:"
echo "   cat docs/current/INDEX.md"
echo ""
echo "2. Ver mapeo de rutas:"
echo "   cat docs/current/PATH_MAPPING.md"
echo ""
echo "3. Ejecutar tests:"
echo "   npm run test"
echo ""
echo "4. Iniciar desarrollo:"
echo "   npm run dev"
echo ""
