import React from 'react';
import { Camera, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/70 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Camera className="w-8 h-8 text-indigo-600" />
              <Sparkles className="w-4 h-4 text-pink-500 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">
              Product<span className="text-indigo-600">Perfect</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-flex px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
              Powered by Gemini 2.5 Flash
            </span>
            <a 
              href="#" 
              className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
            >
              Docs
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};