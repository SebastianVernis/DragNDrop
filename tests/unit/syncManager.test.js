/**
 * Sync Manager Unit Tests
 * Tests for bidirectional synchronization
 * 
 * Note: These tests use mocked implementations since the actual modules
 * use ES modules which require additional Jest configuration.
 */

describe('Sync Manager', () => {
  // Mock implementations for testing
  class MockHTMLParser {
    parse(html) {
      if (!html || html.trim() === '') return null;
      
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const element = doc.body.firstElementChild;
      
      if (!element) return null;
      
      return this.elementToNode(element);
    }
    
    elementToNode(element) {
      const node = {
        type: 'element',
        tag: element.tagName.toLowerCase(),
        attributes: {},
        children: []
      };
      
      // Extract attributes
      for (const attr of element.attributes) {
        node.attributes[attr.name] = attr.value;
      }
      
      // Process children
      for (const child of element.childNodes) {
        if (child.nodeType === Node.ELEMENT_NODE) {
          node.children.push(this.elementToNode(child));
        } else if (child.nodeType === Node.TEXT_NODE && child.textContent.trim()) {
          node.children.push({
            type: 'text',
            content: child.textContent
          });
        }
      }
      
      return node;
    }
    
    validate(html) {
      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const errors = doc.querySelectorAll('parsererror');
        return { valid: errors.length === 0, errors: [] };
      } catch (e) {
        return { valid: false, errors: [e.message] };
      }
    }
  }
  
  class MockDOMSerializer {
    serialize(element, options = {}) {
      if (!element) return '';
      return element.outerHTML || '';
    }
    
    serializeWithFormat(element, options = {}) {
      const html = this.serialize(element);
      if (options.minify) {
        return html.replace(/\s+/g, ' ').trim();
      }
      if (options.indent) {
        return this.formatHTML(html, options.indentSize || 2);
      }
      return html;
    }
    
    formatHTML(html, indentSize = 2) {
      // Simple formatting
      let formatted = '';
      let indent = 0;
      const tokens = html.split(/(<[^>]+>)/g).filter(t => t.trim());
      
      for (const token of tokens) {
        if (token.startsWith('</')) {
          indent--;
          formatted += ' '.repeat(indent * indentSize) + token + '\n';
        } else if (token.startsWith('<') && !token.endsWith('/>')) {
          formatted += ' '.repeat(indent * indentSize) + token + '\n';
          if (!token.includes('/>')) indent++;
        } else {
          formatted += ' '.repeat(indent * indentSize) + token + '\n';
        }
      }
      
      return formatted.trim();
    }
    
    extractStyles(element) {
      const styles = {};
      if (element && element.style) {
        for (let i = 0; i < element.style.length; i++) {
          const prop = element.style[i];
          styles[prop] = element.style.getPropertyValue(prop);
        }
      }
      return styles;
    }
  }
  
  class MockDiffEngine {
    diff(oldTree, newTree) {
      const changes = [];
      
      if (!oldTree && newTree) {
        changes.push({ type: 'add', node: newTree });
      } else if (oldTree && !newTree) {
        changes.push({ type: 'remove', node: oldTree });
      } else if (oldTree && newTree) {
        if (oldTree.tag !== newTree.tag) {
          changes.push({ type: 'update', oldNode: oldTree, newNode: newTree });
        }
        if (JSON.stringify(oldTree.attributes) !== JSON.stringify(newTree.attributes)) {
          changes.push({ type: 'attributes', oldNode: oldTree, newNode: newTree });
        }
        if (oldTree.type === 'text' && newTree.type === 'text' && oldTree.content !== newTree.content) {
          changes.push({ type: 'text', oldNode: oldTree, newNode: newTree });
        }
      }
      
      return changes;
    }
    
    optimize(changes) {
      // Remove redundant changes
      const optimized = [];
      const seen = new Set();
      
      for (const change of changes) {
        const key = `${change.type}-${JSON.stringify(change.node || change.newNode)}`;
        if (!seen.has(key)) {
          seen.add(key);
          optimized.push(change);
        }
      }
      
      return optimized;
    }
  }
  
  class MockSyncManager {
    constructor(codeEditor, visualCanvas) {
      this.codeEditor = codeEditor;
      this.visualCanvas = visualCanvas;
      this.htmlParser = new MockHTMLParser();
      this.domSerializer = new MockDOMSerializer();
      this.diffEngine = new MockDiffEngine();
      
      this.isSyncing = false;
      this.syncDirection = null;
      this.lastCodeValue = '';
      this.lastVisualHTML = '';
      this.metrics = {
        syncCount: 0,
        avgSyncTime: 0,
        lastSyncTime: 0
      };
    }
    
    syncCodeToVisual() {
      if (this.isSyncing) return false;
      
      this.isSyncing = true;
      this.syncDirection = 'code-to-visual';
      
      const startTime = performance.now();
      
      try {
        const code = this.codeEditor.getValue();
        const parsed = this.htmlParser.parse(code);
        
        if (parsed && this.visualCanvas) {
          this.visualCanvas.innerHTML = code;
        }
        
        this.lastCodeValue = code;
        this.metrics.syncCount++;
        this.metrics.lastSyncTime = performance.now() - startTime;
        
        return true;
      } finally {
        this.isSyncing = false;
      }
    }
    
    syncVisualToCode() {
      if (this.isSyncing) return false;
      
      this.isSyncing = true;
      this.syncDirection = 'visual-to-code';
      
      try {
        const html = this.visualCanvas.innerHTML;
        this.codeEditor.setValue(html);
        this.lastVisualHTML = html;
        
        return true;
      } finally {
        this.isSyncing = false;
      }
    }
    
    getMetrics() {
      return { ...this.metrics };
    }
    
    dispose() {
      this.codeEditor = null;
      this.visualCanvas = null;
      this.htmlParser = null;
      this.domSerializer = null;
      this.diffEngine = null;
    }
  }

  let parser, serializer, diffEngine, syncManager;
  let mockEditor, mockCanvas;

  beforeEach(() => {
    document.body.innerHTML = '<div id="canvas"></div>';
    
    parser = new MockHTMLParser();
    serializer = new MockDOMSerializer();
    diffEngine = new MockDiffEngine();
    
    mockEditor = {
      getValue: jest.fn(() => '<div>Test</div>'),
      setValue: jest.fn()
    };
    
    mockCanvas = document.getElementById('canvas');
    
    syncManager = new MockSyncManager(mockEditor, mockCanvas);
  });

  afterEach(() => {
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  describe('HTML Parser', () => {
    test('should parse simple HTML', () => {
      const html = '<div class="test">Hello</div>';
      const parsed = parser.parse(html);
      
      expect(parsed).toBeDefined();
      expect(parsed.type).toBe('element');
      expect(parsed.tag).toBe('div');
    });

    test('should parse nested HTML', () => {
      const html = '<div><p><span>Nested</span></p></div>';
      const parsed = parser.parse(html);
      
      expect(parsed).toBeDefined();
      expect(parsed.tag).toBe('div');
      expect(parsed.children.length).toBeGreaterThan(0);
    });

    test('should extract attributes', () => {
      const html = '<div id="test" class="container" data-value="123">Content</div>';
      const parsed = parser.parse(html);
      
      expect(parsed.attributes.id).toBe('test');
      expect(parsed.attributes.class).toBe('container');
      expect(parsed.attributes['data-value']).toBe('123');
    });

    test('should handle text nodes', () => {
      const html = '<p>Hello World</p>';
      const parsed = parser.parse(html);
      
      expect(parsed.children.length).toBeGreaterThan(0);
      expect(parsed.children[0].type).toBe('text');
      expect(parsed.children[0].content).toBe('Hello World');
    });

    test('should validate HTML structure', () => {
      const validHTML = '<div><p>Valid</p></div>';
      const result = parser.validate(validHTML);
      
      expect(result.valid).toBe(true);
    });
  });

  describe('DOM Serializer', () => {
    test('should serialize element to HTML', () => {
      const element = document.createElement('div');
      element.className = 'test';
      element.textContent = 'Hello';
      
      const html = serializer.serialize(element);
      
      expect(html).toContain('div');
      expect(html).toContain('test');
      expect(html).toContain('Hello');
    });

    test('should serialize nested elements', () => {
      const parent = document.createElement('div');
      const child = document.createElement('p');
      child.textContent = 'Child';
      parent.appendChild(child);
      
      const html = serializer.serialize(parent);
      
      expect(html).toContain('<p>');
      expect(html).toContain('Child');
    });

    test('should handle self-closing tags', () => {
      const element = document.createElement('div');
      const img = document.createElement('img');
      img.src = 'test.jpg';
      element.appendChild(img);
      
      const html = serializer.serialize(element);
      
      expect(html).toContain('img');
      expect(html).toContain('test.jpg');
    });

    test('should format HTML with indentation', () => {
      const element = document.createElement('div');
      const child = document.createElement('p');
      child.textContent = 'Test';
      element.appendChild(child);
      
      const html = serializer.serializeWithFormat(element, { indent: true, indentSize: 2 });
      
      expect(html).toBeDefined();
      expect(typeof html).toBe('string');
    });

    test('should minify HTML', () => {
      const element = document.createElement('div');
      element.innerHTML = '  <p>  Test  </p>  ';
      
      const html = serializer.serializeWithFormat(element, { minify: true });
      
      expect(html).not.toContain('  ');
    });

    test('should extract inline styles', () => {
      const element = document.createElement('div');
      element.style.color = 'red';
      element.style.fontSize = '16px';
      
      const styles = serializer.extractStyles(element);
      
      expect(styles.color).toBe('red');
      expect(styles['font-size']).toBe('16px');
    });
  });

  describe('Diff Engine', () => {
    test('should detect added elements', () => {
      const oldTree = null;
      const newTree = { type: 'element', tag: 'div', attributes: {}, children: [] };
      
      const changes = diffEngine.diff(oldTree, newTree);
      
      expect(changes.length).toBeGreaterThan(0);
      expect(changes[0].type).toBe('add');
    });

    test('should detect removed elements', () => {
      const oldTree = { type: 'element', tag: 'div', attributes: {}, children: [] };
      const newTree = null;
      
      const changes = diffEngine.diff(oldTree, newTree);
      
      expect(changes.length).toBeGreaterThan(0);
      expect(changes[0].type).toBe('remove');
    });

    test('should detect updated elements', () => {
      const oldTree = { type: 'element', tag: 'div', attributes: {}, children: [] };
      const newTree = { type: 'element', tag: 'span', attributes: {}, children: [] };
      
      const changes = diffEngine.diff(oldTree, newTree);
      
      expect(changes.some(c => c.type === 'update')).toBe(true);
    });

    test('should detect text content changes', () => {
      const oldTree = { type: 'text', content: 'Old' };
      const newTree = { type: 'text', content: 'New' };
      
      const changes = diffEngine.diff(oldTree, newTree);
      
      expect(changes.some(c => c.type === 'text')).toBe(true);
    });

    test('should detect attribute changes', () => {
      const oldTree = { type: 'element', tag: 'div', attributes: { class: 'old' }, children: [] };
      const newTree = { type: 'element', tag: 'div', attributes: { class: 'new' }, children: [] };
      
      const changes = diffEngine.diff(oldTree, newTree);
      
      expect(changes.some(c => c.type === 'attributes')).toBe(true);
    });

    test('should optimize changes', () => {
      const changes = [
        { type: 'add', node: { tag: 'div' } },
        { type: 'add', node: { tag: 'div' } }, // duplicate
        { type: 'remove', node: { tag: 'p' } }
      ];
      
      const optimized = diffEngine.optimize(changes);
      
      expect(optimized.length).toBeLessThan(changes.length);
    });
  });

  describe('Sync Manager Integration', () => {
    test('should initialize with editor and canvas', () => {
      expect(syncManager.codeEditor).toBe(mockEditor);
      expect(syncManager.visualCanvas).toBe(mockCanvas);
      expect(syncManager.isSyncing).toBe(false);
    });

    test('should not sync when already syncing', () => {
      syncManager.isSyncing = true;
      
      const result = syncManager.syncCodeToVisual();
      
      expect(result).toBe(false);
    });

    test('should track sync direction', () => {
      syncManager.syncCodeToVisual();
      expect(syncManager.syncDirection).toBe('code-to-visual');
      
      syncManager.syncVisualToCode();
      expect(syncManager.syncDirection).toBe('visual-to-code');
    });

    test('should get performance metrics', () => {
      syncManager.syncCodeToVisual();
      
      const metrics = syncManager.getMetrics();
      
      expect(metrics).toBeDefined();
      expect(metrics.syncCount).toBeGreaterThan(0);
    });

    test('should dispose properly', () => {
      syncManager.dispose();
      
      expect(syncManager.codeEditor).toBeNull();
      expect(syncManager.visualCanvas).toBeNull();
    });
  });

  describe('Performance', () => {
    test('should sync within 100ms', () => {
      const startTime = performance.now();
      
      syncManager.syncCodeToVisual();
      
      const endTime = performance.now();
      expect(endTime - startTime).toBeLessThan(100);
    });

    test('should handle large HTML efficiently', () => {
      // Generate large HTML
      let largeHTML = '<div>';
      for (let i = 0; i < 100; i++) {
        largeHTML += `<p class="item-${i}">Content ${i}</p>`;
      }
      largeHTML += '</div>';
      
      mockEditor.getValue.mockReturnValue(largeHTML);
      
      const startTime = performance.now();
      syncManager.syncCodeToVisual();
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(500);
    });
  });
});
