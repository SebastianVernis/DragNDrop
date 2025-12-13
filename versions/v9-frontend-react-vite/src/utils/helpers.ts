/**
 * Utility helper functions
 */

import { v4 as uuidv4 } from 'uuid';
import type { ElementNode, ElementStyle } from '@/types';

/**
 * Generate a unique ID
 */
export function generateUniqueId(): string {
  return uuidv4();
}

/**
 * Generate a simple unique ID with prefix
 */
export function generateSimpleId(prefix: string = 'element'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Debounce function calls
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function calls
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Deep clone an object
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T;
  }

  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as unknown as T;
  }

  if (typeof obj === 'object') {
    const clonedObj = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }

  return obj;
}

/**
 * Convert camelCase to kebab-case
 */
export function camelToKebab(str: string): string {
  return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Convert kebab-case to camelCase
 */
export function kebabToCamel(str: string): string {
  return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Format file size in human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Download a file with given content
 */
export function downloadFile(content: string, filename: string, mimeType: string = 'text/plain'): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Read file as text
 */
export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = (e) => reject(e);
    reader.readAsText(file);
  });
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Escape HTML characters
 */
export function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Unescape HTML characters
 */
export function unescapeHtml(html: string): string {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
}

/**
 * Convert CSS style object to string
 */
export function styleObjectToString(styles: ElementStyle): string {
  return Object.entries(styles)
    .filter(([_, value]) => value !== undefined && value !== '')
    .map(([property, value]) => `${camelToKebab(property)}: ${value}`)
    .join('; ');
}

/**
 * Convert CSS string to style object
 */
export function styleStringToObject(styleString: string): ElementStyle {
  const styles: ElementStyle = {};
  
  if (!styleString) return styles;
  
  styleString.split(';').forEach(rule => {
    const [property, value] = rule.split(':').map(s => s.trim());
    if (property && value) {
      styles[kebabToCamel(property)] = value;
    }
  });
  
  return styles;
}

/**
 * Get element's computed styles
 */
export function getElementStyles(element: HTMLElement): ElementStyle {
  const computedStyle = window.getComputedStyle(element);
  const styles: ElementStyle = {};
  
  // Common CSS properties to extract
  const properties = [
    'width', 'height', 'minWidth', 'minHeight', 'maxWidth', 'maxHeight',
    'padding', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
    'margin', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft',
    'border', 'borderWidth', 'borderStyle', 'borderColor', 'borderRadius',
    'backgroundColor', 'color', 'fontSize', 'fontWeight', 'fontFamily',
    'textAlign', 'lineHeight', 'letterSpacing',
    'display', 'position', 'top', 'right', 'bottom', 'left', 'zIndex',
    'flexDirection', 'justifyContent', 'alignItems', 'flexWrap', 'gap',
    'gridTemplateColumns', 'gridTemplateRows', 'gridGap',
    'opacity', 'transform', 'transition', 'boxShadow'
  ];
  
  properties.forEach(prop => {
    const value = computedStyle.getPropertyValue(camelToKebab(prop));
    if (value && value !== 'auto' && value !== 'normal' && value !== 'initial') {
      styles[prop] = value;
    }
  });
  
  return styles;
}

/**
 * Show toast notification
 */
export function showToast(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info'): void {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  
  // Toast styles
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 20px;
    border-radius: 6px;
    color: white;
    font-weight: 500;
    z-index: 10000;
    animation: slideInRight 0.3s ease;
    max-width: 300px;
    word-wrap: break-word;
  `;
  
  // Type-specific colors
  const colors = {
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6'
  };
  
  toast.style.backgroundColor = colors[type];
  
  document.body.appendChild(toast);
  
  // Auto remove after 3 seconds
  setTimeout(() => {
    toast.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 3000);
}

/**
 * Add CSS animations if not already present
 */
export function addToastAnimations(): void {
  if (document.getElementById('toast-animations')) return;
  
  const style = document.createElement('style');
  style.id = 'toast-animations';
  style.textContent = `
    @keyframes slideInRight {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes slideOutRight {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
  `;
  
  document.head.appendChild(style);
}

/**
 * Initialize toast animations on page load
 */
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addToastAnimations);
  } else {
    addToastAnimations();
  }
}

/**
 * Convert element tree to HTML string
 */
export function elementTreeToHtml(elements: ElementNode[]): string {
  return elements.map(element => elementNodeToHtml(element)).join('\n');
}

/**
 * Convert single element node to HTML string
 */
export function elementNodeToHtml(element: ElementNode): string {
  const { tagName, textContent, innerHTML, style, attributes, children } = element;
  
  // Build attributes string
  const attrs = Object.entries(attributes)
    .filter(([key, value]) => value !== undefined)
    .map(([key, value]) => `${key}="${escapeHtml(String(value))}"`)
    .join(' ');
  
  // Build style string
  const styleStr = styleObjectToString(style);
  const styleAttr = styleStr ? ` style="${styleStr}"` : '';
  
  // Build opening tag
  const openTag = `<${tagName}${attrs ? ' ' + attrs : ''}${styleAttr}>`;
  
  // Handle self-closing tags
  const selfClosingTags = ['img', 'input', 'br', 'hr', 'meta', 'link'];
  if (selfClosingTags.includes(tagName)) {
    return openTag.replace('>', ' />');
  }
  
  // Build content
  let content = '';
  if (innerHTML) {
    content = innerHTML;
  } else if (textContent) {
    content = escapeHtml(textContent);
  } else if (children.length > 0) {
    content = children.map(child => elementNodeToHtml(child)).join('\n');
  }
  
  // Build closing tag
  const closeTag = `</${tagName}>`;
  
  return `${openTag}${content}${closeTag}`;
}

/**
 * Generate CSS from element tree
 */
export function generateCssFromElements(elements: ElementNode[]): string {
  const cssRules: string[] = [];
  
  function extractCss(element: ElementNode) {
    if (element.id && Object.keys(element.style).length > 0) {
      const selector = `#${element.id}`;
      const rules = styleObjectToString(element.style);
      if (rules) {
        cssRules.push(`${selector} {\n  ${rules.replace(/; /g, ';\n  ')};\n}`);
      }
    }
    
    element.children.forEach(child => extractCss(child));
  }
  
  elements.forEach(element => extractCss(element));
  
  return cssRules.join('\n\n');
}