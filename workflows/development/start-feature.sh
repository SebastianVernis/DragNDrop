#!/bin/bash

# Script: Start Feature Development
# Usage: ./workflows/development/start-feature.sh "feature-name"

set -e

FEATURE_NAME=$1

if [ -z "$FEATURE_NAME" ]; then
    echo "❌ Error: Feature name required"
    echo "Usage: ./workflows/development/start-feature.sh \"feature-name\""
    exit 1
fi

echo "🚀 Starting feature development: $FEATURE_NAME"
echo ""

# 1. Create feature branch
echo "📝 Creating feature branch..."
git checkout develop 2>/dev/null || git checkout master
git pull
git checkout -b "feature/$FEATURE_NAME"
echo "✅ Branch created: feature/$FEATURE_NAME"
echo ""

# 2. Create task file from template
echo "📋 Creating task file..."
TASK_FILE="tasks/active/feature-$FEATURE_NAME.task.md"
cp tasks/templates/feature.task.md "$TASK_FILE"

# Update task file with feature name
sed -i "s/\[NOMBRE DE LA FEATURE\]/$FEATURE_NAME/g" "$TASK_FILE"
sed -i "s/YYYY-MM-DD/$(date +%Y-%m-%d)/g" "$TASK_FILE"

echo "✅ Task file created: $TASK_FILE"
echo ""

# 3. Run tests to ensure starting from clean state
echo "🧪 Running tests..."
npm test
echo "✅ Tests passing - clean starting state"
echo ""

# 4. Open files in editor
echo "📂 Opening workspace..."
code "$TASK_FILE"
code .

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Feature development environment ready!"
echo ""
echo "📋 Task file: $TASK_FILE"
echo "🌿 Branch: feature/$FEATURE_NAME"
echo ""
echo "Next steps:"
echo "  1. Edit task file with specifications"
echo "  2. Implement feature"
echo "  3. Write tests"
echo "  4. Update docs"
echo "  5. Run: ./workflows/development/complete-feature.sh"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
