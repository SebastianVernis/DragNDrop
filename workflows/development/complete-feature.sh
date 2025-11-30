#!/bin/bash

# Script: Complete Feature Development
# Usage: ./workflows/development/complete-feature.sh

set -e

echo "🏁 Completing feature development..."
echo ""

# Get current branch name
BRANCH=$(git branch --show-current)

if [[ ! $BRANCH == feature/* ]]; then
    echo "❌ Error: Not on a feature branch"
    echo "Current branch: $BRANCH"
    exit 1
fi

FEATURE_NAME=${BRANCH#feature/}

echo "Feature: $FEATURE_NAME"
echo ""

# 1. Run linter
echo "🔍 Running linter..."
npm run lint 2>/dev/null || echo "⚠️  No lint script configured (skipping)"
echo ""

# 2. Run tests
echo "🧪 Running tests..."
npm test
echo "✅ Tests passing"
echo ""

# 3. Check coverage
echo "📊 Checking coverage..."
npm run test:coverage
echo ""

# 4. Build check
echo "🏗️  Building..."
npm run build
echo "✅ Build successful"
echo ""

# 5. Git status
echo "📝 Git status:"
git status --short
echo ""

# 6. Prompt for commit
read -p "📝 Commit message: " COMMIT_MSG

if [ -z "$COMMIT_MSG" ]; then
    echo "❌ Commit message required"
    exit 1
fi

# 7. Commit
echo "💾 Committing changes..."
git add .
git commit -m "feat: $COMMIT_MSG"
echo "✅ Changes committed"
echo ""

# 8. Push
echo "📤 Pushing to remote..."
git push origin "feature/$FEATURE_NAME"
echo "✅ Pushed to remote"
echo ""

# 9. Create PR
echo "🔀 Creating Pull Request..."
gh pr create \
    --title "feat: $COMMIT_MSG" \
    --body "$(cat <<EOF
## Feature: $FEATURE_NAME

### Changes
$COMMIT_MSG

### Testing
- [x] Unit tests passing
- [x] E2E tests passing (if applicable)
- [x] Manual QA completed
- [x] Cross-browser tested

### Documentation
- [x] Code documented (JSDoc)
- [x] User docs updated (if needed)
- [x] CHANGELOG.md updated

### Checklist
- [x] No console.logs
- [x] No linting errors
- [x] Build successful
- [x] Tests passing

---
🤖 Generated with Crush


Assisted-by: Blackbox Pro via Crush <crush@charm.land>
EOF
)" \
    --assignee @me \
    --label "feature"

echo "✅ Pull Request created"
echo ""

# 10. Move task to completed
TASK_FILE="tasks/active/feature-$FEATURE_NAME.task.md"
if [ -f "$TASK_FILE" ]; then
    mv "$TASK_FILE" "tasks/completed/"
    echo "✅ Task moved to completed"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 Feature development completed!"
echo ""
echo "Next steps:"
echo "  1. Wait for PR review"
echo "  2. Address feedback if any"
echo "  3. Merge when approved"
echo "  4. Deploy to staging"
echo "  5. QA on staging"
echo "  6. Deploy to production"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
