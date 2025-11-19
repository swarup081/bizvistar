'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { GridBackgroundDemo } from "@/components/GridBackgroundDemo";
import { motion } from 'framer-motion';

// --- Shared Styles & Logic (Refined for Subtlety) ---
// Index 0: Background (Very light/white tint)
// Index 1: Secondary (Light pastel/surface)
// Index 2: Accent/Text (Strong contrast)
const stylesMap = {
  default: {
    font: 'var(--font-inter)',
    colors: ['#F9FAFB', '#E5E7EB', '#1F2937'], // Gray 50, 200, 800
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=300&q=80',
  },
  elegant: {
    font: 'var(--font-playfair-display)',
    colors: ['#FAFAF9', '#F0EEE8', '#5A534B'], // Updated: softer background, subtle secondary, richer accent
    image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=300&q=80',
  },
  cozy: {
    font: 'var(--font-lora)',
    colors: ['#FFF7ED', '#FFEDD5', '#9A3412'], // Orange 50, 100, 800
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=300&q=80',
  },
  modern: {
    font: 'var(--font-dm-sans)',
    colors: ['#F8FAFC', '#E8EDF5', '#1E293B'], // Updated: lighter secondary, deeper accent
    image: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=300&q=80',
  },
  trusted: {
    font: 'var(--font-roboto)',
    colors: ['#F0F9FF', '#E0F2FE', '#0369A1'], // Sky 50, 100, 700
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=300&q=80',
  },
  minimal: {
    font: 'var(--font-inter)',
    colors: ['#FFFFFF', '#F3F4F6', '#111827'], // White, Gray 100, Black
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=300&q=80',
  },
  bold: {
    font: 'var(--font-montserrat)',
    colors: ['#F9FAFB', '#E5E7EB', '#1F2937'],
    image: 'https://images.unsplash.com/photo-1550614000-4b9519e029b9?auto=format&fit=crop&w=300&q=80',
  },
  vintage: {
    font: 'var(--font-cormorant-garamond)',
    colors: ['#FEFCE8', '#F3F4F6', '#713F12'], // Yellow 50, Gray 100, Brown 800
    image: 'https://images.unsplash.com/photo-1524234599372-a5bd0194758d?auto=format&fit=crop&w=300&q=80',
  },
  playful: {
    font: 'var(--font-Kalam)',
    colors: ['#FFF1F2', '#FFE4E6', '#BE123C'], // Rose 50, 200, 700
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=300&q=80',
  },
  natural: {
    font: 'var(--font-lato)',
    colors: ['#F0FDF4', '#DCFCE7', '#166534'], // Green 50, 100, 800
    image: 'https://images.unsplash.com/photo-1470058869958-2a77ade41c02?auto=format&fit=crop&w=300&q=80',
  },
  handcrafted: {
    font: 'var(--font-kalam)',
    colors: ['#FFEDD5', '#FFDCC2', '#7C2D12'], // Orange 100, Custom, Brown 900
    image: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=300&q=80',
  },
  luxury: {
    font: 'var(--font-cormorant-garamond)',
    colors: ['#F9F9F9', '#EDEDF0', '#27272A'], // Updated: slightly brighter background, softer secondary, richer accent
    image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=300&q=80',
  },
  fast: {
    font: 'var(--font-poppins)',
    colors: ['#FEF2F2', '#FEE2E2', '#991B1B'], // Red 50, 200, 800
    image: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=300&q=80',
  }
};

// Helper to calculate mixed style based on selection
const getThemeLogic = (selectedVibes, activeVibe) => {
  const activeKeys = Object.keys(selectedVibes).filter(key => selectedVibes[key]);
  const primaryKey = activeKeys.includes(activeVibe) 
    ? activeVibe 
    : (activeKeys.length > 0 ? activeKeys[activeKeys.length - 1] : 'default');
  
  const primaryStyle = stylesMap[primaryKey] || stylesMap.default;
  
  let mixedColors = [...primaryStyle.colors];

  if (activeKeys.length >= 2) {
     // Pick background from first selection (usually lighter)
     const style1 = stylesMap[activeKeys[0]];
     // Pick secondary from second selection (ensure it's subtle)
     const style2 = stylesMap[activeKeys[1]];
     // Pick accent from third or fallback to first (strong contrast)
     const style3 = stylesMap[activeKeys[2] || activeKeys[0]];

     mixedColors = [
        style1.colors[0], // Background
        style2.colors[1], // Secondary
        style3.colors[2]  // Text/Accent
     ];
  }

  return { primaryStyle, mixedColors };
};

// --- 1. Brand Grid Component (Simplified) ---
const BrandGrid = ({ storeName, selectedVibes, activeVibe }) => {
  const { primaryStyle, mixedColors } = getThemeLogic(selectedVibes, activeVibe);
  
  const displayName = (!storeName || storeName.length > 8) ?  storeName.charAt(0).toUpperCase() : storeName;

  return (
    <motion.div 
      key={Object.keys(selectedVibes).join('-') + activeVibe} 
      initial={{ opacity: 0.8, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-white p-4 rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] border border-slate-100 w-[260px]"
    >
      <div className="grid grid-cols-2 gap-3">
        {/* 1. Logo Cell */}
        <div className="aspect-square rounded-xl border border-stone-100 flex items-center justify-center p-2 overflow-hidden bg-white relative group">
          <span 
            style={{ fontFamily: primaryStyle.font }}
            className="text-4xl font-extrabold text-center leading-tight break-words w-full text-gray-800"
          >
             {displayName}
          </span>
        </div>

        {/* 2. Color Palette Cell */}
        <div className="aspect-square rounded-xl border border-stone-100 overflow-hidden flex shadow-inner">
            <div className="h-full w-1/2" style={{ backgroundColor: mixedColors[0] }}></div>
            <div className="h-full w-1/2 flex flex-col">
                <div className="h-1/2 w-full" style={{ backgroundColor: mixedColors[1] }}></div>
                <div className="h-1/2 w-full" style={{ backgroundColor: mixedColors[2] }}></div>
            </div>
        </div>

        {/* 3. Image Cell */}
        <div className="aspect-square rounded-xl border border-stone-100 overflow-hidden relative">
             <img 
                src={primaryStyle.image} 
                alt="Brand Vibe" 
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
             />
        </div>

        {/* 4. Typography Cell */}
        <div className="aspect-square rounded-xl border border-stone-100 flex items-center justify-center bg-gray-50">
            <span 
                style={{ fontFamily: primaryStyle.font, color: mixedColors[2] }}
                className="text-6xl"
            >
                Aa
            </span>
        </div>
      </div>
    </motion.div>
  );
};

// --- 2. Enhanced Template Skeleton (Subtle Colors) ---
const TemplateSkeleton = ({ storeName, colors }) => {
    // colors = [bg (lighter), secondary (medium), text/accent (darker)]
    // We apply these softly to avoid the "radiant" look.
    
    return (
        <div className="w-full h-full flex flex-col bg-white overflow-hidden rounded-tl-[2rem]">
            {/* Navbar */}
            <div 
                className="h-20 border-b border-slate-100 flex items-center justify-between px-8 shrink-0 bg-white/80 backdrop-blur-sm transition-colors duration-500"
            >
                <div className="flex gap-4 items-center">
                    {/* Logo Box: Uses the accent color very subtly */}
                    <div 
                        className="h-10 w-10 rounded-2xl flex items-center justify-center font-bold text-sm shadow-sm transition-colors duration-500"
                        style={{ 
                            backgroundColor: colors[0], 
                            color: colors[2] 
                        }}
                    >
                        {storeName ? storeName.charAt(0).toUpperCase() : 'B'}
                    </div>
                    <div className="hidden md:flex gap-3 items-center">
                        {storeName ? (
                            <span className="text-3xl font-extrabold tracking-wide transition-colors duration-500" style={{ color: colors[2], opacity: 0.9 }}>
                                {storeName}
                            </span>
                        ) : (
                            <>
                                <div className="h-3 w-24 bg-slate-100 rounded-full"></div>
                                <div className="h-3 w-16 bg-slate-100 rounded-full"></div>
                            </>
                        )}
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="h-10 w-10 bg-slate-100 rounded-full"></div>
                    {/* CTA Button: Uses the secondary color lightly */}
                    <div 
                        className="h-10 w-24 rounded-full transition-colors duration-500"
                        style={{ backgroundColor: colors[1], opacity: 0.5 }}
                    ></div>
                </div>
            </div>

            <div className="flex-grow p-8 flex flex-col gap-8 overflow-y-auto no-scrollbar bg-slate-50/20">
                {/* Hero Section */}
                <div className="w-full aspect-[2.5/1] bg-white/90 rounded-[2.5rem] border border-slate-100 relative overflow-hidden flex p-10 gap-10 items-center shadow-[0_4px_20px_-8px_rgba(0,0,0,0.05)]">
                    {/* Hero Image Placeholder - Uses background color tint */}
                    <div className="w-1/2 h-full rounded-[1.5rem] border border-slate-100 relative overflow-hidden transition-colors duration-500" style={{ backgroundColor: colors[0] }}>
                         {/* Subtle Blobs - Only visible as a tint */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full mix-blend-multiply filter blur-2xl opacity-30 transition-colors duration-500" style={{ backgroundColor: colors[1] }}></div>
                    </div>
                    
                    {/* Hero Text Placeholders */}
                    <div className="w-1/2 space-y-5 z-10">
                        <div className="h-4 w-20 rounded-full text-xs flex items-center justify-center font-bold uppercase tracking-wider transition-colors duration-500" style={{ backgroundColor: colors[1], color: colors[2], opacity: 0.6 }}></div>
                        <div className="space-y-3">
                            <div className="h-6 w-full bg-slate-200/60 rounded-2xl"></div>
                            <div className="h-6 w-3/4 bg-slate-200/60 rounded-2xl"></div>
                        </div>
                        <div className="h-12 w-36 rounded-full mt-4 transition-colors duration-500" style={{ backgroundColor: colors[2], opacity: 0.1 }}></div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6 auto-rows-[11rem]">
                    
                    {/* 1. Big Integrated Grid (Spans 2 rows, taking the place of 1 & 3) */}
                    <div className="row-span-2 bg-white rounded-[2rem] border border-slate-100 p-6 flex flex-col justify-between shadow-[0_2px_15px_-6px_rgba(0,0,0,0.03)] group hover:shadow-md transition-shadow">
                        <div 
                            className="w-full flex-grow rounded-2xl border border-slate-50 transition-colors duration-500 mb-4 relative overflow-hidden"
                            style={{ backgroundColor: colors[0] }}
                        >
                             {/* Subtle detail inside big card */}
                            <div className="absolute bottom-4 left-4 h-8 w-8 rounded-full bg-white/60"></div>
                        </div>
                        <div className="space-y-2.5 shrink-0">
                            <div className="h-3 w-1/3 bg-slate-200/80 rounded-full"></div>
                            <div className="h-2 w-full bg-slate-100 rounded-full"></div>
                            <div className="h-2 w-3/4 bg-slate-100 rounded-full"></div>
                        </div>
                    </div>

                    {/* 2. Top Right Card */}
                    <div className="bg-white rounded-[2rem] border border-slate-100 p-6 flex flex-col justify-between shadow-[0_2px_15px_-6px_rgba(0,0,0,0.03)] group hover:shadow-md transition-shadow">
                        <div 
                            className="h-10 w-10 rounded-2xl border border-slate-50 transition-colors duration-500"
                            style={{ backgroundColor: colors[0] }}
                        ></div>
                        <div className="space-y-2.5">
                            <div className="h-3 w-1/2 bg-slate-200/80 rounded-full"></div>
                            <div className="h-2 w-full bg-slate-100 rounded-full"></div>
                        </div>
                    </div>

                    {/* 3. Bottom Right Card */}
                    <div className="bg-white rounded-[2rem] border border-slate-100 p-6 flex flex-col justify-between shadow-[0_2px_15px_-6px_rgba(0,0,0,0.03)] group hover:shadow-md transition-shadow">
                        <div 
                            className="h-10 w-10 rounded-2xl border border-slate-50 transition-colors duration-500"
                            style={{ backgroundColor: colors[0] }}
                        ></div>
                        <div className="space-y-2.5">
                             <div className="h-3 w-1/2 bg-slate-200/80 rounded-full"></div>
                             <div className="h-2 w-full bg-slate-100 rounded-full"></div>
                        </div>
                    </div>

                </div>
        </div>
        </div>
    );
};

// --- 3. Mock Browser Component ---
const MockBrowser = ({ storeName, selectedVibes, activeVibe, className }) => {
    const siteSlug = storeName 
        ? storeName.toLowerCase().replace(/[^a-z0-9]/g, '') 
        : 'your-site';
    
    // Calculate colors here to pass down to both Grid and Skeleton
    const { mixedColors } = getThemeLogic(selectedVibes, activeVibe);

    return (
        <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className={`absolute bg-white rounded-tl-[2.5rem] shadow-[0_20px_80px_-20px_rgba(0,0,0,0.32)] border-l border-t border-gray-200/60 flex flex-col ${className}`}
        >
            {/* --- Brand Grid placed on the left --- */}
            <div className="absolute -left-[150px] top-[320px] z-50">
                 <BrandGrid storeName={storeName} selectedVibes={selectedVibes} activeVibe={activeVibe} />
            </div>

            {/* Browser Header */}
            <div className="h-16 border-b border-slate-100 flex items-center px-6 gap-5 shrink-0 z-20 relative rounded-tl-[2.5rem] bg-white">
                <div className="flex gap-2.5">
                    <div className="w-3.5 h-3.5 rounded-full bg-[#FF5F57] border border-black/5"></div>
                    <div className="w-3.5 h-3.5 rounded-full bg-[#FFBD2E] border border-black/5"></div>
                    <div className="w-3.5 h-3.5 rounded-full bg-[#28C840] border border-black/5"></div>
                </div>
                
                <div className="flex-grow h-10 bg-slate-50 border border-slate-200/60 rounded-3xl flex items-center px-4 justify-start gap-3 relative transition-colors duration-300 group">
                     <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                     <span className="text-sm text-slate-500 font-medium truncate font-sans tracking-wide group-hover:text-slate-900 transition-colors">
                        <span className="text-slate-600 font-bold">{siteSlug}</span>.bizvistaar.com
                     </span>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-grow relative overflow-hidden bg-white">
                {/* Pass calculated colors to Skeleton */}
                <TemplateSkeleton storeName={storeName} colors={mixedColors} />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-slate-50/20 pointer-events-none"></div>
            </div>
        </motion.div>
    );
};

// --- 4. Choice Chip (Black UI) ---
const ChoiceChip = ({ id, label, isSelected, onChange }) => (
    <label
      htmlFor={id}
      className={`flex items-center justify-center px-6 py-3 border rounded-full cursor-pointer transition-all duration-200 select-none ${
        isSelected
          ? 'border-black bg-gray-900 text-white shadow-md' // Black UI Selected
          : 'border-gray-300 bg-white text-gray-600 hover:border-gray-900 hover:text-gray-900' // Default
      }`}
    >
      <span className="font-medium text-sm tracking-wide">{label}</span>
      <input id={id} type="checkbox" className="hidden" checked={isSelected} onChange={onChange} />
    </label>
);

export default function StepTwo() {
  const [storeName, setStoreName] = useState('your business');
  const [selectedWords, setSelectedWords] = useState({});
  const [activeVibe, setActiveVibe] = useState('modern');

  const businessVibes = [
    { id: 'handcrafted', label: 'Handmade' },
    { id: 'elegant', label: 'Trendy' },
    { id: 'cozy', label: 'Friendly' },
    { id: 'playful', label: 'Fun' },

    { id: 'modern', label: 'Stylish' },
    { id: 'trusted', label: 'Reliable' },
    { id: 'natural', label: 'Eco-Friendly' },

    { id: 'minimal', label: 'Clean' },
    { id: 'vintage', label: 'Modern' },
    { id: 'luxury', label: 'Premium' },
    { id: 'fast', label: 'Quick' },
  ];

  useEffect(() => {
    const storedStoreName = localStorage.getItem('storeName');
    if (storedStoreName) {
      setStoreName(storedStoreName);
    }
  }, []);

  const handleChipChange = (id) => {
    setActiveVibe(id);
    setSelectedWords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const hasSelection = Object.values(selectedWords).some(Boolean);

  const handleContinue = () => {
     localStorage.setItem('businessVibes', JSON.stringify(selectedWords));
  };

  return (
    <div className="flex h-screen font-sans overflow-hidden bg-white">
      {/* --- LEFT SIDE (Form) --- */}
      <div className="w-full lg:w-[45%] flex flex-col justify-between p-16 xl:p-20 bg-white z-30 relative shadow-[20px_0_40px_-10px_rgba(0,0,0,0.03)]">
        <div className="absolute top-10 left-10 text-3xl font-bold text-gray-900 not-italic tracking-tight">
            BizVistaar
        </div>

        <div className="flex flex-col justify-center h-full max-w-md ml-2">
            <p className="text-xs font-bold text-gray-400 mb-6 tracking-widest uppercase">
              STEP 2 OF 3
            </p>
            <h2 className="text-3xl font-bold text-gray-900 mb-6 leading-snug not-italic">
              Which words best describe <span className="text-gray-500">{storeName}?</span>
            </h2>
            <p className="text-gray-400 text-sm mb-12">
              Select a few to help us understand your brand's personality.
            </p>

            <div className="flex flex-wrap gap-3 mb-8">
                {businessVibes.map(vibe => (
                    <ChoiceChip
                        key={vibe.id}
                        id={vibe.id}
                        label={vibe.label}
                        isSelected={!!selectedWords[vibe.id]}
                        onChange={() => handleChipChange(vibe.id)}
                    />
                ))}
            </div>
        </div>

        <div className="flex items-center justify-between w-full">
            <Link href="/get-started/1">
                <button className="text-gray-600 hover:text-gray-900 font-medium text-m flex items-center gap-1 transition-colors">
                ← Back
                </button>
            </Link>

            <Link href="/get-started/3" passHref className={!hasSelection ? "pointer-events-none" : ""}>
                <button
                    onClick={handleContinue}
                    disabled={!hasSelection}
                    className="px-6 py-2.5 bg-gray-900 text-white font-medium text-sm rounded-full hover:bg-gray-700 disabled:bg-gray-300 disabled:text-gray-500 transition-colors shadow-sm"
                >
                    Continue 
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
             <MockBrowser 
                storeName={storeName}
                selectedVibes={selectedWords}
                activeVibe={activeVibe}
                className="absolute top-[10%] left-[35%] w-[100%] h-[100%] z-20"
             />
        </div>
      </div>
    </div>
  );
}