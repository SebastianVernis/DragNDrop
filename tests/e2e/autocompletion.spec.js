/**
 * Autocompletion E2E Tests
 * Tests for IntelliSense and code completion
 */

const { test, expect } = require('@playwright/test');

test.describe('Autocompletion', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8080');
    await page.waitForLoadState('networkidle');
    await page.locator('.monaco-editor').first().waitFor({ timeout: 10000 });
  });

  test('should show HTML tag completions', async ({ page }) => {
    const editor = await page.locator('.monaco-editor').first();
    await editor.click();
    
    // Type opening bracket
    await page.keyboard.type('<d');
    
    // Wait for suggestions
    await page.waitForTimeout(500);
    
    // Check if suggestion widget is visible
    const suggestions = await page.locator('.monaco-editor .suggest-widget').isVisible();
    expect(suggestions).toBeTruthy();
    
    // Check if 'div' is in suggestions
    const hasDivSuggestion = await page.evaluate(() => {
      const items = document.querySelectorAll('.monaco-editor .suggest-widget .monaco-list-row');
      return Array.from(items).some(item => item.textContent.includes('div'));
    });
    
    expect(hasDivSuggestion).toBeTruthy();
  });

  test('should show HTML attribute completions', async ({ page }) => {
    const editor = await page.locator('.monaco-editor').first();
    await editor.click();
    
    // Type tag with space
    await page.keyboard.type('<div ');
    
    // Wait for suggestions
    await page.waitForTimeout(500);
    
    // Check for attribute suggestions
    const hasAttributeSuggestions = await page.evaluate(() => {
      const items = document.querySelectorAll('.monaco-editor .suggest-widget .monaco-list-row');
      const texts = Array.from(items).map(item => item.textContent);
      return texts.some(text => text.includes('class') || text.includes('id'));
    });
    
    expect(hasAttributeSuggestions).toBeTruthy();
  });

  test('should show CSS property completions', async ({ page }) => {
    // Switch to CSS mode
    await page.evaluate(() => {
      if (window.monacoEditor) {
        window.monacoEditor.setLanguage('css');
      }
    });
    
    const editor = await page.locator('.monaco-editor').first();
    await editor.click();
    
    // Type CSS selector and opening brace
    await page.keyboard.type('.container {\n  d');
    
    // Wait for suggestions
    await page.waitForTimeout(500);
    
    // Check for CSS property suggestions
    const hasPropertySuggestions = await page.evaluate(() => {
      const items = document.querySelectorAll('.monaco-editor .suggest-widget .monaco-list-row');
      const texts = Array.from(items).map(item => item.textContent);
      return texts.some(text => text.includes('display'));
    });
    
    expect(hasPropertySuggestions).toBeTruthy();
  });

  test('should show CSS value completions', async ({ page }) => {
    // Switch to CSS mode
    await page.evaluate(() => {
      if (window.monacoEditor) {
        window.monacoEditor.setLanguage('css');
      }
    });
    
    const editor = await page.locator('.monaco-editor').first();
    await editor.click();
    
    // Type CSS property
    await page.keyboard.type('.container {\n  display: ');
    
    // Wait for suggestions
    await page.waitForTimeout(500);
    
    // Check for CSS value suggestions
    const hasValueSuggestions = await page.evaluate(() => {
      const items = document.querySelectorAll('.monaco-editor .suggest-widget .monaco-list-row');
      const texts = Array.from(items).map(item => item.textContent);
      return texts.some(text => text.includes('flex') || text.includes('grid'));
    });
    
    expect(hasValueSuggestions).toBeTruthy();
  });

  test('should show JavaScript document API completions', async ({ page }) => {
    // Switch to JavaScript mode
    await page.evaluate(() => {
      if (window.monacoEditor) {
        window.monacoEditor.setLanguage('javascript');
      }
    });
    
    const editor = await page.locator('.monaco-editor').first();
    await editor.click();
    
    // Type document.
    await page.keyboard.type('document.');
    
    // Wait for suggestions
    await page.waitForTimeout(500);
    
    // Check for document API suggestions
    const hasDocumentAPI = await page.evaluate(() => {
      const items = document.querySelectorAll('.monaco-editor .suggest-widget .monaco-list-row');
      const texts = Array.from(items).map(item => item.textContent);
      return texts.some(text => 
        text.includes('getElementById') || 
        text.includes('querySelector')
      );
    });
    
    expect(hasDocumentAPI).toBeTruthy();
  });

  test('should show JavaScript window API completions', async ({ page }) => {
    // Switch to JavaScript mode
    await page.evaluate(() => {
      if (window.monacoEditor) {
        window.monacoEditor.setLanguage('javascript');
      }
    });
    
    const editor = await page.locator('.monaco-editor').first();
    await editor.click();
    
    // Type window.
    await page.keyboard.type('window.');
    
    // Wait for suggestions
    await page.waitForTimeout(500);
    
    // Check for window API suggestions
    const hasWindowAPI = await page.evaluate(() => {
      const items = document.querySelectorAll('.monaco-editor .suggest-widget .monaco-list-row');
      const texts = Array.from(items).map(item => item.textContent);
      return texts.some(text => 
        text.includes('alert') || 
        text.includes('setTimeout')
      );
    });
    
    expect(hasWindowAPI).toBeTruthy();
  });

  test('should show JavaScript array method completions', async ({ page }) => {
    // Switch to JavaScript mode
    await page.evaluate(() => {
      if (window.monacoEditor) {
        window.monacoEditor.setLanguage('javascript');
      }
    });
    
    const editor = await page.locator('.monaco-editor').first();
    await editor.click();
    
    // Type array with dot
    await page.keyboard.type('[1, 2, 3].');
    
    // Wait for suggestions
    await page.waitForTimeout(500);
    
    // Check for array method suggestions
    const hasArrayMethods = await page.evaluate(() => {
      const items = document.querySelectorAll('.monaco-editor .suggest-widget .monaco-list-row');
      const texts = Array.from(items).map(item => item.textContent);
      return texts.some(text => 
        text.includes('map') || 
        text.includes('filter') ||
        text.includes('reduce')
      );
    });
    
    expect(hasArrayMethods).toBeTruthy();
  });

  test('should accept completion with Tab', async ({ page }) => {
    const editor = await page.locator('.monaco-editor').first();
    await editor.click();
    
    // Type partial tag
    await page.keyboard.type('<di');
    
    // Wait for suggestions
    await page.waitForTimeout(500);
    
    // Accept with Tab
    await page.keyboard.press('Tab');
    
    const content = await page.evaluate(() => {
      return window.monacoEditor?.getValue() || '';
    });
    
    expect(content).toContain('div');
  });

  test('should accept completion with Enter', async ({ page }) => {
    const editor = await page.locator('.monaco-editor').first();
    await editor.click();
    
    // Type partial tag
    await page.keyboard.type('<sp');
    
    // Wait for suggestions
    await page.waitForTimeout(500);
    
    // Accept with Enter
    await page.keyboard.press('Enter');
    
    const content = await page.evaluate(() => {
      return window.monacoEditor?.getValue() || '';
    });
    
    expect(content).toContain('span');
  });

  test('should navigate suggestions with arrow keys', async ({ page }) => {
    const editor = await page.locator('.monaco-editor').first();
    await editor.click();
    
    // Type to trigger suggestions
    await page.keyboard.type('<d');
    
    // Wait for suggestions
    await page.waitForTimeout(500);
    
    // Navigate down
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    
    // Navigate up
    await page.keyboard.press('ArrowUp');
    
    // Accept
    await page.keyboard.press('Enter');
    
    const content = await page.evaluate(() => {
      return window.monacoEditor?.getValue() || '';
    });
    
    // Should have accepted some suggestion
    expect(content.length).toBeGreaterThan(2);
  });

  test('should show parameter hints', async ({ page }) => {
    // Switch to JavaScript mode
    await page.evaluate(() => {
      if (window.monacoEditor) {
        window.monacoEditor.setLanguage('javascript');
      }
    });
    
    const editor = await page.locator('.monaco-editor').first();
    await editor.click();
    
    // Type function call
    await page.keyboard.type('setTimeout(');
    
    // Wait for parameter hints
    await page.waitForTimeout(500);
    
    // Check if parameter hints are visible
    const hasParameterHints = await page.locator('.monaco-editor .parameter-hints-widget').isVisible();
    expect(hasParameterHints).toBeTruthy();
  });

  test('should filter suggestions as user types', async ({ page }) => {
    const editor = await page.locator('.monaco-editor').first();
    await editor.click();
    
    // Type partial match
    await page.keyboard.type('<di');
    await page.waitForTimeout(300);
    
    const suggestionsCount1 = await page.evaluate(() => {
      return document.querySelectorAll('.monaco-editor .suggest-widget .monaco-list-row').length;
    });
    
    // Type more characters
    await page.keyboard.type('v');
    await page.waitForTimeout(300);
    
    const suggestionsCount2 = await page.evaluate(() => {
      return document.querySelectorAll('.monaco-editor .suggest-widget .monaco-list-row').length;
    });
    
    // Should have fewer suggestions after filtering
    expect(suggestionsCount2).toBeLessThanOrEqual(suggestionsCount1);
  });
});
