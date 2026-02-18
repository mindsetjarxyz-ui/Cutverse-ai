import React, { useState, useEffect, useRef } from 'react';
import { generateText } from '../../services/aiService';
import { Youtube, Tag, AlignLeft, RefreshCw, Copy, Check, FileText, ArrowLeft } from 'lucide-react';
import RichTextRenderer from '../../components/RichTextRenderer';

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
    setTabData(prev => ({ ...prev, [activeTab]: { ...prev[activeTab], ...updates } }));
  };

  useEffect(() => {
    const fullResult = tabData[activeTab].result;
    if (!fullResult) { setDisplayedResult(''); return; }
    if (typeIntervalRef.current) window.clearInterval(typeIntervalRef.current);
    let currentIndex = 0;
    setDisplayedResult('');
    typeIntervalRef.current = window.setInterval(() => {
      const chunkSize = 35; // Fast typewriter
      const nextIndex = Math.min(currentIndex + chunkSize, fullResult.length);
      setDisplayedResult(fullResult.substring(0, nextIndex));
      currentIndex = nextIndex;
      if (currentIndex >= fullResult.length) { if (typeIntervalRef.current) window.clearInterval(typeIntervalRef.current); }
    }, 10); 
    return () => { if (typeIntervalRef.current) window.clearInterval(typeIntervalRef.current); };
  }, [tabData[activeTab].result, activeTab]);

  const handleGenerate = async () => {
    const currentInput = tabData[activeTab].input;
    if (!currentInput) return;
    setLoading(true);
    updateCurrentTab({ result: '' });
    try {
      let prompt = '';
      if (activeTab === 'titles') { prompt = `Generate 5 viral YouTube titles for: "${currentInput}". Use plain text only.`; }
      else if (activeTab === 'script') { prompt = `Write an engaging YouTube script for: "${currentInput}". Use plain text headers.`; }
      else if (activeTab === 'description') { prompt = `Write an SEO description for: "${currentInput}". Use plain text only.`; }
      else if (activeTab === 'tags') { prompt = `Generate 30 SEO tags for: "${currentInput}". Separate by commas. Plain text only.`; }
      
      const text = await generateText(prompt, "You are a YouTube expert. Do not use markdown symbols.");
      updateCurrentTab({ result: text });
    } catch (e) { alert("Error generating content."); } finally { setLoading(false); }
  };

  const currentData = tabData[activeTab];

  return (
    <div className="max-w-6xl mx-auto pb-10 px-4">
      <button 
        onClick={() => window.location.hash = '#/'} 
        className="flex items-center text-xs font-bold text-gray-500 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft size={16} className="mr-2" /> 
        Back to Tools
      </button>

      <div className="mb-8 text-center md:text-left">
        <h1 className="text-3xl font-heading font-bold text-white mb-2">YouTube All-in-One</h1>
        <p className="text-gray-400">Optimize your channel for explosive growth.</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-8 bg-navy-800 p-2 rounded-2xl border border-white/5 shadow-xl">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as Tab);
              setCopied(false);
            }}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-bold transition-all flex-1 justify-center tracking-tight
              ${activeTab === tab.id ? 'bg-red-600 text-white shadow-lg shadow-red-900/20' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}
          >
            <tab.icon size={16} />
            <span className="hidden sm:inline uppercase">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4">
          <div className="bg-navy-800 p-6 rounded-3xl border border-white/5 space-y-4 shadow-xl">
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Enter Video Topic</label>
            <textarea
              className="w-full rounded-2xl border-white/10 border p-4 text-sm bg-navy-950/50 text-gray-200 min-h-[180px] placeholder-gray-700 focus:border-red-500/50 outline-none transition-all"
              placeholder="e.g. My travel vlog to Japan..."
              value={currentData.input}
              onChange={(e) => updateCurrentTab({ input: e.target.value })}
            ></textarea>
            <button
              onClick={handleGenerate}
              disabled={loading || !currentData.input}
              className="w-full py-4 bg-red-600 text-white rounded-2xl font-bold shadow-lg shadow-red-900/30 flex items-center justify-center gap-2 hover:bg-red-500 transition-all active:scale-[0.98]"
            >
              {loading ? <RefreshCw className="animate-spin" size={20} /> : <Youtube size={20} />}
              {loading ? 'Processing...' : 'Generate Content'}
            </button>
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className="bg-navy-800 rounded-3xl border border-white/5 shadow-xl min-h-[500px] flex flex-col h-full relative overflow-hidden">
            <div className="border-b border-white/5 p-4 flex items-center justify-between bg-navy-800/50">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{activeTab} RESULT</span>
              <button 
                onClick={() => { navigator.clipboard.writeText(currentData.result); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                disabled={!currentData.result}
                className="p-2 text-gray-500 hover:text-white rounded-lg transition-all"
              >
                {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
              </button>
            </div>
            <div className="p-8 flex-grow overflow-y-auto whitespace-pre-wrap text-gray-300 font-sans leading-relaxed">
              {displayedResult ? (
                displayedResult
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-800">
                  <Youtube size={48} className="opacity-10 mb-4" />
                  <p className="text-sm font-bold">Optimization results will appear here</p>
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