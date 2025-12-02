#!/bin/bash

# ================================================
# Delete Secret from Cloudflare Pages
# ================================================
# Elimina un secret específico

PROJECT_NAME="dragndrop-editor"

if [ -z "$1" ]; then
    echo "❌ Error: Debes especificar el nombre del secret"
    echo "Uso: ./delete-secret.sh <SECRET_NAME>"
    exit 1
fi

SECRET_NAME=$1

echo "🗑️  Eliminando secret: $SECRET_NAME"
echo "Project: ${PROJECT_NAME}"
echo ""

wrangler pages secret delete "$SECRET_NAME" --project-name="$PROJECT_NAME"
