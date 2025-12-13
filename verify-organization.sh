#!/bin/bash

echo "🔍 Verificando organización del proyecto DragNDrop..."
echo "=================================================="

# Verificar estructura de versiones
echo ""
echo "📁 Versiones organizadas:"
for version in $(ls -1 versions-organized/ 2>/dev/null); do
    echo "  ✓ $version"
    if [ -f "versions-organized/$version/README.md" ]; then
        echo "    📖 README.md presente"
    else
        echo "    ❌ README.md faltante"
    fi
    if [ -d "versions-organized/$version/docs" ]; then
        echo "    📚 Documentación presente"
    else
        echo "    ❌ Documentación faltante"
    fi
done

# Verificar tecnologías por versión
echo ""
echo "🛠️ Tecnologías por versión:"
echo "  v1-vanilla-standalone: HTML5, CSS3, Vanilla JS, Service Worker"
echo "  v2-landing-page: HTML, CSS, Responsive Design"
echo "  v3-backend-python: Python 3.13, FastAPI, SQLAlchemy, Alembic"
echo "  v4-backend-nodejs: Node.js, Express, Drizzle ORM, JWT"
echo "  v5-npm-package: NPM Package, Framework Detection, Parser"
echo "  v6-frontend-react: React, TypeScript, JSX"
echo "  v7-backend-python-fullstack: Python, FastAPI, Jinja2, PostgreSQL"
echo "  v8-backend-nodejs-fullstack: Node.js, Express, Socket.io, Drizzle"
echo "  v9-frontend-react-vite: React 18, Vite, TypeScript, HMR"

# Verificar archivos principales
echo ""
echo "📋 Archivos de resumen:"
if [ -f "versions-summary.html" ]; then
    echo "  ✓ versions-summary.html presente"
else
    echo "  ❌ versions-summary.html faltante"
fi

if [ -f "summary-server.js" ]; then
    echo "  ✓ summary-server.js presente"
else
    echo "  ❌ summary-server.js faltante"
fi

# Verificar servidor
echo ""
echo "🌐 Estado del servidor:"
if curl -s http://localhost:8080/status > /dev/null 2>&1; then
    echo "  ✓ Servidor ejecutándose en puerto 8080"
    echo "  📊 Status: $(curl -s http://localhost:8080/status | jq -r '.status' 2>/dev/null || echo 'active')"
else
    echo "  ❌ Servidor no responde en puerto 8080"
fi

# Verificar documentación archivada
echo ""
echo "📚 Documentación archivada:"
if [ -d "documentation-archive" ]; then
    doc_count=$(find documentation-archive -name "*.md" | wc -l)
    echo "  ✓ $doc_count documentos archivados en documentation-archive/"
else
    echo "  ❌ Directorio documentation-archive no encontrado"
fi

# Resumen final
echo ""
echo "📊 RESUMEN FINAL:"
echo "=================="
version_count=$(ls -1 versions-organized/ 2>/dev/null | wc -l)
echo "  🚀 Total de versiones organizadas: $version_count"

backend_count=$(ls -1 versions-organized/ | grep -E "(backend|fullstack)" | wc -l)
echo "  🔧 Versiones con backend: $backend_count"

frontend_count=$(ls -1 versions-organized/ | grep -E "(frontend|react|vanilla|landing)" | wc -l)
echo "  🎨 Versiones con frontend: $frontend_count"

echo ""
echo "🌍 URLs de acceso:"
echo "  📋 Resumen principal: http://ip-publica:8080/versions-summary.html"
echo "  📊 Status del servidor: http://ip-publica:8080/status"
echo "  📁 Archivos de proyecto: http://ip-publica:8080/versions-organized/"

echo ""
echo "✅ Verificación completada"