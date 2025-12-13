#!/bin/bash

# Obtener IP pública
PUBLIC_IP=$(curl -s http://checkip.amazonaws.com 2>/dev/null || echo "18.223.32.141")

# Verificar servicios activos
echo "🔍 Verificando servicios activos..."
active_services=()
ports=(8080 8081 8082 8083 8084 8085)
service_names=("Summary Server" "V1-Vanilla" "V2-Landing" "V3-Python" "V8-NodeJS" "V5-NPM")

for i in "${!ports[@]}"; do
    port=${ports[$i]}
    service=${service_names[$i]}
    
    if pgrep -f ":$port" > /dev/null 2>&1; then
        active_services+=("$port:$service")
        echo "  ✅ Puerto $port - $service - ACTIVO"
    else
        echo "  ❌ Puerto $port - $service - INACTIVO"
    fi
done

echo ""
echo "==============================================="
echo "🚀 INSTRUCCIONES DE ACCESO DESDE TU EQUIPO"
echo "==============================================="
echo ""

if [ ${#active_services[@]} -gt 0 ]; then
    echo "📊 Servicios disponibles: ${#active_services[@]}/6"
    echo ""
    
    echo "🔗 COMANDO DE TÚNEL SSH:"
    echo "========================"
    echo "Ejecuta este comando desde tu equipo local:"
    echo ""
    echo "ssh -L 8080:localhost:8080 -L 8081:localhost:8081 -L 8082:localhost:8082 -L 8083:localhost:8083 -L 8084:localhost:8084 -L 8085:localhost:8085 admin@$PUBLIC_IP"
    echo ""
    
    echo "🌐 URLs DE ACCESO (Después del túnel):"
    echo "======================================"
    echo "📋 Catálogo Principal:     http://localhost:8080/catalog-demo-local.html"
    echo "📋 Resumen del Proyecto:   http://localhost:8080/"
    echo ""
    echo "Versiones individuales:"
    for service in "${active_services[@]}"; do
        port=$(echo $service | cut -d: -f1)
        name=$(echo $service | cut -d: -f2)
        case $port in
            8081) echo "📱 $name: http://localhost:$port/" ;;
            8082) echo "🎨 $name: http://localhost:$port/landing.html" ;;
            8083) echo "🐍 $name: http://localhost:$port/" ;;
            8084) echo "⚡ $name: http://localhost:$port/" ;;
            8085) echo "📦 $name: http://localhost:$port/" ;;
            8080) echo "🎯 $name: http://localhost:$port/" ;;
        esac
    done
    
    echo ""
    echo "🎮 PASOS PARA USAR EL CATÁLOGO:"
    echo "==============================="
    echo "1. Ejecuta el comando de túnel SSH arriba"
    echo "2. Mantén la terminal del túnel abierta"
    echo "3. Abre tu navegador local"
    echo "4. Ve a: http://localhost:8080/catalog-demo-local.html"
    echo "5. ¡Navega entre las versiones con los botones!"
    echo ""
    
    echo "✨ CARACTERÍSTICAS DEL CATÁLOGO:"
    echo "==============================="
    echo "• 🔄 Verificación automática de estado de servicios"
    echo "• 🖼️ Iframes en tiempo real de cada implementación"
    echo "• 📊 Información técnica detallada"
    echo "• 🎯 Navegación por pestañas"
    echo "• 🔗 Enlaces directos para nueva pestaña"
    echo ""
    
else
    echo "❌ NO HAY SERVICIOS ACTIVOS"
    echo ""
    echo "🔧 Para iniciar todos los servicios:"
    echo "   ./deploy-all-versions.sh"
    echo ""
fi

echo "🛠️ COMANDOS DE GESTIÓN:"
echo "======================"
echo "Iniciar servicios:    ./deploy-all-versions.sh"
echo "Parar servicios:      ./stop-all-servers.sh"
echo "Ver este resumen:     ./generate-access-instructions.sh"
echo "Ver procesos:         ps aux | grep -E '(http.server|simple_main|simple-server)'"
echo ""

echo "📝 DOCUMENTACIÓN COMPLETA:"
echo "=========================="
echo "Ver archivo: LOCAL_ACCESS_GUIDE.md"
echo ""

echo "🎯 ¡LISTO PARA USAR! 🎯"