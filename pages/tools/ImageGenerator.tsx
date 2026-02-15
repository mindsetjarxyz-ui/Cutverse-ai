import React, { useState } from 'react';
import { generateImage } from '../../services/geminiService';
import { Download, Sparkles, Image as ImageIcon, RefreshCw } from 'lucide-react';

const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [aspect, setAspect] = useState('1:1');

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    setResult(null);
    try {
      const imageBase64 = await generateImage(prompt);
      if (imageBase64) {
        setResult(imageBase64);
      } else {
        alert("The model generated a response but no image data was found. Try a different prompt.");
      }
    } catch (e) {
      alert("Failed to generate image. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (result) {
      const link = document.createElement('a');
      link.href = result;
      link.download = `cutverse-ai-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-white mb-2">AI Image Generator</h1>
        <p className="text-gray-400">Create stunning artwork and photorealistic images from text.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Controls */}
        <div className="space-y-6">
          <div className="bg-navy-800 p-6 rounded-2xl border border-white/5 shadow-lg">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Prompt</label>
                <textarea 
                  className="w-full rounded-xl border-white/10 border p-4 text-sm focus:ring-primary focus:border-primary min-h-[140px] bg-navy-900 text-gray-200 resize-none placeholder-gray-600"
                  placeholder="A futuristic city with flying cars, neon lights, cyberpunk style, highly detailed..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Aspect Ratio</label>
                <div className="grid grid-cols-3 gap-2">
                  {['1:1', '16:9', '9:16'].map(r => (
                    <button
                      key={r}
                      onClick={() => setAspect(r)}
                      className={`py-2 rounded-lg text-sm font-medium border transition-all ${
                        aspect === r 
                          ? 'bg-primary/20 border-primary text-primary' 
                          : 'bg-navy-900 border-white/10 text-gray-400 hover:bg-white/5'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading || !prompt}
                className="w-full py-4 bg-gradient-to-r from-primary to-cyan-400 text-navy-900 rounded-xl font-bold shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {loading ? <RefreshCw className="animate-spin" /> : <Sparkles />}
                {loading ? 'Dreaming...' : 'Generate Image'}
              </button>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div>
          <div className="bg-navy-800 rounded-2xl border border-white/5 shadow-lg overflow-hidden aspect-square relative group">
            {result ? (
              <>
                <img 
                  src={result} 
                  alt="Generated AI" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <button 
                    onClick={handleDownload}
                    className="p-3 bg-white rounded-full text-navy-900 hover:bg-gray-200 transition-colors shadow-lg"
                  >
                    <Download size={24} />
                  </button>
                </div>
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-navy-900 text-gray-500">
                {loading ? (
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-navy-700 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-sm font-medium animate-pulse text-primary">Creating your masterpiece...</p>
                  </div>
                ) : (
                  <>
                    <ImageIcon size={48} className="opacity-20 mb-4" />
                    <p className="text-sm">Enter a prompt to start</p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageGenerator;
