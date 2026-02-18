import React, { useState, useEffect, useRef } from 'react';
import { generateText } from '../../services/geminiService';
import { Copy, Download, RefreshCw, PenTool, Check, ArrowLeft } from 'lucide-react';
import RichTextRenderer from '../../components/RichTextRenderer';

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
  const [type, setType] = useState(initialType);
  const [fullResult, setFullResult] = useState('');
  const [displayedResult, setDisplayedResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const typeIntervalRef = useRef<number | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Reset state when tool changes
  useEffect(() => {
    setType(initialType);
    setFullResult('');
    setDisplayedResult('');
    setTopic('');
  }, [initialType]);

  // Typewriter Effect Logic
  useEffect(() => {
    if (!fullResult) {
      setDisplayedResult('');
      return;
    }

    if (resultsRef.current && !loading) {
       resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
  }, [fullResult, loading]);

  const handleGenerate = async () => {
    if (!topic) return;
    setLoading(true);
    setFullResult(''); 
    setDisplayedResult('');
    
    try {
      const prompt = `Write a ${type} about "${topic}". The tone should be ${tone}. 
      Requirements:
      1. Start with a catchy main heading using markdown (# Title).
      2. Use standard Markdown formatting (## for sections, **bold** for emphasis).
      3. Keep it professional and well-structured.`;
      const text = await generateText(prompt, "You are an expert content writer.");
      setFullResult(text);
    } catch (e) {
      alert("Failed to generate content. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    // Strip markdown symbols for clean copying
    const plainText = fullResult
      .replace(/#{1,6}\s?/g, '') // Remove headers
      .replace(/\*\*/g, '')      // Remove bold markers
      .replace(/\*/g, '')        // Remove italic markers
      .replace(/`/g, '')         // Remove code markers
      .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links, keep text
      .trim();

    navigator.clipboard.writeText(plainText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!fullResult) return;
    const blob = new Blob([fullResult], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <button 
        onClick={() => window.location.hash = '#/'} 
        className="flex items-center text-gray-400 hover:text-white mb-6 transition-colors group"
      >
        <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" /> 
        Back to Tools
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-white mb-2">{title}</h1>
        <p className="text-gray-400">Generate high-quality content optimized for your needs.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Section */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-navy-800 p-6 rounded-2xl border border-white/5 shadow-lg">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Content Type</label>
                <select 
                  className="w-full rounded-lg border-white/10 border p-2.5 text-sm focus:ring-primary focus:border-primary bg-navy-900 text-gray-200"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option>Blog Post</option>
                  <option>Email</option>
                  <option>Product Description</option>
                  <option>Instagram Caption</option>
                  <option>Video Script</option>
                  <option>Social Media Post</option>
                  <option>Essay</option>
                  <option>Kids Story</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Tone</label>
                <div className="flex flex-wrap gap-2">
                  {['Professional', 'Casual', 'Funny', 'Excited', 'Persuasive'].map(t => (
                    <button
                      key={t}
                      onClick={() => setTone(t)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                        tone === t 
                          ? 'bg-primary text-navy-900 border-primary' 
                          : 'bg-navy-900 text-gray-400 border-white/10 hover:border-primary/50'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Topic / Key Points</label>
                <textarea 
                  className="w-full rounded-lg border-white/10 border p-3 text-sm focus:ring-primary focus:border-primary min-h-[120px] bg-navy-900 text-gray-200 placeholder-gray-600"
                  placeholder="e.g. The benefits of AI in daily life..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                ></textarea>
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading || !topic}
                className="w-full py-3 bg-gradient-to-r from-primary to-cyan-400 text-navy-900 rounded-xl font-bold shadow-lg hover:shadow-cyan-500/20 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? <RefreshCw className="animate-spin" size={20} /> : <PenTool size={20} />}
                {loading ? 'Writing...' : 'Generate Content'}
              </button>
            </div>
          </div>
        </div>

        {/* Output Section */}
        <div className="lg:col-span-2" ref={resultsRef}>
          <div className="bg-navy-800 rounded-2xl border border-white/5 shadow-lg min-h-[500px] flex flex-col h-full">
            <div className="border-b border-white/5 p-4 flex items-center justify-between">
              <h3 className="font-semibold text-gray-300">Generated Result</h3>
              <div className="flex gap-2">
                <button 
                  onClick={copyToClipboard}
                  disabled={!fullResult}
                  className="p-2 text-gray-400 hover:text-primary hover:bg-white/5 rounded-lg transition-colors"
                  title="Copy"
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                </button>
                <button 
                  onClick={handleDownload}
                  disabled={!fullResult}
                  className="p-2 text-gray-400 hover:text-primary hover:bg-white/5 rounded-lg transition-colors"
                  title="Download"
                >
                  <Download size={18} />
                </button>
              </div>
            </div>
            
            <div className="p-6 flex-grow overflow-y-auto">
              {displayedResult ? (
                <RichTextRenderer content={displayedResult} />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-500">
                  <div className="p-4 bg-navy-700/50 rounded-full mb-4">
                    <PenTool size={32} className="opacity-40" />
                  </div>
                  <p>Your generated content will appear here.</p>
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