import React from 'react';
import { Tool } from '../types';
import { ArrowUpRight } from 'lucide-react';

interface ToolCardProps {
  tool: Tool;
  onClick: () => void;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="group relative bg-navy-800/50 rounded-2xl p-6 border border-white/5 hover:border-primary/30 hover:bg-navy-700/50 transition-all duration-300 cursor-pointer flex flex-col h-full overflow-hidden"
    >
      {/* Glow Effect */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[80px] group-hover:bg-primary/10 transition-all" />

      <div className="flex items-start justify-between mb-8">
        <div className="p-3.5 rounded-xl bg-navy-900/80 border border-white/5 text-primary group-hover:scale-110 group-hover:border-primary/20 transition-all duration-300">
          <tool.icon size={22} />
        </div>
        <div className="flex items-center gap-2">
          {tool.isNew && (
            <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[9px] font-bold uppercase tracking-[1px] border border-primary/20">
              New
            </span>
          )}
          <div className="p-1.5 rounded-lg text-gray-700 group-hover:text-primary transition-colors">
            <ArrowUpRight size={18} />
          </div>
        </div>
      </div>
      
      <div className="flex-1">
        <h3 className="font-heading font-bold text-lg text-gray-100 group-hover:text-white transition-colors mb-3">
          {tool.name}
        </h3>
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
          {tool.description}
        </p>
      </div>

      <div className="mt-8 pt-6 border-t border-white/5">
        <span className="text-[10px] uppercase font-bold tracking-[2px] text-gray-600 group-hover:text-gray-400 transition-colors">
          {tool.category}
        </span>
      </div>
    </div>
  );
};

export default ToolCard;