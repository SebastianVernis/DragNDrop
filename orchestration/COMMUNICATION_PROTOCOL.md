# 📡 Protocolo de Comunicación Inter-Agente

**Versión**: 1.0  
**Estado**: ACTIVO  

---

## 🔄 Flujo de Comunicación

```
ORCHESTRATOR
    ↓↑
[TASK_QUEUE] → [AGENT] → [REPORT]
    ↓↑           ↓↑        ↓↑
[LOCK_REGISTRY] [WORK] [STATUS]
```

---

## 📝 Formatos de Archivo

### 1. Asignación de Tarea (Orchestrator → Agent)

**Archivo**: `agents/{agent}/CURRENT.md`

```markdown
# Tarea Asignada: TASK-XXX

**De**: Orchestrator
**Para**: @agent
**Fecha**: ISO-8601
**Prioridad**: CRÍTICA|ALTA|MEDIA|BAJA

## Descripción
[Descripción de la tarea]

## Archivos Asignados
- /path/to/file1.js [WRITE]
- /path/to/file2.js [READ]
- /path/to/file3.js [EXCLUSIVE]

## Entregables
1. [Entregable 1]
2. [Entregable 2]

## Deadline
[Fecha y hora límite]
```

### 2. Reporte de Progreso (Agent → Orchestrator)

**Archivo**: `reports/agents/{agent}/PROGRESS_{timestamp}.md`

```markdown
# Reporte de Progreso

**De**: @agent
**Tarea**: TASK-XXX
**Timestamp**: ISO-8601
**Progreso**: XX%

## Completado
- [x] Item completado
- [x] Otro item

## En Progreso
- [ ] Item actual (50%)

## Bloqueadores
- Esperando archivo X de @otro_agent

## Archivos Modificados
- /path/to/file1.js [MODIFIED]
- /path/to/file2.js [CREATED]

## Próximos Pasos
[Qué sigue]

## ETA
[Tiempo estimado para completar]
```

### 3. Solicitud de Bloqueo (Agent → Lock Registry)

**Archivo**: `orchestration/locks/REQUEST_{timestamp}.md`

```markdown
# Solicitud de Bloqueo

**Agent**: @agent
**Timestamp**: ISO-8601
**Tarea**: TASK-XXX

## Archivos Solicitados
| Archivo | Tipo | Duración | Razón |
|---------|------|----------|-------|
| /src/file.js | EXCLUSIVE | 2h | Refactoring completo |
| /tests/test.js | WRITE | 1h | Actualizar tests |

## Urgencia
CRÍTICA - Bloquea progreso de tarea
```

### 4. Comunicación Agent-to-Agent

**Archivo**: `agents/{agent}/inbox/MSG_{from}_{timestamp}.md`

```markdown
# Mensaje Inter-Agente

**De**: @agent1
**Para**: @agent2
**Fecha**: ISO-8601
**Tipo**: REQUEST|INFO|ALERT
**Prioridad**: ALTA|MEDIA|BAJA

## Asunto
[Título del mensaje]

## Contexto
[Explicación de la situación]

## Solicitud/Información
[Detalles específicos]

## Archivos Relacionados
- /path/to/relevant/file.js

## Respuesta Esperada
[Qué necesitas del otro agente]
```

---

## 🚦 Estados de Agente

Los agentes deben actualizar su estado en `agents/{agent}/STATUS.md`:

```markdown
# Estado Actual: @agent

**Status**: IDLE|WORKING|BLOCKED|ERROR
**Última Actualización**: ISO-8601
**Tarea Actual**: TASK-XXX o NONE
**Capacidad**: XX% disponible

## Actividad
- [10:00] Iniciada TASK-001
- [10:30] Progreso 25%
- [11:00] Bloqueado por archivo X

## Salud
- CPU: OK
- Memoria: OK
- Tiempo Respuesta: <1s
```

---

## 📊 Registro de Actividad

Cada acción importante se registra en `logs/activity/YYYY-MM-DD.log`:

```
[2025-12-09T10:00:00Z] [ASSIGN] TASK-001 → @dev
[2025-12-09T10:05:00Z] [LOCK] /src/file.js → @dev (EXCLUSIVE)
[2025-12-09T10:30:00Z] [PROGRESS] @dev → TASK-001 (25%)
[2025-12-09T11:00:00Z] [COMPLETE] @dev → TASK-001
[2025-12-09T11:00:05Z] [RELEASE] /src/file.js ← @dev
```

---

## 🔐 Prioridades y Resolución de Conflictos

### Niveles de Prioridad
1. **CRÍTICA** - Bloquea release, máxima prioridad
2. **ALTA** - Importante, resolver en <24h
3. **MEDIA** - Normal, resolver en <1 semana
4. **BAJA** - Cuando sea posible

### Resolución de Conflictos
1. **Mismo archivo solicitado**:
   - Prioridad más alta gana
   - Si igual prioridad: FIFO
   - Si crítico: notificar orchestrator

2. **Agent no responde**:
   - Timeout 2h → WARNING
   - Timeout 4h → liberar locks
   - Timeout 6h → reasignar tarea

3. **Deadlock detectado**:
   - Orchestrator interviene
   - Analiza dependencias
   - Fuerza liberación por prioridad

---

## 📋 Checklist de Comunicación

### Al Iniciar Tarea
- [ ] Leer CURRENT.md
- [ ] Actualizar STATUS.md → WORKING
- [ ] Solicitar locks necesarios
- [ ] Confirmar archivos disponibles

### Durante el Trabajo
- [ ] Reportar progreso cada 2h
- [ ] Actualizar STATUS.md
- [ ] Comunicar bloqueos inmediatamente
- [ ] Responder mensajes en <30min

### Al Completar
- [ ] Generar reporte final
- [ ] Liberar TODOS los locks
- [ ] Actualizar STATUS.md → IDLE
- [ ] Mover archivos a completed/

---

## 🚨 Manejo de Errores

### Error en Tarea
```markdown
# ERROR REPORT
**Agent**: @agent
**Tarea**: TASK-XXX
**Tipo**: COMPILATION|TEST|RUNTIME|OTHER
**Severidad**: CRITICAL|HIGH|MEDIUM|LOW

## Descripción
[Qué salió mal]

## Stack Trace
```
[Error details]
```

## Archivos Afectados
[Lista de archivos]

## Acción Requerida
[Qué necesita hacerse]
```

---

## 📈 Métricas de Comunicación

- **Tiempo de respuesta**: <30min
- **Reportes a tiempo**: 100%
- **Mensajes sin responder**: 0
- **Conflictos resueltos**: <1h

---

**Protocolo efectivo desde**: 2025-12-09  
**Revisión programada**: 2025-12-16