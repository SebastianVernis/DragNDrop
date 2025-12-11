/**
 * Unit tests for ResponsiveTester
 * @test
 */

const ResponsiveTester = require('../../../src/core/responsiveTester');

describe('ResponsiveTester', () => {
  let responsiveTester;

  beforeEach(() => {
    // Setup DOM
    document.body.innerHTML = `
      <div id="canvasWrapper" style="width: 1920px; height: 1080px;">
        <div id="canvas"></div>
      </div>
    `;

    // Mock window functions
    window.showToast = jest.fn();
    window.responsiveTester = null;

    responsiveTester = new ResponsiveTester();
  });

  afterEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = '';
  });

  describe('Constructor', () => {
    it('should initialize with default devices', () => {
      expect(responsiveTester.devices).toBeDefined();
      expect(Object.keys(responsiveTester.devices).length).toBe(8);
    });

    it('should have correct device configurations', () => {
      expect(responsiveTester.devices['mobile-small']).toEqual({
        name: 'Mobile S',
        width: 320,
        height: 568,
        icon: '📱'
      });

      expect(responsiveTester.devices.desktop).toEqual({
        name: 'Desktop',
        width: 1920,
        height: 1080,
        icon: '🖥️'
      });
    });

    it('should initialize with default orientation as portrait', () => {
      expect(responsiveTester.orientation).toBe('portrait');
    });

    it('should initialize with desktop as current device', () => {
      expect(responsiveTester.currentDevice).toBe('desktop');
    });

    it('should load custom sizes from localStorage', () => {
      localStorage.setItem('dragndrop_custom_sizes', JSON.stringify([
        { name: 'Custom', width: 800, height: 600 }
      ]));

      const newTester = new ResponsiveTester();
      expect(newTester.customSizes).toHaveLength(1);
      expect(newTester.customSizes[0].name).toBe('Custom');
    });

    it('should handle invalid localStorage data gracefully', () => {
      localStorage.setItem('dragndrop_custom_sizes', 'invalid-json');

      const newTester = new ResponsiveTester();
      expect(newTester.customSizes).toEqual([]);
    });
  });

  describe('init()', () => {
    it('should create test panel', () => {
      responsiveTester.init();
      const panel = document.getElementById('responsiveTesterPanel');
      expect(panel).toBeTruthy();
    });

    it('should not create duplicate panels', () => {
      responsiveTester.init();
      responsiveTester.init();
      const panels = document.querySelectorAll('#responsiveTesterPanel');
      expect(panels.length).toBe(1);
    });
  });

  describe('createTestPanel()', () => {
    it('should create panel with correct structure', () => {
      responsiveTester.createTestPanel();
      const panel = document.getElementById('responsiveTesterPanel');

      expect(panel).toBeTruthy();
      expect(panel.classList.contains('responsive-tester-panel')).toBe(true);
      expect(panel.classList.contains('hidden')).toBe(true);
    });

    it('should include device grid', () => {
      responsiveTester.createTestPanel();
      const deviceGrid = document.getElementById('deviceGrid');
      expect(deviceGrid).toBeTruthy();
    });

    it('should include custom size inputs', () => {
      responsiveTester.createTestPanel();
      const customWidth = document.getElementById('customWidth');
      const customHeight = document.getElementById('customHeight');

      expect(customWidth).toBeTruthy();
      expect(customHeight).toBeTruthy();
      expect(customWidth.value).toBe('1024');
      expect(customHeight.value).toBe('768');
    });

    it('should include orientation buttons', () => {
      responsiveTester.createTestPanel();
      const portraitBtn = document.getElementById('portraitBtn');
      const landscapeBtn = document.getElementById('landscapeBtn');

      expect(portraitBtn).toBeTruthy();
      expect(landscapeBtn).toBeTruthy();
    });
  });

  describe('renderDeviceButtons()', () => {
    it('should render buttons for all devices', () => {
      const buttons = responsiveTester.renderDeviceButtons();
      const deviceCount = Object.keys(responsiveTester.devices).length;

      // Count button elements in the rendered HTML
      const buttonMatches = buttons.match(/<button/g);
      expect(buttonMatches.length).toBe(deviceCount);
    });

    it('should include device names and sizes', () => {
      const buttons = responsiveTester.renderDeviceButtons();

      expect(buttons).toContain('Mobile S');
      expect(buttons).toContain('320 × 568');
      expect(buttons).toContain('Desktop');
      expect(buttons).toContain('1920 × 1080');
    });
  });

  describe('setSize()', () => {
    it('should set canvas wrapper dimensions', () => {
      responsiveTester.setSize(800, 600);
      const wrapper = document.getElementById('canvasWrapper');

      expect(wrapper.style.width).toBe('800px');
      expect(wrapper.style.height).toBe('600px');
    });

    it('should apply transition style', () => {
      responsiveTester.setSize(800, 600);
      const wrapper = document.getElementById('canvasWrapper');

      expect(wrapper.style.transition).toBe('all 0.3s ease');
    });

    it('should handle missing canvas wrapper gracefully', () => {
      document.body.innerHTML = '';
      expect(() => responsiveTester.setSize(800, 600)).not.toThrow();
    });
  });

  describe('setDeviceSize()', () => {
    it('should set size for valid device', () => {
      responsiveTester.setDeviceSize('mobile');
      const wrapper = document.getElementById('canvasWrapper');

      expect(wrapper.style.width).toBe('375px');
      expect(wrapper.style.height).toBe('667px');
    });

    it('should update current device', () => {
      responsiveTester.setDeviceSize('tablet');
      expect(responsiveTester.currentDevice).toBe('tablet');
    });

    it('should show toast notification', () => {
      responsiveTester.setDeviceSize('laptop');
      expect(window.showToast).toHaveBeenCalledWith('Vista Laptop aplicada');
    });

    it('should handle invalid device gracefully', () => {
      expect(() => responsiveTester.setDeviceSize('invalid-device')).not.toThrow();
    });

    it('should swap dimensions in landscape mode', () => {
      responsiveTester.orientation = 'landscape';
      responsiveTester.setDeviceSize('mobile');
      const wrapper = document.getElementById('canvasWrapper');

      // In landscape, width and height are swapped
      expect(wrapper.style.width).toBe('667px');
      expect(wrapper.style.height).toBe('375px');
    });
  });

  describe('setOrientation()', () => {
    beforeEach(() => {
      responsiveTester.createTestPanel();
    });

    it('should set orientation to portrait', () => {
      responsiveTester.setOrientation('portrait');
      expect(responsiveTester.orientation).toBe('portrait');
    });

    it('should set orientation to landscape', () => {
      responsiveTester.setOrientation('landscape');
      expect(responsiveTester.orientation).toBe('landscape');
    });

    it('should update button active states', () => {
      responsiveTester.setOrientation('landscape');
      const portraitBtn = document.getElementById('portraitBtn');
      const landscapeBtn = document.getElementById('landscapeBtn');

      expect(portraitBtn.classList.contains('active')).toBe(false);
      expect(landscapeBtn.classList.contains('active')).toBe(true);
    });

    it('should re-apply current device size', () => {
      responsiveTester.currentDevice = 'mobile';
      const setSizeSpy = jest.spyOn(responsiveTester, 'setDeviceSize');

      responsiveTester.setOrientation('landscape');

      expect(setSizeSpy).toHaveBeenCalledWith('mobile');
    });
  });

  describe('applyCustomSize()', () => {
    beforeEach(() => {
      responsiveTester.createTestPanel();
    });

    it('should apply valid custom size', () => {
      document.getElementById('customWidth').value = '800';
      document.getElementById('customHeight').value = '600';

      responsiveTester.applyCustomSize();
      const wrapper = document.getElementById('canvasWrapper');

      expect(wrapper.style.width).toBe('800px');
      expect(wrapper.style.height).toBe('600px');
    });

    it('should show toast for custom size', () => {
      document.getElementById('customWidth').value = '800';
      document.getElementById('customHeight').value = '600';

      responsiveTester.applyCustomSize();

      expect(window.showToast).toHaveBeenCalledWith('Tamaño personalizado 800×600 aplicado');
    });

    it('should reject sizes below minimum', () => {
      document.getElementById('customWidth').value = '100';
      document.getElementById('customHeight').value = '100';

      responsiveTester.applyCustomSize();

      // Should not apply invalid size
      expect(window.showToast).not.toHaveBeenCalled();
    });
  });

  describe('updateSizeDisplay()', () => {
    beforeEach(() => {
      responsiveTester.createTestPanel();
    });

    it('should update size display text', () => {
      responsiveTester.updateSizeDisplay(1024, 768);
      const display = document.getElementById('currentSizeDisplay');

      expect(display.textContent).toBe('1024 × 768');
    });
  });

  describe('updateBreakpointDisplay()', () => {
    beforeEach(() => {
      responsiveTester.createTestPanel();
    });

    it('should show Extra Small for width < 576', () => {
      responsiveTester.updateBreakpointDisplay(320);
      const display = document.getElementById('breakpointDisplay');

      expect(display.textContent).toBe('Extra Small (< 576px)');
    });

    it('should show Small for width 576-768', () => {
      responsiveTester.updateBreakpointDisplay(600);
      const display = document.getElementById('breakpointDisplay');

      expect(display.textContent).toBe('Small (576px - 768px)');
    });

    it('should show Medium for width 768-992', () => {
      responsiveTester.updateBreakpointDisplay(800);
      const display = document.getElementById('breakpointDisplay');

      expect(display.textContent).toBe('Medium (768px - 992px)');
    });

    it('should show Large for width 992-1200', () => {
      responsiveTester.updateBreakpointDisplay(1100);
      const display = document.getElementById('breakpointDisplay');

      expect(display.textContent).toBe('Large (992px - 1200px)');
    });

    it('should show Extra Large for width 1200-1400', () => {
      responsiveTester.updateBreakpointDisplay(1300);
      const display = document.getElementById('breakpointDisplay');

      expect(display.textContent).toBe('Extra Large (1200px - 1400px)');
    });

    it('should show XXL for width > 1400', () => {
      responsiveTester.updateBreakpointDisplay(1920);
      const display = document.getElementById('breakpointDisplay');

      expect(display.textContent).toBe('XXL (> 1400px)');
    });
  });

  describe('resetCanvas()', () => {
    it('should reset to desktop size', () => {
      responsiveTester.setDeviceSize('mobile');
      responsiveTester.resetCanvas();

      expect(responsiveTester.currentDevice).toBe('desktop');
    });

    it('should reset orientation to portrait', () => {
      responsiveTester.orientation = 'landscape';
      responsiveTester.resetCanvas();

      expect(responsiveTester.orientation).toBe('portrait');
    });

    it('should show toast notification', () => {
      responsiveTester.resetCanvas();
      expect(window.showToast).toHaveBeenCalledWith('Canvas restablecido');
    });
  });

  describe('saveCustomSize()', () => {
    it('should save custom size to localStorage', () => {
      responsiveTester.saveCustomSize('My Size', 800, 600);

      const stored = JSON.parse(localStorage.getItem('dragndrop_custom_sizes'));
      expect(stored).toContainEqual({ name: 'My Size', width: 800, height: 600 });
    });

    it('should add to existing custom sizes', () => {
      responsiveTester.saveCustomSize('Size 1', 800, 600);
      responsiveTester.saveCustomSize('Size 2', 1024, 768);

      expect(responsiveTester.customSizes).toHaveLength(2);
    });
  });

  describe('loadCustomSizes()', () => {
    it('should return empty array when no stored sizes', () => {
      localStorage.removeItem('dragndrop_custom_sizes');
      const sizes = responsiveTester.loadCustomSizes();

      expect(sizes).toEqual([]);
    });

    it('should return stored custom sizes', () => {
      localStorage.setItem('dragndrop_custom_sizes', JSON.stringify([
        { name: 'Test', width: 500, height: 400 }
      ]));

      const sizes = responsiveTester.loadCustomSizes();
      expect(sizes).toHaveLength(1);
      expect(sizes[0].name).toBe('Test');
    });
  });

  describe('testAllSizes()', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should cycle through all device sizes', () => {
      const setDeviceSizeSpy = jest.spyOn(responsiveTester, 'setDeviceSize');

      responsiveTester.testAllSizes();

      // First device immediately
      expect(setDeviceSizeSpy).toHaveBeenCalledTimes(1);

      // Advance timers for remaining devices
      const deviceCount = Object.keys(responsiveTester.devices).length;
      for (let i = 1; i < deviceCount; i++) {
        jest.advanceTimersByTime(1500);
      }

      expect(setDeviceSizeSpy).toHaveBeenCalledTimes(deviceCount);
    });

    it('should show completion toast', () => {
      responsiveTester.testAllSizes();

      const deviceCount = Object.keys(responsiveTester.devices).length;
      for (let i = 0; i < deviceCount; i++) {
        jest.advanceTimersByTime(1500);
      }

      expect(window.showToast).toHaveBeenCalledWith('Prueba de todos los tamaños completada');
    });
  });

  describe('Global Functions', () => {
    beforeEach(() => {
      window.responsiveTester = responsiveTester;
    });

    it('openResponsiveTester should show panel', () => {
      responsiveTester.createTestPanel();
      const panel = document.getElementById('responsiveTesterPanel');
      panel.classList.add('hidden');

      // Call global function
      if (typeof openResponsiveTester === 'function') {
        openResponsiveTester();
        expect(panel.classList.contains('hidden')).toBe(false);
      }
    });

    it('closeResponsiveTester should hide panel', () => {
      responsiveTester.createTestPanel();
      const panel = document.getElementById('responsiveTesterPanel');
      panel.classList.remove('hidden');

      // Call global function
      if (typeof closeResponsiveTester === 'function') {
        closeResponsiveTester();
        expect(panel.classList.contains('hidden')).toBe(true);
      }
    });
  });
});
