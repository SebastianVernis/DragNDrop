/**
 * HTML Sanitizer Module
 * Provides XSS protection by sanitizing user input before DOM insertion
 * @module utils/sanitizer
 */

/**
 * Sanitizes HTML string to prevent XSS attacks
 * @param {string} html - The HTML string to sanitize
 * @param {Object} options - Sanitization options
 * @param {boolean} options.allowStyles - Allow inline styles (default: true)
 * @param {boolean} options.allowScripts - Allow script tags (default: false)
 * @param {Array<string>} options.allowedTags - Whitelist of allowed tags
 * @returns {string} Sanitized HTML string
 */
function sanitizeHTML(html, options = {}) {
    const {
        allowStyles = true,
        allowScripts = false,
        allowedTags = [
            'div', 'span', 'p', 'a', 'img', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'ul', 'ol', 'li', 'table', 'thead', 'tbody', 'tr', 'td', 'th',
            'button', 'input', 'textarea', 'select', 'option', 'label', 'form',
            'nav', 'header', 'footer', 'section', 'article', 'aside', 'main',
            'strong', 'em', 'b', 'i', 'u', 'br', 'hr', 'video', 'audio', 'iframe'
        ]
    } = options;

    if (typeof html !== 'string') {
        console.warn('sanitizeHTML: Input is not a string', typeof html);
        return '';
    }

    // Create a temporary DOM element to parse HTML
    const temp = document.createElement('div');
    temp.innerHTML = html;

    // Recursively sanitize all elements
    sanitizeNode(temp, { allowStyles, allowScripts, allowedTags });

    return temp.innerHTML;
}

/**
 * Recursively sanitizes a DOM node and its children
 * @param {Node} node - The DOM node to sanitize
 * @param {Object} options - Sanitization options
 * @private
 */
function sanitizeNode(node, options) {
    const { allowStyles, allowScripts, allowedTags } = options;

    // Process all child nodes
    Array.from(node.childNodes).forEach(child => {
        if (child.nodeType === Node.ELEMENT_NODE) {
            const tagName = child.tagName.toLowerCase();

            // Remove script tags unless explicitly allowed
            if (tagName === 'script' && !allowScripts) {
                child.remove();
                return;
            }

            // Remove disallowed tags
            if (!allowedTags.includes(tagName)) {
                console.warn(`Removing disallowed tag: ${tagName}`);
                child.remove();
                return;
            }

            // Sanitize attributes
            sanitizeAttributes(child, allowStyles);

            // Recursively sanitize children
            sanitizeNode(child, options);
        } else if (child.nodeType === Node.TEXT_NODE) {
            // Text nodes are safe, but we can escape special characters if needed
            // For now, we keep them as-is since they're already text
        } else {
            // Remove other node types (comments, etc.)
            child.remove();
        }
    });
}

/**
 * Sanitizes element attributes to prevent XSS
 * @param {Element} element - The element to sanitize
 * @param {boolean} allowStyles - Whether to allow style attributes
 * @private
 */
function sanitizeAttributes(element, allowStyles) {
    const dangerousAttributes = [
        'onerror', 'onload', 'onclick', 'onmouseover', 'onmouseout',
        'onmousemove', 'onmousedown', 'onmouseup', 'onfocus', 'onblur',
        'onchange', 'onsubmit', 'onkeydown', 'onkeyup', 'onkeypress'
    ];

    const allowedAttributes = [
        'id', 'class', 'href', 'src', 'alt', 'title', 'width', 'height',
        'type', 'name', 'value', 'placeholder', 'data-*', 'aria-*'
    ];

    if (allowStyles) {
        allowedAttributes.push('style');
    }

    // Get all attributes
    const attributes = Array.from(element.attributes);

    attributes.forEach(attr => {
        const attrName = attr.name.toLowerCase();

        // Remove dangerous event handlers
        if (dangerousAttributes.includes(attrName)) {
            element.removeAttribute(attrName);
            console.warn(`Removed dangerous attribute: ${attrName}`);
            return;
        }

        // Check for javascript: protocol in href/src
        if ((attrName === 'href' || attrName === 'src') && attr.value) {
            const value = attr.value.toLowerCase().trim();
            if (value.startsWith('javascript:') || value.startsWith('data:text/html')) {
                element.removeAttribute(attrName);
                console.warn(`Removed dangerous ${attrName}: ${attr.value}`);
                return;
            }
        }

        // Allow data-* and aria-* attributes
        if (attrName.startsWith('data-') || attrName.startsWith('aria-')) {
            return;
        }

        // Check if attribute is in allowed list
        if (!allowedAttributes.includes(attrName)) {
            element.removeAttribute(attrName);
        }
    });
}

/**
 * Escapes HTML special characters to prevent XSS
 * @param {string} text - The text to escape
 * @returns {string} Escaped text safe for HTML insertion
 */
function escapeHTML(text) {
    if (typeof text !== 'string') {
        return '';
    }

    const escapeMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '/': '&#x2F;'
    };

    return text.replace(/[&<>"'/]/g, char => escapeMap[char]);
}

/**
 * Unescapes HTML entities back to characters
 * @param {string} text - The text to unescape
 * @returns {string} Unescaped text
 */
function unescapeHTML(text) {
    if (typeof text !== 'string') {
        return '';
    }

    const temp = document.createElement('div');
    temp.innerHTML = text;
    return temp.textContent || temp.innerText || '';
}

/**
 * Sanitizes a URL to prevent XSS and ensure it's safe
 * @param {string} url - The URL to sanitize
 * @param {Array<string>} allowedProtocols - Allowed URL protocols
 * @returns {string} Sanitized URL or empty string if invalid
 */
function sanitizeURL(url, allowedProtocols = ['http:', 'https:', 'mailto:', 'tel:']) {
    if (typeof url !== 'string') {
        return '';
    }

    try {
        const urlObj = new URL(url, window.location.origin);
        
        if (!allowedProtocols.includes(urlObj.protocol)) {
            console.warn(`Blocked URL with disallowed protocol: ${urlObj.protocol}`);
            return '';
        }

        return urlObj.href;
    } catch (error) {
        console.warn('Invalid URL:', url, error);
        return '';
    }
}

/**
 * Safely sets innerHTML with sanitization
 * @param {Element} element - The element to set innerHTML on
 * @param {string} html - The HTML content to set
 * @param {Object} options - Sanitization options
 */
function safeSetInnerHTML(element, html, options = {}) {
    if (!element || !(element instanceof Element)) {
        console.error('safeSetInnerHTML: Invalid element');
        return;
    }

    const sanitized = sanitizeHTML(html, options);
    element.innerHTML = sanitized;
}

/**
 * Safely creates an element with sanitized content
 * @param {string} tagName - The tag name for the element
 * @param {Object} attributes - Attributes to set on the element
 * @param {string} content - Text or HTML content
 * @returns {Element} The created element
 */
function safeCreateElement(tagName, attributes = {}, content = '') {
    const element = document.createElement(tagName);

    // Set attributes safely
    Object.entries(attributes).forEach(([key, value]) => {
        if (key === 'style' && typeof value === 'object') {
            Object.assign(element.style, value);
        } else if (key.startsWith('on')) {
            // Don't allow event handlers as attributes
            console.warn(`Blocked event handler attribute: ${key}`);
        } else {
            element.setAttribute(key, String(value));
        }
    });

    // Set content safely
    if (content) {
        if (attributes.allowHTML) {
            safeSetInnerHTML(element, content);
        } else {
            element.textContent = content;
        }
    }

    return element;
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        sanitizeHTML,
        escapeHTML,
        unescapeHTML,
        sanitizeURL,
        safeSetInnerHTML,
        safeCreateElement
    };
}

// Make available globally for browser usage
if (typeof window !== 'undefined') {
    window.Sanitizer = {
        sanitizeHTML,
        escapeHTML,
        unescapeHTML,
        sanitizeURL,
        safeSetInnerHTML,
        safeCreateElement
    };
}
