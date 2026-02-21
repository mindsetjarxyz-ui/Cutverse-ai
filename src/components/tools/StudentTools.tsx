import { useState } from 'react';
import { TextArea } from '@/components/ui/TextArea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { ResultBox } from '@/components/ui/ResultBox';
import { generateText } from '@/services/ai';
import { classOptions } from '@/data/tools';

interface StudentToolProps {
  toolId: string;
}

const wordCountOptions = [
  { value: '100', label: '100' },
  { value: '200', label: '200' },
  { value: '300', label: '300' },
  { value: '400', label: '400' },
  { value: '500', label: '500' },
  { value: 'custom', label: 'Custom' },
];

const essayWordCountOptions = [
  { value: '300', label: '300' },
  { value: '500', label: '500' },
  { value: '600', label: '600' },
  { value: '800', label: '800' },
  { value: 'custom', label: 'Custom' },
];

const storyWordCountOptions = [
  { value: '300', label: '300' },
  { value: '500', label: '500' },
  { value: '700', label: '700' },
  { value: '1000', label: '1000' },
  { value: 'custom', label: 'Custom' },
];

const compositionWordCountOptions = [
  { value: '200', label: '200' },
  { value: '300', label: '300' },
  { value: '400', label: '400' },
  { value: '500', label: '500' },
  { value: 'custom', label: 'Custom' },
];

const stanceOptions = [
  { value: 'for', label: 'For the motion' },
  { value: 'against', label: 'Against the motion' },
  { value: 'balanced', label: 'Balanced view' },
];

const durationOptions = [
  { value: 'short', label: 'Short (2-3 min)' },
  { value: 'medium', label: 'Medium (5-7 min)' },
  { value: 'long', label: 'Long (10+ min)' },
];

const summaryStyleOptions = [
  { value: 'very-short', label: 'Very Short' },
  { value: 'medium', label: 'Medium' },
  { value: 'detailed', label: 'Detailed but Simple' },
];

const compositionStyleOptions = [
  { value: 'narrative', label: 'Narrative' },
  { value: 'descriptive', label: 'Descriptive' },
  { value: 'reflective', label: 'Reflective' },
];

const humanizeStyleOptions = [
  { value: 'natural', label: 'Natural and Conversational' },
  { value: 'professional', label: 'Professional but Human' },
  { value: 'casual', label: 'Casual and Friendly' },
  { value: 'academic', label: 'Academic but Readable' },
];

// Word Count Selector Component for reusability
function WordCountSelector({ 
  options, 
  value, 
  customValue, 
  onChange, 
  onCustomChange,
  minWords = 50 
}: {
  options: { value: string; label: string }[];
  value: string;
  customValue: string;
  onChange: (value: string) => void;
  onCustomChange: (value: string) => void;
  minWords?: number;
}) {
  return (
    <div>
      <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5 sm:mb-2">Word Count</label>
      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        {options.map(opt => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg text-xs sm:text-sm transition-colors ${
              value === opt.value 
                ? 'bg-blue-600 text-white' 
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
      {value === 'custom' && (
        <div className="mt-2 sm:mt-3">
          <input
            type="number"
            min={minWords}
            max="10000"
            placeholder={`Enter word count (min ${minWords})`}
            value={customValue}
            onChange={(e) => onCustomChange(e.target.value)}
            className="w-full px-3 py-2 sm:px-4 sm:py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
      )}
    </div>
  );
}

// ==================== APPLICATION WRITER ====================
export function ApplicationWriter() {
  const [details, setDetails] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!details.trim()) return;
    setLoading(true);
    setError('');
    
    const prompt = `Write a formal application letter based on these details:\n\n${details}\n\nWrite a complete, well-structured application with proper formatting. Use academic and professional tone throughout. Include a clear subject line on its own line, proper date, recipient address, salutation, well-organized body paragraphs, and a professional closing with signature. Make it ready to submit. Follow any language instructions in the details above.`;

    const { error: apiError, output } = await generateText(prompt);
    if (apiError) setError(apiError);
    else setResult(output);
    setLoading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      <div className="space-y-3 sm:space-y-4">
        <TextArea
          label="Application Details"
          placeholder="Explain who you are, why you are writing this application, and any important details. You can also type instructions like 'write in Bangla' or specify the recipient, reason, dates, etc."
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          rows={8}
        />
        <Button onClick={handleGenerate} loading={loading} disabled={!details.trim()} className="w-full sm:w-auto">
          Generate Application
        </Button>
        {error && <p className="text-red-400 text-xs sm:text-sm">{error}</p>}
      </div>
      <ResultBox content={result} isLoading={loading} />
    </div>
  );
}

// ==================== LETTER WRITER ====================
export function LetterWriter() {
  const [details, setDetails] = useState('');
  const [tone, setTone] = useState('formal');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toneOptions = [
    { value: 'formal', label: 'Respectful Formal' },
    { value: 'friendly', label: 'Friendly' },
  ];

  const handleGenerate = async () => {
    if (!details.trim()) return;
    setLoading(true);
    setError('');
    
    const prompt = `Write a ${tone} letter based on these details:\n\n${details}\n\nWrite a complete, well-structured letter with a proper greeting, well-organized body paragraphs, and an appropriate closing. Use ${tone} tone throughout. Make it feel genuine and personal. Include date and proper formatting. Follow any language instructions in the details above.`;

    const { error: apiError, output } = await generateText(prompt);
    if (apiError) setError(apiError);
    else setResult(output);
    setLoading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      <div className="space-y-3 sm:space-y-4">
        <TextArea
          label="Letter Details"
          placeholder="Explain who you are writing to, the relationship, and purpose. You can request a specific language like 'write in Bangla'. Describe the situation and what you want to say."
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          rows={6}
        />
        <Select label="Tone" options={toneOptions} value={tone} onChange={(e) => setTone(e.target.value)} />
        <Button onClick={handleGenerate} loading={loading} disabled={!details.trim()} className="w-full sm:w-auto">
          Generate Letter
        </Button>
        {error && <p className="text-red-400 text-xs sm:text-sm">{error}</p>}
      </div>
      <ResultBox content={result} isLoading={loading} />
    </div>
  );
}

// ==================== DEBATE WRITER ====================
export function DebateWriter() {
  const [topic, setTopic] = useState('');
  const [classLevel, setClassLevel] = useState('class-10');
  const [stance, setStance] = useState('for');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setError('');
    
    const stanceText = stance === 'for' ? 'in favor of' : stance === 'against' ? 'against' : 'presenting both sides of';
    const levelText = classLevel === 'university' ? 'University' : classLevel.replace('-', ' ').replace('class', 'Class');
    
    const prompt = `Write a debate speech ${stanceText} the motion: "${topic}"\n\nThis is for a ${levelText} level student. Adjust vocabulary, sentence complexity, and depth of arguments accordingly.\n\nStructure the speech with:\n- A strong, attention-grabbing opening statement\n- Three to four main arguments, each with supporting evidence or examples\n- Address and counter the opposing viewpoints\n- A powerful, memorable closing statement\n\nUse vocabulary and reasoning appropriate for ${levelText} level. Make the arguments clear and persuasive. Follow any language instructions in the topic.`;

    const { error: apiError, output } = await generateText(prompt);
    if (apiError) setError(apiError);
    else setResult(output);
    setLoading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      <div className="space-y-3 sm:space-y-4">
        <TextArea
          label="Debate Topic"
          placeholder="Enter the debate topic, for example: Should homework be banned? You can add language instructions like 'write in Hindi'."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          rows={4}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <Select label="Class Level" options={classOptions} value={classLevel} onChange={(e) => setClassLevel(e.target.value)} />
          <Select label="Stance" options={stanceOptions} value={stance} onChange={(e) => setStance(e.target.value)} />
        </div>
        <Button onClick={handleGenerate} loading={loading} disabled={!topic.trim()} className="w-full sm:w-auto">
          Generate Debate
        </Button>
        {error && <p className="text-red-400 text-xs sm:text-sm">{error}</p>}
      </div>
      <ResultBox content={result} isLoading={loading} />
    </div>
  );
}

// ==================== SPEECH WRITER ====================
export function SpeechWriter() {
  const [topic, setTopic] = useState('');
  const [classLevel, setClassLevel] = useState('class-10');
  const [duration, setDuration] = useState('medium');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setError('');
    
    const levelText = classLevel === 'university' ? 'University' : classLevel.replace('-', ' ').replace('class', 'Class');
    
    const prompt = `Write a ${duration}-length speech on: "${topic}"\n\nThis is for a ${levelText} level student. Adjust vocabulary and complexity accordingly.\n\nStructure the speech naturally with:\n- An appropriate and warm greeting\n- An engaging opening that captures attention\n- Well-developed main content with clear ideas flowing naturally\n- A memorable and impactful conclusion\n\nUse ${levelText}-appropriate vocabulary. Make the speech feel genuine and engaging, suitable for delivery in front of an audience. Follow any language instructions in the topic.`;

    const { error: apiError, output } = await generateText(prompt);
    if (apiError) setError(apiError);
    else setResult(output);
    setLoading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      <div className="space-y-3 sm:space-y-4">
        <TextArea
          label="Speech Topic and Details"
          placeholder="Enter the topic and any specific instructions. You can specify speech type (welcome, farewell, motivational) and language like 'write in Bangla'."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          rows={4}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <Select label="Class Level" options={classOptions} value={classLevel} onChange={(e) => setClassLevel(e.target.value)} />
          <Select label="Duration" options={durationOptions} value={duration} onChange={(e) => setDuration(e.target.value)} />
        </div>
        <Button onClick={handleGenerate} loading={loading} disabled={!topic.trim()} className="w-full sm:w-auto">
          Generate Speech
        </Button>
        {error && <p className="text-red-400 text-xs sm:text-sm">{error}</p>}
      </div>
      <ResultBox content={result} isLoading={loading} />
    </div>
  );
}

// ==================== SUMMARY GENERATOR ====================
export function SummaryGenerator() {
  const [text, setText] = useState('');
  const [style, setStyle] = useState('medium');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError('');
    
    const styleGuide = style === 'very-short' ? 'very brief, 3-5 sentences maximum' : style === 'medium' ? 'moderate length, covering all main points' : 'detailed but using simple language, covering all important aspects';
    
    const prompt = `Summarize this text. Make it ${styleGuide}:\n\n"${text}"\n\nUse clear, simple language. Start with a clear title like "Summary" then provide the summarized content. Highlight the main ideas clearly.`;

    const { error: apiError, output } = await generateText(prompt);
    if (apiError) setError(apiError);
    else setResult(output);
    setLoading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      <div className="space-y-3 sm:space-y-4">
        <TextArea
          label="Text to Summarize"
          placeholder="Paste the long text, article, or chapter you want to summarize..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
        />
        <Select label="Summary Style" options={summaryStyleOptions} value={style} onChange={(e) => setStyle(e.target.value)} />
        <Button onClick={handleGenerate} loading={loading} disabled={!text.trim()} className="w-full sm:w-auto">
          Generate Summary
        </Button>
        {error && <p className="text-red-400 text-xs sm:text-sm">{error}</p>}
      </div>
      <ResultBox content={result} isLoading={loading} />
    </div>
  );
}

// ==================== GRAMMAR CORRECTOR ====================
export function GrammarCorrector() {
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError('');
    setResult('');
    
    const prompt = `You are an expert grammar corrector and writing improvement assistant. Your job is to fix ALL errors and make the text professional and well-written.\n\nYOUR TASKS:\n1. Fix ALL spelling mistakes and typos completely\n2. Fix ALL grammar and punctuation errors\n3. Rewrite sentences to be clear, professional, and well-structured\n4. Improve word choices to sound more polished and educated\n5. Combine choppy sentences into smooth, flowing prose when needed\n6. Make the text sound professional and impressive\n7. Use proper capitalization, punctuation, and formatting\n8. Keep the original meaning while upgrading the quality significantly\n\nEXAMPLES:\n\nInput: "my name is tahmid. i live in bangladesh i am currently reading in class 8 and my roll is 3"\nOutput: "My name is Tahmid. I live in Bangladesh. I am currently studying in Class 8, and my roll number is 3."\n\nInput: "i went to school today it was good the teacher teached us math"\nOutput: "I went to school today, and it was a great experience. The teacher taught us mathematics."\n\nInput: "he dont know nothing about this thing"\nOutput: "He does not know anything about this matter."\n\nNow fix all errors and professionally improve this text:\n\n"${text}"\n\nStart with "Corrected Text" as the heading, then provide the fully corrected and professionally improved version.`;

    const { error: apiError, output } = await generateText(prompt);
    if (apiError) setError(apiError);
    else setResult(output);
    setLoading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      <div className="space-y-3 sm:space-y-4">
        <TextArea
          label="Text to Correct"
          placeholder="Paste any text here. The AI will fix all spelling and grammar errors AND rewrite sentences to be professional and well-written..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
        />
        <Button onClick={handleGenerate} loading={loading} disabled={!text.trim()} className="w-full sm:w-auto">
          Correct Text
        </Button>
        {error && <p className="text-red-400 text-xs sm:text-sm">{error}</p>}
      </div>
      <ResultBox content={result} isLoading={loading} />
    </div>
  );
}

// ==================== PARAGRAPH WRITER ====================
export function ParagraphWriter() {
  const [topic, setTopic] = useState('');
  const [wordCount, setWordCount] = useState('200');
  const [customWordCount, setCustomWordCount] = useState('');
  const [classLevel, setClassLevel] = useState('class-10');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    const finalWordCount = wordCount === 'custom' ? customWordCount : wordCount;
    if (!finalWordCount || parseInt(finalWordCount) < 50) {
      setError('Please enter a valid word count (minimum 50 words)');
      return;
    }
    setLoading(true);
    setError('');
    
    const levelText = classLevel === 'university' ? 'University' : classLevel.replace('-', ' ').replace('class', 'Class');
    
    const prompt = `Write a well-structured paragraph of approximately ${finalWordCount} words on: "${topic}"\n\nThis is for a ${levelText} student.\n\nStart with a clear, bold title for the paragraph on its own line. Then write the paragraph with:\n- A strong topic sentence that introduces the main idea\n- Supporting details, examples, and explanations that develop the idea\n- Smooth transitions between sentences\n- A concluding sentence that ties everything together\n\nUse ${levelText}-appropriate vocabulary. Make important words and phrases stand out naturally. Follow any language instructions in the topic.`;

    const { error: apiError, output } = await generateText(prompt);
    if (apiError) setError(apiError);
    else setResult(output);
    setLoading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      <div className="space-y-3 sm:space-y-4">
        <TextArea
          label="Topic and Details"
          placeholder="Enter the topic and any details. Example: My Best Friend, simple language, write in Bangla."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          rows={4}
        />
        <WordCountSelector
          options={wordCountOptions}
          value={wordCount}
          customValue={customWordCount}
          onChange={setWordCount}
          onCustomChange={setCustomWordCount}
          minWords={50}
        />
        <Select label="Class Level" options={classOptions} value={classLevel} onChange={(e) => setClassLevel(e.target.value)} />
        <Button onClick={handleGenerate} loading={loading} disabled={!topic.trim() || (wordCount === 'custom' && !customWordCount)} className="w-full sm:w-auto">
          Generate Paragraph
        </Button>
        {error && <p className="text-red-400 text-xs sm:text-sm">{error}</p>}
      </div>
      <ResultBox content={result} isLoading={loading} />
    </div>
  );
}

// ==================== ESSAY WRITER ====================
export function EssayWriter() {
  const [topic, setTopic] = useState('');
  const [wordCount, setWordCount] = useState('500');
  const [customWordCount, setCustomWordCount] = useState('');
  const [classLevel, setClassLevel] = useState('class-10');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    const finalWordCount = wordCount === 'custom' ? customWordCount : wordCount;
    if (!finalWordCount || parseInt(finalWordCount) < 100) {
      setError('Please enter a valid word count (minimum 100 words)');
      return;
    }
    setLoading(true);
    setError('');
    
    const levelText = classLevel === 'university' ? 'University' : classLevel.replace('-', ' ').replace('class', 'Class');
    
    const prompt = `Write a comprehensive essay of approximately ${finalWordCount} words on: "${topic}"\n\nThis is for a ${levelText} student. Adjust vocabulary and depth accordingly.\n\nStructure the essay with clear sections:\n\nStart with the essay title on its own line.\n\nThen write an Introduction paragraph with its heading on its own line.\n\nThen write 2-3 Body paragraphs, each with a descriptive paragraph name/heading on its own line (like "The Importance of..." or "Impact on Society" etc.)\n\nEnd with a Conclusion paragraph with its heading on its own line.\n\nEach section heading should be on its own line. Use smooth transitions between paragraphs. Include relevant examples and evidence. Make important concepts and key phrases stand out naturally. Use ${levelText}-appropriate vocabulary throughout. Follow any language instructions in the topic.`;

    const { error: apiError, output } = await generateText(prompt);
    if (apiError) setError(apiError);
    else setResult(output);
    setLoading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      <div className="space-y-3 sm:space-y-4">
        <TextArea
          label="Topic and Instructions"
          placeholder="Enter the essay topic and any specific instructions. You can specify language preferences like 'write in Hindi'."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          rows={4}
        />
        <WordCountSelector
          options={essayWordCountOptions}
          value={wordCount}
          customValue={customWordCount}
          onChange={setWordCount}
          onCustomChange={setCustomWordCount}
          minWords={100}
        />
        <Select label="Class Level" options={classOptions} value={classLevel} onChange={(e) => setClassLevel(e.target.value)} />
        <Button onClick={handleGenerate} loading={loading} disabled={!topic.trim() || (wordCount === 'custom' && !customWordCount)} className="w-full sm:w-auto">
          Generate Essay
        </Button>
        {error && <p className="text-red-400 text-xs sm:text-sm">{error}</p>}
      </div>
      <ResultBox content={result} isLoading={loading} />
    </div>
  );
}

// ==================== COMPOSITION WRITER ====================
export function CompositionWriter() {
  const [topic, setTopic] = useState('');
  const [wordCount, setWordCount] = useState('300');
  const [customWordCount, setCustomWordCount] = useState('');
  const [classLevel, setClassLevel] = useState('class-10');
  const [style, setStyle] = useState('narrative');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    const finalWordCount = wordCount === 'custom' ? customWordCount : wordCount;
    if (!finalWordCount || parseInt(finalWordCount) < 100) {
      setError('Please enter a valid word count (minimum 100 words)');
      return;
    }
    setLoading(true);
    setError('');
    
    const levelText = classLevel === 'university' ? 'University' : classLevel.replace('-', ' ').replace('class', 'Class');
    
    const styleGuide = style === 'narrative' 
      ? 'Use storytelling elements with characters, events, and a natural story arc. Make the reader feel like they are experiencing the story.'
      : style === 'descriptive'
      ? 'Use vivid imagery, sensory details (sight, sound, smell, touch, taste), and rich descriptions to paint a picture with words.'
      : 'Include personal thoughts, reflections, insights, and lessons learned. Make it thoughtful and introspective.';
    
    const prompt = `Write a ${style} composition of approximately ${finalWordCount} words on: "${topic}"\n\nThis is for a ${levelText} student.\n\nStart with a creative title on its own line.\n\nThen write the composition as flowing prose paragraphs WITHOUT any section headings or paragraph names. Let the text flow naturally from one paragraph to the next like a real composition.\n\n${styleGuide}\n\nUse ${levelText}-appropriate vocabulary. Make it engaging, well-structured, and a pleasure to read. Follow any language instructions in the topic.`;

    const { error: apiError, output } = await generateText(prompt);
    if (apiError) setError(apiError);
    else setResult(output);
    setLoading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      <div className="space-y-3 sm:space-y-4">
        <TextArea
          label="Composition Topic"
          placeholder="Enter the topic. Examples: A rainy day, My school, A visit to the zoo, My favorite festival..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          rows={4}
        />
        <WordCountSelector
          options={compositionWordCountOptions}
          value={wordCount}
          customValue={customWordCount}
          onChange={setWordCount}
          onCustomChange={setCustomWordCount}
          minWords={100}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <Select label="Class Level" options={classOptions} value={classLevel} onChange={(e) => setClassLevel(e.target.value)} />
          <Select label="Style" options={compositionStyleOptions} value={style} onChange={(e) => setStyle(e.target.value)} />
        </div>
        <Button onClick={handleGenerate} loading={loading} disabled={!topic.trim() || (wordCount === 'custom' && !customWordCount)} className="w-full sm:w-auto">
          Generate Composition
        </Button>
        {error && <p className="text-red-400 text-xs sm:text-sm">{error}</p>}
      </div>
      <ResultBox content={result} isLoading={loading} />
    </div>
  );
}

// ==================== STORY GENERATOR ====================
export function StoryGenerator() {
  const [topic, setTopic] = useState('');
  const [wordCount, setWordCount] = useState('500');
  const [customWordCount, setCustomWordCount] = useState('');
  const [classLevel, setClassLevel] = useState('class-10');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    const finalWordCount = wordCount === 'custom' ? customWordCount : wordCount;
    if (!finalWordCount || parseInt(finalWordCount) < 100) {
      setError('Please enter a valid word count (minimum 100 words)');
      return;
    }
    setLoading(true);
    setError('');
    
    const levelText = classLevel === 'university' ? 'University' : classLevel.replace('-', ' ').replace('class', 'Class');
    
    const prompt = `Write an engaging and creative story of approximately ${finalWordCount} words based on: "${topic}"\n\nThis is for a ${levelText} student. Adjust vocabulary, themes, and complexity accordingly.\n\nStart with a compelling story title on its own line.\n\nThen write the story with:\n- An attention-grabbing opening that sets the scene and introduces characters\n- Rising action that builds tension and interest\n- A meaningful climax or turning point\n- A satisfying resolution\n- Optionally end with a moral or lesson if appropriate\n\nMake the characters feel real, the dialogue natural, and the descriptions vivid. Use ${levelText}-appropriate vocabulary. Follow any language instructions in the topic.`;

    const { error: apiError, output } = await generateText(prompt);
    if (apiError) setError(apiError);
    else setResult(output);
    setLoading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      <div className="space-y-3 sm:space-y-4">
        <TextArea
          label="Story Topic and Details"
          placeholder="Enter the story topic, characters, setting, or any specific details. You can specify language preferences like 'write in Bangla'."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          rows={5}
        />
        <WordCountSelector
          options={storyWordCountOptions}
          value={wordCount}
          customValue={customWordCount}
          onChange={setWordCount}
          onCustomChange={setCustomWordCount}
          minWords={100}
        />
        <Select label="Class Level" options={classOptions} value={classLevel} onChange={(e) => setClassLevel(e.target.value)} />
        <Button onClick={handleGenerate} loading={loading} disabled={!topic.trim() || (wordCount === 'custom' && !customWordCount)} className="w-full sm:w-auto">
          Generate Story
        </Button>
        {error && <p className="text-red-400 text-xs sm:text-sm">{error}</p>}
      </div>
      <ResultBox content={result} isLoading={loading} />
    </div>
  );
}

// ==================== AI HUMANIZER ====================
export function AIHumanizer() {
  const [text, setText] = useState('');
  const [style, setStyle] = useState('natural');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError('');
    
    const styleGuide = style === 'natural' 
      ? 'Make it sound like a real person wrote it in a conversational, natural way. Add personal touches, varied sentence lengths, and natural flow.'
      : style === 'professional'
      ? 'Keep it professional but make it sound like a real human expert wrote it, not a machine. Add subtle personality and natural phrasing.'
      : style === 'casual'
      ? 'Make it sound casual and friendly, like someone talking to a friend. Use informal language, contractions, and a warm tone.'
      : 'Keep the academic quality but make it read like a knowledgeable human student or researcher wrote it naturally.';
    
    const prompt = `Humanize this text to make it sound like a real person wrote it, not an AI. Rewrite it completely while keeping the same meaning and information:\n\n"${text}"\n\nStyle: ${styleGuide}\n\nImportant guidelines for humanizing:\n- Vary sentence length naturally (mix short punchy sentences with longer ones)\n- Use natural transitions and connecting words that humans use\n- Add subtle imperfections that make text feel human (like starting a sentence with "And" or "But" occasionally)\n- Avoid overly formal or robotic phrasing\n- Remove any patterns that feel repetitive or formulaic\n- Make the vocabulary choices feel natural and varied\n- Keep the tone genuine and authentic\n- Maintain the original meaning and all key information\n- The result should pass AI detection tools as human-written\n\nProvide only the rewritten version without any headers or explanations.`;

    const { error: apiError, output } = await generateText(prompt);
    if (apiError) setError(apiError);
    else setResult(output);
    setLoading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      <div className="space-y-3 sm:space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Humanization Style</label>
          <select 
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="natural">Natural and Conversational</option>
            <option value="professional">Professional but Human</option>
            <option value="casual">Casual and Friendly</option>
            <option value="academic">Academic but Readable</option>
          </select>
        </div>
        <TextArea
          label="Paste Your Content"
          placeholder="Paste any AI-generated text here and the AI will rewrite it to sound more natural and human-written. This helps bypass AI detection tools and makes the text feel genuine."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
        />
        <Button onClick={handleGenerate} loading={loading} disabled={!text.trim()} className="w-full sm:w-auto">
          Humanize Text
        </Button>
        {error && <p className="text-red-400 text-xs sm:text-sm">{error}</p>}
      </div>
      <ResultBox content={result} isLoading={loading} />
    </div>
  );
}

// ==================== TOOL WRAPPER ====================
export function StudentToolWrapper({ toolId }: StudentToolProps) {
  switch (toolId) {
    case 'application-writer':
      return <ApplicationWriter />;
    case 'letter-writer':
      return <LetterWriter />;
    case 'debate-writer':
      return <DebateWriter />;
    case 'speech-writer':
      return <SpeechWriter />;
    case 'summary-generator':
      return <SummaryGenerator />;
    case 'grammar-corrector':
      return <GrammarCorrector />;
    case 'paragraph-writer':
      return <ParagraphWriter />;
    case 'essay-writer':
      return <EssayWriter />;
    case 'composition-writer':
      return <CompositionWriter />;
    case 'story-generator':
      return <StoryGenerator />;
    case 'ai-humanizer':
      return <AIHumanizer />;
    default:
      return <div className="text-slate-400">Tool not found</div>;
  }
}
