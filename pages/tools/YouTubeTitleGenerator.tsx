import React, { useState, useRef, useEffect } from 'react';
import { generateText } from '../../services/geminiService';
import { Type, RefreshCw, Copy, Check } from 'lucide-react';
import RichTextRenderer from '../../components/RichTextRenderer';

const YouTubeTitleGenerator: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [result, setResult] = useState('');
  const [displayedResult, setDisplayedResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const typeIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!result) {
      setDisplayedResult('');
      return;
    }
    if (typeIntervalRef.current) window.clearInterval(typeIntervalRef.current);
    let currentIndex = 0;
    setDisplayedResult('');
    typeIntervalRef.current = window.setInterval(() => {
      const chunkSize = 15; 
      const nextIndex = Math.min(currentIndex + chunkSize, result.length);
      setDisplayedResult(result.substring(0, nextIndex));
      currentIndex = nextIndex;
      if (currentIndex >= result.length) {
        if (typeIntervalRef.current) window.clearInterval(typeIntervalRef.current);
      }
    }, 5); 
    return () => { if (typeIntervalRef.current) window.clearInterval(typeIntervalRef.current); };
  }, [result]);

  const handleGenerate = async () => {
    if (!topic) return;
    setLoading(true);
    setResult('');
    try {
      const prompt = `Generate exactly 10 clickbait-style, highly engaging, and viral YouTube titles for a video about: "${topic}". Make them catchy but relevant. Format as a numbered list. Use **bold** for the most important words in each title to make them stand out.`;
      const text = await generateText(prompt, "You are a viral YouTube title expert.");
      setResult(text);
    } catch (e) {
      alert("Error generating titles.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-white mb-2">YouTube Title Generator</h1>
        <p className="text-gray-400">Generate viral, click-worthy titles to boost your CTR.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-navy-800 p-6 rounded-2xl border border-white/5 shadow-lg">
            <label className="block text-sm font-medium text-gray-300 mb-2">Video Topic</label>
            <textarea
              className="w-full rounded-xl border-white/10 border p-3 text-sm focus:ring-primary focus:border-primary min-h-[150px] bg-navy-900 text-gray-200 placeholder-gray-600 mb-4"
              placeholder="e.g. Street food in Japan..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            ></textarea>
            <button
              onClick={handleGenerate}
              disabled={loading || !topic}
              className="w-full py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2"
            >
              {loading ? <RefreshCw className="animate-spin" size={20} /> : <Type size={20} />}
              {loading ? 'Thinking...' : 'Generate Titles'}
            </button>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-navy-800 rounded-2xl border border-white/5 shadow-lg min-h-[500px] flex flex-col h-full">
            <div className="border-b border-white/5 p-4 flex items-center justify-between">
              <h3 className="font-semibold text-gray-300">Best Titles</h3>
              <button 
                onClick={() => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                disabled={!result}
                className="p-2 text-gray-400 hover:text-white bg-navy-900 rounded-lg transition-colors border border-white/5"
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
              </button>
            </div>
            <div className="p-6 flex-grow overflow-y-auto">
              {displayedResult ? (
                <RichTextRenderer content={displayedResult} />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-500">
                  <Type size={32} className="opacity-20 mb-4" />
                  <p>Generated titles will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YouTubeTitleGenerator;