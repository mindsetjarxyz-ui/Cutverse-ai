import React, { useState, useRef, useEffect } from 'react';
import { editImage, detectObjects } from '../../services/geminiService';
import { UploadCloud, Eraser, ScanLine, Download, Image as ImageIcon, Sparkles, X, MousePointerClick, RefreshCw, ArrowLeftRight, Undo, CheckCircle } from 'lucide-react';

const ObjectRemover: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [detectedObjects, setDetectedObjects] = useState<string[]>([]);
  const [scanning, setScanning] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [removingObject, setRemovingObject] = useState<string | null>(null);
  
  // History and Slider
  const [history, setHistory] = useState<string[]>([]);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setFile(f);
      const reader = new FileReader();
      reader.onload = (ev) => {
          setFilePreview(ev.target?.result as string);
          setDetectedObjects([]); 
          setResult(null); 
          setHistory([]);
      };
      reader.readAsDataURL(f);
    }
  };

  const handleScan = async () => {
    // If we have a pending result, we must apply it first or undo it before scanning
    if (result) {
        if(!confirm("Apply changes before scanning?")) return;
        applyChanges();
    }
    
    if (!filePreview) return;
    setScanning(true);
    setDetectedObjects([]);

    try {
      const base64 = filePreview.split(',')[1];
      const mime = file?.type || 'image/png';
      
      await new Promise(r => setTimeout(r, 1000)); // UI candy

      const objects = await detectObjects(base64, mime);
      
      if (objects && objects.length > 0) {
        setDetectedObjects(objects);
      } else {
        alert("No distinct objects found. Please try a clearer image.");
      }
    } catch (e) {
      console.error(e);
      alert("Scanning failed. Please try again.");
    } finally {
      setScanning(false);
    }
  };

  const handleRemoveObject = async (objectName: string) => {
    // Auto-apply previous result if exists to allow chain editing
    let sourceImage = filePreview;
    if (result) {
       setHistory(prev => [...prev, filePreview!]);
       setFilePreview(result);
       sourceImage = result;
       setResult(null);
       setDetectedObjects([]); // Objects might be gone, require rescan
    }

    if (!sourceImage) return;
    
    setProcessing(true);
    setRemovingObject(objectName);
    setSliderPosition(50); // Reset slider

    try {
        const base64 = sourceImage.split(',')[1];
        const mime = file?.type || 'image/png';

        const prompt = `Remove the ${objectName} from this image. Fill the space seamlessly with the background texture.`;
        
        const newImage = await editImage(prompt, base64, mime);
        setResult(newImage);

    } catch (e) {
        alert(`Failed to remove ${objectName}.`);
    } finally {
        setProcessing(false);
        setRemovingObject(null);
    }
  };

  const applyChanges = () => {
    if (result && filePreview) {
        setHistory(prev => [...prev, filePreview]);
        setFilePreview(result);
        setResult(null);
        setDetectedObjects([]); // Force user to rescan as objects changed
    }
  };

  const undoLastAction = () => {
    if (result) {
        // Just clear the preview result
        setResult(null);
    } else if (history.length > 0) {
        // Pop from history
        const prev = history[history.length - 1];
        setHistory(prev => prev.slice(0, -1));
        setFilePreview(prev);
        setDetectedObjects([]); // Clear objects as they might not match
    }
  };

  // Slider Logic
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
    <div className="max-w-7xl mx-auto pb-10">
      <div className="mb-8 text-center space-y-2">
        <h1 className="text-4xl font-heading font-bold text-white tracking-tight flex items-center justify-center gap-3">
          <ScanLine className="text-primary animate-pulse" />
          AI Object Remover
        </h1>
        <p className="text-gray-400">Precision removal with intelligent object detection.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Panel: Image Canvas */}
        <div className="lg:col-span-8 bg-navy-800 rounded-3xl p-1 border border-navy-700 shadow-2xl relative overflow-hidden group select-none">
          
          <div className="relative min-h-[500px] bg-[#0f1219] rounded-[22px] flex items-center justify-center overflow-hidden">
            
            <div className="absolute inset-0 opacity-10 pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
            </div>

            {!filePreview ? (
                <div className="text-center p-10 z-10">
                   <div className="relative group cursor-pointer">
                      <input 
                          type="file" 
                          accept="image/*"
                          onChange={handleFileChange}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-20"
                      />
                      <div className="w-24 h-24 bg-navy-700 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform border border-navy-600 group-hover:border-primary/50 group-hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]">
                          <UploadCloud size={40} className="text-gray-300 group-hover:text-primary transition-colors" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">Drop your image here</h3>
                      <p className="text-gray-500 text-sm">Supports JPG, PNG</p>
                   </div>
                </div>
            ) : (
                <div className="relative w-full h-[600px]" ref={containerRef}
                     onMouseDown={handleMouseDown} onTouchStart={handleMouseDown}
                     onMouseMove={handleMove} onTouchMove={handleMove}>
                   
                   {/* Base Image (Before) */}
                   <img 
                      src={filePreview} 
                      alt="Original" 
                      className="absolute inset-0 w-full h-full object-contain z-10" 
                   />

                   {/* Result Image (After) - Only if result exists */}
                   {result && (
                       <div className="absolute inset-0 z-20 w-full h-full overflow-hidden"
                            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}>
                          <img src={result} alt="Result" className="absolute inset-0 w-full h-full object-contain" />
                       </div>
                   )}

                   {/* Slider Handle - Only if result exists */}
                   {result && (
                       <div 
                         className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] z-30 pointer-events-none"
                         style={{ left: `${sliderPosition}%` }}
                       >
                         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-navy-900 transform transition-transform scale-100">
                            <ArrowLeftRight size={14} />
                         </div>
                       </div>
                   )}

                   {/* Labels - Only if result exists */}
                   {result && (
                     <>
                        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-white text-xs font-bold border border-white/10 z-30 pointer-events-none">
                            BEFORE
                        </div>
                        <div className="absolute top-4 right-4 bg-primary/90 backdrop-blur-md px-2 py-1 rounded text-navy-900 text-xs font-bold border border-white/10 z-30 pointer-events-none">
                            AFTER
                        </div>
                     </>
                   )}

                   {/* Scanning Overlay */}
                   {scanning && (
                      <div className="absolute inset-0 z-40 pointer-events-none">
                         <div className="scanning-line"></div>
                         <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-md px-3 py-1 rounded text-primary font-mono text-xs border border-primary/30">
                            SCANNING OBJECTS...
                         </div>
                      </div>
                   )}

                   {/* Close Button */}
                   {!result && !processing && (
                       <button 
                          onClick={() => { setFile(null); setFilePreview(null); setDetectedObjects([]); setResult(null); setHistory([]); }}
                          className="absolute top-4 right-4 z-50 p-2 bg-navy-900/80 text-white rounded-full hover:bg-red-500/80 transition-colors border border-white/10"
                       >
                          <X size={16} />
                       </button>
                   )}
                </div>
            )}
          </div>
        </div>

        {/* Right Panel: Controls */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-navy-800 rounded-2xl p-6 border border-navy-700 shadow-lg">
             {!filePreview ? (
                <div className="flex items-start gap-4 text-gray-400">
                   <div className="p-2 bg-navy-700 rounded-lg text-primary"><ImageIcon size={20} /></div>
                   <div>
                      <h4 className="text-white font-medium mb-1">Step 1: Upload</h4>
                      <p className="text-sm">Upload an image to start.</p>
                   </div>
                </div>
             ) : (
                <div className="space-y-4">
                    {/* Action Buttons */}
                    <div className="flex gap-2">
                        <button 
                            onClick={undoLastAction}
                            disabled={!result && history.length === 0}
                            className="flex-1 py-2 bg-navy-700 hover:bg-navy-600 disabled:opacity-50 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 border border-white/5"
                        >
                            <Undo size={16} /> Undo
                        </button>
                        {result && (
                            <button 
                                onClick={applyChanges}
                                className="flex-1 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 shadow-lg"
                            >
                                <CheckCircle size={16} /> Apply
                            </button>
                        )}
                    </div>

                    {!result && detectedObjects.length === 0 && (
                        <div className="flex items-start gap-4 mt-4">
                           <div className="p-2 bg-navy-700 rounded-lg text-primary animate-pulse"><ScanLine size={20} /></div>
                           <div className="w-full">
                              <h4 className="text-white font-medium mb-1">Step 2: Scan</h4>
                              <p className="text-sm text-gray-400 mb-4">Detect removable objects.</p>
                              <button
                                onClick={handleScan}
                                disabled={scanning}
                                className="w-full py-2.5 bg-primary hover:bg-primary-hover text-navy-900 font-bold rounded-lg transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] flex items-center justify-center gap-2"
                              >
                                 {scanning ? 'Scanning...' : 'Scan Image'}
                              </button>
                           </div>
                        </div>
                    )}

                    {detectedObjects.length > 0 && !result && (
                        <div>
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Detected Objects</h3>
                            <div className="flex flex-wrap gap-2">
                                {detectedObjects.map((obj, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleRemoveObject(obj)}
                                    disabled={processing}
                                    className={`
                                        group flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border transition-all
                                        ${removingObject === obj 
                                        ? 'bg-red-500/20 border-red-500 text-red-400 animate-pulse' 
                                        : 'bg-navy-700 border-navy-600 text-gray-200 hover:border-primary hover:text-white hover:bg-navy-600'
                                        }
                                    `}
                                >
                                    {removingObject === obj ? <RefreshCw className="animate-spin" size={12} /> : <Eraser size={12} />}
                                    {obj}
                                </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {result && (
                        <div className="bg-navy-700/50 p-4 rounded-xl border border-white/5 text-sm text-gray-300 text-center">
                            Use the slider to compare. <br/> Click <b>Apply</b> to save changes and remove more objects.
                        </div>
                    )}
                </div>
             )}
          </div>

          {/* Download */}
          {(result || history.length > 0) && (
              <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-6 border border-primary/20">
                 <h3 className="text-white font-medium mb-2 flex items-center gap-2">
                    <Sparkles size={16} className="text-primary" /> Done?
                 </h3>
                 <button
                    onClick={() => {
                        const link = document.createElement('a');
                        link.href = result || filePreview!;
                        link.download = `cleaned-image-${Date.now()}.png`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    }}
                    className="w-full py-3 bg-white text-navy-900 rounded-xl font-bold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 shadow-lg"
                 >
                    <Download size={18} /> Download Image
                 </button>
              </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ObjectRemover;