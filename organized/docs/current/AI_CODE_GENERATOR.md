# 🤖 AI Code Generator - Documentación

## Descripción

Sistema de generación de código asistido por IA que traduce descripciones en lenguaje natural y diseños visuales a código HTML/CSS/JavaScript limpio y production-ready.

## 🎯 Características

### Generación de Componentes
- Crea componentes desde descripción textual
- Genera HTML semántico y accesible
- CSS inline o separado
- JavaScript vanilla si es necesario

### Conversión Visual a Código
- Analiza screenshots/imágenes
- Replica diseños existentes
- Extrae colores y estilos
- Genera código equivalente

### Optimización de Código
- Mejora código existente
- Optimiza performance
- Corrige errores de sintaxis
- Sugiere mejoras de accesibilidad

### Variaciones
- Genera múltiples variaciones de componentes
- Diferentes estilos (elegante, moderno, minimalista)
- Mantiene funcionalidad

---

## 🔧 Configuración

### 1. Obtener API Key

Visita: https://www.blackbox.ai/api

### 2. Configurar en el Editor

```javascript
// Opción 1: Via UI
// Click en "⚙️ AI Config" en toolbar
// Ingresar API key
// Seleccionar modelo
// Guardar

// Opción 2: Via código
window.aiCodeGenerator.saveApiKey('sk-your-api-key');
window.aiCodeGenerator.model = 'blackbox'; // o 'claude-3-sonnet'
```

### 3. Verificar Configuración

```javascript
const status = window.aiCodeGenerator.getStatus();
console.log(status);
// { configured: true, model: 'blackbox', hasApiKey: true }
```

---

## 📖 Uso

### Generar Componente desde Descripción

#### Via UI
```
1. Click en "🤖 AI Generate" en toolbar
2. Describir el componente
3. Seleccionar tipo
4. Click "Generar"
5. Revisar código generado
6. Click "Insertar en Canvas"
```

#### Via API
```javascript
// Generar componente
const component = await window.aiCodeGenerator.generateComponent(
    'Un navbar moderno con logo, menú de navegación y botón CTA',
    'navbar'
);

console.log(component.html);
// <nav style="...">...</nav>
```

### Generar Página Completa

```javascript
const page = await window.aiCodeGenerator.generateFullPage(
    'Landing page para producto SaaS de gestión de proyectos',
    'saas'
);

console.log(page.html); // HTML completo
console.log(page.css);  // CSS si está separado
```

### Mejorar Código Existente

```javascript
const element = document.getElementById('element-123');
const improved = await window.aiCodeGenerator.modifyElement(
    element,
    'Hacer más moderno y agregar sombra sutil'
);

console.log(improved.html);
```

### Convertir Canvas a Código Limpio

```javascript
// Convierte el canvas actual a código production-ready
const clean = await window.aiCodeGenerator.canvasToCode();

console.log(clean.html);        // HTML limpio
console.log(clean.css);         // CSS extraído
console.log(clean.screenshot);  // Screenshot para referencia
```

### Generar Variaciones

```javascript
const element = document.getElementById('element-123');
const variations = await window.aiCodeGenerator.generateVariations(element, 3);

variations.forEach((variation, index) => {
    console.log(`Variación ${index + 1}:`, variation.html);
});
```

### Sugerencias de Mejora

```javascript
const code = '<div>Mi código</div>';
const suggestions = await window.aiCodeGenerator.suggestImprovements(code);

suggestions.forEach(s => {
    console.log(`${s.improvement} - ${s.reason} [${s.priority}]`);
});
```

---

## 🎨 Casos de Uso

### Caso 1: Prototipado Rápido

```javascript
// Generar landing page completa en segundos
const landing = await window.aiCodeGenerator.generateFullPage(
    'Landing page para app de fitness con sección hero, features, testimonials y pricing',
    'landing'
);

// Insertar en canvas
document.getElementById('canvas').innerHTML = landing.html;
```

### Caso 2: Explorar Diseños

```javascript
// Crear componente base
const base = await window.aiCodeGenerator.generateComponent(
    'Card de producto con imagen, título, precio y botón',
    'card'
);

// Generar 5 variaciones
const variations = await window.aiCodeGenerator.generateVariations(
    base.html,
    5
);

// Probar diferentes estilos
```

### Caso 3: Mejorar Accesibilidad

```javascript
const canvas = document.getElementById('canvas');
const code = canvas.innerHTML;

const suggestions = await window.aiCodeGenerator.suggestImprovements(code);

// Revisar sugerencias de accesibilidad
const a11y = suggestions.filter(s => s.improvement.includes('accesibilidad'));
```

### Caso 4: Responsive Design

```javascript
// Generar versión responsive de componente existente
const element = document.getElementById('element-123');
const responsive = await window.aiCodeGenerator.modifyElement(
    element,
    'Hacer completamente responsive usando CSS Grid, mobile-first approach'
);
```

---

## 🔌 API Reference

### Constructor

```javascript
const generator = new AICodeGenerator();
```

### Métodos Principales

#### `generateComponent(description, type)`
Genera componente desde descripción.

**Parámetros:**
- `description` (string) - Descripción en lenguaje natural
- `type` (string) - Tipo: 'navbar', 'hero', 'card', 'footer', etc.

**Retorna:** `Promise<Object>`
```javascript
{
    type: 'navbar',
    html: '<nav>...</nav>',
    description: '...',
    generated: '2025-11-29T...'
}
```

#### `generateFullPage(description, pageType)`
Genera página completa.

**Parámetros:**
- `description` (string) - Descripción de la página
- `pageType` (string) - 'landing', 'blog', 'portfolio', 'ecommerce', 'saas'

**Retorna:** `Promise<Object>`
```javascript
{
    html: '<!DOCTYPE html>...',
    css: '...',
    js: '...',
    raw: '...'
}
```

#### `improveCode(code, instruction)`
Mejora código existente.

**Parámetros:**
- `code` (string) - Código HTML/CSS actual
- `instruction` (string) - Instrucción de mejora

**Retorna:** `Promise<Object>`

#### `canvasToCode()`
Convierte canvas actual a código limpio.

**Retorna:** `Promise<Object>`
```javascript
{
    html: '...',
    css: '...',
    screenshot: 'data:image/png;base64,...',
    original: '...'
}
```

#### `generateVariations(element, count)`
Genera variaciones de un componente.

**Parámetros:**
- `element` (HTMLElement|string) - Elemento o HTML
- `count` (number) - Número de variaciones (default: 3)

**Retorna:** `Promise<Array<Object>>`

#### `suggestImprovements(code)`
Analiza código y sugiere mejoras.

**Parámetros:**
- `code` (string) - Código a analizar

**Retorna:** `Promise<Array<Object>>`
```javascript
[
    {
        improvement: 'Agregar alt text a imágenes',
        reason: 'Mejora accesibilidad',
        priority: 'Alta'
    },
    ...
]
```

---

## ⚙️ Configuración Avanzada

### Cambiar Modelo

```javascript
// Blackbox (rápido, gratis)
window.aiCodeGenerator.model = 'blackbox';

// Claude 3 Sonnet (más preciso)
window.aiCodeGenerator.model = 'claude-3-sonnet';

// GPT-4 (más potente)
window.aiCodeGenerator.model = 'gpt-4';
```

### Ajustar Parámetros

```javascript
// Más creatividad
window.aiCodeGenerator.temperature = 0.9;

// Más consistencia
window.aiCodeGenerator.temperature = 0.3;

// Más tokens (respuestas más largas)
window.aiCodeGenerator.maxTokens = 8000;
```

### Endpoint Personalizado

```javascript
// Usar endpoint diferente (ej: proxy propio)
window.aiCodeGenerator.endpoint = 'https://mi-proxy.com/api/generate';
```

---

## 🚀 Prompts Optimizados

### Para Componentes

**Navbar:**
```
"Navbar moderno con logo a la izquierda, menú centrado (Inicio, Servicios, Contacto), 
y botón CTA a la derecha. Color azul oscuro, altura 80px, sticky al scroll"
```

**Hero:**
```
"Hero section con gradiente de azul a morado, título grande blanco, subtítulo, 
dos botones (primario y secundario), imagen de producto a la derecha. 
Altura mínima 600px, centrado verticalmente"
```

**Card:**
```
"Card de producto con imagen arriba (300x200), título, descripción corta, 
precio grande en rojo, botón 'Añadir al carrito'. Borde sutil, sombra al hover, 
ancho 350px"
```

### Para Páginas

**Landing SaaS:**
```
"Landing page para SaaS de email marketing. Hero con animación, 
sección de features (6 items con iconos), pricing (3 planes), 
testimonials, FAQ accordion, footer completo. Colores: azul y blanco"
```

**Portfolio:**
```
"Portfolio de diseñador. Hero con nombre y foto circular, 
grid de proyectos 3 columnas con hover effects, sección about me, 
skills con progress bars, formulario de contacto, footer con redes sociales"
```

---

## 🎯 Best Practices

### Descripciones Efectivas

**✅ Buena descripción:**
```
"Navbar con logo 'MiApp' a la izquierda, 4 links de navegación centrados, 
botón 'Sign Up' azul a la derecha, background blanco, height 70px, 
sombra sutil abajo, sticky"
```

**❌ Descripción vaga:**
```
"Un navbar bonito"
```

### Ser Específico

Incluir:
- **Colores** específicos
- **Tamaños** aproximados
- **Posicionamiento** de elementos
- **Estilos** deseados (moderno, minimalista, etc)
- **Funcionalidad** si aplica

### Iterar

```javascript
// 1. Generar base
const v1 = await generate('Navbar moderno');

// 2. Refinar
const v2 = await improve(v1, 'Hacer más minimalista');

// 3. Ajustar detalles
const v3 = await improve(v2, 'Agregar sombra sutil');
```

---

## 🔒 Seguridad

### API Key Storage

- ✅ Guardada en localStorage (solo client-side)
- ✅ No enviada al servidor
- ✅ Input type="password" en UI
- ⚠️ Usuario responsable de su key

### Validación de Código

El código generado debe:
- ✅ Revisarse antes de usar en producción
- ✅ Testearse para XSS
- ✅ Validarse HTML
- ✅ Verificarse accesibilidad

---

## 📊 Límites y Consideraciones

### Rate Limits
- Depende del plan de Blackbox AI
- Free tier: ~100 requests/día
- Pro: unlimited

### Tamaño de Respuesta
- Max tokens: 4000 (default)
- Páginas muy complejas: dividir en componentes

### Calidad
- Generalmente buena pero revisar siempre
- Puede requerir ajustes manuales
- Mejor para prototipos que código final crítico

---

## 🎓 Ejemplos Completos

### Ejemplo 1: Hero Section con AI

```javascript
const hero = await window.aiCodeGenerator.generateComponent(
    `Hero section con:
    - Gradiente azul a morado de fondo
    - Título: "Gestiona tus proyectos con IA"
    - Subtítulo: "La herramienta que necesitas"
    - Botón "Comenzar Gratis" (azul) y "Ver Demo" (outline)
    - Imagen de dashboard a la derecha
    - Altura 600px, centrado vertical`,
    'hero'
);

// Insertar en canvas
const temp = document.createElement('div');
temp.innerHTML = hero.html;
document.getElementById('canvas').appendChild(temp.firstElementChild);
```

### Ejemplo 2: Optimizar Canvas

```javascript
// Usuario ha creado diseño en canvas
// AI lo optimiza para producción

const optimized = await window.aiCodeGenerator.canvasToCode();

// Descargar código optimizado
const blob = new Blob([optimized.html], { type: 'text/html' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'optimized.html';
a.click();
```

### Ejemplo 3: Explorar Diseños

```javascript
// Generar 5 variaciones de un card
const baseCard = document.getElementById('element-123');
const variations = await window.aiCodeGenerator.generateVariations(baseCard, 5);

// Mostrar cada variación para que usuario elija
variations.forEach((v, i) => {
    console.log(`Variación ${i + 1}:`, v.html);
});
```

---

## 🚀 Roadmap

### v2.1 (Próximo)
- [ ] Integración con Claude 3
- [ ] Generación desde Figma URL
- [ ] History de generaciones
- [ ] Favoritos

### v2.2 (Futuro)
- [ ] Fine-tuning con estilo del proyecto
- [ ] Generación de tests automáticos
- [ ] Export a frameworks (React, Vue)
- [ ] Batch generation

---

## 📞 Soporte

**Issues:** https://github.com/SebastianVernis/DragNDrop/issues
**Docs:** /docs/AI_CODE_GENERATOR.md
**API Blackbox:** https://www.blackbox.ai/docs

---

*Última actualización: 29 de Noviembre, 2025*
*Versión: 1.0.0*
*Modelo por defecto: Blackbox AI*
