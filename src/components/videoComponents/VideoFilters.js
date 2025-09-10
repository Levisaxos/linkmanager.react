import React, { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';

const VideoFilters = ({
  searchTerm,
  onSearchChange,
  selectedTags,
  onTagToggle,
  onClearFilters,
  tags,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  showViewToggle = true,
  showSorting = true
}) => {
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);

  const sortOptions = [
    { value: 'dateAdded', label: 'Date Added' },
    { value: 'title', label: 'Title' },
    { value: 'clickCount', label: 'Most Clicked' },
    { value: 'random', label: 'Random' }
  ];

  const hasActiveFilters = searchTerm || selectedTags.length > 0;

  return (
    <div className="bg-slate-700 rounded-lg border border-slate-600 p-6 space-y-4">
      {/* Search Bar */}
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Search your video collection..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            }
            rightIcon={searchTerm && (
              <button
                onClick={() => onSearchChange('')}
                className="text-slate-400 hover:text-slate-200 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          />
        </div>

        {/* Filter Toggle */}
        <Button
          variant={isFiltersExpanded ? 'primary' : 'secondary'}
          onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
            </svg>
          }
        >
          Filters {hasActiveFilters && `(${selectedTags.length + (searchTerm ? 1 : 0)})`}
        </Button>

        {/* View Mode Toggle */}
        {showViewToggle && (
          <div className="flex bg-slate-600 rounded-lg p-1">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-2 rounded transition-all ${
                viewMode === 'grid' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-slate-300 hover:text-white'
              }`}
              title="Grid view"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`p-2 rounded transition-all ${
                viewMode === 'list' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-slate-300 hover:text-white'
              }`}
              title="List view"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Expanded Filters */}
      {isFiltersExpanded && (
        <div className="space-y-4 animate-fadeIn">
          {/* Sorting */}
          {showSorting && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Sort by:
              </label>
              <div className="flex flex-wrap gap-2">
                {sortOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => onSortChange(option.value)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
                      sortBy === option.value
                        ? 'bg-blue-600 text-white border-blue-500'
                        : 'bg-slate-600 text-slate-300 border-slate-500 hover:border-slate-400'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tag Filters */}
          {tags.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-slate-300">
                  Filter by tags:
                </label>
                {selectedTags.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClearFilters}
                    className="text-red-400 hover:text-red-300"
                  >
                    Clear All
                  </Button>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <button
                    key={tag.id}
                    onClick={() => onTagToggle(tag.id)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
                      selectedTags.includes(tag.id)
                        ? 'border-blue-400 shadow-lg shadow-blue-400/20 text-white'
                        : 'border-slate-600 text-slate-300 hover:border-slate-500'
                    }`}
                    style={selectedTags.includes(tag.id) ? { 
                      backgroundColor: tag.color,
                      borderColor: tag.color 
                    } : { backgroundColor: 'rgb(51 65 85)' }}
                  >
                    <span className="flex items-center space-x-2">
                      <span>{tag.name}</span>
                      {selectedTags.includes(tag.id) && (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </span>
                  </button>
                ))}
              </div>
              
              {selectedTags.length > 0 && (
                <p className="text-sm text-slate-400 mt-2 flex items-center space-x-2">
                  <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <span>Filtering by {selectedTags.length} tag(s)</span>
                </p>
              )}
            </div>
          )}

          {tags.length === 0 && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p className="text-yellow-400 text-sm">
                  No tags available. Create tags to organize your videos by category.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Active Filters Summary */}
      {hasActiveFilters && !isFiltersExpanded && (
        <div className="flex items-center justify-between bg-slate-600 rounded-lg p-3">
          <div className="flex items-center space-x-2 text-sm text-slate-300">
            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
            </svg>
            <span>
              {searchTerm && `Search: "${searchTerm}"`}
              {searchTerm && selectedTags.length > 0 && ' • '}
              {selectedTags.length > 0 && `${selectedTags.length} tag(s) selected`}
            </span>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-slate-400 hover:text-red-400"
          >
            Clear
          </Button>
        </div>
      )}
    </div>
  );
};

export default VideoFilters;