import React from 'react';
import { CATEGORIES } from '../constants';
import { ToolCategory } from '../types';
import { Sparkles } from 'lucide-react';

interface SidebarProps {
  activeCategory: ToolCategory;
  onSelectCategory: (category: ToolCategory) => void;
  isOpen: boolean;
  onCloseMobile: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeCategory, 
  onSelectCategory, 
  isOpen,
  onCloseMobile
}) => {
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
        pt-20 pb-10 px-4
      `}>
        <div className="mb-8 px-2">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
            Browse Tools
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

        <div className="absolute bottom-8 left-0 w-full px-6 text-center">
          <div className="p-4 bg-gradient-to-br from-navy-800 to-navy-700 rounded-xl border border-white/5">
            <Sparkles className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-xs text-gray-300 font-medium">Free Unlimited Usage</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;