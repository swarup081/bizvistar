// src/components/ui/ImageUpload.js
import React, { useRef } from 'react';
import { Upload, Image as ImageIcon, X } from 'lucide-react';

export const ImageUpload = ({ label, value, onChange, className }) => {
  const inputRef = useRef(null);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result); // In a real app, upload to storage here
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={className}>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      
      <div 
        onClick={() => inputRef.current?.click()}
        className="relative group cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-4 hover:bg-gray-50 hover:border-blue-400 transition-all flex flex-col items-center justify-center text-center gap-2"
      >
        {value ? (
          <div className="relative w-full aspect-video rounded overflow-hidden bg-gray-100">
             <img src={value} alt="Preview" className="w-full h-full object-contain" />
             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium">
               Click to Replace
             </div>
          </div>
        ) : (
          <div className="py-4">
             <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
               <Upload size={20} />
             </div>
             <p className="text-xs text-gray-500">Click to upload image</p>
          </div>
        )}
        <input 
          ref={inputRef} 
          type="file" 
          accept="image/*" 
          className="hidden" 
          onChange={handleFile} 
        />
      </div>
    </div>
  );
};