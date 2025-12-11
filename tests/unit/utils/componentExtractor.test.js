/**
 * Unit tests for ComponentExtractor
 * @test
 */

const ComponentExtractor = require('../../../src/utils/componentExtractor');

describe('ComponentExtractor', () => {
  let componentExtractor;

  beforeEach(() => {
    // Setup DOM
    document.body.innerHTML = '<div id="canvas"></div>';

    // Clear localStorage
    localStorage.clear();

    componentExtractor = new ComponentExtractor();
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    document.body.innerHTML = '';
  });

  describe('Constructor', () => {
    it('should initialize with empty extracted components', () => {
      expect(componentExtractor.extractedComponents).toEqual([]);
    });

    it('should have component patterns defined', () => {
      expect(componentExtractor.componentPatterns).toBeDefined();
      expect(componentExtractor.componentPatterns.navbar).toBeDefined();
      expect(componentExtractor.componentPatterns.card).toBeDefined();
    });

    it('should have navbar pattern with correct selectors', () => {
      const navbar = componentExtractor.componentPatterns.navbar;
      expect(navbar.selectors).toContain('nav');
      expect(navbar.selectors).toContain('.navbar');
    });

    it('should have card pattern with correct selectors', () => {
      const card = componentExtractor.componentPatterns.card;
      expect(card.selectors).toContain('.card');
      expect(card.selectors).toContain('.box');
    });

    it('should have hero pattern defined', () => {
      const hero = componentExtractor.componentPatterns.hero;
      expect(hero.selectors).toContain('.hero');
      expect(hero.selectors).toContain('.banner');
    });

    it('should have footer pattern defined', () => {
      const footer = componentExtractor.componentPatterns.footer;
      expect(footer.selectors).toContain('footer');
      expect(footer.selectors).toContain('.footer');
    });

    it('should have form pattern defined', () => {
      const form = componentExtractor.componentPatterns.form;
      expect(form.selectors).toContain('form');
      expect(form.requiredElements).toContain('input');
    });

    it('should have gallery pattern defined', () => {
      const gallery = componentExtractor.componentPatterns.gallery;
      expect(gallery.selectors).toContain('.gallery');
      expect(gallery.requiredElements).toContain('img');
    });
  });

  describe('extractComponents()', () => {
    it('should extract navbar components', () => {
      const html = `
        <nav class="navbar">
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">About</a></li>
          </ul>
        </nav>
      `;

      const components = componentExtractor.extractComponents(html);

      expect(components.some(c => c.type === 'navbar')).toBe(true);
    });

    it('should extract card components', () => {
      const html = `
        <div class="card">
          <h3>Card Title</h3>
          <p>Card description</p>
          <img src="image.jpg" alt="Card image">
        </div>
      `;

      const components = componentExtractor.extractComponents(html);

      expect(components.some(c => c.type === 'card')).toBe(true);
    });

    it('should extract footer components', () => {
      const html = `
        <footer>
          <p>Copyright 2024</p>
          <a href="#">Privacy</a>
        </footer>
      `;

      const components = componentExtractor.extractComponents(html);

      expect(components.some(c => c.type === 'footer')).toBe(true);
    });

    it('should reset extracted components on each call', () => {
      componentExtractor.extractComponents('<nav><a href="#">Link</a><ul><li>Item</li></ul></nav>');
      componentExtractor.extractComponents('<footer><p>Footer</p></footer>');

      expect(componentExtractor.extractedComponents.length).toBeGreaterThan(0);
    });

    it('should handle empty HTML', () => {
      const components = componentExtractor.extractComponents('');

      expect(components).toEqual([]);
    });

    it('should handle HTML without components', () => {
      const html = '<div>Simple text</div>';

      const components = componentExtractor.extractComponents(html);

      expect(Array.isArray(components)).toBe(true);
    });
  });

  describe('findComponentsByPattern()', () => {
    it('should find elements matching pattern selectors', () => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(`
        <nav>
          <a href="#">Link 1</a>
          <ul><li>Item</li></ul>
        </nav>
      `, 'text/html');

      componentExtractor.findComponentsByPattern(
        doc,
        'navbar',
        componentExtractor.componentPatterns.navbar
      );

      expect(componentExtractor.extractedComponents.length).toBeGreaterThan(0);
    });

    it('should validate components against pattern requirements', () => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(`
        <nav>
          <span>Not enough elements</span>
        </nav>
      `, 'text/html');

      componentExtractor.extractedComponents = [];
      componentExtractor.findComponentsByPattern(
        doc,
        'navbar',
        componentExtractor.componentPatterns.navbar
      );

      // Should not extract invalid navbar
      expect(componentExtractor.extractedComponents.length).toBe(0);
    });
  });

  describe('findComponentsByStructure()', () => {
    it('should find components by HTML structure', () => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(`
        <div class="custom-component">
          <h2>Title</h2>
          <p>Description</p>
          <button>Action</button>
        </div>
      `, 'text/html');

      componentExtractor.extractedComponents = [];
      componentExtractor.findComponentsByStructure(doc);

      expect(componentExtractor.extractedComponents.length).toBeGreaterThan(0);
    });

    it('should search in div, section, and article elements', () => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(`
        <section class="hero">
          <h1>Hero Title</h1>
          <p>Hero description</p>
          <button>CTA</button>
        </section>
      `, 'text/html');

      componentExtractor.extractedComponents = [];
      componentExtractor.findComponentsByStructure(doc);

      expect(componentExtractor.extractedComponents.length).toBeGreaterThan(0);
    });
  });

  describe('validateComponent()', () => {
    it('should return true for valid component', () => {
      const element = document.createElement('nav');
      element.innerHTML = `
        <a href="#">Link</a>
        <ul><li>Item 1</li><li>Item 2</li></ul>
      `;

      const result = componentExtractor.validateComponent(
        element,
        componentExtractor.componentPatterns.navbar
      );

      expect(result).toBe(true);
    });

    it('should return false for component with too few elements', () => {
      const element = document.createElement('nav');
      element.innerHTML = '<span>Only one</span>';

      const result = componentExtractor.validateComponent(
        element,
        componentExtractor.componentPatterns.navbar
      );

      expect(result).toBe(false);
    });

    it('should return false for component without required elements', () => {
      const element = document.createElement('div');
      element.innerHTML = '<span>No required elements</span><span>Another</span>';

      const result = componentExtractor.validateComponent(
        element,
        componentExtractor.componentPatterns.navbar
      );

      expect(result).toBe(false);
    });
  });

  describe('couldBeComponent()', () => {
    it('should return true for element with multiple children', () => {
      const element = document.createElement('div');
      element.innerHTML = `
        <h2>Title</h2>
        <p>Description</p>
        <button>Action</button>
      `;

      const result = componentExtractor.couldBeComponent(element);

      expect(result).toBe(true);
    });

    it('should return false for element with too few children', () => {
      const element = document.createElement('div');
      element.innerHTML = '<span>Only one</span>';

      const result = componentExtractor.couldBeComponent(element);

      expect(result).toBe(false);
    });

    it('should return false for element with too many children', () => {
      const element = document.createElement('div');
      for (let i = 0; i < 25; i++) {
        element.appendChild(document.createElement('div'));
      }

      const result = componentExtractor.couldBeComponent(element);

      expect(result).toBe(false);
    });

    it('should return false for element without diverse tag types', () => {
      const element = document.createElement('div');
      element.innerHTML = '<span>One</span><span>Two</span>';

      const result = componentExtractor.couldBeComponent(element);

      expect(result).toBe(false);
    });
  });

  describe('guessComponentType()', () => {
    it('should detect navbar by class', () => {
      const element = document.createElement('div');
      element.className = 'navbar';

      const result = componentExtractor.guessComponentType(element);

      expect(result).toBe('navbar');
    });

    it('should detect card by class', () => {
      const element = document.createElement('div');
      element.className = 'card';

      const result = componentExtractor.guessComponentType(element);

      expect(result).toBe('card');
    });

    it('should detect hero by class', () => {
      const element = document.createElement('div');
      element.className = 'hero-section';

      const result = componentExtractor.guessComponentType(element);

      expect(result).toBe('hero');
    });

    it('should detect footer by class', () => {
      const element = document.createElement('div');
      element.className = 'footer';

      const result = componentExtractor.guessComponentType(element);

      expect(result).toBe('footer');
    });

    it('should detect form by content', () => {
      const element = document.createElement('div');
      element.innerHTML = '<form><input type="text"></form>';

      const result = componentExtractor.guessComponentType(element);

      expect(result).toBe('form');
    });

    it('should detect gallery by multiple images', () => {
      const element = document.createElement('div');
      element.innerHTML = `
        <img src="1.jpg">
        <img src="2.jpg">
        <img src="3.jpg">
      `;

      const result = componentExtractor.guessComponentType(element);

      expect(result).toBe('gallery');
    });

    it('should detect testimonial by blockquote', () => {
      const element = document.createElement('div');
      element.innerHTML = '<blockquote>Great product!</blockquote>';

      const result = componentExtractor.guessComponentType(element);

      expect(result).toBe('testimonial');
    });

    it('should detect pricing by content', () => {
      const element = document.createElement('div');
      element.textContent = 'Price: $99';

      const result = componentExtractor.guessComponentType(element);

      expect(result).toBe('pricing');
    });

    it('should return custom for unrecognized elements', () => {
      const element = document.createElement('div');
      element.className = 'random-class';
      element.innerHTML = '<span>Random content</span>';

      const result = componentExtractor.guessComponentType(element);

      expect(result).toBe('custom');
    });
  });

  describe('createComponent()', () => {
    it('should create component object with required properties', () => {
      const element = document.createElement('div');
      element.innerHTML = '<h2>Title</h2><p>Content</p>';

      const component = componentExtractor.createComponent(element, 'card');

      expect(component.id).toBeDefined();
      expect(component.type).toBe('card');
      expect(component.name).toBeDefined();
      expect(component.html).toBeDefined();
      expect(component.created).toBeDefined();
    });

    it('should include CSS from element', () => {
      const element = document.createElement('div');
      element.style.color = 'red';
      element.innerHTML = '<p>Content</p>';

      const component = componentExtractor.createComponent(element, 'card');

      expect(component.css).toBeDefined();
    });

    it('should generate preview', () => {
      const element = document.createElement('div');
      element.innerHTML = '<h2>Title</h2>';

      const component = componentExtractor.createComponent(element, 'card');

      expect(component.preview).toBeDefined();
    });

    it('should generate tags', () => {
      const element = document.createElement('div');
      element.innerHTML = '<img src="test.jpg"><button>Click</button>';

      const component = componentExtractor.createComponent(element, 'card');

      expect(component.tags).toContain('card');
      expect(component.tags).toContain('imagen');
      expect(component.tags).toContain('botón');
    });

    it('should handle errors gracefully', () => {
      const result = componentExtractor.createComponent(null, 'card');

      expect(result).toBeNull();
    });
  });

  describe('cleanElement()', () => {
    it('should remove script elements', () => {
      const element = document.createElement('div');
      element.innerHTML = '<script>alert("test")</script><p>Content</p>';

      const cleaned = componentExtractor.cleanElement(element);

      expect(cleaned.querySelector('script')).toBeNull();
    });

    it('should remove onclick attributes', () => {
      const element = document.createElement('div');
      element.innerHTML = '<button onclick="alert()">Click</button>';

      const cleaned = componentExtractor.cleanElement(element);

      expect(cleaned.querySelector('button').hasAttribute('onclick')).toBe(false);
    });

    it('should remove onload attributes', () => {
      const element = document.createElement('div');
      element.innerHTML = '<img onload="alert()" src="test.jpg">';

      const cleaned = componentExtractor.cleanElement(element);

      expect(cleaned.querySelector('img').hasAttribute('onload')).toBe(false);
    });

    it('should remove onerror attributes', () => {
      const element = document.createElement('div');
      element.innerHTML = '<img onerror="alert()" src="test.jpg">';

      const cleaned = componentExtractor.cleanElement(element);

      expect(cleaned.querySelector('img').hasAttribute('onerror')).toBe(false);
    });

    it('should preserve safe content', () => {
      const element = document.createElement('div');
      element.innerHTML = '<p class="safe">Safe content</p>';

      const cleaned = componentExtractor.cleanElement(element);

      expect(cleaned.querySelector('p').textContent).toBe('Safe content');
    });
  });

  describe('extractElementCSS()', () => {
    it('should extract inline styles', () => {
      const element = document.createElement('div');
      element.style.color = 'red';
      element.style.fontSize = '16px';

      const css = componentExtractor.extractElementCSS(element);

      expect(css).toContain('color');
    });

    it('should extract styles from child elements', () => {
      const element = document.createElement('div');
      element.innerHTML = '<p style="color: blue;">Styled text</p>';

      const css = componentExtractor.extractElementCSS(element);

      expect(css).toContain('color');
    });

    it('should handle elements without styles', () => {
      const element = document.createElement('div');
      element.innerHTML = '<p>No styles</p>';

      const css = componentExtractor.extractElementCSS(element);

      expect(css).toBeDefined();
    });
  });

  describe('generatePreview()', () => {
    it('should truncate long text content', () => {
      const element = document.createElement('div');
      element.innerHTML = '<p>' + 'A'.repeat(100) + '</p>';

      const preview = componentExtractor.generatePreview(element);

      expect(preview).toContain('...');
    });

    it('should preserve short text content', () => {
      const element = document.createElement('div');
      element.innerHTML = '<p>Short text</p>';

      const preview = componentExtractor.generatePreview(element);

      expect(preview).toContain('Short text');
    });

    it('should return HTML string', () => {
      const element = document.createElement('div');
      element.innerHTML = '<h2>Title</h2>';

      const preview = componentExtractor.generatePreview(element);

      expect(typeof preview).toBe('string');
      expect(preview).toContain('<');
    });
  });

  describe('generateTags()', () => {
    it('should include component type as tag', () => {
      const element = document.createElement('div');

      const tags = componentExtractor.generateTags(element, 'card');

      expect(tags).toContain('card');
    });

    it('should add imagen tag for elements with images', () => {
      const element = document.createElement('div');
      element.innerHTML = '<img src="test.jpg">';

      const tags = componentExtractor.generateTags(element, 'card');

      expect(tags).toContain('imagen');
    });

    it('should add botón tag for elements with buttons', () => {
      const element = document.createElement('div');
      element.innerHTML = '<button>Click</button>';

      const tags = componentExtractor.generateTags(element, 'card');

      expect(tags).toContain('botón');
    });

    it('should add formulario tag for elements with forms', () => {
      const element = document.createElement('div');
      element.innerHTML = '<form></form>';

      const tags = componentExtractor.generateTags(element, 'card');

      expect(tags).toContain('formulario');
    });

    it('should add lista tag for elements with lists', () => {
      const element = document.createElement('div');
      element.innerHTML = '<ul><li>Item</li></ul>';

      const tags = componentExtractor.generateTags(element, 'card');

      expect(tags).toContain('lista');
    });

    it('should add responsive tag from class', () => {
      const element = document.createElement('div');
      element.className = 'responsive-card';

      const tags = componentExtractor.generateTags(element, 'card');

      expect(tags).toContain('responsive');
    });

    it('should not have duplicate tags', () => {
      const element = document.createElement('div');
      element.className = 'card';

      const tags = componentExtractor.generateTags(element, 'card');
      const cardCount = tags.filter(t => t === 'card').length;

      expect(cardCount).toBe(1);
    });
  });

  describe('generateComponentName()', () => {
    it('should use heading text for name', () => {
      const element = document.createElement('div');
      element.innerHTML = '<h2>Product Card</h2>';

      const name = componentExtractor.generateComponentName(element, 'card');

      expect(name).toContain('Product Card');
    });

    it('should use class name if no heading', () => {
      const element = document.createElement('div');
      element.className = 'featured-card';

      const name = componentExtractor.generateComponentName(element, 'card');

      expect(name).toContain('featured-card');
    });

    it('should capitalize component type', () => {
      const element = document.createElement('div');

      const name = componentExtractor.generateComponentName(element, 'card');

      expect(name).toMatch(/^Card/);
    });

    it('should truncate long heading text', () => {
      const element = document.createElement('div');
      element.innerHTML = '<h2>' + 'A'.repeat(50) + '</h2>';

      const name = componentExtractor.generateComponentName(element, 'card');

      expect(name.length).toBeLessThan(60);
    });
  });

  describe('generateComponentId()', () => {
    it('should generate unique IDs', () => {
      const id1 = componentExtractor.generateComponentId();
      const id2 = componentExtractor.generateComponentId();

      expect(id1).not.toBe(id2);
    });

    it('should start with comp_ prefix', () => {
      const id = componentExtractor.generateComponentId();

      expect(id).toMatch(/^comp_/);
    });
  });

  describe('capitalizeFirst()', () => {
    it('should capitalize first letter', () => {
      const result = componentExtractor.capitalizeFirst('card');

      expect(result).toBe('Card');
    });

    it('should handle empty string', () => {
      const result = componentExtractor.capitalizeFirst('');

      expect(result).toBe('');
    });

    it('should handle single character', () => {
      const result = componentExtractor.capitalizeFirst('a');

      expect(result).toBe('A');
    });
  });

  describe('saveExtractedComponents()', () => {
    it('should save components to localStorage', () => {
      componentExtractor.extractedComponents = [
        { id: 'comp_1', type: 'card', name: 'Test Card' },
      ];

      componentExtractor.saveExtractedComponents();

      const stored = localStorage.getItem('dragndrop_extracted_components');
      expect(stored).toBeTruthy();
    });

    it('should return number of saved components', () => {
      componentExtractor.extractedComponents = [
        { id: 'comp_1', type: 'card' },
        { id: 'comp_2', type: 'navbar' },
      ];

      const count = componentExtractor.saveExtractedComponents();

      expect(count).toBe(2);
    });

    it('should limit to 50 components', () => {
      // Create 60 components
      const existing = [];
      for (let i = 0; i < 45; i++) {
        existing.push({ id: `existing_${i}`, type: 'card' });
      }
      localStorage.setItem('dragndrop_extracted_components', JSON.stringify(existing));

      componentExtractor.extractedComponents = [];
      for (let i = 0; i < 10; i++) {
        componentExtractor.extractedComponents.push({ id: `new_${i}`, type: 'card' });
      }

      componentExtractor.saveExtractedComponents();

      const stored = componentExtractor.getStoredComponents();
      expect(stored.length).toBeLessThanOrEqual(50);
    });

    it('should append to existing components', () => {
      localStorage.setItem('dragndrop_extracted_components', JSON.stringify([
        { id: 'existing_1', type: 'card' },
      ]));

      componentExtractor.extractedComponents = [
        { id: 'new_1', type: 'navbar' },
      ];

      componentExtractor.saveExtractedComponents();

      const stored = componentExtractor.getStoredComponents();
      expect(stored.length).toBe(2);
    });
  });

  describe('getStoredComponents()', () => {
    it('should return empty array when no components stored', () => {
      const components = componentExtractor.getStoredComponents();

      expect(components).toEqual([]);
    });

    it('should return stored components', () => {
      localStorage.setItem('dragndrop_extracted_components', JSON.stringify([
        { id: 'comp_1', type: 'card' },
      ]));

      const components = componentExtractor.getStoredComponents();

      expect(components.length).toBe(1);
    });

    it('should handle invalid JSON', () => {
      localStorage.setItem('dragndrop_extracted_components', 'invalid-json');

      const components = componentExtractor.getStoredComponents();

      expect(components).toEqual([]);
    });
  });

  describe('deleteStoredComponent()', () => {
    it('should remove component by ID', () => {
      localStorage.setItem('dragndrop_extracted_components', JSON.stringify([
        { id: 'comp_1', type: 'card' },
        { id: 'comp_2', type: 'navbar' },
      ]));

      componentExtractor.deleteStoredComponent('comp_1');

      const stored = componentExtractor.getStoredComponents();
      expect(stored.length).toBe(1);
      expect(stored[0].id).toBe('comp_2');
    });

    it('should handle non-existent ID', () => {
      localStorage.setItem('dragndrop_extracted_components', JSON.stringify([
        { id: 'comp_1', type: 'card' },
      ]));

      componentExtractor.deleteStoredComponent('non_existent');

      const stored = componentExtractor.getStoredComponents();
      expect(stored.length).toBe(1);
    });
  });

  describe('searchComponents()', () => {
    it('should search by name', () => {
      localStorage.setItem('dragndrop_extracted_components', JSON.stringify([
        { id: 'comp_1', type: 'card', name: 'Product Card', tags: [] },
        { id: 'comp_2', type: 'navbar', name: 'Main Navigation', tags: [] },
      ]));

      const results = componentExtractor.searchComponents('Product');

      expect(results.length).toBe(1);
      expect(results[0].name).toContain('Product');
    });

    it('should search by type', () => {
      localStorage.setItem('dragndrop_extracted_components', JSON.stringify([
        { id: 'comp_1', type: 'card', name: 'Test', tags: [] },
        { id: 'comp_2', type: 'navbar', name: 'Test', tags: [] },
      ]));

      const results = componentExtractor.searchComponents('card');

      expect(results.length).toBe(1);
      expect(results[0].type).toBe('card');
    });

    it('should search by tags', () => {
      localStorage.setItem('dragndrop_extracted_components', JSON.stringify([
        { id: 'comp_1', type: 'card', name: 'Test', tags: ['imagen', 'responsive'] },
        { id: 'comp_2', type: 'navbar', name: 'Test', tags: ['navigation'] },
      ]));

      const results = componentExtractor.searchComponents('responsive');

      expect(results.length).toBe(1);
      expect(results[0].tags).toContain('responsive');
    });

    it('should be case insensitive', () => {
      localStorage.setItem('dragndrop_extracted_components', JSON.stringify([
        { id: 'comp_1', type: 'card', name: 'Product Card', tags: [] },
      ]));

      const results = componentExtractor.searchComponents('PRODUCT');

      expect(results.length).toBe(1);
    });

    it('should return empty array for no matches', () => {
      localStorage.setItem('dragndrop_extracted_components', JSON.stringify([
        { id: 'comp_1', type: 'card', name: 'Test', tags: [] },
      ]));

      const results = componentExtractor.searchComponents('nonexistent');

      expect(results).toEqual([]);
    });
  });
});
