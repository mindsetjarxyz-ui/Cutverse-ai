import React, { useState, useRef, useEffect } from 'react';
import { editImage } from '../../services/geminiService';
import { UploadCloud, Wand2, RefreshCw, Download, Image as ImageIcon, Sparkles, ArrowLeftRight, Undo } from 'lucide-react';

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
      const prompt = "Generate a high-resolution, photorealistic version of this image. Improve sharpness and detail.";
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

    const rect = containerRef.current