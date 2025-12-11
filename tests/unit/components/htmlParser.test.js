/**
 * Unit tests for HTMLParser
 * @test
 */

const HTMLParser = require('../../../src/components/htmlParser');

describe('HTMLParser', () => {
  let htmlParser;

  beforeEach(() => {
    // Setup DOM
    document.body.innerHTML = `
      <div id="canvas"></div>
    `;

    // Mock global functions
    window.showToast = jest.fn();
    window.selectElement = jest.fn();
    window.makeElementEditable = jest.fn();
    window.deleteElement = jest.fn();
    window.elementIdCounter = 0;
    window.confirm = jest.fn(() => true);
    window.alert = jest.fn();

    htmlParser = new HTMLParser();
  });

  afterEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = '';
    // Clean up imported styles and scripts from head
    document.querySelectorAll('[data-source^="imported-"]').forEach(el => el.remove());
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  describe('Constructor', () => {
    it('should initialize with component types mapping', () => {
      expect(htmlParser.componentTypes).toBeDefined();
      expect(htmlParser.componentTypes.nav).toBe('navbar');
      expect(htmlParser.componentTypes.div).toBe('contenedor');
      expect(htmlParser.componentTypes.h1).toBe('h1');
    });

    it('should have skip elements list', () => {
      expect(htmlParser.skipElements).toContain('script');
      expect(htmlParser.skipElements).toContain('style');
      expect(htmlParser.skipElements).toContain('meta');
      expect(htmlParser.skipElements).toContain('head');
    });

    it('should initialize element counter from window', () => {
      window.elementIdCounter = 100;
      const parser = new HTMLParser();
      expect(parser.elementIdCounter).toBe(100);
    });

    it('should have all standard HTML element mappings', () => {
      expect(htmlParser.componentTypes.header).toBe('header');
      expect(htmlParser.componentTypes.footer).toBe('footer');
      expect(htmlParser.componentTypes.section).toBe('seccion');
      expect(htmlParser.componentTypes.article).toBe('article');
    });

    it('should have form element mappings', () => {
      expect(htmlParser.componentTypes.input).toBe('input');
      expect(htmlParser.componentTypes.textarea).toBe('textarea');
      expect(htmlParser.componentTypes.select).toBe('select');
      expect(htmlParser.componentTypes.button).toBe('button');
    });
  });

  describe('parseAndLoad()', () => {
    it('should parse valid HTML content', async () => {
      const html = `
        <!DOCTYPE html>
        <html>
        <body>
          <div>Test Content</div>
        </body>
        </html>
      `;

      await htmlParser.parseAndLoad(html);

      const canvas = document.getElementById('canvas');
      expect(canvas.children.length).toBeGreaterThan(0);
    });

    it('should show success message on completion', async () => {
      const html = '<body><div>Test</div></body>';

      await htmlParser.parseAndLoad(html);

      expect(window.showToast).toHaveBeenCalledWith(
        'HTML convertido exitosamente a componentes editables'
      );
    });

    it('should ask for confirmation when canvas has content', async () => {
      const canvas = document.getElementById('canvas');
      canvas.innerHTML = '<div>Existing content</div>';

      const html = '<body><div>New content</div></body>';
      await htmlParser.parseAndLoad(html);

      expect(window.confirm).toHaveBeenCalled();
    });

    it('should not replace content if user cancels', async () => {
      window.confirm = jest.fn(() => false);
      const canvas = document.getElementById('canvas');
      canvas.innerHTML = '<div>Existing content</div>';

      const html = '<body><div>New content</div></body>';
      await htmlParser.parseAndLoad(html);

      expect(canvas.innerHTML).toContain('Existing content');
    });

    it('should update global element counter', async () => {
      const html = '<body><div>Test</div><p>Paragraph</p></body>';

      await htmlParser.parseAndLoad(html);

      expect(window.elementIdCounter).toBeGreaterThan(0);
    });

    it('should handle empty body', async () => {
      const html = '<html><body></body></html>';

      await htmlParser.parseAndLoad(html);

      const canvas = document.getElementById('canvas');
      expect(canvas.children.length).toBe(0);
    });
  });

  describe('extractStyles()', () => {
    it('should extract inline style elements', async () => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(`
        <html>
        <head>
          <style>.test { color: red; }</style>
        </head>
        <body></body>
        </html>
      `, 'text/html');

      await htmlParser.extractStyles(doc);

      const importedStyles = document.querySelectorAll('[data-source^="imported-style"]');
      expect(importedStyles.length).toBeGreaterThan(0);
    });

    it('should extract external stylesheet links', async () => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(`
        <html>
        <head>
          <link rel="stylesheet" href="https://example.com/style.css">
        </head>
        <body></body>
        </html>
      `, 'text/html');

      await htmlParser.extractStyles(doc);

      const importedLinks = document.querySelectorAll('[data-source^="imported-link"]');
      expect(importedLinks.length).toBeGreaterThan(0);
    });

    it('should handle multiple style elements', async () => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(`
        <html>
        <head>
          <style>.test1 { color: red; }</style>
          <style>.test2 { color: blue; }</style>
        </head>
        <body></body>
        </html>
      `, 'text/html');

      await htmlParser.extractStyles(doc);

      const importedStyles = document.querySelectorAll('[data-source^="imported-style"]');
      expect(importedStyles.length).toBe(2);
    });
  });

  describe('extractScripts()', () => {
    it('should detect inline scripts', async () => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(`
        <html>
        <body>
          <script>console.log('test');</script>
        </body>
        </html>
      `, 'text/html');

      await htmlParser.extractScripts(doc);

      expect(window.confirm).toHaveBeenCalledWith(
        expect.stringContaining('script(s) JavaScript')
      );
    });

    it('should detect external scripts', async () => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(`
        <html>
        <body>
          <script src="https://example.com/script.js"></script>
        </body>
        </html>
      `, 'text/html');

      await htmlParser.extractScripts(doc);

      expect(window.confirm).toHaveBeenCalled();
    });

    it('should not include scripts if user declines', async () => {
      window.confirm = jest.fn(() => false);

      const parser = new DOMParser();
      const doc = parser.parseFromString(`
        <html>
        <body>
          <script>console.log('test');</script>
        </body>
        </html>
      `, 'text/html');

      await htmlParser.extractScripts(doc);

      const importedScripts = document.querySelectorAll('[data-source^="imported-script"]');
      expect(importedScripts.length).toBe(0);
    });

    it('should include scripts if user accepts', async () => {
      window.confirm = jest.fn(() => true);

      const parser = new DOMParser();
      const doc = parser.parseFromString(`
        <html>
        <body>
          <script>console.log('test');</script>
        </body>
        </html>
      `, 'text/html');

      await htmlParser.extractScripts(doc);

      const importedScripts = document.querySelectorAll('[data-source^="imported-script"]');
      expect(importedScripts.length).toBe(1);
    });
  });

  describe('shouldSkipElement()', () => {
    it('should skip script elements', () => {
      const script = document.createElement('script');
      expect(htmlParser.shouldSkipElement(script)).toBe(true);
    });

    it('should skip style elements', () => {
      const style = document.createElement('style');
      expect(htmlParser.shouldSkipElement(style)).toBe(true);
    });

    it('should skip meta elements', () => {
      const meta = document.createElement('meta');
      expect(htmlParser.shouldSkipElement(meta)).toBe(true);
    });

    it('should not skip div elements', () => {
      const div = document.createElement('div');
      expect(htmlParser.shouldSkipElement(div)).toBe(false);
    });

    it('should not skip section elements', () => {
      const section = document.createElement('section');
      expect(htmlParser.shouldSkipElement(section)).toBe(false);
    });

    it('should skip link elements', () => {
      const link = document.createElement('link');
      expect(htmlParser.shouldSkipElement(link)).toBe(true);
    });

    it('should skip title elements', () => {
      const title = document.createElement('title');
      expect(htmlParser.shouldSkipElement(title)).toBe(true);
    });
  });

  describe('convertElement()', () => {
    it('should create element with unique ID', async () => {
      const original = document.createElement('div');
      original.textContent = 'Test';

      const converted = await htmlParser.convertElement(original);

      expect(converted.id).toMatch(/^element-\d+$/);
    });

    it('should add canvas-element class', async () => {
      const original = document.createElement('div');

      const converted = await htmlParser.convertElement(original);

      expect(converted.classList.contains('canvas-element')).toBe(true);
    });

    it('should set data-component-type attribute', async () => {
      const original = document.createElement('nav');

      const converted = await htmlParser.convertElement(original);

      expect(converted.getAttribute('data-component-type')).toBe('navbar');
    });

    it('should copy attributes except id', async () => {
      const original = document.createElement('div');
      original.id = 'old-id';
      original.className = 'test-class';
      original.setAttribute('data-custom', 'value');

      const converted = await htmlParser.convertElement(original);

      expect(converted.id).not.toBe('old-id');
      expect(converted.className).toContain('test-class');
      expect(converted.getAttribute('data-custom')).toBe('value');
    });

    it('should copy inline styles', async () => {
      const original = document.createElement('div');
      original.style.color = 'red';
      original.style.fontSize = '16px';

      const converted = await htmlParser.convertElement(original);

      expect(converted.style.color).toBe('red');
      expect(converted.style.fontSize).toBe('16px');
    });

    it('should use default component type for unknown tags', async () => {
      const original = document.createElement('custom-element');

      const converted = await htmlParser.convertElement(original);

      expect(converted.getAttribute('data-component-type')).toBe('contenedor');
    });

    it('should increment element counter', async () => {
      const startCounter = htmlParser.elementIdCounter;
      const original = document.createElement('div');

      await htmlParser.convertElement(original);

      expect(htmlParser.elementIdCounter).toBe(startCounter + 1);
    });
  });

  describe('processElementContent()', () => {
    it('should copy text content for leaf elements', async () => {
      const original = document.createElement('p');
      original.textContent = 'Test paragraph';

      const newElement = document.createElement('p');
      await htmlParser.processElementContent(original, newElement);

      expect(newElement.textContent).toBe('Test paragraph');
    });

    it('should process child elements recursively', async () => {
      const original = document.createElement('div');
      const child = document.createElement('span');
      child.textContent = 'Child text';
      original.appendChild(child);

      const newElement = document.createElement('div');
      await htmlParser.processElementContent(original, newElement);

      expect(newElement.children.length).toBeGreaterThan(0);
    });
  });

  describe('addEditorFunctionality()', () => {
    it('should add delete button', () => {
      const element = document.createElement('div');

      htmlParser.addEditorFunctionality(element);

      const deleteBtn = element.querySelector('.delete-btn');
      expect(deleteBtn).toBeTruthy();
      expect(deleteBtn.textContent).toBe('×');
    });

    it('should add click event for selection', () => {
      const element = document.createElement('div');

      htmlParser.addEditorFunctionality(element);
      element.click();

      expect(window.selectElement).toHaveBeenCalledWith(element);
    });

    it('should add dblclick event for editing', () => {
      const element = document.createElement('div');

      htmlParser.addEditorFunctionality(element);
      element.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));

      expect(window.makeElementEditable).toHaveBeenCalledWith(element);
    });

    it('should handle delete button click', () => {
      const element = document.createElement('div');

      htmlParser.addEditorFunctionality(element);
      const deleteBtn = element.querySelector('.delete-btn');
      deleteBtn.click();

      expect(window.deleteElement).toHaveBeenCalledWith(element);
    });

    it('should remove element if deleteElement not available', () => {
      window.deleteElement = undefined;
      const element = document.createElement('div');
      document.body.appendChild(element);

      htmlParser.addEditorFunctionality(element);
      const deleteBtn = element.querySelector('.delete-btn');
      deleteBtn.click();

      expect(document.body.contains(element)).toBe(false);
    });
  });

  describe('detectSpecialComponents()', () => {
    it('should detect navbar by tag', () => {
      const nav = document.createElement('nav');
      const result = htmlParser.detectSpecialComponents(nav);

      expect(result.getAttribute('data-component-type')).toBe('navbar');
    });

    it('should detect navbar by class', () => {
      const div = document.createElement('div');
      div.className = 'navbar';
      const result = htmlParser.detectSpecialComponents(div);

      expect(result.getAttribute('data-component-type')).toBe('navbar');
    });

    it('should detect hero section', () => {
      const div = document.createElement('div');
      div.className = 'hero-section';
      const result = htmlParser.detectSpecialComponents(div);

      expect(result.getAttribute('data-component-type')).toBe('hero');
    });

    it('should detect card component', () => {
      const div = document.createElement('div');
      div.className = 'card';
      const result = htmlParser.detectSpecialComponents(div);

      expect(result.getAttribute('data-component-type')).toBe('card');
    });

    it('should detect footer', () => {
      const footer = document.createElement('footer');
      const result = htmlParser.detectSpecialComponents(footer);

      expect(result.getAttribute('data-component-type')).toBe('footer');
    });

    it('should return null for unrecognized elements', () => {
      const div = document.createElement('div');
      div.className = 'random-class';
      const result = htmlParser.detectSpecialComponents(div);

      expect(result).toBeNull();
    });

    it('should detect banner as hero', () => {
      const div = document.createElement('div');
      div.className = 'banner';
      const result = htmlParser.detectSpecialComponents(div);

      expect(result.getAttribute('data-component-type')).toBe('hero');
    });

    it('should detect jumbotron as hero', () => {
      const div = document.createElement('div');
      div.className = 'jumbotron';
      const result = htmlParser.detectSpecialComponents(div);

      expect(result.getAttribute('data-component-type')).toBe('hero');
    });
  });

  describe('convertToNavbar()', () => {
    it('should set navbar component type', () => {
      const element = document.createElement('nav');
      const result = htmlParser.convertToNavbar(element);

      expect(result.getAttribute('data-component-type')).toBe('navbar');
      expect(result.classList.contains('component-navbar')).toBe(true);
    });
  });

  describe('convertToHero()', () => {
    it('should set hero component type', () => {
      const element = document.createElement('section');
      const result = htmlParser.convertToHero(element);

      expect(result.getAttribute('data-component-type')).toBe('hero');
      expect(result.classList.contains('component-hero')).toBe(true);
    });
  });

  describe('convertToCard()', () => {
    it('should set card component type', () => {
      const element = document.createElement('div');
      const result = htmlParser.convertToCard(element);

      expect(result.getAttribute('data-component-type')).toBe('card');
      expect(result.classList.contains('component-card')).toBe(true);
    });
  });

  describe('convertToFooter()', () => {
    it('should set footer component type', () => {
      const element = document.createElement('footer');
      const result = htmlParser.convertToFooter(element);

      expect(result.getAttribute('data-component-type')).toBe('footer');
      expect(result.classList.contains('component-footer')).toBe(true);
    });
  });

  describe('showSuccess()', () => {
    it('should call showToast when available', () => {
      htmlParser.showSuccess('Test message');

      expect(window.showToast).toHaveBeenCalledWith('Test message');
    });

    it('should log to console when showToast not available', () => {
      window.showToast = undefined;
      const consoleSpy = jest.spyOn(console, 'log');

      htmlParser.showSuccess('Test message');

      expect(consoleSpy).toHaveBeenCalledWith('SUCCESS:', 'Test message');
    });
  });

  describe('showError()', () => {
    it('should call showToast when available', () => {
      htmlParser.showError('Error message');

      expect(window.showToast).toHaveBeenCalledWith('Error message');
    });

    it('should show alert', () => {
      htmlParser.showError('Error message');

      expect(window.alert).toHaveBeenCalledWith('Error message');
    });

    it('should log to console when showToast not available', () => {
      window.showToast = undefined;
      const consoleSpy = jest.spyOn(console, 'error');

      htmlParser.showError('Error message');

      expect(consoleSpy).toHaveBeenCalledWith('ERROR:', 'Error message');
    });
  });
});
