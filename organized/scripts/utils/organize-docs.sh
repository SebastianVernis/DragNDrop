#!/bin/bash

# Script para organizar y versionar documentación
# Versión: 1.0.0
# Fecha: $(date '+%Y-%m-%d')

echo "========================================="
echo "Organización de Documentación"
echo "========================================="

# Timestamp para versionado
TIMESTAMP=$(date '+%Y%m%d_%H%M%S')
VERSION="v1.0_$TIMESTAMP"

# Crear estructura de documentación
mkdir -p organized/docs/{current,archive/$VERSION}/{api,guides,workflows,deployment,features,setup}

# Función para categorizar documentación
categorize_doc() {
    local file=$1
    local filename=$(basename "$file")
    local dest=""

    # Categorizar por nombre
    case "$filename" in
        *API*|*api*) dest="api" ;;
        *WORKFLOW*|*workflow*|*WORK_FLOW*) dest="workflows" ;;
        *GUIDE*|*guide*|*GUIA*) dest="guides" ;;
        *DEPLOY*|*deploy*|*DEPLOYMENT*) dest="deployment" ;;
        *FEATURE*|*feature*|*FUNCIONALIDAD*) dest="features" ;;
        *SETUP*|*setup*|*CONFIG*|*INSTALL*) dest="setup" ;;
        README*|INDEX*|SUMMARY*|RESUMEN*) dest="." ;;
        *) dest="guides" ;;
    esac

    echo "$dest"
}

# Archivar documentación existente
echo -e "\n1. Archivando documentación existente..."
find . -maxdepth 1 -name "*.md" -type f | while read file; do
    if [ -f "$file" ]; then
        category=$(categorize_doc "$file")
        cp "$file" "organized/docs/archive/$VERSION/$category/" 2>/dev/null || cp "$file" "organized/docs/archive/$VERSION/"
        echo "  Archivado: $file -> archive/$VERSION/$category/"
    fi
done

# Copiar documentación de directorios existentes
if [ -d "docs" ]; then
    echo -e "\n2. Copiando documentación de /docs..."
    cp -r docs/* organized/docs/current/ 2>/dev/null
fi

if [ -d "workflow-docs" ]; then
    echo -e "\n3. Copiando documentación de /workflow-docs..."
    cp -r workflow-docs/* organized/docs/current/workflows/ 2>/dev/null
fi

# Organizar documentación por categorías
echo -e "\n4. Organizando documentación por categorías..."
find . -maxdepth 1 -name "*.md" -type f | while read file; do
    if [ -f "$file" ]; then
        category=$(categorize_doc "$file")
        if [ "$category" = "." ]; then
            cp "$file" "organized/docs/current/"
        else
            cp "$file" "organized/docs/current/$category/"
        fi
    fi
done

# Crear índice de documentación
echo -e "\n5. Generando índice de documentación..."
cat > organized/docs/current/INDEX.md << 'EOF'
# Índice de Documentación

Fecha de actualización: $(date '+%Y-%m-%d %H:%M:%S')

## Estructura de Documentación

### 📋 Principal
EOF

# Listar archivos principales
ls organized/docs/current/*.md 2>/dev/null | grep -v INDEX.md | while read file; do
    filename=$(basename "$file" .md)
    echo "- [$filename]($filename.md)" >> organized/docs/current/INDEX.md
done

# Añadir categorías al índice
cat >> organized/docs/current/INDEX.md << 'EOF'

### 🚀 Características (Features)
EOF
ls organized/docs/current/features/*.md 2>/dev/null | while read file; do
    filename=$(basename "$file" .md)
    echo "- [$filename](features/$filename.md)" >> organized/docs/current/INDEX.md
done

cat >> organized/docs/current/INDEX.md << 'EOF'

### 📖 Guías
EOF
ls organized/docs/current/guides/*.md 2>/dev/null | while read file; do
    filename=$(basename "$file" .md)
    echo "- [$filename](guides/$filename.md)" >> organized/docs/current/INDEX.md
done

cat >> organized/docs/current/INDEX.md << 'EOF'

### 🔧 Configuración
EOF
ls organized/docs/current/setup/*.md 2>/dev/null | while read file; do
    filename=$(basename "$file" .md)
    echo "- [$filename](setup/$filename.md)" >> organized/docs/current/INDEX.md
done

cat >> organized/docs/current/INDEX.md << 'EOF'

### 🔄 Workflows
EOF
ls organized/docs/current/workflows/*.md 2>/dev/null | while read file; do
    filename=$(basename "$file" .md)
    echo "- [$filename](workflows/$filename.md)" >> organized/docs/current/INDEX.md
done

cat >> organized/docs/current/INDEX.md << 'EOF'

### 🌐 Deployment
EOF
ls organized/docs/current/deployment/*.md 2>/dev/null | while read file; do
    filename=$(basename "$file" .md)
    echo "- [$filename](deployment/$filename.md)" >> organized/docs/current/INDEX.md
done

cat >> organized/docs/current/INDEX.md << 'EOF'

### 🔌 API
EOF
ls organized/docs/current/api/*.md 2>/dev/null | while read file; do
    filename=$(basename "$file" .md)
    echo "- [$filename](api/$filename.md)" >> organized/docs/current/INDEX.md
done

# Crear archivo de versión
echo "$VERSION" > organized/docs/.version

# Generar resumen
echo -e "\n========================================="
echo "RESUMEN DE ORGANIZACIÓN"
echo "========================================="
echo "Versión: $VERSION"
echo "Documentos archivados en: organized/docs/archive/$VERSION/"
echo "Documentos actuales en: organized/docs/current/"
echo "Índice generado: organized/docs/current/INDEX.md"
echo ""
echo "Estructura creada:"
tree organized/docs/ -L 3 2>/dev/null || find organized/docs/ -type d | sort