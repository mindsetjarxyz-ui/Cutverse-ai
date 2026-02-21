import { useState } from 'react';
import { TextArea } from '@/components/ui/TextArea';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { ResultBox } from '@/components/ui/ResultBox';
import { Copy, Check } from 'lucide-react';
import { generateText } from '@/services/ai';

interface SocialToolProps {
  toolId: string;
}

const titleStyleOptions = [
  { value: 'clickbait', label: 'Very Clickbait' },
  { value: 'professional', label: 'Professional but Catchy' },
  { value: 'simple', label: 'Simple and Clear' },
];

const videoTypeOptions = [
  { value: 'educational', label: 'Educational' },
  { value: 'storytelling', label: 'Storytelling' },
  { value: 'review', label: 'Review' },
  { value: 'tutorial', label: 'Tutorial' },
  { value: 'vlog', label: 'Vlog Style' },
];

const videoLengthOptions = [
  { value: 'short', label: 'Short Video (Under 5 min)' },
  { value: 'medium', label: '5-10 Minutes' },
  { value: 'long', label: '10-20 Minutes' },
];

const languageOptions = [
  { value: 'english', label: 'English' },
  { value: 'hindi', label: 'Hindi' },
  { value: 'bangla', label: 'Bangla' },
  { value: 'spanish', label: 'Spanish' },
  { value: 'arabic', label: 'Arabic' },
];

// ==================== YOUTUBE TITLE GENERATOR ====================
export function YouTubeTitleGenerator() {
  const [topic, setTopic] = useState('');
  const [style, setStyle] = useState('clickbait');
  const [titles, setTitles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setError('');
    setTitles([]);
    
    const styleText = titleStyleOptions.find(o => o.value === style)?.label || style;
    
    const prompt = `Generate exactly 6 ${styleText} YouTube video titles for this topic: "${topic}"

Make them attention-grabbing, click-worthy, and optimized for YouTube search. Each title should be unique, different in structure, and under 70 characters.

Return ONLY the 6 titles, one per line, numbered 1 through 6. No extra text or explanations.`;

    const { error: apiError, output } = await generateText(prompt);
    
    if (apiError) {
      setError(apiError);
    } else {
      const lines = output.split('\n')
        .map(line => line.replace(/^\d+[\.\)\-\:]\s*/, '').trim())
        .filter(line => line.length > 5 && !line.toLowerCase().includes('here are') && !line.toLowerCase().includes('sure'));
      setTitles(lines.slice(0, 6));
    }
    setLoading(false);
  };

  const copyTitle = async (title: string, index: number) => {
    await navigator.clipboard.writeText(title);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const copyAll = async () => {
    await navigator.clipboard.writeText(titles.join('\n'));
    setCopiedIndex(-1);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="space-y-4">
        <Input
          label="Topic or Current Title"
          placeholder="Enter your video topic or a weak title you want to improve"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
        <Select label="Style" options={titleStyleOptions} value={style} onChange={(e) => setStyle(e.target.value)} />
        <Button onClick={handleGenerate} loading={loading} disabled={!topic.trim()}>
          Generate Titles
        </Button>
        {error && <p className="text-red-400 text-sm">{error}</p>}
      </div>
      
      <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl overflow-hidden">
        <div className="px-4 py-2 border-b border-slate-700/50 bg-slate-800/50 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-medium">Generated Titles</span>
          {titles.length > 0 && (
            <button
              onClick={copyAll}
              className="flex items-center gap-1.5 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md transition-colors"
            >
              {copiedIndex === -1 ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              Copy All
            </button>
          )}
        </div>
        
        <div className="p-4 min-h-[200px]">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="flex items-center gap-3 text-slate-400">
                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm">Generating titles...</span>
              </div>
            </div>
          ) : titles.length > 0 ? (
            <div className="space-y-3">
              {titles.map((title, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg group hover:bg-slate-700/50 transition-colors"
                >
                  <span className="w-6 h-6 flex-shrink-0 bg-blue-600/20 rounded-full flex items-center justify-center text-xs text-blue-400 font-medium">{index + 1}</span>
                  <span className="text-slate-200 flex-1 text-sm">{title}</span>
                  <button
                    onClick={() => copyTitle(title, index)}
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-600 rounded transition-colors opacity-60 group-hover:opacity-100"
                  >
                    {copiedIndex === index ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-32 text-slate-500 text-sm">
              Generated titles will appear here
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ==================== YOUTUBE SCRIPT WRITER ====================
export function YouTubeScriptWriter() {
  const [topic, setTopic] = useState('');
  const [videoType, setVideoType] = useState('educational');
  const [length, setLength] = useState('medium');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setError('');
    
    const typeLabel = videoTypeOptions.find(o => o.value === videoType)?.label || videoType;
    const lengthLabel = videoLengthOptions.find(o => o.value === length)?.label || length;
    
    const prompt = `Write a complete YouTube video script for a ${typeLabel} video about: "${topic}"

Target length: ${lengthLabel}

Structure the script with these clear sections (each section heading on its own line):

HOOK (First 5 seconds - grab attention immediately)

INTRODUCTION (Introduce topic and set expectations)

MAIN CONTENT (The core of the video, broken into clear segments with natural transitions)

CALL TO ACTION (Ask viewers to like, subscribe, and comment)

OUTRO (Professional ending)

Include speaker cues like [PAUSE], [SHOW ON SCREEN], [B-ROLL] where appropriate. Write in a conversational, engaging tone that works well when spoken aloud. Make it sound natural and authentic. Follow any language instructions in the topic.`;

    const { error: apiError, output } = await generateText(prompt);
    if (apiError) setError(apiError);
    else setResult(output);
    setLoading(false);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="space-y-4">
        <TextArea
          label="Video Topic and Details"
          placeholder="Describe your video topic, target audience, and any special instructions. You can specify language like 'write in Bangla' or 'make it funny'."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          rows={4}
        />
        <Select label="Video Type" options={videoTypeOptions} value={videoType} onChange={(e) => setVideoType(e.target.value)} />
        <Select label="Video Length" options={videoLengthOptions} value={length} onChange={(e) => setLength(e.target.value)} />
        <Button onClick={handleGenerate} loading={loading} disabled={!topic.trim()}>
          Generate Script
        </Button>
        {error && <p className="text-red-400 text-sm">{error}</p>}
      </div>
      <ResultBox content={result} isLoading={loading} />
    </div>
  );
}

// ==================== YOUTUBE DESCRIPTION GENERATOR ====================
export function YouTubeDescriptionGenerator() {
  const [title, setTitle] = useState('');
  const [keywords, setKeywords] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!title.trim()) return;
    setLoading(true);
    setError('');
    
    const prompt = `Create an SEO-optimized YouTube video description for: "${title}"

${keywords ? `Target keywords and audience: ${keywords}` : ''}

Structure:
- First 2 lines should be compelling (these show in search results before "Show more")
- Clear summary of video content
- Timestamps section (use placeholder timestamps like 0:00, 1:30, etc.)
- Call to action (subscribe, like, comment)
- Social media links section placeholder
- End with 6-10 relevant and trending hashtags

Make it professional, engaging, and optimized for YouTube search. Include keywords naturally throughout.`;

    const { error: apiError, output } = await generateText(prompt);
    if (apiError) setError(apiError);
    else setResult(output);
    setLoading(false);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="space-y-4">
        <Input
          label="Video Title"
          placeholder="Paste your final video title here"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Input
          label="Keywords / Target Audience (Optional)"
          placeholder="Main keywords or target audience, e.g., fitness, beginners, cooking tips"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
        />
        <Button onClick={handleGenerate} loading={loading} disabled={!title.trim()}>
          Generate Description
        </Button>
        {error && <p className="text-red-400 text-sm">{error}</p>}
      </div>
      <ResultBox content={result} isLoading={loading} />
    </div>
  );
}

// ==================== YOUTUBE TAG GENERATOR ====================
export function YouTubeTagGenerator() {
  const [title, setTitle] = useState('');
  const [language, setLanguage] = useState('english');
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!title.trim()) return;
    setLoading(true);
    setError('');
    setTags([]);
    
    const prompt = `Generate 20-25 SEO-friendly YouTube tags for a video about: "${title}"

Language for tags: ${language}

Include a mix of:
- Broad category tags
- Specific topic tags  
- Long-tail keyword tags
- Trending related terms

Return ONLY the tags separated by commas on a single line. No numbering, no explanations, just comma-separated tags.`;

    const { error: apiError, output } = await generateText(prompt);
    
    if (apiError) {
      setError(apiError);
    } else {
      const tagList = output.split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0 && tag.length < 100);
      setTags(tagList);
    }
    setLoading(false);
  };

  const copyTags = async () => {
    await navigator.clipboard.writeText(tags.join(', '));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="space-y-4">
        <Input
          label="Video Title or Keywords"
          placeholder="Enter your video title or main keywords"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Select label="Tags Language" options={languageOptions} value={language} onChange={(e) => setLanguage(e.target.value)} />
        <Button onClick={handleGenerate} loading={loading} disabled={!title.trim()}>
          Generate Tags
        </Button>
        {error && <p className="text-red-400 text-sm">{error}</p>}
      </div>
      
      <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl overflow-hidden">
        <div className="px-4 py-2 border-b border-slate-700/50 bg-slate-800/50 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-medium">Generated Tags</span>
          {tags.length > 0 && (
            <button
              onClick={copyTags}
              className="flex items-center gap-1.5 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              Copy All Tags
            </button>
          )}
        </div>
        
        <div className="p-4 min-h-[200px]">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="flex items-center gap-3 text-slate-400">
                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm">Generating tags...</span>
              </div>
            </div>
          ) : tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span 
                  key={index}
                  className="px-3 py-1.5 bg-blue-600/20 text-blue-300 rounded-full text-sm border border-blue-500/30 hover:bg-blue-600/30 transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-32 text-slate-500 text-sm">
              Generated tags will appear here as pills
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ==================== TOOL WRAPPER ====================
export function SocialToolWrapper({ toolId }: SocialToolProps) {
  switch (toolId) {
    case 'youtube-title':
      return <YouTubeTitleGenerator />;
    case 'youtube-script':
      return <YouTubeScriptWriter />;
    case 'youtube-description':
      return <YouTubeDescriptionGenerator />;
    case 'youtube-tags':
      return <YouTubeTagGenerator />;
    default:
      return <div className="text-slate-400">Tool not found</div>;
  }
}
