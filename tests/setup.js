/**
 * Jest Setup File
 * Configuración global para todos los tests
 */

// Mock de localStorage
const localStorageMock = (() => {
  let store = {};

  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock de showToast global
window.showToast = jest.fn();

// Mock DataTransfer para drag & drop
class DataTransfer {
  constructor() {
    this.data = {};
    this.dropEffect = 'none';
    this.effectAllowed = 'all';
    this.files = [];
    this.items = [];
    this.types = [];
  }

  setData(format, data) {
    this.data[format] = data;
    if (!this.types.includes(format)) {
      this.types.push(format);
    }
  }

  getData(format) {
    return this.data[format] || '';
  }

  clearData(format) {
    if (format) {
      delete this.data[format];
      this.types = this.types.filter(t => t !== format);
    } else {
      this.data = {};
      this.types = [];
    }
  }
}

global.DataTransfer = DataTransfer;

// Utilidad para crear eventos mock
global.createMockEvent = (type) => {
  return new Event(type, { bubbles: true, cancelable: true });
};

// Utilidad waitFor para tests asíncronos
global.waitFor = (callback, options = {}) => {
  const { timeout = 1000, interval = 50 } = options;
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    const check = () => {
      try {
        const result = callback();
        if (result) {
          resolve(result);
          return;
        }
      } catch (error) {
        // Continuar intentando
      }
      
      if (Date.now() - startTime >= timeout) {
        reject(new Error('waitFor timeout exceeded'));
        return;
      }
      
      setTimeout(check, interval);
    };
    
    check();
  });
};

// Limpiar mocks después de cada test
afterEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});
