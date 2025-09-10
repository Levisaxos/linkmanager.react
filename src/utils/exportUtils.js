/**
 * Export data to JSON file
 * @param {Object} data - Data to export (should contain videos and tags arrays)
 * @param {string} filename - Filename for the export
 */
export const exportToJSON = (data, filename = 'youtube-bookmarks.json') => {
  const exportData = {
    videos: data.videos || [],
    tags: data.tags || [],
    exportDate: new Date().toISOString(),
    version: '1.0',
    totalVideos: data.videos?.length || 0,
    totalTags: data.tags?.length || 0
  };
  
  const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
    type: 'application/json' 
  });
  
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Import data from JSON file
 * @param {File} file - JSON file to import
 * @returns {Promise<Object>} - Promise that resolves to imported data
 */
export const importFromJSON = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file provided'));
      return;
    }

    if (!file.name.toLowerCase().endsWith('.json')) {
      reject(new Error('Please select a JSON file'));
      return;
    }

    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        
        // Validate required structure
        if (!data.videos || !data.tags) {
          reject(new Error('Invalid file format. File must contain "videos" and "tags" arrays.'));
          return;
        }

        // Validate arrays
        if (!Array.isArray(data.videos)) {
          reject(new Error('Invalid file format. "videos" must be an array.'));
          return;
        }

        if (!Array.isArray(data.tags)) {
          reject(new Error('Invalid file format. "tags" must be an array.'));
          return;
        }

        // Validate video structure
        const invalidVideos = data.videos.filter(video => 
          !video.id || !video.title || !video.url || !video.dateAdded
        );

        if (invalidVideos.length > 0) {
          reject(new Error(`Found ${invalidVideos.length} videos with missing required fields (id, title, url, dateAdded).`));
          return;
        }

        // Validate tag structure
        const invalidTags = data.tags.filter(tag => 
          !tag.id || !tag.name || !tag.color
        );

        if (invalidTags.length > 0) {
          reject(new Error(`Found ${invalidTags.length} tags with missing required fields (id, name, color).`));
          return;
        }

        // Return clean data structure
        resolve({
          videos: data.videos,
          tags: data.tags,
          importDate: new Date().toISOString(),
          originalExportDate: data.exportDate || null,
          originalVersion: data.version || 'unknown'
        });

      } catch (error) {
        reject(new Error(`Failed to parse JSON file: ${error.message}`));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
};

/**
 * Create a backup of current data
 * @param {Object} data - Data to backup
 */
export const createBackup = (data) => {
  const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
  const filename = `youtube-bookmarks-backup-${timestamp}.json`;
  exportToJSON(data, filename);
};

/**
 * Save data to localStorage
 * @param {Array} videos - Videos array
 * @param {Array} tags - Tags array
 */
export const saveToLocalStorage = (videos, tags) => {
  try {
    localStorage.setItem('youtube-videos', JSON.stringify(videos));
    localStorage.setItem('youtube-tags', JSON.stringify(tags));
    localStorage.setItem('youtube-last-saved', new Date().toISOString());
    return true;
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
    return false;
  }
};

/**
 * Load data from localStorage
 * @returns {Object} - Object containing videos and tags arrays
 */
export const loadFromLocalStorage = () => {
  try {
    const videos = JSON.parse(localStorage.getItem('youtube-videos') || '[]');
    const tags = JSON.parse(localStorage.getItem('youtube-tags') || '[]');
    const lastSaved = localStorage.getItem('youtube-last-saved');
    
    return {
      videos,
      tags,
      lastSaved
    };
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return {
      videos: [],
      tags: [],
      lastSaved: null
    };
  }
};

/**
 * Clear all data from localStorage
 */
export const clearLocalStorage = () => {
  try {
    localStorage.removeItem('youtube-videos');
    localStorage.removeItem('youtube-tags');
    localStorage.removeItem('youtube-last-saved');
    return true;
  } catch (error) {
    console.error('Failed to clear localStorage:', error);
    return false;
  }
};

/**
 * Get localStorage usage information
 * @returns {Object} - Storage usage statistics
 */
export const getStorageInfo = () => {
  try {
    const videos = localStorage.getItem('youtube-videos') || '[]';
    const tags = localStorage.getItem('youtube-tags') || '[]';
    
    const videosSize = new Blob([videos]).size;
    const tagsSize = new Blob([tags]).size;
    const totalSize = videosSize + tagsSize;
    
    return {
      videosSize: formatBytes(videosSize),
      tagsSize: formatBytes(tagsSize),
      totalSize: formatBytes(totalSize),
      videosCount: JSON.parse(videos).length,
      tagsCount: JSON.parse(tags).length
    };
  } catch (error) {
    return {
      videosSize: '0 B',
      tagsSize: '0 B', 
      totalSize: '0 B',
      videosCount: 0,
      tagsCount: 0
    };
  }
};

/**
 * Format bytes to human readable string
 * @param {number} bytes - Number of bytes
 * @returns {string} - Formatted string
 */
const formatBytes = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Merge imported data with existing data
 * @param {Array} existingVideos - Current videos
 * @param {Array} existingTags - Current tags  
 * @param {Array} importedVideos - Videos to import
 * @param {Array} importedTags - Tags to import
 * @param {string} strategy - 'replace' or 'merge'
 * @returns {Object} - Merged data
 */
export const mergeData = (existingVideos, existingTags, importedVideos, importedTags, strategy = 'merge') => {
  if (strategy === 'replace') {
    return {
      videos: importedVideos,
      tags: importedTags
    };
  }

  // Merge strategy
  const mergedTags = [...existingTags];
  const mergedVideos = [...existingVideos];

  // Add tags that don't exist (by name)
  importedTags.forEach(importedTag => {
    const exists = mergedTags.some(tag => 
      tag.name.toLowerCase() === importedTag.name.toLowerCase()
    );
    if (!exists) {
      mergedTags.push({
        ...importedTag,
        id: Date.now() + Math.random() // Generate new ID to avoid conflicts
      });
    }
  });

  // Add videos that don't exist (by URL)
  importedVideos.forEach(importedVideo => {
    const exists = mergedVideos.some(video => video.url === importedVideo.url);
    if (!exists) {
      mergedVideos.push({
        ...importedVideo,
        id: Date.now() + Math.random() // Generate new ID to avoid conflicts
      });
    }
  });

  return {
    videos: mergedVideos,
    tags: mergedTags
  };
};