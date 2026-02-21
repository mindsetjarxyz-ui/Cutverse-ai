import { useState, useMemo } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { ToolCard } from '@/components/layout/ToolCard';
import { tools, Tool } from '@/data/tools';
import { StudentToolWrapper } from '@/components/tools/StudentTools';
import { WriterToolWrapper } from '@/components/tools/WriterTools';
import { ImageToolWrapper } from '@/components/tools/ImageTools';
import { SocialToolWrapper } from '@/components/tools/SocialTools';
import { Zap, Shield, Sparkles } from 'lucide-react';

export function App() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeTool, setActiveTool] = useState<Tool | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filteredTools = useMemo(() => {
    let filtered = tools;
    
    // Only filter by category - NO search filtering in the grid
    // Search results are shown ONLY in the dropdown
    if (activeCategory !== 'all') {
      filtered = filtered.filter(tool => tool.category === activeCategory);
    }
    
    return filtered;
  }, [activeCategory]);

  const categoryTitles: Record<string, string> = {
    all: 'All AI Tools',
    student: 'Student AI Tools',
    writer: 'AI Writing Tools',
    image: 'AI Image Tools',
    social: 'Social Media Tools'
  };

  const handleToolClick = (tool: Tool) => {
    setActiveTool(tool);
    setSearchQuery(''); // Clear search when selecting a tool
  };

  const handleBack = () => {
    setActiveTool(null);
  };

  const renderToolComponent = () => {
    if (!activeTool) return null;

    switch (activeTool.category) {
      case 'student':
        return <StudentToolWrapper toolId={activeTool.id} />;
      case 'writer':
        return <WriterToolWrapper toolId={activeTool.id} />;
      case 'image':
        return <ImageToolWrapper toolId={activeTool.id} />;
      case 'social':
        return <SocialToolWrapper toolId={activeTool.id} />;
      default:
        return <div className="text-slate-400">Tool not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Sidebar 
        activeCategory={activeCategory}
        onCategoryChange={(cat) => {
          setActiveCategory(cat);
          setActiveTool(null);
          setSearchQuery('');
        }}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      
      <main className="lg:ml-64 min-h-screen flex flex-col">
        <Header 
          title={activeTool ? activeTool.title : categoryTitles[activeCategory]}
          showBack={!!activeTool}
          onBack={handleBack}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onToolSelect={handleToolClick}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        />
        
        <div className="flex-1 p-3 sm:p-4 md:p-6">
          {activeTool ? (
            <div className="max-w-6xl mx-auto animate-fadeIn">
              <div className="mb-4 sm:mb-6">
                <p className="text-slate-400 text-xs sm:text-sm">{activeTool.description}</p>
              </div>
              {renderToolComponent()}
            </div>
          ) : (
            <>
              {/* Hero Section - Only show on All Tools */}
              {activeCategory === 'all' && !searchQuery && (
                <div className="mb-8 sm:mb-10 py-12 sm:py-16 md:py-24 px-4 sm:px-6 md:px-8 bg-gradient-to-br from-slate-900 via-blue-950/50 to-slate-900 border border-blue-500/20 rounded-2xl sm:rounded-3xl relative overflow-hidden">
                  {/* Animated background glow effects */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[100px] pointer-events-none animate-pulse" />
                  <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-[80px] pointer-events-none animate-pulse" style={{ animationDelay: '0.5s' }} />
                  <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[80px] pointer-events-none animate-pulse" style={{ animationDelay: '1s' }} />
                  <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-t from-slate-900/80 to-transparent pointer-events-none" />
                  
                  <div className="relative z-10 text-center">
                    {/* Big Gradient Cutverse AI Title with glow */}
                    <div className="relative inline-block">
                      {/* Glow behind text */}
                      <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-blue-500/50 via-indigo-500/50 to-purple-500/50 scale-150 animate-pulse" />
                      
                      <h1 className="relative text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black mb-2 tracking-tight">
                        <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent drop-shadow-2xl animate-gradient" style={{ backgroundSize: '200% 200%' }}>
                          Cutverse
                        </span>
                        <span className="bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-2xl animate-gradient ml-2 sm:ml-4" style={{ backgroundSize: '200% 200%', animationDelay: '0.5s' }}>
                          AI
                        </span>
                      </h1>
                    </div>
                    
                    {/* Tagline with subtle animation */}
                    <p className="text-slate-300 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-8 sm:mb-10 font-medium">
                      Professional AI tools for everyone
                    </p>
                    
                    {/* Feature badges */}
                    <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6">
                      <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30">
                          <Zap className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm sm:text-base font-semibold text-white">Lightning Fast</span>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
                          <Shield className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm sm:text-base font-semibold text-white">Privacy First</span>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/30">
                          <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm sm:text-base font-semibold text-white">Top Quality AI</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Tools Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {filteredTools.map(tool => (
                  <ToolCard
                    key={tool.id}
                    {...tool}
                    onClick={() => handleToolClick(tool)}
                  />
                ))}
              </div>
              
              {filteredTools.length === 0 && (
                <div className="text-center py-8 sm:py-12">
                  <p className="text-slate-400 text-sm sm:text-base">No tools available in this category.</p>
                </div>
              )}
            </>
          )}
        </div>
        
        {/* Footer */}
        <footer className="mt-auto py-4 sm:py-6 px-3 sm:px-4 border-t border-slate-800">
          <p className="text-center text-slate-500 text-xs sm:text-sm">
            © Cutverse™ - All Rights Reserved
          </p>
        </footer>
      </main>
    </div>
  );
}
