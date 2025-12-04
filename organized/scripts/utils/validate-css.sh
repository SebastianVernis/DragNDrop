#!/bin/bash

# Script para validar archivos CSS
# Versión: 1.0.0
# Fecha: $(date '+%Y-%m-%d')

echo "========================================="
echo "Validación de CSS"
echo "========================================="

# Crear directorio de reportes si no existe
mkdir -p organized/reports/validation

# Generar timestamp
TIMESTAMP=$(date '+%Y%m%d_%H%M%S')

# Instalar stylelint si no está instalado
if ! command -v stylelint &> /dev/null; then
    echo "Instalando stylelint..."
    npm install -g stylelint stylelint-config-standard
fi

# Crear configuración de stylelint
cat > .stylelintrc.json << 'EOF'
{
  "extends": "stylelint-config-standard",
  "rules": {
    "indentation": 2,
    "color-hex-case": "lower",
    "color-hex-length": "short",
    "color-no-invalid-hex": true,
    "font-family-no-duplicate-names": true,
    "font-family-no-missing-generic-family-keyword": true,
    "function-calc-no-unspaced-operator": true,
    "function-linear-gradient-no-nonstandard-direction": true,
    "string-no-newline": true,
    "unit-no-unknown": true,
    "property-no-unknown": true,
    "declaration-block-no-duplicate-properties": true,
    "selector-pseudo-class-no-unknown": true,
    "selector-pseudo-element-no-unknown": true,
    "selector-type-no-unknown": true,
    "no-empty-source": true,
    "no-extra-semicolons": true,
    "no-duplicate-selectors": true,
    "max-empty-lines": 1,
    "no-eol-whitespace": true,
    "no-missing-end-of-source-newline": true,
    "no-empty-first-line": true
  }
}
EOF

# Encontrar archivos CSS
echo -e "\n1. Buscando archivos CSS..."
CSS_FILES=$(find . -name "*.css" -not -path "./node_modules/*" -not -path "./coverage/*" -not -path "./dist/*")
CSS_COUNT=$(echo "$CSS_FILES" | grep -c .)

echo "Archivos CSS encontrados: $CSS_COUNT"

# Validar con stylelint
echo -e "\n2. Ejecutando stylelint..."
echo "$CSS_FILES" | while read file; do
    if [ -n "$file" ]; then
        stylelint "$file" >> "organized/reports/validation/stylelint_report_$TIMESTAMP.txt" 2>&1
    fi
done

# Aplicar correcciones automáticas
echo -e "\n3. Aplicando correcciones automáticas..."
echo "$CSS_FILES" | while read file; do
    if [ -n "$file" ]; then
        stylelint "$file" --fix >> "organized/reports/validation/stylelint_fix_log_$TIMESTAMP.txt" 2>&1
    fi
done

# Generar resumen
echo -e "\n========================================="
echo "RESUMEN DE VALIDACIÓN CSS"
echo "========================================="
echo "Timestamp: $TIMESTAMP"
echo "Archivos procesados: $CSS_COUNT"
echo "Reportes generados en: organized/reports/validation/"
echo ""
echo "Archivos de reporte:"
echo "- stylelint_report_$TIMESTAMP.txt"
echo "- stylelint_fix_log_$TIMESTAMP.txt"