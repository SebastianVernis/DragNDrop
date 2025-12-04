#!/bin/bash

# Script para validar y corregir archivos JavaScript
# Versión: 1.0.0
# Fecha: $(date '+%Y-%m-%d')

echo "========================================="
echo "Validación y Corrección de JavaScript"
echo "========================================="

# Crear directorio de reportes si no existe
mkdir -p organized/reports/validation

# Generar timestamp
TIMESTAMP=$(date '+%Y%m%d_%H%M%S')

# Validar con ESLint
echo -e "\n1. Ejecutando ESLint..."
npx eslint src/**/*.js --no-error-on-unmatched-pattern > "organized/reports/validation/eslint_report_$TIMESTAMP.txt" 2>&1

# Contar errores
ERRORS=$(npx eslint src/**/*.js --no-error-on-unmatched-pattern 2>/dev/null | grep -c "error")
WARNINGS=$(npx eslint src/**/*.js --no-error-on-unmatched-pattern 2>/dev/null | grep -c "warning")

echo "Errores encontrados: $ERRORS"
echo "Advertencias encontradas: $WARNINGS"

# Aplicar correcciones automáticas con Prettier
echo -e "\n2. Aplicando Prettier para formateo automático..."
npx prettier --write "src/**/*.js" > "organized/reports/validation/prettier_log_$TIMESTAMP.txt" 2>&1

# Volver a validar después de correcciones
echo -e "\n3. Validando nuevamente después de correcciones..."
npx eslint src/**/*.js --no-error-on-unmatched-pattern > "organized/reports/validation/eslint_after_fix_$TIMESTAMP.txt" 2>&1

# Generar resumen
echo -e "\n========================================="
echo "RESUMEN DE VALIDACIÓN"
echo "========================================="
echo "Timestamp: $TIMESTAMP"
echo "Archivos procesados: $(find src -name '*.js' | wc -l)"
echo "Reportes generados en: organized/reports/validation/"
echo ""
echo "Archivos de reporte:"
echo "- eslint_report_$TIMESTAMP.txt"
echo "- prettier_log_$TIMESTAMP.txt"
echo "- eslint_after_fix_$TIMESTAMP.txt"