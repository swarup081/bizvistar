'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Loader2, Sparkles } from 'lucide-react';
import { GeminiIcon } from './icons/GeminiIcon';

export default function AIModal({ isOpen, onClose, onSubmit, title = "Write with AI", loading = false, placeholder = "Describe what you want to write..." }) {
  const [prompt, setPrompt] = useState('');
  const textareaRef = useRef(null);

  // Validation State
  const minLength = 20;
  const currentLength = prompt.trim().length;
  const isTooShort = currentLength > 0 && currentLength < minLength;
  const isValid = currentLength >= minLength;

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
    if (!isOpen) {
        setPrompt(''); // Reset on close
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
      e.preventDefault();
      if (isValid) {
          onSubmit(prompt);
      }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden relative animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
             <div className="bg-purple-100 p-2 rounded-xl">
                <GeminiIcon size={24} />
             </div>
             <div>
                <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                <p className="text-sm text-gray-500">Let AI create content for you.</p>
             </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-50"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 flex-grow flex flex-col">
            <div className="mb-2 flex-grow">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Description <span className="text-red-500">*</span>
                </label>
                <textarea
                    ref={textareaRef}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={placeholder}
                    className={`w-full h-40 p-4 text-base text-gray-700 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 resize-none transition-all placeholder:text-gray-400
                        ${isTooShort ? 'border-red-300 focus:ring-red-200 focus:border-red-500' : 'border-gray-200 focus:ring-purple-500/20 focus:border-purple-500'}
                    `}
                    disabled={loading}
                />

                {/* Validation Message */}
                <div className="mt-2 flex justify-between items-start">
                    <p className={`text-xs transition-colors ${isTooShort ? 'text-red-500 font-medium' : 'text-gray-500'}`}>
                        {isTooShort
                            ? `Our AI needs a minimum of ${minLength} characters to write meaningful content. Please add more detail.`
                            : "Provide at least 20 characters for best results."
                        }
                    </p>
                    <span className={`text-xs ${isTooShort ? 'text-red-500' : 'text-gray-400'}`}>
                        {currentLength} / {minLength}+
                    </span>
                </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-50">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                    disabled={loading}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className={`flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white rounded-xl transition-all shadow-lg shadow-purple-500/20
                        ${!isValid || loading
                            ? 'bg-gray-300 cursor-not-allowed shadow-none'
                            : 'bg-black hover:bg-gray-800'
                        }
                    `}
                    disabled={!isValid || loading}
                >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin" size={18} />
                            Generating...
                        </>
                    ) : (
                        <>
                            <Sparkles size={18} className={isValid ? "text-purple-300" : "text-gray-100"} />
                            Generate Content
                        </>
                    )}
                </button>
            </div>
        </form>

      </div>
    </div>
  );
}
