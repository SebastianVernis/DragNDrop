/**
 * Unit tests for LivePreview
 * @test
 */

const LivePreview = require('../../../src/core/livePreview');

describe('LivePreview', () => {
  let livePreview;
  let mockWindow;

  beforeEach(() => {
    // Setup DOM
    document.body.innerHTML = `
      <div id="canvas">
        <div class="canvas-element selected" data-component-type="h1">
          <h1>Test Heading</h1>
          <div class="delete-btn">×</div>
        </div>
        <div class="canvas-element" data-component-type="p">
          <p>Test paragraph</p>
          <div class="delete-btn">×</div>
        </div>
      </div>
      <style data-source="imported-style-1">.test { color: red; }</style>
      <script data-source="imported-script-1">console.log('test');</script>
    `;

    // Mock window.open
    mockWindow = {
      document: {
        open: jest.fn(),
        write: jest.fn(),
        close: jest.fn()
      },
      closed: false,
      close: jest.fn()
    };

    window.open = jest.fn(() => mockWindow);
    window.showToast = jest.fn();

    // Mock screen dimensions
    Object.defineProperty(window, 'screen', {
      value: { width: 1920, height: 1080 },
      writable: true
    });

    livePreview = new LivePreview();
  });

  afterEach(() => {
    jest.clearAllMocks();
    if (livePreview.isLive) {
      livePreview.stop();
    }
    document.body.innerHTML = '';
  });

  describe('Constructor', () => {
    it('should initialize with default values', () => {
      expect(livePreview.previewWindow).toBeNull();
      expect(livePreview.isLive).toBe(false);
      expect(livePreview.updateInterval).toBeNull();
      expect(livePreview.updateDelay).toBe(1000);
    });
  });

  describe('start()', () => {
    it('should open preview window', () => {
      livePreview.start();

      expect(window.open).toHaveBeenCalled();
      expect(livePreview.previewWindow).toBe(mockWindow);
    });

    it('should set isLive to true', () => {
      livePreview.start();

      expect(livePreview.isLive).toBe(true);
    });

    it('should show toast notification', () => {
      livePreview.start();

      expect(window.showToast).toHaveBeenCalledWith('Vista previa en vivo iniciada');
    });

    it('should not start if already live', () => {
      livePreview.start();
      window.open.mockClear();
      window.showToast.mockClear();

      livePreview.start();

      expect(window.open).not.toHaveBeenCalled();
      expect(window.showToast).toHaveBeenCalledWith('Vista previa ya está activa');
    });

    it('should start updates', () => {
      const startUpdatesSpy = jest.spyOn(livePreview, 'startUpdates');

      livePreview.start();

      expect(startUpdatesSpy).toHaveBeenCalled();
    });
  });

  describe('stop()', () => {
    beforeEach(() => {
      livePreview.start();
    });

    it('should close preview window', () => {
      livePreview.stop();

      expect(mockWindow.close).toHaveBeenCalled();
    });

    it('should set isLive to false', () => {
      livePreview.stop();

      expect(livePreview.isLive).toBe(false);
    });

    it('should clear preview window reference', () => {
      livePreview.stop();

      expect(livePreview.previewWindow).toBeNull();
    });

    it('should show toast notification', () => {
      window.showToast.mockClear();
      livePreview.stop();

      expect(window.showToast).toHaveBeenCalledWith('Vista previa detenida');
    });

    it('should stop updates', () => {
      const stopUpdatesSpy = jest.spyOn(livePreview, 'stopUpdates');

      livePreview.stop();

      expect(stopUpdatesSpy).toHaveBeenCalled();
    });

    it('should do nothing if not live', () => {
      livePreview.stop();
      mockWindow.close.mockClear();

      livePreview.stop();

      expect(mockWindow.close).not.toHaveBeenCalled();
    });
  });

  describe('openPreviewWindow()', () => {
    it('should open window with correct dimensions', () => {
      livePreview.openPreviewWindow();

      expect(window.open).toHaveBeenCalledWith(
        '',
        'Live Preview',
        expect.stringContaining('width=1200')
      );
      expect(window.open).toHaveBeenCalledWith(
        '',
        'Live Preview',
        expect.stringContaining('height=800')
      );
    });

    it('should center window on screen', () => {
      livePreview.openPreviewWindow();

      const callArgs = window.open.mock.calls[0][2];
      expect(callArgs).toContain('left=');
      expect(callArgs).toContain('top=');
    });

    it('should update preview after opening', () => {
      const updatePreviewSpy = jest.spyOn(livePreview, 'updatePreview');

      livePreview.openPreviewWindow();

      expect(updatePreviewSpy).toHaveBeenCalled();
    });

    it('should show error if popup blocked', () => {
      window.open = jest.fn(() => null);

      livePreview.openPreviewWindow();

      expect(window.showToast).toHaveBeenCalledWith(
        expect.stringContaining('No se pudo abrir'),
        'error'
      );
    });
  });

  describe('updatePreview()', () => {
    beforeEach(() => {
      livePreview.previewWindow = mockWindow;
    });

    it('should write HTML to preview window', () => {
      livePreview.updatePreview();

      expect(mockWindow.document.open).toHaveBeenCalled();
      expect(mockWindow.document.write).toHaveBeenCalled();
      expect(mockWindow.document.close).toHaveBeenCalled();
    });

    it('should stop if preview window is closed', () => {
      mockWindow.closed = true;
      const stopSpy = jest.spyOn(livePreview, 'stop');

      livePreview.updatePreview();

      expect(stopSpy).toHaveBeenCalled();
    });

    it('should handle missing canvas gracefully', () => {
      document.body.innerHTML = '';

      expect(() => livePreview.updatePreview()).not.toThrow();
    });

    it('should handle write errors', () => {
      mockWindow.document.write = jest.fn(() => {
        throw new Error('Write error');
      });
      const stopSpy = jest.spyOn(livePreview, 'stop');

      livePreview.updatePreview();

      expect(stopSpy).toHaveBeenCalled();
    });
  });

  describe('generatePreviewHTML()', () => {
    it('should generate complete HTML document', () => {
      const canvas = document.getElementById('canvas');
      const html = livePreview.generatePreviewHTML(canvas);

      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('<html lang="es">');
      expect(html).toContain('<head>');
      expect(html).toContain('<body>');
    });

    it('should include meta tags', () => {
      const canvas = document.getElementById('canvas');
      const html = livePreview.generatePreviewHTML(canvas);

      expect(html).toContain('<meta charset="UTF-8">');
      expect(html).toContain('viewport');
    });

    it('should remove editor classes from elements', () => {
      const canvas = document.getElementById('canvas');
      const html = livePreview.generatePreviewHTML(canvas);

      // The generated HTML should not contain editor-specific classes
      expect(html).not.toContain('class="canvas-element selected"');
    });

    it('should remove delete buttons', () => {
      const canvas = document.getElementById('canvas');
      const html = livePreview.generatePreviewHTML(canvas);

      expect(html).not.toContain('delete-btn');
    });

    it('should include collected styles', () => {
      const canvas = document.getElementById('canvas');
      const html = livePreview.generatePreviewHTML(canvas);

      expect(html).toContain('<style>');
    });

    it('should include auto-refresh script', () => {
      const canvas = document.getElementById('canvas');
      const html = livePreview.generatePreviewHTML(canvas);

      expect(html).toContain('setInterval');
    });
  });

  describe('collectStyles()', () => {
    it('should collect imported styles', () => {
      const styles = livePreview.collectStyles();

      expect(styles).toContain('.test { color: red; }');
    });

    it('should include component styles', () => {
      const styles = livePreview.collectStyles();

      expect(styles).toContain('.component-card');
      expect(styles).toContain('.component-navbar');
      expect(styles).toContain('.component-hero');
      expect(styles).toContain('.component-footer');
    });
  });

  describe('collectScripts()', () => {
    it('should collect imported scripts', () => {
      const scripts = livePreview.collectScripts();

      expect(scripts).toContain("console.log('test');");
    });

    it('should handle external scripts', () => {
      const externalScript = document.createElement('script');
      externalScript.src = 'https://example.com/script.js';
      externalScript.setAttribute('data-source', 'imported-external');
      document.head.appendChild(externalScript);

      const scripts = livePreview.collectScripts();

      expect(scripts).toContain('https://example.com/script.js');
    });
  });

  describe('startUpdates()', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      livePreview.previewWindow = mockWindow;
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should update preview immediately', () => {
      const updateSpy = jest.spyOn(livePreview, 'updatePreview');

      livePreview.startUpdates();

      expect(updateSpy).toHaveBeenCalled();
    });

    it('should set up periodic updates', () => {
      livePreview.startUpdates();

      expect(livePreview.updateInterval).not.toBeNull();
    });

    it('should update on interval', () => {
      const updateSpy = jest.spyOn(livePreview, 'updatePreview');

      livePreview.startUpdates();
      updateSpy.mockClear();

      jest.advanceTimersByTime(livePreview.updateDelay);

      expect(updateSpy).toHaveBeenCalled();
    });

    it('should stop existing updates before starting new ones', () => {
      const stopSpy = jest.spyOn(livePreview, 'stopUpdates');

      livePreview.startUpdates();

      expect(stopSpy).toHaveBeenCalled();
    });
  });

  describe('stopUpdates()', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should clear update interval', () => {
      livePreview.updateInterval = setInterval(() => {}, 1000);

      livePreview.stopUpdates();

      expect(livePreview.updateInterval).toBeNull();
    });

    it('should clear update timeout', () => {
      livePreview.updateTimeout = setTimeout(() => {}, 1000);

      livePreview.stopUpdates();

      expect(livePreview.updateTimeout).toBeNull();
    });

    it('should disconnect canvas observer', () => {
      const mockObserver = {
        disconnect: jest.fn()
      };
      livePreview.canvasObserver = mockObserver;

      livePreview.stopUpdates();

      expect(mockObserver.disconnect).toHaveBeenCalled();
      expect(livePreview.canvasObserver).toBeNull();
    });
  });

  describe('toggle()', () => {
    it('should start if not live', () => {
      const startSpy = jest.spyOn(livePreview, 'start');

      livePreview.toggle();

      expect(startSpy).toHaveBeenCalled();
    });

    it('should stop if live', () => {
      livePreview.start();
      const stopSpy = jest.spyOn(livePreview, 'stop');

      livePreview.toggle();

      expect(stopSpy).toHaveBeenCalled();
    });
  });

  describe('isActive()', () => {
    it('should return false when not live', () => {
      expect(livePreview.isActive()).toBe(false);
    });

    it('should return true when live and window open', () => {
      livePreview.start();

      expect(livePreview.isActive()).toBe(true);
    });

    it('should return false when window is closed', () => {
      livePreview.start();
      mockWindow.closed = true;

      expect(livePreview.isActive()).toBe(false);
    });
  });
});
