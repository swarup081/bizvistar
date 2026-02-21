'use client';

import { useState } from 'react';
import { Sparkles, Wand2, ArrowRight, AlertCircle } from 'lucide-react';
import { generateAIContent } from '@/app/actions/onboardingActions';

export default function AIContentStep({ websiteId, onComplete, loading: parentLoading }) {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    if (!description.trim()) return;
    setLoading(true);
    setError(null);

    try {
        const res = await generateAIContent(websiteId, description);
        if (res.success) {
            onComplete(res.businessData); // pass new data
        } else {
            setError(res.error || "Failed to generate content.");
            setLoading(false);
        }
    } catch (err) {
        setError("An unexpected error occurred.");
        setLoading(false);
    }
  };

  const handleSkip = () => {
      onComplete(null); // null = skipped
  };

  return (
    <div className="flex flex-col h-full">
      <div className="text-center mb-6">
        <div className="mx-auto w-12 h-12 bg-gradient-to-tr from-[#8A63D2] to-purple-400 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-purple-200 animate-pulse">
            <Sparkles className="text-white" size={24} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">AI Content Writer</h2>
        <p className="text-gray-500 mt-2 text-sm">
            Describe your business, and our AI will rewrite your website headings and text to match your brand instantly.
        </p>
      </div>

      <div className="flex-1 space-y-4">
          <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase">Business Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. We are a family-owned bakery specializing in custom cakes and gluten-free pastries. We use organic ingredients and have been serving the community since 2010."
                rows={6}
                className="w-full p-4 border border-gray-300 rounded-xl text-sm outline-none focus:ring-1 focus:ring-purple-500 transition-all resize-none shadow-sm"
              />
          </div>

          {error && (
              <p className="text-xs text-red-500 font-medium bg-red-50 p-3 rounded-lg border border-red-100 flex items-center gap-2">
                  <AlertCircle size={14} /> {error}
              </p>
          )}

          <div className="pt-4">
              <button
                onClick={handleGenerate}
                disabled={loading || !description.trim()}
                className="w-full py-4 bg-gradient-to-r from-[#8A63D2] to-[#7854bc] text-white font-bold rounded-xl hover:shadow-lg hover:shadow-purple-200 transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-base"
              >
                {loading ? (
                    <>
                        <Wand2 className="animate-spin" size={20} /> Generating Magic...
                    </>
                ) : (
                    <>
                        <Wand2 size={20} /> Generate Content
                    </>
                )}
              </button>
          </div>
      </div>

      <div className="pt-4 border-t border-gray-100 mt-auto flex justify-center">
          <button
            onClick={handleSkip}
            disabled={loading}
            className="text-gray-400 font-medium text-sm hover:text-gray-800 transition-colors flex items-center gap-1"
          >
            Skip for now <ArrowRight size={14} />
          </button>
      </div>
    </div>
  );
}
