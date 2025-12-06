# Sistema de Menús Desplegables del Toolbar

## Descripción

Sistema modular de menús desplegables para organizar las funciones del editor en grupos lógicos, mejorando la experiencia de usuario y reduciendo la sobrecarga visual del toolbar.

## Estructura de Menús

### 📁 Archivo
Gestión de proyectos y archivos
- Nuevo Proyecto
- Guardar Proyecto
- Cargar Proyecto
- Importar HTML
- Analizar Directorio
- Plantillas
- Mis Proyectos
- Biblioteca de Componentes

### ✏️ Editar
Acciones de edición
- Deshacer (Ctrl+Z)
- Rehacer (Ctrl+Y)

### 📐 Layout
Herramientas de diseño y posicionamiento
- Modo Libre
- Organizar Vertical
- Organizar Grid

### 👁️ Vista
Control de visualización y responsive
- Escritorio
- Tablet
- Móvil
- Tester Responsive
- Vista Previa en Vivo
- Tema Oscuro (Ctrl+Shift+D)

### 🤖 AI Tools
Funcionalidades de inteligencia artificial
- Generar Componente
- Verificar Accesibilidad
- Optimizar SEO
- Dashboard de Tokens
- Configurar API

### 📥 Exportar
Opciones de exportación
- Exportar HTML
- Exportar Todo (ZIP)

### 🚀 Deploy
Despliegue e integraciones
- Deploy a Vercel
- Integración GitHub
- Historial de Deploys

### ❓ Ayuda
Recursos de ayuda
- Tutorial Interactivo
- Centro de Ayuda

## Características

### Sincronización de Estados
- Estados activos/deshabilitados sincronizados entre toolbar y dropdowns
- Integración con UndoRedoManager para estados de deshacer/rehacer
- Sincronización automática de vistas (desktop/tablet/mobile)

### Interacción
- Hover para abrir menú
- Click para toggle en dispositivos táctiles
- Cierre automático al hacer click fuera
- ESC para cerrar todos los menús
- Auto-cierre al seleccionar opción

### Responsive
- Adaptación en dispositivos móviles
- Menús en bottom sheet en pantallas pequeñas
- Scroll horizontal del toolbar en pantallas reducidas

### Accesibilidad
- Navegación por teclado
- Indicadores visuales de estado
- Atajos de teclado visibles
- Estados disabled claramente marcados

## Archivos

### HTML
`index.html` - Estructura de menús desplegables

### CSS
`style.css` - Estilos de dropdowns, estados y responsive

### JavaScript
`src/components/toolbarDropdown.js` - Lógica de menús y sincronización

## API JavaScript

### Clase: ToolbarDropdownManager

#### Métodos Públicos

```javascript
// Abrir dropdown específico
openDropdown(dropdown, menu)

// Cerrar dropdown específico
closeDropdown(dropdown, menu)

// Toggle dropdown
toggleDropdown(dropdown, menu)

// Cerrar todos los dropdowns
closeAllDropdowns()

// Actualizar estado de item
updateItemState(itemId, { disabled: boolean, active: boolean })

// Destruir manager
destroy()
```

#### Eventos

Los menús disparan los mismos eventos que los botones originales, manteniendo compatibilidad con el código existente.

## Personalización

### Agregar Nuevo Menú

```html
<div class="toolbar-dropdown">
    <button class="toolbar-btn dropdown-trigger">
        🎨 Mi Menú <span class="dropdown-arrow">▼</span>
    </button>
    <div class="toolbar-dropdown-menu">
        <button class="dropdown-item" onclick="miAccion()">
            🔥 Mi Acción <span class="shortcut">Ctrl+M</span>
        </button>
        <div class="dropdown-divider"></div>
        <button class="dropdown-item" onclick="otraAccion()">
            ⚡ Otra Acción
        </button>
    </div>
</div>
```

### Estilos CSS Variables

```css
--bg-primary: Color de fondo principal
--bg-secondary: Color de fondo hover
--bg-tertiary: Color de fondo activo
--border-primary: Color de bordes
--text-primary: Color de texto
--text-tertiary: Color de atajos
--accent-primary: Color de acento
--shadow-lg: Sombra del menú
```

## Mejores Prácticas

1. **Agrupar funciones relacionadas** - Mantener lógica consistente en cada menú
2. **Limitar items** - Máximo 8-10 items por menú para mejor UX
3. **Usar dividers** - Separar grupos de acciones dentro del mismo menú
4. **Indicar shortcuts** - Mostrar atajos de teclado cuando estén disponibles
5. **Estados claros** - Marcar items activos/deshabilitados apropiadamente
6. **Iconos consistentes** - Usar emojis o iconos para mejor identificación

## Compatibilidad

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Dispositivos móviles (iOS/Android)

## Migración desde Toolbar Lineal

Los botones originales permanecen funcionales para compatibilidad. El sistema de dropdowns es una capa adicional que no rompe funcionalidad existente.

## Futuras Mejoras

- [ ] Menús contextuales (click derecho)
- [ ] Menús anidados (submenús)
- [ ] Búsqueda en menús
- [ ] Personalización por usuario
- [ ] Favoritos/recientes
- [ ] Temas de iconos

## Soporte

Para reportar issues o sugerir mejoras, ver `CONTRIBUTING.md`
