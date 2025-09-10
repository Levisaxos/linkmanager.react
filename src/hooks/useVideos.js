import { useLocalStorage } from './useLocalStorage';

export const useVideos = () => {
  const [videos, setVideos] = useLocalStorage('youtube-videos', []);

  const addVideo = (videoData) => {
    const newVideo = {
      id: Date.now(),
      title: videoData.title.trim(),
      url: videoData.url.trim(),
      tagIds: videoData.tagIds || [],
      dateAdded: new Date().toISOString(),
      clickCount: 0,
      ...videoData
    };

    setVideos(prev => [newVideo, ...prev]);
    return newVideo;
  };

  const updateVideo = (videoId, updates) => {
    setVideos(prev => 
      prev.map(video => 
        video.id === videoId 
          ? { ...video, ...updates }
          : video
      )
    );
  };

  const deleteVideo = (videoId) => {
    setVideos(prev => prev.filter(video => video.id !== videoId));
  };

  const incrementClickCount = (videoId) => {
    updateVideo(videoId, { 
      clickCount: (videos.find(v => v.id === videoId)?.clickCount || 0) + 1 
    });
  };

  const getVideosByTag = (tagId) => {
    return videos.filter(video => video.tagIds?.includes(tagId));
  };

  const searchVideos = (searchTerm) => {
    if (!searchTerm.trim()) return videos;
    
    const term = searchTerm.toLowerCase();
    return videos.filter(video => 
      video.title.toLowerCase().includes(term) ||
      video.url.toLowerCase().includes(term)
    );
  };

  return {
    videos,
    addVideo,
    updateVideo,
    deleteVideo,
    incrementClickCount,
    getVideosByTag,
    searchVideos,
    setVideos
  };
};