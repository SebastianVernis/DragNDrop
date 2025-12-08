/**
 * Sync Manager Unit Tests
 * Tests for bidirectional synchronization
 */

describe('Sync Manager', () => {
  let SyncManager, HTMLParser, DOMSerializer, DiffEngine;

  beforeEach(() => {
    SyncManager = require('../../src/editor/syncManager.js').SyncManager;
    HTMLParser = require('../../src/editor/htmlParser.js').HTMLParser;
    DOMSerializer = require('../../src/editor/domSerializer.js').DOMSerializer;
    DiffEngine = require('../../src/editor/diffEngine.js').DiffEngine;
  });

  describe('HTML Parser', () => {
    test('should parse simple HTML', () => {
      const parser = new HTMLParser();
      const html = '<div class="test">Hello</div>';
      const parsed = parser.parse(html);
      
      expect(parsed).toBeDefined();
      expect(parsed.type).toBe('element');
      expect(parsed.tag).toBe('div');
    });

    test('should parse nested HTML', () => {
      const parser = new HTMLParser();
      const html = '<div><p><span>Nested</span></p></div>';
      const parsed = parser.parse(html);
      
      expect(parsed.children).toBeDefined();
      expect(parsed.children.length).toBeGreaterThan(0);
    });

    test('should extract attributes', () => {
      const parser = new HTMLParser();
      const html = '<div id="test" class="container" data-value="123"></div>';
      const parsed = parser.parse(html);
      
      expect(parsed.attributes.id).toBe('test');
      expect(parsed.attributes.class).toBe('container');
      expect(parsed.attributes['data-value']).toBe('123');
    });

    test('should handle text nodes', () => {
      const parser = new HTMLParser();
      const html = '<p>Text content</p>';
      const parsed = parser.parse(html);
      
      expect(parsed.children).toBeDefined();
      const textNode = parsed.children.find(child => child.type === 'text');
      expect(textNode).toBeDefined();
      expect(textNode.content).toContain('Text content');
    });

    test('should validate HTML structure', () => {
      const parser = new HTMLParser();
      const validHTML = '<div><p>Valid</p></div>';
      const invalidHTML = '<div><p>Invalid</div>';
      
      const validResult = parser.validate(validHTML);
      const invalidResult = parser.validate(invalidHTML);
      
      expect(validResult.valid).toBe(true);
      expect(invalidResult.valid).toBe(false);
      expect(invalidResult.errors.length).toBeGreaterThan(0);
    });
  });

  describe('DOM Serializer', () => {
    test('should serialize element to HTML', () => {
      const serializer = new DOMSerializer();
      const div = document.createElement('div');
      div.className = 'test';
      div.textContent = 'Content';
      
      const html = serializer.serialize(div);
      
      expect(html).toContain('<div');
      expect(html).toContain('class="test"');
      expect(html).toContain('Content');
    });

    test('should serialize nested elements', () => {
      const serializer = new DOMSerializer();
      const parent = document.createElement('div');
      const child = document.createElement('p');
      child.textContent = 'Child';
      parent.appendChild(child);
      
      const html = serializer.serialize(parent);
      
      expect(html).toContain('<div');
      expect(html).toContain('<p');
      expect(html).toContain('Child');
    });

    test('should handle self-closing tags', () => {
      const serializer = new DOMSerializer();
      const img = document.createElement('img');
      img.src = 'test.jpg';
      img.alt = 'Test';
      
      const html = serializer.serialize(img);
      
      expect(html).toContain('<img');
      expect(html).toContain('/>');
    });

    test('should format HTML with indentation', () => {
      const serializer = new DOMSerializer({ indent: '  ' });
      const parent = document.createElement('div');
      const child = document.createElement('p');
      child.textContent = 'Text';
      parent.appendChild(child);
      
      const html = serializer.serializePretty(parent);
      
      expect(html).toMatch(/\n/);
      expect(html).toMatch(/  /);
    });

    test('should minify HTML', () => {
      const serializer = new DOMSerializer();
      const div = document.createElement('div');
      const p = document.createElement('p');
      p.textContent = 'Text';
      div.appendChild(p);
      
      const minified = serializer.serializeMinified(div);
      
      expect(minified).not.toMatch(/\n/);
      expect(minified).not.toMatch(/  /);
    });

    test('should extract inline styles', () => {
      const serializer = new DOMSerializer();
      const div = document.createElement('div');
      div.style.color = 'red';
      div.style.fontSize = '20px';
      
      const { html, css } = serializer.serializeWithExtractedStyles(div);
      
      expect(css).toContain('color');
      expect(css).toContain('font-size');
    });
  });

  describe('Diff Engine', () => {
    test('should detect added elements', () => {
      const engine = new DiffEngine();
      const oldHTML = '<div></div>';
      const newHTML = '<div><p>New</p></div>';
      
      const diff = engine.calculateDiff(oldHTML, newHTML);
      
      const addChanges = diff.filter(change => change.type === 'add');
      expect(addChanges.length).toBeGreaterThan(0);
    });

    test('should detect removed elements', () => {
      const engine = new DiffEngine();
      const oldHTML = '<div><p>Remove</p></div>';
      const newHTML = '<div></div>';
      
      const diff = engine.calculateDiff(oldHTML, newHTML);
      
      const removeChanges = diff.filter(change => change.type === 'remove');
      expect(removeChanges.length).toBeGreaterThan(0);
    });

    test('should detect updated elements', () => {
      const engine = new DiffEngine();
      const oldHTML = '<div class="old">Text</div>';
      const newHTML = '<div class="new">Text</div>';
      
      const diff = engine.calculateDiff(oldHTML, newHTML);
      
      const updateChanges = diff.filter(change => change.type === 'update');
      expect(updateChanges.length).toBeGreaterThan(0);
    });

    test('should detect text content changes', () => {
      const engine = new DiffEngine();
      const oldHTML = '<p>Old text</p>';
      const newHTML = '<p>New text</p>';
      
      const diff = engine.calculateDiff(oldHTML, newHTML);
      
      expect(diff.length).toBeGreaterThan(0);
    });

    test('should detect attribute changes', () => {
      const engine = new DiffEngine();
      
      const oldDiv = document.createElement('div');
      oldDiv.id = 'old-id';
      
      const newDiv = document.createElement('div');
      newDiv.id = 'new-id';
      
      const attrChanges = engine.diffAttributes(oldDiv, newDiv);
      
      expect(attrChanges.id).toBe('new-id');
    });

    test('should optimize changes', () => {
      const engine = new DiffEngine();
      const changes = [
        { type: 'add', element: {} },
        { type: 'add', element: {} },
        { type: 'remove', element: {} }
      ];
      
      const optimized = engine.optimizeChanges(changes);
      
      expect(optimized.length).toBeLessThanOrEqual(changes.length);
    });
  });

  describe('Sync Manager Integration', () => {
    test('should initialize with editor and canvas', () => {
      const mockEditor = {
        onChange: jest.fn(),
        getValue: jest.fn(() => ''),
        setValue: jest.fn()
      };
      
      const mockCanvas = document.createElement('div');
      
      const syncManager = new SyncManager(mockEditor, mockCanvas);
      
      expect(syncManager.codeEditor).toBe(mockEditor);
      expect(syncManager.visualCanvas).toBe(mockCanvas);
    });

    test('should not sync when already syncing', async () => {
      const mockEditor = {
        onChange: jest.fn(),
        getValue: jest.fn(() => '<div>Test</div>'),
        setValue: jest.fn()
      };
      
      const mockCanvas = document.createElement('div');
      const syncManager = new SyncManager(mockEditor, mockCanvas);
      
      syncManager.isSyncing = true;
      
      await syncManager.syncCodeToVisual('<div>New</div>');
      
      // Should not have modified canvas
      expect(mockCanvas.innerHTML).toBe('');
    });

    test('should track sync direction', async () => {
      const mockEditor = {
        onChange: jest.fn(),
        getValue: jest.fn(() => '<div>Test</div>'),
        setValue: jest.fn()
      };
      
      const mockCanvas = document.createElement('div');
      const syncManager = new SyncManager(mockEditor, mockCanvas);
      
      await syncManager.syncCodeToVisual('<div>Test</div>');
      
      expect(syncManager.syncDirection).toBe(null);
    });

    test('should get performance metrics', () => {
      const mockEditor = {
        onChange: jest.fn(),
        getValue: jest.fn(() => ''),
        setValue: jest.fn()
      };
      
      const mockCanvas = document.createElement('div');
      const syncManager = new SyncManager(mockEditor, mockCanvas);
      
      const metrics = syncManager.getPerformanceMetrics();
      
      expect(metrics).toBeDefined();
      expect(typeof metrics).toBe('object');
    });

    test('should dispose properly', () => {
      const mockEditor = {
        onChange: jest.fn(),
        getValue: jest.fn(() => ''),
        setValue: jest.fn()
      };
      
      const mockCanvas = document.createElement('div');
      const syncManager = new SyncManager(mockEditor, mockCanvas);
      
      syncManager.dispose();
      
      expect(syncManager.canvasObserver).toBeUndefined();
    });
  });

  describe('Performance', () => {
    test('should sync within 100ms', async () => {
      const mockEditor = {
        onChange: jest.fn(),
        getValue: jest.fn(() => '<div>Test</div>'),
        setValue: jest.fn()
      };
      
      const mockCanvas = document.createElement('div');
      const syncManager = new SyncManager(mockEditor, mockCanvas);
      
      const startTime = Date.now();
      await syncManager.syncCodeToVisual('<div>Test</div>');
      const duration = Date.now() - startTime;
      
      expect(duration).toBeLessThan(100);
    });

    test('should handle large HTML efficiently', async () => {
      const mockEditor = {
        onChange: jest.fn(),
        getValue: jest.fn(),
        setValue: jest.fn()
      };
      
      const mockCanvas = document.createElement('div');
      const syncManager = new SyncManager(mockEditor, mockCanvas);
      
      // Generate large HTML
      const largeHTML = '<div>' + '<p>Line</p>'.repeat(100) + '</div>';
      
      const startTime = Date.now();
      await syncManager.syncCodeToVisual(largeHTML);
      const duration = Date.now() - startTime;
      
      expect(duration).toBeLessThan(500);
    });
  });
});
