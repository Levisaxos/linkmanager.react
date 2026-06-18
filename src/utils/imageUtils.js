/**
 * Image helpers for uploading a screenshot alongside a video.
 *
 * Screenshots are stored as compressed JPEG data URLs directly on the video
 * object. That keeps them in localStorage and lets them ride along with the
 * JSON export/import for free. To avoid blowing the ~5MB localStorage quota,
 * every upload is resized and re-encoded before it is stored.
 */

// Reject obviously-too-large uploads before we even try to process them.
const MAX_UPLOAD_BYTES = 15 * 1024 * 1024; // 15 MB

/**
 * Validate a user-selected image file.
 * @param {File} file
 * @returns {string|null} - Error message, or null if the file is acceptable.
 */
export const validateImageFile = (file) => {
  if (!file) return 'No file selected';
  if (!file.type.startsWith('image/')) {
    return 'Please select an image file (PNG, JPG, WEBP, etc.)';
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return 'Image is too large (max 15 MB). Try a smaller screenshot.';
  }
  return null;
};

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = src;
  });

/**
 * Resize + compress an image file into a small JPEG data URL suitable for
 * localStorage and JSON export. Aspect ratio is preserved within the given
 * bounds; images smaller than the bounds are never upscaled.
 *
 * @param {File} file
 * @param {Object} [opts]
 * @param {number} [opts.maxWidth=640]
 * @param {number} [opts.maxHeight=640]
 * @param {number} [opts.quality=0.75]
 * @returns {Promise<string>} - A `data:image/jpeg;base64,...` string.
 */
export const compressImageFile = async (
  file,
  { maxWidth = 640, maxHeight = 640, quality = 0.75 } = {}
) => {
  const dataUrl = await readFileAsDataUrl(file);
  const img = await loadImage(dataUrl);

  const ratio = Math.min(maxWidth / img.width, maxHeight / img.height, 1);
  const width = Math.max(1, Math.round(img.width * ratio));
  const height = Math.max(1, Math.round(img.height * ratio));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  // Flatten onto white so transparent PNGs don't turn black as JPEG.
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(img, 0, 0, width, height);

  return canvas.toDataURL('image/jpeg', quality);
};
