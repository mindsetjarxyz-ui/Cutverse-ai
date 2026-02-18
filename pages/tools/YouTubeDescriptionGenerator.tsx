import React, { useState, useRef, useEffect } from 'react';
import { generateText } from '../../services/aiService';
import { AlignLeft, RefreshCw, Copy, Check, ArrowLeft } from 'lucide-react';

const YouTubeDescriptionGenerator: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [result, setResult] = useState('');
  const [displayedResult, setDisplayedResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const typeIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!result) { setDisplayedResult(''); return; }
    if (typeIntervalRef.current) window.clearInterval(typeIntervalRef.current);
    let currentIndex = 0;
    setDisplayedResult('');
    typeIntervalRef.current = window.setInterval(() => {
      const chunkSize = 25; 
      const nextIndex = Math.min(currentIndex + chunkSize, result.length);
      setDisplayedResult(result.substring(0, nextIndex));
      currentIndex = nextIndex;
      if (currentIndex >= result.length) { if (typeIntervalRef.current) window.clearInterval(typeIntervalRef.current); }
    }, 10); 
    return () => { if (typeIntervalRef.current) window.clearInterval(typeIntervalRef.current); };
  }, [result]);

  const handleGenerate = async () => {
    if (!topic) return;
    setLoading(true);
    setResult('');
    try {
      const prompt = `Write an SEO-friendly YouTube description for: "${topic}". Use plain text only, no markdown symbols.`;
      const text = await generateText(prompt, "YouTube SEO expert.");
      setResult(text);
    } catch (e) { alert("Error generating description."); } finally { setLoading(false); }
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      <button 
        onClick={() => window.location.hash = '#/'} 
        className="flex items-center text-xs font-bold text-gray-500 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft size={16} className="mr-2" /> 
        Back to Tools
      </button>

      <div className="mb-8 text-center md:text-left">
        <h1 className="text-3xl font-heading font-bold text-white mb-2">YouTube Description Generator</h1>
        <p className="text-gray-400">SEO-optimized descriptions in seconds.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-navy-800 p-6 rounded-2xl border border-white/5 shadow-xl">
            <textarea
              className="w-full rounded-xl border-white/10 border p-4 text-sm bg-navy-900 text-gray-200 min-h-[150px] placeholder-gray-600 mb-4 focus:outline-none focus:border-primary/40 transition-all"
              placeholder="What is your video about?"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            ></textarea>
            <button
              onClick={handleGenerate}
              disabled={loading || !topic}
              className="w-full py-4 bg-red-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-500 transition-all shadow-lg shadow-red-900/20"
            >
              {loading ? <RefreshCw className="animate-spin" size={20} /> : <AlignLeft size={20} />}
              {loading ? 'Writing...' : 'Generate Description'}
            </button>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-navy-800 rounded-2xl border border-white/5 shadow-xl min-h-[500px] flex flex-col h-full relative">
            <div className="border-b border-white/5 p-4 flex items-center justify-between bg-navy-800/50">
              <h3 className="text-xs font-bold text-gray-400">Result</h3>
              <button onClick={() => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); }} disabled={!result} className="p-2 text-gray-400 hover:text-white transition-colors">
                {copied ? <Check size={18} /> : <Copy size={18} />}
              </button>
            </div>
            <div className="p-8 flex-grow overflow-y-auto whitespace-pre-wrap text-gray-300 font-sans leading-relaxed">
              {displayedResult ? (
                displayedResult
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-700">
                  <AlignLeft size={32} className="opacity-20 mb-4" />
                  <p className="text-sm font-medium">Description will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YouTubeDescriptionGenerator;