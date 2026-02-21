'use client';

import { useState } from 'react';
import { UploadCloud, Instagram, Facebook, User, Briefcase, Phone } from 'lucide-react';

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

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Welcome to Your Website!</h2>
        <p className="text-gray-500 mt-2">Let's start with some basic details about your business.</p>
      </div>

      <div className="space-y-4">
        {/* Logo Upload */}
        <div className="flex flex-col items-center justify-center gap-2">
            <div className="relative group w-24 h-24 rounded-full bg-gray-50 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden hover:border-[#8A63D2] hover:bg-purple-50 transition-all cursor-pointer">
                {formData.logoUrl ? (
                    <img src={formData.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                    <div className="flex flex-col items-center text-gray-400">
                        <UploadCloud size={20} />
                        <span className="text-[10px] mt-1 font-medium">Upload Logo</span>
                    </div>
                )}
                <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleLogoUpload}
                />
            </div>
            <span className="text-xs text-gray-500">Business Logo</span>
        </div>

        {/* Business Name */}
        <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Business Name</label>
            <div className="relative">
                <Briefcase size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    required
                    placeholder="e.g. The Coffee Shop"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#8A63D2] focus:ring-1 focus:ring-[#8A63D2]"
                />
            </div>
        </div>

        {/* Owner Name */}
        <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Owner Name</label>
            <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleChange}
                    required
                    placeholder="Your Name"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#8A63D2] focus:ring-1 focus:ring-[#8A63D2]"
                />
            </div>
        </div>

        {/* Socials */}
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Instagram</label>
                <div className="relative">
                    <Instagram size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        name="socialInstagram"
                        value={formData.socialInstagram}
                        onChange={handleChange}
                        placeholder="@username"
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#8A63D2] focus:ring-1 focus:ring-[#8A63D2]"
                    />
                </div>
            </div>
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Facebook</label>
                <div className="relative">
                    <Facebook size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        name="socialFacebook"
                        value={formData.socialFacebook}
                        onChange={handleChange}
                        placeholder="Page URL"
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#8A63D2] focus:ring-1 focus:ring-[#8A63D2]"
                    />
                </div>
            </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-[#8A63D2] text-white font-bold rounded-xl hover:bg-[#7854bc] transition-all disabled:opacity-50 mt-6"
      >
        {loading ? 'Saving...' : 'Next Step'}
      </button>
    </form>
  );
}
