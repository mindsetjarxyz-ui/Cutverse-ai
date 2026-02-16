import React, { useState } from 'react';
import { generateSegmentationMask } from '../../services/geminiService';
import { UploadCloud, Scissors, RefreshCw, Download, Image as ImageIcon, Sparkles } from 'lucide-react';

const BackgroundRemover: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<string>("1:1");

  const getClosestAspectRatio = (width: number, height: number): string => {
    const ratio = width / height;
    const ratios = {
      "1:1": 1,
      "3:4": 3/4,
      "4:3": 4/3,
      "9:16": 9/16,
      "16:9": 16/9
    };
    
    return Object.entries(ratios).reduce((prev, curr) => {
      return (Math.abs(curr[1] - ratio) < Math.abs(ratios[prev as keyof typeof ratios] - ratio) ? curr[0] : prev);
    }, "1:1");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setFile(f);
      const reader = new FileReader();
      reader.onload = (ev) => {
        const src = ev.target?.result as string;
        setFilePreview(src);
        
        // Calculate aspect ratio
        const img = new Image();
        img.onload = () => {
            setAspectRatio(getClosestAspectRatio(img.width, img.height));
        };
        img.src = src;
      };
      reader.readAsDataURL(f);
      setResult(null);
    }
  };

  const handleRemoveBg = async () => {
    if (!file || !filePreview) return;
    setLoading(true);
    setResult(null);

    try {
      const base64 = filePreview.split(',')[1];
      const mime = file.type;
      
      // Step 1: Generate Mask
      const maskDataUrl = await generateSegmentationMask(base64, mime, aspectRatio);
      
      if (!maskDataUrl) {
          throw new Error("Failed to generate mask");
      }

      // Step 2: Composite Mask with Original
      const originalImg = new Image();
      originalImg.src = filePreview;
      await new Promise(r => { originalImg.onload = r; });

      const maskImg = new Image();
      maskImg.src = maskDataUrl;
      await new Promise(r => { maskImg.onload = r; });

      const canvas = document.createElement('canvas');
      canvas.width = originalImg.width;
      canvas.height = originalImg.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error("No Canvas Context");

      // Draw original
      ctx.drawImage(originalImg, 0, 0);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      // Draw mask to temp canvas to resize it to match original perfectly
      const maskCanvas = document.createElement('canvas');
      maskCanvas.width = canvas.width;
      maskCanvas.height = canvas.height;
      const maskCtx = maskCanvas.getContext('2d');
      if (!maskCtx) throw new Error("No Mask Context");
      
      // Draw mask image stretched to fit original dimensions
      maskCtx.drawImage(maskImg, 0, 0, canvas.width, canvas.height);
      const maskData = maskCtx.getImageData(0, 0, canvas.width, canvas.height).data;

      // Apply Alpha Mask
      for (let i = 0; i < data.length; i += 4) {
          // Use Red channel of mask as brightness
          const maskVal = maskData[i]; 
          // Apply to Alpha channel of original
          // Using a slight contrast curve or just direct mapping
          data[i + 3] = maskVal;
      }

      ctx.putImageData(imgData, 0, 0);
      setResult(canvas.toDataURL('image/png'));

    } catch (e) {
      console.error(e);
      alert("Processing failed. Please try again with a simpler image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-heading font-bold text-white mb-2">Background Remover</h1>
        <p className="text-gray-400">Instantly isolate subjects from your photos.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Input */}
        <div className="bg-navy-800 rounded-3xl p-6 border border-white/5 shadow-lg min-h-[400px] flex flex-col">
          <h3 className="font-semibold text-gray-300 mb-4 flex items-center gap-2">
            <ImageIcon size={18} /> Original
          </h3>
          
          {!filePreview ? (
            <div className="flex-1 border-2 border-dashed border-navy-600 rounded-2xl flex flex-col items-center justify-center p-8 hover:bg-white/5 transition-colors relative cursor-pointer">
              <input 
                type="file" 
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <UploadCloud size={48} className="text-navy-500 mb-4" />
              <p className="font-medium text-gray-400">Upload Image</p>
              <p className="text-xs text-gray-500 mt-2">JPG, PNG (Max 5MB)</p>
            </div>
          ) : (
            <div className="relative flex-1 rounded-2xl overflow-hidden bg-navy-900 group">
              <img src={filePreview} alt="Original" className="w-full h-full object-contain" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button 
                  onClick={() => { setFile(null); setFilePreview(null); setResult(null); }}
                  className="px-4 py-2 bg-white rounded-lg text-sm font-medium hover:bg-gray-200 text-navy-900"
                >
                  Change Image
                </button>
              </div>
            </div>
          )}

          <div className="mt-6">
            <button
              onClick={handleRemoveBg}
              disabled={!file || loading}
              className="w-full py-3 bg-primary text-navy-900 rounded-xl font-bold shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? <RefreshCw className="animate-spin" /> : <Scissors />}
              {loading ? 'Processing...' : 'Remove Background'}
            </button>
          </div>
        </div>

        {/* Output */}
        <div className="bg-navy-800 rounded-3xl p-6 border border-white/5 shadow-lg min-h-[400px] flex flex-col">
           <h3 className="font-semibold text-gray-300 mb-4 flex items-center gap-2 text-primary">
            <Sparkles size={18} /> Result
          </h3>

          <div className="flex-1 rounded-2xl overflow-hidden bg-navy-900 border border-white/5 relative bg-[url('https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.tM6j7D3pGzZg3A9hG_x8iQHaHa%26pid%3DApi&f=1&ipt=e865611488c2670d859187313271707297395563967812856285873958739182&ipo=images')] bg-contain">
            {result ? (
              <img src={result} alt="Removed BG" className="w-full h-full object-contain" />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 bg-navy-900/90">
                {loading ? (
                   <div className="text-center p-6">
                     <div className="w-16 h-16 border-4 border-navy-700 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                     <p className="text-sm font-medium text-gray-400">
                       Generating Mask & Compositing...
                     </p>
                   </div>
                ) : (
                  <>
                    <Scissors size={48} className="opacity-20 mb-4" />
                    <p>Processed image will appear here</p>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="mt-6">
             <button
              disabled={!result}
              onClick={() => {
                if(result) {
                    const link = document.createElement('a');
                    link.href = result;
                    link.download = `nobg-${Date.now()}.png`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
              }}
              className="w-full py-3 bg-white text-navy-900 rounded-xl font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:bg-gray-200"
            >
              <Download size={20} /> Download PNG
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackgroundRemover;