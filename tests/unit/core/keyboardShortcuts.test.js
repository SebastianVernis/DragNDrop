/**
 * Tests para KeyboardShortcutsManager
 */

const KeyboardShortcutsManager = require('../../../src/core/keyboardShortcuts');

describe('KeyboardShortcutsManager', () => {
    let shortcutsManager;

    beforeEach(() => {
        shortcutsManager = new KeyboardShortcutsManager();
    });

    describe('Normalización de atajos', () => {
        test('debe normalizar atajo básico', () => {
            const result = shortcutsManager.normalizeShortcut('Ctrl+S');
            expect(result).toBe('ctrl+s');
        });

        test('debe normalizar atajo con múltiples modificadores', () => {
            const result = shortcutsManager.normalizeShortcut('Ctrl+Shift+Z');
            expect(result).toBe('ctrl+shift+z');
        });

        test('debe convertir Command a Ctrl', () => {
            const result = shortcutsManager.normalizeShortcut('Command+S');
            expect(result).toBe('ctrl+s');
        });

        test('debe ordenar modificadores alfabéticamente', () => {
            const result = shortcutsManager.normalizeShortcut('Shift+Ctrl+A');
            expect(result).toBe('a+ctrl+shift');
        });
    });

    describe('Registro de atajos', () => {
        test('debe registrar atajo correctamente', () => {
            const callback = jest.fn();
            shortcutsManager.register('ctrl+t', 'Test', callback);
            
            expect(shortcutsManager.shortcuts.has('ctrl+t')).toBe(true);
        });

        test('debe almacenar descripción y callback', () => {
            const callback = jest.fn();
            shortcutsManager.register('ctrl+t', 'Test shortcut', callback);
            
            const shortcut = shortcutsManager.shortcuts.get('ctrl+t');
            expect(shortcut.description).toBe('Test shortcut');
            expect(shortcut.callback).toBe(callback);
        });

        test('debe eliminar atajo', () => {
            const callback = jest.fn();
            shortcutsManager.register('ctrl+t', 'Test', callback);
            
            const result = shortcutsManager.unregister('ctrl+t');
            
            expect(result).toBe(true);
            expect(shortcutsManager.shortcuts.has('ctrl+t')).toBe(false);
        });
    });

    describe('Conversión de eventos', () => {
        test('debe convertir evento con Ctrl', () => {
            const event = {
                ctrlKey: true,
                shiftKey: false,
                altKey: false,
                metaKey: false,
                key: 's'
            };
            
            const result = shortcutsManager.eventToShortcut(event);
            expect(result).toBe('ctrl+s');
        });

        test('debe convertir evento con múltiples modificadores', () => {
            const event = {
                ctrlKey: true,
                shiftKey: true,
                altKey: false,
                metaKey: false,
                key: 'z'
            };
            
            const result = shortcutsManager.eventToShortcut(event);
            expect(result).toBe('ctrl+shift+z');
        });

        test('debe ignorar teclas modificadoras en key', () => {
            const event = {
                ctrlKey: true,
                shiftKey: false,
                altKey: false,
                metaKey: false,
                key: 'Control'
            };
            
            const result = shortcutsManager.eventToShortcut(event);
            expect(result).toBe('ctrl');
        });
    });

    describe('Obtención de atajos', () => {
        beforeEach(() => {
            shortcutsManager.shortcuts.clear();
            shortcutsManager.register('ctrl+s', 'Guardar', () => {});
            shortcutsManager.register('ctrl+o', 'Abrir', () => {});
        });

        test('debe obtener todos los atajos', () => {
            const shortcuts = shortcutsManager.getAllShortcuts();
            
            expect(shortcuts).toBeInstanceOf(Array);
            expect(shortcuts.length).toBe(2);
            expect(shortcuts[0]).toHaveProperty('shortcut');
            expect(shortcuts[0]).toHaveProperty('description');
        });
    });

    describe('Atajos por defecto', () => {
        test('debe registrar atajos por defecto', () => {
            expect(shortcutsManager.shortcuts.size).toBeGreaterThan(0);
        });

        test('debe incluir atajo de guardar', () => {
            expect(shortcutsManager.shortcuts.has('ctrl+s')).toBe(true);
        });

        test('debe incluir atajos de deshacer/rehacer', () => {
            expect(shortcutsManager.shortcuts.has('ctrl+z')).toBe(true);
            expect(shortcutsManager.shortcuts.has('ctrl+shift+z')).toBe(true);
        });

        test('debe incluir atajo de eliminar', () => {
            expect(shortcutsManager.shortcuts.has('delete')).toBe(true);
        });
    });
});
