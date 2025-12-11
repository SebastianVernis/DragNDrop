# 🚨 Disaster Recovery Runbook

**Documento**: Runbook de Recuperación ante Desastres  
**Versión**: 1.0.0  
**Última Actualización**: 2025-12-09  
**Propietario**: Equipo DevOps  

---

## 📋 Tabla de Contenidos

1. [Información General](#información-general)
2. [Contactos de Emergencia](#contactos-de-emergencia)
3. [Escenarios de Desastre](#escenarios-de-desastre)
4. [Procedimientos de Recuperación](#procedimientos-de-recuperación)
5. [Verificación Post-Recuperación](#verificación-post-recuperación)
6. [Métricas y Objetivos](#métricas-y-objetivos)

---

## 📌 Información General

### Objetivos de Recuperación

| Métrica | Objetivo | Descripción |
|---------|----------|-------------|
| **RTO** (Recovery Time Objective) | < 1 hora | Tiempo máximo para restaurar el servicio |
| **RPO** (Recovery Point Objective) | < 15 minutos | Pérdida máxima de datos aceptable |
| **MTTR** (Mean Time To Recovery) | < 30 minutos | Tiempo promedio de recuperación |

### Prioridades de Recuperación

1. 🔴 **Crítico**: Servicio principal (dragndrop.dev)
2. 🟠 **Alto**: API y funcionalidades core
3. 🟡 **Medio**: Servicios secundarios
4. 🟢 **Bajo**: Documentación y assets no críticos

---

## 📞 Contactos de Emergencia

### Equipo Interno

| Rol | Nombre | Contacto | Disponibilidad |
|-----|--------|----------|----------------|
| On-Call Primary | TBD | TBD | 24/7 |
| On-Call Secondary | TBD | TBD | 24/7 |
| Engineering Lead | TBD | TBD | Horario laboral |
| DevOps Lead | TBD | TBD | Horario laboral |

### Proveedores Externos

| Servicio | Proveedor | Soporte | Contacto |
|----------|-----------|---------|----------|
| Hosting | Vercel | Enterprise | support@vercel.com |
| CDN | Cloudflare | Business | support@cloudflare.com |
| DNS | Cloudflare | Business | support@cloudflare.com |
| Monitoreo | TBD | TBD | TBD |

---

## 🔥 Escenarios de Desastre

### Escenario 1: Caída de Región Primaria

**Síntomas**:
- Alertas de disponibilidad
- Errores 5xx en monitoreo
- Reportes de usuarios

**Impacto**: 🔴 Crítico - Servicio completamente inaccesible

**Tiempo Estimado de Recuperación**: 15-30 minutos

### Escenario 2: Corrupción de Datos

**Síntomas**:
- Datos inconsistentes
- Errores de integridad
- Comportamiento inesperado

**Impacto**: 🟠 Alto - Funcionalidad degradada

**Tiempo Estimado de Recuperación**: 30-60 minutos

### Escenario 3: Compromiso de Seguridad

**Síntomas**:
- Actividad sospechosa
- Alertas de seguridad
- Accesos no autorizados

**Impacto**: 🔴 Crítico - Requiere acción inmediata

**Tiempo Estimado de Recuperación**: Variable

### Escenario 4: Fallo de Despliegue

**Síntomas**:
- Errores después de deploy
- Funcionalidad rota
- Regresiones

**Impacto**: 🟡 Medio - Funcionalidad parcialmente afectada

**Tiempo Estimado de Recuperación**: 5-15 minutos

---

## 🔧 Procedimientos de Recuperación

### Procedimiento 1: Failover a Región Secundaria

**Cuándo usar**: Caída completa de región primaria

**Prerrequisitos**:
- Acceso a scripts de DR
- Credenciales de Cloudflare/DNS
- Región secundaria operativa

**Pasos**:

```bash
# 1. Verificar estado de la región primaria
./scripts/dr/verify-services.sh --region primary

# 2. Verificar que la región secundaria está operativa
./scripts/dr/verify-services.sh --region secondary

# 3. Ejecutar failover
./scripts/dr/failover.sh --from primary --to secondary

# 4. Verificar failover exitoso
./scripts/dr/verify-services.sh --region secondary
```

**Verificación**:
- [ ] DNS apunta a región secundaria
- [ ] Servicio responde correctamente
- [ ] Métricas de monitoreo normales
- [ ] Notificación enviada al equipo

**Rollback**:
```bash
# Revertir a región primaria cuando esté disponible
./scripts/dr/failover.sh --from secondary --to primary
```

---

### Procedimiento 2: Restauración desde Backup

**Cuándo usar**: Corrupción de datos o pérdida de código

**Prerrequisitos**:
- Acceso a backups (GitHub Artifacts, S3, R2)
- Permisos de escritura en repositorio

**Pasos**:

```bash
# 1. Identificar el backup más reciente
# Opción A: GitHub Artifacts
gh run list --workflow=backup.yml --limit=5

# Opción B: Listar backups locales
ls -la backups/

# 2. Descargar backup
gh run download <RUN_ID> --name code-backup-*

# 3. Verificar integridad del backup
sha256sum -c *.sha256

# 4. Restaurar desde git bundle
git clone dragndrop-*.bundle restored-repo

# 5. Verificar restauración
cd restored-repo
git log --oneline -5
npm ci
npm run build

# 6. Desplegar versión restaurada
# (seguir proceso de deploy estándar)
```

**Verificación**:
- [ ] Código restaurado correctamente
- [ ] Build exitoso
- [ ] Tests pasan
- [ ] Deploy exitoso

---

### Procedimiento 3: Rollback de Despliegue

**Cuándo usar**: Problemas después de un deploy

**Prerrequisitos**:
- Acceso a Vercel/plataforma de deploy
- Identificador del deploy anterior

**Pasos**:

```bash
# Opción A: Rollback via Vercel CLI
vercel rollback

# Opción B: Rollback via Git
git revert HEAD
git push origin main

# Opción C: Redeploy versión anterior
vercel deploy --prod <DEPLOYMENT_URL>
```

**Verificación**:
- [ ] Versión anterior desplegada
- [ ] Funcionalidad restaurada
- [ ] Sin errores en logs

---

### Procedimiento 4: Respuesta a Incidente de Seguridad

**Cuándo usar**: Compromiso de seguridad detectado

**Pasos Inmediatos**:

1. **Contener** (0-5 minutos)
   ```bash
   # Poner servicio en modo mantenimiento si es necesario
   # Revocar credenciales comprometidas
   # Bloquear IPs sospechosas
   ```

2. **Evaluar** (5-15 minutos)
   - Determinar alcance del compromiso
   - Identificar datos afectados
   - Documentar timeline

3. **Erradicar** (15-60 minutos)
   - Eliminar acceso no autorizado
   - Parchear vulnerabilidades
   - Rotar todas las credenciales

4. **Recuperar** (Variable)
   - Restaurar desde backup limpio si es necesario
   - Verificar integridad del sistema
   - Monitoreo intensivo

5. **Post-Incidente**
   - Documentar lecciones aprendidas
   - Actualizar procedimientos
   - Comunicar a stakeholders

---

## ✅ Verificación Post-Recuperación

### Checklist de Verificación

```bash
# Ejecutar verificación completa
./scripts/dr/verify-services.sh --region all --verbose
```

**Verificaciones Manuales**:

- [ ] **Disponibilidad**: Sitio accesible desde múltiples ubicaciones
- [ ] **Funcionalidad**: Features principales funcionando
- [ ] **Performance**: Tiempos de respuesta normales
- [ ] **Datos**: Integridad de datos verificada
- [ ] **Seguridad**: Sin alertas de seguridad activas
- [ ] **Monitoreo**: Todas las métricas en verde
- [ ] **Logs**: Sin errores críticos

### Smoke Tests

```bash
# Ejecutar smoke tests
npm run test:smoke

# O manualmente:
curl -f https://dragndrop.dev/
curl -f https://dragndrop.dev/script.js
curl -f https://dragndrop.dev/style.css
```

---

## 📊 Métricas y Objetivos

### KPIs de Disaster Recovery

| Métrica | Objetivo | Medición |
|---------|----------|----------|
| Disponibilidad | 99.9% | Uptime mensual |
| RTO Real | < 1 hora | Tiempo de recuperación en incidentes |
| RPO Real | < 15 min | Pérdida de datos en incidentes |
| Éxito de DR Tests | 100% | Tests mensuales exitosos |
| Tiempo de Detección | < 5 min | Tiempo hasta primera alerta |

### Frecuencia de Tests

| Test | Frecuencia | Responsable |
|------|------------|-------------|
| Backup Integrity | Diario (automatizado) | CI/CD |
| DR Test Completo | Mensual | DevOps |
| Failover Test | Trimestral | DevOps + Eng |
| Tabletop Exercise | Semestral | Todo el equipo |

---

## 📝 Registro de Incidentes

### Template de Incidente

```markdown
## Incidente: [TÍTULO]

**Fecha**: YYYY-MM-DD
**Duración**: X horas Y minutos
**Severidad**: Crítico/Alto/Medio/Bajo
**Impacto**: [Descripción del impacto]

### Timeline
- HH:MM - Detección
- HH:MM - Respuesta iniciada
- HH:MM - Mitigación aplicada
- HH:MM - Servicio restaurado

### Causa Raíz
[Descripción de la causa]

### Acciones Tomadas
1. [Acción 1]
2. [Acción 2]

### Lecciones Aprendidas
- [Lección 1]
- [Lección 2]

### Acciones de Seguimiento
- [ ] [Acción preventiva 1]
- [ ] [Acción preventiva 2]
```

---

## 🔄 Mantenimiento del Runbook

### Revisión Periódica

- **Mensual**: Verificar contactos y credenciales
- **Trimestral**: Revisar y actualizar procedimientos
- **Después de cada incidente**: Incorporar lecciones aprendidas

### Control de Versiones

| Versión | Fecha | Cambios | Autor |
|---------|-------|---------|-------|
| 1.0.0 | 2025-12-09 | Versión inicial | DevOps |

---

**⚠️ IMPORTANTE**: Este documento debe mantenerse actualizado y accesible offline. Todos los miembros del equipo deben estar familiarizados con estos procedimientos.
