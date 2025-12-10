/**
 * LayersManager Unit Tests
 */

const LayersManager = require('../../src/core/layersManager');

describe('LayersManager', () => {
    let layersManager;
    let mockCanvas;

    beforeEach(() => {
        // Setup DOM
        document.body.innerHTML = `
            <div id="canvas">
                <div class="canvas-element" id="element1">Element 1</div>
                <div class="canvas-element" id="element2">
                    <div class="canvas-element" id="element3">Element 3</div>
                </div>
            </div>
        `;

        layersManager = new LayersManager();
        mockCanvas = document.getElementById('canvas');
    });

    afterEach(() => {
        if (layersManager) {
            layersManager.destroy();
        }
        document.body.innerHTML = '';
        jest.restoreAllMocks();
    });

    beforeEach(() => {
        jest.spyOn(console, 'log').mockImplementation(() => {});
        jest.spyOn(console, 'warn').mockImplementation(() => {});
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    describe('Initialization', () => {
        test('should initialize correctly', () => {
            expect(layersManager).toBeDefined();
            expect(layersManager.layers).toBeInstanceOf(Map);
            expect(layersManager.selectedLayers).toBeInstanceOf(Set);
        });
    });

    describe('Tree Building', () => {
        test('should build tree from canvas', () => {
            const tree = layersManager.buildTree(mockCanvas);
            
            expect(tree).toBeDefined();
            expect(tree.children).toHaveLength(2);
        });

        test('should assign layer IDs to elements', () => {
            layersManager.buildTree(mockCanvas);
            
            const element1 = document.getElementById('element1');
            expect(element1.dataset.layerId).toBeDefined();
        });

        test('should handle nested elements', () => {
            layersManager.buildTree(mockCanvas);
            
            const element2 = document.getElementById('element2');
            const layer2 = layersManager.getLayer(element2.dataset.layerId);
            
            expect(layer2.children).toHaveLength(1);
        });
    });

    describe('Layer Selection', () => {
        beforeEach(() => {
            layersManager.buildTree(mockCanvas);
        });

        test('should select a single layer', () => {
            const element1 = document.getElementById('element1');
            const layerId = element1.dataset.layerId;
            
            layersManager.selectLayer(layerId);
            
            expect(layersManager.selectedLayers.has(layerId)).toBe(true);
            expect(element1.classList.contains('selected')).toBe(true);
        });

        test('should clear previous selection when selecting new layer', () => {
            const element1 = document.getElementById('element1');
            const element2 = document.getElementById('element2');
            const layerId1 = element1.dataset.layerId;
            const layerId2 = element2.dataset.layerId;
            
            layersManager.selectLayer(layerId1);
            layersManager.selectLayer(layerId2);
            
            expect(layersManager.selectedLayers.has(layerId1)).toBe(false);
            expect(layersManager.selectedLayers.has(layerId2)).toBe(true);
        });

        test('should select multiple layers', () => {
            const element1 = document.getElementById('element1');
            const element2 = document.getElementById('element2');
            const layerId1 = element1.dataset.layerId;
            const layerId2 = element2.dataset.layerId;
            
            layersManager.selectMultiple([layerId1, layerId2]);
            
            expect(layersManager.selectedLayers.size).toBe(2);
        });

        test('should not select locked layers', () => {
            const element1 = document.getElementById('element1');
            const layerId = element1.dataset.layerId;
            
            layersManager.lockLayer(layerId);
            layersManager.selectLayer(layerId);
            
            expect(layersManager.selectedLayers.has(layerId)).toBe(false);
        });
    });

    describe('Layer Operations', () => {
        beforeEach(() => {
            layersManager.buildTree(mockCanvas);
        });

        test('should lock a layer', () => {
            const element1 = document.getElementById('element1');
            const layerId = element1.dataset.layerId;
            
            layersManager.lockLayer(layerId);
            
            const layer = layersManager.getLayer(layerId);
            expect(layer.locked).toBe(true);
            expect(element1.dataset.layerLocked).toBe('true');
        });

        test('should unlock a layer', () => {
            const element1 = document.getElementById('element1');
            const layerId = element1.dataset.layerId;
            
            layersManager.lockLayer(layerId);
            layersManager.unlockLayer(layerId);
            
            const layer = layersManager.getLayer(layerId);
            expect(layer.locked).toBe(false);
        });

        test('should hide a layer', () => {
            const element1 = document.getElementById('element1');
            const layerId = element1.dataset.layerId;
            
            layersManager.hideLayer(layerId);
            
            const layer = layersManager.getLayer(layerId);
            expect(layer.hidden).toBe(true);
            expect(element1.style.display).toBe('none');
        });

        test('should show a layer', () => {
            const element1 = document.getElementById('element1');
            const layerId = element1.dataset.layerId;
            
            layersManager.hideLayer(layerId);
            layersManager.showLayer(layerId);
            
            const layer = layersManager.getLayer(layerId);
            expect(layer.hidden).toBe(false);
        });

        test('should rename a layer', () => {
            const element1 = document.getElementById('element1');
            const layerId = element1.dataset.layerId;
            const newName = 'New Name';
            
            layersManager.renameLayer(layerId, newName);
            
            const layer = layersManager.getLayer(layerId);
            expect(layer.name).toBe(newName);
            expect(element1.dataset.layerName).toBe(newName);
        });

        test('should delete a layer', () => {
            const element1 = document.getElementById('element1');
            const layerId = element1.dataset.layerId;
            
            layersManager.deleteLayer(layerId);
            
            expect(layersManager.getLayer(layerId)).toBeUndefined();
            expect(document.getElementById('element1')).toBeNull();
        });

        test('should not delete locked layers', () => {
            const element1 = document.getElementById('element1');
            const layerId = element1.dataset.layerId;
            
            layersManager.lockLayer(layerId);
            layersManager.deleteLayer(layerId);
            
            expect(layersManager.getLayer(layerId)).toBeDefined();
            expect(document.getElementById('element1')).not.toBeNull();
        });

        test('should duplicate a layer', () => {
            const element1 = document.getElementById('element1');
            const layerId = element1.dataset.layerId;
            
            const newLayerId = layersManager.duplicateLayer(layerId);
            
            expect(newLayerId).toBeDefined();
            expect(layersManager.getLayer(newLayerId)).toBeDefined();
        });
    });

    describe('Event System', () => {
        test('should dispatch events', (done) => {
            layersManager.addEventListener('layers:tree-built', (detail) => {
                expect(detail.tree).toBeDefined();
                done();
            });

            layersManager.buildTree(mockCanvas);
        });

        test('should remove event listeners', () => {
            const callback = jest.fn();
            
            layersManager.addEventListener('test-event', callback);
            layersManager.removeEventListener('test-event', callback);
            layersManager.dispatchEvent('test-event');
            
            expect(callback).not.toHaveBeenCalled();
        });
    });
});
