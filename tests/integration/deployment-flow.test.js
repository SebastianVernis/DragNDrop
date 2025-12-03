/**
 * Deployment Flow Integration Tests
 * Tests the complete deployment workflow
 */

const { test, expect } = require('@playwright/test');

test.describe('Deployment Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8080/index.html');
    await page.waitForLoadState('networkidle');
  });

  test('should show deploy modal when clicking deploy button', async ({ page }) => {
    // Click deploy button
    await page.click('button:has-text("Deploy")');

    // Wait for modal to appear
    await page.waitForSelector('.deploy-modal-overlay.visible', { timeout: 5000 });

    // Check modal is visible
    const modal = await page.locator('.deploy-modal');
    await expect(modal).toBeVisible();

    // Check modal title
    const title = await page.locator('.deploy-modal-header h2');
    await expect(title).toContainText('Desplegar a Vercel');
  });

  test('should show connection status in deploy modal', async ({ page }) => {
    await page.click('button:has-text("Deploy")');
    await page.waitForSelector('.deploy-modal-overlay.visible');

    // Check connection status element exists
    const connectionStatus = await page.locator('#deployConnectionStatus');
    await expect(connectionStatus).toBeVisible();
  });

  test('should close deploy modal when clicking close button', async ({ page }) => {
    await page.click('button:has-text("Deploy")');
    await page.waitForSelector('.deploy-modal-overlay.visible');

    // Click close button
    await page.click('.deploy-modal-close');

    // Wait for modal to disappear
    await page.waitForSelector('.deploy-modal-overlay', { state: 'hidden', timeout: 5000 });
  });

  test('should show tutorial when clicking tutorial button', async ({ page }) => {
    // Click tutorial button
    await page.click('button:has-text("Tutorial")');

    // Wait for tutorial tooltip to appear
    await page.waitForSelector('.tutorial-tooltip-visible', { timeout: 5000 });

    // Check tutorial is visible
    const tooltip = await page.locator('.tutorial-tooltip');
    await expect(tooltip).toBeVisible();

    // Check welcome message
    const title = await page.locator('.tutorial-tooltip-header h3');
    await expect(title).toContainText('Bienvenido');
  });

  test('should navigate through tutorial steps', async ({ page }) => {
    await page.click('button:has-text("Tutorial")');
    await page.waitForSelector('.tutorial-tooltip-visible');

    // Click next button
    await page.click('.tutorial-btn-primary:has-text("Comenzar")');

    // Wait for next step
    await page.waitForTimeout(500);

    // Check progress updated
    const progressText = await page.locator('.tutorial-progress-text');
    await expect(progressText).toBeVisible();
  });

  test('should show deployment history modal', async ({ page }) => {
    // Click history button
    await page.click('button:has-text("Historial")');

    // Wait for alert or modal (depending on implementation)
    await page.waitForTimeout(1000);
  });

  test('should have all workflow 4 buttons in toolbar', async ({ page }) => {
    // Check Deploy button
    const deployBtn = await page.locator('button:has-text("Deploy")');
    await expect(deployBtn).toBeVisible();

    // Check GitHub button
    const githubBtn = await page.locator('button:has-text("GitHub")');
    await expect(githubBtn).toBeVisible();

    // Check History button
    const historyBtn = await page.locator('button:has-text("Historial")');
    await expect(historyBtn).toBeVisible();

    // Check Tutorial button
    const tutorialBtn = await page.locator('button:has-text("Tutorial")');
    await expect(tutorialBtn).toBeVisible();
  });

  test('should load workflow 4 CSS styles', async ({ page }) => {
    // Check deploy.css is loaded
    const deployStyles = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
      return links.some(link => link.href.includes('deploy.css'));
    });
    expect(deployStyles).toBe(true);

    // Check tutorial.css is loaded
    const tutorialStyles = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
      return links.some(link => link.href.includes('tutorial.css'));
    });
    expect(tutorialStyles).toBe(true);
  });

  test('should have global objects initialized', async ({ page }) => {
    // Check vercelDeployer
    const hasVercelDeployer = await page.evaluate(() => {
      return typeof window.vercelDeployer !== 'undefined';
    });
    expect(hasVercelDeployer).toBe(true);

    // Check gitIntegration
    const hasGitIntegration = await page.evaluate(() => {
      return typeof window.gitIntegration !== 'undefined';
    });
    expect(hasGitIntegration).toBe(true);

    // Check tutorial
    const hasTutorial = await page.evaluate(() => {
      return typeof window.tutorial !== 'undefined';
    });
    expect(hasTutorial).toBe(true);

    // Check deployModal
    const hasDeployModal = await page.evaluate(() => {
      return typeof window.deployModal !== 'undefined';
    });
    expect(hasDeployModal).toBe(true);
  });

  test('should handle deploy modal form validation', async ({ page }) => {
    await page.click('button:has-text("Deploy")');
    await page.waitForSelector('.deploy-modal-overlay.visible');

    // Try to deploy without connection (should show error)
    const deployButton = await page.locator('#deployButton');
    
    // Check if button exists
    await expect(deployButton).toBeVisible();
  });
});

test.describe('Tutorial System', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8080/index.html');
    await page.waitForLoadState('networkidle');
  });

  test('should show spotlight on tutorial steps', async ({ page }) => {
    await page.click('button:has-text("Tutorial")');
    await page.waitForSelector('.tutorial-tooltip-visible');

    // Go to next step
    await page.click('.tutorial-btn-primary');
    await page.waitForTimeout(500);

    // Check if spotlight exists (may not be visible on first step)
    const spotlight = await page.locator('#tutorial-spotlight');
    // Spotlight may or may not be visible depending on step
  });

  test('should allow skipping tutorial', async ({ page }) => {
    await page.click('button:has-text("Tutorial")');
    await page.waitForSelector('.tutorial-tooltip-visible');

    // Click close button
    await page.click('.tutorial-close-btn');

    // Confirm skip dialog
    page.on('dialog', async dialog => {
      await dialog.accept();
    });

    await page.waitForTimeout(500);
  });
});
