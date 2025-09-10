import React, { useState } from 'react';
import Navigation from './Navigation';
import VideosPage from '../pages/VideosPage';
import AddVideoPage from '../pages/AddVideoPage';
import TagsPage from '../pages/TagsPage';
import { useVideos } from '../../hooks/useVideos';
import { useTags } from '../../hooks/useTags';
import { exportToJSON, importFromJSON } from '../../utils/exportUtils';
import { ROUTES } from '../../constants/routes';

const MainLayout = () => {
  const [currentPage, setCurrentPage] = useState(ROUTES.VIDEOS);
  const { videos, addVideo, updateVideo, deleteVideo, setVideos } = useVideos();
  const { tags, addTag, updateTag, deleteTag, setTags } = useTags();

  // Export data
  const handleExport = () => {
    const data = { videos, tags };
    exportToJSON(data);
  };

  // Import data
  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    try {
      const importedData = await importFromJSON(file);
      
      // Ask user about merge strategy
      const shouldReplace = window.confirm(
        `Found ${importedData.videos.length} videos and ${importedData.tags.length} tags.\n\n` +
        'Click OK to REPLACE all current data, or Cancel to MERGE with existing data.'
      );
      
      if (shouldReplace) {
        // Replace all data
        setVideos(importedData.videos);
        setTags(importedData.tags);
        alert('Data replaced successfully!');
      } else {
        // Merge data
        const { mergeData } = await import('../../utils/exportUtils');
        const merged = mergeData(videos, tags, importedData.videos, importedData.tags, 'merge');
        setVideos(merged.videos);
        setTags(merged.tags);
        alert(`Data merged successfully! Added ${merged.videos.length - videos.length} new videos and ${merged.tags.length - tags.length} new tags.`);
      }
      
    } catch (error) {
      alert(`Import failed: ${error.message}`);
    }
    
    // Reset file input
    event.target.value = '';
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case ROUTES.VIDEOS:
        return (
          <VideosPage 
            videos={videos} 
            updateVideo={updateVideo}
            deleteVideo={deleteVideo}
            tags={tags} 
          />
        );
      case ROUTES.ADD_VIDEO:
        return (
          <AddVideoPage 
            addVideo={addVideo}
            videos={videos}
            tags={tags} 
          />
        );
      case ROUTES.TAGS:
        return (
          <TagsPage 
            tags={tags}
            addTag={addTag}
            updateTag={updateTag}
            deleteTag={deleteTag}
          />
        );
      default:
        return (
          <VideosPage 
            videos={videos} 
            updateVideo={updateVideo}
            deleteVideo={deleteVideo}
            tags={tags} 
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header with PoE2 styling */}
      <header className="bg-slate-800 border-b border-slate-700 shadow-xl">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">YT</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-100">
                  YouTube Bookmark Manager
                </h1>
                <p className="text-sm text-slate-400">
                  Track your favorite videos with tags and click counters
                </p>
              </div>
            </div>

            {/* Export/Import buttons */}
            <div className="flex items-center space-x-3">
              <button
                onClick={handleExport}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg border border-slate-600 transition-all duration-200 flex items-center space-x-2 text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Export</span>
              </button>
              
              <label className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg border border-blue-500 transition-all duration-200 flex items-center space-x-2 text-sm cursor-pointer">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span>Import</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <Navigation 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage}
        videos={videos}
        tags={tags}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-2xl overflow-hidden">
          {renderCurrentPage()}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 border-t border-slate-700 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between text-sm text-slate-400">
            <span>YouTube Bookmark Manager</span>
            <span>{videos.length} videos • {tags.length} tags</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;