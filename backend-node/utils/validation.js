/**
 * Input Validation Utilities
 * 
 * Validates API request data
 */

/**
 * Validate project data
 */
export function validateProject(data, isUpdate = false) {
  const errors = [];

  // Required fields for creation
  if (!isUpdate) {
    if (!data.name || typeof data.name !== 'string') {
      errors.push('name is required and must be a string');
    }
  }

  // Validate name length
  if (data.name && (data.name.length < 1 || data.name.length > 255)) {
    errors.push('name must be between 1 and 255 characters');
  }

  // Validate description
  if (data.description !== undefined && data.description !== null) {
    if (typeof data.description !== 'string') {
      errors.push('description must be a string');
    }
  }

  // Validate content fields
  const contentFields = ['htmlContent', 'cssContent', 'jsContent'];
  for (const field of contentFields) {
    if (data[field] !== undefined && typeof data[field] !== 'string') {
      errors.push(`${field} must be a string`);
    }
  }

  // Validate boolean fields
  if (data.isPublic !== undefined && typeof data.isPublic !== 'boolean') {
    errors.push('isPublic must be a boolean');
  }

  // Validate metadata
  if (data.metadata !== undefined) {
    if (typeof data.metadata !== 'object' || Array.isArray(data.metadata)) {
      errors.push('metadata must be an object');
    }
  }

  return {
    success: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  };
}

/**
 * Validate component data
 */
export function validateComponent(data, isUpdate = false) {
  const errors = [];

  // Required fields for creation
  if (!isUpdate) {
    if (!data.name || typeof data.name !== 'string') {
      errors.push('name is required and must be a string');
    }

    if (!data.category || typeof data.category !== 'string') {
      errors.push('category is required and must be a string');
    }

    if (!data.htmlContent || typeof data.htmlContent !== 'string') {
      errors.push('htmlContent is required and must be a string');
    }
  }

  // Validate name length
  if (data.name && (data.name.length < 1 || data.name.length > 255)) {
    errors.push('name must be between 1 and 255 characters');
  }

  // Validate category
  const validCategories = [
    'layout',
    'text',
    'media',
    'form',
    'ui',
    'advanced',
    'custom',
  ];

  if (data.category && !validCategories.includes(data.category)) {
    errors.push(`category must be one of: ${validCategories.join(', ')}`);
  }

  // Validate content fields
  const contentFields = ['htmlContent', 'cssContent', 'jsContent'];
  for (const field of contentFields) {
    if (data[field] !== undefined && typeof data[field] !== 'string') {
      errors.push(`${field} must be a string`);
    }
  }

  // Validate boolean fields
  if (data.isPublic !== undefined && typeof data.isPublic !== 'boolean') {
    errors.push('isPublic must be a boolean');
  }

  // Validate tags
  if (data.tags !== undefined) {
    if (!Array.isArray(data.tags)) {
      errors.push('tags must be an array');
    } else if (!data.tags.every(tag => typeof tag === 'string')) {
      errors.push('all tags must be strings');
    }
  }

  // Validate metadata
  if (data.metadata !== undefined) {
    if (typeof data.metadata !== 'object' || Array.isArray(data.metadata)) {
      errors.push('metadata must be an object');
    }
  }

  return {
    success: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  };
}

/**
 * Sanitize HTML to prevent XSS
 */
export function sanitizeHtml(html) {
  if (typeof html !== 'string') return '';

  // Basic XSS prevention - remove script tags and event handlers
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/on\w+\s*=\s*[^\s>]*/gi, '');
}

/**
 * Validate UUID format
 */
export function isValidUUID(uuid) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Validate email format
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export default {
  validateProject,
  validateComponent,
  sanitizeHtml,
  isValidUUID,
  isValidEmail,
};
