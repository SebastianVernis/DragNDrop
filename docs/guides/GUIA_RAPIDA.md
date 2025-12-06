# 🚀 Guía Rápida - Editor HTML v3.0

## ✨ Nuevas Funcionalidades

### 1. 📐 Redimensionar Elementos

**Cómo usar:**
1. Haz clic en cualquier elemento del canvas
2. Aparecerán **8 handles** (puntos) alrededor del elemento
3. Arrastra cualquier handle para cambiar el tamaño
4. Mantén presionado **Shift** para mantener las proporciones
5. Presiona **Escape** para cancelar

**Consejo:** Verás un tooltip con las dimensiones actuales mientras redimensionas.

---

### 2. 🎯 Drag & Drop Mejorado

**Arrastrar nuevos componentes:**
- Simplemente arrastra desde el panel izquierdo al canvas
- Verás un **preview** del componente
- Una **línea azul** indica dónde se insertará

**Reordenar elementos existentes:**
1. Haz clic para seleccionar el elemento
2. Usa el icono **⋮⋮** que aparece a la izquierda
3. Arrastra a la nueva posición
4. Los contenedores compatibles se resaltan en verde

**Truco:** Arrastra cerca de los bordes para hacer scroll automático.

---

### 3. 🤖 Validación con IA (Gemini)

**Configuración inicial (solo una vez):**
1. Obtén tu API key gratuita: https://makersuite.google.com/app/apikey
2. Clic en botón **🔧 Gemini** en la barra superior
3. Pega tu API key y guarda

**Uso automático:**
- Al seleccionar elementos, Gemini valida la sintaxis
- Si hay errores, aparece un badge **💡 Mejora disponible**
- Clic en **"Aplicar"** para corregir
- Clic en **"×"** para ignorar

**Importante:** Gemini solo corrige errores sintácticos (typos, propiedades CSS inválidas, etc.), no modifica tu diseño.

---

### 4. 📁 Analizar Proyectos Completos

**Cargar un directorio entero:**
1. Clic en **📁 Analizar Directorio**
2. Selecciona la carpeta de tu proyecto
3. Espera el análisis (1-3 segundos)
4. Revisa el reporte con:
   - Framework detectado
   - Archivos encontrados
   - Estructura completa
5. Clic en **"Importar HTML Principal"** para cargar al editor

**Funciona con:** React, Vue, Angular, Next.js, proyectos vanilla JS/HTML, etc.

---

## 🎨 Atajos de Teclado

| Atajo | Acción |
|-------|--------|
| `Ctrl + S` | Guardar proyecto |
| `Ctrl + Z` | Deshacer |
| `Ctrl + Y` | Rehacer |
| `Delete` | Eliminar elemento seleccionado |
| `Shift + Drag` | Redimensionar manteniendo proporciones |
| `Escape` | Cancelar resize |

---

## 💡 Consejos Pro

### Resize
- **Handles de esquina** cambian ancho y alto simultáneamente
- **Handles de borde** solo cambian una dimensión
- Usa **Shift** para elementos cuadrados/circulares perfectos

### Drag & Drop
- El **drag handle ⋮⋮** solo aparece en elementos seleccionados
- Arrastra sobre otros elementos para anidarlos (si son contenedores)
- La **línea azul** indica exactamente dónde se insertará

### Gemini Validator
- Se ejecuta **automáticamente** al seleccionar elementos
- Espera 1.5 segundos después de editar antes de validar
- **Economiza tokens** usando un modelo optimizado
- Tu API key se guarda localmente en el navegador

### Project Analyzer
- Soporta proyectos de hasta **500KB por archivo**
- Detecta automáticamente framework y build tool
- Muestra **tamaño de archivos** en el árbol
- Encuentra archivos principales como `index.html`, `main.js`

---

## ⚠️ Solución de Problemas

### "No veo los handles de resize"
→ Asegúrate de **seleccionar** el elemento primero (clic en él)

### "No puedo reordenar elementos"
→ Debes **seleccionar** el elemento y usar el **drag handle ⋮⋮**

### "Gemini no funciona"
→ Verifica que configuraste tu **API key** en `🔧 Gemini`

### "El análisis de proyecto falla"
→ Asegúrate de que el directorio contiene archivos `.html`, `.js`, `.css`, etc.

---

## 📚 Más Información

- Ver documentación completa: `NUEVAS_FUNCIONALIDADES.md`
- Reportar bugs: GitHub Issues
- Obtener API key: https://makersuite.google.com/app/apikey

---

## 🎯 Flujo de Trabajo Sugerido

1. **Crea o importa** tu diseño
2. **Arrastra componentes** desde el panel izquierdo
3. **Reordena** elementos con drag & drop
4. **Redimensiona** para ajustar tamaños exactos
5. **Edita propiedades** en el panel derecho
6. **Gemini valida** automáticamente la sintaxis
7. **Exporta** tu HTML final

---

**¡Disfruta de las nuevas funcionalidades! 🚀**
