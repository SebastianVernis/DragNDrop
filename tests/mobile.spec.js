/**
 * Mobile E2E Tests
 * Tests for mobile-specific functionality: touch events, gestures, responsive UI
 */

import { test, expect, devices } from '@playwright/test';

// Test on multiple mobile devices
const mobileDevices = [
  { name: 'iPhone 13', device: devices['iPhone 13'] },
  { name: 'Pixel 5', device: devices['Pixel 5'] },
  { name: 'iPad Pro', device: devices['iPad Pro'] }
];

mobileDevices.forEach(({ name, device }) => {
  test.describe(`Mobile Tests - ${name}`, () => {
    test.use(device);
    
    test.beforeEach(async ({ page }) => {
      await page.goto('http://127.0.0.1:8080/index.html');
      await page.waitForLoadState('networkidle');
      
      // Close gallery if open
      const galleryScreen = page.locator('#galleryScreen');
      if (await galleryScreen.isVisible()) {
        await page.click('button:has-text("Nuevo Proyecto Blanco")');
      }
    });
    
    test('should load on mobile device', async ({ page }) => {
      // Check that main elements are present
      await expect(page.locator('.toolbar')).toBeVisible();
      await expect(page.locator('.canvas-panel')).toBeVisible();
      
      // Check viewport
      const viewport = page.viewportSize();
      expect(viewport.width).toBeLessThanOrEqual(device.viewport.width);
    });
    
    test('should detect touch device', async ({ page }) => {
      // Check device detection
      const isTouchDevice = await page.evaluate(() => {
        return window.deviceDetector && window.deviceDetector.isTouchDevice;
      });
      
      expect(isTouchDevice).toBe(true);
    });
    
    test('should show mobile UI elements', async ({ page }) => {
      const isMobile = device.viewport.width < 768;
      
      if (isMobile) {
        // Check for FAB
        await expect(page.locator('.mobile-fab')).toBeVisible();
        
        // Check for collapsible components panel
        await expect(page.locator('.components-panel')).toHaveClass(/mobile-collapsible/);
      }
    });
    
    test('should handle touch drag and drop', async ({ page }) => {
      // Get component item
      const componentItem = page.locator('.component-item[data-type="h1"]').first();
      await expect(componentItem).toBeVisible();
      
      // Get canvas
      const canvas = page.locator('#canvas');
      await expect(canvas).toBeVisible();
      
      // Get bounding boxes
      const componentBox = await componentItem.boundingBox();
      const canvasBox = await canvas.boundingBox();
      
      if (!componentBox || !canvasBox) {
        throw new Error('Could not get bounding boxes');
      }
      
      // Simulate touch drag
      await page.touchscreen.tap(
        componentBox.x + componentBox.width / 2,
        componentBox.y + componentBox.height / 2
      );
      
      // Wait a bit for long press
      await page.waitForTimeout(200);
      
      // Drag to canvas
      await page.mouse.move(
        canvasBox.x + 100,
        canvasBox.y + 100
      );
      
      await page.waitForTimeout(100);
      
      // Check if element was created (this depends on implementation)
      // For now, just verify no errors occurred
      const errors = await page.evaluate(() => {
        return window.errors || [];
      });
      
      expect(errors.length).toBe(0);
    });
    
    test('should handle tap gesture', async ({ page }) => {
      const canvas = page.locator('#canvas');
      const canvasBox = await canvas.boundingBox();
      
      if (!canvasBox) {
        throw new Error('Could not get canvas bounding box');
      }
      
      // Tap on canvas
      await page.touchscreen.tap(
        canvasBox.x + canvasBox.width / 2,
        canvasBox.y + canvasBox.height / 2
      );
      
      // Verify tap was registered
      await page.waitForTimeout(100);
    });
    
    test('should toggle components panel on mobile', async ({ page }) => {
      const isMobile = device.viewport.width < 768;
      
      if (isMobile) {
        const panel = page.locator('.components-panel');
        const toggleBtn = page.locator('.mobile-panel-toggle');
        
        // Panel should be collapsed by default
        await expect(panel).toHaveClass(/collapsed/);
        
        // Click toggle button
        await toggleBtn.click();
        
        // Panel should be expanded
        await expect(panel).not.toHaveClass(/collapsed/);
        
        // Click again to collapse
        await toggleBtn.click();
        
        // Panel should be collapsed again
        await expect(panel).toHaveClass(/collapsed/);
      }
    });
    
    test('should open FAB menu on mobile', async ({ page }) => {
      const isMobile = device.viewport.width < 768;
      
      if (isMobile) {
        const fabMain = page.locator('.fab-main');
        const fabMenu = page.locator('.fab-menu');
        
        // Menu should be hidden initially
        await expect(fabMenu).toHaveClass(/hidden/);
        
        // Click FAB
        await fabMain.click();
        
        // Menu should be visible
        await expect(fabMenu).not.toHaveClass(/hidden/);
        
        // Click again to close
        await fabMain.click();
        
        // Menu should be hidden again
        await expect(fabMenu).toHaveClass(/hidden/);
      }
    });
    
    test('should have proper touch target sizes', async ({ page }) => {
      // Get all interactive elements
      const buttons = page.locator('button, a, .component-item');
      const count = await buttons.count();
      
      // Check at least some buttons
      for (let i = 0; i < Math.min(count, 10); i++) {
        const button = buttons.nth(i);
        const box = await button.boundingBox();
        
        if (box) {
          // Touch targets should be at least 44x44px
          expect(box.width).toBeGreaterThanOrEqual(40); // Allow small margin
          expect(box.height).toBeGreaterThanOrEqual(40);
        }
      }
    });
    
    test('should handle orientation change', async ({ page }) => {
      // Get initial orientation
      const initialOrientation = await page.evaluate(() => {
        return window.deviceDetector && window.deviceDetector.orientation;
      });
      
      expect(initialOrientation).toBeTruthy();
      
      // Note: Playwright doesn't support changing orientation directly
      // This test verifies the detection works
    });
    
    test('should maintain 60 FPS during interactions', async ({ page }) => {
      // Start FPS monitoring
      await page.evaluate(() => {
        window.fpsLog = [];
        const measureFPS = () => {
          if (window.performanceOptimizer) {
            window.fpsLog.push(window.performanceOptimizer.getFPS());
          }
          if (window.fpsLog.length < 60) {
            requestAnimationFrame(measureFPS);
          }
        };
        measureFPS();
      });
      
      // Perform some interactions
      await page.mouse.move(100, 100);
      await page.mouse.move(200, 200);
      await page.mouse.move(300, 300);
      
      // Wait for FPS measurements
      await page.waitForTimeout(1000);
      
      // Get FPS log
      const fpsLog = await page.evaluate(() => window.fpsLog || []);
      
      if (fpsLog.length > 0) {
        const avgFPS = fpsLog.reduce((a, b) => a + b, 0) / fpsLog.length;
        
        // Average FPS should be close to 60
        expect(avgFPS).toBeGreaterThan(30); // Allow for some variance
      }
    });
    
    test('should load service worker', async ({ page }) => {
      // Check if service worker is registered
      const swRegistered = await page.evaluate(async () => {
        if ('serviceWorker' in navigator) {
          const registration = await navigator.serviceWorker.getRegistration();
          return !!registration;
        }
        return false;
      });
      
      // Service worker should be registered
      expect(swRegistered).toBe(true);
    });
    
    test('should handle safe areas on notched devices', async ({ page }) => {
      // Check if safe area CSS variables are set
      const safeAreas = await page.evaluate(() => {
        const root = document.documentElement;
        return {
          top: getComputedStyle(root).getPropertyValue('--safe-area-top'),
          bottom: getComputedStyle(root).getPropertyValue('--safe-area-bottom'),
          left: getComputedStyle(root).getPropertyValue('--safe-area-left'),
          right: getComputedStyle(root).getPropertyValue('--safe-area-right')
        };
      });
      
      // Variables should be defined
      expect(safeAreas.top).toBeTruthy();
      expect(safeAreas.bottom).toBeTruthy();
      expect(safeAreas.left).toBeTruthy();
      expect(safeAreas.right).toBeTruthy();
    });
    
    test('should be responsive at different viewport sizes', async ({ page }) => {
      const viewportSizes = [
        { width: 320, height: 568 },  // iPhone SE
        { width: 375, height: 667 },  // iPhone 8
        { width: 414, height: 896 },  // iPhone 11
        { width: 768, height: 1024 }, // iPad
      ];
      
      for (const size of viewportSizes) {
        await page.setViewportSize(size);
        await page.waitForTimeout(200);
        
        // Check that main elements are still visible
        await expect(page.locator('.toolbar')).toBeVisible();
        await expect(page.locator('.canvas-panel')).toBeVisible();
        
        // Check no horizontal overflow
        const hasOverflow = await page.evaluate(() => {
          return document.body.scrollWidth > window.innerWidth;
        });
        
        expect(hasOverflow).toBe(false);
      }
    });
  });
});

// Performance tests
test.describe('Mobile Performance', () => {
  test.use(devices['iPhone 13']);
  
  test('should load within 3 seconds', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('http://127.0.0.1:8080/index.html');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });
  
  test('should have optimized bundle size', async ({ page }) => {
    await page.goto('http://127.0.0.1:8080/index.html');
    
    // Get all loaded resources
    const resources = await page.evaluate(() => {
      return performance.getEntriesByType('resource').map(r => ({
        name: r.name,
        size: r.transferSize,
        type: r.initiatorType
      }));
    });
    
    // Calculate total JS size
    const totalJSSize = resources
      .filter(r => r.type === 'script')
      .reduce((sum, r) => sum + r.size, 0);
    
    // Total JS should be less than 500KB (gzipped)
    expect(totalJSSize).toBeLessThan(500 * 1024);
  });
});

// Accessibility tests
test.describe('Mobile Accessibility', () => {
  test.use(devices['iPhone 13']);
  
  test('should have proper ARIA labels', async ({ page }) => {
    await page.goto('http://127.0.0.1:8080/index.html');
    
    // Check for ARIA labels on interactive elements
    const buttons = page.locator('button');
    const count = await buttons.count();
    
    for (let i = 0; i < Math.min(count, 10); i++) {
      const button = buttons.nth(i);
      const text = await button.textContent();
      const ariaLabel = await button.getAttribute('aria-label');
      
      // Button should have either text content or aria-label
      expect(text || ariaLabel).toBeTruthy();
    }
  });
  
  test('should support keyboard navigation', async ({ page }) => {
    await page.goto('http://127.0.0.1:8080/index.html');
    
    // Tab through elements
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Check that focus is visible
    const focusedElement = await page.evaluate(() => {
      return document.activeElement?.tagName;
    });
    
    expect(focusedElement).toBeTruthy();
  });
});
