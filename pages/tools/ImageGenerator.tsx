import React, { useState } from 'react';
import { generateImage } from '../../services/geminiService';
import { Download, Sparkles, Image as ImageIcon, RefreshCw, Eye, X, ZoomIn } from 'lucide-react';

const STYLES = ['None', 'Photorealistic', 'Anime', 'Oil Painting', 'Abstract', 'Cyberpunk', 'Watercolor', '3D Render', 'Sketch'];

const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [aspect, setAspect] = useState('1:1');
  const [style, setStyle] = useState('None');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [zoom, setZoom] = useState(1);

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    setResult(null);
    try {
      const imageBase64 = await generateImage(prompt, aspect, style);
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

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (result) {
      const link = document.createElement('a');
      link.href = result;
      link.download = `cutverse-ai-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (result) {
      setZoom(1);
      setIsPreviewOpen(true);
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

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Art Style</label>
                <div className="flex flex-wrap gap-2">
                  {STYLES.map(s => (
                    <button
                      key={s}
                      onClick={() => setStyle(s)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                        style === s 
                          ? 'bg-primary text-navy-900 border-primary' 
                          : 'bg-navy-900 text-gray-400 border-white/10 hover:border-primary/50'
                      }`}
                    >
                      {s}
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
          <div className={`bg-navy-800 rounded-2xl border border-white/5 shadow-lg overflow-hidden relative group flex items-center justify-center ${aspect === '9:16' ? 'aspect-[9/16]' : aspect === '16:9' ? 'aspect-[16/9]' : 'aspect-square'}`}>
            {result ? (
              <>
                <img 
                  src={result} 
                  alt="Generated AI" 
                  className="w-full h-full object-contain cursor-pointer"
                  onClick={handleView}
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 pointer-events-none">
                  <button 
                    onClick={handleView}
                    className="pointer-events-auto p-3 bg-white rounded-full text-navy-900 hover:bg-gray-200 transition-colors shadow-lg flex items-center justify-center"
                    title="View Photo"
                  >
                    <Eye size={24} />
                  </button>
                  <button 
                    onClick={handleDownload}
                    className="pointer-events-auto p-3 bg-white rounded-full text-navy-900 hover:bg-gray-200 transition-colors shadow-lg flex items-center justify-center"
                    title="Download Photo"
                  >
                    <Download size={24} />
                  </button>
                </div>
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-navy-900 text-gray-500 p-4">
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

      {/* Lightbox Modal */}
      {isPreviewOpen && result && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200 overflow-hidden" 
          onClick={() => setIsPreviewOpen(false)}
          onWheel={(e) => {
            const delta = -e.deltaY * 0.002;
            setZoom(z => Math.min(Math.max(0.5, z + delta), 8));
          }}
        >
          <button 
            className="absolute top-6 right-6 p-2 bg-white/10 text-white hover:bg-white/20 rounded-full transition-colors z-[60]"
            onClick={() => setIsPreviewOpen(false)}
          >
            <X size={24} />
          </button>
          
          <img 
            src={result} 
            alt="Full Preview" 
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl transition-transform duration-75 ease-out" 
            style={{ transform: `scale(${zoom})` }}
            onClick={(e) => e.stopPropagation()}
          />

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/50 text-white px-4 py-2 rounded-full text-sm pointer-events-none backdrop-blur-sm border border-white/10">
            <ZoomIn size={14} className="text-primary" />
            <span>Use mouse wheel to zoom: {Math.round(zoom * 100)}%</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGenerator;