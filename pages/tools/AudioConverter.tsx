import React, { useState } from 'react';
import { UploadCloud, Music, FileVideo, ArrowRight, Download } from 'lucide-react';

const AudioConverter: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [converting, setConverting] = useState(false);
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setDone(false);
      setProgress(0);
    }
  };

  const handleConvert = () => {
    if (!file) return;
    setConverting(true);
    
    // Simulate conversion process
    let p = 0;
    const interval = setInterval(() => {
      p += 5;
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setConverting(false);
        setDone(true);
      }
    }, 150);
  };

  const handleDownload = () => {
    if (!file) return;
    
    // Since this is a client-side demo without backend processing or ffmpeg.wasm,
    // we simulate the download by using the original file blob and renaming it to .mp3.
    // In a real app, you would download the actual processed result blob here.
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    
    // Replace file extension with .mp3
    const newName = file.name.substring(0, file.name.lastIndexOf('.')) + '.mp3';
    link.download = newName || 'audio.mp3';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-heading font-bold text-white mb-2">Video to Audio Converter</h1>
        <p className="text-gray-400">Extract high-quality MP3 audio from any video file.</p>
      </div>

      <div className="bg-navy-800 rounded-3xl shadow-lg border border-white/5 p-8 md:p-12">
        {!file ? (
          <div className="border-2 border-dashed border-navy-600 rounded-2xl p-12 text-center hover:bg-white/5 transition-colors relative cursor-pointer group">
            <input 
              type="file" 
              accept="video/*" 
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="w-16 h-16 bg-navy-700 text-primary rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
              <UploadCloud size={32} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Upload Video File</h3>
            <p className="text-gray-400 text-sm">Drag & drop or click to browse</p>
            <p className="text-xs text-gray-500 mt-4">MP4, MOV, AVI (Max 500MB)</p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex items-center p-4 bg-navy-900 rounded-xl border border-white/5">
              <div className="p-3 bg-navy-800 rounded-lg border border-white/10 text-blue-400">
                <FileVideo size={24} />
              </div>
              <div className="ml-4 flex-1">
                <p className="font-semibold text-gray-200">{file.name}</p>
                <p className="text-xs text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
              <button 
                onClick={() => setFile(null)} 
                className="text-sm text-red-400 hover:text-red-300 font-medium"
              >
                Change
              </button>
            </div>

            {converting ? (
               <div className="space-y-3">
                 <div className="flex justify-between text-sm font-medium">
                   <span className="text-gray-400">Converting to MP3...</span>
                   <span className="text-primary">{progress}%</span>
                 </div>
                 <div className="h-2 w-full bg-navy-900 rounded-full overflow-hidden">
                   <div 
                      className="h-full bg-primary transition-all duration-300 ease-out shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                      style={{ width: `${progress}%` }}
                   />
                 </div>
               </div>
            ) : done ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30">
                  <Music size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Conversion Complete!</h3>
                <p className="text-gray-400 mb-6">Your audio file is ready to download.</p>
                <button 
                  onClick={handleDownload}
                  className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-500 transition-colors shadow-lg shadow-green-900/50"
                >
                  <Download className="mr-2" size={20} />
                  Download MP3
                </button>
                <button 
                  onClick={() => setFile(null)}
                  className="block mx-auto mt-4 text-sm text-gray-500 hover:text-gray-300"
                >
                  Convert Another
                </button>
              </div>
            ) : (
              <div className="flex justify-center">
                 <button 
                  onClick={handleConvert}
                  className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-navy-900 transition-all duration-200 bg-primary font-heading rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary hover:bg-primary-hover shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                 >
                   <span>Start Conversion</span>
                   <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                 </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioConverter;