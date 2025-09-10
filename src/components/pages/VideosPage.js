import React, { useState, useMemo } from 'react';
import VideoList from '../videoComponents/VideoList';
import VideoFilters from '../videoComponents/VideoFilters';

const VideosPage = ({ videos, updateVideo, deleteVideo, tags }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortBy, setSortBy] = useState('dateAdded');
  const [viewMode, setViewMode] = useState('grid');
  const [loading, setLoading] = useState(false);

  // Filter and sort videos
  const filteredAndSortedVideos = useMemo(() => {
    let filtered = videos.filter(video => {
      const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          video.url.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTags = selectedTags.length === 0 || 
                         selectedTags.every(tagId => video.tagIds?.includes(tagId));
      
      return matchesSearch && matchesTags;
    });

    // Sort videos
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'clickCount':
          return (b.clickCount || 0) - (a.clickCount || 0);
        case 'random':
          return Math.random() - 0.5;
        case 'dateAdded':
        default:
          return new Date(b.dateAdded) - new Date(a.dateAdded);
      }
    });

    return filtered;
  }, [videos, searchTerm, selectedTags, sortBy]);

  // Handle video click (increment click counter)
  const handleVideoPlay = (videoId) => {
    const video = videos.find(v => v.id === videoId);
    updateVideo(videoId, { clickCount: (video?.clickCount || 0) + 1 });
  };

  // Delete video with confirmation
  const handleVideoDelete = (videoId) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      deleteVideo(videoId);
    }
  };

  // Toggle tag filter
  const handleTagToggle = (tagId) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedTags([]);
  };

  // Handle search change
  const handleSearchChange = (term) => {
    setSearchTerm(term);
  };

  // Handle sort change
  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
  };

  // Handle view mode change
  const handleViewModeChange = (newViewMode) => {
    setViewMode(newViewMode);
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-100">Your Videos</h1>
          <span className="px-2 py-1 bg-blue-600 text-white rounded-lg text-sm font-semibold">
            Level {Math.floor(videos.length / 10) + 1}
          </span>
        </div>
        <p className="text-slate-400">
          Track your progress through {videos.length} saved videos
        </p>
      </div>

      {/* Filters */}
      <VideoFilters
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        selectedTags={selectedTags}
        onTagToggle={handleTagToggle}
        onClearFilters={handleClearFilters}
        tags={tags}
        sortBy={sortBy}
        onSortChange={handleSortChange}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        showViewToggle={true}
        showSorting={true}
      />

      {/* Videos List */}
      <VideoList
        videos={filteredAndSortedVideos}
        tags={tags}
        onVideoPlay={handleVideoPlay}
        onVideoDelete={handleVideoDelete}
        onVideoEdit={null} // Could implement edit functionality later
        loading={loading}
        emptyMessage={videos.length === 0 ? 'No videos added yet' : 'No videos match your search'}
        emptyDescription={videos.length === 0 ? 'Start building your collection by adding your first video!' : 'Try adjusting your search terms or filters'}
        viewMode={viewMode}
      />

      {/* Stats Section */}
      {videos.length > 0 && (
        <div className="bg-slate-700 border border-slate-600 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center space-x-2">
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4" />
            </svg>
            <span>Collection Statistics</span>
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-600 rounded-lg p-4 border border-slate-500">
              <div className="text-2xl font-bold text-blue-400 mb-1">
                {videos.length}
              </div>
              <div className="text-sm text-slate-300">Total Videos</div>
            </div>
            
            <div className="bg-slate-600 rounded-lg p-4 border border-slate-500">
              <div className="text-2xl font-bold text-green-400 mb-1">
                {filteredAndSortedVideos.length}
              </div>
              <div className="text-sm text-slate-300">Showing</div>
            </div>
            
            <div className="bg-slate-600 rounded-lg p-4 border border-slate-500">
              <div className="text-2xl font-bold text-yellow-400 mb-1">
                {videos.reduce((sum, video) => sum + (video.clickCount || 0), 0)}
              </div>
              <div className="text-sm text-slate-300">Total Clicks</div>
            </div>
            
            <div className="bg-slate-600 rounded-lg p-4 border border-slate-500">
              <div className="text-2xl font-bold text-purple-400 mb-1">
                {Math.floor(videos.length / 10) + 1}
              </div>
              <div className="text-sm text-slate-300">Collection Level</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-slate-400 mb-2">
              <span>Progress to next level</span>
              <span>{videos.length % 10}/10</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(videos.length % 10) * 10}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      {videos.length > 0 && (
        <div className="bg-slate-700 border border-slate-600 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center space-x-2">
            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Quick Actions</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => handleSortChange('random')}
              className="p-4 bg-slate-600 hover:bg-slate-500 border border-slate-500 rounded-lg transition-all duration-200 text-left"
            >
              <div className="flex items-center space-x-3">
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <div>
                  <div className="text-slate-100 font-medium">Shuffle Videos</div>
                  <div className="text-slate-400 text-sm">Random order</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleSortChange('clickCount')}
              className="p-4 bg-slate-600 hover:bg-slate-500 border border-slate-500 rounded-lg transition-all duration-200 text-left"
            >
              <div className="flex items-center space-x-3">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                </svg>
                <div>
                  <div className="text-slate-100 font-medium">Most Popular</div>
                  <div className="text-slate-400 text-sm">By click count</div>
                </div>
              </div>
            </button>

            <button
              onClick={handleClearFilters}
              className="p-4 bg-slate-600 hover:bg-slate-500 border border-slate-500 rounded-lg transition-all duration-200 text-left"
            >
              <div className="flex items-center space-x-3">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <div>
                  <div className="text-slate-100 font-medium">Clear Filters</div>
                  <div className="text-slate-400 text-sm">Show all videos</div>
                </div>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideosPage;