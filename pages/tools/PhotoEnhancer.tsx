import React, { useState, useRef, useEffect } from 'react';
import { editImage } from '../../services/geminiService';
import { UploadCloud, Wand2, RefreshCw, Download, Image as ImageIcon, ArrowLeftRight, Undo } from 'lucide-react';

const PhotoEnhancer: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setFile(f);
      const reader = new FileReader();
      reader.onload = (ev) => setFilePreview(ev.target?.result as string);
      reader.readAsDataURL(f);
      setResult(null);
    }
  };

  const handleEnhance = async () => {
    if (!file || !filePreview) return;
    setLoading(true);
    setResult(null);

    try {
      const base64 = filePreview.split(',')[1];
      const mime = file.type;
      const prompt = "Generate a high-resolution, photorealistic version of this image. Improve sharpness, lighting, and detail.";
      const enhancedImage = await editImage(prompt, base64, mime);
      
      if (enhancedImage) {
        setResult(enhancedImage);
        setSliderPosition(50);
      } else {
        alert("The model could not process this enhancement request. Please try a different image.");
      }
    } catch (e) {
      console.error(e);
      alert("Enhancement process failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    let clientX;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = (e as React.MouseEvent).clientX;
    }

    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPosition(percent);
  };

  useEffect(() => {
    const stopDrag = () => setIsDragging(false);
    window.addEventListener('mouseup', stopDrag);
    window.addEventListener('touchend', stopDrag);
    return () => {
      window.removeEventListener('mouseup', stopDrag);
      window.removeEventListener('touchend', stopDrag);
    };
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-heading font-bold text-white mb-2">AI Photo Enhancer</h1>
        <p className="text-gray-400">Upscale and clarify your images with intelligent processing.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Controls */}
        <div className="md:col-span-4 space-y-6 order-2 md:order-1">
          <div className="bg-navy-800 rounded-2xl p-6 border border-white/5 shadow-lg">
             {!filePreview ? (
                <div className="border-2 border-dashed border-navy-600 rounded-2xl p-8 text-center hover:bg-white/5 transition-colors relative cursor-pointer">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <UploadCloud size={32} className="text-navy-500 mx-auto mb-4" />
                  <p className="font-medium text-gray-400">Upload Photo</p>
                  <p className="text-xs text-gray-500 mt-2">JPG, PNG</p>
                </div>
             ) : (
                <div className="space-y-4">
                  <div className="relative rounded-lg overflow-hidden border border-white/10">
                    <img src={filePreview} alt="Preview" className="w-full h-32 object-cover" />
                    <button 
                      onClick={() => { setFile(null); setFilePreview(null); setResult(null); }}
                      className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full hover:bg-red-500/80 transition-colors"
                    >
                      <Undo size={14} />
                    </button>
                  </div>
                  
                  <button
                    onClick={handleEnhance}
                    disabled={loading || !!result}
                    className="w-full py-3 bg-primary text-navy-900 rounded-xl font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:bg-primary-hover"
                  >
                    {loading ? <RefreshCw className="animate-spin" /> : <Wand2 />}
                    {loading ? 'Enhancing...' : 'Enhance Photo'}
                  </button>

                  {result && (
                    <button
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = result;
                        link.download = `enhanced-${Date.now()}.png`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                      className="w-full py-3 bg-white text-navy-900 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 hover:bg-gray-200"
                    >
                      <Download size={18} /> Download Result
                    </button>
                  )}
                </div>
             )}
          </div>
        </div>

        {/* Canvas */}
        <div className="md:col-span-8 order-1 md:order-2">
          <div className="bg-navy-800 rounded-2xl p-2 border border-white/5 shadow-2xl overflow-hidden relative min-h-[400px] flex items-center justify-center bg-[#0f1219]">
            {!filePreview ? (
              <div className="text-gray-600 flex flex-col items-center">
                <ImageIcon size={48} className="opacity-20 mb-4" />
                <p>Upload an image to start enhancing</p>
              </div>
            ) : (
              <div 
                className="relative w-full max-h-[600px] overflow-hidden rounded-xl select-none touch-none"
                ref={containerRef}
                onMouseDown={handleMouseDown}
                onTouchStart={handleMouseDown}
                onMouseMove={handleMove}
                onTouchMove={handleMove}
              >
                <img src={filePreview} className="w-full h-auto object-contain pointer-events-none" alt="Original" />
                
                {result && (
                  <div 
                    className="absolute inset-0 overflow-hidden"
                    style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                  >
                    <img src={result} className="w-full h-auto object-contain pointer-events-none" alt="Enhanced" />
                  </div>
                )}

                {result && (
                  <div 
                    className="absolute top-0 bottom-0 w-0.5 bg-white cursor-ew-resize z-20 shadow-[0_0_10px_rgba(0,0,0,0.5)]"
                    style={{ left: `${sliderPosition}%` }}
                  >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-navy-900 shadow-lg">
                      <ArrowLeftRight size={14} />
                    </div>
                  </div>
                )}

                {result && (
                   <>
                      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur px-2 py-1 rounded text-xs text-white font-bold pointer-events-none">Original</div>
                      <div className="absolute top-4 right-4 bg-primary/90 backdrop-blur px-2 py-1 rounded text-xs text-navy-900 font-bold pointer-events-none">Enhanced</div>
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

export default PhotoEnhancer;