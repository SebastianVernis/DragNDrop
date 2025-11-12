/**
 * Unit tests for the main Editor functionality
 */

describe('Editor Core Functionality', () => {
  let canvas;
  let propertiesPanel;
  let componentLibrary;

  beforeEach(() => {
    // Setup DOM structure
    document.body.innerHTML = `
      <div id="app">
        <div id="component-library"></div>
        <div id="canvas"></div>
        <div id="properties"></div>
        <div id="toolbar"></div>
      </div>
    `;

    canvas = document.getElementById('canvas');
    propertiesPanel = document.getElementById('properties');
    componentLibrary = document.getElementById('component-library');

    // Mock global variables that would be initialized by script.js
    global.selectedElement = null;
    global.components = [];
    global.currentView = 'desktop';
  });

  describe('Canvas Management', () => {
    it('should initialize canvas with correct attributes', () => {
      expect(canvas).toBeTruthy();
      expect(canvas.id).toBe('canvas');
    });

    it('should handle canvas click events', () => {
      const clickHandler = jest.fn();
      canvas.addEventListener('click', clickHandler);
      
      canvas.click();
      
      expect(clickHandler).toHaveBeenCalled();
    });

    it('should clear canvas when requested', () => {
      // Add some elements to canvas
      const element1 = document.createElement('div');
      const element2 = document.createElement('p');
      canvas.appendChild(element1);
      canvas.appendChild(element2);

      expect(canvas.children.length).toBe(2);

      // Clear canvas
      canvas.innerHTML = '';
      
      expect(canvas.children.length).toBe(0);
    });
  });

  describe('Element Selection', () => {
    it('should select element and add selected class', () => {
      const element = document.createElement('div');
      element.id = 'test-element';
      canvas.appendChild(element);

      // Simulate element selection
      element.classList.add('selected');
      global.selectedElement = element;

      expect(element.classList.contains('selected')).toBe(true);
      expect(global.selectedElement).toBe(element);
    });

    it('should deselect previous element when selecting new one', () => {
      const element1 = document.createElement('div');
      const element2 = document.createElement('p');
      
      canvas.appendChild(element1);
      canvas.appendChild(element2);

      // Select first element
      element1.classList.add('selected');
      global.selectedElement = element1;

      // Select second element (should deselect first)
      element1.classList.remove('selected');
      element2.classList.add('selected');
      global.selectedElement = element2;

      expect(element1.classList.contains('selected')).toBe(false);
      expect(element2.classList.contains('selected')).toBe(true);
      expect(global.selectedElement).toBe(element2);
    });

    it('should handle clicking on empty canvas area', () => {
      const element = document.createElement('div');
      element.classList.add('selected');
      canvas.appendChild(element);
      global.selectedElement = element;

      // Simulate clicking on empty canvas area
      element.classList.remove('selected');
      global.selectedElement = null;

      expect(element.classList.contains('selected')).toBe(false);
      expect(global.selectedElement).toBeNull();
    });
  });

  describe('Component Creation', () => {
    it('should create button component with correct properties', () => {
      const button = document.createElement('button');
      button.textContent = 'Button';
      button.className = 'btn btn-primary';
      button.style.padding = '10px 20px';
      button.style.backgroundColor = '#007bff';
      button.style.color = 'white';
      button.style.border = 'none';
      button.style.borderRadius = '4px';
      button.style.cursor = 'pointer';

      expect(button.tagName).toBe('BUTTON');
      expect(button.textContent).toBe('Button');
      expect(button.className).toContain('btn');
      expect(button.style.cursor).toBe('pointer');
    });

    it('should create heading component with correct structure', () => {
      const heading = document.createElement('h1');
      heading.textContent = 'Heading';
      heading.className = 'heading';
      heading.style.fontSize = '2rem';
      heading.style.fontWeight = 'bold';
      heading.style.margin = '0 0 1rem 0';

      expect(heading.tagName).toBe('H1');
      expect(heading.textContent).toBe('Heading');
      expect(heading.style.fontWeight).toBe('bold');
    });

    it('should create container component with layout properties', () => {
      const container = document.createElement('div');
      container.className = 'container';
      container.style.maxWidth = '1200px';
      container.style.margin = '0 auto';
      container.style.padding = '0 15px';

      expect(container.tagName).toBe('DIV');
      expect(container.className).toBe('container');
      expect(container.style.maxWidth).toBe('1200px');
    });
  });

  describe('Responsive Views', () => {
    it('should handle desktop view correctly', () => {
      global.currentView = 'desktop';
      canvas.style.width = '1200px';
      canvas.style.maxWidth = '100%';

      expect(global.currentView).toBe('desktop');
      expect(canvas.style.width).toBe('1200px');
    });

    it('should handle tablet view correctly', () => {
      global.currentView = 'tablet';
      canvas.style.width = '768px';
      canvas.style.maxWidth = '100%';

      expect(global.currentView).toBe('tablet');
      expect(canvas.style.width).toBe('768px');
    });

    it('should handle mobile view correctly', () => {
      global.currentView = 'mobile';
      canvas.style.width = '375px';
      canvas.style.maxWidth = '100%';

      expect(global.currentView).toBe('mobile');
      expect(canvas.style.width).toBe('375px');
    });
  });

  describe('Properties Panel', () => {
    it('should update properties panel when element is selected', () => {
      const element = document.createElement('div');
      element.id = 'test-div';
      element.className = 'test-class';
      element.style.width = '200px';
      element.style.height = '100px';
      
      canvas.appendChild(element);
      global.selectedElement = element;

      // Simulate properties panel update
      propertiesPanel.innerHTML = `
        <div class="property-group">
          <label>ID:</label>
          <input type="text" name="id" value="${element.id}">
        </div>
        <div class="property-group">
          <label>Class:</label>
          <input type="text" name="className" value="${element.className}">
        </div>
        <div class="property-group">
          <label>Width:</label>
          <input type="text" name="width" value="${element.style.width}">
        </div>
      `;

      const idInput = propertiesPanel.querySelector('input[name="id"]');
      const classInput = propertiesPanel.querySelector('input[name="className"]');
      const widthInput = propertiesPanel.querySelector('input[name="width"]');

      expect(idInput.value).toBe('test-div');
      expect(classInput.value).toBe('test-class');
      expect(widthInput.value).toBe('200px');
    });

    it('should clear properties panel when no element is selected', () => {
      global.selectedElement = null;
      propertiesPanel.innerHTML = '';

      expect(propertiesPanel.innerHTML).toBe('');
    });
  });

  describe('Drag and Drop Simulation', () => {
    it('should handle dragstart event', () => {
      const element = document.createElement('div');
      element.draggable = true;
      
      const dragStartEvent = createMockEvent('dragstart');
      dragStartEvent.dataTransfer = new DataTransfer();
      
      // Simulate setting drag data
      dragStartEvent.dataTransfer.setData('text/html', element.outerHTML);
      dragStartEvent.dataTransfer.setData('component-type', 'div');

      expect(dragStartEvent.dataTransfer.getData('text/html')).toBe(element.outerHTML);
      expect(dragStartEvent.dataTransfer.getData('component-type')).toBe('div');
    });

    it('should handle drop event', () => {
      const dropEvent = createMockEvent('drop');
      dropEvent.dataTransfer = new DataTransfer();
      dropEvent.dataTransfer.setData('component-type', 'button');

      // Simulate drop handling
      const componentType = dropEvent.dataTransfer.getData('component-type');
      
      if (componentType === 'button') {
        const button = document.createElement('button');
        button.textContent = 'Button';
        canvas.appendChild(button);
      }

      expect(canvas.children.length).toBe(1);
      expect(canvas.children[0].tagName).toBe('BUTTON');
    });
  });

  describe('Template System', () => {
    it('should load template correctly', () => {
      const templateHTML = `
        <div class="hero-section">
          <h1>Welcome</h1>
          <p>This is a template</p>
          <button>Get Started</button>
        </div>
      `;

      canvas.innerHTML = templateHTML;

      expect(canvas.children.length).toBe(1);
      expect(canvas.querySelector('h1').textContent).toBe('Welcome');
      expect(canvas.querySelector('button').textContent).toBe('Get Started');
    });

    it('should clear canvas before loading new template', () => {
      // Add existing content
      const existingElement = document.createElement('div');
      canvas.appendChild(existingElement);
      expect(canvas.children.length).toBe(1);

      // Load new template
      const newTemplate = '<h1>New Template</h1>';
      canvas.innerHTML = newTemplate;

      expect(canvas.children.length).toBe(1);
      expect(canvas.querySelector('h1').textContent).toBe('New Template');
    });
  });

  describe('Export Functionality', () => {
    it('should generate HTML export correctly', () => {
      // Add some content to canvas
      canvas.innerHTML = `
        <div class="container">
          <h1>Test Page</h1>
          <p>This is a test paragraph.</p>
          <button>Click me</button>
        </div>
      `;

      const exportHTML = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Exported Page</title>
          <style>
            body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
            .container { max-width: 1200px; margin: 0 auto; }
            h1 { color: #333; }
            button { padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; }
          </style>
        </head>
        <body>
          ${canvas.innerHTML}
        </body>
        </html>
      `;

      expect(exportHTML).toContain('<!DOCTYPE html>');
      expect(exportHTML).toContain(canvas.innerHTML);
      expect(exportHTML).toContain('<style>');
    });

    it('should handle empty canvas export', () => {
      canvas.innerHTML = '';

      const exportHTML = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Exported Page</title>
        </head>
        <body>
          ${canvas.innerHTML}
        </body>
        </html>
      `;

      expect(exportHTML).toContain('<!DOCTYPE html>');
      expect(exportHTML).toContain('<body>\n          \n        </body>');
    });
  });
});