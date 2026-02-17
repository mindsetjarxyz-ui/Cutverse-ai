import React, { useState } from 'react';
import { CATEGORIES, TOOLS } from '../constants';
import { ToolCategory } from '../types';
import { Sparkles, Search } from 'lucide-react';

interface SidebarProps {
  activeCategory: ToolCategory;
  onSelectCategory: (category: ToolCategory) => void;
  isOpen: boolean;
  onCloseMobile: () => void;
  onNavigate: (path: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeCategory, 
  onSelectCategory, 
  isOpen,
  onCloseMobile,
  onNavigate
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredTools = searchQuery 
    ? TOOLS.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden backdrop-blur-sm"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed top-0 left-0 h-full bg-navy-900 z-30
        w-64 border-r border-white/5 shadow-xl lg:shadow-none lg:border-r lg:block
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        pt-20 pb-10 px-4 flex flex-col
      `}>
        {/* Search Bar */}
        <div className="mb-6 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={14} className="text-gray-500" />
          </div>
          <input
            type="text"
            className="w-full bg-navy-800 border border-white/10 rounded-lg py-2 pl-9 pr-3 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors"
            placeholder="Search tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          
          {/* Search Results Dropdown inside Sidebar */}
          {searchQuery && (
            <div className="absolute top-full left-0 w-full mt-2 bg-navy-800 rounded-lg border border-white/10 shadow-xl z-50 max-h-60 overflow-y-auto">
              {filteredTools.length > 0 ? (
                filteredTools.map(tool => (
                  <button
                    key={tool.id}
                    onClick={() => {
                      onNavigate(tool.path);
                      setSearchQuery('');
                      onCloseMobile();
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-gray-300 hover:bg-white/5 hover:text-primary truncate"
                  >
                    {tool.name}
                  </button>
                ))
              ) : (
                <div className="px-3 py-2 text-xs text-gray-500">No tools found</div>
              )}
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 px-2">
            Categories
          </h2>
          <div className="space-y-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.id);
                  onCloseMobile();
                }}
                className={`
                  w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                  ${activeCategory === cat.id 
                    ? 'bg-primary/10 text-primary border-l-2 border-primary' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'}
                `}
              >
                <cat.icon size={18} className={activeCategory === cat.id ? 'text-primary' : 'text-gray-500'} />
                <span>{cat.id}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto px-2">
          <div className="p-4 bg-gradient-to-br from-navy-800 to-navy-700 rounded-xl border border-white/5">
            <Sparkles className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-xs text-gray-300 font-medium text-center">Free Unlimited Usage</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;