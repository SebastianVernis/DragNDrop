const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    let filePath = '';
    let contentType = 'text/html';
    
    // Rutas principales
    switch(req.url) {
        case '/':
        case '/versions-summary.html':
            filePath = path.join(__dirname, 'versions-summary.html');
            contentType = 'text/html';
            break;
        case '/status':
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                status: 'active',
                versions: 9,
                timestamp: new Date().toISOString(),
                uptime: process.uptime()
            }));
            return;
        default:
            // Servir archivos estáticos de versiones
            if (req.url.startsWith('/versions-organized/')) {
                filePath = path.join(__dirname, req.url);
            } else {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end(`
                    <h1>404 - Página no encontrada</h1>
                    <p><a href="/">Volver al resumen de versiones</a></p>
                `);
                return;
            }
            break;
    }
    
    // Servir archivo
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end(`
                    <h1>404 - Archivo no encontrado</h1>
                    <p>El archivo ${req.url} no existe.</p>
                    <p><a href="/">Volver al resumen de versiones</a></p>
                `);
            } else {
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.end(`
                    <h1>500 - Error del servidor</h1>
                    <p>Error: ${err.message}</p>
                `);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        }
    });
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor de resumen DragNDrop ejecutándose en:`);
    console.log(`   Local: http://localhost:${PORT}`);
    console.log(`   Red:   http://0.0.0.0:${PORT}`);
    console.log(`📋 Resumen disponible en: http://ip-publica:${PORT}/versions-summary.html`);
    console.log(`📊 Estado del servidor: http://ip-publica:${PORT}/status`);
});

// Manejo de errores
server.on('error', (err) => {
    console.error('❌ Error del servidor:', err.message);
    if (err.code === 'EADDRINUSE') {
        console.log(`🔄 Puerto ${PORT} ocupado, intentando con puerto ${PORT + 1}...`);
        server.listen(PORT + 1, '0.0.0.0');
    }
});

process.on('SIGINT', () => {
    console.log('\n🛑 Cerrando servidor...');
    server.close(() => {
        console.log('✅ Servidor cerrado correctamente');
        process.exit(0);
    });
});