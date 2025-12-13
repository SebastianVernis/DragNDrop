#!/bin/bash

echo "🚀 Iniciando Catálogo DragNDrop..."

# Limpiar procesos previos
pkill -f "summary-server.js" 2>/dev/null || true
pkill -f "simple-server.js" 2>/dev/null || true
pkill -f "simple_main.py" 2>/dev/null || true
pkill -f "http.server 808" 2>/dev/null || true

sleep 2

# Cambiar al directorio base
cd /home/admin/DragNDrop

echo "🎯 Iniciando Summary Server (puerto 8080)..."
nohup node summary-server.js > catalog-8080.log 2>&1 &
SUMMARY_PID=$!
echo "Summary Server PID: $SUMMARY_PID"

echo "📱 Iniciando V1 - Vanilla (puerto 8081)..."
cd versions-organized/v1-vanilla-standalone
nohup python3 -m http.server 8081 > ../../catalog-8081.log 2>&1 &
V1_PID=$!
echo "V1 Server PID: $V1_PID"

echo "🎨 Iniciando V2 - Landing (puerto 8082)..."
cd ../v2-landing-page
nohup python3 -m http.server 8082 > ../../catalog-8082.log 2>&1 &
V2_PID=$!
echo "V2 Server PID: $V2_PID"

echo "🐍 Iniciando V3 - Python API (puerto 8083)..."
cd ../v3-backend-python
if [ -f "./venv/bin/python" ]; then
    nohup ./venv/bin/python simple_main.py > ../../catalog-8083.log 2>&1 &
    V3_PID=$!
    echo "V3 Server PID: $V3_PID"
else
    echo "⚠️ V3 venv no encontrado, saltando..."
fi

echo "📦 Iniciando V5 - NPM Package (puerto 8085)..."
cd ../v5-npm-package
nohup python3 -m http.server 8085 > ../../catalog-8085.log 2>&1 &
V5_PID=$!
echo "V5 Server PID: $V5_PID"

echo "⚡ Iniciando V8 - NodeJS (puerto 8084)..."
cd ../v8-backend-nodejs-fullstack
if [ -d "node_modules" ]; then
    nohup node simple-server.js > ../../catalog-8084.log 2>&1 &
    V8_PID=$!
    echo "V8 Server PID: $V8_PID"
else
    echo "⚠️ V8 node_modules no encontrado, saltando..."
fi

cd /home/admin/DragNDrop

echo ""
echo "⏳ Esperando que los servicios inicien..."
sleep 5

echo ""
echo "🔍 Verificando servicios..."

# Función simple para verificar puerto
check_port() {
    local port=$1
    if netstat -tln 2>/dev/null | grep ":$port " > /dev/null; then
        echo "✅ Puerto $port - ACTIVO"
        return 0
    else
        echo "❌ Puerto $port - INACTIVO"
        return 1
    fi
}

active_count=0
check_port 8080 && ((active_count++))
check_port 8081 && ((active_count++))
check_port 8082 && ((active_count++))
check_port 8083 && ((active_count++))
check_port 8084 && ((active_count++))
check_port 8085 && ((active_count++))

echo ""
echo "📊 Servicios activos: $active_count/6"

if [ $active_count -gt 0 ]; then
    echo ""
    echo "🎉 ¡Catálogo iniciado!"
    echo ""
    echo "🔗 TÚNEL SSH para acceso local:"
    echo "ssh -L 8080:localhost:8080 -L 8081:localhost:8081 -L 8082:localhost:8082 -L 8083:localhost:8083 -L 8084:localhost:8084 -L 8085:localhost:8085 admin@18.223.32.141"
    echo ""
    echo "🌐 Después del túnel, accede a:"
    echo "📋 Catálogo: http://localhost:8080/catalog-demo-local.html"
    echo ""
    echo "📝 Ver logs: tail -f catalog-808*.log"
    echo "🛑 Parar: pkill -f 'summary-server\\|simple-server\\|simple_main\\|http.server 808'"
else
    echo ""
    echo "❌ No se pudieron iniciar los servicios"
    echo "📝 Revisar logs: cat catalog-*.log"
fi

echo ""
echo "✅ Script completado"