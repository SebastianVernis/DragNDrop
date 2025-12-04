/**
 * FileLoader - Maneja la carga de archivos HTML, CSS, JS e imágenes
 */
class FileLoader {
  constructor() {
    this.supportedTypes = {
      html: ['text/html', '.html', '.htm'],
      css: ['text/css', '.css'],
      js: ['text/javascript', 'application/javascript', '.js'],
      images: [
        'image/png',
        'image/jpeg',
        'image/gif',
        'image/webp',
        'image/svg+xml',
        '.png',
        '.jpg',
        '.jpeg',
        '.gif',
        '.webp',
        '.svg',
      ],
    };
    this.setupDropZone();
  }

  /**
   * Configura la zona de drop para archivos
   */
  setupDropZone() {
    const canvas = document.getElementById('canvas');

    // Prevenir comportamiento por defecto del navegador
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      canvas.addEventListener(eventName, this.preventDefaults, false);
      document.body.addEventListener(eventName, this.preventDefaults, false);
    });

    // Resaltar zona de drop
    ['dragenter', 'dragover'].forEach(eventName => {
      canvas.addEventListener(eventName, this.highlight.bind(this), false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      canvas.addEventListener(eventName, this.unhighlight.bind(this), false);
    });

    // Manejar archivos soltados
    canvas.addEventListener('drop', this.handleDrop.bind(this), false);
  }

  preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  highlight(e) {
    const canvas = document.getElementById('canvas');
    canvas.classList.add('file-drop-zone');
  }

  unhighlight(e) {
    const canvas = document.getElementById('canvas');
    canvas.classList.remove('file-drop-zone');
  }

  /**
   * Maneja archivos soltados en el canvas
   */
  async handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;

    if (files.length > 0) {
      await this.processFiles(files);
    }
  }

  /**
   * Procesa múltiples archivos
   */
  async processFiles(files) {
    const fileArray = Array.from(files);

    for (const file of fileArray) {
      await this.processFile(file);
    }
  }

  /**
   * Procesa un archivo individual
   */
  async processFile(file) {
    const fileType = this.getFileType(file);

    try {
      switch (fileType) {
        case 'html':
          await this.loadHTMLFile(file);
          break;
        case 'css':
          await this.loadCSSFile(file);
          break;
        case 'js':
          await this.loadJSFile(file);
          break;
        case 'images':
          await this.loadImageFile(file);
          break;
        default:
          this.showError(`Tipo de archivo no soportado: ${file.name}`);
      }
    } catch (error) {
      this.showError(`Error al cargar ${file.name}: ${error.message}`);
    }
  }

  /**
   * Determina el tipo de archivo
   */
  getFileType(file) {
    const fileName = file.name.toLowerCase();
    const fileType = file.type.toLowerCase();

    for (const [type, patterns] of Object.entries(this.supportedTypes)) {
      if (
        patterns.some(pattern =>
          pattern.startsWith('.') ? fileName.endsWith(pattern) : fileType === pattern
        )
      ) {
        return type;
      }
    }
    return null;
  }

  /**
   * Carga archivo HTML
   */
  async loadHTMLFile(file) {
    const content = await this.readFileAsText(file);

    // Mostrar preview antes de cargar
    const shouldLoad = await this.showHTMLPreview(content, file.name);

    if (shouldLoad) {
      const htmlParser = new HTMLParser();
      await htmlParser.parseAndLoad(content);

      // Extraer componentes automáticamente
      if (window.componentExtractor) {
        const extractedComponents = window.componentExtractor.extractComponents(content);
        if (extractedComponents.length > 0) {
          const saved = window.componentExtractor.saveExtractedComponents();
          this.showSuccess(
            `Archivo HTML "${file.name}" cargado correctamente. ${saved} componentes extraídos.`
          );
        } else {
          this.showSuccess(`Archivo HTML "${file.name}" cargado correctamente`);
        }
      } else {
        this.showSuccess(`Archivo HTML "${file.name}" cargado correctamente`);
      }
    }
  }

  /**
   * Carga archivo CSS
   */
  async loadCSSFile(file) {
    const content = await this.readFileAsText(file);

    // Aplicar estilos CSS al documento
    const styleElement = document.createElement('style');
    styleElement.textContent = content;
    styleElement.setAttribute('data-source', file.name);
    document.head.appendChild(styleElement);

    this.showSuccess(`Estilos CSS de "${file.name}" aplicados`);
  }

  /**
   * Carga archivo JavaScript
   */
  async loadJSFile(file) {
    const content = await this.readFileAsText(file);

    // Mostrar advertencia antes de ejecutar JavaScript
    const shouldExecute = confirm(
      `¿Deseas ejecutar el código JavaScript de "${file.name}"?\n\n` +
        'ADVERTENCIA: Solo ejecuta código de fuentes confiables.'
    );

    if (shouldExecute) {
      try {
        // Crear script element
        const scriptElement = document.createElement('script');
        scriptElement.textContent = content;
        scriptElement.setAttribute('data-source', file.name);
        document.head.appendChild(scriptElement);

        this.showSuccess(`JavaScript de "${file.name}" ejecutado`);
      } catch (error) {
        this.showError(`Error al ejecutar JavaScript: ${error.message}`);
      }
    }
  }

  /**
   * Carga archivo de imagen
   */
  async loadImageFile(file) {
    const imageUrl = await this.readFileAsDataURL(file);

    // Crear elemento de imagen en el canvas
    const imgElement = document.createElement('img');
    imgElement.src = imageUrl;
    imgElement.alt = file.name;
    imgElement.style.maxWidth = '100%';
    imgElement.style.height = 'auto';

    // Aplicar clases y eventos del editor
    imgElement.id = 'element-' + window.elementIdCounter++;
    imgElement.classList.add('canvas-element');
    imgElement.setAttribute('data-component-type', 'img');

    // Agregar botón de eliminar
    const deleteBtn = document.createElement('div');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = '×';
    deleteBtn.onclick = function (e) {
      e.stopPropagation();
      window.deleteElement(imgElement);
    };
    imgElement.appendChild(deleteBtn);

    // Eventos
    imgElement.addEventListener('click', function (e) {
      e.stopPropagation();
      window.selectElement(imgElement);
    });

    imgElement.addEventListener('dblclick', function (e) {
      e.stopPropagation();
      window.makeElementEditable(imgElement);
    });

    // Agregar al canvas
    document.getElementById('canvas').appendChild(imgElement);

    this.showSuccess(`Imagen "${file.name}" agregada al canvas`);
  }

  /**
   * Muestra preview del HTML antes de cargar
   */
  async showHTMLPreview(content, fileName) {
    return new Promise(resolve => {
      const modal = this.createPreviewModal(content, fileName);
      document.body.appendChild(modal);

      const loadBtn = modal.querySelector('.load-btn');
      const cancelBtn = modal.querySelector('.cancel-btn');

      loadBtn.onclick = () => {
        modal.remove();
        resolve(true);
      };

      cancelBtn.onclick = () => {
        modal.remove();
        resolve(false);
      };
    });
  }

  /**
   * Crea modal de preview
   */
  createPreviewModal(content, fileName) {
    const modal = document.createElement('div');
    modal.className = 'file-preview-modal';
    modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Vista previa: ${fileName}</h3>
                    <button class="modal-close cancel-btn">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="preview-content">
                        <iframe srcdoc="${this.escapeHtml(content)}" style="width: 100%; height: 400px; border: 1px solid #e2e8f0;"></iframe>
                    </div>
                    <div class="preview-actions">
                        <button class="load-btn">Cargar archivo</button>
                        <button class="cancel-btn">Cancelar</button>
                    </div>
                </div>
            </div>
        `;
    return modal;
  }

  /**
   * Lee archivo como texto
   */
  readFileAsText(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => resolve(e.target.result);
      reader.onerror = e => reject(new Error('Error al leer archivo'));
      reader.readAsText(file);
    });
  }

  /**
   * Lee archivo como Data URL
   */
  readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => resolve(e.target.result);
      reader.onerror = e => reject(new Error('Error al leer archivo'));
      reader.readAsDataURL(file);
    });
  }

  /**
   * Escapa HTML para preview seguro
   */
  escapeHtml(html) {
    return html.replace(/"/g, '&quot;');
  }

  /**
   * Muestra mensaje de éxito
   */
  showSuccess(message) {
    if (window.showToast) {
      window.showToast(message);
    } else {
      console.log('SUCCESS:', message);
    }
  }

  /**
   * Muestra mensaje de error
   */
  showError(message) {
    if (window.showToast) {
      window.showToast(message);
    } else {
      console.error('ERROR:', message);
    }
    alert(message);
  }
}

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FileLoader;
}

// Exportar globalmente para compatibilidad
window.FileLoader = FileLoader;
