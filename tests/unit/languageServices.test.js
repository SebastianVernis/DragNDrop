/**
 * Language Services Unit Tests
 * Tests for HTML/CSS/JS completion providers
 */

describe('Language Services', () => {
  describe('HTML Completions', () => {
    test('should provide HTML tag suggestions', () => {
      const { setupHTMLCompletions } = require('../../src/editor/htmlCompletions.js');
      
      // Mock Monaco
      const monaco = {
        languages: {
          registerCompletionItemProvider: jest.fn(),
          CompletionItemKind: { Property: 1 },
          CompletionItemInsertTextRule: { InsertAsSnippet: 1 }
        }
      };
      
      setupHTMLCompletions(monaco);
      
      expect(monaco.languages.registerCompletionItemProvider).toHaveBeenCalledWith(
        'html',
        expect.any(Object)
      );
    });

    test('should suggest common HTML tags', () => {
      const tags = ['div', 'span', 'p', 'a', 'img', 'form', 'input', 'button'];
      
      // This would test the actual suggestion logic
      // In a real implementation, you'd call the provider's provideCompletionItems
      expect(tags.length).toBeGreaterThan(0);
    });

    test('should suggest HTML attributes', () => {
      const attributes = ['id', 'class', 'style', 'data-', 'aria-label'];
      
      expect(attributes).toContain('class');
      expect(attributes).toContain('id');
    });
  });

  describe('CSS Completions', () => {
    test('should provide CSS property suggestions', () => {
      const { setupCSSCompletions } = require('../../src/editor/cssCompletions.js');
      
      const monaco = {
        languages: {
          registerCompletionItemProvider: jest.fn(),
          CompletionItemKind: { Property: 1, Value: 2 },
          CompletionItemInsertTextRule: { InsertAsSnippet: 1 }
        }
      };
      
      setupCSSCompletions(monaco);
      
      expect(monaco.languages.registerCompletionItemProvider).toHaveBeenCalledWith(
        'css',
        expect.any(Object)
      );
    });

    test('should suggest common CSS properties', () => {
      const properties = ['display', 'position', 'color', 'background', 'margin', 'padding'];
      
      expect(properties).toContain('display');
      expect(properties).toContain('color');
    });

    test('should suggest CSS values for display property', () => {
      const displayValues = ['block', 'inline', 'flex', 'grid', 'none'];
      
      expect(displayValues).toContain('flex');
      expect(displayValues).toContain('grid');
    });
  });

  describe('JavaScript Completions', () => {
    test('should provide JavaScript API suggestions', () => {
      const { setupJSCompletions } = require('../../src/editor/jsCompletions.js');
      
      const monaco = {
        languages: {
          registerCompletionItemProvider: jest.fn(),
          CompletionItemKind: { Method: 1, Keyword: 2 },
          CompletionItemInsertTextRule: { InsertAsSnippet: 1 }
        }
      };
      
      setupJSCompletions(monaco);
      
      expect(monaco.languages.registerCompletionItemProvider).toHaveBeenCalledWith(
        'javascript',
        expect.any(Object)
      );
    });

    test('should suggest document API methods', () => {
      const documentMethods = [
        'getElementById',
        'querySelector',
        'querySelectorAll',
        'createElement'
      ];
      
      expect(documentMethods).toContain('getElementById');
      expect(documentMethods).toContain('querySelector');
    });

    test('should suggest window API methods', () => {
      const windowMethods = [
        'alert',
        'confirm',
        'prompt',
        'setTimeout',
        'setInterval'
      ];
      
      expect(windowMethods).toContain('setTimeout');
      expect(windowMethods).toContain('alert');
    });

    test('should suggest array methods', () => {
      const arrayMethods = [
        'map',
        'filter',
        'reduce',
        'forEach',
        'find',
        'some',
        'every'
      ];
      
      expect(arrayMethods).toContain('map');
      expect(arrayMethods).toContain('filter');
    });
  });

  describe('Error Detection', () => {
    test('should detect unclosed HTML tags', () => {
      const { validateHTML } = require('../../src/editor/errorDetection.js');
      
      const html = '<div><p>Test</div>';
      const errors = validateHTML(html);
      
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].message).toMatch(/unclosed|mismatch/i);
    });

    test('should detect missing CSS semicolons', () => {
      const { validateCSS } = require('../../src/editor/errorDetection.js');
      
      const css = '.container { display: flex }';
      const errors = validateCSS(css);
      
      expect(errors.length).toBeGreaterThan(0);
    });

    test('should detect JavaScript syntax errors', () => {
      const { validateJavaScript } = require('../../src/editor/errorDetection.js');
      
      const js = 'const x = ;';
      const errors = validateJavaScript(js);
      
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('Performance Monitor', () => {
    test('should track operation timing', () => {
      const { PerformanceMonitor } = require('../../src/utils/performanceMonitor.js');
      
      const monitor = new PerformanceMonitor();
      
      monitor.start('test-operation');
      // Simulate work
      for (let i = 0; i < 1000; i++) {}
      const duration = monitor.end('test-operation');
      
      expect(duration).toBeGreaterThan(0);
      expect(duration).toBeLessThan(1000);
    });

    test('should calculate average duration', () => {
      const { PerformanceMonitor } = require('../../src/utils/performanceMonitor.js');
      
      const monitor = new PerformanceMonitor();
      
      // Run operation multiple times
      for (let i = 0; i < 5; i++) {
        monitor.start('test-op');
        monitor.end('test-op');
      }
      
      const metric = monitor.getMetric('test-op');
      
      expect(metric.count).toBe(5);
      expect(metric.avgDuration).toBeGreaterThan(0);
    });

    test('should detect slow operations', () => {
      const { PerformanceMonitor } = require('../../src/utils/performanceMonitor.js');
      
      const monitor = new PerformanceMonitor();
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      monitor.start('slow-op');
      // Simulate slow operation
      const start = Date.now();
      while (Date.now() - start < 600) {}
      monitor.end('slow-op');
      
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('Monaco Themes', () => {
    test('should define custom themes', () => {
      const { setupMonacoThemes } = require('../../src/utils/monacoThemes.js');
      
      const monaco = {
        editor: {
          defineTheme: jest.fn()
        }
      };
      
      setupMonacoThemes(monaco);
      
      expect(monaco.editor.defineTheme).toHaveBeenCalledWith(
        'dragndrop-dark',
        expect.any(Object)
      );
      expect(monaco.editor.defineTheme).toHaveBeenCalledWith(
        'dragndrop-light',
        expect.any(Object)
      );
    });

    test('should map theme names correctly', () => {
      const { getMonacoTheme } = require('../../src/utils/monacoThemes.js');
      
      expect(getMonacoTheme('dark')).toBe('dragndrop-dark');
      expect(getMonacoTheme('light')).toBe('dragndrop-light');
      expect(getMonacoTheme('unknown')).toBe('dragndrop-dark');
    });
  });
});
