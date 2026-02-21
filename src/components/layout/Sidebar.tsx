import { useEffect } from 'react';
import { 
  LayoutGrid, 
  GraduationCap, 
  PenTool, 
  Image, 
  Youtube,
  X
} from 'lucide-react';
import { cn } from '@/utils/cn';

interface SidebarProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const categories = [
  { id: 'all', label: 'All Tools', icon: LayoutGrid },
  { id: 'student', label: 'Student AI', icon: GraduationCap },
  { id: 'writer', label: 'AI Writing', icon: PenTool },
  { id: 'image', label: 'AI Image', icon: Image },
  { id: 'social', label: 'Social Media', icon: Youtube },
];

export function Sidebar({ activeCategory, onCategoryChange, isOpen, onToggle }: SidebarProps) {
  // Lock body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isOpen && window.innerWidth < 1024) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
      document.documentElement.style.overflow = '';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
      document.documentElement.style.overflow = '';
    };
  }, [isOpen]);

  const handleCategoryClick = (catId: string) => {
    onCategoryChange(catId);
    // Always close on mobile
    if (window.innerWidth < 1024) {
      onToggle();
    }
  };

  return (
    <>
      {/* Mobile overlay - prevents scrolling background */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onToggle}
          onTouchMove={(e) => e.preventDefault()}
          style={{ touchAction: 'none' }}
        />
      )}
      
      {/* Sidebar */}
      <aside className={cn(
        'fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-slate-900 to-slate-950 border-r border-slate-800 z-50 transform transition-transform duration-300 ease-out lg:translate-x-0',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        {/* Logo with Close Button */}
        <div className="p-4 sm:p-6 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <span className="text-white font-bold text-base sm:text-lg">C</span>
              </div>
              <div>
                <h1 className="text-white font-bold text-base sm:text-lg">Cutverse AI</h1>
                <p className="text-slate-500 text-[10px] sm:text-xs">AI Tools Platform</p>
              </div>
            </div>
            
            {/* Close button - visible on mobile when sidebar is open */}
            <button
              onClick={onToggle}
              className="lg:hidden p-2 bg-slate-800 hover:bg-red-500/20 hover:text-red-400 rounded-lg text-slate-400 transition-all duration-200 active:scale-95"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="p-3 sm:p-4 space-y-1">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className={cn(
                'w-full flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-left transition-all duration-200',
                activeCategory === cat.id 
                  ? 'bg-gradient-to-r from-blue-600/20 to-indigo-600/20 text-white border border-blue-500/30 shadow-lg shadow-blue-500/10' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              )}
            >
              <cat.icon className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium text-sm sm:text-base">{cat.label}</span>
            </button>
          ))}
        </nav>
        
        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 border-t border-slate-800">
          <p className="text-slate-500 text-[10px] sm:text-xs text-center">© Cutverse™ - All Rights Reserved</p>
        </div>
      </aside>
    </>
  );
}
