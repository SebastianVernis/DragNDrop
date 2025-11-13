# Editor HTML Drag & Drop - Proyecto Completado

## Descripción
Editor visual de HTML con funcionalidad de arrastrar y soltar (drag & drop) para crear páginas web de forma intuitiva.

## Problema Encontrado y Solucionado

### Problema Principal
El JavaScript no se estaba ejecutando debido a un error crítico en el código. La causa raíz era:

**Línea 2567**: Dentro de una plantilla literal (template string) en la función `exportZip()`, había un tag `</script>` que el navegador interpretaba como el cierre del bloque principal de JavaScript, cortando prematuramente la ejecución del script.

```javascript
// ANTES (INCORRECTO):
const html = `<!DOCTYPE html>
...
<script src="script.js"></script>
...`;

// DESPUÉS (CORRECTO):
const html = `<!DOCTYPE html>
...
<script src="script.js"><\/script>
...`;
```

### Solución Aplicada
Se escapó el tag de cierre `</script>` usando `<\/script>` para evitar que el navegador lo interprete como el cierre del script principal.

## Funcionalidades Implementadas

### 1. **Galería de Plantillas**
- 5 plantillas profesionales precargadas:
  - Landing Page SaaS (Negocios)
  - Portafolio Profesional (Personal)
  - Blog Minimalista (Blog)
  - Página de Contacto (Servicios)
  - Tienda Online (Tienda)
- Filtros por categoría
- Opción de proyecto en blanco

### 2. **Panel de Componentes**
Componentes organizados en 6 categorías:

#### Layout
- Contenedor
- Sección
- Fila
- Columna
- Grid 2 Columnas
- Grid 3 Columnas

#### Texto
- Títulos H1, H2, H3
- Párrafo
- Texto en línea
- Listas ordenadas y desordenadas

#### Medios
- Imagen
- Video
- Iframe

#### Formularios
- Campo de texto
- Textarea
- Botón
- Checkbox
- Radio
- Select

#### Componentes
- Botones (Primario y Secundario)
- Card
- Navbar
- Footer
- Hero Section

#### UI Avanzado
- Pestañas (Tabs)
- Acordeón
- Modal
- Carrusel
- Alerta
- Badge

### 3. **Canvas (Área de Trabajo)**
- Vista responsive con 3 tamaños: Escritorio, Tablet, Móvil
- Drag & drop de componentes
- Selección de elementos
- Edición de texto con doble clic
- Eliminación de elementos
- Indicadores visuales de selección

### 4. **Panel de Propiedades**
Edición completa de estilos CSS:
- **General**: ID, clases, tag HTML
- **Dimensiones**: ancho, alto, máximos
- **Espaciado**: padding y margin (4 lados)
- **Posicionamiento**: display, position
- **Tipografía**: tamaño, peso, color, alineación
- **Fondo y Bordes**: colores, anchos, estilos, radios
- **Sombra y Efectos**: box-shadow, opacity
- **Flexbox**: dirección, justify, align, gap
- **Grid**: template columns/rows, gap, align
- **Transiciones**: duración y tipo
- **Atributos específicos**: según el tipo de elemento

### 5. **Barra de Herramientas**
- **Plantillas**: Volver a la galería
- **Nuevo**: Crear proyecto en blanco
- **Vistas**: Escritorio / Tablet / Móvil
- **Exportar HTML**: Descarga archivo HTML completo
- **Exportar Todo**: Descarga HTML, CSS y JS separados
- **Ayuda**: Documentación completa
- **Guardar**: Guardar proyecto como JSON
- **Cargar**: Cargar proyecto guardado

### 6. **Funcionalidades Adicionales**
- **Búsqueda de componentes**: Filtro en tiempo real
- **Categorías colapsables**: Organización del panel
- **Atajos de teclado**:
  - `Delete`: Eliminar elemento seleccionado
  - `Ctrl+S`: Guardar proyecto
- **Notificaciones toast**: Feedback visual de acciones
- **Componentes interactivos**: Tabs, acordeones, modales y carruseles con JavaScript funcional

## Tecnologías Utilizadas
- **HTML5**: Estructura
- **CSS3**: Estilos y animaciones
- **JavaScript Vanilla**: Lógica completa sin frameworks
- **Drag & Drop API**: Funcionalidad de arrastrar y soltar

## Cómo Usar

### Iniciar el Proyecto
1. Abrir `dnd.html` en un navegador web
2. Seleccionar una plantilla o crear un proyecto en blanco

### Crear una Página
1. Arrastrar componentes desde el panel izquierdo al canvas
2. Hacer clic en un elemento para seleccionarlo
3. Editar propiedades en el panel derecho
4. Doble clic en textos para editarlos
5. Usar el botón de eliminar (×) para borrar elementos

### Exportar
- **Exportar HTML**: Genera un archivo HTML completo con estilos inline
- **Exportar Todo**: Genera 3 archivos separados:
  - `index.html`: Estructura HTML
  - `styles.css`: Estilos CSS
  - `script.js`: JavaScript para componentes interactivos

### Guardar y Cargar
- **Guardar**: Descarga un archivo JSON con el proyecto
- **Cargar**: Sube el archivo JSON para continuar editando

## Estructura del Código

```
dnd.html
├── <style>           # Estilos CSS (líneas 7-622)
├── <body>            # Estructura HTML (líneas 623-923)
│   ├── Toolbar       # Barra superior
│   ├── Components    # Panel izquierdo
│   ├── Canvas        # Área central
│   ├── Properties    # Panel derecho
│   ├── Help Screen   # Documentación
│   └── Gallery       # Galería de plantillas
└── <script>          # JavaScript (líneas 924-2801)
    ├── Variables globales
    ├── Plantillas precargadas
    ├── Inicialización
    ├── Funciones de componentes
    ├── Funciones de drag & drop
    ├── Funciones de propiedades
    ├── Funciones de exportación
    └── Utilidades
```

## Estado del Proyecto
✅ **COMPLETADO Y FUNCIONAL**

Todas las funcionalidades están implementadas y probadas:
- ✅ Galería de plantillas renderizando correctamente
- ✅ Drag & drop funcionando
- ✅ Panel de propiedades operativo
- ✅ Exportación de HTML y archivos
- ✅ Guardar y cargar proyectos
- ✅ Componentes interactivos con JavaScript
- ✅ Responsive design (3 tamaños de vista)
- ✅ Búsqueda y filtros
- ✅ Atajos de teclado
- ✅ Notificaciones toast

## Notas Técnicas
- El proyecto es completamente standalone (un solo archivo HTML)
- No requiere dependencias externas
- Compatible con navegadores modernos
- Usa APIs nativas del navegador (Drag & Drop, File API, etc.)

## Autor
Proyecto de editor HTML visual con drag & drop
Fecha: 2025
