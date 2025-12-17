import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { Editor } from './components/Editor';
import { ImageData, AppState } from './types';
import { editImageWithGemini } from './services/geminiService';
import { Sparkles } from 'lucide-react';

export default function App() {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [originalImage, setOriginalImage] = useState<ImageData | null>(null);
  const [resultImage, setResultImage] = useState<ImageData | null>(null);

  const handleImageSelected = useCallback((image: ImageData) => {
    setOriginalImage(image);
    setResultImage(null); // Clear previous results
    setAppState(AppState.EDITING);
  }, []);

  const handleEdit = useCallback(async (prompt: string) => {
    if (!originalImage) return;

    setAppState(AppState.PROCESSING);
    
    // If we have a previous result and we are iterating, we might want to check
    // if the user wants to continue from the last result. 
    // For this simple implementation, we always use 'originalImage' prop in Editor 
    // but the user can "promote" result to original.
    
    try {
      const result = await editImageWithGemini(originalImage, prompt);
      if (result) {
        setResultImage(result);
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
    setResultImage(null);
    setAppState(AppState.IDLE);
  }, []);

  const handleUseResultAsSource = useCallback(() => {
    if (resultImage) {
      setOriginalImage(resultImage);
      setResultImage(null);
      // Keep editing state
    }
  }, [resultImage]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <Header />

      <main className="flex-1 flex flex-col">
        {appState === AppState.IDLE && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 animate-in fade-in zoom-in duration-500">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6">
                Perfect Product Photos <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-500">
                  in Seconds
                </span>
              </h1>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Upload your product image and use simple text commands to remove backgrounds, add filters, or completely transform the scene.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4 text-sm font-medium text-slate-500 mb-12">
                <FeatureItem icon={<Sparkles className="w-4 h-4 text-amber-500" />} text="Remove Backgrounds" />
                <FeatureItem icon={<Sparkles className="w-4 h-4 text-purple-500" />} text="Generative Fill" />
                <FeatureItem icon={<Sparkles className="w-4 h-4 text-indigo-500" />} text="Smart Cleanup" />
              </div>
            </div>

            <ImageUploader onImageSelected={handleImageSelected} />
          </div>
        )}

        {(appState === AppState.EDITING || appState === AppState.PROCESSING || appState === AppState.ERROR) && originalImage && (
          <Editor 
            originalImage={originalImage}
            resultImage={resultImage}
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
    <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-slate-200">
      {icon}
      <span>{text}</span>
    </div>
  );
}
