/**
 * Bidirectional Sync E2E Tests
 * Tests for code-to-visual and visual-to-code synchronization
 */

const { test, expect } = require('@playwright/test');

test.describe('Bidirectional Synchronization', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8080');
    await page.waitForLoadState('networkidle');
    await page.locator('.monaco-editor').first().waitFor({ timeout: 10000 });
  });

  test('should sync code changes to visual canvas', async ({ page }) => {
    const editor = await page.locator('.monaco-editor').first();
    await editor.click();
    
    // Type HTML code
    await page.keyboard.type('<div class="test-div">Hello World</div>');
    
    // Wait for sync
    await page.waitForTimeout(500);
    
    // Check if element appears in canvas
    const canvasHasElement = await page.evaluate(() => {
      const canvas = document.querySelector('.dragndrop-canvas, #canvas, .visual-canvas');
      if (!canvas) return false;
      return canvas.innerHTML.includes('test-div') || canvas.innerHTML.includes('Hello World');
    });
    
    expect(canvasHasElement).toBeTruthy();
  });

  test('should sync visual changes to code', async ({ page }) => {
    // Add element to canvas
    await page.evaluate(() => {
      const canvas = document.querySelector('.dragndrop-canvas, #canvas, .visual-canvas');
      if (canvas) {
        const div = document.createElement('div');
        div.className = 'visual-test';
        div.textContent = 'Visual Element';
        canvas.appendChild(div);
        
        // Trigger sync
        if (window.syncManager) {
          window.syncManager.syncVisualToCode();
        }
      }
    });
    
    // Wait for sync
    await page.waitForTimeout(500);
    
    // Check if code is updated
    const codeContent = await page.evaluate(() => {
      return window.monacoEditor?.getValue() || '';
    });
    
    expect(codeContent).toContain('visual-test');
  });

  test('should sync within 100ms', async ({ page }) => {
    const editor = await page.locator('.monaco-editor').first();
    await editor.click();
    
    const startTime = Date.now();
    
    // Type HTML code
    await page.keyboard.type('<div>Sync Test</div>');
    
    // Wait for sync to complete
    await page.waitForFunction(() => {
      const canvas = document.querySelector('.dragndrop-canvas, #canvas, .visual-canvas');
      return canvas && canvas.innerHTML.includes('Sync Test');
    }, { timeout: 2000 });
    
    const syncTime = Date.now() - startTime;
    
    expect(syncTime).toBeLessThan(100);
  });

  test('should handle nested elements sync', async ({ page }) => {
    const editor = await page.locator('.monaco-editor').first();
    await editor.click();
    
    // Type nested HTML
    const nestedHTML = '<div class="parent">\n  <div class="child">\n    <p>Nested</p>\n  </div>\n</div>';
    await page.keyboard.type(nestedHTML);
    
    // Wait for sync
    await page.waitForTimeout(500);
    
    // Check if nested structure is preserved
    const hasNestedStructure = await page.evaluate(() => {
      const canvas = document.querySelector('.dragndrop-canvas, #canvas, .visual-canvas');
      if (!canvas) return false;
      
      const parent = canvas.querySelector('.parent');
      if (!parent) return false;
      
      const child = parent.querySelector('.child');
      if (!child) return false;
      
      const p = child.querySelector('p');
      return p && p.textContent.includes('Nested');
    });
    
    expect(hasNestedStructure).toBeTruthy();
  });

  test('should sync element attributes', async ({ page }) => {
    const editor = await page.locator('.monaco-editor').first();
    await editor.click();
    
    // Type element with attributes
    await page.keyboard.type('<div id="test-id" class="test-class" data-value="123">Content</div>');
    
    // Wait for sync
    await page.waitForTimeout(500);
    
    // Check if attributes are synced
    const attributesSynced = await page.evaluate(() => {
      const canvas = document.querySelector('.dragndrop-canvas, #canvas, .visual-canvas');
      if (!canvas) return false;
      
      const element = canvas.querySelector('#test-id');
      if (!element) return false;
      
      return (
        element.classList.contains('test-class') &&
        element.getAttribute('data-value') === '123'
      );
    });
    
    expect(attributesSynced).toBeTruthy();
  });

  test('should sync inline styles', async ({ page }) => {
    const editor = await page.locator('.monaco-editor').first();
    await editor.click();
    
    // Type element with inline styles
    await page.keyboard.type('<div style="color: red; font-size: 20px;">Styled</div>');
    
    // Wait for sync
    await page.waitForTimeout(500);
    
    // Check if styles are applied
    const stylesSynced = await page.evaluate(() => {
      const canvas = document.querySelector('.dragndrop-canvas, #canvas, .visual-canvas');
      if (!canvas) return false;
      
      const divs = canvas.querySelectorAll('div');
      for (const div of divs) {
        if (div.textContent.includes('Styled')) {
          const style = window.getComputedStyle(div);
          return style.color === 'rgb(255, 0, 0)' && style.fontSize === '20px';
        }
      }
      return false;
    });
    
    expect(stylesSynced).toBeTruthy();
  });

  test('should handle element deletion sync', async ({ page }) => {
    const editor = await page.locator('.monaco-editor').first();
    await editor.click();
    
    // Type HTML
    await page.keyboard.type('<div class="to-delete">Delete Me</div>');
    
    // Wait for sync
    await page.waitForTimeout(500);
    
    // Delete the element from code
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Delete');
    
    // Wait for sync
    await page.waitForTimeout(500);
    
    // Check if element is removed from canvas
    const elementRemoved = await page.evaluate(() => {
      const canvas = document.querySelector('.dragndrop-canvas, #canvas, .visual-canvas');
      if (!canvas) return true;
      return !canvas.querySelector('.to-delete');
    });
    
    expect(elementRemoved).toBeTruthy();
  });

  test('should handle element modification sync', async ({ page }) => {
    const editor = await page.locator('.monaco-editor').first();
    await editor.click();
    
    // Type initial HTML
    await page.keyboard.type('<div class="modify-me">Original</div>');
    
    // Wait for sync
    await page.waitForTimeout(500);
    
    // Modify the element
    await page.keyboard.press('Control+A');
    await page.keyboard.type('<div class="modify-me">Modified</div>');
    
    // Wait for sync
    await page.waitForTimeout(500);
    
    // Check if modification is synced
    const isModified = await page.evaluate(() => {
      const canvas = document.querySelector('.dragndrop-canvas, #canvas, .visual-canvas');
      if (!canvas) return false;
      
      const element = canvas.querySelector('.modify-me');
      return element && element.textContent.includes('Modified');
    });
    
    expect(isModified).toBeTruthy();
  });

  test('should sync multiple elements', async ({ page }) => {
    const editor = await page.locator('.monaco-editor').first();
    await editor.click();
    
    // Type multiple elements
    await page.keyboard.type('<div class="elem1">First</div>\n<div class="elem2">Second</div>\n<div class="elem3">Third</div>');
    
    // Wait for sync
    await page.waitForTimeout(500);
    
    // Check if all elements are synced
    const allSynced = await page.evaluate(() => {
      const canvas = document.querySelector('.dragndrop-canvas, #canvas, .visual-canvas');
      if (!canvas) return false;
      
      return (
        canvas.querySelector('.elem1') !== null &&
        canvas.querySelector('.elem2') !== null &&
        canvas.querySelector('.elem3') !== null
      );
    });
    
    expect(allSynced).toBeTruthy();
  });

  test('should preserve element order during sync', async ({ page }) => {
    const editor = await page.locator('.monaco-editor').first();
    await editor.click();
    
    // Type elements in specific order
    await page.keyboard.type('<div class="first">1</div>\n<div class="second">2</div>\n<div class="third">3</div>');
    
    // Wait for sync
    await page.waitForTimeout(500);
    
    // Check if order is preserved
    const orderPreserved = await page.evaluate(() => {
      const canvas = document.querySelector('.dragndrop-canvas, #canvas, .visual-canvas');
      if (!canvas) return false;
      
      const divs = Array.from(canvas.querySelectorAll('div'));
      const indices = {
        first: divs.findIndex(d => d.classList.contains('first')),
        second: divs.findIndex(d => d.classList.contains('second')),
        third: divs.findIndex(d => d.classList.contains('third'))
      };
      
      return indices.first < indices.second && indices.second < indices.third;
    });
    
    expect(orderPreserved).toBeTruthy();
  });

  test('should handle rapid changes without conflicts', async ({ page }) => {
    const editor = await page.locator('.monaco-editor').first();
    await editor.click();
    
    // Type rapidly
    for (let i = 0; i < 5; i++) {
      await page.keyboard.type(`<div class="rapid-${i}">Test ${i}</div>\n`);
      await page.waitForTimeout(50);
    }
    
    // Wait for all syncs to complete
    await page.waitForTimeout(1000);
    
    // Check if all elements are synced
    const allSynced = await page.evaluate(() => {
      const canvas = document.querySelector('.dragndrop-canvas, #canvas, .visual-canvas');
      if (!canvas) return false;
      
      for (let i = 0; i < 5; i++) {
        if (!canvas.querySelector(`.rapid-${i}`)) {
          return false;
        }
      }
      return true;
    });
    
    expect(allSynced).toBeTruthy();
  });

  test('should not create infinite sync loops', async ({ page }) => {
    const editor = await page.locator('.monaco-editor').first();
    await editor.click();
    
    // Type HTML
    await page.keyboard.type('<div class="loop-test">Test</div>');
    
    // Wait for sync
    await page.waitForTimeout(500);
    
    // Monitor sync count
    const syncCount = await page.evaluate(() => {
      let count = 0;
      const originalSync = window.syncManager?.syncCodeToVisual;
      
      if (originalSync) {
        window.syncManager.syncCodeToVisual = function(...args) {
          count++;
          return originalSync.apply(this, args);
        };
      }
      
      // Wait a bit
      return new Promise(resolve => {
        setTimeout(() => resolve(count), 1000);
      });
    });
    
    // Should not have excessive syncs
    expect(syncCount).toBeLessThan(10);
  });
});
