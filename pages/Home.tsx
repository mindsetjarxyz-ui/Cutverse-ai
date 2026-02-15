import React from 'react';
import { Tool, ToolCategory } from '../types';
import ToolCard from '../components/ToolCard';
import { Sparkles, Zap, ShieldCheck } from 'lucide-react';

interface HomeProps {
  tools: Tool[];
  activeCategory: ToolCategory;
  onToolClick: (tool: Tool) => void;
}

const Home: React.FC<HomeProps> = ({ tools, activeCategory, onToolClick }) => {
  const filteredTools = activeCategory === ToolCategory.ALL 
    ? tools 
    : tools.filter(t => t.category === activeCategory);

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
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto font-light">
              Professional AI tools for everyone. Free, unlimited, and no login required.
            </p>
            
            <div className="flex flex-wrap justify-center gap-8 mt-10">
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
            {activeCategory === ToolCategory.ALL ? 'All Available Tools' : activeCategory}
            <span className="text-sm font-normal text-gray-400 ml-2 bg-navy-800 px-2 py-0.5 rounded-full border border-white/10">
              {filteredTools.length}
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map(tool => (
            <ToolCard 
              key={tool.id} 
              tool={tool} 
              onClick={() => onToolClick(tool)} 
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
