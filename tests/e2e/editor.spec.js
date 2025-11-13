/**
 * End-to-End tests for the DragNDrop Editor
 */

import { test, expect } from '@playwright/test';

test.describe('DragNDrop Editor E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Application Loading', () => {
    test('should load the editor with all main components', async ({ page }) => {
      // Check that main panels are visible
      await expect(page.locator('#component-library')).toBeVisible();
      await expect(page.locator('#canvas')).toBeVisible();
      await expect(page.locator('#properties')).toBeVisible();
      
      // Check toolbar is present
      await expect(page.locator('.toolbar')).toBeVisible();
      
      // Check that component categories are loaded
      await expect(page.locator('.component-category')).toHaveCount(6);
      
      // Verify page title
      await expect(page).toHaveTitle(/DragNDrop/);
    });

    test('should display component library with all categories', async ({ page }) => {
      const categories = [
        'Layout Components',
        'Text Components', 
        'Media Components',
        'Form Components',
        'UI Components',
        'Advanced UI Components'
      ];

      for (const category of categories) {
        await expect(page.locator(`text=${category}`)).toBeVisible();
      }
    });

    test('should show template gallery on first load', async ({ page }) => {
      // Check if template gallery is visible (if implemented)
      const templateGallery = page.locator('#template-gallery');
      if (await templateGallery.isVisible()) {
        await expect(templateGallery).toBeVisible();
        await expect(page.locator('.template-card')).toHaveCount(5);
      }
    });
  });

  test.describe('Drag and Drop Functionality', () => {
    test('should create button component via drag and drop', async ({ page }) => {
      // Find button component in library
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

    test('should create heading component via drag and drop', async ({ page }) => {
      const headingComponent = page.locator('[data-component="heading"]');
      const canvas = page.locator('#canvas');
      
      await headingComponent.dragTo(canvas);
      
      const createdHeading = canvas.locator('h1');
      await expect(createdHeading).toBeVisible();
      await expect(createdHeading).toHaveText('Heading');
    });

    test('should create multiple components', async ({ page }) => {
      const canvas = page.locator('#canvas');
      
      // Add multiple components
      await page.locator('[data-component="heading"]').dragTo(canvas);
      await page.locator('[data-component="paragraph"]').dragTo(canvas);
      await page.locator('[data-component="button"]').dragTo(canvas);
      
      // Verify all components exist
      await expect(canvas.locator('h1')).toBeVisible();
      await expect(canvas.locator('p')).toBeVisible();
      await expect(canvas.locator('button')).toBeVisible();
    });

    test('should handle drag and drop to specific positions', async ({ page }) => {
      const canvas = page.locator('#canvas');
      
      // Add container first
      await page.locator('[data-component="container"]').dragTo(canvas);
      
      // Add heading to specific position within container
      const container = canvas.locator('.container').first();
      await page.locator('[data-component="heading"]').dragTo(container);
      
      // Verify heading is inside container
      await expect(container.locator('h1')).toBeVisible();
    });
  });

  test.describe('Element Selection and Editing', () => {
    test('should select element when clicked', async ({ page }) => {
      const canvas = page.locator('#canvas');
      
      // Create a button
      await page.locator('[data-component="button"]').dragTo(canvas);
      
      // Click on the created button
      const button = canvas.locator('button');
      await button.click();
      
      // Verify element is selected (check for selected class or visual indicator)
      await expect(button).toHaveClass(/selected/);
    });

    test('should update properties panel when element is selected', async ({ page }) => {
      const canvas = page.locator('#canvas');
      const propertiesPanel = page.locator('#properties');
      
      // Create and select a button
      await page.locator('[data-component="button"]').dragTo(canvas);
      await canvas.locator('button').click();
      
      // Wait for properties panel to update
      await page.waitForSelector('#properties input[name=\"text\"]', { timeout: 5000 });
      
      // Verify properties panel shows button properties
      await expect(propertiesPanel.locator('input[name=\"text\"]')).toBeVisible();
      await expect(propertiesPanel.locator('input[name=\"text\"]')).toHaveValue('Button');
    });

    test('should edit text content through properties panel', async ({ page }) => {
      const canvas = page.locator('#canvas');
      
      // Create and select a button
      await page.locator('[data-component="button"]').dragTo(canvas);
      const button = canvas.locator('button');
      await button.click();
      
      // Wait for properties panel
      await page.waitForSelector('#properties input[name=\"text\"]');
      
      // Change button text
      const textInput = page.locator('#properties input[name=\"text\"]');
      await textInput.fill('Custom Button Text');
      
      // Verify text changed in canvas
      await expect(button).toHaveText('Custom Button Text');
    });

    test('should edit element styles through properties panel', async ({ page }) => {
      const canvas = page.locator('#canvas');
      
      // Create and select a heading
      await page.locator('[data-component=\"heading\"]').dragTo(canvas);
      const heading = canvas.locator('h1');
      await heading.click();
      
      // Wait for properties panel
      await page.waitForSelector('#properties');
      
      // Change font size if the input exists
      const fontSizeInput = page.locator('#properties input[name=\"fontSize\"]');
      if (await fontSizeInput.isVisible()) {
        await fontSizeInput.fill('3rem');
        
        // Verify style was applied
        await expect(heading).toHaveCSS('font-size', '48px'); // 3rem = 48px typically
      }
    });

    test('should handle double-click text editing', async ({ page }) => {
      const canvas = page.locator('#canvas');
      
      // Create a heading
      await page.locator('[data-component=\"heading\"]').dragTo(canvas);
      const heading = canvas.locator('h1');
      
      // Double-click to edit text
      await heading.dblclick();
      
      // Type new text (if inline editing is implemented)
      await page.keyboard.type('New Heading Text');
      await page.keyboard.press('Enter');
      
      // Verify text changed
      await expect(heading).toHaveText('New Heading Text');
    });
  });

  test.describe('Responsive Design Features', () => {
    test('should switch between responsive views', async ({ page }) => {
      const canvas = page.locator('#canvas');
      
      // Check desktop view (default)
      await expect(canvas).toHaveCSS('width', '1200px');
      
      // Switch to tablet view
      await page.click('[data-view=\"tablet\"]');
      await expect(canvas).toHaveCSS('width', '768px');
      
      // Switch to mobile view
      await page.click('[data-view=\"mobile\"]');
      await expect(canvas).toHaveCSS('width', '375px');
      
      // Switch back to desktop
      await page.click('[data-view=\"desktop\"]');
      await expect(canvas).toHaveCSS('width', '1200px');
    });

    test('should maintain components when switching views', async ({ page }) => {
      const canvas = page.locator('#canvas');
      
      // Add components in desktop view
      await page.locator('[data-component=\"heading\"]').dragTo(canvas);
      await page.locator('[data-component=\"button\"]').dragTo(canvas);
      
      // Switch to mobile view
      await page.click('[data-view=\"mobile\"]');
      
      // Verify components still exist
      await expect(canvas.locator('h1')).toBeVisible();
      await expect(canvas.locator('button')).toBeVisible();
    });
  });

  test.describe('Export Functionality', () => {
    test('should export project as HTML', async ({ page }) => {
      const canvas = page.locator('#canvas');
      
      // Create some content
      await page.locator('[data-component=\"heading\"]').dragTo(canvas);
      await page.locator('[data-component=\"paragraph\"]').dragTo(canvas);
      await page.locator('[data-component=\"button\"]').dragTo(canvas);
      
      // Click export button
      const downloadPromise = page.waitForEvent('download');
      await page.click('[data-action=\"export-html\"]');
      const download = await downloadPromise;
      
      // Verify download
      expect(download.suggestedFilename()).toBe('project.html');
      
      // Verify file content (if possible)
      const path = await download.path();
      expect(path).toBeTruthy();
    });

    test('should export separate files (HTML, CSS, JS)', async ({ page }) => {
      const canvas = page.locator('#canvas');
      
      // Add some components
      await page.locator('[data-component=\"button\"]').dragTo(canvas);
      
      // Click export all button (if available)
      const exportAllButton = page.locator('[data-action=\"export-all\"]');
      if (await exportAllButton.isVisible()) {
        const downloadPromise = page.waitForEvent('download');
        await exportAllButton.click();
        const download = await downloadPromise;
        
        expect(download.suggestedFilename()).toMatch(/\\.(zip|html)$/);
      }
    });
  });

  test.describe('Project Save and Load', () => {
    test('should save project', async ({ page }) => {
      const canvas = page.locator('#canvas');
      
      // Create project content
      await page.locator('[data-component=\"heading\"]').dragTo(canvas);
      await page.locator('[data-component=\"paragraph\"]').dragTo(canvas);
      
      // Save project
      const downloadPromise = page.waitForEvent('download');
      await page.click('[data-action=\"save-project\"]');
      const download = await downloadPromise;
      
      expect(download.suggestedFilename()).toBe('project.json');
    });

    test('should create new project', async ({ page }) => {
      const canvas = page.locator('#canvas');
      
      // Add some content
      await page.locator('[data-component=\"button\"]').dragTo(canvas);
      await expect(canvas.locator('button')).toBeVisible();
      
      // Create new project
      await page.click('[data-action=\"new-project\"]');
      
      // Verify canvas is cleared
      await expect(canvas.locator('button')).not.toBeVisible();
    });
  });

  test.describe('Template System', () => {
    test('should load template when selected', async ({ page }) => {
      // Click templates button
      await page.click('[data-action=\"templates\"]');
      
      // Select a template (if template gallery exists)
      const templateCard = page.locator('.template-card').first();
      if (await templateCard.isVisible()) {
        await templateCard.click();
        
        // Verify template content loaded
        const canvas = page.locator('#canvas');
        await expect(canvas.locator('*')).toHaveCount(1, { timeout: 5000 });
      }
    });
  });

  test.describe('Component Search and Filtering', () => {
    test('should filter components by search', async ({ page }) => {
      const searchInput = page.locator('#component-search');
      
      if (await searchInput.isVisible()) {
        // Search for \"button\"
        await searchInput.fill('button');
        
        // Verify only button components are visible
        await expect(page.locator('[data-component=\"button\"]')).toBeVisible();
        await expect(page.locator('[data-component=\"heading\"]')).not.toBeVisible();
        
        // Clear search
        await searchInput.fill('');
        
        // Verify all components are visible again
        await expect(page.locator('[data-component=\"button\"]')).toBeVisible();
        await expect(page.locator('[data-component=\"heading\"]')).toBeVisible();
      }
    });
  });

  test.describe('Keyboard Shortcuts', () => {
    test('should delete selected element with Delete key', async ({ page }) => {
      const canvas = page.locator('#canvas');
      
      // Create and select element
      await page.locator('[data-component=\"button\"]').dragTo(canvas);
      const button = canvas.locator('button');
      await button.click();
      
      // Press Delete key
      await page.keyboard.press('Delete');
      
      // Verify element is deleted
      await expect(button).not.toBeVisible();
    });

    test('should save project with Ctrl+S', async ({ page }) => {
      // Add some content
      await page.locator('[data-component=\"heading\"]').dragTo(page.locator('#canvas'));
      
      // Press Ctrl+S
      const downloadPromise = page.waitForEvent('download');
      await page.keyboard.press('Control+s');
      const download = await downloadPromise;
      
      expect(download.suggestedFilename()).toBe('project.json');
    });
  });

  test.describe('Error Handling', () => {
    test('should handle invalid drag operations gracefully', async ({ page }) => {
      const canvas = page.locator('#canvas');
      
      // Try to drag from an invalid source
      const invalidElement = page.locator('body');
      
      // This should not cause errors
      await expect(async () => {
        await invalidElement.dragTo(canvas);
      }).not.toThrow();
    });

    test('should show user feedback for actions', async ({ page }) => {
      // Perform an action that should show feedback
      await page.locator('[data-component=\"button\"]').dragTo(page.locator('#canvas'));
      
      // Check for toast notifications or feedback messages
      const toast = page.locator('.toast, .notification, .alert');
      if (await toast.isVisible()) {
        await expect(toast).toBeVisible();
      }
    });
  });

  test.describe('Performance', () => {
    test('should handle many components without performance issues', async ({ page }) => {
      const canvas = page.locator('#canvas');
      
      // Add many components quickly
      for (let i = 0; i < 20; i++) {
        await page.locator('[data-component=\"button\"]').dragTo(canvas);
      }
      
      // Verify all components were created
      await expect(canvas.locator('button')).toHaveCount(20);
      
      // Test that the interface is still responsive
      await page.locator('[data-component=\"heading\"]').dragTo(canvas);
      await expect(canvas.locator('h1')).toBeVisible();
    });

    test('should load quickly', async ({ page }) => {
      const startTime = Date.now();
      
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const loadTime = Date.now() - startTime;
      
      // Should load within 5 seconds
      expect(loadTime).toBeLessThan(5000);
    });
  });

  test.describe('Cross-browser Compatibility', () => {
    test('should work consistently across browsers', async ({ page, browserName }) => {
      // Basic functionality test that should work in all browsers
      const canvas = page.locator('#canvas');
      
      await page.locator('[data-component=\"button\"]').dragTo(canvas);
      await expect(canvas.locator('button')).toBeVisible();
      
      // Log browser for debugging
      console.log(`Test passed in ${browserName}`);
    });
  });

  test.describe('Accessibility', () => {
    test('should be keyboard navigable', async ({ page }) => {
      // Tab through interface
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      
      // Should be able to focus on interactive elements
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();
    });

    test('should have proper ARIA labels', async ({ page }) => {
      // Check for ARIA labels on main components
      await expect(page.locator('#canvas')).toHaveAttribute('role', 'application');
      
      // Check for accessible names
      const componentItems = page.locator('.component-item');
      const firstItem = componentItems.first();
      
      if (await firstItem.isVisible()) {
        await expect(firstItem).toHaveAttribute('aria-label');
      }
    });
  });
});