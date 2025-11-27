import React, { useRef } from 'react';
import { ImageFile } from '../types';

interface UploaderProps {
  label: string;
  subLabel: string;
  image: ImageFile | null;
  onImageSelected: (image: ImageFile) => void;
  onClear: () => void;
  id: string;
}

export const Uploader: React.FC<UploaderProps> = ({ 
  label, 
  subLabel, 
  image, 
  onImageSelected, 
  onClear,
  id 
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageSelected({
          file,
          previewUrl: URL.createObjectURL(file),
          base64: reader.result as string,
          mimeType: file.type
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerUpload = () => inputRef.current?.click();

  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-sm font-medium text-zinc-400 uppercase tracking-wider">
        {label}
      </label>
      
      {!image ? (
        <div 
          onClick={triggerUpload}
          className="group relative h-64 w-full border-2 border-dashed border-zinc-700 rounded-xl bg-zinc-900/50 hover:bg-zinc-800/50 hover:border-indigo-500/50 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center p-6 text-center"
        >
          <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-zinc-400 group-hover:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="text-zinc-300 font-medium">Click to upload</span>
          <span className="text-xs text-zinc-500 mt-1">{subLabel}</span>
          <input 
            type="file" 
            ref={inputRef}
            id={id}
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      ) : (
        <div className="relative h-64 w-full rounded-xl overflow-hidden border border-zinc-700 group">
          <img 
            src={image.previewUrl} 
            alt={label} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button 
              onClick={onClear}
              className="px-4 py-2 bg-red-500/20 text-red-300 hover:bg-red-500/40 border border-red-500/50 rounded-lg text-sm font-medium transition-colors backdrop-blur-sm"
            >
              Remove Image
            </button>
          </div>
        </div>
      )}
    </div>
  );
};