import React, { useState, useRef, useEffect } from 'react';
import { upscaleImageService } from '../../services/aiService';
import { UploadCloud, Wand2, RefreshCw, Download, Image as ImageIcon, ArrowLeftRight, Undo, Eye, X, ZoomIn, ArrowLeft } from 'lucide-react';

const PhotoEnhancer: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [downloadFormat, setDownloadFormat] = useState<'png' | 'jpg'>('png');
  const [detectedAspectRatio, setDetectedAspectRatio] = useState('1:1');
  const containerRef = useRef<HTMLDivElement>(null);

  const calculateAspectRatio = (width: number, height: number): string => {
    const ratio = width / height;
    if (ratio > 1.5) return '16:9';
    if (ratio > 1.2) return '4:3';
    if (ratio < 0.65) return '9:16';
    if (ratio < 0.85) return '3:4';
    return '1:1';
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setFile(f);
      const reader = new FileReader();
      reader.onload = (ev) => {
        const base64 = ev.target?.result as string;
        setFilePreview(base64);
        
        // Detect aspect ratio
        const img = new Image();
        img.onload = () => {
          const ratio = calculateAspectRatio(img.width, img.height);
          setDetectedAspectRatio(ratio);
        };
        img.src = base64;
      };
      reader.readAsDataURL(f);
      setResult(null);
    }
  };

  const handleEnhance = async () => {
    if (!filePreview || !file) return;
    setLoading(true);
    try {
      const enhancedImage = await upscaleImageService(filePreview, file.type, detectedAspectRatio);
      setResult(enhancedImage);
    } catch (e) { 
      alert("Upscaling failed. Please ensure the image isn't too large."); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const link = document.createElement('a');
    link.href = result;
    link.download = `cutverse-upscaled.${downloadFormat}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMove = (e: any) => {
    if (!isDragging || !containerRef.current) return;
    let clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPosition((x / rect.width) * 100);
  };

  useEffect(() => {
    const stopDrag = () => setIsDragging(false);
    window.addEventListener('mouseup', stopDrag);
    window.addEventListener('touchend', stopDrag);
    return () => { window.removeEventListener('mouseup', stopDrag); window.removeEventListener('touchend', stopDrag); };
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4">
      <button 
        onClick={() => window.location.hash = '#/'} 
        className="flex items-center text-xs font-bold text-gray-500 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft size={16} className="mr-2" /> 
        Back to Tools
      </button>

      <div className="mb-10 text-center">
        <h1 className="text-3xl font-heading font-bold text-white mb-2">AI Image Upscaler</h1>
        <p className="text-gray-400">Enhance quality without cropping or zooming.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        <div className="md:col-span-4 space-y-6">
          <div className="bg-navy-800 rounded-3xl p-6 border border-white/5 shadow-xl">
             {!filePreview ? (
                <div className="border-2 border-dashed border-navy-700 rounded-2xl p-10 text-center hover:bg-white/5 relative cursor-pointer group transition-all">
                  <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                  <UploadCloud size={40} className="mx-auto mb-4 text-gray-600 group-hover:text-primary transition-colors" />
                  <p className="font-bold text-sm text-gray-500">Upload Image</p>
                </div>
             ) : (
                <div className="space-y-6">
                  <div className="relative rounded-2xl overflow-hidden border border-white/10 group">
                    <img src={filePreview} alt="Preview" className="w-full h-40 object-cover" />
                    <button 
                      onClick={() => { setFilePreview(null); setResult(null); }} 
                      className="absolute top-3 right-3 p-2 bg-black/60 rounded-full text-white hover:bg-red-500 transition-all"
                    >
                      <Undo size={14} />
                    </button>
                  </div>
                  
                  {!result && (
                    <button 
                      onClick={handleEnhance} 
                      disabled={loading} 
                      className="w-full py-4 bg-primary text-navy-900 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary-hover transition-all disabled:opacity-50"
                    >
                      {loading ? <RefreshCw className="animate-spin" size={20} /> : <Wand2 size={20} />}
                      {loading ? 'Processing...' : 'Upscale Image'}
                    </button>
                  )}

                  {result && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                      <div className="p-4 bg-navy-900 rounded-2xl border border-white/5">
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-3">Format</label>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setDownloadFormat('png')}
                            className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all ${downloadFormat === 'png' ? 'bg-primary/10 border-primary text-primary' : 'bg-transparent border-white/10 text-gray-500'}`}
                          >
                            PNG
                          </button>
                          <button 
                            onClick={() => setDownloadFormat('jpg')}
                            className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all ${downloadFormat === 'jpg' ? 'bg-primary/10 border-primary text-primary' : 'bg-transparent border-white/10 text-gray-500'}`}
                          >
                            JPG
                          </button>
                        </div>
                      </div>

                      <button 
                        onClick={handleDownload} 
                        className="w-full py-4 bg-white text-navy-900 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-100 transition-all"
                      >
                        <Download size={20} /> Download .{downloadFormat}
                      </button>

                      <button 
                        onClick={() => { setIsPreviewOpen(true); setZoom(1); }} 
                        className="w-full py-4 bg-navy-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 border border-white/5 hover:bg-navy-600 transition-all"
                      >
                        <Eye size={20} /> View Full Photo
                      </button>
                    </div>
                  )}
                </div>
             )}
          </div>
        </div>

        <div className="md:col-span-8">
          <div className="bg-navy-800 rounded-3xl p-3 border border-white/5 min-h-[500px] flex items-center justify-center shadow-2xl relative overflow-hidden">
            {!filePreview ? (
              <div className="text-gray-700 flex flex-col items-center">
                <div className="p-6 bg-navy-900 rounded-full mb-6">
                  <ImageIcon size={48} className="opacity-20" />
                </div>
                <p className="font-medium text-center">Upload an image to start.<br/>Framing will be preserved automatically.</p>
              </div>
            ) : (
              <div 
                className="relative w-full aspect-square md:aspect-auto md:h-[600px] overflow-hidden rounded-2xl bg-navy-950 flex items-center justify-center select-none" 
                ref={containerRef} 
                onMouseDown={handleMouseDown} 
                onTouchStart={handleMouseDown} 
                onMouseMove={handleMove} 
                onTouchMove={handleMove}
              >
                {/* Original Image Layer */}
                <img 
                  src={filePreview} 
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none" 
                  alt="Original"
                />

                {/* Upscaled Image Layer with Clipping */}
                {result && (
                  <div 
                    className="absolute inset-0 w-full h-full z-10 overflow-hidden" 
                    style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                  >
                    <img 
                      src={result} 
                      className="absolute inset-0 w-full h-full object-contain pointer-events-none" 
                      alt="Upscaled"
                    />
                  </div>
                )}

                {/* Slider Divider Handle */}
                {result && (
                  <div 
                    className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20 shadow-[0_0_15px_rgba(255,255,255,0.5)]" 
                    style={{ left: `${sliderPosition}%` }}
                  >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-2xl text-navy-900 border-4 border-navy-900">
                      <ArrowLeftRight size={18} />
                    </div>
                    {/* Labels */}
                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-widest whitespace-nowrap">Upscaled</div>
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-widest translate-x-full whitespace-nowrap">Original</div>
                  </div>
                )}

                {/* Loading State Overlay */}
                {loading && (
                  <div className="absolute inset-0 bg-navy-950/80 backdrop-blur-md flex flex-col items-center justify-center z-30 animate-in fade-in">
                    <RefreshCw className="animate-spin text-primary mb-6" size={48} />
                    <p className="text-primary font-heading font-bold text-xl tracking-tight">Upscaling Masterpiece...</p>
                    <p className="text-gray-500 text-sm mt-2">Targeting High Resolution ({detectedAspectRatio})</p>
                  </div>
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

export default PhotoEnhancer;