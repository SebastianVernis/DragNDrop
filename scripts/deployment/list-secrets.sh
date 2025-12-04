#!/bin/bash

# ================================================
# List Secrets in Cloudflare Pages
# ================================================
# Lista todos los secrets configurados

PROJECT_NAME="dragndrop-editor"

echo "🔐 Secrets configurados en Cloudflare Pages:"
echo "Project: ${PROJECT_NAME}"
echo ""

wrangler pages secret list --project-name="$PROJECT_NAME"
