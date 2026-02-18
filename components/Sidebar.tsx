import React, { useState } from 'react';
import { CATEGORIES, TOOLS } from '../constants';
import { ToolCategory } from '../types';
import { Search, Sparkles } from 'lucide-react';

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
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed top-0 left-0 h-full bg-navy-950 z-50
        w-64 border-r border-white/5 lg:block
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
      `}>
        {/* Brand */}
        <div className="h-20 flex items-center px-6 mb-2">
          <div 
            className="flex items-center space-x-3 cursor-pointer group" 
            onClick={() => onNavigate('/')}
          >
            <div className="bg-primary p-2 rounded-lg">
              <Sparkles size={18} className="text-navy-950" />
            </div>
            <span className="font-heading font-bold text-xl text-white tracking-tight">
              Cutverse<span className="text-primary">Ai</span>
            </span>
          </div>
        </div>

        {/* Local Search Bar */}
        <div className="px-4 mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search size={14} className="text-gray-500" />
            </div>
            <input
              type="text"
              className="w-full bg-navy-800/50 border border-white/5 rounded-lg py-2.5 pl-9 pr-3 text-xs text-gray-300 placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors"
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {searchQuery && (
            <div className="absolute left-4 right-4 mt-2 bg-navy-800 rounded-lg border border-white/10 shadow-2xl z-50 max-h-60 overflow-y-auto">
              {filteredTools.length > 0 ? (
                filteredTools.map(tool => (
                  <button
                    key={tool.id}
                    onClick={() => {
                      onNavigate(tool.path);
                      setSearchQuery('');
                      onCloseMobile();
                    }}
                    className="w-full text-left px-3 py-2.5 text-xs text-gray-400 hover:bg-white/5 hover:text-primary border-b border-white/5 last:border-0"
                  >
                    {tool.name}
                  </button>
                ))
              ) : (
                <div className="px-3 py-4 text-xs text-gray-500 text-center">No tools found</div>
              )}
            </div>
          )}
        </div>

        {/* Navigation Categories */}
        <div className="flex-1 overflow-y-auto px-4 pb-10">
          <h2 className="text-[10px] font-bold text-gray-600 uppercase tracking-[2px] mb-4 px-2">
            Categories
          </h2>
          <div className="space-y-1.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.id);
                  onCloseMobile();
                }}
                className={`
                  w-full flex items-center space-x-3 px-3 py-3 rounded-xl text-xs font-semibold transition-all group
                  ${activeCategory === cat.id 
                    ? 'bg-primary/10 text-primary border-l-[3px] border-primary rounded-l-none' 
                    : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}
                `}
              >
                <cat.icon size={18} className={activeCategory === cat.id ? 'text-primary' : 'text-gray-600 group-hover:text-gray-400'} />
                <span>{cat.id}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;