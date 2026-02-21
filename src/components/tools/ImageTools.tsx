import { useState } from 'react';
import { TextArea } from '@/components/ui/TextArea';
import { Button } from '@/components/ui/Button';
import { Download, RefreshCw } from 'lucide-react';
import { generateImage } from '@/services/ai';

interface ImageToolProps {
  toolId: string;
}

export function ImageGenerator() {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError('');
    setResult('');
    
    // Build the full prompt with quality enhancers
    const fullPrompt = `${prompt.trim()}, high quality, detailed, 4k`;
    
    const { error: apiError, output } = await generateImage(fullPrompt);
    
    if (apiError) {
      setError(apiError);
    } else if (output) {
      setResult(output);
    } else {
      setError('No image was generated. Please try again.');
    }
    setLoading(false);
  };

  const handleDownload = () => {
    if (!result) return;
    
    const link = document.createElement('a');
    link.href = result;
    link.download = `cutverse-ai-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Input Section */}
      <div className="space-y-5">
        <TextArea
          label="Image Description"
          placeholder="Describe the image you want, for example: a futuristic city at sunset with flying cars and neon lights, a cute cat wearing a wizard hat, a beautiful mountain landscape, anime girl with blue hair..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={5}
        />
        
        <div className="flex flex-wrap gap-3">
          <Button onClick={handleGenerate} loading={loading} disabled={!prompt.trim()}>
            Generate Image
          </Button>
          {result && (
            <Button variant="ghost" onClick={handleGenerate} disabled={loading} className="text-slate-300 border border-slate-600">
              <RefreshCw className="w-4 h-4 mr-2" />
              Regenerate
            </Button>
          )}
        </div>
        
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}
      </div>
      
      {/* Preview Section */}
      <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl overflow-hidden">
        <div className="px-4 py-2 border-b border-slate-700/50 bg-slate-800/50 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-medium">Preview</span>
          {result && (
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Download PNG
            </button>
          )}
        </div>
        
        <div className="p-4 min-h-[300px] flex items-center justify-center">
          {loading ? (
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <div className="text-center">
                <p className="text-slate-300 text-sm font-medium">Generating your image...</p>
                <p className="text-slate-500 text-xs mt-1">This may take 10-30 seconds</p>
              </div>
            </div>
          ) : result ? (
            <img 
              src={result} 
              alt="Generated" 
              className="max-w-full max-h-[500px] rounded-lg shadow-lg object-contain"
            />
          ) : (
            <div className="text-center text-slate-500">
              <div className="w-16 h-16 mx-auto mb-3 bg-slate-700/50 rounded-xl flex items-center justify-center">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-sm">Your generated image will appear here</p>
              <p className="text-xs mt-1 text-slate-600">Describe what you want and click Generate</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function ImageToolWrapper({ toolId }: ImageToolProps) {
  switch (toolId) {
    case 'image-generator':
      return <ImageGenerator />;
    default:
      return <div className="text-slate-400">Tool not found</div>;
  }
}
