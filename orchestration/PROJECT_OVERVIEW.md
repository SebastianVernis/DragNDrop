# 🎨 DragNDrop Editor - Project Overview

**Version**: 4.0.0  
**Type**: Visual HTML Editor with Drag & Drop  
**Status**: Active Development  
**Architecture**: Modular Vanilla JavaScript  

---

## 🏗️ Project Structure

### Core Application
```
DragNDrop/
├── index.html              # Main entry point
├── script.js               # Core editor logic
├── style.css               # Base styles
├── package.json            # v4.0.0 configuration
│
├── src/                    # Source code
│   ├── core/              # Core modules (15+ files)
│   ├── components/        # UI components (20+ files)
│   ├── styles/            # Additional CSS
│   ├── ai/                # AI integrations
│   ├── reader/            # Project reader
│   ├── services/          # Backend services
│   ├── collaboration/     # Real-time features
│   ├── utils/             # Utilities
│   └── security/          # Security modules
│
├── tests/                  # Test suites
│   ├── unit/              # Unit tests (26 files)
│   ├── e2e/               # E2E tests
│   └── mobile.spec.js     # Mobile tests
│
├── lib/                    # NPM package core
├── bin/                    # CLI executables
├── docs/                   # Documentation
├── workflow-docs/          # Workflow guides
├── workflows/              # Automation scripts
└── orchestration/          # Task management (NEW)
```

---

## 🚀 Key Features Implemented

### ✅ Core Editor
- Drag & drop components
- Visual editing
- Properties panel
- Canvas management
- Element selection
- Copy/paste support

### ✅ Advanced Features
1. **Undo/Redo System** - 50-state history
2. **Keyboard Shortcuts** - 20+ shortcuts
3. **Responsive Tester** - 8 device presets
4. **Live Preview** - Real-time window
5. **Theme Manager** - Dark/Light modes
6. **Auto-save** - Every 30 seconds
7. **Component Library** - 50+ components

### ✅ Mobile-First (v3.2)
- Touch events support
- Gesture recognition
- Mobile UI adaptation
- Performance optimization
- Device detection

### ✅ AI Integration
- Gemini validation
- Component generation
- Accessibility checker
- SEO optimizer
- Code suggestions

### ✅ Recent Improvements (v3.2)
- Enhanced file loader with security
- Collapsible properties panel
- Visual drag overlay
- Progress bars
- Unified event system

---

## 📦 Package & Distribution

### NPM Package
```json
{
  "name": "dragndrop-editor",
  "version": "4.0.0",
  "main": "lib/server.js",
  "bin": {
    "dragndrop": "./bin/dragndrop.js"
  }
}
```

### Installation Methods
```bash
# Standalone
git clone https://github.com/SebastianVernis/DragNDrop.git

# NPM Package
npm install dragndrop-editor

# CLI Tool
npx dragndrop init my-project
```

### Framework Support
- ✅ Vanilla JavaScript
- ✅ React integration
- ✅ Vue integration
- ✅ Angular integration
- ✅ Svelte support

---

## 🧪 Testing & Quality

### Test Coverage
```
Test Suites: 11 total (4 failing)
Tests: 185 total (38 failing)
Coverage: ~40% (needs improvement)
```

### Quality Tools
- Jest for unit testing
- Playwright for E2E
- ESLint for linting
- Stylelint for CSS
- Vite for building

---

## 🔧 Technology Stack

### Frontend
- **Core**: Vanilla JavaScript ES6+
- **Styles**: CSS3 with CSS Variables
- **Build**: Vite
- **Server**: http-server (dev)

### Libraries
- Monaco Editor (code editing)
- Socket.io (real-time)
- Yjs (CRDT collaboration)
- Chokidar (file watching)
- Commander (CLI)

### Backend (Planned)
- Node.js + Express
- PostgreSQL + Drizzle
- Better Auth
- WebSockets

---

## 📋 Current Task Status

### Active Development
1. **Landing Page** - 0% (CRITICAL)
2. **Fix Failing Tests** - Blocking CI/CD
3. **Complete Dark Theme** - 90% done
4. **Unify Task Management** - In progress

### Completed Features
- ✅ Mobile adaptation
- ✅ Touch gestures
- ✅ Device detection
- ✅ Enhanced file loading
- ✅ Properties panel v3.2
- ✅ Security improvements

### Upcoming (Roadmap v1.0)
- Layer system
- Multi-selection
- Guides & rulers
- Real-time collaboration
- IDE integration
- Cloud sync

---

## 🌐 Deployment & Distribution

### Current
- GitHub Pages (demo)
- NPM Registry (package)
- Local development

### Planned
- Vercel deployment
- CDN distribution
- Docker container
- Cloud hosting

---

## 👥 Project Management

### Old Systems (Deprecated)
- GitHub Issues (27 closed)
- Local tasks in /tasks/
- Workflow docs

### New System (Active)
```
/orchestration/
├── ORCHESTRATOR.md     # Central control
├── TASK_QUEUE.md       # Unified tasks
├── agents/             # Multi-agent system
└── status/             # Real-time metrics
```

---

## 🎯 Immediate Priorities

1. **Fix failing tests** (38 tests blocking)
2. **Implement landing page** (3-day deadline)
3. **Complete documentation** (hidden features)
4. **Achieve 80% test coverage**
5. **Deploy to production**

---

## 📊 Project Metrics

- **Files**: 150+ JavaScript files
- **LOC**: ~50,000 lines
- **Tests**: 185 tests (147 passing)
- **Components**: 50+ UI components
- **Documentation**: 80+ MD files
- **Contributors**: 1 (Sebastian Vernis)

---

## 🔗 Resources

- **Repository**: https://github.com/SebastianVernis/DragNDrop
- **Issues**: GitHub Issues (closed)
- **Documentation**: /docs/
- **Workflow**: /orchestration/

---

**Last Updated**: 2025-12-09  
**Next Review**: 2025-12-10