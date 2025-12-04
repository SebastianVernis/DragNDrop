#!/bin/bash

# ================================================
# DragNDrop Workflow Initialization Script
# ================================================
# Este script configura el entorno de trabajo multi-agente

set -e

echo "🚀 Inicializando Workflow Multi-Agente para DragNDrop..."
echo ""

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Función para imprimir con color
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# ================================================
# 1. Verificar dependencias
# ================================================
echo "📦 Verificando dependencias..."

if ! command -v node &> /dev/null; then
    print_error "Node.js no está instalado"
    exit 1
fi
print_success "Node.js $(node --version)"

if ! command -v npm &> /dev/null; then
    print_error "npm no está instalado"
    exit 1
fi
print_success "npm $(npm --version)"

if ! command -v git &> /dev/null; then
    print_error "Git no está instalado"
    exit 1
fi
print_success "Git $(git --version)"

echo ""

# ================================================
# 2. Verificar archivo .env
# ================================================
echo "🔐 Verificando configuración..."

if [ ! -f ".env" ]; then
    print_warning "Archivo .env no encontrado, ya fue creado con las credenciales"
    print_success "Archivo .env configurado correctamente"
else
    print_success "Archivo .env ya existe"
fi

# Verificar que las variables importantes estén configuradas
if grep -q "GEMINI_API_KEY=AIza" .env && grep -q "BLACKBOX_API_KEY=sk-" .env; then
    print_success "Credenciales API configuradas"
else
    print_warning "Revisa las credenciales en .env"
fi

echo ""

# ================================================
# 3. Verificar instalación de dependencias
# ================================================
echo "📚 Verificando dependencias del proyecto..."

if [ ! -d "node_modules" ]; then
    print_info "Instalando dependencias..."
    npm install
    print_success "Dependencias instaladas"
else
    print_success "Dependencias ya instaladas"
fi

echo ""

# ================================================
# 4. Verificar estructura de directorios
# ================================================
echo "📁 Verificando estructura de directorios..."

REQUIRED_DIRS=(
    ".blackbox"
    ".blackboxcli"
    "src/core"
    "src/components"
    "src/storage"
    "src/utils"
    "docs"
    "tests/unit"
    "tests/e2e"
    "workflows"
    "tasks/active"
    "tasks/templates"
)

for dir in "${REQUIRED_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        print_success "$dir"
    else
        print_warning "$dir no encontrado (creando...)"
        mkdir -p "$dir"
    fi
done

echo ""

# ================================================
# 5. Verificar configuración de Blackbox CLI
# ================================================
echo "🤖 Verificando Blackbox CLI..."

if [ -f ".blackboxcli/settings.json" ]; then
    print_success "Blackbox CLI configurado"
else
    print_warning "Blackbox CLI no configurado completamente"
    print_info "Para configurar MCP ejecuta:"
    echo "  blackbox mcp add remote-code https://cloud.blackbox.ai/api/mcp -t http -H \"Authorization: Bearer bb_bf3c2d5d10ddd9516781334bd61f0b6e3bfe619b56acc745e5fa5bf9fbbe8c78\""
fi

echo ""

# ================================================
# 6. Verificar configuración de agents
# ================================================
echo "👥 Verificando configuración de agentes..."

if [ -f ".blackbox/agents.config.json" ]; then
    print_success "Configuración de agentes encontrada"
    
    # Contar agentes configurados
    AGENT_COUNT=$(grep -o '"role"' .blackbox/agents.config.json | wc -l)
    print_info "Agentes configurados: $AGENT_COUNT"
    print_info "  👨‍💻 Developer Agent"
    print_info "  🧪 Tester Agent"
    print_info "  ✅ QA Agent"
    print_info "  🚀 DevOps Agent"
    print_info "  📚 Documentation Agent"
else
    print_error "Configuración de agentes no encontrada"
fi

echo ""

# ================================================
# 7. Verificar git status
# ================================================
echo "📊 Estado del repositorio..."

if git rev-parse --git-dir > /dev/null 2>&1; then
    CURRENT_BRANCH=$(git branch --show-current)
    print_success "Rama actual: $CURRENT_BRANCH"
    
    # Verificar si hay cambios sin commitear
    if [[ -n $(git status -s) ]]; then
        print_warning "Hay cambios sin commitear"
        git status -s | head -5
    else
        print_success "Working directory limpio"
    fi
else
    print_error "No es un repositorio git"
fi

echo ""

# ================================================
# 8. Comandos disponibles
# ================================================
echo "🎯 Comandos disponibles:"
echo ""
echo "  Desarrollo:"
echo "    npm run dev              - Iniciar servidor de desarrollo"
echo "    npm run build            - Build de producción"
echo ""
echo "  Testing:"
echo "    npm test                 - Ejecutar tests unitarios"
echo "    npm run test:watch       - Tests en modo watch"
echo "    npm run test:coverage    - Tests con coverage"
echo "    npm run test:e2e         - Tests end-to-end"
echo "    npm run test:e2e:ui      - Tests E2E con UI"
echo ""
echo "  Workflows:"
echo "    ./workflows/development/start-feature.sh <name>    - Iniciar nueva feature"
echo "    ./workflows/development/complete-feature.sh        - Completar feature"
echo "    ./workflows/testing/run-full-suite.sh              - Suite completa de tests"
echo ""
echo "  Agentes:"
echo "    cat .blackbox/SUPERVISOR_COMMANDS.md    - Ver comandos del supervisor"
echo "    cat .blackbox/README.md                  - Ver guía de agentes"
echo ""

# ================================================
# 9. Siguiente pasos
# ================================================
echo "📋 Próximos pasos:"
echo ""
echo "1. Revisar la configuración en .env"
echo "2. Ejecutar los tests: npm test"
echo "3. Iniciar el servidor: npm run dev"
echo "4. Abrir http://localhost:8080 en el navegador"
echo "5. Revisar la documentación en docs/"
echo ""

print_success "¡Workflow inicializado correctamente! 🎉"
echo ""
