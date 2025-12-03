/**
 * AlignmentEngine Unit Tests
 */

const AlignmentEngine = require('../../src/core/alignmentEngine');

describe('AlignmentEngine', () => {
    let alignmentEngine;
    let mockElements;

    beforeEach(() => {
        // Setup DOM
        document.body.innerHTML = `
            <div id="canvas" style="position: relative; width: 800px; height: 600px;">
                <div class="canvas-element" id="element1" style="position: absolute; left: 100px; top: 100px; width: 100px; height: 100px;"></div>
                <div class="canvas-element" id="element2" style="position: absolute; left: 300px; top: 100px; width: 100px; height: 100px;"></div>
                <div class="canvas-element" id="element3" style="position: absolute; left: 500px; top: 100px; width: 100px; height: 100px;"></div>
            </div>
        `;

        alignmentEngine = new AlignmentEngine();
        mockElements = [
            document.getElementById('element1'),
            document.getElementById('element2'),
            document.getElementById('element3')
        ];
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    describe('Initialization', () => {
        test('should initialize correctly', () => {
            expect(alignmentEngine).toBeDefined();
            expect(alignmentEngine.snapThreshold).toBe(5);
        });
    });

    describe('Get Bounds', () => {
        test('should calculate bounds of elements', () => {
            const bounds = alignmentEngine.getBounds(mockElements);
            
            expect(bounds).toHaveProperty('left');
            expect(bounds).toHaveProperty('right');
            expect(bounds).toHaveProperty('top');
            expect(bounds).toHaveProperty('bottom');
            expect(bounds).toHaveProperty('width');
            expect(bounds).toHaveProperty('height');
        });
    });

    describe('Alignment', () => {
        test('should align elements to left', () => {
            alignmentEngine.align(mockElements, 'left');
            
            // All elements should have same left position
            const leftPositions = mockElements.map(el => parseFloat(el.style.left));
            expect(new Set(leftPositions).size).toBe(1);
        });

        test('should align elements to center', () => {
            alignmentEngine.align(mockElements, 'center');
            
            // Check that elements are centered
            const element1 = mockElements[0];
            const element2 = mockElements[1];
            
            const center1 = parseFloat(element1.style.left) + element1.offsetWidth / 2;
            const center2 = parseFloat(element2.style.left) + element2.offsetWidth / 2;
            
            expect(Math.abs(center1 - center2)).toBeLessThan(1);
        });

        test('should align elements to right', () => {
            alignmentEngine.align(mockElements, 'right');
            
            // All elements should have same right position
            const rightPositions = mockElements.map(el => 
                parseFloat(el.style.left) + el.offsetWidth
            );
            expect(new Set(rightPositions).size).toBe(1);
        });

        test('should align elements to top', () => {
            alignmentEngine.align(mockElements, 'top');
            
            // All elements should have same top position
            const topPositions = mockElements.map(el => parseFloat(el.style.top));
            expect(new Set(topPositions).size).toBe(1);
        });

        test('should align elements to middle', () => {
            alignmentEngine.align(mockElements, 'middle');
            
            // Check that elements are vertically centered
            const element1 = mockElements[0];
            const element2 = mockElements[1];
            
            const middle1 = parseFloat(element1.style.top) + element1.offsetHeight / 2;
            const middle2 = parseFloat(element2.style.top) + element2.offsetHeight / 2;
            
            expect(Math.abs(middle1 - middle2)).toBeLessThan(1);
        });

        test('should align elements to bottom', () => {
            alignmentEngine.align(mockElements, 'bottom');
            
            // All elements should have same bottom position
            const bottomPositions = mockElements.map(el => 
                parseFloat(el.style.top) + el.offsetHeight
            );
            expect(new Set(bottomPositions).size).toBe(1);
        });

        test('should require at least 2 elements', () => {
            const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
            
            alignmentEngine.align([mockElements[0]], 'left');
            
            expect(consoleSpy).toHaveBeenCalled();
            consoleSpy.mockRestore();
        });
    });

    describe('Distribution', () => {
        test('should distribute elements horizontally', () => {
            alignmentEngine.distribute(mockElements, 'horizontal');
            
            // Check that gaps are equal
            const positions = mockElements.map(el => parseFloat(el.style.left)).sort((a, b) => a - b);
            const gap1 = positions[1] - positions[0];
            const gap2 = positions[2] - positions[1];
            
            expect(Math.abs(gap1 - gap2)).toBeLessThan(1);
        });

        test('should distribute elements vertically', () => {
            // Change positions for vertical test
            mockElements[1].style.top = '200px';
            mockElements[2].style.top = '300px';
            
            alignmentEngine.distribute(mockElements, 'vertical');
            
            // Check that gaps are equal
            const positions = mockElements.map(el => parseFloat(el.style.top)).sort((a, b) => a - b);
            const gap1 = positions[1] - positions[0];
            const gap2 = positions[2] - positions[1];
            
            expect(Math.abs(gap1 - gap2)).toBeLessThan(1);
        });

        test('should require at least 3 elements', () => {
            const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
            
            alignmentEngine.distribute([mockElements[0], mockElements[1]], 'horizontal');
            
            expect(consoleSpy).toHaveBeenCalled();
            consoleSpy.mockRestore();
        });
    });

    describe('Snap', () => {
        test('should detect snap threshold', () => {
            expect(alignmentEngine.shouldSnap(100, 103)).toBe(true);
            expect(alignmentEngine.shouldSnap(100, 110)).toBe(false);
        });

        test('should snap value to target', () => {
            expect(alignmentEngine.snap(103, 100)).toBe(100);
            expect(alignmentEngine.snap(110, 100)).toBe(110);
        });
    });

    describe('Snap Points', () => {
        test('should get snap points for element', () => {
            const element = mockElements[0];
            const others = mockElements.slice(1);
            
            const snapPoints = alignmentEngine.getSnapPoints(element, others);
            
            expect(snapPoints).toHaveProperty('x');
            expect(snapPoints).toHaveProperty('y');
            expect(Array.isArray(snapPoints.x)).toBe(true);
            expect(Array.isArray(snapPoints.y)).toBe(true);
        });
    });
});
