import React, { useState, useEffect, useRef } from 'react';
import { Search, Menu } from 'lucide-react';
import { TOOLS } from '../constants';
import { Tool } from '../types';

interface NavbarProps {
  onMenuClick: () => void;
  onNavigate: (path: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick, onNavigate }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Tool[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearching(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.trim().length > 0) {
      const filtered = TOOLS.filter(t => 
        t.name.toLowerCase().includes(query.toLowerCase()) ||
        t.category.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 6);
      setResults(filtered);
      setIsSearching(true);
    } else {
      setIsSearching(false);
    }
  }, [query]);

  return (
    <nav className="fixed top-0 left-0 right-0 h-20 bg-navy-900/80 backdrop-blur-xl border-b border-white/5 z-40 flex items-center px-6 lg:pl-[280px] justify-between">
      {/* Mobile Menu Trigger */}
      <button 
        onClick={onMenuClick}
        className="lg:hidden p-2 text-gray-400 hover:text-white"
      >
        <Menu size={20} />
      </button>

      {/* Main Universal Search */}
      <div className="flex-1 max-w-2xl mx-auto px-4 relative" ref={searchRef}>
        <div className="relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-500">
            <Search size={16} />
          </div>
          <input
            type="text"
            className="w-full bg-navy-800/40 border border-white/10 rounded-full py-2.5 pl-11 pr-4 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/10 transition-all"
            placeholder="Search tools, templates, models..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {isSearching && (
          <div className="absolute top-full left-0 right-0 mt-3 mx-4 bg-navy-800 rounded-2xl shadow-2xl border border-white/10 overflow-hidden animate-in fade-in slide-in-from-top-1">
            <div className="p-2">
              {results.map(tool => (
                <div 
                  key={tool.id}
                  onClick={() => {
                    onNavigate(tool.path);
                    setQuery('');
                    setIsSearching(false);
                  }}
                  className="px-4 py-3 hover:bg-white/5 rounded-xl cursor-pointer flex items-center space-x-3 group"
                >
                  <div className="p-2 bg-navy-900 text-primary rounded-lg group-hover:bg-primary group-hover:text-navy-950 transition-colors">
                    <tool.icon size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-100">{tool.name}</h4>
                    <span className="text-[10px] text-gray-500">{tool.category}</span>
                  </div>
                </div>
              ))}
              {results.length === 0 && (
                <div className="p-8 text-center text-gray-500 text-xs">No matching tools</div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="hidden md:block w-48 text-right">
        {/* Placeholder for future user/balance info */}
      </div>
    </nav>
  );
};

export default Navbar;