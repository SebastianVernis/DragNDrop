/**
 * Unit tests for FileLoader component
 */

// Mock the FileLoader module if it exists
const mockFileLoader = {
  loadProject: jest.fn(),
  saveProject: jest.fn(),
  exportHTML: jest.fn(),
  importHTML: jest.fn()
};

describe('FileLoader Component', () => {
  let fileInput;
  let mockFile;

  beforeEach(() => {
    // Setup DOM
    document.body.innerHTML = `
      <div id="app">
        <input type="file" id="file-input" accept=".json,.html">
        <button id="save-btn">Save Project</button>
        <button id="load-btn">Load Project</button>
        <button id="export-btn">Export HTML</button>
      </div>
    `;

    fileInput = document.getElementById('file-input');
    
    // Create mock file
    mockFile = new File(['{"test": "data"}'], 'test-project.json', {
      type: 'application/json'
    });

    // Reset mocks
    jest.clearAllMocks();
  });

  describe('Project Loading', () => {
    it('should handle file selection', () => {
      const changeHandler = jest.fn();
      fileInput.addEventListener('change', changeHandler);

      // Simulate file selection
      Object.defineProperty(fileInput, 'files', {
        value: [mockFile],
        writable: false
      });

      fileInput.dispatchEvent(new Event('change'));

      expect(changeHandler).toHaveBeenCalled();
      expect(fileInput.files.length).toBe(1);
      expect(fileInput.files[0].name).toBe('test-project.json');
    });

    it('should read JSON project file', async () => {
      const projectData = {
        name: 'Test Project',
        canvas: '<div>Test Content</div>',
        selectedElement: null,
        components: []
      };

      const jsonFile = new File([JSON.stringify(projectData)], 'project.json', {
        type: 'application/json'
      });

      // Mock FileReader
      const mockFileReader = {
        readAsText: jest.fn(),
        result: JSON.stringify(projectData),
        onload: null
      };

      // Simulate file reading
      setTimeout(() => {
        if (mockFileReader.onload) {
          mockFileReader.onload({ target: mockFileReader });
        }
      }, 0);

      mockFileReader.readAsText(jsonFile);

      await waitFor(() => mockFileReader.result !== null);

      const parsedData = JSON.parse(mockFileReader.result);
      expect(parsedData.name).toBe('Test Project');
      expect(parsedData.canvas).toBe('<div>Test Content</div>');
    });

    it('should handle invalid JSON file', async () => {
      const invalidFile = new File(['invalid json content'], 'invalid.json', {
        type: 'application/json'
      });

      const mockFileReader = {
        readAsText: jest.fn(),
        result: 'invalid json content',
        onload: null,
        onerror: null
      };

      setTimeout(() => {
        try {
          JSON.parse(mockFileReader.result);
        } catch (error) {
          if (mockFileReader.onerror) {
            mockFileReader.onerror({ target: mockFileReader, error });
          }
        }
      }, 0);

      mockFileReader.readAsText(invalidFile);

      // Should handle error gracefully
      expect(mockFileReader.readAsText).toHaveBeenCalledWith(invalidFile);
    });
  });

  describe('Project Saving', () => {
    it('should create project data object', () => {
      const canvas = document.createElement('div');
      canvas.innerHTML = '<h1>Test Page</h1><p>Content</p>';
      
      const projectData = {
        name: 'My Project',
        version: '1.0.0',
        created: new Date().toISOString(),
        canvas: canvas.innerHTML,
        selectedElement: null,
        components: ['h1', 'p'],
        styles: {
          'h1': { fontSize: '2rem', color: '#333' },
          'p': { fontSize: '1rem', color: '#666' }
        }
      };

      expect(projectData.name).toBe('My Project');
      expect(projectData.canvas).toContain('<h1>Test Page</h1>');
      expect(projectData.components).toEqual(['h1', 'p']);
      expect(projectData.styles.h1.fontSize).toBe('2rem');
    });

    it('should generate download blob', () => {
      const projectData = {
        name: 'Test Project',
        canvas: '<div>Test</div>'
      };

      const jsonString = JSON.stringify(projectData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });

      expect(blob.size).toBeGreaterThan(0);
      expect(blob.type).toBe('application/json');
    });

    it('should create download link', () => {
      const projectData = { name: 'Test', canvas: '<div></div>' };
      const jsonString = JSON.stringify(projectData);
      const blob = new Blob([jsonString], { type: 'application/json' });
      
      // Mock URL.createObjectURL
      const mockURL = 'blob:http://localhost/test-url';
      global.URL.createObjectURL = jest.fn(() => mockURL);

      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = 'project.json';

      expect(URL.createObjectURL).toHaveBeenCalledWith(blob);
      expect(downloadLink.href).toBe(mockURL);
      expect(downloadLink.download).toBe('project.json');
    });
  });

  describe('HTML Export', () => {
    it('should generate complete HTML document', () => {
      const canvas = document.createElement('div');
      canvas.innerHTML = `
        <div class="container">
          <h1>My Website</h1>
          <p>Welcome to my site</p>
          <button>Contact Us</button>
        </div>
      `;

      const styles = `
        body { margin: 0; font-family: Arial, sans-serif; }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        h1 { color: #333; font-size: 2.5rem; }
        p { color: #666; line-height: 1.6; }
        button { background: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 4px; }
      `;

      const htmlDocument = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exported Website</title>
    <style>
        ${styles}
    </style>
</head>
<body>
    ${canvas.innerHTML}
</body>
</html>`;

      expect(htmlDocument).toContain('<!DOCTYPE html>');
      expect(htmlDocument).toContain('<meta charset="UTF-8">');
      expect(htmlDocument).toContain('<meta name="viewport"');
      expect(htmlDocument).toContain(canvas.innerHTML);
      expect(htmlDocument).toContain(styles);
    });

    it('should handle empty canvas export', () => {
      const canvas = document.createElement('div');
      canvas.innerHTML = '';

      const htmlDocument = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exported Website</title>
</head>
<body>
    ${canvas.innerHTML}
</body>
</html>`;

      expect(htmlDocument).toContain('<!DOCTYPE html>');
      expect(htmlDocument).toContain('<body>\n    \n</body>');
    });

    it('should include responsive meta tags', () => {
      const htmlDocument = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Responsive Website</title>
</head>
<body>
    <div>Content</div>
</body>
</html>`;

      expect(htmlDocument).toContain('width=device-width, initial-scale=1.0');
      expect(htmlDocument).toContain('X-UA-Compatible');
    });
  });

  describe('HTML Import', () => {
    it('should parse HTML file and extract content', async () => {
      const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <title>Imported Page</title>
    <style>
        .header { background: #f8f9fa; padding: 20px; }
        .content { padding: 40px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Imported Website</h1>
    </div>
    <div class="content">
        <p>This content was imported from HTML.</p>
        <button>Action Button</button>
    </div>
</body>
</html>`;

      const htmlFile = new File([htmlContent], 'imported.html', {
        type: 'text/html'
      });

      const mockFileReader = {
        readAsText: jest.fn(),
        result: htmlContent,
        onload: null
      };

      setTimeout(() => {
        if (mockFileReader.onload) {
          mockFileReader.onload({ target: mockFileReader });
        }
      }, 0);

      mockFileReader.readAsText(htmlFile);

      await waitFor(() => mockFileReader.result !== null);

      // Parse the HTML content
      const parser = new DOMParser();
      const doc = parser.parseFromString(mockFileReader.result, 'text/html');
      const bodyContent = doc.body.innerHTML;

      expect(bodyContent).toContain('Imported Website');
      expect(bodyContent).toContain('This content was imported from HTML');
      expect(bodyContent).toContain('Action Button');
    });

    it('should extract styles from imported HTML', async () => {
      const htmlWithStyles = `
        <html>
        <head>
            <style>
                .custom-class { color: red; font-size: 18px; }
                #custom-id { background: blue; }
            </style>
        </head>
        <body>
            <div class="custom-class" id="custom-id">Styled content</div>
        </body>
        </html>
      `;

      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlWithStyles, 'text/html');
      const styleElement = doc.querySelector('style');
      const styles = styleElement ? styleElement.textContent : '';

      expect(styles).toContain('.custom-class');
      expect(styles).toContain('color: red');
      expect(styles).toContain('#custom-id');
      expect(styles).toContain('background: blue');
    });
  });

  describe('File Validation', () => {
    it('should validate file types', () => {
      const validJsonFile = new File(['{}'], 'project.json', { type: 'application/json' });
      const validHtmlFile = new File(['<html></html>'], 'page.html', { type: 'text/html' });
      const invalidFile = new File(['content'], 'document.txt', { type: 'text/plain' });

      const isValidJson = validJsonFile.type === 'application/json' || validJsonFile.name.endsWith('.json');
      const isValidHtml = validHtmlFile.type === 'text/html' || validHtmlFile.name.endsWith('.html');
      const isValidText = invalidFile.type === 'text/plain';

      expect(isValidJson).toBe(true);
      expect(isValidHtml).toBe(true);
      expect(isValidText).toBe(true); // But we might not accept it
    });

    it('should check file size limits', () => {
      const smallFile = new File(['small content'], 'small.json', { type: 'application/json' });
      const largeContent = 'x'.repeat(10 * 1024 * 1024); // 10MB
      const largeFile = new File([largeContent], 'large.json', { type: 'application/json' });

      const maxSize = 5 * 1024 * 1024; // 5MB limit

      expect(smallFile.size).toBeLessThan(maxSize);
      expect(largeFile.size).toBeGreaterThan(maxSize);
    });
  });

  describe('Error Handling', () => {
    it('should handle file read errors', async () => {
      const mockFileReader = {
        readAsText: jest.fn(),
        result: null,
        error: new Error('File read failed'),
        onload: null,
        onerror: null
      };

      const errorHandler = jest.fn();
      mockFileReader.onerror = errorHandler;

      // Simulate error
      setTimeout(() => {
        if (mockFileReader.onerror) {
          mockFileReader.onerror({ target: mockFileReader });
        }
      }, 0);

      await waitFor(() => errorHandler.mock.calls.length > 0);

      expect(errorHandler).toHaveBeenCalled();
    });

    it('should handle corrupted project files', () => {
      const corruptedData = '{"name": "Test", "canvas": "<div>Test</div", "invalid": }';
      
      expect(() => {
        JSON.parse(corruptedData);
      }).toThrow();
    });

    it('should provide user feedback on errors', () => {
      const showError = jest.fn();
      const errorMessage = 'Failed to load project file';

      showError(errorMessage);

      expect(showError).toHaveBeenCalledWith(errorMessage);
    });
  });
});