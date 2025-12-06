# Guía de Usuario: Tema Oscuro

## Introducción

DragNDrop incluye un sistema completo de temas que te permite trabajar en modo claro u oscuro según tu preferencia. Esta guía te ayudará a aprovechar al máximo esta funcionalidad.

## Características

### 🌙 Modo Oscuro
- Fondo oscuro para reducir fatiga visual
- Colores optimizados para trabajo nocturno
- Contraste adecuado para legibilidad (WCAG AA compliant)
- Ideal para sesiones de trabajo prolongadas

### ☀️ Modo Claro
- Fondo claro tradicional
- Ideal para ambientes bien iluminados
- Colores vibrantes y nítidos
- Máxima claridad en condiciones de luz natural

## Cómo Cambiar el Tema

### Método 1: Botón en Toolbar
1. Busca el botón de tema en la toolbar superior (esquina derecha)
2. Verás "🌙 Oscuro" si estás en modo claro
3. O "☀️ Claro" si estás en modo oscuro
4. Haz click para cambiar instantáneamente

### Método 2: Keyboard Shortcut ⌨️
- **Windows/Linux:** Presiona `Ctrl + Shift + D`
- **Mac:** Presiona `Cmd + Shift + D`

Este atajo funciona en cualquier momento, sin importar dónde estés en la aplicación.

## Detección Automática

Al abrir DragNDrop por primera vez:

1. La aplicación detecta automáticamente la preferencia de tu sistema operativo
2. Si tu sistema está configurado en dark mode, DragNDrop iniciará en dark mode
3. Si tu sistema está en light mode, DragNDrop iniciará en light mode
4. Esta detección solo ocurre la primera vez; después se usa tu preferencia guardada

### Cómo funciona la detección

DragNDrop utiliza la API `prefers-color-scheme` del navegador para detectar:
- Configuración de tema del sistema operativo (Windows, macOS, Linux)
- Preferencias de accesibilidad
- Configuración de "modo nocturno" del sistema

## Persistencia

Tu preferencia de tema se guarda automáticamente:

- ✅ Se almacena en el navegador (localStorage)
- ✅ Se aplica automáticamente en futuras sesiones
- ✅ Persiste incluso después de cerrar el navegador
- ✅ No necesitas configurar nada manualmente
- ✅ Funciona de forma independiente en cada navegador

**Nota:** Si usas modo incógnito/privado, la preferencia no se guardará al cerrar la ventana.

## Transiciones Suaves

Los cambios de tema son visualmente agradables:

- **Animación de 0.3 segundos** entre temas
- **Transición fluida** de todos los colores
- **Sin parpadeos** molestos
- **Cambio instantáneo** de iconos y textos

## Notificaciones

Al cambiar el tema verás una notificación temporal:

- 🌙 "Tema oscuro activado" al cambiar a dark mode
- ☀️ "Tema claro activado" al cambiar a light mode

Estas notificaciones desaparecen automáticamente después de 3 segundos.

## Componentes Afectados

El tema oscuro se aplica a todos los componentes de la interfaz:

### ✅ Toolbar
- Fondo y bordes adaptados
- Botones con contraste adecuado
- Iconos claramente visibles

### ✅ Panel de Componentes
- Lista de componentes con fondo oscuro
- Categorías con separadores visibles
- Hover states optimizados

### ✅ Panel de Propiedades
- Formularios con inputs oscuros
- Labels y textos legibles
- Secciones claramente delimitadas

### ✅ Canvas de Edición
- **Nota:** El canvas mantiene fondo blanco para edición clara
- Esto es intencional para ver el diseño real de tu página

### ✅ Galería de Plantillas
- Cards con fondo oscuro
- Previews con buen contraste
- Botones de acción visibles

### ✅ Modales y Overlays
- Fondos semi-transparentes oscuros
- Contenido con contraste adecuado
- Botones de cierre visibles

## Solución de Problemas

### El tema no cambia

**Posibles causas y soluciones:**

1. **JavaScript deshabilitado**
   - Verifica que JavaScript esté habilitado en tu navegador
   - Configuración → Privacidad y seguridad → JavaScript

2. **Caché del navegador**
   - Recarga la página con `Ctrl+F5` (Windows/Linux)
   - O `Cmd+Shift+R` (Mac)
   - Limpia la caché del navegador si persiste

3. **Extensiones del navegador**
   - Algunas extensiones pueden interferir
   - Prueba en modo incógnito o desactiva extensiones temporalmente

### El tema no persiste entre sesiones

**Posibles causas y soluciones:**

1. **Cookies/localStorage deshabilitados**
   - Verifica que las cookies estén habilitadas
   - Configuración → Privacidad → Cookies y datos del sitio

2. **Modo incógnito/privado**
   - El modo privado no guarda datos al cerrar
   - Usa el navegador normal para persistencia

3. **Limpieza automática de datos**
   - Verifica configuración de limpieza automática
   - Agrega el sitio a excepciones si es necesario

### Los colores se ven mal o con poco contraste

**Posibles causas y soluciones:**

1. **Navegador desactualizado**
   - Actualiza tu navegador a la última versión
   - Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

2. **Configuración de accesibilidad**
   - Verifica configuración de contraste del sistema
   - Desactiva filtros de color si están activos

3. **Extensiones de tema**
   - Desactiva extensiones que modifiquen colores
   - Ejemplo: Dark Reader, Night Eye, etc.

### El atajo de teclado no funciona

**Posibles causas y soluciones:**

1. **Conflicto con otros atajos**
   - Verifica que `Ctrl+Shift+D` no esté usado por otra app
   - Cierra otras aplicaciones que puedan capturar el atajo

2. **Foco en elemento incorrecto**
   - Haz click en el canvas o toolbar primero
   - Asegúrate de que el foco esté en la aplicación

## Preguntas Frecuentes

### ¿Puedo personalizar los colores del tema oscuro?

No en la versión actual. Los colores están cuidadosamente optimizados para:
- Máxima legibilidad
- Contraste WCAG AA compliant
- Reducción de fatiga visual
- Consistencia en toda la aplicación

### ¿Afecta el rendimiento de la aplicación?

No. El cambio de tema es:
- Instantáneo (< 0.3 segundos)
- No afecta el rendimiento
- No consume recursos adicionales
- Optimizado con CSS variables

### ¿Funciona en todos los navegadores?

Sí, en todos los navegadores modernos:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Opera 76+

Navegadores más antiguos pueden no soportar todas las características.

### ¿Se sincroniza entre dispositivos?

No. La preferencia se guarda localmente en cada navegador:
- Cada dispositivo tiene su propia configuración
- Cada navegador guarda su preferencia independientemente
- Esto permite usar diferentes temas según el dispositivo

### ¿Puedo forzar un tema específico?

Sí, de dos formas:

1. **Manualmente:** Usa el botón o atajo de teclado
2. **Programáticamente:** Si modificas el código, puedes usar:
   ```javascript
   window.themeManager.setTheme('dark'); // o 'light'
   ```

### ¿El tema afecta las páginas que creo?

No. El tema solo afecta la interfaz del editor:
- Tus páginas mantienen sus propios estilos
- El canvas muestra tu diseño real
- La exportación no incluye el tema del editor

### ¿Hay un tema "automático" que cambie según la hora?

No directamente, pero:
- El tema detecta cambios en la preferencia del sistema
- Si tu sistema cambia automáticamente (día/noche), DragNDrop lo detectará
- Solo si no has configurado manualmente un tema

## Consejos y Mejores Prácticas

### 🌙 Cuándo usar Dark Mode

- Trabajo nocturno o en ambientes con poca luz
- Sesiones de trabajo prolongadas (reduce fatiga visual)
- Preferencia personal por interfaces oscuras
- Ahorro de batería en pantallas OLED

### ☀️ Cuándo usar Light Mode

- Trabajo diurno en ambientes bien iluminados
- Presentaciones o demostraciones
- Preferencia por interfaces tradicionales
- Máximo contraste en condiciones de luz natural

### ⚡ Atajos Rápidos

Memoriza estos atajos para máxima productividad:
- `Ctrl+Shift+D` - Toggle tema
- `Ctrl+Z` - Deshacer
- `Ctrl+Y` - Rehacer
- `Ctrl+S` - Guardar
- `Ctrl+Shift+P` - Paleta de comandos

### 🎨 Consistencia Visual

Para mejor experiencia:
- Usa el mismo tema en todas tus herramientas de desarrollo
- Configura tu editor de código con el mismo tema
- Ajusta el brillo de tu pantalla según el tema

## Soporte Técnico

Si tienes problemas con el tema oscuro:

1. **Revisa esta guía** - La mayoría de problemas están documentados
2. **Verifica la consola** - Abre DevTools (F12) y busca errores
3. **Prueba en otro navegador** - Descarta problemas del navegador
4. **Reporta el issue** - Si persiste, reporta en GitHub con:
   - Navegador y versión
   - Sistema operativo
   - Pasos para reproducir
   - Screenshots si es posible

## Recursos Adicionales

- [README Principal](../README.md) - Documentación general
- [CHANGELOG](../CHANGELOG.md) - Historial de cambios
- [BLACKBOX.md](../BLACKBOX.md) - Documentación técnica
- [Código fuente](../src/core/themeManager.js) - Implementación del ThemeManager

---

**Versión:** 2.1.0  
**Última actualización:** 29 de noviembre de 2025  
**Autor:** DragNDrop Team
