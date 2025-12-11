#!/bin/bash

# assign-task.sh - Asignar tarea a un agente
# Uso: ./assign-task.sh TASK-ID AGENT

TASK_ID=$1
AGENT=$2
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

if [ -z "$TASK_ID" ] || [ -z "$AGENT" ]; then
    echo "❌ Uso: ./assign-task.sh TASK-ID AGENT"
    echo "   Ejemplo: ./assign-task.sh TASK-001 @dev"
    exit 1
fi

# Verificar que el agente existe
if [ ! -d "agents/${AGENT#@}" ]; then
    echo "❌ Agente $AGENT no encontrado"
    exit 1
fi

# Verificar que la tarea existe en queue
TASK_FILE="tasks/queue/${TASK_ID}.md"
if [ ! -f "$TASK_FILE" ]; then
    echo "❌ Tarea $TASK_ID no encontrada en cola"
    exit 1
fi

# Mover tarea a active
mv "$TASK_FILE" "tasks/active/${TASK_ID}.md"

# Crear archivo CURRENT para el agente
cat > "agents/${AGENT#@}/CURRENT.md" << EOF
# Tarea Actual - $AGENT

**Task ID**: $TASK_ID  
**Asignada**: $TIMESTAMP  
**Estado**: 🔄 EN PROGRESO  

---

## Detalles de la Tarea

$(cat "tasks/active/${TASK_ID}.md")

---

## Progreso

- [ ] Iniciada
- [ ] 25% Completado
- [ ] 50% Completado
- [ ] 75% Completado
- [ ] Completada

---

## Archivos Bloqueados

Los siguientes archivos están bloqueados para esta tarea:

| Archivo | Tipo de Bloqueo | Desde |
|---------|-----------------|-------|
| (Se actualizará automáticamente) | - | - |

---

## Notas de Progreso

*El agente actualizará esta sección*

EOF

# Actualizar ORCHESTRATOR.md
# (En producción, esto sería más sofisticado)
echo "✅ Tarea $TASK_ID asignada a $AGENT"
echo "📋 Archivos actualizados:"
echo "   - tasks/active/${TASK_ID}.md"
echo "   - agents/${AGENT#@}/CURRENT.md"
echo ""
echo "⚡ El agente $AGENT puede comenzar a trabajar"

# Log de la asignación
echo "[$TIMESTAMP] Asignada $TASK_ID a $AGENT" >> logs/assignments.log