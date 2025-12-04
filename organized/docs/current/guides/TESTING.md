# Guía de Testing - DragNDrop

## 🧪 Estrategia de Testing

### Pirámide de Testing

```
        /\
       /  \
      / E2E \     ← Pocos tests, alta confianza
     /______\
    /        \
   /Integration\ ← Tests moderados, funcionalidad
  /__________\
 /            \
/    Unit      \ ← Muchos tests, rápidos
/______________\
```

### Tipos de Tests

#### 1. **Unit Tests** (70%)
- Funciones individuales
- Componentes aislados
- Lógica de negocio
- Utilidades

#### 2. **Integration Tests** (20%)
- Interacción entre componentes
- Flujos de datos
- APIs internas

#### 3. **End-to-End Tests** (10%)
- Flujos completos de usuario
- Funcionalidad crítica
- Cross-browser testing

## 🛠️ Configuración de Testing

### Jest (Unit & Integration Tests)

```javascript
// tests/jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testMatch: [
    '<rootDir>/tests/unit/**/*.test.js',
    '<rootDir>/tests/integration/**/*.test.js'
  ],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
    '!src/templates/**'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
};
```

### Playwright (E2E Tests)

```javascript
// tests/playwright.config.js
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://127.0.0.1:8080',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] }
    }
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://127.0.0.1:8080',
    reuseExistingServer: !process.env.CI
  }
});
```

## 📝 Unit Tests

### Estructura de Unit Tests

```
tests/unit/
├── core/
│   ├── editor.test.js
│   ├── canvas.test.js
│   ├── toolbar.test.js
│   └── properties.test.js
├── components/
│   ├── fileLoader.test.js
│   ├── htmlParser.test.js
│   └── componentExtractor.test.js
├── storage/
│   └── projectManager.test.js
└── utils/
    ├── helpers.test.js
    └── constants.test.js
```

### Ejemplo de Unit Test

```javascript
// tests/unit/core/editor.test.js
import { Editor } from '@/core/editor.js';
import { ComponentFactory } from '@/components/componentFactory.js';

describe('Editor', () => {
  let editor;
  let mockCanvas;

  beforeEach(() => {
    // Setup DOM
    document.body.innerHTML = `
      <div id="editor">
        <div id="canvas"></div>
        <div id="properties"></div>
      </div>
    `;
    
    mockCanvas = document.getElementById('canvas');
    editor = new Editor(mockCanvas);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('initialization', () => {
    it('should initialize with default state', () => {
      expect(editor.selectedElement).toBeNull();
      expect(editor.components).toEqual([]);
      expect(editor.canvas).toBe(mockCanvas);
    });

    it('should setup event listeners', () => {
      const spy = jest.spyOn(editor, 'setupEventListeners');
      editor.init();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('component creation', () => {
    it('should create component with correct properties', () => {
      const componentData = {
        type: 'button',
        text: 'Click me',
        className: 'btn-primary'
      };

      const component = editor.createComponent(componentData);
      
      expect(component.tagName).toBe('BUTTON');
      expect(component.textContent).toBe('Click me');
      expect(component.className).toContain('btn-primary');
    });

    it('should add component to canvas', () => {
      const component = editor.createComponent({ type: 'div' });
      editor.addToCanvas(component);
      
      expect(mockCanvas.children).toContain(component);
      expect(editor.components).toContain(component);
    });
  });

  describe('element selection', () => {
    it('should select element and update properties panel', () => {
      const element = document.createElement('div');
      element.id = 'test-element';
      mockCanvas.appendChild(element);

      editor.selectElement(element);

      expect(editor.selectedElement).toBe(element);
      expect(element.classList).toContain('selected');
    });

    it('should deselect previous element when selecting new one', () => {
      const element1 = document.createElement('div');
      const element2 = document.createElement('div');
      mockCanvas.appendChild(element1);
      mockCanvas.appendChild(element2);

      editor.selectElement(element1);
      editor.selectElement(element2);

      expect(element1.classList).not.toContain('selected');
      expect(element2.classList).toContain('selected');
      expect(editor.selectedElement).toBe(element2);
    });
  });

  describe('drag and drop', () => {
    it('should handle dragstart event', () => {
      const element = document.createElement('div');
      const event = new DragEvent('dragstart', {
        dataTransfer: new DataTransfer()
      });

      editor.handleDragStart(event, element);

      expect(event.dataTransfer.getData('text/html')).toBe(element.outerHTML);
    });

    it('should handle drop event and create component', () => {
      const dropEvent = new DragEvent('drop', {
        dataTransfer: new DataTransfer()
      });
      dropEvent.dataTransfer.setData('component-type', 'button');

      editor.handleDrop(dropEvent);

      expect(mockCanvas.children.length).toBe(1);
      expect(mockCanvas.children[0].tagName).toBe('BUTTON');
    });
  });
});
```

### Testing Utilities

```javascript
// tests/utils/testHelpers.js
export const createMockElement = (tag = 'div', attributes = {}) => {
  const element = document.createElement(tag);
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
  return element;
};

export const createMockEvent = (type, properties = {}) => {
  const event = new Event(type);
  Object.assign(event, properties);
  return event;
};

export const waitFor = (condition, timeout = 1000) => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const check = () => {
      if (condition()) {
        resolve();
      } else if (Date.now() - startTime > timeout) {
        reject(new Error('Timeout waiting for condition'));
      } else {
        setTimeout(check, 10);
      }
    };
    check();
  });
};

export const mockLocalStorage = () => {
  const store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn(key => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach(key => delete store[key]);
    })
  };
};
```

## 🔗 Integration Tests

### Ejemplo de Integration Test

```javascript
// tests/integration/drag-drop.test.js
import { Editor } from '@/core/editor.js';
import { ComponentLibrary } from '@/components/componentLibrary.js';

describe('Drag & Drop Integration', () => {
  let editor;
  let componentLibrary;
  let canvas;

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="app">
        <div id="component-library"></div>
        <div id="canvas"></div>
        <div id="properties"></div>
      </div>
    `;

    canvas = document.getElementById('canvas');
    componentLibrary = new ComponentLibrary(
      document.getElementById('component-library')
    );
    editor = new Editor(canvas);
    
    editor.init();
    componentLibrary.init();
  });

  it('should complete full drag and drop workflow', async () => {
    // 1. Get draggable component from library
    const buttonComponent = componentLibrary.getComponent('button');
    expect(buttonComponent).toBeTruthy();

    // 2. Simulate drag start
    const dragStartEvent = new DragEvent('dragstart', {
      dataTransfer: new DataTransfer()
    });
    buttonComponent.dispatchEvent(dragStartEvent);

    // 3. Simulate drag over canvas
    const dragOverEvent = new DragEvent('dragover', {
      dataTransfer: dragStartEvent.dataTransfer
    });
    canvas.dispatchEvent(dragOverEvent);

    // 4. Simulate drop on canvas
    const dropEvent = new DragEvent('drop', {
      dataTransfer: dragStartEvent.dataTransfer
    });
    canvas.dispatchEvent(dropEvent);

    // 5. Verify component was created and added
    await waitFor(() => canvas.children.length > 0);
    
    const createdButton = canvas.querySelector('button');
    expect(createdButton).toBeTruthy();
    expect(createdButton.textContent).toBe('Button');
  });

  it('should update properties panel when element is selected', async () => {
    // Create and add component
    const component = editor.createComponent({ type: 'div', id: 'test-div' });
    editor.addToCanvas(component);

    // Select component
    component.click();

    // Wait for properties panel to update
    await waitFor(() => {
      const propertiesPanel = document.getElementById('properties');
      return propertiesPanel.children.length > 0;
    });

    const idInput = document.querySelector('input[name="id"]');
    expect(idInput.value).toBe('test-div');
  });
});
```

## 🌐 End-to-End Tests

### Ejemplo de E2E Test

```javascript
// tests/e2e/editor.spec.js
import { test, expect } from '@playwright/test';

test.describe('DragNDrop Editor', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should load editor with all panels', async ({ page }) => {
    // Check main panels are visible
    await expect(page.locator('#component-library')).toBeVisible();
    await expect(page.locator('#canvas')).toBeVisible();
    await expect(page.locator('#properties')).toBeVisible();

    // Check toolbar is present
    await expect(page.locator('.toolbar')).toBeVisible();
  });

  test('should create component via drag and drop', async ({ page }) => {
    // Get button component from library
    const buttonComponent = page.locator('[data-component="button"]');
    await expect(buttonComponent).toBeVisible();

    // Get canvas
    const canvas = page.locator('#canvas');
    
    // Perform drag and drop
    await buttonComponent.dragTo(canvas);

    // Verify button was created
    const createdButton = canvas.locator('button');
    await expect(createdButton).toBeVisible();
    await expect(createdButton).toHaveText('Button');
  });

  test('should edit component properties', async ({ page }) => {
    // Create a button component
    await page.locator('[data-component="button"]').dragTo(page.locator('#canvas'));
    
    // Select the created button
    await page.locator('#canvas button').click();

    // Wait for properties panel to load
    await page.waitForSelector('#properties input[name="text"]');

    // Change button text
    await page.fill('#properties input[name="text"]', 'Custom Button');

    // Verify text changed in canvas
    await expect(page.locator('#canvas button')).toHaveText('Custom Button');
  });

  test('should export project as HTML', async ({ page }) => {
    // Create some components
    await page.locator('[data-component="button"]').dragTo(page.locator('#canvas'));
    await page.locator('[data-component="heading"]').dragTo(page.locator('#canvas'));

    // Click export button
    const downloadPromise = page.waitForEvent('download');
    await page.click('[data-action="export-html"]');
    const download = await downloadPromise;

    // Verify download
    expect(download.suggestedFilename()).toBe('project.html');
  });

  test('should work in responsive mode', async ({ page }) => {
    // Create a component
    await page.locator('[data-component="button"]').dragTo(page.locator('#canvas'));

    // Switch to tablet view
    await page.click('[data-view="tablet"]');
    
    // Verify canvas size changed
    const canvas = page.locator('#canvas');
    const canvasBox = await canvas.boundingBox();
    expect(canvasBox.width).toBeLessThan(1200); // Desktop width

    // Switch to mobile view
    await page.click('[data-view="mobile"]');
    
    // Verify canvas size changed again
    const mobileCanvasBox = await canvas.boundingBox();
    expect(mobileCanvasBox.width).toBeLessThan(canvasBox.width);
  });

  test('should save and load project', async ({ page }) => {
    // Create components
    await page.locator('[data-component="button"]').dragTo(page.locator('#canvas'));
    await page.locator('[data-component="heading"]').dragTo(page.locator('#canvas'));

    // Save project
    await page.click('[data-action="save-project"]');
    
    // Clear canvas
    await page.click('[data-action="new-project"]');
    await expect(page.locator('#canvas')).toBeEmpty();

    // Load project
    const fileInput = page.locator('input[type="file"]');
    // Note: In real test, you'd upload a saved file
    
    // Verify components are restored
    // This would require actual file handling in the test
  });
});
```

### Visual Regression Tests

```javascript
// tests/e2e/visual.spec.js
import { test, expect } from '@playwright/test';

test.describe('Visual Regression Tests', () => {
  test('should match editor layout screenshot', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Hide dynamic elements
    await page.addStyleTag({
      content: '.timestamp, .version { display: none !important; }'
    });

    await expect(page).toHaveScreenshot('editor-layout.png');
  });

  test('should match component library screenshot', async ({ page }) => {
    await page.goto('/');
    const componentLibrary = page.locator('#component-library');
    
    await expect(componentLibrary).toHaveScreenshot('component-library.png');
  });

  test('should match responsive views', async ({ page }) => {
    await page.goto('/');
    
    // Desktop view
    await expect(page.locator('#canvas')).toHaveScreenshot('canvas-desktop.png');
    
    // Tablet view
    await page.click('[data-view="tablet"]');
    await expect(page.locator('#canvas')).toHaveScreenshot('canvas-tablet.png');
    
    // Mobile view
    await page.click('[data-view="mobile"]');
    await expect(page.locator('#canvas')).toHaveScreenshot('canvas-mobile.png');
  });
});
```

## 📊 Coverage & Reporting

### Coverage Configuration

```javascript
// tests/jest.config.js - Coverage settings
module.exports = {
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    },
    './src/core/': {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    }
  }
};
```

### Test Scripts

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:unit": "jest tests/unit",
    "test:integration": "jest tests/integration",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:visual": "playwright test tests/e2e/visual.spec.js",
    "test:all": "npm run test:coverage && npm run test:e2e"
  }
}
```

## 🚀 Continuous Integration

### GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run test:coverage
      
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
      
      - uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

## 📋 Testing Checklist

### Pre-commit Checklist
- [ ] All unit tests pass
- [ ] Coverage threshold met (80%+)
- [ ] Integration tests pass
- [ ] ESLint passes
- [ ] No console errors

### Pre-release Checklist
- [ ] All tests pass (unit, integration, e2e)
- [ ] Visual regression tests pass
- [ ] Cross-browser testing complete
- [ ] Performance tests pass
- [ ] Accessibility tests pass
- [ ] Manual testing complete

### Test Maintenance
- [ ] Remove obsolete tests
- [ ] Update test data
- [ ] Review test coverage
- [ ] Update test documentation
- [ ] Optimize slow tests