import React, { useState, useEffect, useRef } from 'react';
import { generateText } from '../../services/geminiService';
import { Youtube, Tag, AlignLeft, RefreshCw, Copy, Check, PlusCircle, Trash2, FileText } from 'lucide-react';

type Tab = 'titles' | 'description' | 'script' | 'tags';

interface TabData {
  input: string;
  result: string;
}

const YouTubeHelper: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('titles');
  
  const [tabData, setTabData] = useState<Record<Tab, TabData>>({
    titles: { input: '', result: '' },
    description: { input: '', result: '' },
    script: { input: '', result: '' },
    tags: { input: '', result: '' },
  });

  const [displayedResult, setDisplayedResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const typeIntervalRef = useRef<number | null>(null);

  const tabs = [
    { id: 'titles', label: 'Title Generator', icon: Youtube },
    { id: 'script', label: 'Script Writer', icon: FileText },
    { id: 'description', label: 'Description Generator', icon: AlignLeft },
    { id: 'tags', label: 'Tag Generator', icon: Tag },
  ];

  const updateCurrentTab = (updates: Partial<TabData>) => {
    setTabData(prev => ({
      ...prev,
      [activeTab]: { ...prev[activeTab], ...updates }
    }));
  };

  const handleClearTitle = () => {
    setTabData(prev => ({
      ...prev,
      titles: { input: '', result: '' }
    }));
  };

  useEffect(() => {
    const fullResult = tabData[activeTab].result;

    if (!fullResult) {
      setDisplayedResult('');
      return;
    }

    if (typeIntervalRef.current) window.clearInterval(typeIntervalRef.current);

    let currentIndex = 0;
    setDisplayedResult('');

    typeIntervalRef.current = window.setInterval(() => {
      const chunkSize = 8; 
      const nextIndex = Math.min(currentIndex + chunkSize, fullResult.length);
      
      setDisplayedResult(fullResult.substring(0, nextIndex));
      currentIndex = nextIndex;

      if (currentIndex >= fullResult.length) {
        if (typeIntervalRef.current) window.clearInterval(typeIntervalRef.current);
      }
    }, 5); 

    return () => {
      if (typeIntervalRef.current) window.clearInterval(typeIntervalRef.current);
    };
  }, [tabData[activeTab].result, activeTab]);

  const getInputPlaceholder = () => {
      switch(activeTab) {
          case 'titles': return "Enter your video topic (e.g. 'Street Food in Japan')...";
          case 'script': return "Enter video topic, key points, or title...";
          case 'description': return "Paste your video title here...";
          case 'tags': return "Enter video title or main keyword...";
          default: return "";
      }
  }

  const handleGenerate = async () => {
    const currentInput = tabData[activeTab].input;

    setLoading(true);
    updateCurrentTab({ result: '' });
    
    try {
      let prompt = '';
      let systemInstruction = "You are a YouTube growth and SEO expert.";
      
      if (activeTab === 'titles') {
        prompt = `Generate exactly 5 clickbait-style, highly engaging, and viral YouTube titles for a video about: "${currentInput}". Make them catchy but relevant.`;
      } else if (activeTab === 'script') {
        prompt = `Write a complete, engaging YouTube video script for a video about: "${currentInput}". 
        Structure:
        1. Hook (0-30s): Grab attention immediately.
        2. Intro: Briefly state what the video is about.
        3. Content Body: Break down into 3-5 key sections/steps.
        4. Engagement: Remind to like/subscribe in a natural way.
        5. Conclusion & CTA: Summary and what to watch next.
        Tone: Energetic, conversational, and audience-focused.`;
      } else if (activeTab === 'description') {
        prompt = `Write a full, SEO-optimized YouTube video description for a video titled: "${currentInput}". Include an engaging introduction, bullet points for what is covered, and placeholders for timestamps and social links.`;
      } else if (activeTab === 'tags') {
        prompt = `Generate a comma-separated list of 30 high-volume, low-competition SEO tags/keywords for a YouTube video titled: "${currentInput}".`;
      }

      const text = await generateText(prompt, systemInstruction);
      updateCurrentTab({ result: text });
    } catch (e) {
      console.error(e);
      alert("Error generating content. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const currentData = tabData[activeTab];

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-white mb-2">YouTube All-in-One</h1>
        <p className="text-gray-400">Everything you need to optimize your videos and grow your channel.</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 bg-navy-800 p-2 rounded-xl border border-white/5 shadow-lg">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as Tab)}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all flex-1 justify-center
              ${activeTab === tab.id 
                ? 'bg-red-600 text-white shadow-md' 
                : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'}`}
          >
            <tab.icon size={18} />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Controls */}
        <div className="lg:col-span-1">
          <div className="bg-navy-800 p-6 rounded-2xl border border-white/5 shadow-lg space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-300">
                  {activeTab === 'description' || activeTab === 'tags' ? 'Video Title' : 'Video Topic'}
                </label>
                {activeTab === 'titles' && currentData.input && (
                    <button 
                      onClick={handleClearTitle}
                      className="text-xs flex items-center gap-1 text-red-400 hover:text-red-300"
                    >
                      <Trash2 size={12} /> Clear
                    </button>
                )}
              </div>
              <textarea
                className="w-full rounded-xl border-white/10 border p-3 text-sm focus:ring-primary focus:border-primary min-h-[150px] bg-navy-900 text-gray-200 resize-none placeholder-gray-600"
                placeholder={getInputPlaceholder()}
                value={currentData.input}
                onChange={(e) => updateCurrentTab({ input: e.target.value })}
              ></textarea>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleGenerate}
                disabled={loading || !currentData.input}
                className="w-full py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl font-medium shadow-lg hover:shadow-red-500/20 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? <RefreshCw className="animate-spin" size={20} /> : <Youtube size={20} />}
                {loading ? 'Processing...' : 'Generate'}
              </button>

              {activeTab === 'titles' && (
                <button
                  onClick={handleClearTitle}
                  className="w-full py-3 bg-navy-900 border border-white/10 text-gray-300 rounded-xl font-medium hover:bg-navy-700 transition-colors flex items-center justify-center gap-2"
                >
                  <PlusCircle size={20} />
                  New Title
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Output */}
        <div className="lg:col-span-2">
          <div className="bg-navy-800 rounded-2xl border border-white/5 shadow-lg min-h-[500px] flex flex-col h-full relative">
            <div className="border-b border-white/5 p-4 flex items-center justify-between">
              <h3 className="font-semibold text-gray-300">Result</h3>
              <button 
                onClick={() => { navigator.clipboard.writeText(currentData.result); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                disabled={!currentData.result}
                className="p-2 text-gray-400 hover:text-primary hover:bg-white/5 rounded-lg transition-colors"
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
              </button>
            </div>
            <div className="p-6 flex-grow overflow-y-auto">
              {displayedResult ? (
                <div className="prose prose-invert prose-sm max-w-none text-gray-300 whitespace-pre-line">
                  {displayedResult}
                  {displayedResult.length < currentData.result.length && (
                     <span className="inline-block w-2 h-4 bg-primary ml-1 animate-pulse"/>
                  )}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-500">
                  <Youtube size={32} className="opacity-20 mb-4" />
                  <p>Generated content will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YouTubeHelper;