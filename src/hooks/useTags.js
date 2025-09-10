import { useLocalStorage } from './useLocalStorage';
import { DEFAULT_TAG_COLOR } from '../constants/colors';

export const useTags = () => {
  const [tags, setTags] = useLocalStorage('youtube-tags', []);

  const addTag = (tagData) => {
    const newTag = {
      id: Date.now(),
      name: tagData.name.trim(),
      color: tagData.color || DEFAULT_TAG_COLOR,
      dateCreated: new Date().toISOString(),
      ...tagData
    };

    setTags(prev => [...prev, newTag]);
    return newTag;
  };

  const updateTag = (tagId, updates) => {
    setTags(prev => 
      prev.map(tag => 
        tag.id === tagId 
          ? { ...tag, ...updates }
          : tag
      )
    );
  };

  const deleteTag = (tagId) => {
    setTags(prev => prev.filter(tag => tag.id !== tagId));
  };

  const getTagById = (tagId) => {
    return tags.find(tag => tag.id === tagId);
  };

  const getTagsByIds = (tagIds) => {
    return tags.filter(tag => tagIds.includes(tag.id));
  };

  const searchTags = (searchTerm) => {
    if (!searchTerm.trim()) return tags;
    
    const term = searchTerm.toLowerCase();
    return tags.filter(tag => 
      tag.name.toLowerCase().includes(term)
    );
  };

  return {
    tags,
    addTag,
    updateTag,
    deleteTag,
    getTagById,
    getTagsByIds,
    searchTags,
    setTags
  };
};