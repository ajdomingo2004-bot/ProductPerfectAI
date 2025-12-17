import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  ArrowRight, 
  RotateCcw, 
  Download, 
  Wand2, 
  Loader2, 
  AlertCircle,
  CheckCircle2,
  Maximize2
} from 'lucide-react';
import { ImageData, AppState } from '../types';

interface EditorProps {
  originalImage: ImageData;
  resultImage: ImageData | null;
  appState: AppState;
  onEdit: (prompt: string) => void;
  onReset: () => void;
  onUseResultAsSource: () => void;
}

export const Editor: React.FC<EditorProps> = ({ 
  originalImage, 
  resultImage, 
  appState, 
  onEdit, 
  onReset,
  onUseResultAsSource
}) => {
  const [prompt, setPrompt] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus input on mount if we are ready to edit
    if (appState === AppState.EDITING) {
      inputRef.current?.focus();
    }
  }, [appState]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (prompt.trim() && appState !== AppState.PROCESSING) {
      onEdit(prompt);
    }
  };

  const handleDownload = () => {
    if (!resultImage) return;
    const link = document.createElement('a');
    link.href = resultImage.base64;
    link.download = `product-perfect-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const suggestedPrompts = [
    "Remove the background",
    "Place the product on a marble table",
    "Add a soft shadow",
    "Add a cinematic lighting effect",
    "Make the background a solid pastel pink"
  ];

  const isLoading = appState === AppState.PROCESSING;
  const isError = appState === AppState.ERROR;

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden">
      
      {/* Main Workspace */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* Left: Original Image */}
        <div className={`relative flex-1 bg-slate-100 flex items-center justify-center p-4 lg:p-8 transition-all duration-500 ${resultImage ? 'lg:border-r border-slate-200' : ''}`}>
          <div className="relative max-w-full max-h-full shadow-2xl rounded-lg overflow-hidden group">
            <img 
              src={originalImage.base64} 
              alt="Original" 
              className="max-w-full max-h-[60vh] lg:max-h-[70vh] object-contain bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" 
            />
            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full font-medium">
              Original
            </div>
            
             {/* Hover Reset Overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <button 
                  onClick={onReset}
                  className="bg-white text-slate-900 px-4 py-2 rounded-full font-medium shadow-lg hover:bg-slate-50 transition-transform hover:scale-105 flex items-center gap-2"
                 >
                    <RotateCcw className="w-4 h-4" /> Start Over
                 </button>
            </div>
          </div>
        </div>

        {/* Right: Result Image (if exists) or Placeholder */}
        {resultImage && (
          <div className="relative flex-1 bg-slate-50 flex items-center justify-center p-4 lg:p-8 animate-in fade-in slide-in-from-right-10 duration-500">
             <div className="relative max-w-full max-h-full shadow-2xl rounded-lg overflow-hidden group">
              <img 
                src={resultImage.base64} 
                alt="Edited" 
                className="max-w-full max-h-[60vh] lg:max-h-[70vh] object-contain bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" 
              />
              <div className="absolute top-4 left-4 bg-indigo-600/90 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full font-medium shadow-sm flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Edited
              </div>

               <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button 
                   onClick={onUseResultAsSource}
                   className="bg-white/90 backdrop-blur text-slate-800 p-2 rounded-full shadow-lg hover:bg-white transition-colors"
                   title="Use as new original"
                 >
                   <ArrowRight className="w-5 h-5" />
                 </button>
                 <button 
                    onClick={handleDownload}
                    className="bg-indigo-600 text-white p-2 rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
                    title="Download"
                 >
                    <Download className="w-5 h-5" />
                 </button>
               </div>
            </div>
          </div>
        )}
        
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-sm flex items-center justify-center flex-col">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
              <Sparkles className="w-6 h-6 text-indigo-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
            </div>
            <p className="mt-4 text-slate-600 font-medium animate-pulse">Refining your image...</p>
          </div>
        )}

      </div>

      {/* Control Panel (Sticky Bottom) */}
      <div className="bg-white border-t border-slate-200 p-4 lg:p-6 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-20">
        <div className="max-w-4xl mx-auto w-full">
          
          <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
            <div className="relative flex-1">
              <Wand2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                ref={inputRef}
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe how to change the image (e.g., 'Remove background', 'Add neon lights')..."
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-sm"
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              disabled={!prompt.trim() || isLoading}
              className="px-6 py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-semibold shadow-lg shadow-indigo-200 transition-all active:scale-95 flex items-center gap-2"
            >
               {isLoading ? (
                 <Loader2 className="w-5 h-5 animate-spin" />
               ) : (
                 <>
                   <span>Magic</span>
                   <Send className="w-4 h-4" />
                 </>
               )}
            </button>
          </form>

          {/* Suggestions */}
          <div className="mt-4 flex flex-wrap gap-2 justify-center lg:justify-start">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider py-1.5">Try:</span>
            {suggestedPrompts.map((s, i) => (
              <button
                key={i}
                onClick={() => setPrompt(s)}
                className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-700 border border-slate-200 hover:border-indigo-200 text-xs transition-colors"
                disabled={isLoading}
              >
                {s}
              </button>
            ))}
          </div>

          {isError && (
             <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>Something went wrong processing your image. Please try again with a different prompt.</span>
             </div>
          )}

        </div>
      </div>
    </div>
  );
};

// Helper for animations
function Sparkles({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  );
}
