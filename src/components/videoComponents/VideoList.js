import React from 'react';
import VideoCard from './VideoCard';

const VideoList = ({ 
  videos, 
  tags, 
  onVideoPlay, 
  onVideoDelete, 
  onVideoEdit,
  loading = false,
  emptyMessage = 'No videos found',
  emptyDescription = 'Try adjusting your search or filters',
  viewMode = 'grid' // 'grid' or 'list'
}) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(6)].map((_, index) => (
          <VideoSkeleton key={index} viewMode={viewMode} />
        ))}
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-16 bg-slate-700 rounded-lg border border-slate-600">
        <svg className="mx-auto h-12 w-12 text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        <p className="text-slate-300 text-lg mb-2">{emptyMessage}</p>
        <p className="text-slate-400">{emptyDescription}</p>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {videos.map(video => (
          <VideoCardList
            key={video.id}
            video={video}
            tags={tags}
            onPlay={onVideoPlay}
            onDelete={onVideoDelete}
            onEdit={onVideoEdit}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {videos.map(video => (
        <VideoCard
          key={video.id}
          video={video}
          tags={tags}
          onPlay={onVideoPlay}
          onDelete={onVideoDelete}
          onEdit={onVideoEdit}
        />
      ))}
    </div>
  );
};

// List view variant of video card
const VideoCardList = ({ video, tags, onPlay, onDelete, onEdit }) => {
  const getTagInfo = (tagId) => {
    return tags.find(t => t.id === tagId);
  };

  const handlePlayClick = () => {
    onPlay(video.id);
    window.open(video.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-slate-700 border border-slate-600 rounded-lg p-4 hover:border-slate-500 transition-all duration-200 group animate-slideIn">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          {/* Title */}
          <h3 className="text-lg font-semibold text-slate-100 mb-2 group-hover:text-blue-400 transition-colors truncate">
            {video.title}
          </h3>
          
          {/* Tags */}
          {video.tagIds && video.tagIds.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {video.tagIds.map(tagId => {
                const tag = getTagInfo(tagId);
                return tag ? (
                  <span
                    key={tagId}
                    className="px-2 py-1 rounded-md text-xs font-medium text-white border"
                    style={{ 
                      backgroundColor: tag.color + '20',
                      borderColor: tag.color,
                      color: tag.color
                    }}
                  >
                    {tag.name}
                  </span>
                ) : null;
              })}
            </div>
          )}

          {/* Video Info */}
          <div className="flex items-center space-x-4 text-sm text-slate-400">
            <span>Added: {new Date(video.dateAdded).toLocaleDateString()}</span>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>{video.clickCount || 0} clicks</span>
            </div>
            <span className="font-mono text-xs bg-slate-600 px-2 py-1 rounded">
              #{video.id}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={handlePlayClick}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-blue-500/25 flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            <span>Watch</span>
          </button>
          
          {onEdit && (
            <button
              onClick={() => onEdit(video)}
              className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-600 rounded-lg transition-all duration-200"
              title="Edit video"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          )}
          
          <button
            onClick={() => onDelete(video.id)}
            className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-600 rounded-lg transition-all duration-200"
            title="Delete video"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

// Loading skeleton component
const VideoSkeleton = ({ viewMode = 'grid' }) => {
  if (viewMode === 'list') {
    return (
      <div className="bg-slate-700 border border-slate-600 rounded-lg p-4 animate-pulse">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="h-6 bg-slate-600 rounded w-3/4 mb-2"></div>
            <div className="flex space-x-2 mb-3">
              <div className="h-5 bg-slate-600 rounded w-16"></div>
              <div className="h-5 bg-slate-600 rounded w-20"></div>
            </div>
            <div className="flex space-x-4">
              <div className="h-4 bg-slate-600 rounded w-24"></div>
              <div className="h-4 bg-slate-600 rounded w-16"></div>
            </div>
          </div>
          <div className="flex space-x-2">
            <div className="h-8 bg-slate-600 rounded w-20"></div>
            <div className="h-8 bg-slate-600 rounded w-8"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-700 border border-slate-600 rounded-lg overflow-hidden animate-pulse">
      <div className="aspect-video bg-slate-600"></div>
      <div className="p-4">
        <div className="h-6 bg-slate-600 rounded w-3/4 mb-2"></div>
        <div className="flex space-x-2 mb-3">
          <div className="h-5 bg-slate-600 rounded w-16"></div>
          <div className="h-5 bg-slate-600 rounded w-20"></div>
        </div>
        <div className="flex justify-between items-center mb-4">
          <div className="h-4 bg-slate-600 rounded w-24"></div>
          <div className="h-4 bg-slate-600 rounded w-12"></div>
        </div>
        <div className="flex justify-between">
          <div className="h-8 bg-slate-600 rounded w-20"></div>
          <div className="flex space-x-2">
            <div className="h-8 bg-slate-600 rounded w-8"></div>
            <div className="h-8 bg-slate-600 rounded w-8"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoList;