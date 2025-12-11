/**
 * Code Editor E2E Tests
 * Tests for Monaco Editor integration
 */

const { test, expect } = require('@playwright/test');

test.describe('Code Editor', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8080');
    await page.waitForLoadState('networkidle');
  });

  test('should load Monaco Editor successfully', async ({ page }) => {
    // Wait for Monaco Editor to load
    const editor = await page.locator('.monaco-editor').first();
    await expect(editor).toBeVisible({ timeout: 10000 });
    
    // Check if editor is interactive
    await editor.click();
    await page.keyboard.type('test');
    
    const content = await page.evaluate(() => {
      return window.monacoEditor?.getValue() || '';
    });
    
    expect(content).toContain('test');
  });

  test('should initialize within 2 seconds', async ({ page }) => {
    const startTime = Date.now();
    
    await page.locator('.monaco-editor').first().waitFor({ timeout: 10000 });
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(2000);
  });

  test('should support HTML language mode', async ({ page }) => {
    const editor = await page.locator('.monaco-editor').first();
    await expect(editor).toBeVisible();
    
    // Type HTML code
    await editor.click();
    await page.keyboard.type('<div>Hello World</div>');
    
    // Check syntax highlighting
    const hasHighlighting = await page.evaluate(() => {
      const tokens = document.querySelectorAll('.monaco-editor .mtk1, .monaco-editor .mtk2');
      return tokens.length > 0;
    });
    
    expect(hasHighlighting).toBeTruthy();
  });

  test('should support CSS language mode', async ({ page }) => {
    // Switch to CSS mode
    await page.evaluate(() => {
      if (window.monacoEditor) {
        window.monacoEditor.setLanguage('css');
      }
    });
    
    const editor = await page.locator('.monaco-editor').first();
    await editor.click();
    await page.keyboard.type('.container { display: flex; }');
    
    const content = await page.evaluate(() => {
      return window.monacoEditor?.getValue() || '';
    });
    
    expect(content).toContain('display: flex');
  });

  test('should support JavaScript language mode', async ({ page }) => {
    // Switch to JavaScript mode
    await page.evaluate(() => {
      if (window.monacoEditor) {
        window.monacoEditor.setLanguage('javascript');
      }
    });
    
    const editor = await page.locator('.monaco-editor').first();
    await editor.click();
    await page.keyboard.type('const x = 10;');
    
    const content = await page.evaluate(() => {
      return window.monacoEditor?.getValue() || '';
    });
    
    expect(content).toContain('const x = 10');
  });

  test('should format document with Shift+Alt+F', async ({ page }) => {
    const editor = await page.locator('.monaco-editor').first();
    await editor.click();
    
    // Type unformatted code
    await page.keyboard.type('<div><p>Test</p></div>');
    
    // Format document
    await page.keyboard.press('Shift+Alt+F');
    
    // Wait for formatting
    await page.waitForTimeout(500);
    
    const content = await page.evaluate(() => {
      return window.monacoEditor?.getValue() || '';
    });
    
    // Check if code is formatted (has line breaks)
    expect(content).toMatch(/\n/);
  });

  test('should save with Ctrl+S', async ({ page }) => {
    const editor = await page.locator('.monaco-editor').first();
    await editor.click();
    await page.keyboard.type('test content');
    
    // Listen for save event
    const savePromise = page.evaluate(() => {
      return new Promise(resolve => {
        window.addEventListener('editor-save', () => resolve(true));
        setTimeout(() => resolve(false), 2000);
      });
    });
    
    await page.keyboard.press('Control+S');
    
    const saved = await savePromise;
    expect(saved).toBeTruthy();
  });

  test('should toggle minimap', async ({ page }) => {
    // Check if minimap is visible
    const minimapBefore = await page.locator('.monaco-editor .minimap').isVisible();
    
    // Toggle minimap
    await page.evaluate(() => {
      if (window.monacoEditor) {
        window.monacoEditor.toggleMinimap();
      }
    });
    
    await page.waitForTimeout(300);
    
    const minimapAfter = await page.locator('.monaco-editor .minimap').isVisible();
    
    expect(minimapBefore).not.toBe(minimapAfter);
  });

  test('should handle large files efficiently', async ({ page }) => {
    const largeContent = '<div>\n' + '  <p>Line</p>\n'.repeat(1000) + '</div>';
    
    const startTime = Date.now();
    
    await page.evaluate((content) => {
      if (window.monacoEditor) {
        window.monacoEditor.setValue(content);
      }
    }, largeContent);
    
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(1000);
  });

  test('should support multi-cursor editing', async ({ page }) => {
    const editor = await page.locator('.monaco-editor').first();
    await editor.click();
    
    // Type initial text
    await page.keyboard.type('line1\nline2\nline3');
    
    // Select all
    await page.keyboard.press('Control+A');
    
    // Add cursor to each line (Ctrl+Shift+L)
    await page.keyboard.press('Control+Shift+L');
    
    // Type at all cursors
    await page.keyboard.type('test');
    
    const content = await page.evaluate(() => {
      return window.monacoEditor?.getValue() || '';
    });
    
    // Should have 'test' on multiple lines
    const testCount = (content.match(/test/g) || []).length;
    expect(testCount).toBeGreaterThan(1);
  });

  test('should resize editor on window resize', async ({ page }) => {
    const editor = await page.locator('.monaco-editor').first();
    await expect(editor).toBeVisible();
    
    // Get initial size
    const initialSize = await editor.boundingBox();
    
    // Resize window
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.waitForTimeout(300);
    
    // Get new size
    const newSize = await editor.boundingBox();
    
    expect(newSize.width).not.toBe(initialSize.width);
  });
});
