import { useState, useEffect, useRef, useCallback } from 'react';
import { Copy, Pencil, Save, Check } from 'lucide-react';
import { cn } from '@/utils/cn';
import { formatOutputText } from '@/services/ai';

interface ResultBoxProps {
  content: string;
  isLoading?: boolean;
  showTypewriter?: boolean;
  onContentChange?: (content: string) => void;
  className?: string;
}

export function ResultBox({ 
  content, 
  isLoading = false, 
  showTypewriter = true,
  onContentChange,
  className 
}: ResultBoxProps) {
  const [displayedContent, setDisplayedContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [copied, setCopied] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const prevContentRef = useRef('');
  const wasEditedRef = useRef(false);
  const typingRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // ULTRA FAST typing speed calculator - no cursor, maximum speed
  const getTypingDelay = useCallback((char: string, nextChar: string, position: number, totalLength: number): number => {
    // Ultra fast base speed - almost instant
    const baseSpeed = 0.5; // Reduced from 1 to 0.5
    
    // Speed up as we go - very aggressive
    const progressFactor = Math.max(0.1, 1 - (position / totalLength) * 0.4);
    
    // Minimal punctuation pauses
    if (char === '.') {
      if (nextChar === '\n') return 8; // End of paragraph
      return 4; // End of sentence
    }
    if (char === ',') return 2;
    if (char === ':') return 3;
    if (char === ';') return 3;
    if (char === '!') return 4;
    if (char === '?') return 4;
    
    // New line pauses - minimal
    if (char === '\n') {
      if (nextChar === '\n') return 5; // Paragraph break
      return 2;
    }
    
    // Space between words - very minimal
    if (char === ' ') return baseSpeed * progressFactor * 0.2;
    
    // Slight random variation (±20%)
    const randomVariation = 0.8 + Math.random() * 0.4;
    
    // Burst typing - type VERY fast chunks
    if (Math.random() < 0.4) return 0.2; // Ultra fast burst
    
    return baseSpeed * progressFactor * randomVariation;
  }, []);

  // Realistic typewriter effect
  useEffect(() => {
    // If content was edited, skip typewriter
    if (wasEditedRef.current) {
      setDisplayedContent(content);
      return;
    }

    // Only animate if content is new
    if (content && content !== prevContentRef.current && showTypewriter) {
      setDisplayedContent('');
      setIsTyping(true);
      let index = 0;

      const typeNextChar = () => {
        if (index < content.length) {
          // Type in chunks for very fast parts (simulates burst typing)
          const currentChar = content[index];
          const nextChar = content[index + 1] || '';
          
          // Type larger chunks for faster animation (3-6 chars at once)
          let chunkSize = 1;
          if (Math.random() < 0.5 && index + 6 < content.length) {
            const upcoming = content.slice(index, index + 6);
            if (!/[.,!?\n:;]/.test(upcoming)) {
              chunkSize = 3 + Math.floor(Math.random() * 4); // 3-6 chars
            }
          }
          
          const endIndex = Math.min(index + chunkSize, content.length);
          setDisplayedContent(content.slice(0, endIndex));
          
          const delay = getTypingDelay(currentChar, nextChar, index, content.length);
          index = endIndex;
          
          typingRef.current = setTimeout(typeNextChar, delay);
        } else {
          setIsTyping(false);
        }
      };

      typeNextChar();
      prevContentRef.current = content;

      return () => {
        if (typingRef.current) {
          clearTimeout(typingRef.current);
        }
      };
    } else if (content) {
      setDisplayedContent(content);
      prevContentRef.current = content;
    }
  }, [content, showTypewriter, getTypingDelay]);

  // Don't auto-scroll during typing - let user scroll freely
  useEffect(() => {
    // Auto-scroll disabled - user can scroll up/down freely while AI is writing
    // Comment out the auto-scroll functionality
  }, [displayedContent, isTyping]);

  const handleCopy = async () => {
    const textToCopy = wasEditedRef.current ? editedContent : content;
    const plainText = textToCopy.replace(/<[^>]*>/g, '');
    await navigator.clipboard.writeText(plainText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEdit = () => {
    setEditedContent(displayedContent);
    setIsEditing(true);
    // Stop typing animation if still running
    if (typingRef.current) {
      clearTimeout(typingRef.current);
      setIsTyping(false);
      setDisplayedContent(content);
    }
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  const handleSave = () => {
    setIsEditing(false);
    setDisplayedContent(editedContent);
    wasEditedRef.current = true;
    prevContentRef.current = editedContent;
    if (onContentChange) {
      onContentChange(editedContent);
    }
  };

  // Reset edited flag when new content is generated (content changes from parent)
  useEffect(() => {
    if (content !== prevContentRef.current && !wasEditedRef.current) {
      wasEditedRef.current = false;
    }
  }, [content]);

  const formattedContent = displayedContent; // Use plain text directly, no HTML formatting

  return (
    <div className={cn('bg-slate-800/30 border border-slate-700/50 rounded-xl overflow-hidden', className)}>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 sm:px-4 border-b border-slate-700/50 bg-slate-800/50">
        <div className="flex items-center gap-2">
          <span className="text-[10px] sm:text-xs text-slate-400 font-medium">Result</span>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={handleCopy}
            className="p-1.5 sm:p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-md transition-colors"
            title="Copy"
            disabled={!content && !displayedContent}
          >
            {copied ? <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-400" /> : <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
          </button>
          {isEditing ? (
            <button
              onClick={handleSave}
              className="p-1.5 sm:p-2 text-blue-400 hover:text-blue-300 hover:bg-slate-700 rounded-md transition-colors"
              title="Save"
            >
              <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          ) : (
            <button
              onClick={handleEdit}
              className="p-1.5 sm:p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-md transition-colors"
              title="Edit"
              disabled={!content && !displayedContent}
            >
              <Pencil className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          )}
        </div>
      </div>
      
      {/* Content */}
      <div ref={contentRef} className="p-3 sm:p-4 md:p-5 min-h-[180px] sm:min-h-[220px] max-h-[400px] sm:max-h-[520px] overflow-y-auto scroll-smooth">
        {isLoading ? (
          <div className="flex items-center justify-center h-32 sm:h-40">
            <div className="flex flex-col items-center gap-2 sm:gap-3">
              <div className="relative">
                <div className="w-8 h-8 sm:w-10 sm:h-10 border-3 border-blue-500/30 rounded-full" />
                <div className="absolute inset-0 w-8 h-8 sm:w-10 sm:h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
              <span className="text-xs sm:text-sm text-slate-400">Generating content...</span>
            </div>
          </div>
        ) : isEditing ? (
          <textarea
            ref={textareaRef}
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full h-full min-h-[180px] sm:min-h-[220px] bg-transparent text-slate-200 resize-none focus:outline-none leading-relaxed text-sm sm:text-[15px]"
          />
        ) : displayedContent ? (
          <div className="animate-fadeIn">
            <div 
              className="result-text text-slate-200 leading-[1.8] sm:leading-[1.85] text-sm sm:text-[15px] whitespace-pre-wrap break-words"
            >
              {formattedContent}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-32 sm:h-40 text-slate-500 text-xs sm:text-sm">
            <div className="text-center px-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 rounded-xl bg-slate-700/30 flex items-center justify-center">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              Your generated content will appear here
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
