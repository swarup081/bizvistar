// src/app/get-started/3/page.js
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { GridBackgroundDemo } from "@/components/GridBackgroundDemo";
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MapPin, Calendar, ShoppingBag, Check } from 'lucide-react';

// --- Shared Styles & Logic (Consistent with Step 2) ---
const stylesMap = {
  default: { colors: ['#F9FAFB', '#E5E7EB', '#1F2937'] },
  elegant: { colors: ['#FAFAF9', '#F0EEE8', '#5A534B'] },
  cozy: { colors: ['#FFF7ED', '#FFEDD5', '#9A3412'] },
  modern: { colors: ['#F8FAFC', '#E8EDF5', '#1E293B'] },
  trusted: { colors: ['#F0F9FF', '#E0F2FE', '#0369A1'] },
  minimal: { colors: ['#FFFFFF', '#F3F4F6', '#111827'] },
  bold: { colors: ['#F9FAFB', '#E5E7EB', '#1F2937'] },
  vintage: { colors: ['#FEFCE8', '#F3F4F6', '#713F12'] },
  playful: { colors: ['#FFF1F2', '#FFE4E6', '#BE123C'] },
  natural: { colors: ['#F0FDF4', '#DCFCE7', '#166534'] },
  handcrafted: { colors: ['#FFEDD5', '#FFDCC2', '#7C2D12'] },
  luxury: { colors: ['#F9F9F9', '#EDEDF0', '#27272A'] },
  fast: { colors: ['#FEF2F2', '#FEE2E2', '#991B1B'] }
};

const getThemeLogic = (selectedVibes, activeVibe) => {
  if (!selectedVibes) return { mixedColors: stylesMap.default.colors };
  const activeKeys = Object.keys(selectedVibes).filter(key => selectedVibes[key]);
  
  let mixedColors = [...stylesMap.default.colors];
  if (activeKeys.length >= 1) {
     // Simple logic: use the first selected vibe's colors for consistency
     const primaryStyle = stylesMap[activeKeys[0]] || stylesMap.default;
     mixedColors = [...primaryStyle.colors];
  }
  return { mixedColors };
};

// --- VISUAL COMPONENT 1: Order Confirmation (The requested text) ---
const OrderVisual = ({ colors }) => (
  <motion.div
    initial={{ opacity: 0, y: 10, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -10, scale: 0.95 }}
    transition={{ duration: 0.4 }}
    className="w-[260px] bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100"
  >
    <div className="px-5 py-4 border-b border-slate-50" style={{ backgroundColor: colors[0] }}>
        <p className="text-[11px] font-bold uppercase tracking-wide" style={{ color: colors[2] }}>
            Subject: <span className="font-normal normal-case opacity-70">Order confirmation</span>
        </p>
    </div>
    <div className="p-6 text-center flex flex-col items-center bg-[#1a1a1a]">
        <h3 className="text-white font-medium text-sm mb-2">Your order is confirmed!</h3>
        <p className="text-[10px] text-gray-400 leading-relaxed mb-5 px-2">
            We&apos;ll let you know as soon as it&apos;s on its way
        </p>
        <div className="w-full aspect-[4/3] rounded-lg overflow-hidden relative bg-gray-800">
             <img 
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80" 
                alt="Product" 
                className="absolute inset-0 w-full h-full object-cover opacity-90"
            />
        </div>
    </div>
  </motion.div>
);

// --- VISUAL COMPONENT 2: Reviews ---
const ReviewVisual = ({ colors }) => (
  <motion.div
    initial={{ opacity: 0, y: 10, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -10, scale: 0.95 }}
    className="w-[260px] bg-white rounded-2xl shadow-xl p-6 border border-slate-100 relative overflow-hidden"
  >
      <div className="flex gap-1 mb-3">
          {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-current text-yellow-400" />)}
      </div>
      <h3 className="font-bold text-lg mb-1" style={{ color: colors[2] }}>Amazing Service!</h3>
      <p className="text-xs text-gray-500 leading-relaxed mb-4">
          "I absolutely love the quality and the attention to detail. Will definitely be coming back for more!"
      </p>
      <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
          <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
               <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="User" className="w-full h-full object-cover" />
          </div>
          <div>
              <p className="text-xs font-bold text-gray-900">Sarah Jenkins</p>
              <p className="text-[10px] text-gray-400">Verified Customer</p>
          </div>
      </div>
      {/* Decorative splash */}
      <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full opacity-20" style={{ backgroundColor: colors[2] }}></div>
  </motion.div>
);

// --- VISUAL COMPONENT 3: Inventory / Dashboard ---
const InventoryVisual = ({ colors }) => (
  <motion.div
    initial={{ opacity: 0, y: 10, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -10, scale: 0.95 }}
    className="w-[260px] bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100"
  >
      <div className="px-5 py-3 border-b border-slate-100 flex justify-between items-center">
          <span className="text-xs font-bold text-gray-900">Stock Status</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">Live</span>
      </div>
      <div className="p-2">
          {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="w-10 h-10 rounded bg-gray-100 overflow-hidden flex-shrink-0">
                    <img src={`https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=100&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHByb2R1Y3R8ZW58MHx8MHx8fDA%3D&w=${100+i}`} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow min-w-0">
                      <div className="h-2 w-20 bg-gray-200 rounded mb-1.5"></div>
                      <div className="h-1.5 w-12 bg-gray-100 rounded"></div>
                  </div>
                  <div className="text-right">
                      <span className="text-xs font-bold" style={{ color: colors[2] }}>{12 * i}</span>
                      <p className="text-[8px] text-gray-400">left</p>
                  </div>
              </div>
          ))}
      </div>
  </motion.div>
);

// --- VISUAL COMPONENT 4: Menu / List ---
const MenuVisual = ({ colors }) => (
  <motion.div
    initial={{ opacity: 0, y: 10, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -10, scale: 0.95 }}
    className="w-[250px] bg-white rounded-2xl shadow-xl p-5 border border-slate-100 relative"
  >
      <div className="text-center mb-4">
          <h3 className="font-serif italic text-xl text-gray-900">Menu</h3>
          <div className="h-0.5 w-8 bg-gray-200 mx-auto mt-1"></div>
      </div>
      <div className="space-y-3">
          {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between items-baseline border-b border-dashed border-gray-100 pb-2">
                  <div>
                      <p className="text-xs font-bold text-gray-800">Artisan Item {i}</p>
                      <p className="text-[9px] text-gray-400">Fresh ingredients, handmade</p>
                  </div>
                  <span className="text-xs font-medium" style={{ color: colors[2] }}>${8 + i * 2}</span>
              </div>
          ))}
      </div>
      {/* Floating QR Code */}
      <div className="absolute bottom-3 right-3 w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center shadow-lg">
          <div className="w-6 h-6 border-2 border-white rounded-sm flex items-center justify-center">
              <div className="w-2 h-2 bg-white"></div>
          </div>
      </div>
  </motion.div>
);

// --- VISUAL COMPONENT 5: Booking ---
const BookingVisual = ({ colors }) => (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      className="w-[250px] bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100"
    >
        <div className="bg-gray-900 p-4 text-center">
             <h3 className="text-white text-sm font-medium">Appointment Confirmed</h3>
             <div className="mt-3 w-12 h-12 rounded-full bg-green-500 mx-auto flex items-center justify-center">
                 <Check className="w-6 h-6 text-white" />
             </div>
        </div>
        <div className="p-5 space-y-3">
             <div className="flex items-center gap-3 text-sm text-gray-600">
                 <Calendar className="w-4 h-4" />
                 <span>Fri, Nov 24 • 10:00 AM</span>
             </div>
             <div className="flex items-center gap-3 text-sm text-gray-600">
                 <MapPin className="w-4 h-4" />
                 <span>Main Street Studio</span>
             </div>
             <button 
                className="w-full mt-2 py-2 rounded-lg text-xs font-bold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: colors[2] }}
             >
                 Add to Calendar
             </button>
        </div>
    </motion.div>
  );

// --- Dynamic Overlay Manager ---
const DynamicVisualOverlay = ({ featureId, colors }) => {
    // Determine which visual to show based on the feature ID
    const getVisual = () => {
        // Order/Store related
        if (['delivery', 'shipping', 'store', 'products', 'dropshipping', 'pod', 'payments', 'discounts', 'default'].includes(featureId)) {
            return <OrderVisual colors={colors} />;
        }
        // Reviews
        if (['reviews', 'testimonials'].includes(featureId)) {
            return <ReviewVisual colors={colors} />;
        }
        // Inventory
        if (['inventory'].includes(featureId)) {
            return <InventoryVisual colors={colors} />;
        }
        // Menu
        if (['menu', 'services', 'gallery', 'portfolio', 'digital'].includes(featureId)) {
            return <MenuVisual colors={colors} />;
        }
        // Booking
        if (['booking', 'appointments', 'contact', 'location'].includes(featureId)) {
            return <BookingVisual colors={colors} />;
        }
        // Fallback
        return <OrderVisual colors={colors} />;
    };

    return (
        <AnimatePresence mode="wait">
            <div key={featureId || 'default'}>
                {getVisual()}
            </div>
        </AnimatePresence>
    );
};

// --- Template Skeleton (Background) ---
const TemplateSkeleton = ({ storeName, colors }) => {
    const bg = colors ? colors[0] : '#F9FAFB';
    const secondary = colors ? colors[1] : '#E5E7EB';
    const accent = colors ? colors[2] : '#1F2937';

    return (
        <div className="w-full h-full flex flex-col bg-white overflow-hidden rounded-tl-[2rem]">
            {/* Navbar */}
            <div className="h-20 border-b border-slate-100 flex items-center justify-between px-8 shrink-0 bg-white/80 backdrop-blur-sm transition-colors duration-500">
                <div className="flex gap-4 items-center">
                    <div className="h-10 w-10 rounded-2xl flex items-center justify-center font-bold text-sm shadow-sm" style={{ backgroundColor: bg, color: accent }}>
                        {storeName ? storeName.charAt(0).toUpperCase() : 'B'}
                    </div>
                    <div className="hidden md:flex gap-3 items-center">
                        {storeName ? (
                            <span className="text-3xl font-extrabold tracking-wide opacity-90" style={{ color: accent }}>{storeName}</span>
                        ) : (
                            <div className="h-3 w-24 bg-slate-100 rounded-full"></div>
                        )}
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="h-10 w-10 bg-slate-100 rounded-full"></div>
                    <div className="h-10 w-24 rounded-full opacity-50" style={{ backgroundColor: secondary }}></div>
                </div>
            </div>

            <div className="flex-grow p-8 flex flex-col gap-8 overflow-y-auto no-scrollbar bg-slate-50/20">
                {/* Hero */}
                <div className="w-full aspect-[2.5/1] bg-white/90 rounded-[2.5rem] border border-slate-100 relative overflow-hidden flex p-10 gap-10 items-center shadow-[0_4px_20px_-8px_rgba(0,0,0,0.05)]">
                    <div className="w-1/2 h-full rounded-[1.5rem] border border-slate-100 relative overflow-hidden" style={{ backgroundColor: bg }}>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full mix-blend-multiply filter blur-2xl opacity-30" style={{ backgroundColor: secondary }}></div>
                    </div>
                    <div className="w-1/2 space-y-5 z-10">
                        <div className="h-4 w-20 rounded-full text-xs flex items-center justify-center font-bold uppercase tracking-wider opacity-60" style={{ backgroundColor: secondary, color: accent }}></div>
                        <div className="space-y-3">
                            <div className="h-6 w-full bg-slate-200/60 rounded-2xl"></div>
                            <div className="h-6 w-3/4 bg-slate-200/60 rounded-2xl"></div>
                        </div>
                    </div>
                </div>
                
                {/* Grid */}
                <div className="grid grid-cols-2 gap-6 auto-rows-[11rem]">
                    <div className="row-span-2 bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm">
                        <div className="w-full flex-grow rounded-2xl border border-slate-50 mb-4 relative overflow-hidden" style={{ backgroundColor: bg }}></div>
                        <div className="space-y-2.5 shrink-0"><div className="h-2 w-full bg-slate-100 rounded-full"></div></div>
                    </div>
                    <div className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm">
                        <div className="h-10 w-10 rounded-2xl border border-slate-50" style={{ backgroundColor: bg }}></div>
                        <div className="space-y-2.5 mt-auto"><div className="h-2 w-full bg-slate-100 rounded-full"></div></div>
                    </div>
                    <div className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm">
                        <div className="h-10 w-10 rounded-2xl border border-slate-50" style={{ backgroundColor: bg }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Mock Browser Container ---
const MockBrowser = ({ storeName, selectedVibes, activeVibe, hoveredFeature, className }) => {
    const siteSlug = storeName ? storeName.toLowerCase().replace(/[^a-z0-9]/g, '') : 'your-site';
    const { mixedColors } = getThemeLogic(selectedVibes, activeVibe);

    return (
        <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className={`absolute bg-white rounded-tl-[2.5rem] shadow-[0_20px_80px_-20px_rgba(0,0,0,0.32)] border-l border-t border-gray-200/60 flex flex-col ${className}`}
        >
            {/* Floating Visual Card */}
            <div className="absolute -left-[130px] top-[240px] z-50">
                 <DynamicVisualOverlay featureId={hoveredFeature} colors={mixedColors} />
            </div>

            {/* Browser Header */}
            <div className="h-16 border-b border-slate-100 flex items-center px-6 gap-5 shrink-0 z-20 relative rounded-tl-[2.5rem] bg-white">
                <div className="flex gap-2.5">
                    <div className="w-3.5 h-3.5 rounded-full bg-[#FF5F57] border border-black/5"></div>
                    <div className="w-3.5 h-3.5 rounded-full bg-[#FFBD2E] border border-black/5"></div>
                    <div className="w-3.5 h-3.5 rounded-full bg-[#28C840] border border-black/5"></div>
                </div>
                <div className="flex-grow h-10 bg-slate-50 border border-slate-200/60 rounded-3xl flex items-center px-4 justify-start gap-3 relative transition-colors duration-300">
                     <div className="w-4 h-4 rounded-full bg-gray-300"></div>
                     <span className="text-sm text-slate-500 font-medium truncate font-sans tracking-wide transition-colors">
                        <span className="text-slate-600 font-bold">{siteSlug}</span>.bizvistaar.com
                     </span>
                </div>
            </div>
            
            {/* Main Skeleton */}
            <div className="flex-grow relative overflow-hidden bg-white">
                <TemplateSkeleton storeName={storeName} colors={mixedColors} />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-slate-50/20 pointer-events-none"></div>
            </div>
        </motion.div>
    );
};

// --- Feature Chip (Pill style from Step 2) ---
const FeatureChip = ({ id, label, isSelected, onChange, onHover }) => (
    <label
      htmlFor={id}
      onMouseEnter={() => onHover(id)} // Trigger visual change
      className={`flex items-center justify-center px-4 py-3 border rounded-full cursor-pointer transition-all duration-200 select-none text-center text-sm font-medium ${
        isSelected
          ? 'border-black bg-gray-900 text-white shadow-md' // Selected
          : 'border-gray-300 bg-white text-gray-600 hover:border-gray-900 hover:text-gray-900' // Default
      }`}
    >
      {label}
      <input id={id} type="checkbox" className="hidden" checked={isSelected} onChange={onChange} />
    </label>
);

// --- Dynamic Feature Sets ---
const FEATURE_SETS = {
  food: [
    { id: 'menu', label: 'Digital Menu (QR)' },
    { id: 'delivery', label: 'Home Delivery' },
    { id: 'booking', label: 'Table Booking' },
    { id: 'location', label: 'Location & Hours' },
    { id: 'reviews', label: 'Customer Reviews' },
    { id: 'gallery', label: 'Food Gallery' },
  ],
  retail: [
    { id: 'store', label: 'Online Store' },
    { id: 'shipping', label: 'Home Delivery' },
    { id: 'inventory', label: 'Inventory Mgmt' },
    { id: 'discounts', label: 'Promo Codes' },
    { id: 'reviews', label: 'Product Reviews' },
    { id: 'payments', label: 'Online Payments' },
  ],
  service: [
    { id: 'appointments', label: 'Book Appointments' },
    { id: 'services', label: 'Service Menu' },
    { id: 'team', label: 'Our Team' },
    { id: 'contact', label: 'Contact Form' },
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'portfolio', label: 'Work Portfolio' },
  ],
  default: [
    { id: 'products', label: 'Physical Products' },
    { id: 'digital', label: 'Digital Products' },
    { id: 'services', label: 'Services' },
    { id: 'dropshipping', label: 'Dropshipping' },
    { id: 'pod', label: 'Print-on-Demand' },
    { id: 'blog', label: 'Blog / Content' },
  ]
};

export default function StepThree() {
  const [storeName, setStoreName] = useState('your business');
  const [businessType, setBusinessType] = useState('');
  const [selectedFeatures, setSelectedFeatures] = useState({});
  const [features, setFeatures] = useState(FEATURE_SETS.default);
  
  // Theme state
  const [selectedVibes, setSelectedVibes] = useState({});
  const [activeVibe, setActiveVibe] = useState('modern');
  
  // Hover state for dynamic visual
  const [hoveredFeature, setHoveredFeature] = useState('default');

  // --- Load Data ---
  useEffect(() => {
    const storedStoreName = localStorage.getItem('storeName');
    if (storedStoreName) setStoreName(storedStoreName);

    const storedType = localStorage.getItem('businessType') || '';
    setBusinessType(storedType);
    
    const storedVibes = localStorage.getItem('businessVibes');
    if (storedVibes) {
        const parsedVibes = JSON.parse(storedVibes);
        setSelectedVibes(parsedVibes);
        const keys = Object.keys(parsedVibes).filter(k => parsedVibes[k]);
        if (keys.length > 0) setActiveVibe(keys[keys.length - 1]);
    }

    const lowerType = storedType.toLowerCase();

    // Determine appropriate features based on business type input
    if (['restaurant', 'cafe', 'bakery', 'food', 'coffee', 'sweet', 'kitchen', 'catering', 'bar', 'pub'].some(t => lowerType.includes(t))) {
        setFeatures(FEATURE_SETS.food);
        setHoveredFeature('menu'); // Default visual
    } else if (['shop', 'store', 'boutique', 'retail', 'mart', 'jewellery', 'clothing', 'fashion', 'market'].some(t => lowerType.includes(t))) {
        setFeatures(FEATURE_SETS.retail);
        setHoveredFeature('store'); // Default visual
    } else if (['salon', 'clinic', 'doctor', 'gym', 'yoga', 'consultant', 'agency', 'repair', 'service', 'dentist', 'lawyer'].some(t => lowerType.includes(t))) {
        setFeatures(FEATURE_SETS.service);
        setHoveredFeature('appointments'); // Default visual
    } else {
        setFeatures(FEATURE_SETS.default);
    }
  }, []);

  const handleFeatureChange = (id) => {
    setSelectedFeatures(prev => ({ ...prev, [id]: !prev[id] }));
  };
  
  const handleContinue = () => {
      localStorage.setItem('selectedFeatures', JSON.stringify(selectedFeatures));
  }

  return (
    <div className="flex h-screen font-sans overflow-hidden bg-white">
      
      {/* --- LEFT SIDE (Form) --- */}
      <div className="w-full lg:w-[45%] flex flex-col justify-between p-16 xl:p-20 bg-white z-30 relative shadow-[20px_0_40px_-10px_rgba(0,0,0,0.03)]">
        <div className="absolute top-10 left-10 text-3xl font-bold text-gray-900 not-italic tracking-tight">
            BizVistaar
        </div>

        <div className="flex flex-col justify-center h-full max-w-md ml-2">
            <p className="text-xs font-bold text-gray-400 mb-6 tracking-widest uppercase">
              STEP 3 OF 3
            </p>
            <h2 className="text-3xl font-bold text-gray-900 mb-4 leading-snug not-italic">
              What features does <span className="text-gray-500">{storeName}</span> need?
            </h2>
            <p className="text-gray-400 text-sm mb-10">
              Select the tools you need. We&apos;ll set them up for you.
            </p>

            {/* Dynamic Feature Grid (Pills) */}
            <div className="grid grid-cols-2 gap-3 mb-8">
                {features.map(feature => (
                    <FeatureChip
                        key={feature.id}
                        id={feature.id}
                        label={feature.label}
                        isSelected={!!selectedFeatures[feature.id]}
                        onChange={() => handleFeatureChange(feature.id)}
                        onHover={setHoveredFeature} // Pass setter to update visual on hover
                    />
                ))}
            </div>
        </div>

        <div className="flex items-center justify-between w-full">
            <Link href="/get-started/2">
                <button className="text-gray-600 hover:text-gray-900 font-medium text-m flex items-center gap-1 transition-colors">
                ← Back
                </button>
            </Link>

            <Link href="/templates" passHref>
                <button
                    onClick={handleContinue}
                    className="px-8 py-2.5 bg-gray-900 text-white font-medium text-sm rounded-full hover:bg-gray-700 transition-colors shadow-sm"
                >
                    Finish
                </button>
            </Link>
        </div>
      </div>

      {/* --- RIGHT SIDE (Visuals) --- */}
      <div className="hidden lg:block lg:w-[55%] bg-gray-50 relative overflow-hidden border-l border-gray-100">
        <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
           <GridBackgroundDemo />
        </div>
        <div className="relative w-full h-full">
             {/* Mock Browser with Themed Skeleton & Dynamic Card */}
             <MockBrowser 
                storeName={storeName}
                selectedVibes={selectedVibes}
                activeVibe={activeVibe}
                hoveredFeature={hoveredFeature}
                className="absolute top-[10%] left-[35%] w-[100%] h-[100%] z-20"
             />
        </div>
      </div>
    </div>
  );
}