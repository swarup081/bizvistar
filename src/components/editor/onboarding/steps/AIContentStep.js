'use client';

import { useState } from 'react';
import { Sparkles, Wand2 } from 'lucide-react';
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
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="mx-auto w-12 h-12 bg-gradient-to-tr from-[#8A63D2] to-purple-400 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-purple-200">
            <Sparkles className="text-white" size={24} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">AI Content Writer</h2>
        <p className="text-gray-500 mt-2 text-sm">
            Describe your business, and our AI will rewrite your website headings and text to match your brand instantly.
        </p>
      </div>

      <div className="space-y-4">
          <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Business Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. We are a family-owned bakery specializing in custom cakes and gluten-free pastries. We use organic ingredients and have been serving the community since 2010."
                rows={5}
                className="w-full p-4 border border-gray-200 rounded-xl text-sm focus:border-[#8A63D2] outline-none transition-all resize-none shadow-sm"
              />
          </div>

          {error && (
              <p className="text-xs text-red-500 font-medium bg-red-50 p-3 rounded-lg border border-red-100">
                  {error}
              </p>
          )}

          <button
            onClick={handleGenerate}
            disabled={loading || !description.trim()}
            className="w-full py-3 bg-gradient-to-r from-[#8A63D2] to-[#7854bc] text-white font-bold rounded-xl hover:shadow-lg hover:shadow-purple-200 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
                <>
                    <Wand2 className="animate-spin" size={18} /> Generating Magic...
                </>
            ) : (
                <>
                    <Wand2 size={18} /> Generate Content
                </>
            )}
          </button>

          <button
            onClick={handleSkip}
            disabled={loading}
            className="w-full py-3 text-gray-500 font-medium text-sm hover:text-gray-800 transition-colors"
          >
            Skip for now
          </button>
      </div>
    </div>
  );
}
