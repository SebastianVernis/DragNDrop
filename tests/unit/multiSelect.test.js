/**
 * MultiSelectManager Unit Tests
 */

const MultiSelectManager = require('../../src/core/multiSelect');
const LayersManager = require('../../src/core/layersManager');

describe('MultiSelectManager', () => {
    let multiSelectManager;
    let layersManager;
    let mockCanvas;

    beforeEach(() => {
        // Setup DOM
        document.body.innerHTML = `
            <div id="canvas">
                <div class="canvas-element" id="element1">Element 1</div>
                <div class="canvas-element" id="element2">Element 2</div>
                <div class="canvas-element" id="element3">Element 3</div>
            </div>
        `;

        layersManager = new LayersManager();
        layersManager.buildTree();
        multiSelectManager = new MultiSelectManager(layersManager);
        mockCanvas = document.getElementById('canvas');
    });

    afterEach(() => {
        if (multiSelectManager) {
            multiSelectManager.destroy();
        }
        if (layersManager) {
            layersManager.destroy();
        }
        document.body.innerHTML = '';
    });

    describe('Initialization', () => {
        test('should initialize correctly', () => {
            expect(multiSelectManager).toBeDefined();
            expect(multiSelectManager.selectedElements).toBeInstanceOf(Set);
        });
    });

    describe('Single Selection', () => {
        test('should select a single element', () => {
            const element1 = document.getElementById('element1');
            const layerId = element1.dataset.layerId;
            
            multiSelectManager.selectSingle(layerId);
            
            expect(multiSelectManager.selectedElements.has(layerId)).toBe(true);
            expect(multiSelectManager.selectedElements.size).toBe(1);
        });

        test('should clear previous selection', () => {
            const element1 = document.getElementById('element1');
            const element2 = document.getElementById('element2');
            const layerId1 = element1.dataset.layerId;
            const layerId2 = element2.dataset.layerId;
            
            multiSelectManager.selectSingle(layerId1);
            multiSelectManager.selectSingle(layerId2);
            
            expect(multiSelectManager.selectedElements.has(layerId1)).toBe(false);
            expect(multiSelectManager.selectedElements.has(layerId2)).toBe(true);
        });
    });

    describe('Toggle Selection', () => {
        test('should toggle element selection', () => {
            const element1 = document.getElementById('element1');
            const layerId = element1.dataset.layerId;
            
            multiSelectManager.toggleSelection(layerId);
            expect(multiSelectManager.selectedElements.has(layerId)).toBe(true);
            
            multiSelectManager.toggleSelection(layerId);
            expect(multiSelectManager.selectedElements.has(layerId)).toBe(false);
        });
    });

    describe('Range Selection', () => {
        test('should select range of elements', () => {
            const element1 = document.getElementById('element1');
            const element3 = document.getElementById('element3');
            const layerId1 = element1.dataset.layerId;
            const layerId3 = element3.dataset.layerId;
            
            multiSelectManager.selectRange(layerId1, layerId3);
            
            expect(multiSelectManager.selectedElements.size).toBe(3);
        });
    });

    describe('Select All', () => {
        test('should select all elements', () => {
            multiSelectManager.selectAll();
            
            expect(multiSelectManager.selectedElements.size).toBe(3);
        });

        test('should not select locked elements', () => {
            const element1 = document.getElementById('element1');
            const layerId = element1.dataset.layerId;
            
            layersManager.lockLayer(layerId);
            multiSelectManager.selectAll();
            
            expect(multiSelectManager.selectedElements.has(layerId)).toBe(false);
        });
    });

    describe('Clear Selection', () => {
        test('should clear all selections', () => {
            multiSelectManager.selectAll();
            multiSelectManager.clearSelection();
            
            expect(multiSelectManager.selectedElements.size).toBe(0);
        });
    });

    describe('Get Selected', () => {
        test('should return selected elements', () => {
            const element1 = document.getElementById('element1');
            const element2 = document.getElementById('element2');
            const layerId1 = element1.dataset.layerId;
            const layerId2 = element2.dataset.layerId;
            
            // Use toggleSelection to add elements
            multiSelectManager.toggleSelection(layerId1);
            multiSelectManager.toggleSelection(layerId2);
            
            const selected = multiSelectManager.getSelected();
            expect(selected).toHaveLength(2);
        });

        test('should return selected IDs', () => {
            const element1 = document.getElementById('element1');
            const layerId = element1.dataset.layerId;
            
            multiSelectManager.selectSingle(layerId);
            
            const ids = multiSelectManager.getSelectedIds();
            expect(ids).toContain(layerId);
        });
    });

    describe('Visual Selection', () => {
        test('should add selected class to single element', () => {
            const element1 = document.getElementById('element1');
            const layerId = element1.dataset.layerId;
            
            multiSelectManager.selectSingle(layerId);
            multiSelectManager.updateVisualSelection();
            
            expect(element1.classList.contains('selected')).toBe(true);
        });

        test('should add multi-selected class to multiple elements', () => {
            const element1 = document.getElementById('element1');
            const element2 = document.getElementById('element2');
            const layerId1 = element1.dataset.layerId;
            const layerId2 = element2.dataset.layerId;
            
            // Use toggleSelection to add elements instead of selectMultiple
            multiSelectManager.toggleSelection(layerId1);
            multiSelectManager.toggleSelection(layerId2);
            multiSelectManager.updateVisualSelection();
            
            expect(element1.classList.contains('multi-selected')).toBe(true);
            expect(element2.classList.contains('multi-selected')).toBe(true);
        });
    });

    describe('Events', () => {
        test('should dispatch selection changed event', (done) => {
            const handler = (e) => {
                try {
                    expect(e.detail.count).toBe(1);
                    window.removeEventListener('multiselect:changed', handler);
                    done();
                } catch (error) {
                    window.removeEventListener('multiselect:changed', handler);
                    done(error);
                }
            };
            
            window.addEventListener('multiselect:changed', handler);

            const element1 = document.getElementById('element1');
            const layerId = element1.dataset.layerId;
            multiSelectManager.selectSingle(layerId);
        });
    });
});
