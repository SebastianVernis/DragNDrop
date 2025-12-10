/**
 * Tests for New Modules
 * Verifies that all new modules work correctly
 */

describe('New Modules Tests', () => {
    describe('Sanitizer Module', () => {
        let Sanitizer;

        beforeAll(() => {
            // Load sanitizer module
            require('../src/utils/sanitizer.js');
            Sanitizer = global.Sanitizer;
        });

        test('should sanitize dangerous HTML', () => {
            const dangerous = '<script>alert("XSS")</script><p>Safe content</p>';
            const safe = Sanitizer.sanitizeHTML(dangerous);
            
            expect(safe).not.toContain('<script>');
            expect(safe).toContain('<p>Safe content</p>');
        });

        test('should remove event handlers', () => {
            const dangerous = '<div onclick="alert(\'XSS\')">Click me</div>';
            const safe = Sanitizer.sanitizeHTML(dangerous);
            
            expect(safe).not.toContain('onclick');
        });

        test('should escape HTML special characters', () => {
            const text = '<script>alert("XSS")</script>';
            const escaped = Sanitizer.escapeHTML(text);
            
            expect(escaped).toBe('&lt;script&gt;alert(&quot;XSS&quot;)&lt;&#x2F;script&gt;');
        });

        test('should sanitize URLs', () => {
            const dangerous = 'javascript:alert("XSS")';
            const safe = Sanitizer.sanitizeURL(dangerous);
            
            expect(safe).toBe('');
        });

        test('should allow safe URLs', () => {
            const safeUrl = 'https://example.com';
            const result = Sanitizer.sanitizeURL(safeUrl);
            
            expect(result).toBe(safeUrl);
        });
    });

    describe('Error Handler Module', () => {
        let errorHandler, ErrorSeverity, ErrorCategory;

        beforeAll(() => {
            require('../src/core/errorHandler.js');
            errorHandler = global.errorHandler;
            ErrorSeverity = global.ErrorSeverity;
            ErrorCategory = global.ErrorCategory;
        });

        test('should handle errors', () => {
            const errorId = errorHandler.handleError({
                message: 'Test error',
                severity: ErrorSeverity.ERROR,
                category: ErrorCategory.UNKNOWN,
                notify: false
            });

            expect(errorId).toBeTruthy();
            expect(errorId).toMatch(/^err_/);
        });

        test('should track errors', () => {
            errorHandler.clearErrors();
            
            errorHandler.handleError({
                message: 'Error 1',
                severity: ErrorSeverity.ERROR,
                notify: false
            });

            const errors = errorHandler.getErrors();
            expect(errors.length).toBe(1);
            expect(errors[0].message).toBe('Error 1');
        });

        test('should filter errors by severity', () => {
            errorHandler.clearErrors();
            
            errorHandler.handleError({
                message: 'Warning',
                severity: ErrorSeverity.WARNING,
                notify: false
            });

            errorHandler.handleError({
                message: 'Error',
                severity: ErrorSeverity.ERROR,
                notify: false
            });

            const warnings = errorHandler.getErrors({ severity: ErrorSeverity.WARNING });
            expect(warnings.length).toBe(1);
            expect(warnings[0].message).toBe('Warning');
        });

        test('should wrap async functions', async () => {
            const asyncFunc = async (value) => {
                if (value < 0) throw new Error('Negative value');
                return value * 2;
            };

            const wrapped = errorHandler.wrapAsync(asyncFunc, {
                category: ErrorCategory.UNKNOWN,
                onError: () => 0
            });

            const result1 = await wrapped(5);
            expect(result1).toBe(10);

            const result2 = await wrapped(-5);
            expect(result2).toBe(0);
        });
    });

    describe('Event Manager Module', () => {
        let eventManager;

        beforeAll(() => {
            require('../src/core/eventManager.js');
            eventManager = global.eventManager;
        });

        beforeEach(() => {
            // Clear all listeners before each test
            eventManager.clearAll();
        });

        test('should add and track event listeners', () => {
            const element = document.createElement('div');
            const handler = jest.fn();

            const listenerId = eventManager.addEventListener(element, 'click', handler);

            expect(listenerId).toBeTruthy();
            expect(eventManager.getListenerCount()).toBe(1);
        });

        test('should remove event listeners', () => {
            const element = document.createElement('div');
            const handler = jest.fn();

            const listenerId = eventManager.addEventListener(element, 'click', handler);
            const removed = eventManager.removeEventListener(listenerId);

            expect(removed).toBe(true);
            expect(eventManager.getListenerCount()).toBe(0);
        });

        test('should remove all listeners from element', () => {
            const element = document.createElement('div');
            const handler1 = jest.fn();
            const handler2 = jest.fn();

            eventManager.addEventListener(element, 'click', handler1);
            eventManager.addEventListener(element, 'mouseover', handler2);

            const count = eventManager.removeAllListeners(element);

            expect(count).toBe(2);
            expect(eventManager.getListenerCount()).toBe(0);
        });

        test('should support one-time listeners', () => {
            const element = document.createElement('div');
            const handler = jest.fn();

            eventManager.addEventListenerOnce(element, 'click', handler);

            element.click();
            expect(handler).toHaveBeenCalledTimes(1);
            expect(eventManager.getListenerCount()).toBe(0);
        });
    });

    describe('State Manager Module', () => {
        let StateManager, stateManager;

        beforeAll(async () => {
            const module = await import('../src/core/stateManager.js');
            StateManager = module.StateManager;
            stateManager = module.stateManager;
        });

        beforeEach(() => {
            stateManager.reset();
        });

        test('should get and set state', () => {
            stateManager.set('currentFilter', 'test');
            const value = stateManager.get('currentFilter');

            expect(value).toBe('test');
        });

        test('should validate state values', () => {
            const result = stateManager.set('elementIdCounter', -1);
            expect(result).toBe(false);

            const result2 = stateManager.set('elementIdCounter', 5);
            expect(result2).toBe(true);
        });

        test('should notify observers', (done) => {
            stateManager.observe('currentFilter', (newValue, oldValue) => {
                expect(oldValue).toBe('todas');
                expect(newValue).toBe('layout');
                done();
            });

            stateManager.set('currentFilter', 'layout');
        });

        test('should generate unique element IDs', () => {
            const id1 = stateManager.generateElementId();
            const id2 = stateManager.generateElementId();

            expect(id1).toBe('element-0');
            expect(id2).toBe('element-1');
        });

        test('should support undo/redo', () => {
            stateManager.addToHistory({ canvas: 'state1' });
            stateManager.addToHistory({ canvas: 'state2' });
            stateManager.addToHistory({ canvas: 'state3' });

            expect(stateManager.canUndo()).toBe(true);
            expect(stateManager.canRedo()).toBe(false);

            const state2 = stateManager.undo();
            expect(state2.canvas).toBe('state2');
            expect(stateManager.canRedo()).toBe(true);

            const state3 = stateManager.redo();
            expect(state3.canvas).toBe('state3');
        });
    });

    describe('Performance Utilities', () => {
        let performance;

        beforeAll(async () => {
            performance = await import('../src/utils/performance.js');
        });

        test('should debounce function calls', (done) => {
            const fn = jest.fn();
            const debounced = performance.debounce(fn, 100);

            debounced();
            debounced();
            debounced();

            expect(fn).not.toHaveBeenCalled();

            setTimeout(() => {
                expect(fn).toHaveBeenCalledTimes(1);
                done();
            }, 150);
        });

        test('should throttle function calls', (done) => {
            const fn = jest.fn();
            const throttled = performance.throttle(fn, 100);

            throttled();
            throttled();
            throttled();

            expect(fn).toHaveBeenCalledTimes(1);

            setTimeout(() => {
                throttled();
                expect(fn).toHaveBeenCalledTimes(2);
                done();
            }, 150);
        });

        test('should cache DOM elements', () => {
            const cache = new performance.DOMCache();
            
            const div = document.createElement('div');
            div.id = 'test-element';
            document.body.appendChild(div);

            const element1 = cache.getElementById('test-element');
            const element2 = cache.getElementById('test-element');

            expect(element1).toBe(element2);
            expect(element1).toBe(div);

            document.body.removeChild(div);
        });

        test('should memoize function results', () => {
            const expensiveFn = jest.fn((x) => x * 2);
            const memoized = performance.memoize(expensiveFn);

            const result1 = memoized(5);
            const result2 = memoized(5);
            const result3 = memoized(10);

            expect(result1).toBe(10);
            expect(result2).toBe(10);
            expect(result3).toBe(20);
            expect(expensiveFn).toHaveBeenCalledTimes(2); // Only called for unique inputs
        });
    });

    describe('Validation Utilities', () => {
        let validation;

        beforeAll(async () => {
            validation = await import('../src/utils/validation.js');
        });

        test('should validate element IDs', () => {
            const valid = validation.validateId('my-element-123');
            expect(valid.isValid).toBe(true);

            const invalid = validation.validateId('123-invalid');
            expect(invalid.isValid).toBe(false);
        });

        test('should validate colors', () => {
            const hex = validation.validateColor('#ff0000');
            expect(hex.isValid).toBe(true);

            const rgb = validation.validateColor('rgb(255, 0, 0)');
            expect(rgb.isValid).toBe(true);

            const named = validation.validateColor('red');
            expect(named.isValid).toBe(true);

            const invalid = validation.validateColor('not-a-color');
            expect(invalid.isValid).toBe(false);
        });

        test('should validate URLs', () => {
            const valid = validation.validateURL('https://example.com');
            expect(valid.isValid).toBe(true);

            const dangerous = validation.validateURL('javascript:alert("XSS")');
            expect(dangerous.isValid).toBe(false);
        });

        test('should validate dimensions', () => {
            const px = validation.validateDimension('100px');
            expect(px.isValid).toBe(true);

            const percent = validation.validateDimension('50%');
            expect(percent.isValid).toBe(true);

            const auto = validation.validateDimension('auto');
            expect(auto.isValid).toBe(true);

            const invalid = validation.validateDimension('invalid');
            expect(invalid.isValid).toBe(false);
        });

        test('should validate integers', () => {
            const valid = validation.validateInteger(42);
            expect(valid.isValid).toBe(true);
            expect(valid.value).toBe(42);

            const string = validation.validateInteger('42');
            expect(string.isValid).toBe(true);
            expect(string.value).toBe(42);

            const withMin = validation.validateInteger(5, { min: 10 });
            expect(withMin.isValid).toBe(false);
        });
    });
});
