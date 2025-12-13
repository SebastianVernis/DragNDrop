#!/bin/bash

echo "🔍 Verificando estado de todos los servidores DragNDrop..."
echo "================================================================"

# Array de puertos y descripciones
declare -A servers=(
    [8080]="Summary Server (Node.js)"
    [8081]="V1 - Vanilla Standalone"
    [8082]="V2 - Landing Page" 
    [8083]="V3 - Python FastAPI"
    [8084]="V8 - NodeJS Fullstack"
    [8085]="V5 - NPM Package"
)

echo ""
echo "📊 Estado de Servidores:"
echo "========================"

all_running=true

for port in "${!servers[@]}"; do
    if curl -s http://localhost:$port > /dev/null 2>&1; then
        echo "✅ Puerto $port - ${servers[$port]} - ACTIVO"
    else
        echo "❌ Puerto $port - ${servers[$port]} - INACTIVO"
        all_running=false
    fi
done

echo ""
echo "🌐 URLs Públicas:"
echo "================="

IP=$(curl -s http://checkip.amazonaws.com 2>/dev/null || echo "ip-publica")

for port in "${!servers[@]}"; do
    echo "📋 ${servers[$port]}: http://$IP:$port/"
done

echo ""
echo "🎯 Enlaces Principales:"
echo "======================"
echo "📋 Resumen Visual: http://$IP/"
echo "🚀 Catálogo Interactivo: http://$IP/catalog-demo.html"

echo ""
if $all_running; then
    echo "✅ ESTADO: Todos los servidores están funcionando correctamente"
    echo "🎉 El catálogo está listo para ser usado"
else
    echo "⚠️  ESTADO: Algunos servidores no están funcionando"
    echo "🔧 Revisa los logs de los procesos en background"
fi

echo ""
echo "🛠️ Comandos útiles:"
echo "==================="
echo "Ver procesos en background: jobs"
echo "Ver output de un proceso: job_output [ID]"
echo "Reiniciar servidor: kill proceso && ejecutar comando"

echo ""
echo "📈 Estadísticas de Memoria:"
echo "==========================="
ps aux | grep -E "(python|node)" | grep -v grep | awk '{print $11" - "$6" KB"}'

echo ""
echo "🏁 Verificación completada"