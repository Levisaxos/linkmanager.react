import { isValidUrl } from './videoUtils';

/**
 * Validate video form data
 * @param {Object} formData - Form data to validate
 * @param {Array} existingVideos - Existing videos to check for duplicates
 * @returns {Object} - Validation errors object
 */
export const validateVideoForm = (formData, existingVideos = []) => {
  const errors = {};

  // Validate title
  if (!formData.title?.trim()) {
    errors.title = 'Title is required';
  } else if (formData.title.trim().length > 100) {
    errors.title = 'Title must be 100 characters or less';
  }

  // Validate URL
  if (!formData.url?.trim()) {
    errors.url = 'URL is required';
  } else if (!isValidUrl(formData.url.trim())) {
    errors.url = 'Please enter a valid URL';
  } else {
    // Check for duplicate URLs
    const urlExists = existingVideos.some(video => 
      video.url.trim().toLowerCase() === formData.url.trim().toLowerCase()
    );
    if (urlExists) {
      errors.url = 'This URL has already been added';
    }
  }

  return errors;
};

/**
 * Validate tag data
 * @param {Object} tagData - Tag data to validate
 * @param {Array} existingTags - Existing tags to check for duplicates
 * @param {number} excludeId - ID to exclude from duplicate check (for editing)
 * @returns {string|null} - Error message or null if valid
 */
export const validateTag = (tagData, existingTags = [], excludeId = null) => {
  if (!tagData.name?.trim()) {
    return 'Tag name is required';
  }
  
  if (tagData.name.trim().length > 20) {
    return 'Tag name must be 20 characters or less';
  }

  if (tagData.name.trim().length < 2) {
    return 'Tag name must be at least 2 characters';
  }

  // Check for duplicate names
  const nameExists = existingTags.some(tag => 
    tag.name.toLowerCase() === tagData.name.trim().toLowerCase() && 
    tag.id !== excludeId
  );
  
  if (nameExists) {
    return 'Tag name already exists';
  }

  // Validate color
  if (!tagData.color || !tagData.color.match(/^#[0-9A-F]{6}$/i)) {
    return 'Please select a valid color';
  }

  return null;
};

/**
 * Sanitize user input
 * @param {string} input - Input to sanitize
 * @returns {string} - Sanitized input
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  return input.trim().replace(/[<>]/g, '');
};