import React from 'react';

interface RichTextRendererProps {
  content: string;
  className?: string;
}

export const RichTextRenderer: React.FC<RichTextRendererProps> = ({ content, className = '' }) => {
  if (!content) return null;

  // Helper to parse bold text (**text**)
  const parseBold = (text: string) => {
    // Split by bold markers, capturing the markers content
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
        return <strong key={index} className="text-white font-bold">{part.slice(2, -2)}</strong>;
      }
      // Also handle single asterisks for bold/italic mixed use scenarios often from AI
      const subParts = part.split(/(\*.*?\*)/g);
      return subParts.map((subPart, subIndex) => {
         if (subPart.startsWith('*') && subPart.endsWith('*') && subPart.length > 2) {
             return <em key={`${index}-${subIndex}`} className="text-gray-200 font-semibold not-italic">{subPart.slice(1, -1)}</em>;
         }
         return subPart;
      });
    });
  };

  const lines = content.split('\n');

  return (
    <div className={`space-y-2 text-gray-300 ${className}`}>
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={i} className="h-2" />;

        // Headings
        if (trimmed.startsWith('### ')) return <h3 key={i} className="text-lg font-bold text-white mt-4 mb-1">{parseBold(trimmed.replace('### ', ''))}</h3>;
        if (trimmed.startsWith('## ')) return <h2 key={i} className="text-xl font-bold text-white mt-6 mb-2">{parseBold(trimmed.replace('## ', ''))}</h2>;
        if (trimmed.startsWith('# ')) return <h1 key={i} className="text-2xl font-bold text-white mt-6 mb-3 border-b border-white/10 pb-2">{parseBold(trimmed.replace('# ', ''))}</h1>;

        // Bullet Lists
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          return (
            <div key={i} className="flex gap-3 ml-2">
              <span className="text-gray-400 mt-1.5 text-xs">●</span>
              <p className="flex-1 leading-relaxed">{parseBold(trimmed.substring(2))}</p>
            </div>
          );
        }

        // Numbered Lists
        if (/^\d+\.\s/.test(trimmed)) {
           const match = trimmed.match(/^(\d+)\.\s(.*)/);
           if (match) {
               return (
                   <div key={i} className="flex gap-3 ml-2">
                       <span className="text-white font-bold min-w-[20px]">{match[1]}.</span>
                       <p className="flex-1 leading-relaxed">{parseBold(match[2])}</p>
                   </div>
               );
           }
        }

        // Blockquotes
        if (trimmed.startsWith('> ')) {
            return (
                <div key={i} className="border-l-4 border-gray-600 pl-4 py-1 my-2 bg-white/5 rounded-r-lg">
                    <p className="italic text-gray-400">{parseBold(trimmed.substring(2))}</p>
                </div>
            );
        }

        // Regular Paragraphs
        return <p key={i} className="leading-relaxed min-h-[1.5em]">{parseBold(line)}</p>;
      })}
    </div>
  );
};

export default RichTextRenderer;