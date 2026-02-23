'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Loader2 } from 'lucide-react';
import { GeminiIcon } from './icons/GeminiIcon';

export default function AIModal({ isOpen, onClose, onSubmit, title = "Write with AI", loading = false, placeholder = "Describe what you want to write..." }) {
  const [prompt, setPrompt] = useState('');
  const textareaRef = useRef(null);

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
      if (prompt.trim()) {
          onSubmit(prompt);
      }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white/95 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative animate-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
             <div className="bg-purple-100 p-1.5 rounded-lg">
                <GeminiIcon className="text-purple-600" size={20} />
             </div>
             <h3 className="font-semibold text-gray-900">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-4">
            <div className="mb-4">
                <textarea
                    ref={textareaRef}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={placeholder}
                    className="w-full min-h-[120px] p-3 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 resize-none transition-all placeholder:text-gray-400"
                    disabled={loading}
                />
            </div>

            <div className="flex justify-end gap-2">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    disabled={loading}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-black hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/10"
                    disabled={!prompt.trim() || loading}
                >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin" size={16} />
                            Generating...
                        </>
                    ) : (
                        <>
                            <GeminiIcon className="text-purple-300" size={16} />
                            Generate
                        </>
                    )}
                </button>
            </div>
        </form>

        {/* Footer Hint */}
        <div className="bg-gray-50 px-4 py-3 border-t border-gray-100">
            <p className="text-xs text-gray-500 flex items-center gap-1">
                <span className="bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded text-[10px] font-bold">AI</span>
                Our AI will write the content for you based on your description.
            </p>
        </div>

      </div>
    </div>
  );
}
