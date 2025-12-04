#!/bin/bash

# Script para validar archivos de configuración (JSON, YAML, etc.)
# Versión: 1.0.0
# Fecha: $(date '+%Y-%m-%d')

echo "========================================="
echo "Validación de Archivos de Configuración"
echo "========================================="

# Crear directorio de reportes si no existe
mkdir -p organized/reports/validation

# Generar timestamp
TIMESTAMP=$(date '+%Y%m%d_%H%M%S')
REPORT_FILE="organized/reports/validation/config_validation_$TIMESTAMP.txt"

# Inicializar contadores
TOTAL_FILES=0
VALID_FILES=0
INVALID_FILES=0

echo "Reporte de Validación de Configuración - $TIMESTAMP" > "$REPORT_FILE"
echo "==========================================" >> "$REPORT_FILE"

# Función para validar JSON
validate_json() {
    local file=$1
    echo -e "\nValidando JSON: $file" | tee -a "$REPORT_FILE"
    if python3 -m json.tool "$file" > /dev/null 2>&1; then
        echo "✓ JSON válido" | tee -a "$REPORT_FILE"
        ((VALID_FILES++))
        # Formatear el archivo
        python3 -m json.tool "$file" > "$file.tmp" && mv "$file.tmp" "$file"
    else
        echo "✗ JSON inválido" | tee -a "$REPORT_FILE"
        python3 -m json.tool "$file" 2>&1 | tee -a "$REPORT_FILE"
        ((INVALID_FILES++))
    fi
}

# Función para validar YAML
validate_yaml() {
    local file=$1
    echo -e "\nValidando YAML: $file" | tee -a "$REPORT_FILE"
    if python3 -c "import yaml; yaml.safe_load(open('$file'))" 2>/dev/null; then
        echo "✓ YAML válido" | tee -a "$REPORT_FILE"
        ((VALID_FILES++))
    else
        echo "✗ YAML inválido" | tee -a "$REPORT_FILE"
        python3 -c "import yaml; yaml.safe_load(open('$file'))" 2>&1 | tee -a "$REPORT_FILE"
        ((INVALID_FILES++))
    fi
}

# Instalar PyYAML si no está disponible
python3 -c "import yaml" 2>/dev/null || pip install PyYAML

echo -e "\n1. Validando archivos JSON..."
echo -e "\n=== Archivos JSON ===" >> "$REPORT_FILE"

# Buscar y validar archivos JSON
find . -name "*.json" -not -path "./node_modules/*" -not -path "./coverage/*" -not -path "./dist/*" | while read file; do
    ((TOTAL_FILES++))
    validate_json "$file"
done

echo -e "\n2. Validando archivos YAML/YML..."
echo -e "\n=== Archivos YAML ===" >> "$REPORT_FILE"

# Buscar y validar archivos YAML
find . \( -name "*.yaml" -o -name "*.yml" \) -not -path "./node_modules/*" | while read file; do
    ((TOTAL_FILES++))
    validate_yaml "$file"
done

# Validar package.json específicamente
echo -e "\n3. Validando package.json principal..."
echo -e "\n=== package.json Principal ===" >> "$REPORT_FILE"

if [ -f "package.json" ]; then
    echo "Verificando estructura de package.json..." | tee -a "$REPORT_FILE"
    node -e "
    const pkg = require('./package.json');
    const required = ['name', 'version', 'description'];
    const missing = required.filter(field => !pkg[field]);
    if (missing.length > 0) {
        console.log('✗ Campos requeridos faltantes:', missing.join(', '));
        process.exit(1);
    } else {
        console.log('✓ Estructura válida');
        console.log('  - Nombre:', pkg.name);
        console.log('  - Versión:', pkg.version);
        console.log('  - Descripción:', pkg.description);
    }
    " | tee -a "$REPORT_FILE"
fi

# Generar resumen
echo -e "\n=========================================" | tee -a "$REPORT_FILE"
echo "RESUMEN DE VALIDACIÓN" | tee -a "$REPORT_FILE"
echo "=========================================" | tee -a "$REPORT_FILE"
echo "Timestamp: $TIMESTAMP" | tee -a "$REPORT_FILE"
echo "Total de archivos: $TOTAL_FILES" | tee -a "$REPORT_FILE"
echo "Archivos válidos: $VALID_FILES" | tee -a "$REPORT_FILE"
echo "Archivos inválidos: $INVALID_FILES" | tee -a "$REPORT_FILE"
echo "" | tee -a "$REPORT_FILE"
echo "Reporte completo en: $REPORT_FILE" | tee -a "$REPORT_FILE"