/**
 * Extract video ID from YouTube URL
 * @param {string} url - YouTube URL
 * @returns {string|null} - Video ID or null if not found
 */
export const extractVideoId = (url) => {
  const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
  const match = url.match(youtubeRegex);
  return match ? match[1] : null;
};

/**
 * Generate a default title for a YouTube video
 * @param {string} url - YouTube URL
 * @returns {string} - Generated title
 */
export const generateDefaultTitle = (url) => {
  const videoId = extractVideoId(url);
  if (videoId) {
    return `YouTube Video - ${videoId}`;
  }
  return 'YouTube Video';
};

/**
 * Validate if URL is a valid YouTube URL
 * @param {string} url - URL to validate
 * @returns {boolean} - True if valid YouTube URL
 */
export const isValidYouTubeUrl = (url) => {
  return extractVideoId(url) !== null;
};

/**
 * Check if URL is a valid HTTP/HTTPS URL
 * @param {string} url - URL to validate
 * @returns {boolean} - True if valid URL
 */
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return url.match(/^https?:\/\/.+/) !== null;
  } catch {
    return false;
  }
};

/**
 * Generate thumbnail URL for YouTube video
 * @param {string} url - YouTube URL
 * @returns {string|null} - Thumbnail URL or null
 */
export const getYouTubeThumbnail = (url) => {
  const videoId = extractVideoId(url);
  if (videoId) {
    return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
  }
  return null;
};