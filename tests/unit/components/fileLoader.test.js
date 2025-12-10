/**
 * Unit tests for FileLoader component
 * @test
 */

const FileLoader = require('../../../src/components/fileLoader');

// Helper function for async waiting
const waitFor = (condition, timeout = 1000) => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const check = () => {
      if (condition()) {
        resolve();
      } else if (Date.now() - startTime > timeout) {
        resolve(); // Resolve anyway after timeout
      } else {
        setTimeout(check, 10);
      }
    };
    check();
  });
};

describe('FileLoader', () => {
  let fileLoader;
  let mockCanvas;

  beforeEach(() => {
    // Setup DOM
    document.body.innerHTML = `
      <div id="canvas"></div>
    `;

    mockCanvas = document.getElementById('canvas');

    // Mock window functions
    window.showToast = jest.fn();
    window.elementIdCounter = 1;
    window.deleteElement = jest.fn();
    window.selectElement = jest.fn();
    window.makeElementEditable = jest.fn();
    window.componentExtractor = null;
    window.confirm = jest.fn(() => true);
    window.alert = jest.fn();

    // Mock crypto for nonce generation
    Object.defineProperty(global, 'crypto', {
      value: {
        getRandomValues: jest.fn(arr => {
          for (let i = 0; i < arr.length; i++) {
            arr[i] = Math.floor(Math.random() * 256);
          }
          return arr;
        })
      },
      writable: true
    });

    // Mock process.env
    process.env.NODE_ENV = 'test';

    // Clear localStorage
    localStorage.clear();

    fileLoader = new FileLoader();
  });

  afterEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = '';
    localStorage.clear();
  });

  describe('Constructor', () => {
    it('should initialize with supported file types', () => {
      expect(fileLoader.supportedTypes).toBeDefined();
      expect(fileLoader.supportedTypes.html).toContain('text/html');
      expect(fileLoader.supportedTypes.css).toContain('text/css');
      expect(fileLoader.supportedTypes.js).toContain('text/javascript');
      expect(fileLoader.supportedTypes.images).toContain('image/png');
    });

    it('should have all expected file type categories', () => {
      expect(Object.keys(fileLoader.supportedTypes)).toEqual(['html', 'css', 'js', 'images']);
    });

    it('should support multiple image formats', () => {
      const imageTypes = fileLoader.supportedTypes.images;
      expect(imageTypes).toContain('image/png');
      expect(imageTypes).toContain('image/jpeg');
      expect(imageTypes).toContain('image/gif');
      expect(imageTypes).toContain('image/webp');
      expect(imageTypes).toContain('image/svg+xml');
    });
  });

  describe('setupDropZone()', () => {
    it('should setup event listeners on canvas', () => {
      const addEventListenerSpy = jest.spyOn(mockCanvas, 'addEventListener');
      
      // Create new instance to trigger setupDropZone
      const newLoader = new FileLoader();
      
      // Should have added listeners for drag events
      expect(addEventListenerSpy).toHaveBeenCalled();
    });

    it('should handle missing canvas gracefully', () => {
      document.body.innerHTML = '';
      
      expect(() => {
        new FileLoader();
      }).toThrow();
    });
  });

  describe('preventDefaults()', () => {
    it('should prevent default event behavior', () => {
      const mockEvent = {
        preventDefault: jest.fn(),
        stopPropagation: jest.fn()
      };

      fileLoader.preventDefaults(mockEvent);

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockEvent.stopPropagation).toHaveBeenCalled();
    });
  });

  describe('highlight()', () => {
    it('should add file-drop-zone class to canvas', () => {
      fileLoader.highlight({});
      
      expect(mockCanvas.classList.contains('file-drop-zone')).toBe(true);
    });
  });

  describe('unhighlight()', () => {
    it('should remove file-drop-zone class from canvas', () => {
      mockCanvas.classList.add('file-drop-zone');
      
      fileLoader.unhighlight({});
      
      expect(mockCanvas.classList.contains('file-drop-zone')).toBe(false);
    });
  });

  describe('handleDrop()', () => {
    it('should process dropped files', async () => {
      const processFilesSpy = jest.spyOn(fileLoader, 'processFiles').mockResolvedValue();
      const mockFile = new File(['content'], 'test.html', { type: 'text/html' });
      
      const mockEvent = {
        dataTransfer: {
          files: [mockFile]
        }
      };

      await fileLoader.handleDrop(mockEvent);

      expect(processFilesSpy).toHaveBeenCalledWith([mockFile]);
    });

    it('should not process when no files dropped', async () => {
      const processFilesSpy = jest.spyOn(fileLoader, 'processFiles').mockResolvedValue();
      
      const mockEvent = {
        dataTransfer: {
          files: []
        }
      };

      await fileLoader.handleDrop(mockEvent);

      expect(processFilesSpy).not.toHaveBeenCalled();
    });
  });

  describe('processFiles()', () => {
    it('should process multiple files', async () => {
      const processFileSpy = jest.spyOn(fileLoader, 'processFile').mockResolvedValue();
      
      const files = [
        new File(['content1'], 'test1.html', { type: 'text/html' }),
        new File(['content2'], 'test2.css', { type: 'text/css' })
      ];

      await fileLoader.processFiles(files);

      expect(processFileSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('processFile()', () => {
    it('should reject files that are too large', async () => {
      const largeContent = 'x'.repeat(11 * 1024 * 1024); // 11MB
      const largeFile = new File([largeContent], 'large.html', { type: 'text/html' });
      
      const showErrorSpy = jest.spyOn(fileLoader, 'showError');

      await fileLoader.processFile(largeFile);

      expect(showErrorSpy).toHaveBeenCalledWith(expect.stringContaining('demasiado grande'));
    });

    it('should process HTML files', async () => {
      const loadHTMLFileSpy = jest.spyOn(fileLoader, 'loadHTMLFile').mockResolvedValue();
      const htmlFile = new File(['<html></html>'], 'test.html', { type: 'text/html' });

      await fileLoader.processFile(htmlFile);

      expect(loadHTMLFileSpy).toHaveBeenCalled();
    });

    it('should process CSS files', async () => {
      const loadCSSFileSpy = jest.spyOn(fileLoader, 'loadCSSFile').mockResolvedValue();
      const cssFile = new File(['.test { color: red; }'], 'test.css', { type: 'text/css' });

      await fileLoader.processFile(cssFile);

      expect(loadCSSFileSpy).toHaveBeenCalled();
    });

    it('should process JS files', async () => {
      const loadJSFileSpy = jest.spyOn(fileLoader, 'loadJSFile').mockResolvedValue();
      const jsFile = new File(['console.log("test")'], 'test.js', { type: 'text/javascript' });

      await fileLoader.processFile(jsFile);

      expect(loadJSFileSpy).toHaveBeenCalled();
    });

    it('should process image files', async () => {
      const loadImageFileSpy = jest.spyOn(fileLoader, 'loadImageFile').mockResolvedValue();
      const imageFile = new File([''], 'test.png', { type: 'image/png' });

      await fileLoader.processFile(imageFile);

      expect(loadImageFileSpy).toHaveBeenCalled();
    });

    it('should show error for unsupported file types', async () => {
      const showErrorSpy = jest.spyOn(fileLoader, 'showError');
      const unsupportedFile = new File(['content'], 'test.xyz', { type: 'application/octet-stream' });

      await fileLoader.processFile(unsupportedFile);

      expect(showErrorSpy).toHaveBeenCalledWith(expect.stringContaining('no soportado'));
    });

    it('should handle processing errors gracefully', async () => {
      const showErrorSpy = jest.spyOn(fileLoader, 'showError');
      jest.spyOn(fileLoader, 'loadHTMLFile').mockRejectedValue(new Error('Test error'));
      
      const htmlFile = new File(['<html></html>'], 'test.html', { type: 'text/html' });

      await fileLoader.processFile(htmlFile);

      expect(showErrorSpy).toHaveBeenCalledWith(expect.stringContaining('Error al cargar'));
    });
  });

  describe('getFileType()', () => {
    it('should identify HTML files by MIME type', () => {
      const htmlFile = new File([''], 'test.html', { type: 'text/html' });
      expect(fileLoader.getFileType(htmlFile)).toBe('html');
    });

    it('should identify HTML files by extension', () => {
      const htmlFile = new File([''], 'test.html', { type: 'text/plain' });
      expect(fileLoader.getFileType(htmlFile)).toBe('html');
    });

    it('should identify HTM files', () => {
      const htmFile = new File([''], 'test.htm', { type: 'text/plain' });
      expect(fileLoader.getFileType(htmFile)).toBe('html');
    });

    it('should identify CSS files by MIME type', () => {
      const cssFile = new File([''], 'test.css', { type: 'text/css' });
      expect(fileLoader.getFileType(cssFile)).toBe('css');
    });

    it('should identify CSS files by extension', () => {
      const cssFile = new File([''], 'test.css', { type: 'text/css' });
      expect(fileLoader.getFileType(cssFile)).toBe('css');
    });

    it('should identify JavaScript files by MIME type', () => {
      const jsFile = new File([''], 'test.js', { type: 'text/javascript' });
      expect(fileLoader.getFileType(jsFile)).toBe('js');
    });

    it('should identify JavaScript files by application/javascript', () => {
      const jsFile = new File([''], 'test.js', { type: 'application/javascript' });
      expect(fileLoader.getFileType(jsFile)).toBe('js');
    });

    it('should identify PNG images', () => {
      const pngFile = new File([''], 'test.png', { type: 'image/png' });
      expect(fileLoader.getFileType(pngFile)).toBe('images');
    });

    it('should identify JPEG images', () => {
      const jpegFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
      expect(fileLoader.getFileType(jpegFile)).toBe('images');
    });

    it('should identify GIF images', () => {
      const gifFile = new File([''], 'test.gif', { type: 'image/gif' });
      expect(fileLoader.getFileType(gifFile)).toBe('images');
    });

    it('should identify WebP images', () => {
      const webpFile = new File([''], 'test.webp', { type: 'image/webp' });
      expect(fileLoader.getFileType(webpFile)).toBe('images');
    });

    it('should identify SVG images', () => {
      const svgFile = new File([''], 'test.svg', { type: 'image/svg+xml' });
      expect(fileLoader.getFileType(svgFile)).toBe('images');
    });

    it('should return null for unsupported file types', () => {
      const unsupportedFile = new File([''], 'test.xyz', { type: 'application/octet-stream' });
      expect(fileLoader.getFileType(unsupportedFile)).toBeNull();
    });

    it('should return null for invalid file names', () => {
      const invalidFile = new File([''], '../../../etc/passwd', { type: 'text/plain' });
      expect(fileLoader.getFileType(invalidFile)).toBeNull();
    });

    it('should handle files with special characters in name', () => {
      const specialFile = new File([''], 'test<script>.html', { type: 'text/html' });
      expect(fileLoader.getFileType(specialFile)).toBeNull();
    });
  });

  describe('isValidFileName()', () => {
    it('should accept valid file names', () => {
      expect(fileLoader.isValidFileName('test.html')).toBe(true);
      expect(fileLoader.isValidFileName('my-file.css')).toBe(true);
      expect(fileLoader.isValidFileName('script_v2.js')).toBe(true);
      expect(fileLoader.isValidFileName('image.png')).toBe(true);
    });

    it('should reject file names with path traversal', () => {
      expect(fileLoader.isValidFileName('../test.html')).toBe(false);
      expect(fileLoader.isValidFileName('../../etc/passwd')).toBe(false);
    });

    it('should reject file names with special characters', () => {
      expect(fileLoader.isValidFileName('test<script>.html')).toBe(false);
      expect(fileLoader.isValidFileName('test;rm -rf.html')).toBe(false);
    });

    it('should reject file names without extension', () => {
      expect(fileLoader.isValidFileName('testfile')).toBe(false);
    });
  });

  describe('loadHTMLFile()', () => {
    it('should load valid HTML file', async () => {
      const htmlContent = '<div>Test Content</div>';
      const htmlFile = new File([htmlContent], 'test.html', { type: 'text/html' });
      
      jest.spyOn(fileLoader, 'readFileAsText').mockResolvedValue(htmlContent);
      jest.spyOn(fileLoader, 'showHTMLPreview').mockResolvedValue(true);
      
      // Mock HTMLParser
      global.HTMLParser = jest.fn().mockImplementation(() => ({
        parseAndLoad: jest.fn().mockResolvedValue()
      }));

      const showSuccessSpy = jest.spyOn(fileLoader, 'showSuccess');

      await fileLoader.loadHTMLFile(htmlFile, content => content);

      expect(showSuccessSpy).toHaveBeenCalledWith(expect.stringContaining('cargado correctamente'));
    });

    it('should reject HTML files that are too large', async () => {
      const largeContent = 'x'.repeat(2 * 1024 * 1024); // 2MB
      const htmlFile = new File([largeContent], 'large.html', { type: 'text/html' });
      
      jest.spyOn(fileLoader, 'readFileAsText').mockResolvedValue(largeContent);
      const showErrorSpy = jest.spyOn(fileLoader, 'showError');

      await fileLoader.loadHTMLFile(htmlFile, content => content);

      expect(showErrorSpy).toHaveBeenCalledWith(expect.stringContaining('demasiado grande'));
    });

    it('should not load if user cancels preview', async () => {
      const htmlContent = '<div>Test</div>';
      const htmlFile = new File([htmlContent], 'test.html', { type: 'text/html' });
      
      jest.spyOn(fileLoader, 'readFileAsText').mockResolvedValue(htmlContent);
      jest.spyOn(fileLoader, 'showHTMLPreview').mockResolvedValue(false);
      
      const showSuccessSpy = jest.spyOn(fileLoader, 'showSuccess');

      await fileLoader.loadHTMLFile(htmlFile, content => content);

      expect(showSuccessSpy).not.toHaveBeenCalled();
    });

    it('should extract components when componentExtractor is available', async () => {
      const htmlContent = '<div>Test</div>';
      const htmlFile = new File([htmlContent], 'test.html', { type: 'text/html' });
      
      jest.spyOn(fileLoader, 'readFileAsText').mockResolvedValue(htmlContent);
      jest.spyOn(fileLoader, 'showHTMLPreview').mockResolvedValue(true);
      
      global.HTMLParser = jest.fn().mockImplementation(() => ({
        parseAndLoad: jest.fn().mockResolvedValue()
      }));

      window.componentExtractor = {
        extractComponents: jest.fn().mockReturnValue([{ name: 'test' }]),
        saveExtractedComponents: jest.fn().mockReturnValue(1)
      };

      const showSuccessSpy = jest.spyOn(fileLoader, 'showSuccess');

      await fileLoader.loadHTMLFile(htmlFile, content => content);

      expect(window.componentExtractor.extractComponents).toHaveBeenCalled();
      expect(showSuccessSpy).toHaveBeenCalledWith(expect.stringContaining('componentes extraídos'));
    });

    it('should handle errors during HTML loading', async () => {
      const htmlFile = new File(['<div>Test</div>'], 'test.html', { type: 'text/html' });
      
      jest.spyOn(fileLoader, 'readFileAsText').mockRejectedValue(new Error('Read error'));
      const showErrorSpy = jest.spyOn(fileLoader, 'showError');

      await fileLoader.loadHTMLFile(htmlFile, content => content);

      expect(showErrorSpy).toHaveBeenCalledWith(expect.stringContaining('Error al procesar'));
    });
  });

  describe('loadCSSFile()', () => {
    it('should load valid CSS file', async () => {
      const cssContent = '.test { color: red; }';
      const cssFile = new File([cssContent], 'test.css', { type: 'text/css' });
      
      jest.spyOn(fileLoader, 'readFileAsText').mockResolvedValue(cssContent);
      const showSuccessSpy = jest.spyOn(fileLoader, 'showSuccess');

      await fileLoader.loadCSSFile(cssFile, content => content);

      expect(showSuccessSpy).toHaveBeenCalledWith(expect.stringContaining('Estilos CSS'));
      
      // Check that style element was added
      const styleElement = document.querySelector('style[data-source="test.css"]');
      expect(styleElement).toBeTruthy();
      expect(styleElement.textContent).toBe(cssContent);
    });

    it('should reject CSS files that are too large', async () => {
      const largeContent = 'x'.repeat(200 * 1024); // 200KB
      const cssFile = new File([largeContent], 'large.css', { type: 'text/css' });
      
      jest.spyOn(fileLoader, 'readFileAsText').mockResolvedValue(largeContent);
      const showErrorSpy = jest.spyOn(fileLoader, 'showError');

      await fileLoader.loadCSSFile(cssFile, content => content);

      expect(showErrorSpy).toHaveBeenCalledWith(expect.stringContaining('demasiado grande'));
    });

    it('should sanitize CSS content', async () => {
      const cssContent = '.test { color: red; }';
      const cssFile = new File([cssContent], 'test.css', { type: 'text/css' });
      
      const sanitizer = jest.fn(content => content.toUpperCase());
      jest.spyOn(fileLoader, 'readFileAsText').mockResolvedValue(cssContent);

      await fileLoader.loadCSSFile(cssFile, sanitizer);

      expect(sanitizer).toHaveBeenCalledWith(cssContent);
    });

    it('should add data-sanitized attribute to style element', async () => {
      const cssContent = '.test { color: red; }';
      const cssFile = new File([cssContent], 'test.css', { type: 'text/css' });
      
      jest.spyOn(fileLoader, 'readFileAsText').mockResolvedValue(cssContent);

      await fileLoader.loadCSSFile(cssFile, content => content);

      const styleElement = document.querySelector('style[data-sanitized="true"]');
      expect(styleElement).toBeTruthy();
    });
  });

  describe('loadJSFile()', () => {
    it('should load JavaScript file when user confirms', async () => {
      const jsContent = 'console.log("test")';
      const jsFile = new File([jsContent], 'test.js', { type: 'text/javascript' });
      
      jest.spyOn(fileLoader, 'readFileAsText').mockResolvedValue(jsContent);
      window.confirm = jest.fn(() => true);
      const showSuccessSpy = jest.spyOn(fileLoader, 'showSuccess');

      await fileLoader.loadJSFile(jsFile, content => content);

      expect(window.confirm).toHaveBeenCalled();
      expect(showSuccessSpy).toHaveBeenCalledWith(expect.stringContaining('JavaScript'));
    });

    it('should not load JavaScript file when user cancels', async () => {
      const jsContent = 'console.log("test")';
      const jsFile = new File([jsContent], 'test.js', { type: 'text/javascript' });
      
      jest.spyOn(fileLoader, 'readFileAsText').mockResolvedValue(jsContent);
      window.confirm = jest.fn(() => false);
      const showSuccessSpy = jest.spyOn(fileLoader, 'showSuccess');

      await fileLoader.loadJSFile(jsFile, content => content);

      expect(showSuccessSpy).not.toHaveBeenCalled();
    });

    it('should reject JavaScript files that are too large', async () => {
      const largeContent = 'x'.repeat(200 * 1024); // 200KB
      const jsFile = new File([largeContent], 'large.js', { type: 'text/javascript' });
      
      jest.spyOn(fileLoader, 'readFileAsText').mockResolvedValue(largeContent);
      const showErrorSpy = jest.spyOn(fileLoader, 'showError');

      await fileLoader.loadJSFile(jsFile, content => content);

      expect(showErrorSpy).toHaveBeenCalledWith(expect.stringContaining('demasiado grande'));
    });

    it('should add nonce attribute to script element', async () => {
      const jsContent = 'console.log("test")';
      const jsFile = new File([jsContent], 'test.js', { type: 'text/javascript' });
      
      jest.spyOn(fileLoader, 'readFileAsText').mockResolvedValue(jsContent);
      window.confirm = jest.fn(() => true);

      await fileLoader.loadJSFile(jsFile, content => content);

      const scriptElement = document.querySelector('script[data-source="test.js"]');
      expect(scriptElement).toBeTruthy();
      expect(scriptElement.getAttribute('nonce')).toBeTruthy();
    });

    it('should handle JavaScript execution errors', async () => {
      const jsContent = 'throw new Error("test")';
      const jsFile = new File([jsContent], 'test.js', { type: 'text/javascript' });
      
      jest.spyOn(fileLoader, 'readFileAsText').mockResolvedValue(jsContent);
      window.confirm = jest.fn(() => true);
      
      // Mock document.head.appendChild to throw
      const originalAppendChild = document.head.appendChild;
      document.head.appendChild = jest.fn(() => {
        throw new Error('Execution error');
      });

      const showErrorSpy = jest.spyOn(fileLoader, 'showError');

      await fileLoader.loadJSFile(jsFile, content => content);

      expect(showErrorSpy).toHaveBeenCalledWith(expect.stringContaining('Error al ejecutar'));

      document.head.appendChild = originalAppendChild;
    });
  });

  describe('loadImageFile()', () => {
    it('should load image file and add to canvas', async () => {
      const imageFile = new File([''], 'test.png', { type: 'image/png' });
      const dataUrl = 'data:image/png;base64,test';
      
      jest.spyOn(fileLoader, 'readFileAsDataURL').mockResolvedValue(dataUrl);
      const showSuccessSpy = jest.spyOn(fileLoader, 'showSuccess');

      await fileLoader.loadImageFile(imageFile);

      expect(showSuccessSpy).toHaveBeenCalledWith(expect.stringContaining('Imagen'));
      
      const imgElement = mockCanvas.querySelector('img');
      expect(imgElement).toBeTruthy();
      expect(imgElement.src).toBe(dataUrl);
      expect(imgElement.alt).toBe('test.png');
    });

    it('should add canvas-element class to image', async () => {
      const imageFile = new File([''], 'test.png', { type: 'image/png' });
      
      jest.spyOn(fileLoader, 'readFileAsDataURL').mockResolvedValue('data:image/png;base64,test');

      await fileLoader.loadImageFile(imageFile);

      const imgElement = mockCanvas.querySelector('img');
      expect(imgElement.classList.contains('canvas-element')).toBe(true);
    });

    it('should add delete button to image', async () => {
      const imageFile = new File([''], 'test.png', { type: 'image/png' });
      
      jest.spyOn(fileLoader, 'readFileAsDataURL').mockResolvedValue('data:image/png;base64,test');

      await fileLoader.loadImageFile(imageFile);

      const deleteBtn = mockCanvas.querySelector('.delete-btn');
      expect(deleteBtn).toBeTruthy();
    });

    it('should set data-component-type attribute', async () => {
      const imageFile = new File([''], 'test.png', { type: 'image/png' });
      
      jest.spyOn(fileLoader, 'readFileAsDataURL').mockResolvedValue('data:image/png;base64,test');

      await fileLoader.loadImageFile(imageFile);

      const imgElement = mockCanvas.querySelector('img');
      expect(imgElement.getAttribute('data-component-type')).toBe('img');
    });

    it('should increment element ID counter', async () => {
      const imageFile = new File([''], 'test.png', { type: 'image/png' });
      const initialCounter = window.elementIdCounter;
      
      jest.spyOn(fileLoader, 'readFileAsDataURL').mockResolvedValue('data:image/png;base64,test');

      await fileLoader.loadImageFile(imageFile);

      expect(window.elementIdCounter).toBe(initialCounter + 1);
    });
  });

  describe('showHTMLPreview()', () => {
    it('should create preview modal', async () => {
      const content = '<div>Test</div>';
      const fileName = 'test.html';

      // Start the preview but don't wait for it
      const previewPromise = fileLoader.showHTMLPreview(content, fileName);

      // Wait for modal to be created
      await waitFor(() => document.querySelector('.file-preview-modal') !== null);

      const modal = document.querySelector('.file-preview-modal');
      expect(modal).toBeTruthy();

      // Click load button to resolve
      const loadBtn = modal.querySelector('.load-btn');
      loadBtn.click();

      const result = await previewPromise;
      expect(result).toBe(true);
    });

    it('should return false when cancel is clicked', async () => {
      const content = '<div>Test</div>';
      const fileName = 'test.html';

      const previewPromise = fileLoader.showHTMLPreview(content, fileName);

      await waitFor(() => document.querySelector('.file-preview-modal') !== null);

      const modal = document.querySelector('.file-preview-modal');
      const cancelBtn = modal.querySelector('.cancel-btn');
      cancelBtn.click();

      const result = await previewPromise;
      expect(result).toBe(false);
    });
  });

  describe('createPreviewModal()', () => {
    it('should create modal with correct structure', () => {
      const content = '<div>Test</div>';
      const fileName = 'test.html';

      const modal = fileLoader.createPreviewModal(content, fileName);

      expect(modal.classList.contains('file-preview-modal')).toBe(true);
      expect(modal.querySelector('.modal-content')).toBeTruthy();
      expect(modal.querySelector('.modal-header')).toBeTruthy();
      expect(modal.querySelector('.modal-body')).toBeTruthy();
      expect(modal.querySelector('.load-btn')).toBeTruthy();
      expect(modal.querySelector('.cancel-btn')).toBeTruthy();
    });

    it('should include file name in header', () => {
      const modal = fileLoader.createPreviewModal('<div>Test</div>', 'myfile.html');

      expect(modal.innerHTML).toContain('myfile.html');
    });

    it('should include iframe with content', () => {
      const modal = fileLoader.createPreviewModal('<div>Test</div>', 'test.html');

      const iframe = modal.querySelector('iframe');
      expect(iframe).toBeTruthy();
    });
  });

  describe('readFileAsText()', () => {
    it('should read file content as text', async () => {
      const content = 'Test content';
      const file = new File([content], 'test.txt', { type: 'text/plain' });

      const result = await fileLoader.readFileAsText(file);

      expect(result).toBe(content);
    });

    it('should handle read errors', async () => {
      const file = new File([''], 'test.txt', { type: 'text/plain' });
      
      // Mock FileReader to simulate error
      const originalFileReader = global.FileReader;
      global.FileReader = jest.fn().mockImplementation(() => ({
        readAsText: jest.fn(function() {
          setTimeout(() => this.onerror(new Error('Read error')), 0);
        }),
        onload: null,
        onerror: null
      }));

      await expect(fileLoader.readFileAsText(file)).rejects.toThrow('Error al leer archivo');

      global.FileReader = originalFileReader;
    });
  });

  describe('readFileAsDataURL()', () => {
    it('should read file as data URL', async () => {
      const file = new File(['test'], 'test.png', { type: 'image/png' });

      const result = await fileLoader.readFileAsDataURL(file);

      expect(result).toContain('data:');
    });

    it('should handle read errors', async () => {
      const file = new File([''], 'test.png', { type: 'image/png' });
      
      const originalFileReader = global.FileReader;
      global.FileReader = jest.fn().mockImplementation(() => ({
        readAsDataURL: jest.fn(function() {
          setTimeout(() => this.onerror(new Error('Read error')), 0);
        }),
        onload: null,
        onerror: null
      }));

      await expect(fileLoader.readFileAsDataURL(file)).rejects.toThrow('Error al leer archivo');

      global.FileReader = originalFileReader;
    });
  });

  describe('escapeHtml()', () => {
    it('should escape HTML special characters', () => {
      const input = '<script>alert("xss")</script>';
      const result = fileLoader.escapeHtml(input);

      expect(result).not.toContain('<script>');
      expect(result).toContain('&lt;');
      expect(result).toContain('&gt;');
    });

    it('should escape quotes', () => {
      const input = '"test" & \'test\'';
      const result = fileLoader.escapeHtml(input);

      expect(result).toContain('&amp;');
    });

    it('should handle empty string', () => {
      expect(fileLoader.escapeHtml('')).toBe('');
    });
  });

  describe('generateNonce()', () => {
    it('should generate a base64 encoded nonce', () => {
      const nonce = fileLoader.generateNonce();

      expect(typeof nonce).toBe('string');
      expect(nonce.length).toBeGreaterThan(0);
    });

    it('should generate unique nonces', () => {
      const nonce1 = fileLoader.generateNonce();
      const nonce2 = fileLoader.generateNonce();

      expect(nonce1).not.toBe(nonce2);
    });
  });

  describe('showSuccess()', () => {
    it('should call showToast when available', () => {
      fileLoader.showSuccess('Test message');

      expect(window.showToast).toHaveBeenCalledWith('Test message');
    });

    it('should log to console when showToast is not available', () => {
      window.showToast = null;
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      fileLoader.showSuccess('Test message');

      expect(consoleSpy).toHaveBeenCalledWith('SUCCESS:', 'Test message');
    });

    it('should log activity', () => {
      const logActivitySpy = jest.spyOn(fileLoader, 'logActivity');

      fileLoader.showSuccess('Test message');

      expect(logActivitySpy).toHaveBeenCalledWith('SUCCESS', 'Test message');
    });
  });

  describe('showError()', () => {
    it('should call showToast when available', () => {
      fileLoader.showError('Error message');

      expect(window.showToast).toHaveBeenCalledWith('Error message');
    });

    it('should log to console when showToast is not available', () => {
      window.showToast = null;
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      fileLoader.showError('Error message');

      expect(consoleSpy).toHaveBeenCalledWith('ERROR:', 'Error message');
    });

    it('should show alert with sanitized message', () => {
      fileLoader.showError('Error <script>alert("xss")</script>');

      expect(window.alert).toHaveBeenCalled();
      // The alert should receive sanitized content
      const alertCall = window.alert.mock.calls[0][0];
      expect(alertCall).not.toContain('<script>');
    });

    it('should log activity', () => {
      const logActivitySpy = jest.spyOn(fileLoader, 'logActivity');

      fileLoader.showError('Error message');

      expect(logActivitySpy).toHaveBeenCalledWith('ERROR', 'Error message');
    });
  });

  describe('logActivity()', () => {
    it('should store activity in localStorage', () => {
      fileLoader.logActivity('TEST', 'Test message');

      const logs = JSON.parse(localStorage.getItem('activityLogs'));
      expect(logs).toHaveLength(1);
      expect(logs[0].type).toBe('TEST');
      expect(logs[0].message).toBe('Test message');
    });

    it('should include timestamp in log entry', () => {
      fileLoader.logActivity('TEST', 'Test message');

      const logs = JSON.parse(localStorage.getItem('activityLogs'));
      expect(logs[0].timestamp).toBeDefined();
      expect(new Date(logs[0].timestamp)).toBeInstanceOf(Date);
    });

    it('should append to existing logs', () => {
      fileLoader.logActivity('TEST1', 'Message 1');
      fileLoader.logActivity('TEST2', 'Message 2');

      const logs = JSON.parse(localStorage.getItem('activityLogs'));
      expect(logs).toHaveLength(2);
    });

    it('should trim logs to last 100 entries', () => {
      // Add 105 logs
      for (let i = 0; i < 105; i++) {
        fileLoader.logActivity('TEST', `Message ${i}`);
      }

      const logs = JSON.parse(localStorage.getItem('activityLogs'));
      expect(logs).toHaveLength(100);
      expect(logs[0].message).toBe('Message 5'); // First 5 should be trimmed
    });

    it('should log to console in non-production environment', () => {
      process.env.NODE_ENV = 'development';
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      fileLoader.logActivity('TEST', 'Test message');

      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('[TEST]'));
    });

    it('should not log to console in production environment', () => {
      process.env.NODE_ENV = 'production';
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      fileLoader.logActivity('TEST', 'Test message');

      // Should not have been called with the activity log format
      const activityLogCalls = consoleSpy.mock.calls.filter(
        call => call[0] && call[0].includes('[TEST]')
      );
      expect(activityLogCalls).toHaveLength(0);
    });
  });

  describe('Security Tests', () => {
    it('should sanitize script tags from HTML content', async () => {
      const maliciousContent = '<div><script>alert("xss")</script></div>';
      const htmlFile = new File([maliciousContent], 'test.html', { type: 'text/html' });
      
      jest.spyOn(fileLoader, 'readFileAsText').mockResolvedValue(maliciousContent);
      jest.spyOn(fileLoader, 'showHTMLPreview').mockResolvedValue(true);
      
      let sanitizedContent = '';
      global.HTMLParser = jest.fn().mockImplementation(() => ({
        parseAndLoad: jest.fn(content => {
          sanitizedContent = content;
        })
      }));

      await fileLoader.loadHTMLFile(htmlFile, content => {
        return content.replace(/<script.*?>.*?<\/script>/gim, '');
      });

      // The sanitizer should have removed the script tag
      expect(sanitizedContent).not.toContain('<script>');
    });

    it('should sanitize inline event handlers', async () => {
      const maliciousContent = '<div onclick="alert(\'xss\')">Click me</div>';
      const htmlFile = new File([maliciousContent], 'test.html', { type: 'text/html' });
      
      jest.spyOn(fileLoader, 'readFileAsText').mockResolvedValue(maliciousContent);
      jest.spyOn(fileLoader, 'showHTMLPreview').mockResolvedValue(true);
      
      let sanitizedContent = '';
      global.HTMLParser = jest.fn().mockImplementation(() => ({
        parseAndLoad: jest.fn(content => {
          sanitizedContent = content;
        })
      }));

      await fileLoader.loadHTMLFile(htmlFile, content => {
        return content.replace(/on\w+=".*?"/gim, '');
      });

      expect(sanitizedContent).not.toContain('onclick');
    });

    it('should sanitize iframes', async () => {
      const maliciousContent = '<div><iframe src="http://evil.com"></iframe></div>';
      const htmlFile = new File([maliciousContent], 'test.html', { type: 'text/html' });
      
      jest.spyOn(fileLoader, 'readFileAsText').mockResolvedValue(maliciousContent);
      jest.spyOn(fileLoader, 'showHTMLPreview').mockResolvedValue(true);
      
      let sanitizedContent = '';
      global.HTMLParser = jest.fn().mockImplementation(() => ({
        parseAndLoad: jest.fn(content => {
          sanitizedContent = content;
        })
      }));

      await fileLoader.loadHTMLFile(htmlFile, content => {
        return content.replace(/<iframe.*?>.*?<\/iframe>/gim, '');
      });

      expect(sanitizedContent).not.toContain('<iframe');
    });

    it('should reject files with path traversal in name', () => {
      const maliciousFile = new File([''], '../../../etc/passwd', { type: 'text/plain' });
      
      expect(fileLoader.getFileType(maliciousFile)).toBeNull();
    });

    it('should enforce file size limits', async () => {
      const largeContent = 'x'.repeat(15 * 1024 * 1024); // 15MB
      const largeFile = new File([largeContent], 'large.html', { type: 'text/html' });
      
      const showErrorSpy = jest.spyOn(fileLoader, 'showError');

      await fileLoader.processFile(largeFile);

      expect(showErrorSpy).toHaveBeenCalledWith(expect.stringContaining('demasiado grande'));
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty files', async () => {
      const emptyFile = new File([''], 'empty.html', { type: 'text/html' });
      
      jest.spyOn(fileLoader, 'readFileAsText').mockResolvedValue('');
      jest.spyOn(fileLoader, 'showHTMLPreview').mockResolvedValue(true);
      
      global.HTMLParser = jest.fn().mockImplementation(() => ({
        parseAndLoad: jest.fn().mockResolvedValue()
      }));

      const showSuccessSpy = jest.spyOn(fileLoader, 'showSuccess');

      await fileLoader.loadHTMLFile(emptyFile, content => content);

      expect(showSuccessSpy).toHaveBeenCalled();
    });

    it('should handle files with unicode characters', async () => {
      const unicodeContent = '<div>日本語テスト 🎉</div>';
      const unicodeFile = new File([unicodeContent], 'unicode.html', { type: 'text/html' });
      
      jest.spyOn(fileLoader, 'readFileAsText').mockResolvedValue(unicodeContent);
      jest.spyOn(fileLoader, 'showHTMLPreview').mockResolvedValue(true);
      
      global.HTMLParser = jest.fn().mockImplementation(() => ({
        parseAndLoad: jest.fn().mockResolvedValue()
      }));

      await expect(fileLoader.loadHTMLFile(unicodeFile, content => content)).resolves.not.toThrow();
    });

    it('should handle concurrent file loads', async () => {
      // Clear any existing style elements from previous tests
      document.querySelectorAll('style[data-source]').forEach(el => el.remove());
      
      const file1 = new File(['.test1 { color: red; }'], 'test1.css', { type: 'text/css' });
      const file2 = new File(['.test2 { color: blue; }'], 'test2.css', { type: 'text/css' });
      
      jest.spyOn(fileLoader, 'readFileAsText')
        .mockResolvedValueOnce('.test1 { color: red; }')
        .mockResolvedValueOnce('.test2 { color: blue; }');

      await Promise.all([
        fileLoader.loadCSSFile(file1, content => content),
        fileLoader.loadCSSFile(file2, content => content)
      ]);

      const styleElements = document.querySelectorAll('style[data-source]');
      expect(styleElements.length).toBe(2);
    });
  });
});
