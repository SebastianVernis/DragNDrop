# AGENTS.md - Development Guidelines

## Commands

### Frontend (TypeScript)
- `npm run dev` - Start dev server
- `npm run build` - Build for production  
- `npm run type-check` - Type checking
- `npm run lint` - ESLint with TypeScript rules
- `npm run test` - Run Vitest tests
- `npm run test:ui` - Vitest UI
- `npm run test:coverage` - Test coverage

### Main Project (JavaScript)
- `npm run dev` - Start HTTP server on port 8080
- `npm run build` - Vite build
- `npm run test` - Jest unit tests
- `npm run test:watch` - Jest watch mode
- `npm run test:coverage` - Jest coverage
- `npm run test:e2e` - Playwright E2E tests
- `npm run test:e2e:ui` - Playwright UI
- `npm run test:e2e:debug` - Playwright debug

### Backend (Python)
- `uvicorn app.main:app --reload` - Start FastAPI dev server
- `pytest` - Run tests
- `pytest tests/unit/test_file.py::test_function` - Run single test

## Code Style

### TypeScript/JavaScript
- Use ES6+ imports/exports
- TypeScript strict mode enabled
- Path aliases: `@/` for src, `@components/`, `@utils/`, etc.
- Classes use PascalCase, functions camelCase
- Error handling with try/catch and proper logging
- Use JSDoc comments for complex functions

### Python
- Follow PEP 8 style
- Type hints required
- FastAPI dependency injection pattern
- Pydantic models for validation
- Async/await for I/O operations

### Testing
- Unit tests: Jest (JS), Vitest (TS), pytest (Python)
- E2E tests: Playwright
- Test files: `*.test.js`, `*.test.ts`, `test_*.py`
- Coverage reports required for new features

## Module Structure (v3.0)

### Core Modules (`src/core/`)
- `undoRedo.js` - Undo/Redo system with 50-state history
- `keyboardShortcuts.js` - 20+ keyboard shortcuts + command palette
- `responsiveTester.js` - Responsive design testing with 8 devices
- `livePreview.js` - Real-time preview in separate window
- `themeManager.js` - Dark/Light theme system
- `aiCodeGenerator.js` - AI code generation features
- **NEW** `geminiValidator.js` - Syntax validation using Gemini API (gemini-2.0-flash-lite)
- **NEW** `resizeManager.js` - Visual element resizing with 8 handles
- **NEW** `enhancedDragDrop.js` - Improved drag & drop with visual feedback
- **NEW** `projectAnalyzer.js` - Complete project/directory analysis and mapping

### Components (`src/components/`)
- `fileLoader.js` - File loading with drag & drop support
- `htmlParser.js` - HTML to JSON conversion with component detection

### Storage (`src/storage/`)
- `projectManager.js` - Project management with auto-save (30s)

### Utils (`src/utils/`)
- `componentExtractor.js` - Component extraction from imported HTML

### New Features (v3.0)
1. **Gemini Syntax Validator**:
   - Real-time syntax correction using Gemini API
   - Token-optimized prompts (max 512 tokens output)
   - No direct user interaction, only technical fixes
   - Requires API key configuration

2. **Visual Resize System**:
   - 8 resize handles (corners + edges)
   - Real-time dimension tooltip
   - Shift to preserve aspect ratio
   - ESC to cancel

3. **Enhanced Drag & Drop**:
   - Visual drag preview
   - Animated drop indicator
   - Highlighted drop zones
   - Drag handle UI element
   - Auto-scroll near edges

4. **Project Analyzer**:
   - Load complete directories
   - Detect framework (React, Vue, Angular, etc.)
   - Identify build tools (Vite, Webpack, etc.)
   - Parse file tree with size info
   - Import HTML files to canvas

### Guidelines
- All modules export globally via `window` object
- All modules include comprehensive JSDoc
- Use ES6+ module syntax
- Follow existing patterns in similar files
- New modules use direct fetch() for API calls (no external SDKs)