import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { Editor } from './components/Editor';
import { BackgroundGradient } from './components/BackgroundGradient';
import { MediaData, AppState, ImageData } from './types';
import { editImageWithGemini } from './services/geminiService';
import { Sparkles } from 'lucide-react';
import { LanguageProvider, useLanguage } from './components/LanguageContext';

function AppContent() {
  const { t } = useLanguage();
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [originalImage, setOriginalImage] = useState<MediaData | null>(null);
  const [resultMedia, setResultMedia] = useState<MediaData | null>(null);

  const handleImageSelected = useCallback((image: ImageData) => {
    setOriginalImage({
      type: 'image',
      url: image.base64,
      mimeType: image.mimeType
    });
    setResultMedia(null);
    setAppState(AppState.EDITING);
  }, []);

  const handleEdit = useCallback(async (prompt: string) => {
    if (!originalImage) return;

    setAppState(AppState.PROCESSING);
    
    try {
      const result = await editImageWithGemini(originalImage, prompt);
      
      if (result) {
        setResultMedia(result);
        setAppState(AppState.EDITING);
      } else {
        setAppState(AppState.ERROR);
      }
    } catch (error) {
      console.error(error);
      setAppState(AppState.ERROR);
    }
  }, [originalImage]);

  const handleReset = useCallback(() => {
    setOriginalImage(null);
    setResultMedia(null);
    setAppState(AppState.IDLE);
  }, []);

  const handleUseResultAsSource = useCallback(() => {
    if (resultMedia && resultMedia.type === 'image') {
      setOriginalImage(resultMedia);
      setResultMedia(null);
    }
  }, [resultMedia]);

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900 relative">
      <BackgroundGradient />
      <Header />

      <main className="flex-1 flex flex-col relative z-10">
        {appState === AppState.IDLE && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 animate-in fade-in zoom-in duration-700">
            <div className="text-center max-w-2xl mx-auto mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/50 border border-white/20 backdrop-blur-md text-xs font-bold text-indigo-600 mb-6 shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI POWERED STUDIO</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 mb-6 px-4 drop-shadow-sm">
                {t.slogan.split(' ').map((word: string, i: number) => {
                   if (i >= t.slogan.split(' ').length - 2) return <span key={i} className="text-indigo-600"> {word}</span>;
                   return <span key={i}> {word}</span>;
                })}
              </h1>
              <p className="text-lg md:text-xl text-slate-600/90 mb-8 leading-relaxed px-4 max-w-xl mx-auto font-medium">
                {t.heroDesc}
              </p>
              
              <div className="flex flex-wrap justify-center gap-3 text-xs md:text-sm font-bold text-slate-500 mb-8 px-4">
                <FeatureItem icon={<Sparkles className="w-4 h-4 text-amber-500" />} text={t.feat1} />
                <FeatureItem icon={<Sparkles className="w-4 h-4 text-purple-500" />} text={t.feat2} />
              </div>
            </div>

            <div className="w-full max-w-3xl transform hover:scale-[1.01] transition-transform duration-500">
              <ImageUploader onImageSelected={handleImageSelected} />
            </div>
          </div>
        )}

        {(appState === AppState.EDITING || appState === AppState.PROCESSING || appState === AppState.ERROR) && originalImage && (
          <Editor 
            originalImage={originalImage}
            resultMedia={resultMedia}
            appState={appState}
            onEdit={handleEdit}
            onReset={handleReset}
            onUseResultAsSource={handleUseResultAsSource}
          />
        )}
      </main>
    </div>
  );
}

function FeatureItem({ icon, text }: { icon: React.ReactNode, text: string }) {
  return (
    <div className="flex items-center gap-2 px-5 py-2.5 bg-white/60 backdrop-blur-xl rounded-full shadow-sm border border-white/40 hover:bg-white/80 transition-colors">
      {icon}
      <span className="tracking-tight">{text}</span>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}