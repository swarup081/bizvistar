'use client';

import { Instagram, Facebook } from 'lucide-react';

export default function StepSocial({ data, onUpdate }) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Connect your socials</h2>
        <p className="text-gray-500 text-sm mt-1">We'll add clickable icons to your website footer.</p>
      </div>

      <div className="space-y-4">
        {/* Instagram */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Instagram Profile Link
          </label>
          <div className="relative">
            <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-600" size={18} />
            <input
              type="text"
              value={data.social_instagram || ''}
              onChange={(e) => onUpdate('social_instagram', e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
              placeholder="https://instagram.com/yourbrand"
            />
          </div>
        </div>

        {/* Facebook */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Facebook Page Link
          </label>
          <div className="relative">
            <Facebook className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600" size={18} />
            <input
              type="text"
              value={data.social_facebook || ''}
              onChange={(e) => onUpdate('social_facebook', e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              placeholder="https://facebook.com/yourbrand"
            />
          </div>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-center">
          <p className="text-blue-700 text-xs font-medium">
             💡 Pro Tip: Social proof builds trust and can increase sales by up to 30%.
          </p>
      </div>
    </div>
  );
}
