# 🚀 Nuevas Funcionalidades - Editor HTML v3.0

## 📋 Resumen de Mejoras

Esta actualización introduce mejoras significativas en la experiencia de usuario del editor HTML, con foco en:

1. **Sistema de Drag & Drop Mejorado** - Más intuitivo y visual
2. **Redimensionamiento de Elementos** - Handles visuales para cambiar tamaño
3. **Validación Sintáctica con IA** - Corrección automática usando Gemini API
4. **Análisis de Proyectos Completos** - Mapeo de directorios JS/HTML

---

## 🎯 1. Sistema de Drag & Drop Mejorado

### Características

- **Preview Visual**: Al arrastrar componentes, se muestra un preview del elemento
- **Indicador de Drop Inteligente**: Línea azul que indica exactamente dónde se insertará el elemento
- **Zonas de Drop Resaltadas**: Los contenedores compatibles se iluminan durante el arrastre
- **Drag Handle**: Icono `⋮⋮` en el lado izquierdo de elementos seleccionados para facilitar el arrastre
- **Auto-scroll**: Scroll automático cuando arrastras cerca de los bordes
- **Detección de Posición**: Inserta antes, después o dentro de elementos según la posición del cursor

### Uso

1. **Arrastrar nuevo componente**: Simplemente arrastra desde el panel izquierdo
2. **Reordenar elementos**: 
   - Selecciona el elemento (clic)
   - Arrastra usando el handle `⋮⋮` que aparece a la izquierda
   - Suelta en la posición deseada

### Módulo: `src/core/enhancedDragDrop.js`

---

## 📐 2. Redimensionamiento de Elementos

### Características

- **8 Handles de Resize**: Esquinas y bordes (N, S, E, W, NE, NW, SE, SW)
- **Tooltip de Dimensiones**: Muestra `ancho × alto` en tiempo real
- **Preservar Aspect Ratio**: Mantén presionado `Shift` mientras redimensionas
- **Límites Mínimos**: Previene elementos demasiado pequeños (20×20px)
- **Cancelar con ESC**: Presiona `Escape` para cancelar y restaurar tamaño original
- **Visual Feedback**: Handles con animación hover y elemento con outline durante resize

### Uso

1. **Selecciona un elemento** (aparecen los handles automáticamente)
2. **Arrastra cualquier handle** para redimensionar
3. **Mantén Shift** para preservar proporciones
4. **Presiona ESC** para cancelar

### Atajos

- `Shift + Drag`: Preservar aspect ratio
- `Escape`: Cancelar resize

### Módulo: `src/core/resizeManager.js`

---

## 🤖 3. Validación Sintáctica con Gemini AI

### Características

- **Corrección Automática**: Valida sintaxis HTML/CSS mientras editas
- **Modelo Optimizado**: Usa `gemini-2.0-flash-lite` para bajo costo
- **Sugerencias No Intrusivas**: Badge flotante `💡 Mejora disponible`
- **Solo Corrección Sintáctica**: No modifica semántica, solo arregla errores
- **Debounce Inteligente**: Espera 1.5s después de editar antes de validar
- **Sin Interacción Directa**: Solo correcciones técnicas, sin chat

### Configuración

1. **Obtén tu API Key**:
   - Visita: https://makersuite.google.com/app/apikey
   - Crea una API key gratuita de Google Gemini

2. **Configura en el Editor**:
   - Clic en botón `🔧 Gemini` en la barra de herramientas
   - Pega tu API key
   - Guardar

3. **Uso Automático**:
   - Al seleccionar un elemento, se valida automáticamente
   - Si hay sugerencias, aparece un badge con `💡 Mejora disponible`
   - Clic en "Aplicar" para aceptar la corrección
   - Clic en "×" para ignorar

### Optimización de Tokens

El sistema está optimizado para economizar tokens:

- **Prompts ultra-concisos**: Solo código relevante, sin contexto innecesario
- **Max 512 tokens de salida**: Límite estricto
- **Debounce**: No se valida en cada tecla, sino después de pausas
- **Contexto minimal**: Solo el elemento editado y su padre directo
- **Sin explicaciones**: La API solo devuelve código corregido

### Módulo: `src/core/geminiValidator.js`

### Ejemplo de Prompt Enviado

```
Fix HTML/CSS syntax only. Return valid code.

Element: <div>
HTML: <div style="colr: red;">...</div>
Styles: colr: red;
Parent: section

Rules:
- Fix syntax errors only
- Keep semantic structure
- Validate CSS properties
- No explanations
- Return only corrected HTML+inline CSS
```

### Costo Aproximado

Con el modelo `gemini-2.0-flash-lite`:
- ~500 tokens por validación
- Gratis hasta 15 requests/minuto
- Costo estimado: <$0.01 por 100 validaciones

---

## 📁 4. Análisis de Proyectos Completos

### Características

- **Carga de Directorios**: Analiza proyectos JS/HTML completos
- **Árbol de Archivos Visual**: Muestra estructura completa
- **Detección Automática**:
  - Framework usado (React, Vue, Angular, etc.)
  - Build tool (Vite, Webpack, etc.)
  - Directorios importantes (src, public, dist)
  - Archivos de configuración
- **Identificación de Entry Points**: Encuentra `index.html`, `main.js`, etc.
- **Importación Inteligente**: Carga automáticamente el HTML principal al canvas
- **Soporte Multi-formato**: `.html`, `.htm`, `.js`, `.jsx`, `.css`, `.scss`, `.json`

### Uso

1. **Clic en `📁 Analizar Directorio`** en la barra de herramientas
2. **Selecciona el directorio** del proyecto
3. **Espera el análisis** (1-3 segundos)
4. **Revisa el reporte**:
   - Información del proyecto
   - Estructura de archivos
   - Archivos HTML encontrados
5. **Clic en "Importar HTML Principal"** para cargar al canvas

### Información Detectada

```
📊 Análisis del Proyecto
- Nombre: mi-proyecto
- Archivos: 45
- Framework: react
- Build Tool: vite

📁 Estructura
├── src/
│   ├── components/
│   ├── App.jsx
│   └── main.js
├── public/
│   └── index.html
├── package.json
└── vite.config.js

📄 Archivos HTML
- public/index.html
```

### Límites

- **Tamaño máximo por archivo**: 500KB
- **Extensiones soportadas**: `.html`, `.htm`, `.js`, `.jsx`, `.css`, `.scss`, `.sass`, `.json`
- **Sin análisis de binarios**: Imágenes, videos, etc. son ignorados

### Módulo: `src/core/projectAnalyzer.js`

---

## 🎨 Mejoras en la UI

### Sistema de Drag & Drop

- Nuevo indicador de posición con gradiente animado
- Contenedores potenciales resaltados en verde
- Preview del elemento siendo arrastrado
- Cursor `grabbing` durante el arrastre

### Resize

- Handles circulares azules en bordes y esquinas
- Tooltip flotante con dimensiones actuales
- Animación hover en handles
- Indicador visual en esquina inferior derecha

### Validación Gemini

- Badge gradiente morado con ícono 💡
- Botones de "Aplicar" y "Descartar"
- Modal de configuración estilizado
- Estado visual (Habilitado/Deshabilitado)

---

## 🛠️ Configuración Inicial

### 1. Configurar Gemini API (Opcional)

```javascript
// Automático: Clic en botón "🔧 Gemini"
// O manual en consola:
window.geminiValidator.setApiKey('TU_API_KEY_AQUI');
```

### 2. Habilitar Funcionalidades

Todas las funcionalidades están habilitadas por defecto excepto Gemini (requiere API key).

---

## 📚 API Programática

### Resize Manager

```javascript
// Habilitar resize
window.resizeManager.enableResize(element);

// Deshabilitar resize
window.resizeManager.disableResize(element);

// Establecer dimensiones
window.resizeManager.setDimensions(element, 300, 200);

// Resetear dimensiones
window.resizeManager.resetDimensions(element);

// Ajustar al contenido
window.resizeManager.fitToContent(element);

// Escuchar eventos
window.addEventListener('resize:resizeend', (e) => {
    console.log('Nuevo tamaño:', e.detail.width, e.detail.height);
});
```

### Gemini Validator

```javascript
// Configurar API key
window.geminiValidator.setApiKey('API_KEY');

// Validar elemento
const result = await window.geminiValidator.validateElement(element);

// Aplicar corrección
window.geminiValidator.applyCorrection(element, result);

// Verificar estado
if (window.geminiValidator.isEnabled()) {
    // Gemini está configurado
}

// Remover API key
window.geminiValidator.removeApiKey();
```

### Enhanced Drag & Drop

```javascript
// Los eventos se manejan automáticamente
// Pero puedes escuchar eventos:

window.addEventListener('dragdrop:dragstart', (e) => {
    console.log('Drag iniciado:', e.detail);
});

window.addEventListener('dragdrop:drop', (e) => {
    console.log('Drop completado:', e.detail);
});
```

### Project Analyzer

```javascript
// Analizar directorio
const project = await window.projectAnalyzer.loadDirectory(fileList);

// Importar HTML
await window.projectAnalyzer.importHTMLFiles(project.mainFiles.html);

// Acceder a estructura
console.log(project.structure);
console.log(project.tree);
```

---

## 🔧 Troubleshooting

### Gemini no funciona

**Problema**: No se muestran sugerencias
**Solución**:
1. Verifica que configuraste la API key
2. Abre DevTools > Console para ver errores
3. Verifica que tienes cuota disponible en Google AI

### Resize no aparece

**Problema**: No veo los handles de resize
**Solución**:
1. Asegúrate de seleccionar el elemento primero
2. Verifica que `window.resizeManager` existe
3. Recarga la página

### Drag & Drop no funciona

**Problema**: No puedo reordenar elementos
**Solución**:
1. Selecciona el elemento antes de arrastrarlo
2. Usa el drag handle `⋮⋮` del lado izquierdo
3. Verifica que `window.enhancedDragDrop` existe

### Análisis de proyecto falla

**Problema**: Error al analizar directorio
**Solución**:
1. Verifica que el directorio contenga archivos soportados
2. Revisa que los archivos no excedan 500KB
3. Comprueba la consola para errores específicos

---

## 🎯 Próximas Mejoras

- [ ] Integración de Gemini para análisis completo de proyectos
- [ ] Sugerencias de mejoras de accesibilidad
- [ ] Detección de componentes reutilizables
- [ ] Export con optimizaciones sugeridas por IA
- [ ] Modo colaborativo en tiempo real

---

## 📄 Licencia

MIT License - Ver archivo LICENSE para más detalles

---

## 👨‍💻 Autor

**Sebastian Vernis**
- GitHub: [@SebastianVernis](https://github.com/SebastianVernis)

---

## 🙏 Agradecimientos

- Google Gemini AI por la API de validación
- Comunidad de desarrolladores por feedback y sugerencias
