import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import ContentWriter from './pages/tools/ContentWriter';
import ImageGenerator from './pages/tools/ImageGenerator';
import YouTubeHelper from './pages/tools/YouTubeHelper';
import YouTubeScriptWriter from './pages/tools/YouTubeScriptWriter';
import YouTubeTitleGenerator from './pages/tools/YouTubeTitleGenerator';
import YouTubeDescriptionGenerator from './pages/tools/YouTubeDescriptionGenerator';
import YouTubeTagGenerator from './pages/tools/YouTubeTagGenerator';
import PhotoEnhancer from './pages/tools/PhotoEnhancer';
import BackgroundRemover from './pages/tools/BackgroundRemover';
import ObjectRemover from './pages/tools/ObjectRemover';
import StudentAIWriter from './pages/tools/StudentAIWriter';
import { Tool, ToolCategory } from './types';
import { TOOLS } from './constants';
import { MessageSquare } from 'lucide-react';

const App: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<ToolCategory>(ToolCategory.ALL);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState(window.location.hash || '#/');

  // Handle hash routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || '#/';
      setCurrentPath(hash);
      window.scrollTo(0, 0);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (path: string) => {
    window.location.hash = path;
  };

  const handleToolClick = (tool: Tool) => {
    navigate(tool.path);
  };

  // Router logic
  const renderContent = () => {
    const path = currentPath.replace('#', '');
    
    if (path === '/' || path === '') {
      return (
        <Home 
          tools={TOOLS} 
          activeCategory={activeCategory} 
          onToolClick={handleToolClick} 
        />
      );
    }
    
    // Student AI Tools
    if (path.includes('/tools/student/paragraph')) return <StudentAIWriter toolType="Paragraph" toolName="Paragraph Writer" />;
    if (path.includes('/tools/student/essay')) return <StudentAIWriter toolType="Academic Essay" toolName="Essay Writer" />;
    if (path.includes('/tools/student/composition')) return <StudentAIWriter toolType="Creative Composition" toolName="Composition Writer" />;
    if (path.includes('/tools/student/letter')) return <StudentAIWriter toolType="Letter" toolName="Letter Writer" />;
    if (path.includes('/tools/student/story')) return <StudentAIWriter toolType="Short Story" toolName="Story Writer" />;
    if (path.includes('/tools/student/summary')) return <StudentAIWriter toolType="Summary" toolName="Summary Generator" />;
    if (path.includes('/tools/student/grammar')) return <StudentAIWriter toolType="Corrected and Improved Text" toolName="Grammar Improver" />;
    if (path.includes('/tools/student/speech')) return <StudentAIWriter toolType="Speech" toolName="Speech Writer" />;
    if (path.includes('/tools/student/debate')) return <StudentAIWriter toolType="Debate Arguments" toolName="Debate Writer" />;

    // Writing Tools
    if (path.includes('/tools/writing/writer')) return <ContentWriter title="AI Content Writer" />;
    if (path.includes('/tools/writing/blog')) return <ContentWriter initialType="Blog Post" title="Blog Post Creator" />;
    
    // Social Tools
    if (path.includes('/tools/social/youtube-helper')) return <YouTubeHelper />;
    if (path.includes('/tools/social/youtube-script')) return <YouTubeScriptWriter />;
    if (path.includes('/tools/social/youtube-titles')) return <YouTubeTitleGenerator />;
    if (path.includes('/tools/social/youtube-desc')) return <YouTubeDescriptionGenerator />;
    if (path.includes('/tools/social/youtube-tags')) return <YouTubeTagGenerator />;
    if (path.includes('/tools/social/captions')) return <ContentWriter initialType="Instagram Caption" title="Social Captions" />;
    
    // Image Tools
    if (path.includes('/tools/image/generator')) return <ImageGenerator />;
    if (path.includes('/tools/image/enhance')) return <PhotoEnhancer />;
    if (path.includes('/tools/image/bg-remove')) return <BackgroundRemover />;
    if (path.includes('/tools/image/object-remover')) return <ObjectRemover />;
    
    // Fallback
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4 text-gray-300">
        <h2 className="text-2xl font-bold mb-2">Page Not Found</h2>
        <button 
          onClick={() => navigate('/')}
          className="px-6 py-2 bg-primary text-navy-900 font-bold rounded-lg hover:bg-primary-hover mt-4"
        >
          Go Home
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-[#0f172a] to-navy-900 font-sans text-gray-100 selection:bg-primary/30 flex flex-col">
      <Navbar 
        onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
        onNavigate={navigate}
      />
      
      <Sidebar 
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          if (currentPath !== '#/') navigate('/');
        }}
        isOpen={sidebarOpen}
        onCloseMobile={() => setSidebarOpen(false)}
        onNavigate={navigate}
      />

      <main className={`
        pt-24 px-4 md:px-8 pb-12 transition-all duration-300
        lg:ml-64 min-h-screen flex flex-col
      `}>
        <div className="flex-grow">
          {renderContent()}
        </div>
        
        <footer className="mt-16 border-t border-white/5 pt-8 pb-4 text-center">
          <p className="text-gray-500 text-sm font-medium">
            &copy; Cutverse AI&trade;
          </p>
        </footer>
      </main>
    </div>
  );
};

export default App;