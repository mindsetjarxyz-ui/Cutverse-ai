import React, { useState, useEffect, useRef } from 'react';
import { generateText } from '../../services/aiService';
import { Copy, Download, RefreshCw, PenTool, Check, ArrowLeft } from 'lucide-react';

interface ContentWriterProps {
  initialType?: string;
  title?: string;
}

const ContentWriter: React.FC<ContentWriterProps> = ({ 
  initialType = 'Blog Post', 
  title = 'AI Content Writer' 
}) => {
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('Professional');
  const [wordCount, setWordCount] = useState('300');
  const [type, setType] = useState(initialType);
  const [fullResult, setFullResult] = useState('');
  const [displayedResult, setDisplayedResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const typeIntervalRef = useRef<number | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setType(initialType);
    setFullResult('');
    setDisplayedResult('');
    setTopic('');
  }, [initialType]);

  useEffect(() => {
    if (!fullResult) {
      setDisplayedResult('');
      return;
    }

    if (typeIntervalRef.current) window.clearInterval(typeIntervalRef.current);

    let currentIndex = 0;
    setDisplayedResult('');

    typeIntervalRef.current = window.setInterval(() => {
      const chunkSize = 35; // Ultra fast
      const nextIndex = Math.min(currentIndex + chunkSize, fullResult.length);
      setDisplayedResult(fullResult.substring(0, nextIndex));
      currentIndex = nextIndex;
      if (currentIndex >= fullResult.length) {
        if (typeIntervalRef.current) window.clearInterval(typeIntervalRef.current);
      }
    }, 10);

    return () => {
      if (typeIntervalRef.current) window.clearInterval(typeIntervalRef.current);
    };
  }, [fullResult]);

  const handleGenerate = async () => {
    if (!topic) return;
    setLoading(true);
    setFullResult(''); 
    setDisplayedResult('');
    
    try {
      const prompt = `Write a ${type} about "${topic}". Tone: ${tone}. Length: ~${wordCount} words.
      CRITICAL INSTRUCTIONS:
      1. DO NOT use markdown symbols like asterisks (*) or hash signs (#).
      2. Use plain uppercase text for headings (e.g., INTRODUCTION, SECTION 1, CONCLUSION).
      3. Organize into clearly labeled paragraphs.
      4. Ensure the output is clean and easy to read without any formatting symbols.`;
      
      const text = await generateText(prompt, "You are a professional plain-text content writer. Never use markdown symbols.");
      setFullResult(text);
    } catch (e) {
      alert("Generation failed.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(fullResult.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4">
      <button 
        onClick={() => window.location.hash = '#/'} 
        className="flex items-center text-xs font-bold text-gray-500 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft size={16} className="mr-2" /> 
        Back to Tools
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-white mb-2">{title}</h1>
        <p className="text-gray-400">Professional writing without markdown symbols.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-navy-800 p-6 rounded-3xl border border-white/5 shadow-xl">
            <div className="space-y-5">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Topic</label>
                <textarea 
                  className="w-full rounded-xl border-white/10 border p-4 text-sm bg-navy-950/50 text-gray-200 min-h-[120px] focus:outline-none focus:border-primary/40 transition-all"
                  placeholder="What should I write about?"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Tone</label>
                  <select 
                    className="w-full rounded-xl border-white/10 border p-3 text-xs bg-navy-950 text-gray-200"
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                  >
                    <option>Professional</option>
                    <option>Casual</option>
                    <option>Creative</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Words</label>
                  <select 
                    className="w-full rounded-xl border-white/10 border p-3 text-xs bg-navy-950 text-gray-200"
                    value={wordCount}
                    onChange={(e) => setWordCount(e.target.value)}
                  >
                    <option>200</option>
                    <option>300</option>
                    <option>400</option>
                    <option>600</option>
                    <option>700</option>
                    <option>800</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading || !topic}
                className="w-full py-4 bg-primary text-navy-900 rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2 hover:bg-primary-hover transition-all"
              >
                {loading ? <RefreshCw className="animate-spin" size={18} /> : <PenTool size={18} />}
                {loading ? 'Writing...' : 'Generate Content'}
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className="bg-navy-800 rounded-3xl border border-white/5 shadow-xl min-h-[500px] flex flex-col h-full overflow-hidden">
            <div className="border-b border-white/5 p-4 flex items-center justify-between bg-navy-800/50">
              <span className="text-xs font-bold text-gray-500">PLAIN TEXT RESULT</span>
              <div className="flex gap-2">
                <button onClick={copyToClipboard} disabled={!fullResult} className="p-2 text-gray-500 hover:text-white transition-colors">
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                </button>
              </div>
            </div>
            <div className="p-8 flex-grow overflow-y-auto whitespace-pre-wrap text-gray-300 leading-relaxed font-sans">
              {displayedResult || (
                <div className="h-full flex flex-col items-center justify-center text-gray-700">
                  <p className="text-sm font-medium">Ready for your input...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentWriter;