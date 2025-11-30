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

// Limpiar mocks después de cada test
afterEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});
