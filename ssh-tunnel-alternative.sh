#!/bin/bash

echo "🔗 Configurando túnel SSH con puertos alternativos..."
echo "=================================================="

# Puertos alternativos para evitar conflictos
echo "Usando puertos locales alternativos para evitar conflictos:"
echo "  Local 9080 → Remoto 8080 (Summary Server)"
echo "  Local 9081 → Remoto 8081 (V1 - Vanilla)"
echo "  Local 9082 → Remoto 8082 (V2 - Landing)"
echo "  Local 9083 → Remoto 8083 (V3 - Python)"
echo "  Local 9084 → Remoto 8084 (V8 - NodeJS)"
echo "  Local 9085 → Remoto 8085 (V5 - NPM)"

echo ""
echo "🚀 EJECUTA ESTE COMANDO EN TU EQUIPO LOCAL:"
echo "============================================"
echo "ssh -L 9080:localhost:8080 -L 9081:localhost:8081 -L 9082:localhost:8082 -L 9083:localhost:8083 -L 9084:localhost:8084 -L 9085:localhost:8085 admin@18.223.32.141"

echo ""
echo "🌐 URLs DE ACCESO (con puertos alternativos):"
echo "=============================================="
echo "📋 Catálogo Principal:      http://localhost:9080/catalog-demo-alternative.html"
echo "📋 Resumen del Proyecto:    http://localhost:9080/"
echo ""
echo "Versiones individuales:"
echo "📱 V1 - Vanilla:            http://localhost:9081/"
echo "🎨 V2 - Landing:            http://localhost:9082/landing.html"  
echo "🐍 V3 - Python API:         http://localhost:9083/"
echo "⚡ V8 - NodeJS Full:         http://localhost:9084/"
echo "📦 V5 - NPM Package:        http://localhost:9085/"

echo ""
echo "✨ PASOS A SEGUIR:"
echo "=================="
echo "1. Copia y ejecuta el comando SSH de arriba"
echo "2. Mantén esa terminal abierta"
echo "3. Abre tu navegador"
echo "4. Ve a: http://localhost:9080/catalog-demo-alternative.html"
echo ""

# Crear versión alternativa del catálogo
cat > /home/admin/DragNDrop/catalog-demo-alternative.html << 'HTMLEOF'
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DragNDrop - Catálogo Local (Puertos Alternativos)</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: #333;
        }

        .header {
            background: rgba(255, 255, 255, 0.95);
            padding: 20px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            position: sticky;
            top: 0;
            z-index: 100;
            backdrop-filter: blur(10px);
        }

        .header h1 {
            text-align: center;
            color: #2c3e50;
            margin-bottom: 10px;
        }

        .connection-info {
            text-align: center;
            background: #e3f2fd;
            padding: 15px;
            border-radius: 8px;
            margin: 10px 0;
            border: 1px solid #2196f3;
        }

        .ssh-command {
            background: #f5f5f5;
            padding: 10px;
            border-radius: 5px;
            font-family: monospace;
            font-size: 12px;
            margin: 10px 0;
            overflow-x: auto;
            border: 1px solid #ddd;
        }

        .controls {
            display: flex;
            justify-content: center;
            gap: 15px;
            flex-wrap: wrap;
            margin-top: 15px;
        }

        .version-btn {
            background: linear-gradient(45deg, #3498db, #2980b9);
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 25px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s ease;
            position: relative;
            font-size: 14px;
        }

        .version-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }

        .version-btn.active {
            background: linear-gradient(45deg, #e74c3c, #c0392b);
            transform: scale(1.05);
        }

        .version-btn.running::after {
            content: "🟢";
            position: absolute;
            top: -5px;
            right: -5px;
            background: white;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
        }

        .version-btn.error::after {
            content: "🔴";
            position: absolute;
            top: -5px;
            right: -5px;
            background: white;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
        }

        .main-container {
            display: flex;
            height: calc(100vh - 220px);
            gap: 20px;
            padding: 20px;
        }

        .sidebar {
            width: 350px;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 15px;
            padding: 20px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.1);
            backdrop-filter: blur(10px);
            overflow-y: auto;
        }

        .iframe-container {
            flex: 1;
            background: white;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 8px 25px rgba(0,0,0,0.1);
            position: relative;
        }

        .iframe-header {
            background: #34495e;
            color: white;
            padding: 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .iframe-header h3 {
            margin: 0;
        }

        .status-indicator {
            display: flex;
            align-items: center;
            gap: 5px;
        }

        .status-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: #95a5a6;
        }

        .status-dot.connected { background: #27ae60; }
        .status-dot.error { background: #e74c3c; }

        .iframe-actions {
            display: flex;
            gap: 10px;
        }

        .iframe-btn {
            background: #3498db;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 12px;
        }

        .iframe-btn:hover {
            background: #2980b9;
        }

        iframe {
            width: 100%;
            height: calc(100% - 60px);
            border: none;
            background: white;
        }

        .version-info {
            margin-bottom: 20px;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 10px;
            border-left: 4px solid #3498db;
        }

        .version-info h4 {
            color: #2c3e50;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .connection-status {
            font-size: 12px;
            padding: 3px 8px;
            border-radius: 10px;
            font-weight: bold;
        }

        .status-connected { background: #d4edda; color: #155724; }
        .status-error { background: #f8d7da; color: #721c24; }

        .tech-list {
            list-style: none;
            padding: 0;
        }

        .tech-list li {
            padding: 3px 0;
            font-size: 14px;
        }

        .tech-list li:before {
            content: "🔧 ";
            margin-right: 5px;
        }

        .features-list {
            list-style: none;
            padding: 0;
            margin-top: 10px;
        }

        .features-list li {
            padding: 2px 0;
            font-size: 13px;
        }

        .features-list li:before {
            content: "✓ ";
            color: #27ae60;
            font-weight: bold;
            margin-right: 5px;
        }

        .no-selection {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            flex-direction: column;
            color: #7f8c8d;
            text-align: center;
        }

        .refresh-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #27ae60;
            color: white;
            border: none;
            padding: 15px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 18px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }

        .refresh-btn:hover {
            transform: scale(1.1);
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🚀 DragNDrop - Catálogo Local (Puertos 90XX)</h1>
        <div class="connection-info">
            <strong>🔗 Túnel SSH Configurado con Puertos Alternativos</strong><br>
            Si tienes conflictos con puertos 8080-8085, usa esta versión
            <div class="ssh-command">
                ssh -L 9080:localhost:8080 -L 9081:localhost:8081 -L 9082:localhost:8082 -L 9083:localhost:8083 -L 9084:localhost:8084 -L 9085:localhost:8085 admin@18.223.32.141
            </div>
        </div>
        
        <div class="controls">
            <button class="version-btn" data-version="v1" data-port="9081">V1 - Vanilla</button>
            <button class="version-btn" data-version="v2" data-port="9082">V2 - Landing</button>
            <button class="version-btn" data-version="v3" data-port="9083">V3 - Python API</button>
            <button class="version-btn" data-version="v5" data-port="9085">V5 - NPM Package</button>
            <button class="version-btn" data-version="v8" data-port="9084">V8 - Node Full</button>
            <button class="version-btn" onclick="checkAllConnections()" style="background: linear-gradient(45deg, #27ae60, #219a52);">🔄 Verificar Todo</button>
        </div>
    </div>

    <div class="main-container">
        <div class="sidebar">
            <div id="version-details">
                <div class="no-selection">
                    <h3>👈 Selecciona una versión</h3>
                    <p>Asegúrate de tener el túnel SSH activo</p>
                    <p style="margin-top: 15px;">🔗 <strong>Comando necesario:</strong></p>
                    <div class="ssh-command" style="margin: 10px 0;">
                        ssh -L 9080:localhost:8080 -L 9081:localhost:8081 -L 9082:localhost:8082 -L 9083:localhost:8083 -L 9084:localhost:8084 -L 9085:localhost:8085 admin@18.223.32.141
                    </div>
                </div>
            </div>
        </div>

        <div class="iframe-container">
            <div class="iframe-header">
                <h3 id="iframe-title">Selecciona una versión para comenzar</h3>
                <div class="status-indicator">
                    <div class="status-dot" id="connection-dot"></div>
                    <span id="connection-text">Sin conexión</span>
                </div>
                <div class="iframe-actions">
                    <button class="iframe-btn" onclick="refreshIframe()">🔄 Recargar</button>
                    <button class="iframe-btn" onclick="openInNewTab()">🔗 Nueva Pestaña</button>
                    <button class="iframe-btn" onclick="checkConnection()">📡 Verificar</button>
                </div>
            </div>
            <iframe id="demo-iframe" style="display: none;"></iframe>
            <div id="no-iframe" class="no-selection">
                <h2>🎯 Catálogo con Puertos Alternativos</h2>
                <p>Esta versión usa puertos 90XX para evitar conflictos</p>
                <p>Asegúrate de ejecutar el túnel SSH correcto</p>
            </div>
        </div>
    </div>

    <button class="refresh-btn" onclick="checkAllConnections()">🔄</button>

    <script>
        const versions = {
            v1: {
                name: 'V1 - Vanilla Standalone',
                port: 9081,
                url: 'http://localhost:9081/',
                description: 'Implementación completa sin dependencias',
                technologies: ['HTML5 + CSS3', 'Vanilla JavaScript', 'Service Worker', 'Monaco Editor'],
                features: ['34 componentes integrados', 'Sistema colaboración P2P', 'Integración AI', 'Tutorial interactivo']
            },
            v2: {
                name: 'V2 - Landing Page',
                port: 9082,
                url: 'http://localhost:9082/landing.html',
                description: 'Página de presentación del proyecto',
                technologies: ['HTML5', 'CSS3', 'Responsive Design'],
                features: ['Diseño atractivo', 'Totalmente responsive', 'Animaciones CSS']
            },
            v3: {
                name: 'V3 - Backend Python',
                port: 9083,
                url: 'http://localhost:9083/',
                description: 'API RESTful con FastAPI + Demo Frontend',
                technologies: ['Python 3.13', 'FastAPI', 'Pydantic', 'Uvicorn'],
                features: ['API REST completa', 'Frontend demo interactivo', 'Documentación Swagger']
            },
            v5: {
                name: 'V5 - NPM Package',
                port: 9085,
                url: 'http://localhost:9085/',
                description: 'Librería reutilizable para integración',
                technologies: ['Node.js', 'NPM Package', 'Framework Detection'],
                features: ['Documentación completa', 'Ejemplos de uso', 'API reference']
            },
            v8: {
                name: 'V8 - NodeJS Fullstack',
                port: 9084,
                url: 'http://localhost:9084/',
                description: 'Backend + Frontend con colaboración tiempo real',
                technologies: ['Node.js + Express', 'Socket.io', 'WebSocket'],
                features: ['Colaboración tiempo real', 'WebSocket bidireccional', 'Sistema de salas']
            }
        };

        let currentVersion = null;

        async function checkConnection(version = null) {
            if (!version && currentVersion) {
                version = currentVersion;
            }
            
            if (!version) return false;
            
            const versionData = versions[version];
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000);
            
            try {
                const response = await fetch(versionData.url, { 
                    signal: controller.signal,
                    mode: 'no-cors'
                });
                clearTimeout(timeoutId);
                return true;
            } catch (error) {
                clearTimeout(timeoutId);
                return false;
            }
        }

        async function updateConnectionStatus(version) {
            const isConnected = await checkConnection(version);
            const btn = document.querySelector(`[data-version="${version}"]`);
            const dot = document.getElementById('connection-dot');
            const text = document.getElementById('connection-text');
            
            if (btn) {
                btn.classList.remove('running', 'error');
                btn.classList.add(isConnected ? 'running' : 'error');
            }
            
            if (currentVersion === version) {
                dot.classList.remove('connected', 'error');
                dot.classList.add(isConnected ? 'connected' : 'error');
                text.textContent = isConnected ? 'Conectado' : 'Sin respuesta';
            }
            
            return isConnected;
        }

        async function showVersion(versionKey) {
            currentVersion = versionKey;
            const version = versions[versionKey];
            
            // Actualizar botones
            document.querySelectorAll('.version-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            document.querySelector(`[data-version="${versionKey}"]`).classList.add('active');
            
            // Verificar conexión
            const isConnected = await updateConnectionStatus(versionKey);
            
            // Actualizar sidebar
            const detailsDiv = document.getElementById('version-details');
            const statusClass = isConnected ? 'status-connected' : 'status-error';
            const statusText = isConnected ? 'FUNCIONANDO' : 'NO RESPONDE';
            
            detailsDiv.innerHTML = `
                <div class="version-info">
                    <h4>
                        ${version.name}
                        <span class="connection-status ${statusClass}">${statusText}</span>
                    </h4>
                    <p><strong>Puerto local:</strong> ${version.port}</p>
                    <p><strong>URL:</strong> <a href="${version.url}" target="_blank">${version.url}</a></p>
                    
                    <h5 style="margin-top: 15px; margin-bottom: 5px;">🛠️ Tecnologías:</h5>
                    <ul class="tech-list">
                        ${version.technologies.map(tech => `<li>${tech}</li>`).join('')}
                    </ul>
                    
                    <h5 style="margin-top: 15px; margin-bottom: 5px;">✨ Características:</h5>
                    <ul class="features-list">
                        ${version.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                    
                    ${!isConnected ? 
                        `<div style="background: #f8d7da; border: 1px solid #f5c6cb; color: #721c24; padding: 15px; border-radius: 8px; margin-top: 15px;">
                            <strong>⚠️ No se puede conectar</strong><br>
                            Verifica que el túnel SSH esté activo y funcionando
                        </div>` : ''
                    }
                </div>
            `;
            
            // Actualizar iframe
            const iframe = document.getElementById('demo-iframe');
            const noIframe = document.getElementById('no-iframe');
            const iframeTitle = document.getElementById('iframe-title');
            
            if (isConnected) {
                iframe.src = version.url;
                iframe.style.display = 'block';
                noIframe.style.display = 'none';
                iframeTitle.textContent = version.name;
            } else {
                iframe.style.display = 'none';
                noIframe.style.display = 'flex';
                noIframe.innerHTML = `
                    <div style="text-align: center;">
                        <h3>🔴 Túnel SSH Requerido</h3>
                        <p>No se puede acceder al puerto ${version.port}</p>
                        <div style="margin: 20px 0;">
                            <p>Ejecuta este comando en tu terminal:</p>
                            <div class="ssh-command" style="margin: 10px 0;">
                                ssh -L 9080:localhost:8080 -L 9081:localhost:8081 -L 9082:localhost:8082 -L 9083:localhost:8083 -L 9084:localhost:8084 -L 9085:localhost:8085 admin@18.223.32.141
                            </div>
                        </div>
                        <button onclick="checkConnection('${versionKey}')" style="background: #3498db; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
                            🔄 Verificar Conexión
                        </button>
                    </div>
                `;
                iframeTitle.textContent = `${version.name} - Túnel SSH requerido`;
            }
        }

        async function checkAllConnections() {
            const buttons = document.querySelectorAll('.version-btn[data-version]');
            
            for (const btn of buttons) {
                const version = btn.dataset.version;
                if (version && versions[version]) {
                    await updateConnectionStatus(version);
                }
            }
            
            if (currentVersion) {
                await showVersion(currentVersion);
            }
        }

        function refreshIframe() {
            const iframe = document.getElementById('demo-iframe');
            if (iframe.src && currentVersion) {
                iframe.src = iframe.src;
            }
        }

        function openInNewTab() {
            if (currentVersion) {
                const version = versions[currentVersion];
                window.open(version.url, '_blank');
            }
        }

        // Event listeners
        document.querySelectorAll('.version-btn[data-version]').forEach(btn => {
            btn.addEventListener('click', () => {
                showVersion(btn.dataset.version);
            });
        });

        // Auto-verificar al cargar
        window.addEventListener('load', () => {
            setTimeout(checkAllConnections, 1000);
            setInterval(checkAllConnections, 30000);
        });
    </script>
</body>
</html>
HTMLEOF

echo "📋 Catálogo alternativo creado: catalog-demo-alternative.html"
echo ""
echo "🎯 ¡LISTO! Sigue los pasos de arriba para acceder al catálogo."