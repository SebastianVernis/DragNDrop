/**
 * Frontend Reader Tests
 * Unit tests for the Frontend Reader system
 */

import { FrontendReader } from '../src/reader/index.js';
import { FrameworkDetector } from '../src/reader/core/FrameworkDetector.js';
import { HTMLParser } from '../src/reader/parsers/HTMLParser.js';
import { StyleExtractor } from '../src/reader/extractors/StyleExtractor.js';
import { AssetManager } from '../src/reader/core/AssetManager.js';

describe('FrontendReader', () => {
  let reader;

  beforeEach(() => {
    reader = new FrontendReader();
  });

  afterEach(async () => {
    await reader.cleanup();
  });

  describe('File Organization', () => {
    test('should organize files by type', () => {
      const files = [
        { name: 'index.html', webkitRelativePath: 'project/index.html' },
        { name: 'style.css', webkitRelativePath: 'project/style.css' },
        { name: 'script.js', webkitRelativePath: 'project/script.js' },
        { name: 'logo.png', webkitRelativePath: 'project/logo.png' }
      ];

      const organized = reader.organizeFiles(files);

      expect(organized.html).toHaveLength(1);
      expect(organized.css).toHaveLength(1);
      expect(organized.js).toHaveLength(1);
      expect(organized.assets).toHaveLength(1);
    });

    test('should skip node_modules', () => {
      const files = [
        { name: 'index.html', webkitRelativePath: 'project/index.html' },
        { name: 'package.json', webkitRelativePath: 'project/node_modules/package.json' }
      ];

      const organized = reader.organizeFiles(files);

      expect(organized.html).toHaveLength(1);
      expect(organized.json).toHaveLength(0);
    });
  });

  describe('File Extension Detection', () => {
    test('should detect HTML files', () => {
      expect(reader.getFileExtension('index.html')).toBe('html');
      expect(reader.getFileExtension('page.htm')).toBe('htm');
    });

    test('should detect CSS files', () => {
      expect(reader.getFileExtension('style.css')).toBe('css');
      expect(reader.getFileExtension('main.scss')).toBe('scss');
    });

    test('should detect JavaScript files', () => {
      expect(reader.getFileExtension('script.js')).toBe('js');
      expect(reader.getFileExtension('app.jsx')).toBe('jsx');
      expect(reader.getFileExtension('index.ts')).toBe('ts');
      expect(reader.getFileExtension('component.tsx')).toBe('tsx');
    });
  });
});

describe('FrameworkDetector', () => {
  let detector;

  beforeEach(() => {
    detector = new FrameworkDetector();
  });

  describe('Package.json Scoring', () => {
    test('should detect React from dependencies', () => {
      const pkg = {
        dependencies: {
          react: '^18.0.0',
          'react-dom': '^18.0.0'
        }
      };

      const scores = detector.scoreFromPackageJson(pkg);

      expect(scores.react).toBeGreaterThan(0);
      expect(scores.react).toBeGreaterThan(scores.vue);
    });

    test('should detect Vue from dependencies', () => {
      const pkg = {
        dependencies: {
          vue: '^3.0.0'
        }
      };

      const scores = detector.scoreFromPackageJson(pkg);

      expect(scores.vue).toBeGreaterThan(0);
      expect(scores.vue).toBeGreaterThan(scores.react);
    });

    test('should detect Next.js', () => {
      const pkg = {
        dependencies: {
          react: '^18.0.0',
          next: '^13.0.0'
        }
      };

      const scores = detector.scoreFromPackageJson(pkg);

      expect(scores.react).toBeGreaterThan(30);
    });
  });

  describe('HTML Content Scoring', () => {
    test('should detect React from HTML', () => {
      const html = '<div id="root"></div>';
      const scores = detector.scoreFromHTML(html);

      expect(scores.react).toBeGreaterThan(0);
    });

    test('should detect Vue from HTML', () => {
      const html = '<div id="app" v-if="show">{{ message }}</div>';
      const scores = detector.scoreFromHTML(html);

      expect(scores.vue).toBeGreaterThan(0);
    });

    test('should detect Angular from HTML', () => {
      const html = '<div *ngFor="let item of items">{{ item }}</div>';
      const scores = detector.scoreFromHTML(html);

      expect(scores.angular).toBeGreaterThan(0);
    });
  });

  describe('JavaScript Content Scoring', () => {
    test('should detect React from imports', () => {
      const js = 'import React from "react";\nimport { useState } from "react";';
      const scores = detector.scoreFromJS(js);

      expect(scores.react).toBeGreaterThan(0);
    });

    test('should detect Vue from imports', () => {
      const js = 'import { createApp } from "vue";';
      const scores = detector.scoreFromJS(js);

      expect(scores.vue).toBeGreaterThan(0);
    });
  });
});

describe('HTMLParser', () => {
  let parser;

  beforeEach(() => {
    parser = new HTMLParser();
  });

  describe('Basic Parsing', () => {
    test('should parse simple HTML', async () => {
      const html = '<!DOCTYPE html><html><head><title>Test</title></head><body><h1>Hello</h1></body></html>';
      const result = await parser.parse(html, 'test.html');

      expect(result).toBeDefined();
      expect(result.name).toBe('test');
      expect(result.type).toBe('html');
      expect(result.metadata.title).toBe('Test');
    });

    test('should extract DOCTYPE', () => {
      const html = '<!DOCTYPE html><html></html>';
      const doctype = parser.extractDoctype(html);

      expect(doctype).toBe('<!DOCTYPE html>');
    });

    test('should extract charset', async () => {
      const html = '<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body></body></html>';
      const result = await parser.parse(html, 'test.html');

      expect(result.metadata.charset).toBe('UTF-8');
    });

    test('should extract viewport', async () => {
      const html = '<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width"></head><body></body></html>';
      const result = await parser.parse(html, 'test.html');

      expect(result.metadata.viewport).toBe('width=device-width');
    });
  });

  describe('Element Extraction', () => {
    test('should extract all elements', async () => {
      const html = '<!DOCTYPE html><html><body><div><p>Text</p><span>More</span></div></body></html>';
      const result = await parser.parse(html, 'test.html');

      expect(result.elements).toBeDefined();
      expect(result.elements.length).toBeGreaterThan(0);
    });

    test('should extract element attributes', async () => {
      const html = '<!DOCTYPE html><html><body><div id="test" class="container" data-value="123"></div></body></html>';
      const result = await parser.parse(html, 'test.html');

      const divElement = result.elements.find(el => el.tag === 'div');
      expect(divElement).toBeDefined();
      expect(divElement.attributes.id).toBe('test');
      expect(divElement.attributes.class).toBe('container');
      expect(divElement.attributes['data-value']).toBe('123');
    });
  });

  describe('Style Extraction', () => {
    test('should extract inline styles', async () => {
      const html = '<!DOCTYPE html><html><body><div style="color: red;"></div></body></html>';
      const result = await parser.parse(html, 'test.html');

      expect(result.styles.inline).toBeDefined();
      expect(result.styles.inline.length).toBeGreaterThan(0);
    });

    test('should extract internal styles', async () => {
      const html = '<!DOCTYPE html><html><head><style>body { margin: 0; }</style></head><body></body></html>';
      const result = await parser.parse(html, 'test.html');

      expect(result.styles.internal).toBeDefined();
      expect(result.styles.internal.length).toBeGreaterThan(0);
    });

    test('should extract external styles', async () => {
      const html = '<!DOCTYPE html><html><head><link rel="stylesheet" href="style.css"></head><body></body></html>';
      const result = await parser.parse(html, 'test.html');

      expect(result.styles.external).toBeDefined();
      expect(result.styles.external.length).toBeGreaterThan(0);
    });
  });

  describe('Asset Extraction', () => {
    test('should extract images', async () => {
      const html = '<!DOCTYPE html><html><body><img src="logo.png" alt="Logo"></body></html>';
      const result = await parser.parse(html, 'test.html');

      expect(result.assets.images).toBeDefined();
      expect(result.assets.images.length).toBeGreaterThan(0);
      expect(result.assets.images[0].src).toBe('logo.png');
      expect(result.assets.images[0].alt).toBe('Logo');
    });

    test('should extract videos', async () => {
      const html = '<!DOCTYPE html><html><body><video src="video.mp4" controls></video></body></html>';
      const result = await parser.parse(html, 'test.html');

      expect(result.assets.videos).toBeDefined();
      expect(result.assets.videos.length).toBeGreaterThan(0);
    });
  });
});

describe('StyleExtractor', () => {
  let extractor;

  beforeEach(() => {
    extractor = new StyleExtractor();
  });

  describe('CSS Parsing', () => {
    test('should parse CSS rules', () => {
      const css = 'body { margin: 0; padding: 0; } .container { width: 100%; }';
      const parsed = extractor.parseCSS(css, 'style.css');

      expect(parsed.rules).toBeDefined();
      expect(parsed.rules.length).toBe(2);
    });

    test('should extract CSS variables', () => {
      const css = ':root { --primary-color: #007bff; --secondary-color: #6c757d; }';
      const variables = extractor.extractCSSVariables(css);

      expect(variables).toHaveLength(2);
      expect(variables[0].name).toBe('--primary-color');
      expect(variables[0].value).toBe('#007bff');
    });

    test('should extract media queries', () => {
      const css = '@media (max-width: 768px) { body { font-size: 14px; } }';
      const queries = extractor.extractMediaQueries(css);

      expect(queries).toHaveLength(1);
      expect(queries[0].query).toContain('max-width: 768px');
    });

    test('should extract keyframes', () => {
      const css = '@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }';
      const keyframes = extractor.extractKeyframes(css);

      expect(keyframes).toHaveLength(1);
      expect(keyframes[0].name).toBe('fadeIn');
    });
  });

  describe('SCSS Parsing', () => {
    test('should extract SCSS variables', () => {
      const scss = '$primary-color: #007bff; $font-size: 16px;';
      const variables = extractor.extractSCSSVariables(scss);

      expect(variables).toHaveLength(2);
      expect(variables[0].name).toBe('$primary-color');
    });

    test('should extract SCSS mixins', () => {
      const scss = '@mixin flex-center { display: flex; justify-content: center; }';
      const mixins = extractor.extractSCSSMixins(scss);

      expect(mixins).toHaveLength(1);
      expect(mixins[0].name).toBe('flex-center');
    });

    test('should detect nesting', () => {
      const scss = '.container { .item { color: red; } }';
      const hasNesting = extractor.detectNesting(scss);

      expect(hasNesting).toBe(true);
    });
  });

  describe('Tailwind Detection', () => {
    test('should detect Tailwind classes', () => {
      const components = [{
        elements: [
          { tag: 'div', classes: ['flex', 'justify-center', 'items-center', 'bg-blue-500'] }
        ]
      }];

      const result = extractor.detectTailwind(components, { json: [] });

      expect(result.detected).toBe(true);
      expect(result.classes.length).toBeGreaterThan(0);
    });
  });
});

describe('AssetManager', () => {
  let manager;

  beforeEach(() => {
    manager = new AssetManager();
  });

  afterEach(() => {
    manager.cleanup();
  });

  describe('Asset Type Detection', () => {
    test('should detect image types', () => {
      expect(manager.detectAssetType({ name: 'logo.png' })).toBe('image');
      expect(manager.detectAssetType({ name: 'photo.jpg' })).toBe('image');
      expect(manager.detectAssetType({ name: 'icon.svg' })).toBe('image');
    });

    test('should detect video types', () => {
      expect(manager.detectAssetType({ name: 'video.mp4' })).toBe('video');
      expect(manager.detectAssetType({ name: 'clip.webm' })).toBe('video');
    });

    test('should detect font types', () => {
      expect(manager.detectAssetType({ name: 'font.woff' })).toBe('font');
      expect(manager.detectAssetType({ name: 'font.woff2' })).toBe('font');
      expect(manager.detectAssetType({ name: 'font.ttf' })).toBe('font');
    });
  });

  describe('Font Family Extraction', () => {
    test('should extract font family from filename', () => {
      expect(manager.extractFontFamily('Roboto-Regular.woff2')).toBe('Roboto');
      expect(manager.extractFontFamily('OpenSans-Bold.ttf')).toBe('OpenSans');
    });
  });

  describe('Size Formatting', () => {
    test('should format bytes correctly', () => {
      expect(manager.formatBytes(0)).toBe('0 Bytes');
      expect(manager.formatBytes(1024)).toBe('1 KB');
      expect(manager.formatBytes(1048576)).toBe('1 MB');
    });
  });
});

// Integration Tests
describe('Integration Tests', () => {
  test('should load and parse a complete HTML project', async () => {
    const reader = new FrontendReader();
    
    // Create mock HTML file
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Test Project</title>
        <style>
          body { margin: 0; padding: 0; }
          .container { max-width: 1200px; margin: 0 auto; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Welcome</h1>
          <p>This is a test project.</p>
          <img src="logo.png" alt="Logo">
        </div>
      </body>
      </html>
    `;

    const file = new File([htmlContent], 'index.html', { type: 'text/html' });
    const project = await reader.loadHTMLFile(file);

    expect(project).toBeDefined();
    expect(project.framework.name).toBe('html');
    expect(project.components).toHaveLength(1);
    expect(project.components[0].metadata.title).toBe('Test Project');
    expect(project.components[0].styles.internal).toHaveLength(1);
    expect(project.components[0].assets.images).toHaveLength(1);

    await reader.cleanup();
  });
});
