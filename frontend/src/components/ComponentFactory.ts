/**
 * Component Factory - Creates HTML elements based on component types
 */

import type { ElementNode, ElementStyle, ComponentDefinition } from '@/types';
import { generateUniqueId } from '@/utils/helpers';

export class ComponentFactory {
  private static instance: ComponentFactory;
  private elementIdCounter = 1;

  private constructor() {}

  static getInstance(): ComponentFactory {
    if (!ComponentFactory.instance) {
      ComponentFactory.instance = new ComponentFactory();
    }
    return ComponentFactory.instance;
  }

  /**
   * Create a new HTML element based on component type
   */
  createElement(type: string): HTMLElement {
    const id = `element-${this.elementIdCounter++}`;
    let element: HTMLElement;

    switch (type) {
      // Layout components
      case 'contenedor':
        element = this.createContainer();
        break;
      case 'seccion':
        element = this.createSection();
        break;
      case 'fila':
        element = this.createRow();
        break;
      case 'columna':
        element = this.createColumn();
        break;
      case 'grid2':
        element = this.createGrid(2);
        break;
      case 'grid3':
        element = this.createGrid(3);
        break;

      // Text components
      case 'h1':
        element = this.createHeading(1);
        break;
      case 'h2':
        element = this.createHeading(2);
        break;
      case 'h3':
        element = this.createHeading(3);
        break;
      case 'p':
        element = this.createParagraph();
        break;
      case 'span':
        element = this.createSpan();
        break;
      case 'ul':
        element = this.createUnorderedList();
        break;
      case 'ol':
        element = this.createOrderedList();
        break;

      // Media components
      case 'img':
        element = this.createImage();
        break;
      case 'video':
        element = this.createVideo();
        break;
      case 'iframe':
        element = this.createIframe();
        break;

      // Form components
      case 'input':
        element = this.createInput();
        break;
      case 'textarea':
        element = this.createTextarea();
        break;
      case 'button':
        element = this.createButton();
        break;
      case 'checkbox':
        element = this.createCheckbox();
        break;
      case 'radio':
        element = this.createRadio();
        break;
      case 'select':
        element = this.createSelect();
        break;

      // UI components
      case 'btn-primary':
        element = this.createPrimaryButton();
        break;
      case 'btn-secondary':
        element = this.createSecondaryButton();
        break;
      case 'card':
        element = this.createCard();
        break;
      case 'navbar':
        element = this.createNavbar();
        break;
      case 'footer':
        element = this.createFooter();
        break;
      case 'hero':
        element = this.createHero();
        break;

      // Advanced components
      case 'tabs':
        element = this.createTabs();
        break;
      case 'accordion':
        element = this.createAccordion();
        break;
      case 'modal':
        element = this.createModal();
        break;
      case 'carousel':
        element = this.createCarousel();
        break;
      case 'alert':
        element = this.createAlert();
        break;
      case 'badge':
        element = this.createBadge();
        break;

      default:
        element = this.createContainer();
        console.warn(`Unknown component type: ${type}`);
    }

    // Set common properties
    element.id = id;
    element.classList.add('draggable-element');
    element.setAttribute('data-component-type', type);

    // Add selection and deletion capabilities
    this.addElementInteractions(element);

    return element;
  }

  /**
   * Create element node data structure
   */
  createElementNode(element: HTMLElement): ElementNode {
    const computedStyle = window.getComputedStyle(element);
    const style: ElementStyle = {};
    
    // Extract relevant styles
    const styleProperties = [
      'width', 'height', 'padding', 'margin', 'border', 'borderRadius',
      'backgroundColor', 'color', 'fontSize', 'fontWeight', 'textAlign',
      'display', 'flexDirection', 'justifyContent', 'alignItems', 'gap',
      'gridTemplateColumns', 'gridTemplateRows', 'position', 'top', 'left',
      'right', 'bottom', 'zIndex', 'opacity', 'transform'
    ];

    styleProperties.forEach(prop => {
      const value = computedStyle.getPropertyValue(prop);
      if (value && value !== 'auto' && value !== 'normal') {
        style[prop] = value;
      }
    });

    // Extract attributes
    const attributes: Record<string, any> = {};
    Array.from(element.attributes).forEach(attr => {
      if (!attr.name.startsWith('data-') && attr.name !== 'id' && attr.name !== 'class') {
        attributes[attr.name] = attr.value;
      }
    });

    return {
      id: element.id,
      type: element.getAttribute('data-component-type') || 'div',
      tagName: element.tagName.toLowerCase(),
      textContent: element.textContent || undefined,
      innerHTML: element.innerHTML || undefined,
      style,
      attributes,
      children: Array.from(element.children).map(child => 
        this.createElementNode(child as HTMLElement)
      )
    };
  }

  // Layout component creators
  private createContainer(): HTMLElement {
    const element = document.createElement('div');
    this.applyStyles(element, {
      padding: '20px',
      border: '1px dashed #ccc',
      minHeight: '100px'
    });
    element.textContent = 'Contenedor';
    return element;
  }

  private createSection(): HTMLElement {
    const element = document.createElement('section');
    this.applyStyles(element, {
      padding: '40px 20px',
      width: '100%',
      minHeight: '200px',
      background: '#f8fafc'
    });
    element.textContent = 'Sección';
    return element;
  }

  private createRow(): HTMLElement {
    const element = document.createElement('div');
    this.applyStyles(element, {
      display: 'flex',
      flexDirection: 'row',
      gap: '10px',
      minHeight: '80px',
      border: '1px dashed #ccc'
    });
    element.textContent = 'Fila (Flex)';
    return element;
  }

  private createColumn(): HTMLElement {
    const element = document.createElement('div');
    this.applyStyles(element, {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      minHeight: '100px',
      border: '1px dashed #ccc'
    });
    element.textContent = 'Columna (Flex)';
    return element;
  }

  private createGrid(columns: number): HTMLElement {
    const element = document.createElement('div');
    this.applyStyles(element, {
      display: 'grid',
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gap: '10px',
      minHeight: '100px',
      border: '1px dashed #ccc'
    });

    // Add grid items
    for (let i = 1; i <= columns; i++) {
      const gridItem = document.createElement('div');
      gridItem.style.padding = '20px';
      gridItem.style.background = '#f1f5f9';
      gridItem.textContent = `Columna ${i}`;
      element.appendChild(gridItem);
    }

    return element;
  }

  // Text component creators
  private createHeading(level: number): HTMLElement {
    const element = document.createElement(`h${level}` as keyof HTMLElementTagNameMap);
    const sizes = { 1: '2.5rem', 2: '2rem', 3: '1.5rem' };
    const texts = { 1: 'Título Principal', 2: 'Subtítulo', 3: 'Título H3' };
    
    this.applyStyles(element, {
      fontSize: sizes[level as keyof typeof sizes],
      fontWeight: 'bold',
      margin: '0'
    });
    element.textContent = texts[level as keyof typeof texts];
    return element;
  }

  private createParagraph(): HTMLElement {
    const element = document.createElement('p');
    this.applyStyles(element, {
      fontSize: '1rem',
      lineHeight: '1.6',
      margin: '0'
    });
    element.textContent = 'Este es un párrafo de ejemplo. Haz doble click para editar el texto.';
    return element;
  }

  private createSpan(): HTMLElement {
    const element = document.createElement('span');
    element.textContent = 'Texto en línea';
    return element;
  }

  private createUnorderedList(): HTMLElement {
    const element = document.createElement('ul');
    element.style.paddingLeft = '20px';
    element.innerHTML = '<li>Elemento 1</li><li>Elemento 2</li><li>Elemento 3</li>';
    return element;
  }

  private createOrderedList(): HTMLElement {
    const element = document.createElement('ol');
    element.style.paddingLeft = '20px';
    element.innerHTML = '<li>Elemento 1</li><li>Elemento 2</li><li>Elemento 3</li>';
    return element;
  }

  // Media component creators
  private createImage(): HTMLElement {
    const element = document.createElement('img') as HTMLImageElement;
    element.src = 'https://via.placeholder.com/400x200';
    element.alt = 'Imagen';
    this.applyStyles(element, {
      maxWidth: '100%',
      display: 'block'
    });
    return element;
  }

  private createVideo(): HTMLElement {
    const element = document.createElement('video') as HTMLVideoElement;
    element.controls = true;
    this.applyStyles(element, {
      width: '100%',
      maxWidth: '600px'
    });
    element.innerHTML = '<source src="" type="video/mp4">';
    return element;
  }

  private createIframe(): HTMLElement {
    const element = document.createElement('iframe') as HTMLIFrameElement;
    element.src = '';
    this.applyStyles(element, {
      width: '100%',
      height: '400px',
      border: '1px solid #ccc'
    });
    return element;
  }

  // Form component creators
  private createInput(): HTMLElement {
    const element = document.createElement('input') as HTMLInputElement;
    element.type = 'text';
    element.placeholder = 'Escribe aquí...';
    this.applyStyles(element, {
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      width: '100%'
    });
    return element;
  }

  private createTextarea(): HTMLElement {
    const element = document.createElement('textarea') as HTMLTextAreaElement;
    element.placeholder = 'Escribe aquí...';
    this.applyStyles(element, {
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      width: '100%',
      minHeight: '100px',
      fontFamily: 'inherit'
    });
    return element;
  }

  private createButton(): HTMLElement {
    const element = document.createElement('button');
    element.textContent = 'Botón';
    this.applyStyles(element, {
      padding: '10px 20px',
      background: '#64748b',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer'
    });
    return element;
  }

  private createCheckbox(): HTMLElement {
    const element = document.createElement('label');
    element.innerHTML = '<input type="checkbox" style="margin-right: 8px;">Opción checkbox';
    this.applyStyles(element, {
      display: 'flex',
      alignItems: 'center'
    });
    return element;
  }

  private createRadio(): HTMLElement {
    const element = document.createElement('label');
    element.innerHTML = '<input type="radio" name="radio-group" style="margin-right: 8px;">Opción radio';
    this.applyStyles(element, {
      display: 'flex',
      alignItems: 'center'
    });
    return element;
  }

  private createSelect(): HTMLElement {
    const element = document.createElement('select');
    element.innerHTML = '<option>Opción 1</option><option>Opción 2</option><option>Opción 3</option>';
    this.applyStyles(element, {
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      width: '100%'
    });
    return element;
  }

  // UI component creators
  private createPrimaryButton(): HTMLElement {
    const element = document.createElement('button');
    element.textContent = 'Botón Primario';
    this.applyStyles(element, {
      padding: '12px 24px',
      background: '#2563eb',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontWeight: '500'
    });
    return element;
  }

  private createSecondaryButton(): HTMLElement {
    const element = document.createElement('button');
    element.textContent = 'Botón Secundario';
    this.applyStyles(element, {
      padding: '12px 24px',
      background: 'white',
      color: '#1e293b',
      border: '1px solid #e2e8f0',
      borderRadius: '6px',
      cursor: 'pointer',
      fontWeight: '500'
    });
    return element;
  }

  private createCard(): HTMLElement {
    const element = document.createElement('div');
    element.className = 'component-card';
    element.innerHTML = `
      <img src="https://via.placeholder.com/400x200" alt="Card image" style="width: 100%; border-radius: 8px 8px 0 0;">
      <div class="component-card-body">
        <h3 style="margin: 0 0 10px 0;">Título de la Card</h3>
        <p style="margin: 0 0 15px 0; color: #64748b;">Descripción de la tarjeta con información relevante.</p>
        <button style="background: #2563eb; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">Leer más</button>
      </div>
    `;
    return element;
  }

  private createNavbar(): HTMLElement {
    const element = document.createElement('nav');
    element.className = 'component-navbar';
    element.innerHTML = `
      <div class="component-navbar-brand">Logo</div>
      <ul class="component-navbar-nav">
        <li><a href="#">Inicio</a></li>
        <li><a href="#">Servicios</a></li>
        <li><a href="#">Contacto</a></li>
      </ul>
    `;
    element.style.width = '100%';
    return element;
  }

  private createFooter(): HTMLElement {
    const element = document.createElement('footer');
    element.className = 'component-footer';
    element.innerHTML = `
      <p style="margin: 0 0 10px 0;">&copy; 2025 Mi Sitio Web</p>
      <p style="margin: 0; color: #94a3b8;">Todos los derechos reservados</p>
    `;
    element.style.width = '100%';
    return element;
  }

  private createHero(): HTMLElement {
    const element = document.createElement('section');
    element.className = 'component-hero';
    element.innerHTML = `
      <h1 style="margin: 0 0 20px 0; font-size: 3rem;">Bienvenido</h1>
      <p style="margin: 0 0 30px 0; font-size: 1.25rem; max-width: 600px;">Crea páginas web increíbles con nuestro editor visual</p>
      <button style="background: white; color: #667eea; padding: 12px 32px; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 1rem;">Comenzar</button>
    `;
    element.style.width = '100%';
    return element;
  }

  // Advanced component creators
  private createTabs(): HTMLElement {
    const element = document.createElement('div');
    element.innerHTML = `
      <div class="tabs-container" style="width: 100%;">
        <div class="tabs-nav" style="display: flex; border-bottom: 1px solid #e2e8f0;">
          <button class="tab-btn active" style="padding: 12px 20px; border: none; background: #f1f5f9; cursor: pointer; border-bottom: 2px solid #2563eb; font-weight: 500; color: #2563eb;">Pestaña 1</button>
          <button class="tab-btn" style="padding: 12px 20px; border: none; background: transparent; cursor: pointer; border-bottom: 2px solid transparent;">Pestaña 2</button>
          <button class="tab-btn" style="padding: 12px 20px; border: none; background: transparent; cursor: pointer; border-bottom: 2px solid transparent;">Pestaña 3</button>
        </div>
        <div class="tab-content" style="padding: 20px; border: 1px solid #e2e8f0; border-top: none;">
          <p>Contenido de la primera pestaña</p>
        </div>
      </div>
    `;
    element.style.width = '100%';
    return element;
  }

  private createAccordion(): HTMLElement {
    const element = document.createElement('div');
    element.innerHTML = `
      <div class="accordion-item" style="border: 1px solid #e2e8f0; border-bottom: none;">
        <div class="accordion-header" style="padding: 16px 20px; background: #f8fafc; cursor: pointer; font-weight: 500; border-bottom: 1px solid #e2e8f0;">
          <span style="display: flex; justify-content: space-between; align-items: center; width: 100%;">Pregunta frecuente 1</span>
        </div>
        <div class="accordion-content" style="padding: 20px; display: block;">
          <p>Respuesta a la primera pregunta frecuente.</p>
        </div>
      </div>
      <div class="accordion-item" style="border: 1px solid #e2e8f0; border-bottom: none;">
        <div class="accordion-header" style="padding: 16px 20px; background: #f8fafc; cursor: pointer; font-weight: 500; border-bottom: 1px solid #e2e8f0;">
          <span style="display: flex; justify-content: space-between; align-items: center; width: 100%;">Pregunta frecuente 2</span>
        </div>
        <div class="accordion-content" style="padding: 20px; display: none;">
          <p>Respuesta a la segunda pregunta frecuente.</p>
        </div>
      </div>
    `;
    element.style.width = '100%';
    return element;
  }

  private createModal(): HTMLElement {
    const element = document.createElement('div');
    element.innerHTML = `
      <button class="modal-trigger" style="padding: 12px 24px; background: #2563eb; color: white; border: none; border-radius: 6px; cursor: pointer;">Abrir Modal</button>
      <div class="modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: none; align-items: center; justify-content: center; z-index: 1000;">
        <div class="modal-content" style="background: white; padding: 30px; border-radius: 8px; width: 500px; position: relative; max-width: 90%;">
          <button class="modal-close" style="position: absolute; top: 10px; right: 15px; background: none; border: none; font-size: 24px; cursor: pointer;">&times;</button>
          <h3 style="margin: 0 0 15px 0;">Título del Modal</h3>
          <p style="margin: 0 0 20px 0;">Contenido del modal aquí.</p>
          <button class="modal-btn" style="padding: 8px 16px; background: #2563eb; color: white; border: none; border-radius: 4px; cursor: pointer;">Aceptar</button>
        </div>
      </div>
    `;
    return element;
  }

  private createCarousel(): HTMLElement {
    const element = document.createElement('div');
    element.innerHTML = `
      <div class="carousel-container" style="width: 100%; overflow: hidden; position: relative;">
        <div class="carousel-slides" style="display: flex; transition: transform 0.3s ease;">
          <div style="min-width: 100%; padding: 20px; text-align: center; background: #f1f5f9;">
            <h4>Diapositiva 1</h4>
            <p>Contenido de la primera diapositiva</p>
          </div>
          <div style="min-width: 100%; padding: 20px; text-align: center; background: #e2e8f0;">
            <h4>Diapositiva 2</h4>
            <p>Contenido de la segunda diapositiva</p>
          </div>
          <div style="min-width: 100%; padding: 20px; text-align: center; background: #cbd5e1;">
            <h4>Diapositiva 3</h4>
            <p>Contenido de la tercera diapositiva</p>
          </div>
        </div>
        <button class="carousel-prev" style="position: absolute; left: 10px; top: 50%; transform: translateY(-50%); background: white; border: 1px solid #cbd5e1; border-radius: 50%; width: 40px; height: 40px; cursor: pointer;">←</button>
        <button class="carousel-next" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: white; border: 1px solid #cbd5e1; border-radius: 50%; width: 40px; height: 40px; cursor: pointer;">→</button>
      </div>
    `;
    element.style.width = '100%';
    return element;
  }

  private createAlert(): HTMLElement {
    const element = document.createElement('div');
    element.innerHTML = `
      <div class="alert alert-info" style="padding: 16px; border-radius: 6px; border-left: 4px solid #3b82f6; background: #dbeafe; color: #1e3a8a; display: flex; align-items: center;">
        <span style="margin-right: 12px;">ℹ️</span>
        <span>Este es un mensaje de información</span>
      </div>
    `;
    element.style.width = '100%';
    return element;
  }

  private createBadge(): HTMLElement {
    const element = document.createElement('span');
    element.textContent = 'Badge';
    this.applyStyles(element, {
      display: 'inline-block',
      padding: '4px 8px',
      fontSize: '0.75rem',
      fontWeight: '500',
      borderRadius: '4px',
      background: '#2563eb',
      color: 'white'
    });
    return element;
  }

  // Utility methods
  private applyStyles(element: HTMLElement, styles: ElementStyle): void {
    Object.entries(styles).forEach(([property, value]) => {
      if (value !== undefined) {
        element.style.setProperty(property, String(value));
      }
    });
  }

  private addElementInteractions(element: HTMLElement): void {
    // Add click handler for selection
    element.addEventListener('click', (e) => {
      e.stopPropagation();
      this.selectElement(element);
    });

    // Add double-click handler for text editing
    element.addEventListener('dblclick', (e) => {
      e.stopPropagation();
      this.enableTextEditing(element);
    });
  }

  private selectElement(element: HTMLElement): void {
    // Remove previous selection
    document.querySelectorAll('.selected-element').forEach(el => {
      el.classList.remove('selected-element');
      el.querySelectorAll('.delete-btn').forEach(btn => btn.remove());
    });

    // Add selection to current element
    element.classList.add('selected-element');

    // Add delete button
    const deleteBtn = document.createElement('div');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = '×';
    deleteBtn.style.cssText = `
      position: absolute;
      top: -10px;
      right: -10px;
      width: 20px;
      height: 20px;
      background: #ef4444;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 14px;
      font-weight: bold;
      z-index: 1000;
    `;

    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      element.remove();
    });

    element.style.position = 'relative';
    element.appendChild(deleteBtn);

    // Emit selection event
    window.dispatchEvent(new CustomEvent('element:selected', {
      detail: { element, elementNode: this.createElementNode(element) }
    }));
  }

  private enableTextEditing(element: HTMLElement): void {
    if (element.tagName.match(/^H[1-6]$|^P$|^SPAN$/)) {
      const originalText = element.textContent || '';
      element.contentEditable = 'true';
      element.focus();

      const finishEditing = () => {
        element.contentEditable = 'false';
        element.removeEventListener('blur', finishEditing);
        element.removeEventListener('keydown', handleKeydown);
      };

      const handleKeydown = (e: KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          finishEditing();
        }
        if (e.key === 'Escape') {
          element.textContent = originalText;
          finishEditing();
        }
      };

      element.addEventListener('blur', finishEditing);
      element.addEventListener('keydown', handleKeydown);
    }
  }
}

// Export singleton instance
export const componentFactory = ComponentFactory.getInstance();