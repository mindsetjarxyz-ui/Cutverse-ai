import React, { useState, useRef, useEffect } from 'react';
import { generateText } from '../../services/geminiService';
import { RefreshCw, BookOpen, Copy, Check, Download, GraduationCap, AlignLeft, Sparkles, MessageSquare, Feather, PenTool } from 'lucide-react';
import RichTextRenderer from '../../components/RichTextRenderer';

interface StudentAIWriterProps {
  toolType: string;
  toolName: string;
}

const StudentAIWriter: React.FC<StudentAIWriterProps> = ({ toolType, toolName }) => {
  const [topic, setTopic] = useState('');
  const [wordCount, setWordCount] = useState('150');
  const [customWordCount, setCustomWordCount] = useState('');
  const [classLevel, setClassLevel] = useState('Class 10');
  
  const [result, setResult] = useState('');
  const [displayedResult, setDisplayedResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const typeIntervalRef = useRef<number | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const isSummary = toolName === 'Summary Generator';
  const isGrammar = toolName === 'Grammar Improver';
  const isTextInput = isSummary || isGrammar;

  // Dynamic Theme Logic
  const getTheme = () => {
    const name = toolName.toLowerCase();
    
    // Creative Tools (Story, Composition) -> Purple/Pink
    if (name.includes('story') || name.includes('composition')) {
      return {
        gradient: 'from-purple-600 to-pink-500',
        iconBg: 'bg-purple-500/20 text-purple-300 border-purple-500/20',
        focusRing: 'focus:border-purple-500 focus:ring-purple-500/50',
        buttonShadow: 'shadow-purple-500/20 hover:shadow-purple-500/40',
        textColor: 'text-purple-300',
        Icon: Feather
      };
    }
    
    // Formal/Speech Tools (Speech, Debate, Letter) -> Amber/Orange
    if (name.includes('speech') || name.includes('debate') || name.includes('letter')) {
      return {
        gradient: 'from-amber-600 to-orange-500',
        iconBg: 'bg-orange-500/20 text-orange-300 border-orange-500/20',
        focusRing: 'focus:border-orange-500 focus:ring-orange-500/50',
        buttonShadow: 'shadow-orange-500/20 hover:shadow-orange-500/40',
        textColor: 'text-orange-300',
        Icon: MessageSquare
      };
    }
    
    // Utility Tools (Summary, Grammar) -> Emerald/Teal
    if (name.includes('summary') || name.includes('grammar')) {
      return {
        gradient: 'from-emerald-600 to-teal-500',
        iconBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/20',
        focusRing: 'focus:border-emerald-500 focus:ring-emerald-500/50',
        buttonShadow: 'shadow-emerald-500/20 hover:shadow-emerald-500/40',
        textColor: 'text-emerald-300',
        Icon: AlignLeft
      };
    }

    // Default Academic Tools (Essay, Paragraph) -> Cyan/Blue
    return {
      gradient: 'from-cyan-600 to-blue-500',
      iconBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/20',
      focusRing: 'focus:border-cyan-500 focus:ring-cyan-500/50',
      buttonShadow: 'shadow-cyan-500/20 hover:shadow-cyan-500/40',
      textColor: 'text-cyan-300',
      Icon: GraduationCap
    };
  };

  const theme = getTheme();
  const HeaderIcon = theme.Icon;

  // Typewriter effect
  useEffect(() => {
    if (!result) {
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
      const nextIndex = Math.min(currentIndex + chunkSize, result.length);
      setDisplayedResult(result.substring(0, nextIndex));
      currentIndex = nextIndex;

      if (currentIndex >= result.length) {
        if (typeIntervalRef.current) window.clearInterval(typeIntervalRef.current);
      }
    }, 5);

    return () => {
      if (typeIntervalRef.current) window.clearInterval(typeIntervalRef.current);
    };
  }, [result, loading]);

  const handleGenerate = async () => {
    if (!topic) return;
    setLoading(true);
    setResult('');
    setDisplayedResult('');
    
    try {
      let prompt = '';

      if (isSummary) {
        prompt = `
          Role: You are an expert academic summarizer.
          Task: Create a concise, professional, and academic summary of the following text.
          
          Source Text:
          """${topic}"""

          Requirements:
          1. Capture the main ideas and key points accurately.
          2. Tone: Professional and Academic.
          3. Style: Clear, coherent paragraph(s) or bullet points if appropriate for clarity.
          4. Strictly avoid plagiarism.
          5. Do not include meta-commentary like "Here is the summary".
        `;
      } else if (isGrammar) {
        prompt = `
          Role: You are an expert academic editor.
          Task: Correct the grammar, spelling, and punctuation of the text below. Improve sentence structure and flow to match a high-quality standard.
          
          Text to Improve:
          """${topic}"""
          
          Output: Provide ONLY the corrected version of the text. No explanations unless necessary for clarity in a separate note.
        `;
      } else {
        const finalWordCount = wordCount === 'Custom' ? customWordCount : wordCount.replace(' words', '');
        
        prompt = `
          Role: You are an expert academic AI tutor designed to help students achieve top grades.
          Task: Write a high-quality, professional ${toolType} about the topic "${topic}".
          
          Requirements:
          1. Target Academic Level: ${classLevel}. (CRITICAL: Adjust vocabulary, sentence complexity, and depth to match this level perfectly).
          2. Tone: Professional and Academic.
          3. Approximate Word Count: ${finalWordCount} words.
          4. Style: Well-structured, formal, and neatly formatted.
          
          Formatting:
          - Use standard Markdown.
          - Use **bold** for key terms.
          - Ensure proper structure (Introduction, Body Paragraphs, Conclusion) where applicable.
          - Strictly avoid plagiarism.
          - Do not include meta-commentary like "Here is your essay". Just provide the content.
        `;
      }
      
      const text = await generateText(prompt, "You are a helpful and educational AI assistant for students.");
      setResult(text);
    } catch (e) {
      alert("Failed to generate content. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!result) return;
    const blob = new Blob([result], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${toolName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl border ${theme.iconBg}`}>
                <HeaderIcon size={32} />
            </div>
            <div>
                <h1 className="text-3xl font-heading font-bold text-white mb-1">{toolName}</h1>
                <p className="text-gray-400">
                  {isSummary 
                    ? 'Summarize any text instantly into professional academic notes.'
                    : isGrammar
                    ? 'Correct grammar and improve sentence flow instantly.'
                    : 'Generate high-quality academic content tailored to your class level.'
                  }
                </p>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Section */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-navy-800 p-6 rounded-2xl border border-white/5 shadow-lg relative overflow-hidden">
            {/* Subtle top accent */}
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${theme.gradient} opacity-50`}></div>
            
            <div className="space-y-5 relative z-10">
              
              {/* Topic / Content Input */}
              <div>
                <label className={`block text-sm font-medium ${theme.textColor} mb-2`}>
                  {isTextInput ? 'Paste Content Here' : 'Topic / Title'}
                </label>
                {isTextInput ? (
                  <textarea 
                    className={`w-full rounded-lg border-white/10 border p-3 text-sm bg-navy-900 text-gray-200 placeholder-gray-600 min-h-[200px] ${theme.focusRing}`}
                    placeholder={isSummary ? "Paste the text you want to summarize..." : "Paste text to correct..."}
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  />
                ) : (
                  <input 
                      type="text"
                      className={`w-full rounded-lg border-white/10 border p-3 text-sm bg-navy-900 text-gray-200 placeholder-gray-600 ${theme.focusRing}`}
                      placeholder="e.g., Climate Change (in French)..."
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                  />
                )}
              </div>

              {/* Class Level - Hidden for Summary and Grammar */}
              {!isSummary && !isGrammar && (
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Class Level</label>
                  <select 
                    className={`w-full rounded-lg border-white/10 border p-2.5 text-sm bg-navy-900 text-gray-200 ${theme.focusRing}`}
                    value={classLevel}
                    onChange={(e) => setClassLevel(e.target.value)}
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(num => (
                      <option key={num} value={`Class ${num}`}>Class {num}</option>
                    ))}
                    <option>College Level</option>
                    <option>University Level</option>
                    <option>PhD / Research</option>
                  </select>
                </div>
              )}

              {/* Word Count - Hidden for Summary and Grammar */}
              {!isSummary && !isGrammar && (
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Word Count</label>
                  <select 
                    className={`w-full rounded-lg border-white/10 border p-2.5 text-sm bg-navy-900 text-gray-200 ${theme.focusRing}`}
                    value={wordCount}
                    onChange={(e) => setWordCount(e.target.value)}
                  >
                    <option>100 words</option>
                    <option>150 words</option>
                    <option>200 words</option>
                    <option>250 words</option>
                    <option>300 words</option>
                    <option>400 words</option>
                    <option>500 words</option>
                    <option>800 words</option>
                    <option>1000 words</option>
                    <option>Custom</option>
                  </select>
                </div>
              )}

              {!isSummary && !isGrammar && wordCount === 'Custom' && (
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Enter Word Count</label>
                    <input 
                        type="number"
                        className={`w-full rounded-lg border-white/10 border p-2.5 text-sm bg-navy-900 text-gray-200 ${theme.focusRing}`}
                        placeholder="e.g., 1000"
                        value={customWordCount}
                        onChange={(e) => setCustomWordCount(e.target.value)}
                    />
                  </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={loading || !topic}
                className={`w-full py-3 bg-gradient-to-r ${theme.gradient} text-white rounded-xl font-bold shadow-lg ${theme.buttonShadow} transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
              >
                {loading ? <RefreshCw className="animate-spin" size={20} /> : <Sparkles size={20} />}
                {loading ? (isSummary ? 'Summarizing...' : isGrammar ? 'Fixing...' : 'Writing...') : (isSummary ? 'Generate Summary' : isGrammar ? 'Fix Grammar' : 'Generate Content')}
              </button>
            </div>
          </div>
        </div>

        {/* Output Section */}
        <div className="lg:col-span-2" ref={resultsRef}>
          <div className="bg-navy-800 rounded-2xl border border-white/5 shadow-lg min-h-[600px] flex flex-col h-full relative overflow-hidden">
             {/* Background Pattern */}
             <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                  style={{ 
                    backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', 
                    backgroundSize: '24px 24px' 
                  }}>
             </div>

            <div className="border-b border-white/5 p-4 flex items-center justify-between relative z-10 bg-navy-800/80 backdrop-blur-sm">
              <h3 className={`font-semibold ${theme.textColor} flex items-center gap-2`}>
                <HeaderIcon size={16} />
                Generated Result
              </h3>
              <div className="flex gap-2">
                <button 
                  onClick={copyToClipboard}
                  disabled={!result}
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  title="Copy"
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                </button>
                <button 
                  onClick={handleDownload}
                  disabled={!result}
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  title="Download"
                >
                  <Download size={18} />
                </button>
              </div>
            </div>
            
            <div className="p-8 flex-grow overflow-y-auto relative z-10">
              {displayedResult ? (
                <RichTextRenderer content={displayedResult} className="text-lg leading-relaxed" />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-500">
                  <div className={`p-4 rounded-full mb-4 ${theme.iconBg} bg-opacity-10 border-none`}>
                    <PenTool size={32} className="opacity-50" />
                  </div>
                  <p>
                    {isSummary 
                      ? 'Your summary will appear here.'
                      : isGrammar 
                      ? 'Corrected text will appear here.'
                      : 'Your professional academic content will appear here.'
                    }
                  </p>
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