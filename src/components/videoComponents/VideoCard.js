import React from 'react';
import Button from '../ui/Button';
import { getYouTubeThumbnail } from '../../utils/videoUtils';

const VideoCard = ({ video, tags, onPlay, onDelete, onEdit }) => {
  // Get tag info by ID
  const getTagInfo = (tagId) => {
    return tags.find(t => t.id === tagId);
  };

  const handlePlayClick = () => {
    onPlay(video.id);
    // Open video in new tab
    window.open(video.url, '_blank', 'noopener,noreferrer');
  };

  // Prefer an uploaded screenshot; fall back to the YouTube thumbnail.
  const imageUrl = video.screenshot || getYouTubeThumbnail(video.url);

  return (
    <div className="bg-slate-700 border border-slate-600 rounded-lg overflow-hidden hover:border-slate-500 transition-all duration-200 group animate-slideIn">
      {/* Thumbnail Section */}
      {imageUrl && (
        <div className="relative aspect-[9/16] bg-slate-800">
          <img
            src={imageUrl}
            alt={video.title}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          
          {/* Play Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
            <Button
              variant="primary"
              size="lg"
              onClick={handlePlayClick}
              icon={
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              }
              className="animate-glow"
            >
              Play
            </Button>
          </div>

          {/* Click Counter Badge */}
          <div className="absolute top-2 right-2 px-2 py-1 bg-slate-900/80 rounded-lg">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-slate-300 text-xs font-medium">
                {video.clickCount || 0}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Content Section */}
      <div className="p-3">
        {/* Title */}
        <h3 className="text-sm font-semibold text-slate-100 mb-2 group-hover:text-blue-400 transition-colors line-clamp-2">
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
        <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
          <span>{new Date(video.dateAdded).toLocaleDateString()}</span>
          <span>{video.clickCount} clicks</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <Button
            variant="primary"
            size="xs"
            onClick={handlePlayClick}
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            }
          >
            Watch
          </Button>

          <div className="flex items-center space-x-1">
            {onEdit && (
              <Button
                variant="ghost"
                size="xs"
                onClick={() => onEdit(video)}
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                }
                className="text-slate-400 hover:text-blue-400"
                title="Edit video"
              />
            )}
            
            <Button
              variant="ghost"
              size="xs"
              onClick={() => onDelete(video.id)}
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              }
              className="text-slate-400 hover:text-red-400"
              title="Delete video"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;