import React, { useCallback } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { ImageData } from '../types';

interface ImageUploaderProps {
  onImageSelected: (image: ImageData) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected }) => {
  
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
    <div className="w-full max-w-2xl mx-auto mt-12 px-4">
      <label 
        className="group relative flex flex-col items-center justify-center w-full h-80 rounded-3xl border-3 border-dashed border-slate-300 bg-white hover:bg-slate-50 hover:border-indigo-400 transition-all cursor-pointer shadow-sm hover:shadow-md overflow-hidden"
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center z-10">
          <div className="p-4 rounded-full bg-indigo-50 text-indigo-600 mb-4 group-hover:scale-110 transition-transform duration-300">
            <Upload className="w-10 h-10" />
          </div>
          <h3 className="mb-2 text-xl font-semibold text-slate-900">
            Drop your product photo here
          </h3>
          <p className="mb-4 text-sm text-slate-500 max-w-xs">
            Or click to browse. We support PNG, JPG, and WebP.
          </p>
          <div className="flex gap-2 mt-4">
             <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-lg text-xs text-slate-600">
               <ImageIcon className="w-3 h-3" />
               <span>High Quality</span>
             </div>
          </div>
        </div>
        <input 
          type="file" 
          className="hidden" 
          accept="image/*"
          onChange={handleFileChange}
        />
        
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden rounded-3xl opacity-30">
           <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-200 rounded-full blur-3xl"></div>
           <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-200 rounded-full blur-3xl"></div>
        </div>
      </label>
    </div>
  );
};