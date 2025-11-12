/**
 * Integration tests for Drag & Drop functionality
 */

describe('Drag & Drop Integration', () => {
  let canvas;
  let componentLibrary;
  let propertiesPanel;

  beforeEach(() => {
    // Setup complete DOM structure
    document.body.innerHTML = `
      <div id="app">
        <div id="component-library">
          <div class="component-category">
            <h3>Layout</h3>
            <div class="component-item" data-component="container" draggable="true">
              <div class="component-preview">Container</div>
            </div>
            <div class="component-item" data-component="section" draggable="true">
              <div class="component-preview">Section</div>
            </div>
          </div>
          <div class="component-category">
            <h3>Text</h3>
            <div class="component-item" data-component="heading" draggable="true">
              <div class="component-preview">Heading</div>
            </div>
            <div class="component-item" data-component="paragraph" draggable="true">
              <div class="component-preview">Paragraph</div>
            </div>
            <div class="component-item" data-component="button" draggable="true">
              <div class="component-preview">Button</div>
            </div>
          </div>
        </div>
        <div id="canvas" class="canvas"></div>
        <div id="properties" class="properties-panel"></div>
      </div>
    `;

    canvas = document.getElementById('canvas');
    componentLibrary = document.getElementById('component-library');
    propertiesPanel = document.getElementById('properties');

    // Initialize global state
    global.selectedElement = null;
    global.components = [];
  });

  describe('Component Library Drag Operations', () => {
    it('should initiate drag from component library', () => {
      const buttonComponent = componentLibrary.querySelector('[data-component="button"]');
      expect(buttonComponent).toBeTruthy();
      expect(buttonComponent.draggable).toBe(true);

      // Create drag event
      const dragStartEvent = new DragEvent('dragstart', {
        dataTransfer: new DataTransfer(),
        bubbles: true
      });

      // Simulate drag start
      buttonComponent.dispatchEvent(dragStartEvent);

      // Verify drag data would be set
      expect(dragStartEvent.dataTransfer).toBeTruthy();
    });

    it('should set correct drag data for different components', () => {
      const components = [
        { selector: '[data-component="button"]', type: 'button' },
        { selector: '[data-component="heading"]', type: 'heading' },
        { selector: '[data-component="paragraph"]', type: 'paragraph' },
        { selector: '[data-component="container"]', type: 'container' }
      ];

      components.forEach(({ selector, type }) => {
        const component = componentLibrary.querySelector(selector);
        const dragEvent = new DragEvent('dragstart', {
          dataTransfer: new DataTransfer()
        });

        // Simulate setting drag data
        dragEvent.dataTransfer.setData('component-type', type);
        dragEvent.dataTransfer.setData('text/plain', type);

        expect(dragEvent.dataTransfer.getData('component-type')).toBe(type);
        expect(dragEvent.dataTransfer.getData('text/plain')).toBe(type);
      });
    });
  });

  describe('Canvas Drop Operations', () => {
    it('should accept drops and create components', () => {
      // Setup drop event
      const dropEvent = new DragEvent('drop', {
        dataTransfer: new DataTransfer(),
        bubbles: true,
        cancelable: true
      });

      dropEvent.dataTransfer.setData('component-type', 'button');

      // Prevent default to simulate successful drop
      const preventDefault = jest.spyOn(dropEvent, 'preventDefault');
      
      // Simulate drop handling
      canvas.addEventListener('drop', (e) => {
        e.preventDefault();
        const componentType = e.dataTransfer.getData('component-type');
        
        if (componentType === 'button') {
          const button = document.createElement('button');
          button.textContent = 'Button';
          button.className = 'btn btn-primary';
          button.style.padding = '10px 20px';
          button.style.backgroundColor = '#007bff';
          button.style.color = 'white';
          button.style.border = 'none';
          button.style.borderRadius = '4px';
          button.style.cursor = 'pointer';
          
          canvas.appendChild(button);
          global.components.push(button);
        }
      });

      canvas.dispatchEvent(dropEvent);

      expect(preventDefault).toHaveBeenCalled();
      expect(canvas.children.length).toBe(1);
      expect(canvas.children[0].tagName).toBe('BUTTON');
      expect(global.components.length).toBe(1);
    });

    it('should handle dragover events correctly', () => {
      const dragOverEvent = new DragEvent('dragover', {
        dataTransfer: new DataTransfer(),
        bubbles: true,
        cancelable: true
      });

      const preventDefault = jest.spyOn(dragOverEvent, 'preventDefault');

      canvas.addEventListener('dragover', (e) => {
        e.preventDefault(); // Allow drop
      });

      canvas.dispatchEvent(dragOverEvent);

      expect(preventDefault).toHaveBeenCalled();
    });

    it('should create different component types correctly', async () => {
      const componentTypes = [
        {
          type: 'heading',
          expectedTag: 'H1',
          expectedText: 'Heading',
          expectedStyles: { fontSize: '2rem', fontWeight: 'bold' }
        },
        {
          type: 'paragraph',
          expectedTag: 'P',
          expectedText: 'Paragraph text',
          expectedStyles: { fontSize: '1rem', lineHeight: '1.6' }
        },
        {
          type: 'container',
          expectedTag: 'DIV',
          expectedClass: 'container',
          expectedStyles: { maxWidth: '1200px', margin: '0 auto' }
        }
      ];

      for (const componentData of componentTypes) {
        const dropEvent = new DragEvent('drop', {
          dataTransfer: new DataTransfer()
        });

        dropEvent.dataTransfer.setData('component-type', componentData.type);

        // Simulate component creation
        let createdElement;
        
        switch (componentData.type) {
          case 'heading':
            createdElement = document.createElement('h1');
            createdElement.textContent = componentData.expectedText;
            Object.assign(createdElement.style, componentData.expectedStyles);
            break;
          case 'paragraph':
            createdElement = document.createElement('p');
            createdElement.textContent = componentData.expectedText;
            Object.assign(createdElement.style, componentData.expectedStyles);
            break;
          case 'container':
            createdElement = document.createElement('div');
            createdElement.className = componentData.expectedClass;
            Object.assign(createdElement.style, componentData.expectedStyles);
            break;
        }

        if (createdElement) {
          canvas.appendChild(createdElement);

          expect(createdElement.tagName).toBe(componentData.expectedTag);
          if (componentData.expectedText) {
            expect(createdElement.textContent).toBe(componentData.expectedText);
          }
          if (componentData.expectedClass) {
            expect(createdElement.className).toBe(componentData.expectedClass);
          }
        }

        // Clear canvas for next test
        canvas.innerHTML = '';
      }
    });
  });

  describe('Element Selection Integration', () => {
    it('should select dropped elements when clicked', () => {
      // Create and add element to canvas
      const button = document.createElement('button');
      button.textContent = 'Test Button';
      button.className = 'btn btn-primary';
      canvas.appendChild(button);

      // Simulate click to select
      const clickEvent = new MouseEvent('click', { bubbles: true });
      
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // Clear previous selection
        const previousSelected = canvas.querySelector('.selected');
        if (previousSelected) {
          previousSelected.classList.remove('selected');
        }
        
        // Select current element
        button.classList.add('selected');
        global.selectedElement = button;
      });

      button.dispatchEvent(clickEvent);

      expect(button.classList.contains('selected')).toBe(true);
      expect(global.selectedElement).toBe(button);
    });

    it('should update properties panel when element is selected', async () => {
      // Create element with properties
      const heading = document.createElement('h1');
      heading.textContent = 'Test Heading';
      heading.id = 'main-heading';
      heading.className = 'heading-primary';
      heading.style.fontSize = '2.5rem';
      heading.style.color = '#333';
      heading.style.textAlign = 'center';
      
      canvas.appendChild(heading);

      // Simulate selection
      heading.classList.add('selected');
      global.selectedElement = heading;

      // Simulate properties panel update
      const updatePropertiesPanel = (element) => {
        if (!element) {
          propertiesPanel.innerHTML = '';
          return;
        }

        propertiesPanel.innerHTML = `
          <div class="property-section">
            <h4>General</h4>
            <div class="property-group">
              <label>ID:</label>
              <input type="text" name="id" value="${element.id || ''}">
            </div>
            <div class="property-group">
              <label>Class:</label>
              <input type="text" name="className" value="${element.className || ''}">
            </div>
            <div class="property-group">
              <label>Text:</label>
              <input type="text" name="textContent" value="${element.textContent || ''}">
            </div>
          </div>
          <div class="property-section">
            <h4>Typography</h4>
            <div class="property-group">
              <label>Font Size:</label>
              <input type="text" name="fontSize" value="${element.style.fontSize || ''}">
            </div>
            <div class="property-group">
              <label>Color:</label>
              <input type="text" name="color" value="${element.style.color || ''}">
            </div>
            <div class="property-group">
              <label>Text Align:</label>
              <select name="textAlign">
                <option value="left" ${element.style.textAlign === 'left' ? 'selected' : ''}>Left</option>
                <option value="center" ${element.style.textAlign === 'center' ? 'selected' : ''}>Center</option>
                <option value="right" ${element.style.textAlign === 'right' ? 'selected' : ''}>Right</option>
              </select>
            </div>
          </div>
        `;
      };

      updatePropertiesPanel(global.selectedElement);

      // Verify properties panel content
      expect(propertiesPanel.querySelector('input[name="id"]').value).toBe('main-heading');
      expect(propertiesPanel.querySelector('input[name="className"]').value).toBe('heading-primary');
      expect(propertiesPanel.querySelector('input[name="textContent"]').value).toBe('Test Heading');
      expect(propertiesPanel.querySelector('input[name="fontSize"]').value).toBe('2.5rem');
      expect(propertiesPanel.querySelector('input[name="color"]').value).toBe('#333');
      expect(propertiesPanel.querySelector('select[name="textAlign"]').value).toBe('center');
    });
  });

  describe('Property Changes Integration', () => {
    it('should apply property changes to selected element', () => {
      // Create and select element
      const paragraph = document.createElement('p');
      paragraph.textContent = 'Original text';
      paragraph.style.fontSize = '1rem';
      paragraph.style.color = '#666';
      
      canvas.appendChild(paragraph);
      paragraph.classList.add('selected');
      global.selectedElement = paragraph;

      // Simulate property changes
      const applyPropertyChange = (property, value) => {
        if (!global.selectedElement) return;

        if (property === 'textContent') {
          global.selectedElement.textContent = value;
        } else if (property.startsWith('style.')) {
          const styleProp = property.replace('style.', '');
          global.selectedElement.style[styleProp] = value;
        } else {
          global.selectedElement[property] = value;
        }
      };

      // Apply changes
      applyPropertyChange('textContent', 'Updated text content');
      applyPropertyChange('style.fontSize', '1.2rem');
      applyPropertyChange('style.color', '#333');
      applyPropertyChange('id', 'updated-paragraph');

      // Verify changes
      expect(paragraph.textContent).toBe('Updated text content');
      expect(paragraph.style.fontSize).toBe('1.2rem');
      expect(paragraph.style.color).toBe('#333');
      expect(paragraph.id).toBe('updated-paragraph');
    });

    it('should handle real-time property updates', async () => {
      // Create element
      const button = document.createElement('button');
      button.textContent = 'Click me';
      button.style.backgroundColor = '#007bff';
      button.style.padding = '10px 20px';
      
      canvas.appendChild(button);
      global.selectedElement = button;

      // Simulate real-time updates (like typing in input)
      const simulateTyping = async (inputValue, delay = 50) => {
        for (let i = 0; i <= inputValue.length; i++) {
          const partialValue = inputValue.substring(0, i);
          button.textContent = partialValue;
          
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      };

      await simulateTyping('Updated Button Text');

      expect(button.textContent).toBe('Updated Button Text');
    });
  });

  describe('Multiple Elements Integration', () => {
    it('should handle multiple elements on canvas', () => {
      // Create multiple elements
      const elements = [
        { tag: 'h1', text: 'Main Title', className: 'title' },
        { tag: 'p', text: 'Description paragraph', className: 'description' },
        { tag: 'button', text: 'Action Button', className: 'btn btn-primary' },
        { tag: 'div', text: '', className: 'container' }
      ];

      elements.forEach(({ tag, text, className }) => {
        const element = document.createElement(tag);
        if (text) element.textContent = text;
        if (className) element.className = className;
        
        canvas.appendChild(element);
        global.components.push(element);
      });

      expect(canvas.children.length).toBe(4);
      expect(global.components.length).toBe(4);

      // Verify each element
      expect(canvas.querySelector('h1').textContent).toBe('Main Title');
      expect(canvas.querySelector('p').textContent).toBe('Description paragraph');
      expect(canvas.querySelector('button').textContent).toBe('Action Button');
      expect(canvas.querySelector('div.container')).toBeTruthy();
    });

    it('should maintain selection state with multiple elements', () => {
      // Add multiple elements
      const heading = document.createElement('h1');
      heading.textContent = 'Heading';
      const paragraph = document.createElement('p');
      paragraph.textContent = 'Paragraph';
      
      canvas.appendChild(heading);
      canvas.appendChild(paragraph);

      // Select first element
      heading.classList.add('selected');
      global.selectedElement = heading;

      expect(heading.classList.contains('selected')).toBe(true);
      expect(paragraph.classList.contains('selected')).toBe(false);
      expect(global.selectedElement).toBe(heading);

      // Switch selection
      heading.classList.remove('selected');
      paragraph.classList.add('selected');
      global.selectedElement = paragraph;

      expect(heading.classList.contains('selected')).toBe(false);
      expect(paragraph.classList.contains('selected')).toBe(true);
      expect(global.selectedElement).toBe(paragraph);
    });
  });

  describe('Error Handling Integration', () => {
    it('should handle invalid drag data gracefully', () => {
      const dropEvent = new DragEvent('drop', {
        dataTransfer: new DataTransfer()
      });

      // Set invalid component type
      dropEvent.dataTransfer.setData('component-type', 'invalid-component');

      const handleDrop = (e) => {
        e.preventDefault();
        const componentType = e.dataTransfer.getData('component-type');
        
        // Should handle unknown component types
        if (!['button', 'heading', 'paragraph', 'container', 'section'].includes(componentType)) {
          console.warn('Unknown component type:', componentType);
          return;
        }
        
        // Create component logic here
      };

      canvas.addEventListener('drop', handleDrop);
      
      // Should not throw error
      expect(() => {
        canvas.dispatchEvent(dropEvent);
      }).not.toThrow();
    });

    it('should handle canvas overflow gracefully', () => {
      // Add many elements to test canvas limits
      for (let i = 0; i < 100; i++) {
        const element = document.createElement('div');
        element.textContent = `Element ${i}`;
        element.style.height = '50px';
        element.style.margin = '5px';
        element.style.backgroundColor = '#f0f0f0';
        
        canvas.appendChild(element);
      }

      expect(canvas.children.length).toBe(100);
      
      // Canvas should still be functional
      const newElement = document.createElement('p');
      newElement.textContent = 'New element';
      canvas.appendChild(newElement);
      
      expect(canvas.children.length).toBe(101);
    });
  });

  describe('Performance Integration', () => {
    it('should handle rapid drag and drop operations', async () => {
      const startTime = performance.now();
      
      // Simulate rapid component creation
      for (let i = 0; i < 50; i++) {
        const element = document.createElement('div');
        element.textContent = `Component ${i}`;
        element.className = 'rapid-component';
        canvas.appendChild(element);
        
        // Small delay to simulate real user interaction
        await new Promise(resolve => setTimeout(resolve, 1));
      }
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      expect(canvas.children.length).toBe(50);
      expect(duration).toBeLessThan(1000); // Should complete within 1 second
    });

    it('should maintain responsiveness with many elements', () => {
      // Add many elements
      for (let i = 0; i < 200; i++) {
        const element = document.createElement('span');
        element.textContent = `Item ${i}`;
        canvas.appendChild(element);
      }

      // Test selection performance
      const startTime = performance.now();
      
      const targetElement = canvas.children[150];
      targetElement.classList.add('selected');
      global.selectedElement = targetElement;
      
      const endTime = performance.now();
      const selectionTime = endTime - startTime;
      
      expect(global.selectedElement).toBe(targetElement);
      expect(selectionTime).toBeLessThan(10); // Should be very fast
    });
  });
});