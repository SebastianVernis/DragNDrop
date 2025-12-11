/**
 * Error Detection E2E Tests
 * Tests for real-time error detection and validation
 */

const { test, expect } = require('@playwright/test');

test.describe('Error Detection', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8080');
    await page.waitForLoadState('networkidle');
    await page.locator('.monaco-editor').first().waitFor({ timeout: 10000 });
  });

  test('should detect unclosed HTML tags', async ({ page }) => {
    const editor = await page.locator('.monaco-editor').first();
    await editor.click();
    
    // Type unclosed tag
    await page.keyboard.type('<div>\n  <p>Test\n</div>');
    
    // Wait for error detection
    await page.waitForTimeout(500);
    
    // Check for error markers
    const hasErrors = await page.evaluate(() => {
      const markers = document.querySelectorAll('.monaco-editor .squiggly-error');
      return markers.length > 0;
    });
    
    expect(hasErrors).toBeTruthy();
  });

  test('should detect mismatched HTML tags', async ({ page }) => {
    const editor = await page.locator('.monaco-editor').first();
    await editor.click();
    
    // Type mismatched tags
    await page.keyboard.type('<div>\n  <p>Test</span>\n</div>');
    
    // Wait for error detection
    await page.waitForTimeout(500);
    
    // Check for error markers
    const hasErrors = await page.evaluate(() => {
      const markers = document.querySelectorAll('.monaco-editor .squiggly-error');
      return markers.length > 0;
    });
    
    expect(hasErrors).toBeTruthy();
  });

  test('should detect missing semicolons in CSS', async ({ page }) => {
    // Switch to CSS mode
    await page.evaluate(() => {
      if (window.monacoEditor) {
        window.monacoEditor.setLanguage('css');
      }
    });
    
    const editor = await page.locator('.monaco-editor').first();
    await editor.click();
    
    // Type CSS without semicolon
    await page.keyboard.type('.container {\n  display: flex\n}');
    
    // Wait for error detection
    await page.waitForTimeout(500);
    
    // Check for error markers
    const hasErrors = await page.evaluate(() => {
      const markers = document.querySelectorAll('.monaco-editor .squiggly-error, .monaco-editor .squiggly-warning');
      return markers.length > 0;
    });
    
    expect(hasErrors).toBeTruthy();
  });

  test('should detect unmatched braces in CSS', async ({ page }) => {
    // Switch to CSS mode
    await page.evaluate(() => {
      if (window.monacoEditor) {
        window.monacoEditor.setLanguage('css');
      }
    });
    
    const editor = await page.locator('.monaco-editor').first();
    await editor.click();
    
    // Type CSS with unmatched brace
    await page.keyboard.type('.container {\n  display: flex;\n');
    
    // Wait for error detection
    await page.waitForTimeout(500);
    
    // Check for error markers
    const hasErrors = await page.evaluate(() => {
      const markers = document.querySelectorAll('.monaco-editor .squiggly-error');
      return markers.length > 0;
    });
    
    expect(hasErrors).toBeTruthy();
  });

  test('should detect JavaScript syntax errors', async ({ page }) => {
    // Switch to JavaScript mode
    await page.evaluate(() => {
      if (window.monacoEditor) {
        window.monacoEditor.setLanguage('javascript');
      }
    });
    
    const editor = await page.locator('.monaco-editor').first();
    await editor.click();
    
    // Type invalid JavaScript
    await page.keyboard.type('const x = ;');
    
    // Wait for error detection
    await page.waitForTimeout(500);
    
    // Check for error markers
    const hasErrors = await page.evaluate(() => {
      const markers = document.querySelectorAll('.monaco-editor .squiggly-error');
      return markers.length > 0;
    });
    
    expect(hasErrors).toBeTruthy();
  });

  test('should detect unmatched parentheses in JavaScript', async ({ page }) => {
    // Switch to JavaScript mode
    await page.evaluate(() => {
      if (window.monacoEditor) {
        window.monacoEditor.setLanguage('javascript');
      }
    });
    
    const editor = await page.locator('.monaco-editor').first();
    await editor.click();
    
    // Type unmatched parentheses
    await page.keyboard.type('function test() {\n  console.log("test"\n}');
    
    // Wait for error detection
    await page.waitForTimeout(500);
    
    // Check for error markers
    const hasErrors = await page.evaluate(() => {
      const markers = document.querySelectorAll('.monaco-editor .squiggly-error');
      return markers.length > 0;
    });
    
    expect(hasErrors).toBeTruthy();
  });

  test('should detect errors within 500ms', async ({ page }) => {
    const editor = await page.locator('.monaco-editor').first();
    await editor.click();
    
    const startTime = Date.now();
    
    // Type invalid code
    await page.keyboard.type('<div><p>Test</div>');
    
    // Wait for error detection
    await page.waitForSelector('.monaco-editor .squiggly-error', { timeout: 1000 });
    
    const detectionTime = Date.now() - startTime;
    
    expect(detectionTime).toBeLessThan(500);
  });

  test('should show error message on hover', async ({ page }) => {
    const editor = await page.locator('.monaco-editor').first();
    await editor.click();
    
    // Type invalid code
    await page.keyboard.type('<div><p>Test</div>');
    
    // Wait for error detection
    await page.waitForTimeout(500);
    
    // Hover over error
    const errorMarker = await page.locator('.monaco-editor .squiggly-error').first();
    await errorMarker.hover();
    
    // Wait for tooltip
    await page.waitForTimeout(300);
    
    // Check if hover widget is visible
    const hasHoverWidget = await page.locator('.monaco-editor .monaco-hover').isVisible();
    expect(hasHoverWidget).toBeTruthy();
  });

  test('should clear errors when code is fixed', async ({ page }) => {
    const editor = await page.locator('.monaco-editor').first();
    await editor.click();
    
    // Type invalid code
    await page.keyboard.type('<div><p>Test</div>');
    
    // Wait for error detection
    await page.waitForTimeout(500);
    
    // Check for errors
    let hasErrors = await page.evaluate(() => {
      return document.querySelectorAll('.monaco-editor .squiggly-error').length > 0;
    });
    expect(hasErrors).toBeTruthy();
    
    // Fix the code
    await page.keyboard.press('Control+A');
    await page.keyboard.type('<div><p>Test</p></div>');
    
    // Wait for re-validation
    await page.waitForTimeout(500);
    
    // Check that errors are cleared
    hasErrors = await page.evaluate(() => {
      return document.querySelectorAll('.monaco-editor .squiggly-error').length > 0;
    });
    expect(hasErrors).toBeFalsy();
  });

  test('should show multiple errors simultaneously', async ({ page }) => {
    const editor = await page.locator('.monaco-editor').first();
    await editor.click();
    
    // Type code with multiple errors
    await page.keyboard.type('<div>\n<p>Test\n<span>More\n</div>');
    
    // Wait for error detection
    await page.waitForTimeout(500);
    
    // Count error markers
    const errorCount = await page.evaluate(() => {
      return document.querySelectorAll('.monaco-editor .squiggly-error').length;
    });
    
    expect(errorCount).toBeGreaterThan(1);
  });

  test('should update problems panel with errors', async ({ page }) => {
    const editor = await page.locator('.monaco-editor').first();
    await editor.click();
    
    // Type invalid code
    await page.keyboard.type('<div><p>Test</div>');
    
    // Wait for error detection
    await page.waitForTimeout(500);
    
    // Check problems panel
    const problemsPanel = await page.locator('.problems-panel');
    if (await problemsPanel.isVisible()) {
      const problemItems = await page.locator('.problems-item').count();
      expect(problemItems).toBeGreaterThan(0);
    }
  });

  test('should distinguish between errors and warnings', async ({ page }) => {
    // Switch to CSS mode
    await page.evaluate(() => {
      if (window.monacoEditor) {
        window.monacoEditor.setLanguage('css');
      }
    });
    
    const editor = await page.locator('.monaco-editor').first();
    await editor.click();
    
    // Type CSS with warnings
    await page.keyboard.type('.container {\n  display: flex;\n  -webkit-box-shadow: 0 0 5px;\n}');
    
    // Wait for validation
    await page.waitForTimeout(500);
    
    // Check for warning markers
    const hasWarnings = await page.evaluate(() => {
      return document.querySelectorAll('.monaco-editor .squiggly-warning').length > 0;
    });
    
    expect(hasWarnings).toBeTruthy();
  });

  test('should validate on paste', async ({ page }) => {
    const editor = await page.locator('.monaco-editor').first();
    await editor.click();
    
    // Paste invalid code
    await page.evaluate(() => {
      const invalidCode = '<div><p>Test</div>';
      navigator.clipboard.writeText(invalidCode);
    });
    
    await page.keyboard.press('Control+V');
    
    // Wait for error detection
    await page.waitForTimeout(500);
    
    // Check for errors
    const hasErrors = await page.evaluate(() => {
      return document.querySelectorAll('.monaco-editor .squiggly-error').length > 0;
    });
    
    expect(hasErrors).toBeTruthy();
  });
});
