import React from 'react';
import { Tool, ToolCategory } from '../types';
import ToolCard from '../components/ToolCard';
import { Zap, Shield, Star } from 'lucide-react';

interface HomeProps {
  tools: Tool[];
  activeCategory: ToolCategory;
  onToolClick: (tool: Tool) => void;
}

const Home: React.FC<HomeProps> = ({ tools, activeCategory, onToolClick }) => {
  const filteredTools = tools.filter(t => {
    return activeCategory === ToolCategory.ALL || t.category === activeCategory;
  });

  return (
    <div className="w-full pb-20">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center pt-10 pb-20">
        <h1 className="text-5xl md:text-7xl font-heading font-bold text-white mb-6 tracking-tight leading-tight">
          Create with <span className="hero-gradient">Cutverse AI</span>
        </h1>
        <p className="text-gray-400 text-lg md:text-xl font-medium mb-12 max-w-2xl mx-auto">
          Professional AI tools for everyone.
        </p>
        
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
          <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-widest bg-primary/5 px-5 py-2.5 rounded-full border border-primary/20">
            <Zap size={14} fill="currentColor" />
            Lightning Fast
          </div>
          <div className="flex items-center gap-2 text-green-500 font-bold text-[10px] uppercase tracking-widest bg-green-500/5 px-5 py-2.5 rounded-full border border-green-500/20">
            <Shield size={14} fill="currentColor" />
            Privacy First
          </div>
          <div className="flex items-center gap-2 text-purple-500 font-bold text-[10px] uppercase tracking-widest bg-purple-500/5 px-5 py-2.5 rounded-full border border-purple-500/20">
            <Star size={14} fill="currentColor" />
            Top Quality AI
          </div>
        </div>
      </div>

      {/* Grid Container */}
      <div className="max-w-6xl mx-auto px-4 md:px-0">
        <div className="flex items-center gap-3 mb-10">
          <h2 className="text-2xl font-heading font-bold text-white">{activeCategory}</h2>
          <span className="bg-navy-800 text-gray-500 px-2.5 py-1 rounded-lg text-[11px] font-bold border border-white/5">
            {filteredTools.length}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
          {filteredTools.map(tool => (
            <ToolCard 
              key={tool.id} 
              tool={tool} 
              onClick={() => onToolClick(tool)} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;