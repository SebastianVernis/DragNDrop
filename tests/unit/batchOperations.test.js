/**
 * BatchOperations Unit Tests
 */

const BatchOperations = require('../../src/core/batchOperations');
const MultiSelectManager = require('../../src/core/multiSelect');
const AlignmentEngine = require('../../src/core/alignmentEngine');
const GroupManager = require('../../src/core/groupManager');
const LayersManager = require('../../src/core/layersManager');

describe('BatchOperations', () => {
    let batchOperations;
    let multiSelectManager;
    let alignmentEngine;
    let groupManager;
    let layersManager;

    beforeEach(() => {
        // Setup DOM
        document.body.innerHTML = `
            <div id="canvas" style="position: relative; width: 800px; height: 600px;">
                <div class="canvas-element" id="element1" style="position: absolute; left: 100px; top: 100px; width: 100px; height: 100px;">Element 1</div>
                <div class="canvas-element" id="element2" style="position: absolute; left: 300px; top: 100px; width: 100px; height: 100px;">Element 2</div>
                <div class="canvas-element" id="element3" style="position: absolute; left: 500px; top: 100px; width: 100px; height: 100px;">Element 3</div>
            </div>
        `;

        layersManager = new LayersManager();
        layersManager.buildTree();
        
        multiSelectManager = new MultiSelectManager(layersManager);
        alignmentEngine = new AlignmentEngine();
        groupManager = new GroupManager(layersManager);
        batchOperations = new BatchOperations(multiSelectManager, alignmentEngine, groupManager);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    describe('Initialization', () => {
        test('should initialize correctly', () => {
            expect(batchOperations).toBeDefined();
            expect(batchOperations.multiSelectManager).toBe(multiSelectManager);
            expect(batchOperations.alignmentEngine).toBe(alignmentEngine);
            expect(batchOperations.groupManager).toBe(groupManager);
        });
    });

    describe('Align', () => {
        test('should align selected elements', () => {
            const element1 = document.getElementById('element1');
            const element2 = document.getElementById('element2');
            
            multiSelectManager.toggleSelection(element1.dataset.layerId);
            multiSelectManager.toggleSelection(element2.dataset.layerId);
            
            batchOperations.align('left');
            
            // Elements should be aligned
            expect(parseFloat(element1.style.left)).toBe(parseFloat(element2.style.left));
        });

        test('should require at least 2 elements', () => {
            const element1 = document.getElementById('element1');
            multiSelectManager.selectSingle(element1.dataset.layerId);
            
            // Mock showToast
            window.showToast = jest.fn();
            
            batchOperations.align('left');
            
            expect(window.showToast).toHaveBeenCalledWith(
                expect.stringContaining('al menos 2 elementos')
            );
        });
    });

    describe('Distribute', () => {
        test('should distribute selected elements', () => {
            const element1 = document.getElementById('element1');
            const element2 = document.getElementById('element2');
            const element3 = document.getElementById('element3');
            
            multiSelectManager.toggleSelection(element1.dataset.layerId);
            multiSelectManager.toggleSelection(element2.dataset.layerId);
            multiSelectManager.toggleSelection(element3.dataset.layerId);
            
            batchOperations.distribute('horizontal');
            
            // Elements should be distributed evenly
            const positions = [element1, element2, element3]
                .map(el => parseFloat(el.style.left))
                .sort((a, b) => a - b);
            
            const gap1 = positions[1] - positions[0];
            const gap2 = positions[2] - positions[1];
            
            expect(Math.abs(gap1 - gap2)).toBeLessThan(1);
        });

        test('should require at least 3 elements', () => {
            const element1 = document.getElementById('element1');
            const element2 = document.getElementById('element2');
            
            multiSelectManager.toggleSelection(element1.dataset.layerId);
            multiSelectManager.toggleSelection(element2.dataset.layerId);
            
            window.showToast = jest.fn();
            
            batchOperations.distribute('horizontal');
            
            expect(window.showToast).toHaveBeenCalledWith(
                expect.stringContaining('al menos 3 elementos')
            );
        });
    });

    describe('Group', () => {
        test('should group selected elements', () => {
            const element1 = document.getElementById('element1');
            const element2 = document.getElementById('element2');
            
            multiSelectManager.toggleSelection(element1.dataset.layerId);
            multiSelectManager.toggleSelection(element2.dataset.layerId);
            
            const groupId = batchOperations.group();
            
            expect(groupId).toBeDefined();
            expect(groupManager.getGroup(groupId)).toBeDefined();
        });

        test('should require at least 2 elements', () => {
            const element1 = document.getElementById('element1');
            multiSelectManager.selectSingle(element1.dataset.layerId);
            
            window.showToast = jest.fn();
            
            batchOperations.group();
            
            expect(window.showToast).toHaveBeenCalledWith(
                expect.stringContaining('al menos 2 elementos')
            );
        });
    });

    describe('Batch Style', () => {
        test('should apply style to all selected elements', () => {
            const element1 = document.getElementById('element1');
            const element2 = document.getElementById('element2');
            
            multiSelectManager.toggleSelection(element1.dataset.layerId);
            multiSelectManager.toggleSelection(element2.dataset.layerId);
            
            batchOperations.applyBatchStyle('backgroundColor', 'red');
            
            expect(element1.style.backgroundColor).toBe('red');
            expect(element2.style.backgroundColor).toBe('red');
        });
    });

    describe('Delete Selected', () => {
        test('should delete all selected elements', () => {
            const element1 = document.getElementById('element1');
            const element2 = document.getElementById('element2');
            
            multiSelectManager.toggleSelection(element1.dataset.layerId);
            multiSelectManager.toggleSelection(element2.dataset.layerId);
            
            // Mock confirm
            window.confirm = jest.fn(() => true);
            
            batchOperations.deleteSelected();
            
            expect(document.getElementById('element1')).toBeNull();
            expect(document.getElementById('element2')).toBeNull();
        });
    });

    describe('Duplicate Selected', () => {
        test('should duplicate all selected elements', () => {
            const element1 = document.getElementById('element1');
            
            // Mock duplicateLayer to return a new layer ID
            window.layersManager = layersManager;
            const mockDuplicate = jest.spyOn(layersManager, 'duplicateLayer').mockReturnValue('duplicated-layer-1');
            
            multiSelectManager.selectSingle(element1.dataset.layerId);
            
            batchOperations.duplicateSelected();
            
            expect(mockDuplicate).toHaveBeenCalledWith(element1.dataset.layerId);
            mockDuplicate.mockRestore();
        });
    });

    describe('Lock/Unlock Selected', () => {
        test('should lock all selected elements', () => {
            const element1 = document.getElementById('element1');
            const element2 = document.getElementById('element2');
            
            multiSelectManager.toggleSelection(element1.dataset.layerId);
            multiSelectManager.toggleSelection(element2.dataset.layerId);
            
            window.layersManager = layersManager;
            const mockLock = jest.spyOn(layersManager, 'lockLayer');
            
            batchOperations.lockSelected();
            
            expect(mockLock).toHaveBeenCalledWith(element1.dataset.layerId);
            expect(mockLock).toHaveBeenCalledWith(element2.dataset.layerId);
            mockLock.mockRestore();
        });

        test('should unlock all selected elements', () => {
            const element1 = document.getElementById('element1');
            
            multiSelectManager.selectSingle(element1.dataset.layerId);
            
            batchOperations.lockSelected();
            batchOperations.unlockSelected();
            
            const layer1 = layersManager.getLayer(element1.dataset.layerId);
            expect(layer1.locked).toBe(false);
        });
    });

    describe('Z-Index Operations', () => {
        test('should bring elements to front', () => {
            const element1 = document.getElementById('element1');
            const canvas = document.getElementById('canvas');
            
            multiSelectManager.selectSingle(element1.dataset.layerId);
            
            batchOperations.bringToFront();
            
            expect(canvas.lastElementChild).toBe(element1);
        });

        test('should send elements to back', () => {
            const element3 = document.getElementById('element3');
            const canvas = document.getElementById('canvas');
            
            multiSelectManager.selectSingle(element3.dataset.layerId);
            
            batchOperations.sendToBack();
            
            expect(canvas.firstElementChild).toBe(element3);
        });
    });
});
