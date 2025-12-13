#!/bin/bash

echo "🔧 Configurando Nginx para servir DragNDrop Summary..."

# Crear configuración de nginx
cat > /tmp/dragndrop-summary << 'EOF'
server {
    listen 80;
    server_name _;
    
    # Configurar el root al directorio del proyecto
    root /home/admin/DragNDrop;
    
    # Index file es nuestro resumen
    index versions-summary.html;
    
    # Configuración de logs
    access_log /var/log/nginx/dragndrop-access.log;
    error_log /var/log/nginx/dragndrop-error.log;
    
    # Servir el resumen como index
    location / {
        try_files $uri $uri/ /versions-summary.html;
    }
    
    # Servir archivos estáticos de las versiones
    location /versions-organized/ {
        try_files $uri $uri/ =404;
        autoindex on;
        autoindex_exact_size off;
        autoindex_localtime on;
    }
    
    # Endpoint de status del servidor Node.js
    location /api/status {
        proxy_pass http://localhost:8080/status;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
    
    # Servir documentación archivada
    location /documentation-archive/ {
        try_files $uri $uri/ =404;
        autoindex on;
        autoindex_exact_size off;
        autoindex_localtime on;
    }
    
    # Servir archivos de verificación
    location /verify {
        try_files /verify-organization.sh =404;
        add_header Content-Type text/plain;
    }
    
    # Configuración de headers de seguridad
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    
    # Configuración de cache para archivos estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Configuración de cache para HTML
    location ~* \.html$ {
        expires 1h;
        add_header Cache-Control "public, must-revalidate";
    }
    
    # Configuración para archivos markdown como texto plano
    location ~* \.md$ {
        add_header Content-Type text/plain;
        expires 1h;
    }
}
EOF

# Mover la configuración a sites-available
sudo mv /tmp/dragndrop-summary /etc/nginx/sites-available/

# Deshabilitar configuración default
sudo rm -f /etc/nginx/sites-enabled/default

# Habilitar nueva configuración
sudo ln -sf /etc/nginx/sites-available/dragndrop-summary /etc/nginx/sites-enabled/

# Ajustar permisos del directorio del proyecto para nginx
sudo chmod 755 /home/admin/DragNDrop
sudo chmod 644 /home/admin/DragNDrop/versions-summary.html
sudo chmod -R 755 /home/admin/DragNDrop/versions-organized
sudo chmod -R 755 /home/admin/DragNDrop/documentation-archive

# Verificar configuración de nginx
echo "🔍 Verificando configuración de Nginx..."
sudo nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Configuración de Nginx válida"
    
    # Reiniciar nginx
    echo "🔄 Reiniciando Nginx..."
    sudo systemctl reload nginx
    sudo systemctl restart nginx
    
    # Verificar estado
    echo "📊 Estado de Nginx:"
    sudo systemctl status nginx --no-pager -l
    
    echo ""
    echo "🚀 ¡Nginx configurado exitosamente!"
    echo "📋 Resumen disponible en: http://$(curl -s http://checkip.amazonaws.com || echo 'ip-publica')/"
    echo "📁 Versiones: http://$(curl -s http://checkip.amazonaws.com || echo 'ip-publica')/versions-organized/"
    echo "📚 Documentación: http://$(curl -s http://checkip.amazonaws.com || echo 'ip-publica')/documentation-archive/"
    echo "📊 Status API: http://$(curl -s http://checkip.amazonaws.com || echo 'ip-publica')/api/status"
    
else
    echo "❌ Error en la configuración de Nginx"
    sudo nginx -t
    exit 1
fi