# 🔄 Backup & Restore Runbook

**Documento**: Runbook de Backup y Restauración  
**Versión**: 1.0.0  
**Última Actualización**: 2025-12-10  
**Propietario**: Equipo DevOps  

---

## 📋 Tabla de Contenidos

1. [Visión General](#visión-general)
2. [Arquitectura de Backup](#arquitectura-de-backup)
3. [Procedimientos de Backup](#procedimientos-de-backup)
4. [Procedimientos de Restauración](#procedimientos-de-restauración)
5. [Verificación de Backups](#verificación-de-backups)
6. [Automatización](#automatización)
7. [Troubleshooting](#troubleshooting)

---

## 📌 Visión General

### Objetivos

| Métrica | Objetivo | Actual |
|---------|----------|--------|
| **RPO** (Recovery Point Objective) | < 15 minutos | 6 horas (backup automático) |
| **RTO** (Recovery Time Objective) | < 1 hora | ~30 minutos |
| **Retención** | 30 días | 30 días |
| **Frecuencia de Backup** | Cada 6 horas | Cada 6 horas |

### Tipos de Backup

| Tipo | Contenido | Frecuencia | Retención |
|------|-----------|------------|-----------|
| **Code Bundle** | Repositorio Git completo | 6 horas | 30 días |
| **Source Archive** | Código fuente (sin .git) | 6 horas | 30 días |
| **Assets** | Imágenes, documentos | 24 horas | 30 días |
| **Config** | Configuraciones | 6 horas | 30 días |

---

## 🏗️ Arquitectura de Backup

### Ubicaciones de Almacenamiento

```
┌─────────────────────────────────────────────────────────────┐
│                    BACKUP STORAGE                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │   GitHub    │    │ Cloudflare  │    │   AWS S3    │     │
│  │  Artifacts  │    │     R2      │    │             │     │
│  │  (Primary)  │    │ (Secondary) │    │ (Tertiary)  │     │
│  └─────────────┘    └─────────────┘    └─────────────┘     │
│        │                  │                  │              │
│        └──────────────────┼──────────────────┘              │
│                           │                                 │
│                    ┌──────┴──────┐                          │
│                    │   Local     │                          │
│                    │  (Manual)   │                          │
│                    └─────────────┘                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Estructura de Archivos

```
backups/
├── dragndrop-code-20251210-120000.bundle      # Git bundle
├── dragndrop-code-20251210-120000.bundle.sha256
├── dragndrop-code-20251210-120000.tar.gz      # Source archive
├── dragndrop-code-20251210-120000.tar.gz.sha256
├── dragndrop-assets-20251210-120000.tar.gz    # Assets
├── dragndrop-assets-20251210-120000.tar.gz.sha256
├── dragndrop-config-20251210-120000.tar.gz    # Config
└── dragndrop-config-20251210-120000.tar.gz.sha256
```

---

## 📦 Procedimientos de Backup

### Backup Manual Completo

```bash
# Navegar al directorio del proyecto
cd /path/to/DragNDrop

# Ejecutar backup completo
./scripts/dr/backup.sh

# Opciones disponibles:
./scripts/dr/backup.sh --type all        # Backup completo (default)
./scripts/dr/backup.sh --type code       # Solo código
./scripts/dr/backup.sh --type assets     # Solo assets
./scripts/dr/backup.sh --type config     # Solo configuración
```

### Backup con Upload a Cloud

```bash
# Backup y subir a S3
./scripts/dr/backup.sh --upload-s3

# Backup y subir a R2
./scripts/dr/backup.sh --upload-r2

# Backup y subir a ambos
./scripts/dr/backup.sh --upload-s3 --upload-r2
```

### Backup Rápido (Sin Verificación)

```bash
# Para emergencias - más rápido pero sin verificación
./scripts/dr/backup.sh --no-verify
```

### Configuración de Variables de Entorno

```bash
# Para S3
export AWS_ACCESS_KEY_ID="your-access-key"
export AWS_SECRET_ACCESS_KEY="your-secret-key"
export AWS_REGION="us-east-1"
export AWS_S3_BUCKET="dragndrop-backups"

# Para R2
export CLOUDFLARE_R2_ACCESS_KEY_ID="your-r2-access-key"
export CLOUDFLARE_R2_SECRET_ACCESS_KEY="your-r2-secret-key"
export CLOUDFLARE_R2_ENDPOINT="https://xxx.r2.cloudflarestorage.com"
export CLOUDFLARE_R2_BUCKET="dragndrop-backups"
```

---

## 🔄 Procedimientos de Restauración

### Restauración Rápida (Último Backup)

```bash
# Restaurar desde el backup más reciente
./scripts/dr/restore.sh latest

# El script automáticamente:
# 1. Encuentra el backup más reciente
# 2. Verifica integridad
# 3. Restaura a ./restored-TIMESTAMP/
# 4. Instala dependencias
```

### Restauración desde Archivo Específico

```bash
# Desde git bundle
./scripts/dr/restore.sh backups/dragndrop-code-20251210-120000.bundle

# Desde archive tar.gz
./scripts/dr/restore.sh backups/dragndrop-code-20251210-120000.tar.gz

# A directorio específico
./scripts/dr/restore.sh --output /path/to/restore backups/dragndrop-code-*.bundle
```

### Restauración desde Cloud

```bash
# Desde S3
./scripts/dr/restore.sh --from-s3 backups/dragndrop-code-20251210-120000.tar.gz

# Desde R2
./scripts/dr/restore.sh --from-r2 backups/dragndrop-code-20251210-120000.tar.gz
```

### Restauración con Build

```bash
# Restaurar, instalar deps y ejecutar build
./scripts/dr/restore.sh --build latest
```

### Solo Verificar (Sin Restaurar)

```bash
# Verificar integridad sin restaurar
./scripts/dr/restore.sh --verify-only backups/dragndrop-code-*.bundle
```

---

## ✅ Verificación de Backups

### Verificación Rápida

```bash
# Verificar todos los backups locales
./scripts/dr/verify-backup.sh

# Verificar solo el más reciente
./scripts/dr/verify-backup.sh --latest

# Verificar archivo específico
./scripts/dr/verify-backup.sh backups/dragndrop-code-*.bundle
```

### Verificación Completa (Con Test de Restauración)

```bash
# Test completo incluyendo restauración
./scripts/dr/verify-backup.sh --full --latest

# Esto ejecuta:
# 1. Verificación de checksum
# 2. Verificación de integridad
# 3. Restauración de prueba
# 4. Instalación de dependencias
# 5. Build de prueba
```

### Verificación de Backups en Cloud

```bash
# Incluir verificación de S3/R2
./scripts/dr/verify-backup.sh --check-cloud
```

### Reporte JSON

```bash
# Generar reporte en formato JSON
./scripts/dr/verify-backup.sh --json > backup-report.json
```

---

## 🤖 Automatización

### GitHub Actions - Backup Automático

El workflow `.github/workflows/backup.yml` ejecuta:

- **Frecuencia**: Cada 6 horas (0:00, 6:00, 12:00, 18:00 UTC)
- **Trigger Manual**: Disponible via `workflow_dispatch`

```yaml
# Ejecutar backup manualmente desde GitHub
gh workflow run backup.yml

# Con tipo específico
gh workflow run backup.yml -f backup_type=code
```

### GitHub Actions - Test de DR

El workflow `.github/workflows/dr-test.yml` ejecuta:

- **Frecuencia**: Primer día de cada mes a las 3:00 UTC
- **Trigger Manual**: Disponible via `workflow_dispatch`

```yaml
# Ejecutar test de DR manualmente
gh workflow run dr-test.yml

# Con tipo específico
gh workflow run dr-test.yml -f test_type=backup-restore
```

### Cron Local (Opcional)

```bash
# Agregar a crontab para backup local cada 6 horas
0 */6 * * * /path/to/DragNDrop/scripts/dr/backup.sh >> /var/log/dragndrop-backup.log 2>&1

# Verificación diaria
0 8 * * * /path/to/DragNDrop/scripts/dr/verify-backup.sh --latest >> /var/log/dragndrop-verify.log 2>&1
```

---

## 🔧 Troubleshooting

### Problema: Backup Falla con "Permission Denied"

```bash
# Verificar permisos de scripts
chmod +x scripts/dr/*.sh

# Verificar permisos de directorio de backups
mkdir -p backups
chmod 755 backups
```

### Problema: Checksum No Coincide

```bash
# Regenerar checksum
sha256sum backups/dragndrop-code-*.tar.gz > backups/dragndrop-code-*.tar.gz.sha256

# Verificar archivo no está corrupto
gzip -t backups/dragndrop-code-*.tar.gz
```

### Problema: Git Bundle Inválido

```bash
# Verificar bundle
git bundle verify backups/dragndrop-code-*.bundle

# Si falla, crear nuevo bundle
cd /path/to/DragNDrop
git bundle create backups/dragndrop-code-$(date +%Y%m%d).bundle --all
```

### Problema: Restauración Falla en npm ci

```bash
# Limpiar cache de npm
npm cache clean --force

# Intentar con npm install
npm install

# Verificar versión de Node.js
node --version  # Debe ser >= 18
```

### Problema: No Hay Espacio en Disco

```bash
# Verificar espacio
df -h

# Limpiar backups antiguos manualmente
./scripts/dr/backup.sh --retention 7  # Mantener solo 7 días

# O eliminar manualmente
ls -la backups/
rm backups/dragndrop-*-202512{01,02,03}*  # Eliminar días específicos
```

### Problema: Upload a S3/R2 Falla

```bash
# Verificar credenciales
aws sts get-caller-identity

# Verificar bucket existe
aws s3 ls s3://dragndrop-backups/

# Verificar permisos
aws s3 cp test.txt s3://dragndrop-backups/test.txt
aws s3 rm s3://dragndrop-backups/test.txt
```

---

## 📊 Monitoreo de Backups

### Verificar Estado de Backups Recientes

```bash
# Ver últimos 10 backups
ls -lht backups/ | head -10

# Ver workflows de backup en GitHub
gh run list --workflow=backup.yml --limit=5

# Ver detalles del último backup
gh run view $(gh run list --workflow=backup.yml --limit=1 --json databaseId --jq '.[0].databaseId')
```

### Alertas Recomendadas

| Condición | Severidad | Acción |
|-----------|-----------|--------|
| Backup > 12 horas | 🟠 Alto | Investigar workflow |
| Checksum inválido | 🔴 Crítico | Regenerar backup |
| Espacio < 10% | 🟡 Medio | Limpiar backups antiguos |
| Restore test falla | 🔴 Crítico | Verificar integridad |

---

## 📝 Checklist de Backup

### Diario (Automatizado)
- [ ] Backup automático ejecutado
- [ ] Checksums generados
- [ ] Notificación de estado enviada

### Semanal (Manual)
- [ ] Verificar backups de la semana
- [ ] Revisar logs de errores
- [ ] Verificar espacio en disco

### Mensual
- [ ] Test de restauración completo
- [ ] Verificar backups en cloud
- [ ] Revisar política de retención
- [ ] Actualizar documentación si es necesario

---

## 📚 Referencias

- [Disaster Recovery Runbook](./disaster-recovery.md)
- [Data Recovery Runbook](./data-recovery.md)
- [Emergency Contacts](./emergency-contacts.md)
- [GitHub Actions Backup Workflow](../../.github/workflows/backup.yml)
- [GitHub Actions DR Test Workflow](../../.github/workflows/dr-test.yml)

---

**⚠️ IMPORTANTE**: Siempre verificar la integridad del backup antes de confiar en él para una restauración crítica. Ejecutar `./scripts/dr/verify-backup.sh --full` regularmente.
