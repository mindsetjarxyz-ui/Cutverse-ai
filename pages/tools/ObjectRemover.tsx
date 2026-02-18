import React from 'react';
import { ArrowLeft, AlertCircle } from 'lucide-react';

const ObjectRemover: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto text-center py-20">
      <button 
        onClick={() => window.location.hash = '#/'} 
        className="flex items-center text-gray-400 hover:text-white mb-10 transition-colors mx-auto"
      >
        <ArrowLeft size={20} className="mr-2" /> Back to Tools
      </button>
      
      <div className="bg-navy-800 p-10 rounded-3xl border border-white/5 shadow-2xl">
        <div className="w-20 h-20 bg-orange-500/10 text-orange-400 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle size={40} />
        </div>
        <h1 className="text-3xl font-heading font-bold text-white mb-4">Under Maintenance</h1>
        <p className="text-gray-400 mb-8 leading-relaxed">
          The AI Object Remover is currently being upgraded with our latest neural editing engine. 
          Please check back soon for precision editing features!
        </p>
        <button 
          onClick={() => window.location.hash = '#/'} 
          className="px-8 py-3 bg-primary text-navy-900 font-bold rounded-xl"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default ObjectRemover;