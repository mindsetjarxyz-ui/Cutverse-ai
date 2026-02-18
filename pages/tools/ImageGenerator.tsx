import React, { useState } from 'react';
import { generateImage } from '../../services/aiService';
import { Download, Sparkles, Image as ImageIcon, RefreshCw, Eye, X, ZoomIn, ArrowLeft } from 'lucide-react';

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
      const imageUrl = await generateImage(prompt, aspect, style);
      setResult(imageUrl);
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
    <div className="max-w-6xl mx-auto px-4">
      <button 
        onClick={() => window.location.hash = '#/'} 
        className="flex items-center text-xs font-bold text-gray-500 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft size={16} className="mr-2" /> 
        Back to Tools
      </button>

      <div className="mb-8 text-center md:text-left">
        <h1 className="text-3xl font-heading font-bold text-white mb-2">AI Image Generator</h1>
        <p className="text-gray-400">Create stunning artwork and photorealistic images from text.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-navy-800 p-6 rounded-3xl border border-white/5 shadow-xl">
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Prompt</label>
                <textarea 
                  className="w-full rounded-2xl border-white/10 border p-4 text-sm bg-navy-950/50 text-gray-200 min-h-[160px] focus:outline-none focus:border-primary/40 transition-all placeholder:text-gray-700 resize-none"
                  placeholder="A futuristic city with flying cars..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                ></textarea>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Art Style</label>
                <div className="flex flex-wrap gap-2">
                  {STYLES.map(s => (
                    <button
                      key={s}
                      onClick={() => setStyle(s)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                        style === s 
                          ? 'bg-primary text-navy-900 border-primary' 
                          : 'bg-navy-900 text-gray-400 border-white/10 hover:border-primary/50 hover:text-gray-300'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Aspect Ratio</label>
                <div className="flex gap-2">
                  {['1:1', '16:9', '9:16', '4:3', '3:4'].map(r => (
                    <button
                      key={r}
                      onClick={() => setAspect(r)}
                      className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all ${
                        aspect === r 
                          ? 'bg-primary/10 border-primary text-primary' 
                          : 'bg-transparent border-white/10 text-gray-500'
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
                className="w-full py-4 bg-gradient-to-r from-primary to-cyan-400 text-navy-900 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
              >
                {loading ? <RefreshCw className="animate-spin" size={20} /> : <Sparkles size={20} />}
                {loading ? 'Dreaming...' : 'Generate Image'}
              </button>
            </div>
          </div>
        </div>

        <div>
          <div className={`bg-navy-800 rounded-3xl border border-white/5 shadow-2xl overflow-hidden relative group flex items-center justify-center aspect-square shadow-inner`}>
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
                    className="pointer-events-auto p-4 bg-white rounded-full text-navy-900 hover:scale-110 transition-all shadow-2xl flex items-center justify-center"
                  >
                    <Eye size={24} />
                  </button>
                  <button 
                    onClick={handleDownload}
                    className="pointer-events-auto p-4 bg-white rounded-full text-navy-900 hover:scale-110 transition-all shadow-2xl flex items-center justify-center"
                  >
                    <Download size={24} />
                  </button>
                </div>
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-navy-900/50 text-gray-800 p-4">
                {loading ? (
                  <div className="text-center">
                    <div className="w-16 h-16 border-4 border-navy-700 border-t-primary rounded-full animate-spin mx-auto mb-6"></div>
                    <p className="text-lg font-heading font-bold text-primary animate-pulse">Creating Masterpiece...</p>
                  </div>
                ) : (
                  <>
                    <ImageIcon size={64} className="opacity-10 mb-6" />
                    <p className="text-sm font-bold tracking-tight">Your vision will appear here</p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {isPreviewOpen && result && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-6 backdrop-blur-xl animate-in fade-in duration-300" 
          onClick={() => setIsPreviewOpen(false)}
          onWheel={(e) => {
            const delta = -e.deltaY * 0.002;
            setZoom(z => Math.min(Math.max(0.5, z + delta), 10));
          }}
        >
          <button 
            className="absolute top-10 right-10 p-3 bg-white/10 text-white hover:bg-white/20 rounded-full transition-all z-[110]"
            onClick={() => setIsPreviewOpen(false)}
          >
            <X size={28} />
          </button>
          
          <img 
            src={result} 
            alt="Full Preview" 
            className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl transition-transform duration-100 ease-out" 
            style={{ transform: `scale(${zoom})` }}
            onClick={(e) => e.stopPropagation()}
          />

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-navy-900/80 text-white px-6 py-3 rounded-full text-sm backdrop-blur-md border border-white/10 shadow-2xl">
            <ZoomIn size={16} className="text-primary" />
            <span className="font-bold">ZOOM: {Math.round(zoom * 100)}%</span>
            <span className="text-gray-500 ml-2">Scroll wheel to adjust</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGenerator;