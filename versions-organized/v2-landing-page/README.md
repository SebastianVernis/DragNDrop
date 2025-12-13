# Versión 2: Landing Page

## Descripción
Página de marketing profesional para promocionar el editor DragNDrop.

## Tecnologías
- **HTML5**: Estructura semántica
- **CSS3**: Animaciones, gradientes, responsive design
- **JavaScript vanilla**: Interactividad básica

## Características
- ✅ Hero section con CTA
- ✅ Sección de características destacadas
- ✅ Pricing plans (Free, Pro, Enterprise)
- ✅ Demo interactivo
- ✅ Testimonios
- ✅ FAQ
- ✅ Footer con enlaces
- ✅ Responsive design
- ✅ Animaciones smooth scroll
- ✅ Mobile menu

## Cómo ejecutar

### Opción 1: HTTP Server
```bash
cd /home/admin/DragNDrop/versions/v2-landing-page
npx http-server -p 8081 -c-1
# Abrir: http://localhost:8081/landing.html
```

### Opción 2: Python
```bash
cd /home/admin/DragNDrop/versions/v2-landing-page
python3 -m http.server 8081
# Abrir: http://localhost:8081/landing.html
```

## Estructura de archivos
```
v2-landing-page/
├── landing.html    # Página principal
└── landing.css     # Estilos
```

## Puertos
- **Landing**: 8081

## Estado
✅ **PRODUCCIÓN** - Lista para usar

## Casos de uso
- Página de presentación del producto
- Captura de leads
- Información de pricing
- Conversión de visitantes a usuarios

## Integración
- Enlaza al editor principal (index.html)
- Puede integrarse con backend para formularios
- Analytics ready (Google Analytics, Plausible)

## Próximos pasos
- Agregar formulario de contacto funcional
- Integrar con CRM
- A/B testing
- Agregar más testimonios reales
