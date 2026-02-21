'use client';

import { useState } from 'react';
import { UploadCloud, Instagram, Facebook, User, Briefcase, Phone, ChevronRight } from 'lucide-react';

export default function BusinessInfoStep({ initialData, onNext, loading }) {
  const [formData, setFormData] = useState({
    businessName: initialData.businessName || initialData.websiteData?.name || '',
    ownerName: initialData.ownerName || '',
    socialInstagram: initialData.socialInstagram || '',
    socialFacebook: initialData.socialFacebook || '',
    logoUrl: initialData.logoUrl || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, logoUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const formatSocialLink = (input, platform) => {
      if (!input) return '';
      if (input.startsWith('http')) return input;

      if (platform === 'instagram') {
          return `https://instagram.com/${input.replace('@', '')}`;
      }
      if (platform === 'facebook') {
          return `https://facebook.com/${input}`;
      }
      return input;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Format socials before sending
    const formattedData = {
        ...formData,
        socialInstagram: formatSocialLink(formData.socialInstagram, 'instagram'),
        socialFacebook: formatSocialLink(formData.socialFacebook, 'facebook'),
    };

    onNext(formattedData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Welcome!</h2>
        <p className="text-gray-500 mt-2 text-sm">Let's set up your business details.</p>
      </div>

      <div className="space-y-5">
        {/* Logo Upload */}
        <div className="flex flex-col items-center justify-center gap-2">
            <div className="relative group w-24 h-24 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden hover:border-[#8A63D2] hover:bg-purple-50 transition-all cursor-pointer">
                {formData.logoUrl ? (
                    <img src={formData.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                    <div className="flex flex-col items-center text-gray-400">
                        <UploadCloud size={20} />
                        <span className="text-[10px] mt-1 font-medium">Add Logo</span>
                    </div>
                )}
                <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleLogoUpload}
                />
            </div>
        </div>

        {/* Business Name */}
        <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase">Business Name</label>
            <div className="relative">
                <Briefcase size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    required
                    placeholder="e.g. The Coffee Shop"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-purple-500 transition-all"
                />
            </div>
        </div>

        {/* Owner Name */}
        <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase">Owner Name</label>
            <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleChange}
                    required
                    placeholder="Your Name"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-purple-500 transition-all"
                />
            </div>
        </div>

        {/* Socials */}
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase">Instagram</label>
                <div className="relative">
                    <Instagram size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        name="socialInstagram"
                        value={formData.socialInstagram}
                        onChange={handleChange}
                        placeholder="@username"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-purple-500 transition-all"
                    />
                </div>
            </div>
            <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase">Facebook</label>
                <div className="relative">
                    <Facebook size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        name="socialFacebook"
                        value={formData.socialFacebook}
                        onChange={handleChange}
                        placeholder="Page URL or ID"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-purple-500 transition-all"
                    />
                </div>
            </div>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-2.5 rounded-xl bg-[#8A63D2] text-white font-bold hover:bg-[#7854bc] transition-colors disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-purple-200"
          >
            {loading ? 'Saving...' : 'Next Step'} <ChevronRight size={18} />
          </button>
      </div>
    </form>
  );
}
