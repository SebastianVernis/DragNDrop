# 🎬 Demostración de Nuevas Características

## Guía Paso a Paso para Probar Todas las Funcionalidades

---

## 🚀 Inicio Rápido

### 1. Abrir la Aplicación
```
URL: http://localhost:3000/index.html
```

### 2. Aceptar Términos (Primera Vez)
- ✅ Aparecerá un modal de bienvenida
- ✅ Lee los términos y condiciones
- ✅ Marca el checkbox de aceptación
- ✅ Haz clic en "Aceptar y Continuar"

---

## 🎯 Demo 1: Resize Handles

### Objetivo
Redimensionar elementos visualmente con puntos de control

### Pasos
1. Selecciona una plantilla o crea un proyecto en blanco
2. Arrastra un componente al canvas (ej: "Card" o "Button")
3. Haz clic en el elemento para seleccionarlo
4. **Observa:** Aparecen 8 puntos azules alrededor del elemento
5. Arrastra cualquier punto para redimensionar
6. **Prueba:** Mantén Shift presionado mientras arrastras (mantiene proporciones)
7. **Observa:** Un tooltip muestra las dimensiones en tiempo real

### Resultado Esperado
- ✅ 8 handles visibles (4 esquinas + 4 lados)
- ✅ Redimensionamiento suave
- ✅ Tooltip con dimensiones
- ✅ Outline azul punteado alrededor del elemento
- ✅ Propiedades actualizadas en panel derecho

---

## 🎨 Demo 2: Formatting Toolbar

### Objetivo
Formatear texto con toolbar estilo Microsoft Office

### Pasos
1. Arrastra un componente de texto al canvas (ej: "H1" o "Paragraph")
2. Haz clic en el elemento de texto
3. **Observa:** Aparece un toolbar flotante cerca del elemento
4. **Prueba cada control:**
   - Cambia la fuente (ej: Roboto, Montserrat)
   - Cambia el tamaño (ej: 24px, 32px)
   - Haz clic en **B** (negrita)
   - Haz clic en **I** (cursiva)
   - Haz clic en **U** (subrayado)
   - Cambia el color del texto (haz clic en el cuadro de color)
   - Cambia el color de fondo
   - Cambia la alineación (izquierda, centro, derecha)
   - Usa los botones A+ y A- para ajustar tamaño

### Shortcuts de Teclado
- `Ctrl+B` → Negrita
- `Ctrl+I` → Cursiva
- `Ctrl+U` → Subrayado
- `Escape` → Ocultar toolbar

### Resultado Esperado
- ✅ Toolbar flotante visible
- ✅ Cambios aplicados instantáneamente
- ✅ Botones activos muestran estado (azul)
- ✅ Color pickers funcionan
- ✅ Shortcuts de teclado responden

---

## 📐 Demo 3: Canvas Types

### Objetivo
Cambiar el tipo de canvas y usar guías de alineación

### Pasos
1. Haz clic en el menú **Vista** en el toolbar
2. **Prueba cada tipo de canvas:**
   - Selecciona "Canvas Blanco" → Fondo limpio
   - Selecciona "Canvas Grid" → Cuadrícula de líneas
   - Selecciona "Canvas Dots" → Patrón de puntos
   - Selecciona "Canvas Guías" → Grid con líneas principales
3. **Activa las reglas:**
   - Selecciona "Mostrar Reglas"
   - **Observa:** Reglas horizontales y verticales con medidas
4. **Activa snap-to-grid:**
   - Selecciona "Ajustar a Grid"
   - Arrastra un elemento
   - **Observa:** Se ajusta automáticamente a la cuadrícula

### Resultado Esperado
- ✅ Canvas cambia de fondo según selección
- ✅ Reglas visibles con marcas cada 50px
- ✅ Etiquetas de medida cada 100px
- ✅ Snap-to-grid funciona al arrastrar elementos
- ✅ Checkmark (✓) en opción activa

---

## 👁️ Demo 4: Panel Toggle y Modo Zen

### Objetivo
Ocultar/mostrar paneles para maximizar espacio de trabajo

### Pasos
1. **Toggle Panel de Componentes:**
   - Menú Vista → "Panel de Componentes"
   - **Observa:** Panel izquierdo se oculta con animación
   - Vuelve a hacer clic para mostrarlo

2. **Toggle Panel de Propiedades:**
   - Menú Vista → "Panel de Propiedades"
   - **Observa:** Panel derecho se oculta con animación
   - Vuelve a hacer clic para mostrarlo

3. **Modo Zen:**
   - Presiona `F11` o Menú Vista → "Modo Zen"
   - **Observa:** Todos los paneles y toolbar se ocultan
   - Aparece un indicador flotante "Modo Zen Activado"
   - Presiona `F11` nuevamente para salir

### Shortcuts de Teclado
- `F11` → Toggle Modo Zen
- `Ctrl+B` → Toggle panel de componentes
- `Ctrl+P` → Toggle panel de propiedades

### Resultado Esperado
- ✅ Paneles se ocultan/muestran con animación suave
- ✅ Canvas se expande para ocupar espacio disponible
- ✅ Modo Zen oculta todo excepto el canvas
- ✅ Indicador flotante en Modo Zen
- ✅ Estados se restauran al salir de Modo Zen

---

## 🔄 Demo 5: Git Auto-Save

### Objetivo
Configurar autoguardado automático en GitHub

### Requisitos Previos
- Cuenta de GitHub
- Repositorio creado en GitHub
- Personal Access Token con permisos `repo`

### Pasos

#### Crear Personal Access Token
1. Ve a GitHub → Settings → Developer settings
2. Personal access tokens → Tokens (classic)
3. Generate new token (classic)
4. Nombre: "DragNDrop Editor"
5. Permisos: Marca `repo` (Full control of private repositories)
6. Generate token
7. **Copia el token** (solo se muestra una vez)

#### Configurar en la Aplicación
1. Menú Archivo → "Configurar Git Auto-Save"
2. **Completa el formulario:**
   - Personal Access Token: `ghp_xxxxxxxxxxxx`
   - Usuario/Organización: `tu-usuario`
   - Nombre del Repositorio: `mi-proyecto`
   - Branch: `main`
   - Intervalo: `2` minutos
3. Haz clic en "Probar Conexión"
4. **Observa:** Mensaje "✅ Conexión exitosa!"
5. Marca el checkbox "Activar Auto-Save con Git"
6. Haz clic en "Guardar Configuración"

#### Probar Autoguardado
1. Haz cambios en el canvas (agrega/modifica elementos)
2. Espera 2 minutos
3. **Observa:** Toast notification "✅ Guardado en Git exitoso"
4. Ve a tu repositorio en GitHub
5. **Verifica:** Nuevo commit con mensaje "Auto-save - [fecha]"

#### Commit Manual
1. Menú Archivo → "Commit Manual a Git"
2. Ingresa un mensaje personalizado
3. Haz clic en OK
4. **Observa:** Toast notification de éxito
5. Verifica en GitHub

### Resultado Esperado
- ✅ Conexión exitosa con GitHub
- ✅ Autoguardado cada 2 minutos
- ✅ Commits visibles en GitHub
- ✅ Archivo `project.json` en el repositorio
- ✅ Mensajes de estado claros

---

## 📜 Demo 6: Políticas Legales

### Objetivo
Revisar términos y condiciones y política de privacidad

### Pasos

#### Modal Inicial (Primera Vez)
1. Abre la aplicación en modo incógnito o borra localStorage
2. **Observa:** Modal de bienvenida aparece automáticamente
3. Haz clic en "Términos y Condiciones" → Se abre en nueva pestaña
4. Haz clic en "Política de Privacidad" → Se abre en nueva pestaña
5. Marca el checkbox de aceptación
6. Haz clic en "Aceptar y Continuar"
7. **Observa:** Modal se cierra con animación
8. **Observa:** Toast de bienvenida aparece

#### Rechazar Términos
1. Abre en modo incógnito nuevamente
2. Haz clic en "Rechazar"
3. **Observa:** Confirmación de salida
4. Confirma
5. **Observa:** Página de "Términos no aceptados"
6. Haz clic en "Volver a intentar"

#### Acceso Posterior
1. Busca enlaces en el footer de la aplicación
2. Haz clic en "Términos y Condiciones"
3. Haz clic en "Política de Privacidad"
4. **Observa:** Páginas HTML completas y profesionales

### Resultado Esperado
- ✅ Modal aparece solo en primer uso
- ✅ No se puede usar la app sin aceptar
- ✅ Enlaces funcionan correctamente
- ✅ Páginas legales completas y en español
- ✅ Diseño profesional y responsive

---

## 🎯 Demo 7: Panel de Propiedades Reorganizado

### Objetivo
Explorar el nuevo layout vertical del panel de propiedades

### Pasos
1. Selecciona cualquier elemento en el canvas
2. **Observa el panel derecho:**
   - Layout en columna vertical
   - Secciones claramente separadas
   - Scroll independiente
3. **Explora las secciones:**
   - General (ID, clases)
   - Dimensiones (width, height)
   - Espaciado (padding, margin)
   - Tipografía (fuente, tamaño, color)
   - Fondo y Bordes
   - Efectos
4. **Prueba colapsar secciones:**
   - Haz clic en el header de una sección
   - **Observa:** Contenido se oculta con animación
   - Haz clic nuevamente para expandir

### Resultado Esperado
- ✅ Layout vertical claro
- ✅ Secciones colapsables
- ✅ Scroll suave
- ✅ Inputs bien espaciados
- ✅ Separadores visuales entre secciones

---

## 🎹 Demo 8: Shortcuts de Teclado

### Objetivo
Probar todos los atajos de teclado disponibles

### Lista de Shortcuts

#### Generales
- `Escape` → Ocultar handles y toolbar
- `Delete` → Eliminar elemento seleccionado
- `F11` → Toggle Modo Zen

#### Paneles
- `Ctrl+B` → Toggle panel de componentes
- `Ctrl+P` → Toggle panel de propiedades

#### Formato de Texto
- `Ctrl+B` → Negrita
- `Ctrl+I` → Cursiva
- `Ctrl+U` → Subrayado

#### Redimensionamiento
- `Shift + Drag` → Mantener proporciones

### Pasos de Prueba
1. Selecciona un elemento
2. Presiona cada shortcut
3. **Verifica:** Acción correspondiente se ejecuta
4. **Observa:** Feedback visual inmediato

### Resultado Esperado
- ✅ Todos los shortcuts responden
- ✅ Feedback visual claro
- ✅ Sin conflictos entre shortcuts
- ✅ Funciona en todos los navegadores

---

## 📊 Checklist de Validación

### Resize Handles
- [ ] 8 handles visibles al seleccionar elemento
- [ ] Redimensionamiento suave en todas direcciones
- [ ] Tooltip muestra dimensiones
- [ ] Shift mantiene proporciones
- [ ] Propiedades se actualizan

### Formatting Toolbar
- [ ] Aparece al seleccionar texto
- [ ] Selector de fuentes funciona
- [ ] Selector de tamaño funciona
- [ ] Botones de formato funcionan
- [ ] Color pickers funcionan
- [ ] Alineación funciona
- [ ] Shortcuts de teclado funcionan

### Canvas Types
- [ ] 4 tipos de canvas disponibles
- [ ] Cambio de canvas funciona
- [ ] Reglas se muestran/ocultan
- [ ] Snap-to-grid funciona
- [ ] Marcas de medida visibles

### Panel Toggle
- [ ] Panel izquierdo se oculta/muestra
- [ ] Panel derecho se oculta/muestra
- [ ] Modo Zen funciona
- [ ] Animaciones suaves
- [ ] Estados se guardan

### Git Auto-Save
- [ ] Configuración se guarda
- [ ] Prueba de conexión funciona
- [ ] Autoguardado cada 2 minutos
- [ ] Commit manual funciona
- [ ] Commits visibles en GitHub

### Políticas Legales
- [ ] Modal aparece en primer uso
- [ ] No se puede usar sin aceptar
- [ ] Enlaces funcionan
- [ ] Páginas completas y en español
- [ ] Diseño profesional

### Panel de Propiedades
- [ ] Layout vertical
- [ ] Secciones colapsables
- [ ] Scroll independiente
- [ ] Inputs bien espaciados

### Shortcuts de Teclado
- [ ] Escape funciona
- [ ] Delete funciona
- [ ] F11 funciona
- [ ] Ctrl+B funciona
- [ ] Ctrl+P funciona
- [ ] Ctrl+I funciona
- [ ] Ctrl+U funciona
- [ ] Shift+Drag funciona

---

## 🐛 Problemas Conocidos y Soluciones

### Problema: Toolbar no aparece
**Solución:** Asegúrate de seleccionar un elemento de texto (H1, H2, P, etc.)

### Problema: Handles no se muestran
**Solución:** Verifica que el elemento tenga la clase `canvas-element`

### Problema: Git no guarda
**Solución:** 
1. Verifica el token
2. Verifica permisos `repo`
3. Prueba la conexión
4. Verifica que el repo exista

### Problema: Modo Zen no se activa
**Solución:** Cierra cualquier modal abierto primero

---

## 📹 Grabación de Demo

### Sugerencias para Video
1. **Intro (30s):** Mostrar aplicación y nuevas características
2. **Resize Handles (1min):** Demostrar redimensionamiento
3. **Formatting Toolbar (1min):** Cambiar fuentes y colores
4. **Canvas Types (1min):** Mostrar diferentes tipos de canvas
5. **Panel Toggle (1min):** Demostrar Modo Zen
6. **Git Integration (2min):** Configurar y probar autoguardado
7. **Legal Pages (30s):** Mostrar modal y páginas
8. **Shortcuts (1min):** Demostrar atajos de teclado
9. **Outro (30s):** Resumen y llamado a la acción

**Duración total:** ~8 minutos

---

## 🎉 Conclusión

Has completado la demostración de todas las nuevas características. El editor ahora es una herramienta profesional comparable a software comercial.

**Próximos pasos:**
1. Explora las características en profundidad
2. Crea proyectos reales
3. Configura Git para respaldos automáticos
4. Comparte feedback y sugerencias

**¡Disfruta creando páginas web increíbles! 🚀**
