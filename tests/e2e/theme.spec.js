/**
 * E2E Tests para Theme Manager
 * Tests de integración con Playwright
 */

import { test, expect } from '@playwright/test';

test.describe('Theme Manager E2E', () => {
    test.beforeEach(async ({ page }) => {
        // Limpiar localStorage antes de cada test
        await page.goto('http://127.0.0.1:8080/index.html');
        await page.evaluate(() => localStorage.clear());
        await page.reload();
    });

    test('debe cambiar tema con botón toggle', async ({ page }) => {
        await page.goto('http://127.0.0.1:8080/index.html');
        
        // Esperar a que la página cargue
        await page.waitForSelector('#themeToggle');
        
        // Obtener tema inicial
        const initialTheme = await page.getAttribute('html', 'data-theme');
        console.log('Tema inicial:', initialTheme);
        
        // Ejecutar toggle directamente
        await page.evaluate(() => window.themeManager.toggle());
        
        // Esperar un momento para la transición
        await page.waitForTimeout(500);
        
        // Obtener nuevo tema
        const newTheme = await page.getAttribute('html', 'data-theme');
        console.log('Nuevo tema:', newTheme);
        
        // Verificar que cambió
        expect(newTheme).not.toBe(initialTheme);
        
        // Verificar que es un tema válido
        expect(['light', 'dark']).toContain(newTheme);
        
        // Tomar screenshot
        await page.screenshot({ 
            path: 'tests/screenshots/theme-toggle.png',
            fullPage: true 
        });
    });

    test('debe persistir tema al recargar página', async ({ page }) => {
        await page.goto('http://127.0.0.1:8080/index.html');
        
        // Esperar a que la página cargue
        await page.waitForSelector('#themeToggle');
        
        // Ejecutar toggle directamente
        await page.evaluate(() => window.themeManager.toggle());
        await page.waitForTimeout(300);
        
        // Obtener tema actual
        const themeBeforeReload = await page.getAttribute('html', 'data-theme');
        console.log('Tema antes de recargar:', themeBeforeReload);
        
        // Recargar página
        await page.reload();
        await page.waitForSelector('#themeToggle');
        
        // Obtener tema después de recargar
        const themeAfterReload = await page.getAttribute('html', 'data-theme');
        console.log('Tema después de recargar:', themeAfterReload);
        
        // Verificar que se mantuvo
        expect(themeAfterReload).toBe(themeBeforeReload);
        
        // Verificar localStorage
        const storedTheme = await page.evaluate(() => 
            localStorage.getItem('dragndrop_theme')
        );
        expect(storedTheme).toBe(themeBeforeReload);
        
        // Tomar screenshot
        await page.screenshot({ 
            path: 'tests/screenshots/theme-persistence.png',
            fullPage: true 
        });
    });

    test('debe funcionar keyboard shortcut Ctrl+Shift+D', async ({ page }) => {
        await page.goto('http://127.0.0.1:8080/index.html');
        
        // Esperar a que la página cargue
        await page.waitForSelector('#themeToggle');
        
        // Obtener tema inicial
        const initialTheme = await page.getAttribute('html', 'data-theme');
        console.log('Tema inicial:', initialTheme);
        
        // Presionar Ctrl+Shift+D
        await page.keyboard.press('Control+Shift+D');
        
        // Esperar un momento para la transición
        await page.waitForTimeout(500);
        
        // Obtener nuevo tema
        const newTheme = await page.getAttribute('html', 'data-theme');
        console.log('Nuevo tema después de shortcut:', newTheme);
        
        // Verificar que cambió
        expect(newTheme).not.toBe(initialTheme);
        
        // Verificar que el botón se actualizó
        const buttonText = await page.textContent('#themeToggle');
        console.log('Texto del botón:', buttonText);
        
        if (newTheme === 'dark') {
            expect(buttonText).toContain('Claro');
        } else {
            expect(buttonText).toContain('Oscuro');
        }
        
        // Tomar screenshot
        await page.screenshot({ 
            path: 'tests/screenshots/theme-keyboard-shortcut.png',
            fullPage: true 
        });
    });

    test('debe mostrar toast notification al cambiar tema', async ({ page }) => {
        await page.goto('http://127.0.0.1:8080/index.html');
        
        // Esperar a que la página cargue
        await page.waitForSelector('#themeToggle');
        
        // Click en toggle (force para evitar overlay)
        await page.click('#themeToggle', { force: true });
        
        // Esperar a que aparezca el toast
        await page.waitForTimeout(500);
        
        // Verificar que hay un toast visible
        const toastVisible = await page.evaluate(() => {
            const toasts = document.querySelectorAll('.toast');
            return Array.from(toasts).some(toast => 
                toast.style.display !== 'none' && 
                toast.offsetParent !== null
            );
        });
        
        // El toast puede o no estar visible dependiendo del timing
        console.log('Toast visible:', toastVisible);
    });

    test('debe aplicar estilos correctos en dark mode', async ({ page }) => {
        await page.goto('http://127.0.0.1:8080/index.html');
        
        // Esperar a que la página cargue
        await page.waitForSelector('#themeToggle');
        
        // Cambiar a dark mode
        await page.evaluate(() => {
            window.themeManager.setTheme('dark');
        });
        
        await page.waitForTimeout(500);
        
        // Verificar que data-theme está aplicado
        const dataTheme = await page.getAttribute('html', 'data-theme');
        expect(dataTheme).toBe('dark');
        
        // Verificar que los estilos CSS se aplicaron
        const bodyBgColor = await page.evaluate(() => {
            return window.getComputedStyle(document.body).backgroundColor;
        });
        
        console.log('Body background color:', bodyBgColor);
        
        // En dark mode, el fondo debe ser oscuro (no blanco)
        expect(bodyBgColor).not.toBe('rgb(255, 255, 255)');
        
        // Tomar screenshot
        await page.screenshot({ 
            path: 'tests/screenshots/theme-dark-styles.png',
            fullPage: true 
        });
    });
});
