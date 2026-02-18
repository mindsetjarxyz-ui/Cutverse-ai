import React, { useState, useRef, useEffect } from 'react';
import { generateText } from '../../services/aiService';
import { RefreshCw, Copy, Check, Download, Sparkles, ArrowLeft, Edit2 } from 'lucide-react';
import RichTextRenderer from '../../components/RichTextRenderer';

interface StudentAIWriterProps {
  toolType: string;
  toolName: string;
}

const StudentAIWriter: React.FC<StudentAIWriterProps> = ({ toolType, toolName }) => {
  const [topic, setTopic] = useState('');
  const [wordCount, setWordCount] = useState('300');
  const [customWordCount, setCustomWordCount] = useState('');
  const [classLevel, setClassLevel] = useState('Class 10');
  const [fullResult, setFullResult] = useState('');
  const [displayedResult, setDisplayedResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const typeIntervalRef = useRef<number | null>(null);

  const isSummary = toolName === 'Summary Generator';
  const isGrammar = toolName === 'Grammar Improver';
  const isApplication = toolName === 'Application Writer';
  const isTextInput = isSummary || isGrammar;

  // Fast typewriter effect
  useEffect(() => {
    if (!fullResult) {
      setDisplayedResult('');
      return;
    }
    if (typeIntervalRef.current) window.clearInterval(typeIntervalRef.current);
    let currentIndex = 0;
    setDisplayedResult('');
    typeIntervalRef.current = window.setInterval(() => {
      const chunkSize = 30; 
      const nextIndex = Math.min(currentIndex + chunkSize, fullResult.length);
      setDisplayedResult(fullResult.substring(0, nextIndex));
      currentIndex = nextIndex;
      if (currentIndex >= fullResult.length) {
        if (typeIntervalRef.current) window.clearInterval(typeIntervalRef.current);
      }
    }, 10);
    return () => { if (typeIntervalRef.current) window.clearInterval(typeIntervalRef.current); };
  }, [fullResult]);

  const handleGenerate = async () => {
    if (!topic) return;
    setLoading(true);
    setFullResult('');
    setDisplayedResult('');
    setIsEditing(false);
    
    const finalWordCount = wordCount === 'Custom' ? customWordCount : wordCount;
    
    try {
      let prompt = `Write a ${toolType} about "${topic}" for ${classLevel}. Length: ${finalWordCount} words. Use plain text formatting without markdown symbols like * or #.`;
      if (isSummary) prompt = `Summarize in plain text: ${topic}`;
      else if (isGrammar) prompt = `Fix grammar in plain text: ${topic}`;

      const text = await generateText(prompt, "You are a professional academic assistant. Do not use markdown symbols like * or #.");
      setFullResult(text);
    } catch (e) {
      alert("Failed to generate.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4">
      <button 
        onClick={() => window.location.hash = '#/'} 
        className="flex items-center text-xs font-bold text-gray-500 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft size={16} className="mr-2" /> 
        Back to Tools
      </button>

      <div className="flex items-center gap-4 mb-10">
        <div className="p-4 rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-lg shadow-primary/5">
          <Sparkles size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-heading font-bold text-white mb-1">{toolName}</h1>
          <p className="text-sm text-gray-500">Professional academic assistance for students.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-navy-800 p-6 rounded-3xl border border-white/5 shadow-xl">
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-primary uppercase tracking-widest mb-3">Topic / Input</label>
                <textarea 
                  className="w-full rounded-xl border-white/10 border p-4 text-sm bg-navy-950/50 text-gray-200 min-h-[160px] focus:outline-none focus:border-primary/40 transition-all"
                  placeholder="Enter details..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>

              {!isTextInput && (
                <>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Class Level</label>
                    <select 
                      className="w-full rounded-xl border-white/10 border p-3.5 text-sm bg-navy-950 text-gray-200 focus:outline-none"
                      value={classLevel}
                      onChange={(e) => setClassLevel(e.target.value)}
                    >
                      <option>Class 7</option>
                      <option>Class 8</option>
                      <option>Class 9</option>
                      <option>Class 10</option>
                      <option>Class 11</option>
                      <option>Class 12</option>
                      <option>University</option>
                      <option>PhD Level</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Word Count</label>
                    <div className="space-y-3">
                      <select 
                        className="w-full rounded-xl border-white/10 border p-3.5 text-sm bg-navy-950 text-gray-200 focus:outline-none"
                        value={wordCount}
                        onChange={(e) => setWordCount(e.target.value)}
                      >
                        <option>100</option>
                        <option>200</option>
                        <option>300</option>
                        <option>400</option>
                        <option>600</option>
                        <option>700</option>
                        <option>800</option>
                        <option>1000</option>
                        <option>Custom</option>
                      </select>
                      {wordCount === 'Custom' && (
                        <input 
                          type="number"
                          placeholder="e.g. 1500"
                          className="w-full rounded-xl border-white/10 border p-3 text-sm bg-navy-950/50 text-gray-200 focus:outline-none focus:border-primary/40"
                          value={customWordCount}
                          onChange={(e) => setCustomWordCount(e.target.value)}
                        />
                      )}
                    </div>
                  </div>
                </>
              )}

              <button
                onClick={handleGenerate}
                disabled={loading || !topic}
                className="w-full py-4 bg-gradient-to-r from-primary to-cyan-400 text-navy-900 rounded-2xl font-bold shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
              >
                {loading ? <RefreshCw className="animate-spin" size={18} /> : <Sparkles size={18} />}
                {loading ? 'Processing...' : 'Generate Content'}
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className="bg-navy-800 rounded-3xl border border-white/5 shadow-xl min-h-[500px] flex flex-col h-full overflow-hidden">
            <div className="border-b border-white/5 p-4 flex items-center justify-between bg-navy-800/50">
              <span className="text-xs font-bold text-gray-500">ACADEMIC RESULT</span>
              <div className="flex gap-2">
                <button 
                  onClick={() => setIsEditing(!isEditing)} 
                  disabled={!fullResult}
                  className={`p-2 rounded-lg transition-colors ${isEditing ? 'text-primary bg-primary/10' : 'text-gray-500 hover:text-white'}`}
                >
                  <Edit2 size={18} />
                </button>
                <button onClick={() => { navigator.clipboard.writeText(fullResult); setCopied(true); setTimeout(() => setCopied(false), 2000); }} disabled={!fullResult} className="p-2 text-gray-500 hover:text-white">
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                </button>
              </div>
            </div>
            
            <div className="p-8 flex-grow overflow-y-auto whitespace-pre-wrap text-gray-300 leading-relaxed font-sans">
              {isEditing ? (
                 <textarea
                   value={fullResult}
                   onChange={(e) => setFullResult(e.target.value)}
                   className="w-full h-full bg-transparent text-gray-200 focus:outline-none resize-none"
                 />
              ) : displayedResult || (
                <div className="h-full flex flex-col items-center justify-center text-gray-700 opacity-20">
                  <Sparkles size={48} className="mb-4" />
                  <p className="font-bold">Waiting for input...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAIWriter;