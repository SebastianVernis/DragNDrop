/**
 * Tests para UndoRedoManager
 */

const UndoRedoManager = require('../../../src/core/undoRedo');

describe('UndoRedoManager', () => {
    let undoRedoManager;
    let mockCanvas;

    beforeEach(() => {
        // Mock del DOM
        document.body.innerHTML = '<div id="canvas"></div>';
        mockCanvas = document.getElementById('canvas');
        
        undoRedoManager = new UndoRedoManager();
    });

    describe('Inicialización', () => {
        test('debe crear instancia correctamente', () => {
            expect(undoRedoManager).toBeDefined();
            expect(undoRedoManager.history).toEqual([]);
            expect(undoRedoManager.currentIndex).toBe(-1);
        });

        test('debe guardar estado inicial', () => {
            undoRedoManager.init();
            expect(undoRedoManager.history.length).toBe(1);
            expect(undoRedoManager.currentIndex).toBe(0);
        });
    });

    describe('Guardar Estado', () => {
        beforeEach(() => {
            undoRedoManager.init();
        });

        test('debe guardar estado nuevo', () => {
            mockCanvas.innerHTML = '<div>Test</div>';
            undoRedoManager.saveState({ type: 'test', description: 'Test cambio' });
            
            expect(undoRedoManager.history.length).toBe(2);
            expect(undoRedoManager.currentIndex).toBe(1);
        });

        test('debe eliminar estados futuros al guardar en medio del historial', () => {
            mockCanvas.innerHTML = '<div>Estado 1</div>';
            undoRedoManager.saveState();
            
            mockCanvas.innerHTML = '<div>Estado 2</div>';
            undoRedoManager.saveState();
            
            undoRedoManager.undo();
            
            mockCanvas.innerHTML = '<div>Nuevo estado</div>';
            undoRedoManager.saveState();
            
            expect(undoRedoManager.history.length).toBe(3);
        });

        test('debe limitar tamaño del historial', () => {
            undoRedoManager.maxHistorySize = 3;
            
            for (let i = 0; i < 5; i++) {
                mockCanvas.innerHTML = `<div>Estado ${i}</div>`;
                undoRedoManager.saveState();
            }
            
            expect(undoRedoManager.history.length).toBe(3);
        });
    });

    describe('Deshacer', () => {
        beforeEach(() => {
            undoRedoManager.init();
            mockCanvas.innerHTML = '<div>Estado 1</div>';
            undoRedoManager.saveState();
            mockCanvas.innerHTML = '<div>Estado 2</div>';
            undoRedoManager.saveState();
        });

        test('debe deshacer último cambio', () => {
            const result = undoRedoManager.undo();
            
            expect(result).toBe(true);
            expect(undoRedoManager.currentIndex).toBe(1);
            expect(mockCanvas.innerHTML).toContain('Estado 1');
        });

        test('no debe deshacer si está en el inicio', () => {
            undoRedoManager.undo();
            undoRedoManager.undo();
            const result = undoRedoManager.undo();
            
            expect(result).toBe(false);
            expect(undoRedoManager.currentIndex).toBe(0);
        });

        test('canUndo debe retornar correctamente', () => {
            expect(undoRedoManager.canUndo()).toBe(true);
            
            undoRedoManager.undo();
            undoRedoManager.undo();
            
            expect(undoRedoManager.canUndo()).toBe(false);
        });
    });

    describe('Rehacer', () => {
        beforeEach(() => {
            undoRedoManager.init();
            mockCanvas.innerHTML = '<div>Estado 1</div>';
            undoRedoManager.saveState();
            mockCanvas.innerHTML = '<div>Estado 2</div>';
            undoRedoManager.saveState();
            undoRedoManager.undo();
        });

        test('debe rehacer cambio', () => {
            const result = undoRedoManager.redo();
            
            expect(result).toBe(true);
            expect(undoRedoManager.currentIndex).toBe(2);
            expect(mockCanvas.innerHTML).toContain('Estado 2');
        });

        test('no debe rehacer si está al final', () => {
            undoRedoManager.redo();
            const result = undoRedoManager.redo();
            
            expect(result).toBe(false);
        });

        test('canRedo debe retornar correctamente', () => {
            expect(undoRedoManager.canRedo()).toBe(true);
            
            undoRedoManager.redo();
            
            expect(undoRedoManager.canRedo()).toBe(false);
        });
    });

    describe('Historial', () => {
        beforeEach(() => {
            undoRedoManager.init();
        });

        test('debe obtener historial', () => {
            mockCanvas.innerHTML = '<div>Estado 1</div>';
            undoRedoManager.saveState({ description: 'Cambio 1' });
            
            const history = undoRedoManager.getHistory();
            
            expect(history).toBeInstanceOf(Array);
            expect(history.length).toBe(2);
            expect(history[1].isCurrent).toBe(true);
        });

        test('debe saltar a estado específico', () => {
            mockCanvas.innerHTML = '<div>Estado 1</div>';
            undoRedoManager.saveState();
            mockCanvas.innerHTML = '<div>Estado 2</div>';
            undoRedoManager.saveState();
            mockCanvas.innerHTML = '<div>Estado 3</div>';
            undoRedoManager.saveState();
            
            undoRedoManager.jumpToState(1);
            
            expect(undoRedoManager.currentIndex).toBe(1);
            expect(mockCanvas.innerHTML).toContain('Estado 1');
        });

        test('debe limpiar historial', () => {
            mockCanvas.innerHTML = '<div>Estado 1</div>';
            undoRedoManager.saveState();
            
            undoRedoManager.clearHistory();
            
            expect(undoRedoManager.history.length).toBe(1);
            expect(undoRedoManager.currentIndex).toBe(0);
        });
    });
});
