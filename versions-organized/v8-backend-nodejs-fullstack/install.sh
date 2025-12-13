#!/bin/bash

# DragNDrop Backend - Installation Script
# Automates the setup process

set -e

echo "🚀 DragNDrop Backend Installation"
echo "=================================="
echo ""

# Check Node.js version
echo "📦 Checking Node.js version..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Error: Node.js 18+ required. Current version: $(node -v)"
    exit 1
fi
echo "✅ Node.js version: $(node -v)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install
echo "✅ Dependencies installed"
echo ""

# Check for .env file
if [ ! -f .env ]; then
    echo "⚙️  Creating .env file..."
    cp .env.example .env
    echo "✅ .env file created"
    echo ""
    echo "⚠️  IMPORTANT: Edit .env file with your credentials:"
    echo "   - DATABASE_URL (Supabase PostgreSQL)"
    echo "   - BETTER_AUTH_SECRET (generate with: openssl rand -base64 32)"
    echo "   - OAuth credentials (optional)"
    echo ""
    echo "📖 See SETUP_GUIDE.md for detailed instructions"
    echo ""
    read -p "Press Enter when .env is configured..."
else
    echo "✅ .env file exists"
    echo ""
fi

# Test database connection
echo "🔌 Testing database connection..."
if node -e "import('./db/client.js').then(m => m.testConnection()).catch(() => process.exit(1))"; then
    echo "✅ Database connection successful"
else
    echo "❌ Database connection failed"
    echo "   Check DATABASE_URL in .env file"
    exit 1
fi
echo ""

# Generate migrations
echo "🗃️  Generating database migrations..."
npm run db:generate
echo "✅ Migrations generated"
echo ""

# Apply migrations
echo "🗃️  Applying migrations..."
npm run db:migrate
echo "✅ Migrations applied"
echo ""

# Run tests
echo "🧪 Running tests..."
if npm test; then
    echo "✅ All tests passed"
else
    echo "⚠️  Some tests failed (this is okay for first setup)"
fi
echo ""

echo "🎉 Installation Complete!"
echo "========================"
echo ""
echo "Next steps:"
echo "1. Start development server: npm run dev"
echo "2. Test API: curl http://localhost:3001/api/health"
echo "3. View API docs: http://localhost:3001/api"
echo ""
echo "📖 Documentation:"
echo "   - README.md - API documentation"
echo "   - SETUP_GUIDE.md - Detailed setup guide"
echo ""
echo "✨ Happy coding!"
