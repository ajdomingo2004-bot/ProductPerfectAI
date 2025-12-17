import React, { useCallback } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { ImageData } from '../types';
import { useLanguage } from './LanguageContext';

interface ImageUploaderProps {
  onImageSelected: (image: ImageData) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected }) => {
  const { t } = useLanguage();
  
  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onImageSelected({
        base64: result,
        mimeType: file.type
      });
    };
    reader.readAsDataURL(file);
  }, [onImageSelected]);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 mt-4">
      <label 
        className="group relative flex flex-row items-center justify-center w-full min-h-[140px] rounded-[2rem] border-3 border-dashed border-slate-300 bg-white hover:bg-slate-50 hover:border-indigo-400 transition-all cursor-pointer shadow-sm hover:shadow-xl overflow-hidden p-6 gap-6"
      >
        <div className="p-5 rounded-2xl bg-indigo-50 text-indigo-600 group-hover:scale-110 transition-transform duration-500 shadow-sm z-10 flex-shrink-0">
          <Upload className="w-8 h-8 md:w-10 md:h-10" />
        </div>
        
        <div className="text-left z-10">
          <h3 className="text-xl font-bold text-slate-900 mb-1">
            {t.dropZone}
          </h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            {t.browse}
          </p>
        </div>

        <input 
          type="file" 
          className="hidden" 
          accept="image/*"
          onChange={handleFileChange}
        />
        
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden rounded-[2rem] opacity-30">
           <div className="absolute -top-20 -right-20 w-60 h-60 bg-purple-100 rounded-full blur-[80px]"></div>
           <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-indigo-100 rounded-full blur-[80px]"></div>
        </div>
      </label>
    </div>
  );
};