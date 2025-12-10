# 💾 Data Recovery Runbook

**Documento**: Runbook de Recuperación de Datos  
**Versión**: 1.0.0  
**Última Actualización**: 2025-12-09  
**Propietario**: Equipo DevOps  

---

## 📋 Tabla de Contenidos

1. [Visión General](#visión-general)
2. [Tipos de Datos](#tipos-de-datos)
3. [Estrategia de Backup](#estrategia-de-backup)
4. [Procedimientos de Recuperación](#procedimientos-de-recuperación)
5. [Verificación de Integridad](#verificación-de-integridad)

---

## 📌 Visión General

### Objetivo

Este runbook documenta los procedimientos para recuperar datos en caso de:
- Pérdida accidental de datos
- Corrupción de archivos
- Eliminación no intencional
- Fallo de almacenamiento
- Ataque malicioso

### RPO (Recovery Point Objective)

| Tipo de Dato | RPO | Frecuencia de Backup |
|--------------|-----|---------------------|
| Código fuente | 0 | Continuo (Git) |
| Configuración | 6 horas | Cada 6 horas |
| Assets estáticos | 24 horas | Diario |
| Datos de usuario | 15 minutos | Tiempo real* |

*Si se implementa base de datos

---

## 📁 Tipos de Datos

### 1. Código Fuente

**Ubicación**: Repositorio Git  
**Backup**: GitHub + Git bundles  
**Retención**: Indefinida (historial Git)

**Archivos Críticos**:
- `index.html` - Aplicación principal
- `script.js` - Lógica de la aplicación
- `style.css` - Estilos
- `package.json` - Dependencias

### 2. Configuración

**Ubicación**: Repositorio + Secrets  
**Backup**: GitHub Artifacts  
**Retención**: 30 días

**Archivos**:
- `.github/workflows/*.yml`
- `*.config.js`
- `.env.example`

### 3. Assets Estáticos

**Ubicación**: `/landing/assets/`, `/public/`  
**Backup**: GitHub Artifacts + CDN  
**Retención**: 30 días

**Tipos**:
- Imágenes
- Iconos
- Fuentes
- Videos

### 4. Documentación

**Ubicación**: `/docs/`, `*.md`  
**Backup**: Repositorio Git  
**Retención**: Indefinida

---

## 🗄️ Estrategia de Backup

### Backup Automatizado

```yaml
# Ejecutado por: .github/workflows/backup.yml
# Frecuencia: Cada 6 horas
# Retención: 30 días

Componentes:
  - Git bundle (historial completo)
  - Source archive (código sin .git)
  - Checksums SHA256
```

### Ubicaciones de Backup

| Ubicación | Tipo | Prioridad | Acceso |
|-----------|------|-----------|--------|
| GitHub Artifacts | Primario | 1 | GitHub Actions |
| Cloudflare R2 | Secundario | 2 | API/CLI |
| AWS S3 | Terciario | 3 | API/CLI |
| Local | Emergencia | 4 | Manual |

### Verificación de Backups

```bash
# Verificar último backup exitoso
gh run list --workflow=backup.yml --limit=1 --json status,conclusion

# Descargar y verificar
gh run download <RUN_ID> --name code-backup-*
sha256sum -c *.sha256
```

---

## 🔧 Procedimientos de Recuperación

### Procedimiento 1: Recuperar Archivo Individual

**Escenario**: Un archivo fue eliminado o modificado incorrectamente

**Desde Git (más reciente)**:
```bash
# Ver historial del archivo
git log --oneline -- path/to/file

# Restaurar versión específica
git checkout <COMMIT_HASH> -- path/to/file

# O restaurar última versión
git checkout HEAD~1 -- path/to/file
```

**Desde Backup**:
```bash
# 1. Descargar backup
gh run download <RUN_ID> --name code-backup-*

# 2. Extraer archivo específico
tar -xzf dragndrop-code-*.tar.gz path/to/file

# 3. Copiar al proyecto
cp path/to/file /proyecto/path/to/file
```

---

### Procedimiento 2: Recuperar Repositorio Completo

**Escenario**: Repositorio corrupto o eliminado

**Desde Git Bundle**:
```bash
# 1. Descargar bundle más reciente
gh run download <RUN_ID> --name code-backup-*

# 2. Verificar bundle
git bundle verify dragndrop-*.bundle

# 3. Clonar desde bundle
git clone dragndrop-*.bundle restored-repo

# 4. Verificar
cd restored-repo
git log --oneline -10
git status
```

**Desde Archive**:
```bash
# 1. Descargar archive
gh run download <RUN_ID> --name code-backup-*

# 2. Extraer
mkdir restored-repo
tar -xzf dragndrop-code-*.tar.gz -C restored-repo

# 3. Inicializar Git (si es necesario)
cd restored-repo
git init
git add .
git commit -m "Restored from backup"
```

---

### Procedimiento 3: Recuperar a Punto en el Tiempo

**Escenario**: Necesidad de volver a un estado anterior específico

```bash
# 1. Identificar el commit deseado
git log --oneline --since="2025-12-01" --until="2025-12-09"

# 2. Crear branch de recuperación
git checkout -b recovery/<FECHA> <COMMIT_HASH>

# 3. Verificar estado
npm ci
npm run build
npm test

# 4. Si todo está bien, merge o reemplazar main
git checkout main
git reset --hard recovery/<FECHA>
# O
git merge recovery/<FECHA>
```

---

### Procedimiento 4: Recuperar desde Almacenamiento Externo

**Desde Cloudflare R2**:
```bash
# Configurar credenciales
export AWS_ACCESS_KEY_ID=<R2_ACCESS_KEY>
export AWS_SECRET_ACCESS_KEY=<R2_SECRET_KEY>
export AWS_ENDPOINT_URL=<R2_ENDPOINT>

# Listar backups disponibles
aws s3 ls s3://dragndrop-backups/code/ --endpoint-url $AWS_ENDPOINT_URL

# Descargar backup específico
aws s3 cp s3://dragndrop-backups/code/dragndrop-code-20251209.tar.gz . \
    --endpoint-url $AWS_ENDPOINT_URL
```

**Desde AWS S3**:
```bash
# Configurar credenciales AWS
aws configure

# Listar backups
aws s3 ls s3://dragndrop-backups/code/

# Descargar
aws s3 cp s3://dragndrop-backups/code/dragndrop-code-20251209.tar.gz .
```

---

## ✅ Verificación de Integridad

### Verificar Checksums

```bash
# Verificar SHA256
sha256sum -c dragndrop-code-*.sha256

# Resultado esperado:
# dragndrop-code-20251209.tar.gz: OK
```

### Verificar Git Bundle

```bash
# Verificar integridad del bundle
git bundle verify dragndrop-*.bundle

# Salida esperada:
# The bundle contains X refs
# dragndrop-*.bundle is okay
```

### Verificar Contenido Restaurado

```bash
# Verificar archivos críticos existen
ls -la index.html script.js style.css package.json

# Verificar dependencias
npm ci

# Ejecutar build
npm run build --if-present

# Ejecutar tests
npm test --if-present

# Verificar aplicación funciona
npx http-server -p 8080 &
curl -f http://localhost:8080/
```

### Script de Verificación Completa

```bash
#!/bin/bash
# verify-restore.sh

echo "Verificando restauración..."

# Archivos críticos
CRITICAL_FILES=("index.html" "script.js" "style.css" "package.json")
for file in "${CRITICAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✓ $file existe"
    else
        echo "✗ $file FALTA"
        exit 1
    fi
done

# Dependencias
if npm ci; then
    echo "✓ Dependencias instaladas"
else
    echo "✗ Error instalando dependencias"
    exit 1
fi

# Build
if npm run build --if-present; then
    echo "✓ Build exitoso"
else
    echo "✗ Build falló"
    exit 1
fi

echo ""
echo "✓ Verificación completa exitosa"
```

---

## 📊 Monitoreo de Backups

### Alertas Configuradas

| Alerta | Condición | Severidad |
|--------|-----------|-----------|
| Backup Fallido | Workflow falla | 🔴 Crítico |
| Backup Atrasado | > 12 horas sin backup | 🟠 Alto |
| Checksum Inválido | Verificación falla | 🔴 Crítico |
| Espacio Bajo | < 10% disponible | 🟡 Medio |

### Dashboard de Backups

```bash
# Ver estado de backups recientes
gh run list --workflow=backup.yml --limit=10

# Ver detalles de último backup
gh run view $(gh run list --workflow=backup.yml --limit=1 --json databaseId --jq '.[0].databaseId')
```

---

## 🔄 Mantenimiento

### Tareas Periódicas

| Tarea | Frecuencia | Responsable |
|-------|------------|-------------|
| Verificar backups | Diario | Automatizado |
| Test de restauración | Mensual | DevOps |
| Limpiar backups antiguos | Semanal | Automatizado |
| Revisar retención | Trimestral | DevOps |

### Limpieza de Backups Antiguos

```bash
# Ejecutado automáticamente en backup.yml
# Retiene últimos 30 días / 50 backups

# Manual (si es necesario):
aws s3 ls s3://dragndrop-backups/code/ | \
    sort -r | \
    tail -n +51 | \
    awk '{print $4}' | \
    xargs -I {} aws s3 rm s3://dragndrop-backups/code/{}
```

---

## 📝 Registro de Recuperaciones

### Template

```markdown
## Recuperación: [FECHA]

**Tipo**: Archivo/Repositorio/Punto en tiempo
**Razón**: [Descripción]
**Backup Usado**: [Identificador]
**Tiempo de Recuperación**: X minutos

### Pasos Ejecutados
1. [Paso 1]
2. [Paso 2]

### Verificación
- [ ] Archivos restaurados
- [ ] Build exitoso
- [ ] Tests pasan
- [ ] Funcionalidad verificada

### Notas
[Observaciones adicionales]
```

---

**⚠️ IMPORTANTE**: Siempre verificar la integridad de los datos después de cualquier recuperación. Documentar todas las recuperaciones para análisis posterior.
