# 🚀 Getting Started - DragNDrop Editor v3.0

## Instalación Rápida

### 1. Clonar el Repositorio
```bash
git clone <repository-url>
cd DragNDrop
```

### 2. Instalar Dependencias
```bash
# Frontend principal
npm install

# Frontend TypeScript (opcional)
cd frontend && npm install && cd ..

# Backend Node.js (opcional)
cd backend-node && npm install && cd ..

# Backend Python (opcional)
cd backend && pip install -r requirements.txt && cd ..
```

### 3. Configurar Variables de Entorno
```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar y configurar:
# - GEMINI_API_KEY (para validación de sintaxis)
# - Otras variables según necesites
```

### 4. Iniciar el Proyecto
```bash
# Modo desarrollo (puerto 8080)
npm run dev

# O abrir directamente index.html en el navegador
```

## Primeros Pasos

### 1. Interfaz Básica
- Abre `http://localhost:8080` en tu navegador
- Verás el canvas principal y la barra de herramientas
- Usa el botón "Load HTML" para cargar archivos

### 2. Cargar un Proyecto
Dos opciones:

**a) Cargar archivo HTML individual:**
```javascript
// Click en "Load HTML" y selecciona un archivo .html
```

**b) Cargar proyecto completo:**
```javascript
// Usa el Project Analyzer (botón en toolbar)
// Selecciona una carpeta completa
```

### 3. Modo de Edición

**Posicionamiento Libre:**
- Arrastra elementos con el mouse
- Posicionamiento absoluto con coordenadas XY
- Canvas se ajusta automáticamente

**Redimensionamiento:**
- Selecciona un elemento
- Aparecen 8 manejadores de redimensión
- Shift para mantener proporciones

**Deshacer/Rehacer:**
- Ctrl+Z / Ctrl+Y
- O botones en la barra de herramientas
- Historial de 50 estados

### 4. Funciones AI

**Validación de Sintaxis (Gemini):**
```javascript
// Automática al detectar errores
// Requiere GEMINI_API_KEY configurada
```

**Generación de Código:**
```javascript
// Click en "AI Tools" > "Generate Code"
// Describe lo que necesitas
```

### 5. Exportar

**HTML:**
```javascript
// File > Export HTML
// Descarga el código generado
```

**Proyecto Completo:**
```javascript
// File > Export Project
// Incluye HTML, CSS, JS
```

## Atajos de Teclado

| Atajo | Acción |
|-------|--------|
| `Ctrl+Z` | Deshacer |
| `Ctrl+Y` | Rehacer |
| `Ctrl+S` | Guardar |
| `Ctrl+O` | Abrir |
| `Ctrl+E` | Exportar |
| `Ctrl+K` | Command Palette |
| `Ctrl+P` | Preview |
| `Ctrl+D` | Toggle Dark Mode |
| `Del` | Eliminar elemento |
| `Esc` | Cancelar acción |

## Testing

### Unit Tests
```bash
npm run test
```

### E2E Tests
```bash
npm run test:e2e
```

### Coverage
```bash
npm run test:coverage
```

## Próximos Pasos

1. **Lee las guías detalladas:**
   - [guides/GUIA_RAPIDA.md](./guides/GUIA_RAPIDA.md) - Guía en español
   - [guides/NUEVAS_FUNCIONALIDADES.md](./guides/NUEVAS_FUNCIONALIDADES.md) - Nuevas características

2. **Explora las funcionalidades:**
   - [FREE_POSITION_SYSTEM.md](./FREE_POSITION_SYSTEM.md) - Posicionamiento libre
   - [TOOLBAR_DROPDOWN_SYSTEM.md](./TOOLBAR_DROPDOWN_SYSTEM.md) - Sistema de menús
   - [USER_GUIDE_THEME.md](./USER_GUIDE_THEME.md) - Temas

3. **Si vas a desarrollar:**
   - Lee [../AGENTS.md](../AGENTS.md) para comandos de desarrollo
   - Revisa [architecture/TECHNICAL_SPECS.md](./architecture/TECHNICAL_SPECS.md)
   - Consulta los [workflows/](./workflows/) según la funcionalidad

## Solución de Problemas

### El servidor no inicia
```bash
# Verifica el puerto 8080 esté libre
lsof -i :8080
# Mata el proceso si es necesario
kill -9 <PID>
```

### Errores de dependencias
```bash
# Limpia e reinstala
rm -rf node_modules package-lock.json
npm install
```

### API Keys no funcionan
```bash
# Verifica el archivo .env
cat .env
# Asegúrate de que las keys estén sin comillas
GEMINI_API_KEY=tu_key_aqui
```

## Soporte

- **Documentación**: [README.md](./README.md)
- **Issues**: Ver GitHub Issues
- **Changelog**: [../CHANGELOG.md](../CHANGELOG.md)

---

¡Listo para empezar! 🎉
