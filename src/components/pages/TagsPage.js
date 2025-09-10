import React, { useState } from 'react';
import { validateTag } from '../../utils/validation';
import { PREDEFINED_COLORS, DEFAULT_TAG_COLOR } from '../../constants/colors';

const TagsPage = ({ tags, addTag, updateTag, deleteTag }) => {
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [editingTag, setEditingTag] = useState(null);
  const [newTag, setNewTag] = useState({ name: '', color: DEFAULT_TAG_COLOR });
  const [editTag, setEditTag] = useState({ name: '', color: '' });
  const [errors, setErrors] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Handle adding new tag
  const handleAddTag = () => {
    const error = validateTag(newTag, tags);
    if (error) {
      setErrors({ add: error });
      return;
    }

    addTag(newTag);
    setNewTag({ name: '', color: DEFAULT_TAG_COLOR });
    setIsAddingTag(false);
    setErrors({});
  };

  // Handle editing tag
  const startEdit = (tag) => {
    setEditingTag(tag.id);
    setEditTag({ name: tag.name, color: tag.color });
    setErrors({});
  };

  const saveEdit = () => {
    const error = validateTag(editTag, tags, editingTag);
    if (error) {
      setErrors({ [editingTag]: error });
      return;
    }

    updateTag(editingTag, editTag);
    setEditingTag(null);
    setEditTag({ name: '', color: '' });
    setErrors({});
  };

  const cancelEdit = () => {
    setEditingTag(null);
    setEditTag({ name: '', color: '' });
    setErrors({});
  };

  // Handle deleting tag
  const handleDeleteTag = (tagId) => {
    deleteTag(tagId);
    setDeleteConfirm(null);
  };

  // Cancel adding
  const cancelAdd = () => {
    setIsAddingTag(false);
    setNewTag({ name: '', color: DEFAULT_TAG_COLOR });
    setErrors({});
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-100">Manage Tags</h1>
              <p className="text-slate-400">
                Organize your videos with custom tags and colors
              </p>
            </div>
            <span className="px-2 py-1 bg-purple-600 text-white rounded-lg text-sm font-semibold">
              Inventory
            </span>
          </div>

          {!isAddingTag && (
            <button
              onClick={() => setIsAddingTag(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-blue-500/25 border border-blue-500 flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Create Tag</span>
            </button>
          )}
        </div>
      </div>

      {/* Add New Tag Form */}
      {isAddingTag && (
        <div className="bg-slate-700 border border-slate-600 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center space-x-2">
            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Create New Tag</span>
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Tag Name *
              </label>
              <input
                type="text"
                value={newTag.name}
                onChange={(e) => setNewTag(prev => ({ ...prev, name: e.target.value }))}
                className={`w-full px-4 py-3 bg-slate-800 border rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.add ? 'border-red-500' : 'border-slate-600'
                }`}
                placeholder="Enter tag name"
                maxLength={20}
              />
              <div className="flex justify-between mt-1">
                {errors.add ? (
                  <p className="text-sm text-red-400">{errors.add}</p>
                ) : (
                  <span></span>
                )}
                <span className="text-xs text-slate-400">
                  {newTag.name.length}/20
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Tag Color
              </label>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {PREDEFINED_COLORS.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewTag(prev => ({ ...prev, color }))}
                      className={`w-10 h-10 rounded-lg border-2 transition-all duration-200 ${
                        newTag.color === color 
                          ? 'border-blue-400 scale-110 shadow-lg' 
                          : 'border-slate-600 hover:border-slate-500'
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={newTag.color}
                    onChange={(e) => setNewTag(prev => ({ ...prev, color: e.target.value }))}
                    className="w-12 h-10 border border-slate-600 rounded cursor-pointer bg-slate-800"
                  />
                  <span className="text-sm text-slate-400">Custom color</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={cancelAdd}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg border border-slate-600 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-blue-500/25 border border-blue-500 flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Create Tag</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tags List */}
      <div className="space-y-4">
        {tags.length === 0 ? (
          <div className="text-center py-16 bg-slate-700 rounded-lg border border-slate-600">
            <svg className="mx-auto h-12 w-12 text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <p className="text-slate-300 text-lg">No tags created yet</p>
            <p className="text-slate-400 mb-4">Create your first tag to start organizing your videos!</p>
            <button
              onClick={() => setIsAddingTag(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-blue-500/25 border border-blue-500 flex items-center space-x-2 mx-auto"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Create First Tag</span>
            </button>
          </div>
        ) : (
          tags.map(tag => (
            <div key={tag.id} className="bg-slate-700 border border-slate-600 rounded-lg p-6 hover:border-slate-500 transition-all duration-200">
              {editingTag === tag.id ? (
                // Edit Mode
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-slate-100 mb-4">Edit Tag</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Tag Name *
                    </label>
                    <input
                      type="text"
                      value={editTag.name}
                      onChange={(e) => setEditTag(prev => ({ ...prev, name: e.target.value }))}
                      className={`w-full px-4 py-3 bg-slate-800 border rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors[tag.id] ? 'border-red-500' : 'border-slate-600'
                      }`}
                      maxLength={20}
                    />
                    <div className="flex justify-between mt-1">
                      {errors[tag.id] ? (
                        <p className="text-sm text-red-400">{errors[tag.id]}</p>
                      ) : (
                        <span></span>
                      )}
                      <span className="text-xs text-slate-400">
                        {editTag.name.length}/20
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-3">
                      Tag Color
                    </label>
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {PREDEFINED_COLORS.map(color => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => setEditTag(prev => ({ ...prev, color }))}
                            className={`w-10 h-10 rounded-lg border-2 transition-all duration-200 ${
                              editTag.color === color 
                                ? 'border-blue-400 scale-110 shadow-lg' 
                                : 'border-slate-600 hover:border-slate-500'
                            }`}
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={editTag.color}
                          onChange={(e) => setEditTag(prev => ({ ...prev, color: e.target.value }))}
                          className="w-12 h-10 border border-slate-600 rounded cursor-pointer bg-slate-800"
                        />
                        <span className="text-sm text-slate-400">Custom color</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={cancelEdit}
                      className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg border border-slate-600 transition-all duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveEdit}
                      className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-green-500/25 border border-green-500 flex items-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Save Changes</span>
                    </button>
                  </div>
                </div>
              ) : (
                // Display Mode
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <span
                      className="px-4 py-2 rounded-lg text-sm font-medium text-white shadow-lg"
                      style={{ backgroundColor: tag.color }}
                    >
                      {tag.name}
                    </span>
                    <div className="text-sm text-slate-400 space-y-1">
                      <div>Created: {new Date(tag.dateCreated).toLocaleDateString()}</div>
                      <div className="font-mono text-xs bg-slate-600 px-2 py-1 rounded w-fit">
                        #{tag.id}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => startEdit(tag)}
                      className="p-2 text-blue-400 hover:text-blue-300 hover:bg-slate-600 rounded-lg transition-all duration-200"
                      title="Edit tag"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(tag)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-slate-600 rounded-lg transition-all duration-200"
                      title="Delete tag"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Stats Section */}
      {tags.length > 0 && (
        <div className="mt-8 bg-slate-700 border border-slate-600 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center space-x-2">
            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4" />
            </svg>
            <span>Tag Statistics</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-600 rounded-lg p-4 border border-slate-500">
              <div className="text-2xl font-bold text-purple-400 mb-1">
                {tags.length}
              </div>
              <div className="text-sm text-slate-300">Total Tags</div>
            </div>
            
            <div className="bg-slate-600 rounded-lg p-4 border border-slate-500">
              <div className="text-2xl font-bold text-blue-400 mb-1">
                {PREDEFINED_COLORS.length}
              </div>
              <div className="text-sm text-slate-300">Color Options</div>
            </div>
            
            <div className="bg-slate-600 rounded-lg p-4 border border-slate-500">
              <div className="text-2xl font-bold text-green-400 mb-1">
                {tags.filter(tag => PREDEFINED_COLORS.includes(tag.color)).length}
              </div>
              <div className="text-sm text-slate-300">Using Presets</div>
            </div>
          </div>
        </div>
      )}

      {/* Tips Section */}
      <div className="mt-8 bg-purple-600/10 border border-purple-500/30 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-purple-400 mb-3 flex items-center space-x-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Tag Management Tips</span>
        </h3>
        <ul className="text-sm text-purple-300 space-y-2">
          <li className="flex items-start space-x-2">
            <span className="text-purple-400 mt-0.5">•</span>
            <span>Use descriptive names like "Music", "Gaming", "Tutorials", "Funny" for easy categorization</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-purple-400 mt-0.5">•</span>
            <span>Choose distinct colors to visually organize your content at a glance</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-purple-400 mt-0.5">•</span>
            <span>Keep tag names short and memorable (maximum 20 characters)</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-purple-400 mt-0.5">•</span>
            <span>Delete unused tags to keep your organization system clean and efficient</span>
          </li>
        </ul>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-6 mx-4 max-w-md w-full">
            <h3 className="text-lg font-semibold text-slate-100 mb-2">Delete Tag</h3>
            <p className="text-slate-300 mb-6">
              Are you sure you want to delete the tag "{deleteConfirm.name}"? This will remove it from all videos.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg border border-slate-600 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteTag(deleteConfirm.id)}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg border border-red-500 transition-all duration-200"
              >
                Delete Tag
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TagsPage;