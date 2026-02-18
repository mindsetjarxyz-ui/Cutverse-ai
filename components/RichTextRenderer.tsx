
import React from 'react';

interface RichTextRendererProps {
  content: string;
  className?: string;
}

export const RichTextRenderer: React.FC<RichTextRendererProps> = ({ content, className = '' }) => {
  if (!content) return null;

  const parseBold = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
        return <strong key={index} className="text-white font-bold">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  const lines = content.split('\n');

  return (
    <div className={`space-y-3 text-gray-300 ${className}`}>
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={i} className="h-1" />;

        if (trimmed.startsWith('### ')) return <h3 key={i} className="text-lg font-bold text-white mt-4 mb-1">{parseBold(trimmed.replace('### ', ''))}</h3>;
        if (trimmed.startsWith('## ')) return <h2 key={i} className="text-xl font-bold text-white mt-6 mb-2">{parseBold(trimmed.replace('## ', ''))}</h2>;
        if (trimmed.startsWith('# ')) return <h1 key={i} className="text-2xl font-bold text-white mt-6 mb-3 border-b border-white/10 pb-2">{parseBold(trimmed.replace('# ', ''))}</h1>;

        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          return (
            <div key={i} className="flex gap-3 ml-2">
              <span className="text-primary mt-1.5 text-[10px]">●</span>
              <p className="flex-1 leading-relaxed">{parseBold(trimmed.substring(2))}</p>
            </div>
          );
        }

        if (/^\d+\.\s/.test(trimmed)) {
           const match = trimmed.match(/^(\d+)\.\s(.*)/);
           if (match) {
               return (
                   <div key={i} className="flex gap-3 ml-2">
                       <span className="text-primary font-bold min-w-[20px]">{match[1]}.</span>
                       <p className="flex-1 leading-relaxed">{parseBold(match[2])}</p>
                   </div>
               );
           }
        }

        if (trimmed.startsWith('> ')) {
            return (
                <div key={i} className="border-l-4 border-primary/40 pl-4 py-2 my-2 bg-primary/5 rounded-r-lg">
                    <p className="italic text-gray-400">{parseBold(trimmed.substring(2))}</p>
                </div>
            );
        }

        return <p key={i} className="leading-relaxed">{parseBold(line)}</p>;
      })}
    </div>
  );
};

export default RichTextRenderer;
