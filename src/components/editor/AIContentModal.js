'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { useState } from 'react';
import { X, Sparkles, Loader2, AlertCircle } from 'lucide-react';

export default function AIContentModal({ isOpen, onClose, onGenerate }) {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const wordCount = description.trim().split(/\s+/).filter(w => w.length > 0).length;
  const isTooShort = wordCount < 10;

  const handleGenerate = async () => {
    if (isTooShort) {
        setError("Please enter at least 10 words to help the AI understand your business.");
        return;
    }

    setError('');
    setLoading(true);

    try {
        await onGenerate(description);
        onClose(); // Close on success
        setDescription(''); // Reset
    } catch (err) {
        setError("Failed to generate content. Please try again.");
    } finally {
        setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && !loading && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity animate-in fade-in duration-200" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-lg bg-white rounded-2xl shadow-2xl z-[70] flex flex-col focus:outline-none overflow-hidden font-sans animate-in zoom-in-95 duration-200">

          {/* Header */}
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white shrink-0">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#8A63D2]/10 rounded-full flex items-center justify-center text-[#8A63D2]">
                    <Sparkles size={18} />
                </div>
                <Dialog.Title className="text-xl font-bold text-gray-900">
                    AI Content Writer
                </Dialog.Title>
            </div>
            <Dialog.Close asChild>
                <button
                    disabled={loading}
                    className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors disabled:opacity-50"
                >
                    <X size={20} />
                </button>
            </Dialog.Close>
          </div>

          {/* Body */}
          <div className="p-6 md:p-8 space-y-4">
              <p className="text-sm text-gray-500">
                  Describe your business, products, and style. Our AI will instantly rewrite your entire website content to match your brand voice.
              </p>

              <div className="relative">
                <textarea
                    value={description}
                    onChange={(e) => {
                        setDescription(e.target.value);
                        if (error) setError('');
                    }}
                    disabled={loading}
                    className="w-full h-40 p-4 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8A63D2] focus:border-transparent outline-none resize-none transition-all bg-gray-50 focus:bg-white disabled:bg-gray-100"
                    placeholder="e.g. We are a family-owned Italian restaurant in downtown Chicago specializing in authentic wood-fired pizzas and homemade pasta. Our atmosphere is cozy and romantic..."
                />
                <div className={`absolute bottom-3 right-3 text-xs font-medium transition-colors ${isTooShort ? 'text-orange-500' : 'text-green-600'}`}>
                    {wordCount} words
                </div>
              </div>

              {error && (
                  <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-center gap-2 animate-in slide-in-from-top-1">
                      <AlertCircle size={16} />
                      {error}
                  </div>
              )}

              {isTooShort && !error && description.length > 0 && (
                  <div className="p-3 bg-orange-50 text-orange-700 text-xs rounded-lg border border-orange-100 flex items-center gap-2">
                      <AlertCircle size={14} />
                      Please describe a bit more (min 10 words).
                  </div>
              )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end items-center gap-3">
            <button
                onClick={onClose}
                disabled={loading}
                className="px-5 py-2.5 rounded-xl text-gray-600 font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
                Cancel
            </button>
            <button
                onClick={handleGenerate}
                disabled={loading || isTooShort}
                className="px-8 py-2.5 bg-[#8A63D2] text-white font-bold rounded-xl shadow-lg shadow-purple-200 hover:bg-[#7854bc] transition-all flex items-center gap-2 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed"
            >
                {loading ? (
                    <>
                        <Loader2 size={18} className="animate-spin" />
                        Writing Content...
                    </>
                ) : (
                    <>
                        <Sparkles size={18} />
                        Generate Content
                    </>
                )}
            </button>
          </div>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
