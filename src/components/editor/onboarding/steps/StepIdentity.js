'use client';

import { useState, useEffect } from 'react';
import { UploadCloud, X, User, MapPin, Phone, Building2 } from 'lucide-react';
import Image from 'next/image';

export default function StepIdentity({ data, onUpdate, errors = {} }) {
  const [logoPreview, setLogoPreview] = useState(data.logo_url || null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
        onUpdate('logo_url', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Let's get to know you</h2>
        <p className="text-gray-500 text-sm mt-1">Tell us a bit about your business to get started.</p>
      </div>

      {/* Business Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Business Name <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={data.name || ''}
            onChange={(e) => onUpdate('name', e.target.value)}
            className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8A63D2]/20 transition-all ${
              errors.name ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-[#8A63D2]'
            }`}
            placeholder="e.g. Acme Corp"
          />
        </div>
        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
      </div>

      {/* Owner Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Owner Name <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={data.owner_name || ''}
            onChange={(e) => onUpdate('owner_name', e.target.value)}
            className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8A63D2]/20 transition-all ${
              errors.owner_name ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-[#8A63D2]'
            }`}
            placeholder="e.g. John Doe"
          />
        </div>
         {errors.owner_name && <p className="text-xs text-red-500 mt-1">{errors.owner_name}</p>}
      </div>

      {/* City */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          City / Location <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={data.business_city || ''}
            onChange={(e) => onUpdate('business_city', e.target.value)}
            className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8A63D2]/20 transition-all ${
              errors.business_city ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-[#8A63D2]'
            }`}
            placeholder="e.g. Silchar"
          />
        </div>
         {errors.business_city && <p className="text-xs text-red-500 mt-1">{errors.business_city}</p>}
      </div>

      {/* WhatsApp */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          WhatsApp Number <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={data.whatsapp_number || ''}
            onChange={(e) => {
                 const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                 onUpdate('whatsapp_number', val);
            }}
            className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8A63D2]/20 transition-all ${
              errors.whatsapp_number ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-[#8A63D2]'
            }`}
            placeholder="10-digit number"
            maxLength={10}
          />
        </div>
         {errors.whatsapp_number && <p className="text-xs text-red-500 mt-1">{errors.whatsapp_number}</p>}
      </div>

      {/* Logo Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Business Logo <span className="text-gray-400 font-normal">(Optional)</span>
        </label>
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors relative overflow-hidden group">

            {logoPreview ? (
                <div className="relative w-24 h-24 rounded-full overflow-hidden border shadow-sm">
                   <Image src={logoPreview} alt="Logo Preview" fill className="object-cover" />
                   <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white text-xs font-medium">Change</span>
                   </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-xs text-gray-500">Click to upload logo</p>
                </div>
            )}
            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
          </label>
        </div>
      </div>
    </div>
  );
}
