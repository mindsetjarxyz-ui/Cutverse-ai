import React, { useState, useEffect } from 'react';
import { Search, Menu, Sparkles } from 'lucide-react';
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

  useEffect(() => {
    if (query.trim().length > 0) {
      setIsSearching(true);
      const filtered = TOOLS.filter(t => 
        t.name.toLowerCase().includes(query.toLowerCase()) ||
        t.description.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    } else {
      setIsSearching(false);
      setResults([]);
    }
  }, [query]);

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-navy-900/90 backdrop-blur-md border-b border-white/5 z-40 flex items-center px-4 lg:px-8 justify-between gap-4">
      {/* Left: Logo & Menu */}
      <div className="flex items-center space-x-4 shrink-0">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
        >
          <Menu size={20} />
        </button>
        <div 
          className="flex items-center space-x-2 cursor-pointer group" 
          onClick={() => onNavigate('/')}
        >
          <div className="bg-primary p-1.5 rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.5)] group-hover:shadow-[0_0_25px_rgba(6,182,212,0.7)] transition-shadow">
             <Sparkles size={18} className="text-navy-900" />
          </div>
          <span className="font-heading font-bold text-xl text-white tracking-tight hidden sm:inline">
            Cutverse<span className="text-primary">Ai</span>
          </span>
        </div>
      </div>

      {/* Center: Search */}
      <div className="flex-1 max-w-xl mx-auto relative hidden md:block">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-500 group-focus-within:text-primary transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2.5 border border-white/10 rounded-full leading-5 bg-navy-800/50 text-gray-200 placeholder-gray-500 focus:outline-none focus:bg-navy-800 focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-sm"
            placeholder="Search tools..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* Search Dropdown */}
        {isSearching && (
          <div className="absolute top-full left-0 w-full mt-2 bg-navy-800 rounded-xl shadow-2xl border border-white/10 overflow-hidden py-2 max-h-96 overflow-y-auto z-50">
            {results.length > 0 ? (
              results.map(tool => (
                <div 
                  key={tool.id}
                  onClick={() => {
                    onNavigate(tool.path);
                    setQuery('');
                  }}
                  className="px-4 py-3 hover:bg-white/5 cursor-pointer flex items-center space-x-3 group"
                >
                  <div className="p-2 bg-navy-700 text-primary rounded-lg group-hover:bg-primary group-hover:text-navy-900 transition-colors">
                    <tool.icon size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-200">{tool.name}</h4>
                    <p className="text-xs text-gray-500 truncate">{tool.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">No tools found.</div>
            )}
          </div>
        )}
      </div>

      {/* Right: Actions (Empty for now as login is removed) */}
      <div className="shrink-0 flex items-center gap-3">
        {/* Placeholder for future actions */}
      </div>
    </nav>
  );
};

export default Navbar;