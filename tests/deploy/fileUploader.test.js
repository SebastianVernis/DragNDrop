/**
 * FileUploader Tests
 */

import { FileUploader } from '../../src/deploy/fileUploader.js';

describe('FileUploader', () => {
  let fileUploader;
  const mockToken = 'test_token_123';

  beforeEach(() => {
    fileUploader = new FileUploader(mockToken);
    global.fetch = jest.fn();
    global.crypto = {
      subtle: {
        digest: jest.fn().mockResolvedValue(new ArrayBuffer(20))
      }
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('calculateSHA', () => {
    it('should calculate SHA-1 hash of content', async () => {
      const content = 'test content';
      const sha = await fileUploader.calculateSHA(content);
      
      expect(sha).toBeDefined();
      expect(typeof sha).toBe('string');
      expect(sha.length).toBe(40); // SHA-1 is 40 hex characters
    });
  });

  describe('prepareFiles', () => {
    it('should prepare files from project data', () => {
      const projectData = {
        html: '<h1>Test</h1>',
        css: 'body { margin: 0; }',
        js: 'console.log("test");'
      };

      const files = fileUploader.prepareFiles(projectData);

      expect(files).toHaveLength(3);
      expect(files[0]).toEqual({ name: 'index.html', content: projectData.html });
      expect(files[1]).toEqual({ name: 'styles.css', content: projectData.css });
      expect(files[2]).toEqual({ name: 'script.js', content: projectData.js });
    });

    it('should handle missing CSS and JS', () => {
      const projectData = {
        html: '<h1>Test</h1>'
      };

      const files = fileUploader.prepareFiles(projectData);

      expect(files).toHaveLength(1);
      expect(files[0].name).toBe('index.html');
    });

    it('should include additional files', () => {
      const projectData = {
        html: '<h1>Test</h1>',
        additionalFiles: [
          { name: 'config.json', content: '{}' }
        ]
      };

      const files = fileUploader.prepareFiles(projectData);

      expect(files).toHaveLength(2);
      expect(files[1].name).toBe('config.json');
    });
  });

  describe('validateFiles', () => {
    it('should validate files successfully', () => {
      const files = [
        { name: 'index.html', content: '<h1>Test</h1>' },
        { name: 'styles.css', content: 'body { margin: 0; }' }
      ];

      const result = fileUploader.validateFiles(files);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail if index.html is missing', () => {
      const files = [
        { name: 'styles.css', content: 'body { margin: 0; }' }
      ];

      const result = fileUploader.validateFiles(files);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Missing index.html file');
    });

    it('should warn about large files', () => {
      const largeContent = 'x'.repeat(6 * 1024 * 1024); // 6MB
      const files = [
        { name: 'index.html', content: largeContent }
      ];

      const result = fileUploader.validateFiles(files);

      expect(result.warnings.length).toBeGreaterThan(0);
    });

    it('should fail if file is too large', () => {
      const tooLargeContent = 'x'.repeat(11 * 1024 * 1024); // 11MB
      const files = [
        { name: 'index.html', content: tooLargeContent }
      ];

      const result = fileUploader.validateFiles(files);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('uploadFile', () => {
    it('should upload file successfully', async () => {
      const content = '<h1>Test</h1>';
      const filename = 'index.html';

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ sha: 'abc123' })
      });

      const result = await fileUploader.uploadFile(content, filename);

      expect(result).toHaveProperty('file', filename);
      expect(result).toHaveProperty('sha');
      expect(result).toHaveProperty('size');
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/v2/files'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Authorization': `Bearer ${mockToken}`
          })
        })
      );
    });

    it('should handle upload errors', async () => {
      const content = '<h1>Test</h1>';
      const filename = 'index.html';

      global.fetch.mockResolvedValueOnce({
        ok: false,
        statusText: 'Unauthorized',
        json: async () => ({ error: { message: 'Invalid token' } })
      });

      await expect(fileUploader.uploadFile(content, filename)).rejects.toThrow();
    });
  });

  describe('uploadFiles', () => {
    it('should upload multiple files with progress', async () => {
      const files = [
        { name: 'index.html', content: '<h1>Test</h1>' },
        { name: 'styles.css', content: 'body { margin: 0; }' }
      ];

      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({ sha: 'abc123' })
      });

      const progressCallback = jest.fn();
      const results = await fileUploader.uploadFiles(files, progressCallback);

      expect(results).toHaveLength(2);
      expect(progressCallback).toHaveBeenCalledTimes(2);
      expect(progressCallback).toHaveBeenCalledWith(
        expect.objectContaining({
          current: 1,
          total: 2,
          percentage: 50
        })
      );
    });
  });
});
