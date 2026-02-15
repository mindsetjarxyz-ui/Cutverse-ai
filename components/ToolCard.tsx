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
      className="group relative bg-navy-800 rounded-2xl p-6 border border-white/5 shadow-lg hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <ArrowUpRight size={20} className="text-gray-400" />
      </div>

      <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-navy-700 text-primary group-hover:bg-primary group-hover:text-navy-900 transition-colors duration-300 shadow-inner">
        <tool.icon size={24} />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-bold text-lg text-white group-hover:text-primary transition-colors">
            {tool.name}
          </h3>
          {tool.isNew && (
            <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-wide border border-primary/20">
              New
            </span>
          )}
        </div>
        
        <p className="text-sm text-gray-400 leading-relaxed line-clamp-2">
          {tool.description}
        </p>
      </div>

      <div className="mt-4 flex items-center text-xs font-medium text-gray-500">
        <span className="bg-navy-900/50 px-2 py-1 rounded-md border border-white/5">
          {tool.category}
        </span>
      </div>
    </div>
  );
};

export default ToolCard;
