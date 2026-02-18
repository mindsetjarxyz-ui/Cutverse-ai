import React, { useState, useEffect, useMemo } from 'react';
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

const App: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<ToolCategory>(ToolCategory.ALL);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState(window.location.hash || '#/');

  // Listen for navigation changes
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPath(window.location.hash || '#/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (path: string) => {
    window.location.hash = path;
    setSidebarOpen(false);
  };

  const handleToolClick = (tool: Tool) => {
    navigate(tool.path);
  };

  const currentContent = useMemo(() => {
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
    
    // Student Tool Pattern Matching
    if (path.startsWith('/tools/student/')) {
      const studentTools: Record<string, { type: string, name: string }> = {
        'paragraph': { type: "Paragraph", name: "Paragraph Writer" },
        'essay': { type: "Academic Essay", name: "Essay Writer" },
        'composition': { type: "Creative Composition", name: "Composition Writer" },
        'letter': { type: "Letter", name: "Letter Writer" },
        'story': { type: "Short Story", name: "Story Writer" },
        'summary': { type: "Summary", name: "Summary Generator" },
        'grammar': { type: "Corrected and Improved Text", name: "Grammar Improver" },
        'speech': { type: "Speech", name: "Speech Writer" },
        'debate': { type: "Debate Arguments", name: "Debate Writer" },
        'application': { type: "Application", name: "Application Writer" }
      };
      const key = path.split('/').pop() || '';
      if (studentTools[key]) {
        return <StudentAIWriter toolType={studentTools[key].type} toolName={studentTools[key].name} />;
      }
    }

    // Direct Tool Routes
    switch (path) {
      case '/tools/writing/writer': return <ContentWriter title="AI Content Writer" />;
      case '/tools/writing/blog': return <ContentWriter initialType="Blog Post" title="Blog Post Creator" />;
      case '/tools/social/youtube-helper': return <YouTubeHelper />;
      case '/tools/social/youtube-script': return <YouTubeScriptWriter />;
      case '/tools/social/youtube-titles': return <YouTubeTitleGenerator />;
      case '/tools/social/youtube-desc': return <YouTubeDescriptionGenerator />;
      case '/tools/social/youtube-tags': return <YouTubeTagGenerator />;
      case '/tools/social/captions': return <ContentWriter initialType="Instagram Caption" title="Social Captions" />;
      case '/tools/image/generator': return <ImageGenerator />;
      case '/tools/image/enhance': return <PhotoEnhancer />;
      case '/tools/image/bg-remove': return <BackgroundRemover />;
      case '/tools/image/object-remover': return <ObjectRemover />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[70vh] text-center px-4">
            <div className="p-4 bg-navy-800 rounded-full mb-6">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Finding your tool...</h2>
            <p className="text-gray-500 mb-8 max-w-sm">If this takes too long, the tool might have been moved.</p>
            <button 
              onClick={() => navigate('/')}
              className="px-8 py-3 bg-primary text-navy-900 font-bold rounded-xl hover:bg-primary-hover transition-all"
            >
              Return Home
            </button>
          </div>
        );
    }
  }, [currentPath, activeCategory]);

  return (
    <div className="min-h-screen bg-navy-900 font-sans text-gray-100 selection:bg-primary/30 flex flex-col">
      <Navbar 
        onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
        onNavigate={navigate}
      />
      
      <Sidebar 
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          if (window.location.hash !== '#/') navigate('/');
        }}
        isOpen={sidebarOpen}
        onCloseMobile={() => setSidebarOpen(false)}
        onNavigate={navigate}
      />

      <main className={`
        pt-24 px-4 md:px-8 pb-12 transition-all duration-300
        lg:ml-64 min-h-screen flex flex-col
      `}>
        <div className="flex-grow max-w-7xl mx-auto w-full animate-in fade-in duration-500">
          {currentContent}
        </div>
        
        <footer className="mt-20 border-t border-white/5 py-10 text-center">
          <p className="text-gray-500 text-sm font-heading">
            © Cutverse™
          </p>
        </footer>
      </main>
    </div>
  );
};

export default App;