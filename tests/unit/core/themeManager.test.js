/**
 * Unit Tests para ThemeManager
 * @jest-environment jsdom
 */

// Mock de localStorage
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => { store[key] = value.toString(); },
        clear: () => { store = {}; },
        removeItem: (key) => { delete store[key]; }
    };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock de matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

// Importar ThemeManager
const ThemeManager = require('../../../src/core/themeManager.js');

describe('ThemeManager', () => {
    let themeManager;

    beforeEach(() => {
        // Limpiar localStorage
        localStorage.clear();
        
        // Limpiar data-theme del documento
        document.documentElement.removeAttribute('data-theme');
        
        // Limpiar body
        document.body.innerHTML = '<button id="themeToggle"></button>';
        
        // Reset matchMedia mock
        window.matchMedia.mockImplementation(query => ({
            matches: false,
            media: query,
            onchange: null,
            addListener: jest.fn(),
            removeListener: jest.fn(),
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
            dispatchEvent: jest.fn(),
        }));
    });

    describe('Inicialización', () => {
        test('debe inicializar con tema light por defecto', () => {
            themeManager = new ThemeManager();
            expect(themeManager.currentTheme).toBe('light');
        });

        test('debe tener storageKey correcto', () => {
            themeManager = new ThemeManager();
            expect(themeManager.storageKey).toBe('dragndrop_theme');
        });
    });

    describe('Detección de preferencia del sistema', () => {
        test('debe detectar preferencia dark del sistema', () => {
            window.matchMedia.mockImplementation(query => ({
                matches: query === '(prefers-color-scheme: dark)',
                media: query,
                onchange: null,
                addListener: jest.fn(),
                removeListener: jest.fn(),
                addEventListener: jest.fn(),
                removeEventListener: jest.fn(),
                dispatchEvent: jest.fn(),
            }));

            themeManager = new ThemeManager();
            const preference = themeManager.detectPreference();
            expect(preference).toBe('dark');
        });

        test('debe detectar preferencia light del sistema', () => {
            window.matchMedia.mockImplementation(query => ({
                matches: false,
                media: query,
                onchange: null,
                addListener: jest.fn(),
                removeListener: jest.fn(),
                addEventListener: jest.fn(),
                removeEventListener: jest.fn(),
                dispatchEvent: jest.fn(),
            }));

            themeManager = new ThemeManager();
            const preference = themeManager.detectPreference();
            expect(preference).toBe('light');
        });
    });

    describe('Toggle de tema', () => {
        test('debe cambiar de light a dark', () => {
            themeManager = new ThemeManager();
            themeManager.currentTheme = 'light';
            themeManager.toggle();
            expect(themeManager.currentTheme).toBe('dark');
        });

        test('debe cambiar de dark a light', () => {
            themeManager = new ThemeManager();
            themeManager.currentTheme = 'dark';
            themeManager.toggle();
            expect(themeManager.currentTheme).toBe('light');
        });
    });

    describe('Persistencia en localStorage', () => {
        test('debe guardar tema en localStorage', () => {
            themeManager = new ThemeManager();
            themeManager.currentTheme = 'dark';
            themeManager.saveTheme();
            expect(localStorage.getItem('dragndrop_theme')).toBe('dark');
        });

        test('debe cargar tema desde localStorage', () => {
            localStorage.setItem('dragndrop_theme', 'dark');
            themeManager = new ThemeManager();
            expect(themeManager.currentTheme).toBe('dark');
        });

        test('debe usar tema por defecto si localStorage está vacío', () => {
            themeManager = new ThemeManager();
            expect(themeManager.currentTheme).toBe('light');
        });
    });

    describe('Aplicación del tema', () => {
        test('debe aplicar data-theme="dark" al documento', () => {
            themeManager = new ThemeManager();
            themeManager.applyTheme('dark');
            expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
        });

        test('debe aplicar data-theme="light" al documento', () => {
            themeManager = new ThemeManager();
            themeManager.applyTheme('light');
            expect(document.documentElement.getAttribute('data-theme')).toBe('light');
        });
    });

    describe('Actualización de UI', () => {
        test('debe actualizar texto del botón a "☀️ Claro" en dark mode', () => {
            themeManager = new ThemeManager();
            themeManager.updateUI('dark');
            const btn = document.getElementById('themeToggle');
            expect(btn.textContent).toBe('☀️ Claro');
        });

        test('debe actualizar texto del botón a "🌙 Oscuro" en light mode', () => {
            themeManager = new ThemeManager();
            themeManager.updateUI('light');
            const btn = document.getElementById('themeToggle');
            expect(btn.textContent).toBe('🌙 Oscuro');
        });

        test('debe actualizar aria-label correctamente', () => {
            themeManager = new ThemeManager();
            themeManager.updateUI('dark');
            const btn = document.getElementById('themeToggle');
            expect(btn.getAttribute('aria-label')).toBe('Cambiar a modo claro');
        });
    });

    describe('Métodos públicos', () => {
        test('getCurrentTheme() debe retornar tema actual', () => {
            themeManager = new ThemeManager();
            themeManager.currentTheme = 'dark';
            expect(themeManager.getCurrentTheme()).toBe('dark');
        });

        test('setTheme() debe establecer tema dark', () => {
            themeManager = new ThemeManager();
            themeManager.setTheme('dark');
            expect(themeManager.currentTheme).toBe('dark');
        });

        test('setTheme() debe establecer tema light', () => {
            themeManager = new ThemeManager();
            themeManager.setTheme('light');
            expect(themeManager.currentTheme).toBe('light');
        });

        test('setTheme() debe ignorar valores inválidos', () => {
            themeManager = new ThemeManager();
            themeManager.currentTheme = 'light';
            themeManager.setTheme('invalid');
            expect(themeManager.currentTheme).toBe('light');
        });
    });
});
