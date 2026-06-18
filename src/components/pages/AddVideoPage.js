import React, { useState, useEffect, useCallback } from 'react';
import { validateVideoForm } from '../../utils/validation';
import { generateDefaultTitle, isValidYouTubeUrl } from '../../utils/videoUtils';
import { compressImageFile, validateImageFile } from '../../utils/imageUtils';

const EMPTY_FORM = { title: '', url: '', tagIds: [], screenshot: '' };

const AddVideoPage = ({ addVideo, videos, tags }) => {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  // Handle URL change with auto-title generation
  const handleUrlChange = (url) => {
    setFormData(prev => ({ ...prev, url }));
    
    // Auto-generate title if URL is valid YouTube URL and title is empty
    if (url && !formData.title && isValidYouTubeUrl(url)) {
      setFormData(prev => ({ 
        ...prev, 
        title: generateDefaultTitle(url)
      }));
    }
    
    // Clear URL errors when user types
    if (errors.url) {
      setErrors(prev => ({ ...prev, url: '' }));
    }
  };

  // Validate, compress, then store an image file as a data URL.
  // Shared by file upload, the clipboard button, and Ctrl+V paste.
  const processScreenshotFile = useCallback(async (file) => {
    const validationError = validateImageFile(file);
    if (validationError) {
      setErrors(prev => ({ ...prev, screenshot: validationError }));
      return;
    }

    setErrors(prev => ({ ...prev, screenshot: '' }));
    setIsProcessingImage(true);
    try {
      const screenshot = await compressImageFile(file);
      setFormData(prev => ({ ...prev, screenshot }));
    } catch (error) {
      console.error('Error processing screenshot:', error);
      setErrors(prev => ({ ...prev, screenshot: 'Failed to process image. Try another file.' }));
    } finally {
      setIsProcessingImage(false);
    }
  }, []);

  // Handle screenshot upload from the file picker
  const handleScreenshotChange = (e) => {
    const file = e.target.files[0];
    e.target.value = ''; // allow re-selecting the same file later
    if (file) processScreenshotFile(file);
  };

  // Read an image directly from the clipboard (via the "Paste" button)
  const handlePasteFromClipboard = async () => {
    if (!navigator.clipboard?.read) {
      setErrors(prev => ({
        ...prev,
        screenshot: 'Clipboard paste is not supported here. Press Ctrl+V or upload a file instead.'
      }));
      return;
    }

    try {
      const items = await navigator.clipboard.read();
      for (const item of items) {
        const imageType = item.types.find(type => type.startsWith('image/'));
        if (imageType) {
          const blob = await item.getType(imageType);
          await processScreenshotFile(new File([blob], 'pasted-screenshot', { type: blob.type }));
          return;
        }
      }
      setErrors(prev => ({ ...prev, screenshot: 'No image found on the clipboard. Copy an image first.' }));
    } catch (error) {
      console.error('Error reading clipboard:', error);
      setErrors(prev => ({
        ...prev,
        screenshot: 'Could not read the clipboard. Your browser may have blocked access — try Ctrl+V instead.'
      }));
    }
  };

  // Support pasting an image with Ctrl+V anywhere on this page
  useEffect(() => {
    const onPaste = (e) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) {
            e.preventDefault();
            processScreenshotFile(file);
          }
          return;
        }
      }
    };
    document.addEventListener('paste', onPaste);
    return () => document.removeEventListener('paste', onPaste);
  }, [processScreenshotFile]);

  const removeScreenshot = () => {
    setFormData(prev => ({ ...prev, screenshot: '' }));
    setErrors(prev => ({ ...prev, screenshot: '' }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage('');

    try {
      // Validate form
      const validationErrors = validateVideoForm(formData, videos);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      // Add video
      const newVideo = addVideo({
        title: formData.title.trim(),
        url: formData.url.trim(),
        tagIds: formData.tagIds,
        screenshot: formData.screenshot
      });

      // Reset form
      setFormData(EMPTY_FORM);
      setErrors({});
      setSuccessMessage(`"${newVideo.title}" has been added to your collection!`);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);

    } catch (error) {
      console.error('Error adding video:', error);
      setErrors({ submit: 'Failed to add video. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle tag selection
  const toggleTag = (tagId) => {
    setFormData(prev => ({
      ...prev,
      tagIds: prev.tagIds.includes(tagId)
        ? prev.tagIds.filter(id => id !== tagId)
        : [...prev.tagIds, tagId]
    }));
  };

  // Clear form
  const clearForm = () => {
    setFormData(EMPTY_FORM);
    setErrors({});
    setSuccessMessage('');
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-100">Add New Video</h1>
          <span className="px-2 py-1 bg-green-600 text-white rounded-lg text-sm font-semibold">
            Quest
          </span>
        </div>
        <p className="text-slate-400">
          Expand your collection with a new YouTube video
        </p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-600/20 border border-green-500/50 rounded-lg">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-green-400 font-medium">{successMessage}</span>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-slate-700 border border-slate-600 rounded-lg p-6">
          {/* URL Field */}
          <div className="mb-6">
            <label htmlFor="url" className="block text-sm font-medium text-slate-300 mb-2">
              YouTube URL *
            </label>
            <div className="relative">
              <input
                type="url"
                id="url"
                value={formData.url}
                onChange={(e) => handleUrlChange(e.target.value)}
                className={`w-full px-4 py-3 bg-slate-800 border rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.url ? 'border-red-500 focus:ring-red-500' : 'border-slate-600'
                }`}
                placeholder="https://www.youtube.com/watch?v=..."
              />
              {isValidYouTubeUrl(formData.url) && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              )}
            </div>
            {errors.url && (
              <p className="mt-2 text-sm text-red-400 flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{errors.url}</span>
              </p>
            )}
          </div>

          {/* Title Field */}
          <div className="mb-6">
            <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-2">
              Video Title *
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className={`w-full px-4 py-3 bg-slate-800 border rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.title ? 'border-red-500 focus:ring-red-500' : 'border-slate-600'
              }`}
              placeholder="Enter a descriptive title for the video"
              maxLength={100}
            />
            <div className="flex justify-between mt-1">
              {errors.title ? (
                <p className="text-sm text-red-400 flex items-center space-x-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{errors.title}</span>
                </p>
              ) : (
                <span></span>
              )}
              <span className="text-xs text-slate-400">
                {formData.title.length}/100
              </span>
            </div>
          </div>

          {/* Screenshot Field */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Screenshot (optional)
            </label>

            {formData.screenshot ? (
              <div className="relative inline-block">
                <img
                  src={formData.screenshot}
                  alt="Screenshot preview"
                  className="rounded-lg border border-slate-600 max-h-48 object-contain bg-slate-800"
                />
                <button
                  type="button"
                  onClick={removeScreenshot}
                  className="absolute top-2 right-2 p-1.5 bg-slate-900/80 hover:bg-red-600 text-white rounded-lg transition-all duration-200"
                  title="Remove screenshot"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
              <label
                className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg transition-all duration-200 ${
                  isProcessingImage
                    ? 'border-slate-600 cursor-wait'
                    : 'border-slate-600 hover:border-blue-500 cursor-pointer bg-slate-800/50'
                }`}
              >
                {isProcessingImage ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400 mb-2"></div>
                    <span className="text-sm text-slate-400">Processing image...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-8 h-8 text-slate-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm text-slate-300">Click to upload a screenshot</span>
                    <span className="text-xs text-slate-500 mt-1">PNG, JPG or WEBP — resized automatically</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleScreenshotChange}
                  disabled={isProcessingImage}
                  className="hidden"
                />
              </label>

              <div className="flex items-center justify-center space-x-3">
                <button
                  type="button"
                  onClick={handlePasteFromClipboard}
                  disabled={isProcessingImage}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-slate-200 border border-slate-600 rounded-lg transition-all duration-200 flex items-center space-x-2 text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  <span>Paste from clipboard</span>
                </button>
                <span className="text-xs text-slate-500">or press Ctrl+V</span>
              </div>
              </div>
            )}

            {errors.screenshot && (
              <p className="mt-2 text-sm text-red-400 flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{errors.screenshot}</span>
              </p>
            )}
          </div>

          {/* Tags Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">
              Tags (optional)
            </label>
            {tags.length > 0 ? (
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggleTag(tag.id)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border flex items-center space-x-2 ${
                        formData.tagIds.includes(tag.id)
                          ? 'border-blue-400 shadow-lg shadow-blue-400/20 text-white'
                          : 'border-slate-600 text-slate-300 hover:border-slate-500'
                      }`}
                      style={formData.tagIds.includes(tag.id) ? { 
                        backgroundColor: tag.color,
                        borderColor: tag.color 
                      } : { backgroundColor: 'rgb(51 65 85)' }}
                    >
                      <span>{tag.name}</span>
                      {formData.tagIds.includes(tag.id) ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
                {formData.tagIds.length > 0 && (
                  <p className="text-sm text-slate-400 flex items-center space-x-2">
                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <span>{formData.tagIds.length} tag(s) selected</span>
                  </p>
                )}
              </div>
            ) : (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <p className="text-yellow-400 text-sm">
                    No tags available. Create tags in the Tags section to organize your videos.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Submit Errors */}
        {errors.submit && (
          <div className="bg-red-600/20 border border-red-500/50 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-400">{errors.submit}</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={clearForm}
            className="px-6 py-3 text-slate-300 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-lg transition-all duration-200 flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span>Clear</span>
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting || isProcessingImage}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-blue-500/25"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Adding...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Add Video</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Tips Section */}
      <div className="mt-8 bg-blue-600/10 border border-blue-500/30 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-400 mb-3 flex items-center space-x-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Pro Tips</span>
        </h3>
        <ul className="text-sm text-blue-300 space-y-2">
          <li className="flex items-start space-x-2">
            <span className="text-blue-400 mt-0.5">•</span>
            <span>You can paste any YouTube URL format (watch, short URL, embed, etc.)</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-400 mt-0.5">•</span>
            <span>Use descriptive titles to make videos easier to find later</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-400 mt-0.5">•</span>
            <span>Add relevant tags to organize and filter your videos effectively</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-400 mt-0.5">•</span>
            <span>The click counter will automatically track how often you visit each video</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AddVideoPage;