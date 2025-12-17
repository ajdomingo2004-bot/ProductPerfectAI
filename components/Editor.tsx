import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  ArrowRight, 
  RotateCcw, 
  Download, 
  Wand2, 
  Loader2, 
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { MediaData, AppState } from '../types';
import { useLanguage } from './LanguageContext';

interface EditorProps {
  originalImage: MediaData;
  resultMedia: MediaData | null;
  appState: AppState;
  onEdit: (prompt: string) => void;
  onReset: () => void;
  onUseResultAsSource: () => void;
}

export const Editor: React.FC<EditorProps> = ({ 
  originalImage, 
  resultMedia, 
  appState, 
  onEdit, 
  onReset,
  onUseResultAsSource
}) => {
  const { t } = useLanguage();
  const [prompt, setPrompt] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (appState === AppState.EDITING) {
      inputRef.current?.focus();
    }
  }, [appState]);

  useEffect(() => {
    if (resultMedia && window.innerWidth < 1024) {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [resultMedia]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (prompt.trim() && appState !== AppState.PROCESSING) {
      onEdit(prompt);
    }
  };

  const handleDownload = () => {
    if (!resultMedia) return;
    const link = document.createElement('a');
    link.href = resultMedia.url;
    link.download = `product-perfect-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isLoading = appState === AppState.PROCESSING;
  const isError = appState === AppState.ERROR;

  return (
    <div className="flex flex-col h-[calc(100dvh-64px)] lg:h-[calc(100vh-64px)] overflow-hidden">
      
      {/* Main Workspace */}
      <div className="flex-1 overflow-y-auto lg:overflow-hidden flex flex-col lg:flex-row relative bg-transparent">
        
        {/* Left: Original Image - Hidden when result exists */}
        {!resultMedia && (
          <div className="relative flex-1 flex items-center justify-center p-4 lg:p-8 animate-in fade-in duration-500">
            <div className="relative max-w-full max-h-full shadow-2xl rounded-2xl overflow-hidden group border border-white/20">
              <img 
                src={originalImage.url} 
                alt="Original" 
                className="max-w-full max-h-[70vh] object-contain bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" 
              />
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full font-bold">
                {t.original}
              </div>
              
              <div className="absolute inset-0 bg-black/20 lg:bg-black/40 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none lg:pointer-events-auto">
                   <button 
                    onClick={onReset}
                    className="bg-white/90 backdrop-blur-md text-slate-900 px-5 py-2.5 rounded-full font-bold shadow-lg hover:bg-white transition-transform active:scale-95 flex items-center gap-2 pointer-events-auto text-sm"
                   >
                      <RotateCcw className="w-4 h-4" /> {t.startOver}
                   </button>
              </div>
            </div>
          </div>
        )}

        {/* Right: Result Media (if exists) - Takes full width if original is hidden */}
        {resultMedia && (
          <div ref={resultRef} className="relative flex-1 flex flex-col items-center justify-center p-4 lg:p-8 animate-in fade-in zoom-in duration-500">
             <div className="relative max-w-full max-h-full shadow-2xl rounded-2xl overflow-hidden group mb-4 lg:mb-0 border border-white/20">
                <img 
                  src={resultMedia.url} 
                  alt="Edited" 
                  className="max-w-full max-h-[75vh] object-contain bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" 
                />
              
              <div className="absolute top-4 left-4 bg-indigo-600/90 backdrop-blur-md text-white text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full font-bold shadow-sm flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> {t.edited}
              </div>

               <div className="hidden lg:flex absolute bottom-4 right-4 gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button 
                   onClick={onUseResultAsSource}
                   className="bg-white/90 backdrop-blur-md text-slate-800 p-3 rounded-full shadow-lg hover:bg-white transition-colors"
                   title={t.continue}
                 >
                   <ArrowRight className="w-5 h-5" />
                 </button>
                 <button 
                    onClick={handleDownload}
                    className="bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
                    title={t.download}
                 >
                    <Download className="w-5 h-5" />
                 </button>
               </div>
            </div>

            <div className="flex lg:hidden w-full max-w-sm gap-3 px-4 mb-8">
              <button 
                onClick={onUseResultAsSource}
                className="flex-1 bg-white/80 backdrop-blur-md border border-white/40 text-slate-700 py-3.5 rounded-2xl font-bold shadow-sm flex items-center justify-center gap-2 active:bg-white"
              >
                <ArrowRight className="w-4 h-4" /> {t.continue}
              </button>
              <button 
                onClick={handleDownload}
                className="flex-[1.5] bg-indigo-600 text-white py-3.5 rounded-2xl font-bold shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 active:bg-indigo-700"
              >
                <Download className="w-4 h-4" /> {t.download}
              </button>
            </div>
            
            {/* Start Over button when result is shown */}
            <button 
              onClick={onReset}
              className="lg:absolute lg:top-4 lg:right-4 bg-white/40 hover:bg-white/60 backdrop-blur-md text-slate-700 px-5 py-2.5 rounded-full font-bold transition-colors flex items-center gap-2 text-sm shadow-sm"
            >
              <RotateCcw className="w-4 h-4" /> {t.startOver}
            </button>
          </div>
        )}
        
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-30 bg-white/60 backdrop-blur-xl flex items-center justify-center flex-col p-6 text-center">
            <div className="relative mb-6">
              <div className="w-24 h-24 border-4 border-indigo-100/50 border-t-indigo-600 rounded-full animate-spin"></div>
              <Sparkles className="w-10 h-10 text-indigo-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">{t.loadingTitle}</h2>
            <p className="text-slate-600 font-semibold max-w-xs">{t.loadingDesc}</p>
          </div>
        )}

      </div>

      {/* Control Panel */}
      <div className="bg-white/70 backdrop-blur-2xl border-t border-white/40 p-4 pb-safe shadow-[0_-20px_40px_rgba(0,0,0,0.03)] z-40">
        <div className="max-w-4xl mx-auto w-full">
          
          <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
            <div className="relative flex-1">
              <Wand2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                ref={inputRef}
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={t.placeholder}
                className="w-full pl-12 pr-4 py-4 bg-white/60 border border-white/60 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm text-sm lg:text-base font-medium"
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              disabled={!prompt.trim() || isLoading}
              className="px-6 lg:px-8 py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-bold shadow-xl shadow-indigo-100 transition-all active:scale-95 flex items-center gap-2 flex-shrink-0"
            >
               {isLoading ? (
                 <Loader2 className="w-5 h-5 animate-spin" />
               ) : (
                 <>
                   <span className="hidden sm:inline">{t.magic}</span>
                   <Send className="w-4 h-4" />
                 </>
               )}
            </button>
          </form>

          <div className="mt-5 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap pl-1">{t.try}</span>
            {t.suggestions.map((s: string, i: number) => (
              <button
                key={i}
                onClick={() => setPrompt(s)}
                className="px-4 py-2 rounded-xl bg-white/60 hover:bg-indigo-50 text-slate-600 hover:text-indigo-700 border border-white/80 hover:border-indigo-200 text-xs transition-all whitespace-nowrap font-bold shadow-sm"
                disabled={isLoading}
              >
                {s}
              </button>
            ))}
          </div>

          {isError && (
             <div className="mt-4 p-4 bg-red-50/80 backdrop-blur-md border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-xs lg:text-sm animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="font-bold">{t.error}</span>
             </div>
          )}

        </div>
      </div>
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .pb-safe { padding-bottom: env(safe-area-inset-bottom, 1.5rem); }
      `}</style>
    </div>
  );
};