import { useState, useRef, useEffect, useMemo } from 'react';
import { Search, ArrowLeft, X, Menu } from 'lucide-react';
import { tools, Tool } from '@/data/tools';
import { cn } from '@/utils/cn';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onToolSelect?: (tool: Tool) => void;
  onMenuToggle?: () => void;
}

const categoryLabels: Record<string, string> = {
  student: 'Student AI',
  writer: 'AI Writing',
  image: 'AI Image',
  social: 'Social Media',
};

export function Header({ title, showBack, onBack, searchQuery, onSearchChange, onToolSelect, onMenuToggle }: HeaderProps) {
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter tools based on search query - ONLY by name
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase();
    return tools.filter(tool => 
      tool.title.toLowerCase().includes(query)
    ).slice(0, 10); // Limit to 10 results
  }, [searchQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToolClick = (tool: Tool) => {
    onToolSelect?.(tool);
    onSearchChange('');
    setIsFocused(false);
  };

  const clearSearch = () => {
    onSearchChange('');
    inputRef.current?.focus();
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchResults.length > 0) {
      handleToolClick(searchResults[0]);
    }
    if (e.key === 'Escape') {
      setIsFocused(false);
      onSearchChange('');
    }
  };

  const showDropdown = isFocused && searchQuery.trim().length > 0;

  return (
    <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-xl border-b border-slate-800">
      <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Back Button - Only visible when inside a tool */}
          {showBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-xl transition-all duration-200 flex-shrink-0 shadow-lg shadow-blue-500/20"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm font-semibold">Back</span>
            </button>
          )}
          
          {/* Hamburger Menu Button - Only visible on mobile and when NOT inside a tool */}
          {!showBack && onMenuToggle && (
            <button
              onClick={onMenuToggle}
              className="lg:hidden flex items-center justify-center w-10 h-10 text-white bg-gradient-to-br from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 rounded-xl transition-all duration-200 flex-shrink-0 shadow-lg shadow-blue-500/20 active:scale-95"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          
          {/* Title */}
          <h1 className="text-base sm:text-lg md:text-xl font-semibold text-white truncate flex-1 min-w-0">
            {title}
          </h1>
          
          {/* Search Bar with Dropdown */}
          <div ref={searchRef} className="relative w-full max-w-[180px] sm:max-w-xs md:max-w-sm flex-shrink-0">
            <Search className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onKeyDown={handleKeyDown}
              className="w-full pl-8 sm:pl-10 pr-8 py-2 sm:py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white rounded-full hover:bg-slate-700 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            
            {/* Search Results Dropdown - Google Chrome Style */}
            {showDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800/98 backdrop-blur-xl border border-slate-600/50 rounded-xl shadow-2xl shadow-black/60 overflow-hidden z-50 animate-fadeIn">
                {searchResults.length > 0 ? (
                  <div className="py-2 max-h-[70vh] overflow-y-auto">
                    {searchResults.map((tool, index) => (
                      <button
                        key={tool.id}
                        onClick={() => handleToolClick(tool)}
                        className={cn(
                          "w-full px-3 sm:px-4 py-2.5 sm:py-3 flex items-center gap-3 hover:bg-blue-600/20 transition-all text-left group",
                          index === 0 && "bg-slate-700/30"
                        )}
                      >
                        {/* Search Icon or Tool Icon */}
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors",
                          "bg-slate-700/50 group-hover:bg-blue-600/30"
                        )}>
                          <tool.icon className="w-4 h-4 text-slate-300 group-hover:text-blue-400" />
                        </div>
                        
                        {/* Tool Name and Category */}
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium text-sm truncate group-hover:text-blue-300">
                            {/* Highlight matching text */}
                            {tool.title.split(new RegExp(`(${searchQuery})`, 'gi')).map((part, i) => 
                              part.toLowerCase() === searchQuery.toLowerCase() ? 
                                <span key={i} className="text-blue-400 font-semibold">{part}</span> : part
                            )}
                          </p>
                          <span className="text-slate-500 text-xs">
                            {categoryLabels[tool.category]}
                          </span>
                        </div>
                        
                        {/* Arrow indicator */}
                        <div className="text-slate-500 group-hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </button>
                    ))}
                    
                    {/* Hint at bottom */}
                    <div className="px-4 py-2 border-t border-slate-700/50">
                      <p className="text-slate-500 text-xs text-center">
                        Press Enter or click to open tool
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="px-4 py-8 text-center">
                    <div className="w-12 h-12 mx-auto mb-3 bg-slate-700/50 rounded-full flex items-center justify-center">
                      <Search className="w-5 h-5 text-slate-500" />
                    </div>
                    <p className="text-slate-400 text-sm">No tools found for "<span className="text-white">{searchQuery}</span>"</p>
                    <p className="text-slate-500 text-xs mt-1">Try searching by tool name</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
