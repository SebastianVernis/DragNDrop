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