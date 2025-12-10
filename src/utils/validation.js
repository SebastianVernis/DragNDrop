/**
 * Validation Utilities Module
 * Provides input validation functions for various data types
 * @module utils/validation
 */

import { VALIDATION, ERROR_MESSAGES } from '../config/constants.js';

/**
 * Validates an element ID
 * @param {string} id - The ID to validate
 * @returns {Object} Validation result with isValid and error properties
 */
export function validateId(id) {
    if (typeof id !== 'string') {
        return { isValid: false, error: 'ID must be a string' };
    }

    if (id.length === 0) {
        return { isValid: false, error: 'ID cannot be empty' };
    }

    if (id.length > VALIDATION.ID_MAX_LENGTH) {
        return { isValid: false, error: `ID cannot exceed ${VALIDATION.ID_MAX_LENGTH} characters` };
    }

    if (!VALIDATION.ID_PATTERN.test(id)) {
        return { isValid: false, error: ERROR_MESSAGES.INVALID_ID };
    }

    return { isValid: true, error: null };
}

/**
 * Validates a CSS class name
 * @param {string} className - The class name to validate
 * @returns {Object} Validation result
 */
export function validateClassName(className) {
    if (typeof className !== 'string') {
        return { isValid: false, error: 'Class name must be a string' };
    }

    if (className.length === 0) {
        return { isValid: true, error: null }; // Empty is valid
    }

    if (className.length > VALIDATION.CLASS_MAX_LENGTH) {
        return { isValid: false, error: `Class name cannot exceed ${VALIDATION.CLASS_MAX_LENGTH} characters` };
    }

    // Split by spaces for multiple classes
    const classes = className.split(/\s+/);
    for (const cls of classes) {
        if (!VALIDATION.CLASS_PATTERN.test(cls)) {
            return { isValid: false, error: `${ERROR_MESSAGES.INVALID_CLASS}: ${cls}` };
        }
    }

    return { isValid: true, error: null };
}

/**
 * Validates a URL
 * @param {string} url - The URL to validate
 * @param {boolean} allowRelative - Whether to allow relative URLs
 * @returns {Object} Validation result
 */
export function validateURL(url, allowRelative = false) {
    if (typeof url !== 'string') {
        return { isValid: false, error: 'URL must be a string' };
    }

    if (url.length === 0) {
        return { isValid: false, error: 'URL cannot be empty' };
    }

    // Allow relative URLs if specified
    if (allowRelative && (url.startsWith('/') || url.startsWith('./'))) {
        return { isValid: true, error: null };
    }

    // Check for dangerous protocols
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.startsWith('javascript:') || lowerUrl.startsWith('data:')) {
        return { isValid: false, error: 'Dangerous URL protocol detected' };
    }

    // Try to parse as URL
    try {
        new URL(url);
        return { isValid: true, error: null };
    } catch (e) {
        // If not a valid absolute URL, check pattern
        if (VALIDATION.URL_PATTERN.test(url)) {
            return { isValid: true, error: null };
        }
        return { isValid: false, error: ERROR_MESSAGES.INVALID_URL };
    }
}

/**
 * Validates a color value
 * @param {string} color - The color to validate
 * @returns {Object} Validation result
 */
export function validateColor(color) {
    if (typeof color !== 'string') {
        return { isValid: false, error: 'Color must be a string' };
    }

    if (color.length === 0) {
        return { isValid: false, error: 'Color cannot be empty' };
    }

    // Check hex color
    if (VALIDATION.HEX_COLOR_PATTERN.test(color)) {
        return { isValid: true, error: null };
    }

    // Check RGB color
    if (VALIDATION.RGB_COLOR_PATTERN.test(color)) {
        return { isValid: true, error: null };
    }

    // Check RGBA color
    if (VALIDATION.RGBA_COLOR_PATTERN.test(color)) {
        return { isValid: true, error: null };
    }

    // Check named colors (basic list)
    const namedColors = [
        'black', 'white', 'red', 'green', 'blue', 'yellow', 'orange', 'purple',
        'pink', 'brown', 'gray', 'grey', 'transparent', 'currentColor'
    ];
    if (namedColors.includes(color.toLowerCase())) {
        return { isValid: true, error: null };
    }

    return { isValid: false, error: ERROR_MESSAGES.INVALID_COLOR };
}

/**
 * Validates a CSS dimension value
 * @param {string} dimension - The dimension to validate
 * @returns {Object} Validation result
 */
export function validateDimension(dimension) {
    if (typeof dimension !== 'string') {
        return { isValid: false, error: 'Dimension must be a string' };
    }

    if (dimension.length === 0) {
        return { isValid: false, error: 'Dimension cannot be empty' };
    }

    // Allow 'auto' and 'inherit'
    if (['auto', 'inherit', 'initial', 'unset'].includes(dimension.toLowerCase())) {
        return { isValid: true, error: null };
    }

    if (VALIDATION.DIMENSION_PATTERN.test(dimension)) {
        return { isValid: true, error: null };
    }

    return { isValid: false, error: ERROR_MESSAGES.INVALID_DIMENSION };
}

/**
 * Validates an integer
 * @param {string|number} value - The value to validate
 * @param {Object} options - Validation options
 * @param {number} options.min - Minimum value
 * @param {number} options.max - Maximum value
 * @returns {Object} Validation result
 */
export function validateInteger(value, options = {}) {
    const { min, max } = options;

    if (typeof value === 'number') {
        if (!Number.isInteger(value)) {
            return { isValid: false, error: 'Value must be an integer' };
        }
    } else if (typeof value === 'string') {
        if (!VALIDATION.INTEGER_PATTERN.test(value)) {
            return { isValid: false, error: 'Value must be an integer' };
        }
        value = parseInt(value, 10);
    } else {
        return { isValid: false, error: 'Value must be a number or string' };
    }

    if (min !== undefined && value < min) {
        return { isValid: false, error: `Value must be at least ${min}` };
    }

    if (max !== undefined && value > max) {
        return { isValid: false, error: `Value must be at most ${max}` };
    }

    return { isValid: true, error: null, value };
}

/**
 * Validates a float number
 * @param {string|number} value - The value to validate
 * @param {Object} options - Validation options
 * @param {number} options.min - Minimum value
 * @param {number} options.max - Maximum value
 * @returns {Object} Validation result
 */
export function validateFloat(value, options = {}) {
    const { min, max } = options;

    if (typeof value === 'number') {
        if (!isFinite(value)) {
            return { isValid: false, error: 'Value must be a finite number' };
        }
    } else if (typeof value === 'string') {
        if (!VALIDATION.FLOAT_PATTERN.test(value)) {
            return { isValid: false, error: 'Value must be a number' };
        }
        value = parseFloat(value);
    } else {
        return { isValid: false, error: 'Value must be a number or string' };
    }

    if (min !== undefined && value < min) {
        return { isValid: false, error: `Value must be at least ${min}` };
    }

    if (max !== undefined && value > max) {
        return { isValid: false, error: `Value must be at most ${max}` };
    }

    return { isValid: true, error: null, value };
}

/**
 * Validates a file
 * @param {File} file - The file to validate
 * @param {Object} options - Validation options
 * @param {Array<string>} options.allowedTypes - Allowed MIME types
 * @param {number} options.maxSize - Maximum file size in bytes
 * @returns {Object} Validation result
 */
export function validateFile(file, options = {}) {
    if (!(file instanceof File)) {
        return { isValid: false, error: 'Invalid file object' };
    }

    const { allowedTypes, maxSize } = options;

    // Check file type
    if (allowedTypes && allowedTypes.length > 0) {
        const fileType = file.type;
        const fileExt = '.' + file.name.split('.').pop().toLowerCase();
        
        const isTypeAllowed = allowedTypes.some(type => {
            if (type.startsWith('.')) {
                return fileExt === type;
            }
            return fileType === type || fileType.startsWith(type.split('/')[0] + '/');
        });

        if (!isTypeAllowed) {
            return { isValid: false, error: ERROR_MESSAGES.FILE_TYPE_NOT_SUPPORTED };
        }
    }

    // Check file size
    if (maxSize && file.size > maxSize) {
        const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(2);
        return { isValid: false, error: `${ERROR_MESSAGES.FILE_TOO_LARGE}: ${maxSizeMB}MB` };
    }

    return { isValid: true, error: null };
}

/**
 * Validates an email address
 * @param {string} email - The email to validate
 * @returns {Object} Validation result
 */
export function validateEmail(email) {
    if (typeof email !== 'string') {
        return { isValid: false, error: 'Email must be a string' };
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailPattern.test(email)) {
        return { isValid: false, error: 'Invalid email address' };
    }

    return { isValid: true, error: null };
}

/**
 * Validates a component type
 * @param {string} type - The component type to validate
 * @param {Array<string>} validTypes - Array of valid component types
 * @returns {Object} Validation result
 */
export function validateComponentType(type, validTypes) {
    if (typeof type !== 'string') {
        return { isValid: false, error: 'Component type must be a string' };
    }

    if (!validTypes.includes(type)) {
        return { isValid: false, error: `Invalid component type: ${type}` };
    }

    return { isValid: true, error: null };
}

/**
 * Validates an object against a schema
 * @param {Object} obj - The object to validate
 * @param {Object} schema - The validation schema
 * @returns {Object} Validation result with errors object
 */
export function validateObject(obj, schema) {
    const errors = {};
    let isValid = true;

    for (const [key, validator] of Object.entries(schema)) {
        const value = obj[key];
        const result = validator(value);

        if (!result.isValid) {
            errors[key] = result.error;
            isValid = false;
        }
    }

    return { isValid, errors };
}

/**
 * Sanitizes and validates user input
 * @param {string} input - The input to sanitize and validate
 * @param {Object} options - Validation options
 * @returns {Object} Validation result with sanitized value
 */
export function sanitizeAndValidate(input, options = {}) {
    const {
        maxLength = 1000,
        allowHTML = false,
        trim = true
    } = options;

    if (typeof input !== 'string') {
        return { isValid: false, error: 'Input must be a string', value: '' };
    }

    let sanitized = input;

    // Trim if requested
    if (trim) {
        sanitized = sanitized.trim();
    }

    // Check length
    if (sanitized.length > maxLength) {
        return { isValid: false, error: `Input exceeds maximum length of ${maxLength}`, value: sanitized };
    }

    // Remove HTML if not allowed
    if (!allowHTML) {
        sanitized = sanitized.replace(/<[^>]*>/g, '');
    }

    return { isValid: true, error: null, value: sanitized };
}

// Export all validation functions
export default {
    validateId,
    validateClassName,
    validateURL,
    validateColor,
    validateDimension,
    validateInteger,
    validateFloat,
    validateFile,
    validateEmail,
    validateComponentType,
    validateObject,
    sanitizeAndValidate
};
