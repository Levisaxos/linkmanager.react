import React from 'react';
import { ROUTES, ROUTE_LABELS } from '../../constants/routes';

const Navigation = ({ currentPage, setCurrentPage, videos, tags }) => {
  const navItems = [
    {
      key: ROUTES.VIDEOS,
      label: ROUTE_LABELS[ROUTES.VIDEOS],
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      count: videos.length
    },
    {
      key: ROUTES.ADD_VIDEO,
      label: ROUTE_LABELS[ROUTES.ADD_VIDEO],
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      )
    },
    {
      key: ROUTES.TAGS,
      label: ROUTE_LABELS[ROUTES.TAGS],
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      ),
      count: tags.length
    }
  ];

  return (
    <nav className="bg-slate-800 border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center space-x-1">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setCurrentPage(item.key)}
              className={`
                relative px-6 py-4 flex items-center space-x-3 text-sm font-medium transition-all duration-200
                ${currentPage === item.key
                  ? 'text-blue-400 bg-slate-700 border-b-2 border-blue-400'
                  : 'text-slate-300 hover:text-slate-100 hover:bg-slate-700/50'
                }
              `}
            >
              <span className={`
                ${currentPage === item.key ? 'text-blue-400' : 'text-slate-400'}
              `}>
                {item.icon}
              </span>
              <span>{item.label}</span>
              {item.count !== undefined && (
                <span className={`
                  px-2 py-1 rounded-full text-xs font-semibold
                  ${currentPage === item.key 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-slate-600 text-slate-300'
                  }
                `}>
                  {item.count}
                </span>
              )}
              
              {/* Active indicator */}
              {currentPage === item.key && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 to-blue-600" />
              )}
            </button>
          ))}

          {/* Stats section */}
          <div className="ml-auto flex items-center space-x-6 text-xs text-slate-400">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>
                Total Clicks: {videos.reduce((sum, video) => sum + (video.clickCount || 0), 0)}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span>Last Updated: {new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;