import React, { useState, useRef, useEffect } from 'react';
import { generateText } from '../../services/geminiService';
import { RefreshCw, BookOpen, Copy, Check, Download, GraduationCap, AlignLeft, Sparkles, MessageSquare, Feather, PenTool, FileText, ArrowLeft, Edit2, Save } from 'lucide-react';
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
  const [appLevel, setAppLevel] = useState('Academic');
  
  const [result, setResult] = useState('');
  const [displayedResult, setDisplayedResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  const typeIntervalRef = useRef<number | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Tool Identifiers
  const isSummary = toolName === 'Summary Generator';
  const isGrammar = toolName === 'Grammar Improver';
  const isDebate = toolName === 'Debate Writer';
  const isLetter = toolName === 'Letter Writer';
  const isSpeech = toolName === 'Speech Writer';
  const isApplication = toolName === 'Application Writer';
  const isParagraph = toolName === 'Paragraph Writer';
  const isEssay = toolName === 'Essay Writer';
  const isTextInput = isSummary || isGrammar;

  // Configuration for Visibility
  const showClassLevel = !isSummary && !isGrammar && !isLetter && !isDebate && !isApplication;
  const showWordCount = !isSummary && !isGrammar && !isLetter && !isDebate && !isSpeech && !isApplication;
  const showAppLevel = isApplication;

  // Dynamic Theme Logic
  const getTheme = () => {
    const name = toolName.toLowerCase();
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
    if (name.includes('speech') || name.includes('debate') || name.includes('letter') || name.includes('application')) {
      return {
        gradient: 'from-amber-600 to-orange-500',
        iconBg: 'bg-orange-500/20 text-orange-300 border-orange-500/20',
        focusRing: 'focus:border-orange-500 focus:ring-orange-500/50',
        buttonShadow: 'shadow-orange-500/20 hover:shadow-orange-500/40',
        textColor: 'text-orange-300',
        Icon: name.includes('application') ? FileText : MessageSquare
      };
    }
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

  useEffect(() => {
    if (!result) {
      setDisplayedResult('');
      return;
    }

    // If not animating (e.g. editing or loaded from history), show full result immediately
    if (!shouldAnimate) {
        setDisplayedResult(result);
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
        setShouldAnimate(false); // Animation done
      }
    }, 5);

    return () => {
      if (typeIntervalRef.current) window.clearInterval(typeIntervalRef.current);
    };
  }, [result, loading, shouldAnimate]);

  const handleGenerate = async () => {
    if (!topic) return;
    setLoading(true);
    setShouldAnimate(true);
    setResult('');
    setDisplayedResult('');
    setIsEditing(false);
    
    try {
      let prompt = '';

      if (isSummary) {
        prompt = `
          Role: You are an expert academic summarizer.
          Task: Create a concise, professional, and academic summary of the following text.
          Source Text: """${topic}"""
          Requirements:
          1. Start with a main heading using markdown (# Summary).
          2. Capture the main ideas and key points accurately.
          3. Tone: Professional and Academic.
          4. Style: Clear, coherent paragraph(s) or bullet points.
          5. Strictly avoid plagiarism.
        `;
      } else if (isGrammar) {
        prompt = `
          Role: You are an expert academic editor.
          Task: Correct the grammar, spelling, and punctuation of the text below.
          Text to Improve: """${topic}"""
          Output: Start with a main heading (# Corrected Version), then provide ONLY the corrected version.
        `;
      } else if (isApplication) {
        prompt = `
          Role: You are an expert in writing formal applications.
          Task: Write a ${appLevel} application based on the details below.
          Details: "${topic}"
          Requirements:
          1. Start with a main heading using markdown (# Title of Application).
          2. Tone: ${appLevel} (Formal, polite, and respectful).
          3. Format: Standard formal application format (Subject line, Salutation, Body, Closing).
          4. Content: Ensure all details provided in the topic are included.
        `;
      } else if (isParagraph) {
        const finalWordCount = wordCount === 'Custom' ? customWordCount : wordCount.replace(' words', '');
        prompt = `
          Role: You are an expert academic AI tutor.
          Task: Write a perfectly structured academic paragraph about "${topic}".
          
          Requirements:
          1. Start with a main heading using markdown (# ${topic}).
          2. Target Level: ${classLevel}.
          3. Tone: Formal and Academic.
          4. Word Count: Approx ${finalWordCount} words.
          5. Structure: Write a single, cohesive text block (or multiple paragraphs if length requires). Start with a topic sentence, follow with supporting details, and end with a concluding sentence.
          6. Strictly avoid plagiarism.
        `;
      } else if (isEssay) {
        const finalWordCount = wordCount === 'Custom' ? customWordCount : wordCount.replace(' words', '');
        prompt = `
          Role: You are an expert academic AI tutor.
          Task: Write a comprehensive Academic Essay about "${topic}".
          
          Requirements:
          1. Start with a main heading using markdown (# Title).
          2. Structure the essay with clear markdown subheadings (##) for EACH paragraph or section (e.g., ## Introduction, ## [Key Argument 1], ## Conclusion).
          3. Target Level: ${classLevel}.
          4. Tone: Formal and Academic.
          5. Word Count: Approx ${finalWordCount} words.
          6. Style: Well-structured, formal.
          7. Strictly avoid plagiarism.
          Formatting: Use standard Markdown. Bold key terms.
        `;
      } else {
        const finalWordCount = wordCount === 'Custom' ? customWordCount : wordCount.replace(' words', '');
        prompt = `
          Role: You are an expert academic AI tutor.
          Task: Write a high-quality, professional ${toolType} about "${topic}".
          Requirements:
          1. Start with a main heading using markdown (# Title).
          ${showClassLevel ? `2. Target Academic Level: ${classLevel}.` : ''}
          3. Tone: Professional and Academic.
          ${showWordCount ? `4. Approximate Word Count: ${finalWordCount} words.` : ''}
          5. Style: Well-structured, formal.
          ${isDebate ? '6. Provide strong arguments suitable for a debate.' : ''}
          ${isSpeech ? '6. Write it as a spoken speech.' : ''}
          ${isLetter ? '6. Use proper letter formatting.' : ''}
          Formatting: Use standard Markdown. Bold key terms.
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
    // Strip markdown symbols for clean copying
    const plainText = result
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

  const getPlaceholder = () => {
    if (isSummary) return "Paste the text you want to summarize...";
    if (isGrammar) return "Paste text to correct...";
    if (isApplication) return "Enter application details (e.g., Leave application for sister's wedding, School Name, Date, Reason)...";
    if (isDebate) return "Enter debate motion (e.g., Social media is bad for youth)...";
    return "e.g., Climate Change...";
  };

  return (
    <div className="max-w-6xl mx-auto">
      <button 
        onClick={() => window.location.hash = '#/'} 
        className="flex items-center text-gray-400 hover:text-white mb-6 transition-colors group"
      >
        <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" /> 
        Back to Tools
      </button>

      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl border ${theme.iconBg}`}>
                <HeaderIcon size={32} />
            </div>
            <div>
                <h1 className="text-3xl font-heading font-bold text-white mb-1">{toolName}</h1>
                <p className="text-gray-400">
                  {isSummary 
                    ? 'Summarize any text instantly.'
                    : isGrammar
                    ? 'Correct grammar and improve sentence flow.'
                    : isApplication
                    ? 'Generate formal applications.'
                    : 'Generate high-quality academic content.'
                  }
                </p>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Section */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-navy-800 p-6 rounded-2xl border border-white/5 shadow-lg relative overflow-hidden">
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${theme.gradient} opacity-50`}></div>
            <div className="space-y-5 relative z-10">
              
              <div>
                <label className={`block text-sm font-medium ${theme.textColor} mb-2`}>
                  {isTextInput ? 'Paste Content Here' : 'Topic / Title / Details'}
                </label>
                {isTextInput || isApplication ? (
                  <textarea 
                    className={`w-full rounded-lg border-white/10 border p-3 text-sm bg-navy-900 text-gray-200 placeholder-gray-600 min-h-[150px] ${theme.focusRing}`}
                    placeholder={getPlaceholder()}
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  />
                ) : (
                  <input 
                      type="text"
                      className={`w-full rounded-lg border-white/10 border p-3 text-sm bg-navy-900 text-gray-200 placeholder-gray-600 ${theme.focusRing}`}
                      placeholder={getPlaceholder()}
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                  />
                )}
              </div>

              {showClassLevel && (
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

              {showAppLevel && (
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Application Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Academic', 'Professional'].map((level) => (
                      <button
                        key={level}
                        onClick={() => setAppLevel(level)}
                        className={`py-2 text-sm rounded-lg border transition-all ${appLevel === level ? `${theme.iconBg} font-bold` : 'border-white/10 bg-navy-900 text-gray-400'}`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {showWordCount && (
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

              {showWordCount && wordCount === 'Custom' && (
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
                {loading ? 'Working...' : 'Generate'}
              </button>
            </div>
          </div>
        </div>

        {/* Output Section */}
        <div className="lg:col-span-2" ref={resultsRef}>
          <div className="bg-navy-800 rounded-2xl border border-white/5 shadow-lg min-h-[600px] flex flex-col h-full relative overflow-hidden">
             <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                  style={{ 
                    backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', 
                    backgroundSize: '24px 24px' 
                  }}>
             </div>

            <div className="border-b border-white/5 p-4 flex items-center justify-between relative z-10 bg-navy-800/80 backdrop-blur-sm">
              <h3 className={`font-semibold ${theme.textColor} flex items-center gap-2`}>
                <HeaderIcon size={16} />
                {isEditing ? 'Editing Result' : 'Generated Result'}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  disabled={!result}
                  className={`p-2 rounded-lg transition-colors ${isEditing ? 'bg-primary text-navy-900' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                  title={isEditing ? "Save Changes" : "Edit Text"}
                >
                  {isEditing ? <Save size={18} /> : <Edit2 size={18} />}
                </button>
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
              {isEditing ? (
                 <textarea
                   value={result}
                   onChange={(e) => {
                     setResult(e.target.value);
                     setDisplayedResult(e.target.value); // Sync so if they cancel/save it's there
                   }}
                   className="w-full h-full bg-transparent text-gray-200 font-mono text-base resize-none focus:outline-none leading-relaxed"
                   spellCheck={false}
                   placeholder="Edit your text here..."
                 />
              ) : displayedResult ? (
                <RichTextRenderer content={displayedResult} className="text-lg leading-relaxed" />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-500">
                  <div className={`p-4 rounded-full mb-4 ${theme.iconBg} bg-opacity-10 border-none`}>
                    <PenTool size={32} className="opacity-50" />
                  </div>
                  <p>Result will appear here.</p>
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