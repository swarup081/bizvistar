'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, Loader2, Copy, Check } from 'lucide-react';
import { templates } from '@/lib/data/templates';

export default function SharedTemplateModal({ isOpen, onClose, onSubmit, editData = null }) {
  const [form, setForm] = useState({
    templateName: editData?.template_name || '',
    businessName: editData?.business_name || '',
    tagline: editData?.tagline || '',
    theme: editData?.theme || '',
  });
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async () => {
    if (!form.templateName) return;
    setLoading(true);
    await onSubmit(form);
    setLoading(false);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  const themes = [
    'theme-warm-bakery', 'theme-strawberry-cream', 'theme-chocolate-caramel',
    'theme-cinnamon-spice', 'theme-earl-grey', 'theme-dark-roast',
    'theme-candlea-beige', 'theme-sage-green', 'theme-lavender-bliss',
    'theme-mint-chocolate', 'theme-peach-cream', 'theme-avenix-minimal',
    'theme-brewhaven-cream', 'theme-elegant-botanics', 'theme-sky-blue',
    'theme-crimson-red', 'theme-sunny-yellow',
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-full max-w-lg mx-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 max-h-[85vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10 rounded-t-2xl">
                <h3 className="text-lg font-bold text-gray-900">
                  {editData ? 'Edit Shared Template' : 'Create Shared Template'}
                </h3>
                <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                  <X size={18} />
                </button>
              </div>

              {/* Form */}
              <div className="px-6 py-5 space-y-5">
                {/* Base Template */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">Base Template *</label>
                  <select
                    value={form.templateName}
                    onChange={(e) => setForm({ ...form, templateName: e.target.value })}
                    className="w-full p-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#8A63D2] focus:ring-1 focus:ring-[#8A63D2] bg-white"
                  >
                    <option value="">Select a template</option>
                    {templates.map((t) => (
                      <option key={t.title} value={t.title}>{t.title} — {t.description.slice(0, 50)}...</option>
                    ))}
                  </select>
                </div>

                {/* Business Name */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">Business Name</label>
                  <input
                    type="text"
                    value={form.businessName}
                    onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                    placeholder="e.g., Sweet Treats Bakery"
                    className="w-full p-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#8A63D2] focus:ring-1 focus:ring-[#8A63D2]"
                  />
                </div>

                {/* Tagline */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">Tagline</label>
                  <input
                    type="text"
                    value={form.tagline}
                    onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                    placeholder="e.g., Fresh baked goods delivered to your door"
                    className="w-full p-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#8A63D2] focus:ring-1 focus:ring-[#8A63D2]"
                  />
                </div>

                {/* Theme */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">Theme</label>
                  <select
                    value={form.theme}
                    onChange={(e) => setForm({ ...form, theme: e.target.value })}
                    className="w-full p-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#8A63D2] focus:ring-1 focus:ring-[#8A63D2] bg-white"
                  >
                    <option value="">Default theme</option>
                    {themes.map((t) => (
                      <option key={t} value={t}>{t.replace('theme-', '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>
                    ))}
                  </select>
                </div>

                {/* Template Preview (iframe) */}
                {form.templateName && (
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-gray-700">Preview</label>
                    <div className="relative border border-gray-200 rounded-xl overflow-hidden h-[200px] bg-gray-50">
                      <iframe
                        src={`/templates/${form.templateName}`}
                        className="w-[1280px] h-[720px] origin-top-left scale-[0.35] pointer-events-none"
                        title="Template Preview"
                      />
                    </div>
                  </div>
                )}

                {/* Share URL (for edit mode) */}
                {editData?.share_id && (
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-gray-700">Share Link</label>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-600 truncate">
                        {typeof window !== 'undefined' ? `${window.location.origin}/claim/${editData.share_id}` : `/claim/${editData.share_id}`}
                      </code>
                      <button
                        onClick={() => handleCopy(`${window.location.origin}/claim/${editData.share_id}`)}
                        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors shrink-0"
                      >
                        {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} className="text-gray-500" />}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50/50 rounded-b-2xl">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading || !form.templateName}
                  className="px-5 py-2 text-sm font-semibold text-white bg-[#8A63D2] hover:bg-[#7c59bd] rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {loading && <Loader2 size={14} className="animate-spin" />}
                  {editData ? 'Save Changes' : 'Create & Get Link'}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
