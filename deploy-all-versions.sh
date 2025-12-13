#!/bin/bash

# ===============================================
# 🚀 SCRIPT DE DESPLIEGUE AUTOMÁTICO DRAGNDROP
# ===============================================

set -e  # Salir en caso de error

BASE_DIR="/home/admin/DragNDrop"
LOG_DIR="$BASE_DIR/deployment-logs"
PID_DIR="$BASE_DIR/deployment-pids"

# Crear directorios necesarios
mkdir -p "$LOG_DIR" "$PID_DIR"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 INICIANDO DESPLIEGUE AUTOMÁTICO DRAGNDROP${NC}"
echo "=================================================="

# Función para limpiar procesos previos
cleanup_previous_processes() {
    echo -e "${YELLOW}🧹 Limpiando procesos previos...${NC}"
    
    # Matar procesos por puerto
    for port in 8080 8081 8082 8083 8084 8085; do
        if lsof -ti:$port > /dev/null 2>&1; then
            echo "  🔴 Matando proceso en puerto $port"
            kill -9 $(lsof -ti:$port) 2>/dev/null || true
        fi
    done
    
    # Limpiar archivos PID
    rm -f "$PID_DIR"/*.pid
    
    sleep 2
}

# Función para verificar puerto
check_port() {
    local port=$1
    local timeout=10
    local count=0
    
    while [ $count -lt $timeout ]; do
        if curl -s "http://localhost:$port" > /dev/null 2>&1; then
            return 0
        fi
        sleep 1
        ((count++))
    done
    return 1
}

# Función para desplegar con logs
deploy_with_logs() {
    local name=$1
    local command=$2
    local port=$3
    local dir=$4
    local pid_file="$PID_DIR/${name}.pid"
    local log_file="$LOG_DIR/${name}.log"
    
    echo -e "${BLUE}📦 Desplegando $name en puerto $port...${NC}"
    
    cd "$dir"
    
    # Ejecutar comando en background y guardar PID
    nohup bash -c "$command" > "$log_file" 2>&1 &
    local pid=$!
    echo $pid > "$pid_file"
    
    # Verificar que el proceso esté ejecutándose
    sleep 2
    if kill -0 $pid 2>/dev/null; then
        echo -e "${GREEN}  ✅ Proceso iniciado (PID: $pid)${NC}"
        
        # Verificar puerto
        if check_port $port; then
            echo -e "${GREEN}  ✅ Servidor respondiendo en puerto $port${NC}"
            return 0
        else
            echo -e "${RED}  ❌ Servidor no responde en puerto $port${NC}"
            echo -e "${YELLOW}  📝 Log: tail -f $log_file${NC}"
            return 1
        fi
    else
        echo -e "${RED}  ❌ El proceso falló al iniciar${NC}"
        echo -e "${YELLOW}  📝 Log: cat $log_file${NC}"
        return 1
    fi
}

# ===============================================
# DESPLIEGUES INDIVIDUALES
# ===============================================

echo ""
echo -e "${PURPLE}🔧 FASE 1: Preparación${NC}"
echo "========================="

# Limpiar procesos previos
cleanup_previous_processes

echo ""
echo -e "${PURPLE}🚀 FASE 2: Despliegues${NC}"
echo "========================="

# 1. Summary Server (Puerto 8080)
deploy_with_logs \
    "summary-server" \
    "node summary-server.js" \
    8080 \
    "$BASE_DIR"

# 2. V1 - Vanilla Standalone (Puerto 8081)
deploy_with_logs \
    "v1-vanilla" \
    "python3 -m http.server 8081" \
    8081 \
    "$BASE_DIR/versions-organized/v1-vanilla-standalone"

# 3. V2 - Landing Page (Puerto 8082)  
deploy_with_logs \
    "v2-landing" \
    "python3 -m http.server 8082" \
    8082 \
    "$BASE_DIR/versions-organized/v2-landing-page"

# 4. V3 - Python FastAPI (Puerto 8083)
echo -e "${BLUE}📦 Preparando V3 - Python FastAPI...${NC}"
cd "$BASE_DIR/versions-organized/v3-backend-python"

# Verificar/crear virtual environment
if [ ! -d "venv" ]; then
    echo "  🔨 Creando virtual environment..."
    python3 -m venv venv
fi

# Instalar dependencias si es necesario
if [ ! -f "venv/lib/python*/site-packages/fastapi" ]; then
    echo "  📥 Instalando dependencias..."
    ./venv/bin/pip install fastapi uvicorn python-dotenv python-multipart
fi

deploy_with_logs \
    "v3-python-api" \
    "./venv/bin/python simple_main.py" \
    8083 \
    "$BASE_DIR/versions-organized/v3-backend-python"

# 5. V5 - NPM Package (Puerto 8085)
deploy_with_logs \
    "v5-npm-package" \
    "python3 -m http.server 8085" \
    8085 \
    "$BASE_DIR/versions-organized/v5-npm-package"

# 6. V8 - NodeJS Fullstack (Puerto 8084)
echo -e "${BLUE}📦 Preparando V8 - NodeJS Fullstack...${NC}"
cd "$BASE_DIR/versions-organized/v8-backend-nodejs-fullstack"

# Instalar dependencias si es necesario
if [ ! -d "node_modules" ]; then
    echo "  📥 Instalando dependencias npm..."
    npm install --silent
fi

# Crear directorio público si no existe
mkdir -p public

deploy_with_logs \
    "v8-nodejs-fullstack" \
    "node simple-server.js" \
    8084 \
    "$BASE_DIR/versions-organized/v8-backend-nodejs-fullstack"

echo ""
echo -e "${PURPLE}✅ FASE 3: Verificación Final${NC}"
echo "================================"

# Array de servicios para verificar
declare -A services=(
    [8080]="Summary Server"
    [8081]="V1 - Vanilla Standalone" 
    [8082]="V2 - Landing Page"
    [8083]="V3 - Python FastAPI"
    [8084]="V8 - NodeJS Fullstack"
    [8085]="V5 - NPM Package"
)

all_running=true
running_count=0

echo ""
for port in "${!services[@]}"; do
    if check_port $port; then
        echo -e "${GREEN}✅ Puerto $port - ${services[$port]} - FUNCIONANDO${NC}"
        ((running_count++))
    else
        echo -e "${RED}❌ Puerto $port - ${services[$port]} - NO RESPONDE${NC}"
        all_running=false
    fi
done

echo ""
echo -e "${PURPLE}📊 RESUMEN FINAL${NC}"
echo "=================="
echo -e "Servidores funcionando: ${GREEN}$running_count${NC}/6"

if [ $all_running = true ]; then
    echo -e "${GREEN}🎉 ¡DESPLIEGUE EXITOSO! Todos los servidores están funcionando${NC}"
else
    echo -e "${YELLOW}⚠️  Algunos servidores presentan problemas${NC}"
fi

echo ""
echo -e "${BLUE}🌐 URLS DE ACCESO PÚBLICO:${NC}"
echo "=========================="

# Obtener IP pública
PUBLIC_IP=$(curl -s http://checkip.amazonaws.com 2>/dev/null || echo "TU-IP-PUBLICA")

for port in "${!services[@]}"; do
    echo -e "${BLUE}📋 ${services[$port]}:${NC} http://$PUBLIC_IP:$port/"
done

echo ""
echo -e "${PURPLE}🎯 ENLACES PRINCIPALES:${NC}"
echo "======================="
echo -e "${GREEN}📋 Resumen Visual:${NC} http://$PUBLIC_IP/"
echo -e "${GREEN}🚀 Catálogo Interactivo:${NC} http://$PUBLIC_IP/catalog-demo.html"

echo ""
echo -e "${BLUE}🛠️  COMANDOS DE GESTIÓN:${NC}"
echo "========================="
echo "Ver logs:        tail -f $LOG_DIR/[servicio].log"
echo "Parar servicio:  kill \$(cat $PID_DIR/[servicio].pid)"
echo "Ver procesos:    ps aux | grep -E '(python|node)'"
echo "Parar todos:     $BASE_DIR/stop-all-servers.sh"

echo ""
echo -e "${GREEN}✨ DESPLIEGUE COMPLETADO ✨${NC}"
echo "=============================="

# Crear script para parar todos los servicios
cat > "$BASE_DIR/stop-all-servers.sh" << 'EOF'
#!/bin/bash
echo "🛑 Parando todos los servidores DragNDrop..."

PID_DIR="/home/admin/DragNDrop/deployment-pids"

for pid_file in "$PID_DIR"/*.pid; do
    if [ -f "$pid_file" ]; then
        pid=$(cat "$pid_file")
        service=$(basename "$pid_file" .pid)
        
        if kill -0 "$pid" 2>/dev/null; then
            echo "🔴 Parando $service (PID: $pid)"
            kill -TERM "$pid"
        else
            echo "⚪ $service ya no está ejecutándose"
        fi
        
        rm -f "$pid_file"
    fi
done

# Forzar kill de puertos específicos
for port in 8080 8081 8082 8083 8084 8085; do
    if lsof -ti:$port > /dev/null 2>&1; then
        echo "🔴 Forzando cierre del puerto $port"
        kill -9 $(lsof -ti:$port) 2>/dev/null || true
    fi
done

echo "✅ Todos los servidores han sido detenidos"
EOF

chmod +x "$BASE_DIR/stop-all-servers.sh"