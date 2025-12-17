import React from 'react';
import { Camera, Sparkles, Globe } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { Language } from '../types';

export const Header: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  const languages: { code: Language; name: string }[] = [
    { code: 'en', name: 'English' },
    { code: 'zh-tw', name: '繁體中文' },
    { code: 'it', name: 'Italiano' },
    { code: 'ar', name: 'العربية' },
    { code: 'hi', name: 'हिन्दी' },
    { code: 'tl', name: 'Tagalog' },
    { code: 'de', name: 'Deutsch' },
    { code: 'ru', name: 'Русский' },
    { code: 'es', name: 'Español' },
    { code: 'ja', name: '日本語' },
    { code: 'ko', name: '한국어' }
  ];

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
          
          <div className="flex items-center gap-3">
            <div className="relative group">
              <button className="flex items-center gap-2 px-2 md:px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {t.languageLabel}
                </span>
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline ml-1 font-semibold">{languages.find(l => l.code === language)?.name}</span>
              </button>
              
              <div className="absolute right-0 top-full mt-1 w-40 max-h-[70vh] overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-1 z-50">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-indigo-50 hover:text-indigo-600 transition-colors ${language === lang.code ? 'bg-indigo-50 text-indigo-600 font-bold' : 'text-slate-600'}`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};