# 🚨 Emergency Contacts & Escalation

**Documento**: Contactos de Emergencia y Escalación  
**Versión**: 1.0.0  
**Última Actualización**: 2025-12-10  
**Propietario**: Equipo DevOps  
**Clasificación**: CONFIDENCIAL - Solo uso interno

---

## ⚠️ IMPORTANTE

Este documento contiene información de contacto crítica para situaciones de emergencia.
Debe mantenerse actualizado y accesible offline por todos los miembros del equipo.

---

## 📋 Tabla de Contenidos

1. [Matriz de Escalación](#matriz-de-escalación)
2. [Contactos del Equipo](#contactos-del-equipo)
3. [Proveedores Externos](#proveedores-externos)
4. [Procedimiento de Escalación](#procedimiento-de-escalación)
5. [Plantillas de Comunicación](#plantillas-de-comunicación)

---

## 🔺 Matriz de Escalación

### Niveles de Severidad

| Nivel | Descripción | Tiempo de Respuesta | Escalación |
|-------|-------------|---------------------|------------|
| **P1 - Crítico** | Servicio completamente caído | 15 minutos | Inmediata a todos |
| **P2 - Alto** | Funcionalidad principal degradada | 30 minutos | On-Call → Lead |
| **P3 - Medio** | Funcionalidad secundaria afectada | 2 horas | On-Call |
| **P4 - Bajo** | Problema menor, sin impacto | 24 horas | Ticket normal |

### Flujo de Escalación

```
┌─────────────────────────────────────────────────────────────────┐
│                    FLUJO DE ESCALACIÓN                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────┐    15 min    ┌──────────┐    30 min   ┌────────┐ │
│  │ On-Call  │ ──────────▶  │   Lead   │ ─────────▶  │  CTO   │ │
│  │ Primary  │              │  DevOps  │             │        │ │
│  └──────────┘              └──────────┘             └────────┘ │
│       │                         │                       │      │
│       │ No respuesta            │ No respuesta          │      │
│       ▼                         ▼                       ▼      │
│  ┌──────────┐              ┌──────────┐            ┌────────┐  │
│  │ On-Call  │              │   Lead   │            │  CEO   │  │
│  │Secondary │              │   Eng    │            │        │  │
│  └──────────┘              └──────────┘            └────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 👥 Contactos del Equipo

### On-Call Rotation

> **Nota**: Actualizar semanalmente con la rotación actual

| Semana | Primary On-Call | Secondary On-Call |
|--------|-----------------|-------------------|
| Actual | TBD | TBD |
| Próxima | TBD | TBD |

### Equipo Core

| Rol | Nombre | Email | Teléfono | Slack | Disponibilidad |
|-----|--------|-------|----------|-------|----------------|
| **DevOps Lead** | TBD | devops@dragndrop.dev | TBD | @devops-lead | 24/7 para P1 |
| **Engineering Lead** | TBD | eng@dragndrop.dev | TBD | @eng-lead | Horario laboral |
| **Backend Lead** | TBD | backend@dragndrop.dev | TBD | @backend-lead | Horario laboral |
| **Frontend Lead** | TBD | frontend@dragndrop.dev | TBD | @frontend-lead | Horario laboral |
| **CTO** | TBD | cto@dragndrop.dev | TBD | @cto | P1/P2 |
| **CEO** | TBD | ceo@dragndrop.dev | TBD | @ceo | Solo P1 |

### Canales de Comunicación

| Canal | Propósito | Acceso |
|-------|-----------|--------|
| **#incidents** | Incidentes activos | Todo el equipo |
| **#alerts** | Alertas automatizadas | DevOps + Leads |
| **#on-call** | Coordinación on-call | On-call rotation |
| **Email: incidents@dragndrop.dev** | Comunicación externa | Leads |

---

## 🏢 Proveedores Externos

### Hosting & Infrastructure

| Servicio | Proveedor | Plan | Contacto Soporte | SLA |
|----------|-----------|------|------------------|-----|
| **Hosting Principal** | Vercel | Pro/Enterprise | support@vercel.com | 99.99% |
| **CDN/DNS** | Cloudflare | Business | support@cloudflare.com | 100% |
| **Backup Storage** | AWS S3 | Standard | aws.amazon.com/support | 99.99% |
| **Backup Storage Alt** | Cloudflare R2 | Standard | support@cloudflare.com | 99.99% |

### Servicios Adicionales

| Servicio | Proveedor | Contacto | Notas |
|----------|-----------|----------|-------|
| **Dominio** | Cloudflare | support@cloudflare.com | dragndrop.dev |
| **SSL/TLS** | Cloudflare | Automático | Certificados gestionados |
| **Monitoreo** | TBD | TBD | Por configurar |
| **Logging** | TBD | TBD | Por configurar |

### Números de Soporte Críticos

```
┌─────────────────────────────────────────────────────────────┐
│                 NÚMEROS DE EMERGENCIA                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Vercel Enterprise Support:                                 │
│  📧 enterprise-support@vercel.com                           │
│  🌐 vercel.com/support                                      │
│                                                             │
│  Cloudflare Business Support:                               │
│  📧 support@cloudflare.com                                  │
│  🌐 dash.cloudflare.com/support                             │
│  📞 +1 (650) 319-8930 (Enterprise)                          │
│                                                             │
│  AWS Support:                                               │
│  🌐 console.aws.amazon.com/support                          │
│  📞 Según plan de soporte                                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📞 Procedimiento de Escalación

### Paso 1: Detección y Evaluación (0-5 min)

```bash
# 1. Verificar el incidente
./scripts/dr/verify-services.sh --region all

# 2. Determinar severidad
# P1: Servicio completamente caído
# P2: Funcionalidad principal degradada
# P3: Funcionalidad secundaria afectada
# P4: Problema menor

# 3. Documentar en #incidents
```

### Paso 2: Notificación Inicial (5-10 min)

**Para P1/P2:**
1. Notificar en #incidents con formato estándar
2. Llamar a On-Call Primary
3. Si no responde en 5 min, llamar a Secondary
4. Iniciar bridge de incidentes (si aplica)

**Para P3/P4:**
1. Crear ticket en sistema de tracking
2. Notificar en #incidents
3. Asignar a equipo correspondiente

### Paso 3: Escalación (si es necesario)

| Tiempo | Acción |
|--------|--------|
| +15 min | Escalar a DevOps Lead |
| +30 min | Escalar a Engineering Lead |
| +45 min | Escalar a CTO |
| +60 min | Escalar a CEO (solo P1) |

### Paso 4: Comunicación Externa (si aplica)

Para incidentes que afectan a usuarios:
1. Actualizar página de status (si existe)
2. Preparar comunicación para usuarios
3. Coordinar con equipo de comunicaciones

---

## 📝 Plantillas de Comunicación

### Notificación Inicial de Incidente

```markdown
🚨 **INCIDENTE DETECTADO**

**Severidad**: P1/P2/P3/P4
**Inicio**: YYYY-MM-DD HH:MM UTC
**Servicio Afectado**: [Nombre del servicio]
**Impacto**: [Descripción breve del impacto]

**Síntomas**:
- [Síntoma 1]
- [Síntoma 2]

**Acciones Inmediatas**:
- [Acción 1]
- [Acción 2]

**Responsable**: @[nombre]
**Bridge**: [Link si aplica]
```

### Actualización de Incidente

```markdown
📊 **ACTUALIZACIÓN DE INCIDENTE**

**ID**: INC-XXXX
**Estado**: Investigando / Mitigando / Resuelto
**Tiempo Transcurrido**: X horas Y minutos

**Progreso**:
- [Acción completada 1]
- [Acción completada 2]

**Próximos Pasos**:
- [Siguiente acción]

**ETA Resolución**: [Estimación]
```

### Resolución de Incidente

```markdown
✅ **INCIDENTE RESUELTO**

**ID**: INC-XXXX
**Duración Total**: X horas Y minutos
**Causa Raíz**: [Descripción breve]

**Resolución**:
[Descripción de la solución aplicada]

**Impacto Final**:
- Usuarios afectados: X
- Tiempo de inactividad: Y minutos

**Post-Mortem**: [Link al documento]
**Acciones de Seguimiento**: [Link al ticket]
```

### Comunicación a Usuarios (si aplica)

```markdown
**Asunto**: [Servicio] - Incidente Resuelto

Estimados usuarios,

Queremos informarles que el incidente que afectó a [servicio] 
entre las [hora inicio] y [hora fin] ha sido resuelto.

**¿Qué sucedió?**
[Explicación breve y no técnica]

**¿Qué hicimos?**
[Acciones tomadas]

**¿Qué estamos haciendo para prevenir esto?**
[Medidas preventivas]

Lamentamos cualquier inconveniente causado.

Atentamente,
El equipo de DragNDrop
```

---

## 🔐 Acceso de Emergencia

### Credenciales de Emergencia

> **⚠️ CONFIDENCIAL**: Las credenciales de emergencia se almacenan en:
> - Password Manager del equipo (1Password/Bitwarden)
> - Documento físico en ubicación segura (solo para P1 extremos)

### Accesos Necesarios para DR

| Sistema | Tipo de Acceso | Quién Tiene Acceso |
|---------|----------------|-------------------|
| GitHub (Admin) | Owner | CTO, DevOps Lead |
| Vercel (Admin) | Owner | CTO, DevOps Lead |
| Cloudflare (Admin) | Super Admin | CTO, DevOps Lead |
| AWS (Admin) | IAM Admin | DevOps Lead |
| DNS (Admin) | Zone Admin | DevOps Lead |

---

## 📅 Mantenimiento de Este Documento

### Revisión Periódica

| Frecuencia | Tarea | Responsable |
|------------|-------|-------------|
| Semanal | Actualizar rotación on-call | DevOps Lead |
| Mensual | Verificar contactos actualizados | DevOps Lead |
| Trimestral | Revisar procedimientos de escalación | Engineering Lead |
| Anual | Auditoría completa del documento | CTO |

### Historial de Cambios

| Versión | Fecha | Cambios | Autor |
|---------|-------|---------|-------|
| 1.0.0 | 2025-12-10 | Versión inicial | DevOps |

---

## 📚 Referencias

- [Disaster Recovery Runbook](./disaster-recovery.md)
- [Backup & Restore Runbook](./backup-restore.md)
- [Data Recovery Runbook](./data-recovery.md)
- [Incident Response Playbook](./incident-response.md) *(por crear)*

---

**⚠️ RECORDATORIO**: 
- Mantener este documento actualizado
- Verificar números de teléfono regularmente
- Practicar procedimientos de escalación trimestralmente
- Guardar copia offline de este documento
