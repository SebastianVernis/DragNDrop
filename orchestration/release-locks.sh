#!/bin/bash

# release-locks.sh - Liberar bloqueos de archivos de un agente
# Uso: ./release-locks.sh AGENT [TASK-ID]

AGENT=$1
TASK_ID=$2
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

if [ -z "$AGENT" ]; then
    echo "❌ Uso: ./release-locks.sh AGENT [TASK-ID]"
    echo "   Ejemplo: ./release-locks.sh @dev TASK-001"
    exit 1
fi

echo "🔓 Liberando bloqueos del agente $AGENT..."

# En producción, esto actualizaría LOCK_REGISTRY.md
# Por ahora, solo simulamos la operación

if [ -n "$TASK_ID" ]; then
    echo "✅ Bloqueos liberados para tarea $TASK_ID"
else
    echo "✅ Todos los bloqueos de $AGENT liberados"
fi

# Log
echo "[$TIMESTAMP] Liberados bloqueos de $AGENT ${TASK_ID:+para $TASK_ID}" >> logs/locks.log

# Notificar al agente
NOTIFICATION="agents/${AGENT#@}/inbox/LOCK_RELEASE_${TIMESTAMP//[:T-]/_}.md"
cat > "$NOTIFICATION" << EOF
# Notificación: Bloqueos Liberados

**De**: Orchestrator  
**Para**: $AGENT  
**Fecha**: $TIMESTAMP  

Los bloqueos de archivos han sido liberados ${TASK_ID:+para la tarea $TASK_ID}.

Puedes proceder con otras tareas si las tienes asignadas.
EOF

echo "📬 Notificación enviada a $AGENT"