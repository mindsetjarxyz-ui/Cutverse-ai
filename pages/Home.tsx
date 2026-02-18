import React, { useState } from 'react';
import { Tool, ToolCategory } from '../types';
import ToolCard from '../components/ToolCard';
import { Sparkles, Zap, ShieldCheck, Search } from 'lucide-react';

interface HomeProps {
  tools: Tool[];
  activeCategory: ToolCategory;
  onToolClick: (tool: Tool) => void;
}

const Home: React.FC<HomeProps> = ({ tools, activeCategory, onToolClick }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTools = tools.filter(t => {
    // Category Filter
    const matchesCategory = activeCategory === ToolCategory.ALL || t.category === activeCategory;
    
    // Search Filter
    const matchesSearch = searchQuery === '' 
      ? true 
      : t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        t.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      
      {/* Hero Section */}
      {activeCategory === ToolCategory.ALL && (
        <section className="text-center space-y-6 py-16 px-4 relative overflow-hidden rounded-3xl bg-navy-800 border border-white/5">
          {/* Background Glows */}
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-4 tracking-tight">
              Create with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Cutverse AI</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto font-light mb-8">
              Professional AI tools for everyone. Free, unlimited, and no login required.
            </p>
            
            {/* Home Search Bar */}
            <div className="max-w-2xl mx-auto mb-10 relative group">
               <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="text-gray-500 group-focus-within:text-primary transition-colors" size={20} />
               </div>
               <input 
                 type="text"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full bg-navy-900/80 backdrop-blur border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-xl"
                 placeholder="What do you want to create today? (e.g., Essay, Image, YouTube)..."
               />
            </div>

            <div className="flex flex-wrap justify-center gap-8 mt-6">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-300">
                <div className="p-1.5 rounded-full bg-blue-500/20 text-blue-400"><Zap size={14} /></div>
                <span>Lightning Fast</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-gray-300">
                <div className="p-1.5 rounded-full bg-green-500/20 text-green-400"><ShieldCheck size={14} /></div>
                <span>Privacy First</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-gray-300">
                <div className="p-1.5 rounded-full bg-purple-500/20 text-purple-400"><Sparkles size={14} /></div>
                <span>Top Quality AI</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Grid */}
      <section>
        <div className="flex items-center justify-between mb-6 px-2">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            {searchQuery ? 'Search Results' : (activeCategory === ToolCategory.ALL ? 'All Available Tools' : activeCategory)}
            <span className="text-sm font-normal text-gray-400 ml-2 bg-navy-800 px-2 py-0.5 rounded-full border border-white/10">
              {filteredTools.length}
            </span>
          </h2>
        </div>

        {filteredTools.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTools.map(tool => (
                <ToolCard 
                  key={tool.id} 
                  tool={tool} 
                  onClick={() => onToolClick(tool)} 
                />
              ))}
            </div>
        ) : (
            <div className="text-center py-20 text-gray-500 bg-navy-800/30 rounded-2xl border border-white/5 border-dashed">
                <Search size={48} className="mx-auto mb-4 opacity-20" />
                <p className="text-lg">No tools found matching "{searchQuery}"</p>
                <button 
                  onClick={() => setSearchQuery('')}
                  className="mt-4 text-primary hover:underline"
                >
                  Clear search
                </button>
            </div>
        )}
      </section>
    </div>
  );
};

export default Home;