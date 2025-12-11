# 👨‍💻 Configuración del Agente @dev

**Rol**: Desarrollador Principal  
**Estado**: 🟢 DISPONIBLE  
**Capacidad**: 8h/día  

---

## 🎯 Especializaciones

- ✅ Frontend (HTML, CSS, JavaScript)
- ✅ Componentes UI/UX
- ✅ Arquitectura modular
- ✅ Integraciones API
- ✅ Performance optimization
- ❌ Backend (limitado)
- ❌ Testing (básico)

---

## 🛠️ Herramientas Preferidas

- VSCode
- Chrome DevTools
- Git
- npm/yarn
- Webpack/Vite

---

## 📊 Límites y Restricciones

- **Archivos simultáneos**: Máx 10
- **Tamaño de tarea**: Máx 3 días
- **Horario**: 09:00-18:00 UTC
- **No tocar**: 
  - `/tests/*` (excepto integración)
  - `/.github/workflows/*` (sin permisos)
  - `/backend/*` (coordinación requerida)

---

## 📡 Protocolo de Comunicación

### Reportes
- Cada 2 horas: Progress update
- Al completar: Full report
- Si bloqueado: Immediate notification

### Formato de Reporte
```markdown
## Progress Report - @dev
Date: [ISO timestamp]
Task: [TASK-ID]
Progress: [0-100]%
Blockers: [Any issues]
Next: [Next steps]
Files Modified: [List]
```

---

## 📁 Directorios de Trabajo

```
orchestration/agents/dev/
├── CONFIG.md (este archivo)
├── CURRENT.md (tarea actual)
├── HISTORY.md (tareas completadas)
├── inbox/ (mensajes entrantes)
├── outbox/ (mensajes salientes)
└── workspace/ (archivos temporales)
```

---

## 🎯 Prioridades de Asignación

1. Features UI/UX
2. Landing pages
3. Componentes nuevos
4. Refactoring frontend
5. Optimización
6. Documentación técnica
7. Bug fixes visuales

---

**Última actualización**: 2025-12-09T10:00:00Z