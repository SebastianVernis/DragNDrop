#!/bin/bash

# ================================================
# Deploy Secrets to Cloudflare Pages
# ================================================
# Este script lee las variables de .env y las sube
# como secrets a Cloudflare Pages de forma segura

set -e  # Exit on error

PROJECT_NAME="dragndrop-editor"
ENV_FILE=".env"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Deploy Secrets to Cloudflare Pages${NC}"
echo "Project: ${PROJECT_NAME}"
echo ""

# Verificar que existe el archivo .env
if [ ! -f "$ENV_FILE" ]; then
    echo -e "${RED}❌ Error: $ENV_FILE no encontrado${NC}"
    exit 1
fi

# Lista de secretos a NO subir (porque son públicos o no se usan en producción)
SKIP_SECRETS=(
    "PORT"
    "NODE_ENV"
    "FRONTEND_URL"
    "DEBUG"
    "VITE_DEBUG_MODE"
    "API_TIMEOUT"
    "GEMINI_TIMEOUT"
    "VERCEL_TIMEOUT"
)

# Función para verificar si un secret debe skippearse
should_skip() {
    local key=$1
    for skip in "${SKIP_SECRETS[@]}"; do
        if [[ "$key" == "$skip" ]]; then
            return 0
        fi
    done
    
    # Skip si empieza con VITE_ (son públicos, van en el build)
    if [[ "$key" == VITE_* ]]; then
        return 0
    fi
    
    return 1
}

# Contador
total=0
uploaded=0
skipped=0
failed=0

echo -e "${YELLOW}📋 Procesando secrets desde $ENV_FILE...${NC}"
echo ""

# Leer .env y procesar línea por línea
while IFS='=' read -r key value; do
    # Skip comentarios y líneas vacías
    [[ -z "$key" || "$key" =~ ^[[:space:]]*# ]] && continue
    
    # Limpiar espacios
    key=$(echo "$key" | xargs)
    value=$(echo "$value" | xargs)
    
    # Skip si no hay valor
    [[ -z "$value" ]] && continue
    
    ((total++))
    
    # Verificar si se debe skipear
    if should_skip "$key"; then
        echo -e "${BLUE}⏭️  Skip: $key (público o no usado en producción)${NC}"
        ((skipped++))
        continue
    fi
    
    # Subir secret
    echo -e "${YELLOW}📤 Uploading: $key${NC}"
    
    if echo "$value" | wrangler pages secret put "$key" --project-name="$PROJECT_NAME" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Success: $key${NC}"
        ((uploaded++))
    else
        echo -e "${RED}❌ Failed: $key${NC}"
        ((failed++))
    fi
    
    echo ""
    
done < "$ENV_FILE"

# Resumen
echo ""
echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}📊 Resumen${NC}"
echo -e "${BLUE}================================================${NC}"
echo -e "Total variables procesadas: ${total}"
echo -e "${GREEN}✅ Subidas correctamente:   ${uploaded}${NC}"
echo -e "${BLUE}⏭️  Skippeadas (públicas):   ${skipped}${NC}"
echo -e "${RED}❌ Fallidas:                ${failed}${NC}"
echo ""

if [ $failed -eq 0 ]; then
    echo -e "${GREEN}🎉 Todos los secrets se subieron correctamente!${NC}"
    exit 0
else
    echo -e "${RED}⚠️  Algunos secrets fallaron. Revisa los errores arriba.${NC}"
    exit 1
fi
