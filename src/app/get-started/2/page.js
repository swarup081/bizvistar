'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { GridBackgroundDemo } from "@/components/GridBackgroundDemo";
import { motion } from 'framer-motion';

// --- 1. Brand Grid Component ---
const BrandGrid = ({ storeName, activeVibe }) => {
  
  // Define styles for every vibe
 const stylesMap = {
    default: {
      font: 'var(--font-inter)',
      colors: ['#F3F4F6', '#9CA3AF', '#374151'],
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=300&q=80',
    },
    elegant: {
      font: 'var(--font-montserrat)',
      colors: ['#F8F8F8', '#C6B48E', '#AFAFAF'],
      image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=300&q=80',
    },
    cozy: {
      font: 'var(--font-lora)',
      colors: ['#FFF4EC', '#D9A878', '#B06C3B'],
      image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=300&q=80',
    },
    modern: {
      font: 'var(--font-inter)',
      colors: ['#FFFFFF', '#D9D9D9', '#6292EB'],
      image: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=300&q=80',
    },
    trusted: {
      font: 'var(--font-roboto)',
      colors: ['#F2FAFF', '#82B7D9', '#5A8BAF'],
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=300&q=80',
    },
    minimal: {
      font: 'var(--font-poppins)',
      colors: ['#FAFAFA', '#D1D1D1', '#8C8C8C'],
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=300&q=80',
    },
    bold: {
      font: 'var(--font-dm-sans)',
      colors: ['#EDEDED', '#B79CE8', '#D8C2F3'],
      image: 'https://images.unsplash.com/photo-1550614000-4b9519e029b9?auto=format&fit=crop&w=300&q=80',
    },
    vintage: {
      font: 'var(--font-playfair-display)',
      colors: ['#FDF8F3', '#D2B48C', '#A47C48'],
      image: 'https://images.unsplash.com/photo-1524234599372-a5bd0194758d?auto=format&fit=crop&w=300&q=80',
    },
    playful: {
      font: 'var(--font-kalam)',
      colors: ['#FFF6FA', '#F2A3C6', '#F8C8DD'],
      image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=300&q=80',
    },
    natural: {
      font: 'var(--font-lato)',
      colors: ['#F3FBF5', '#A9D7B4', '#7CB88D'],
      image: 'https://images.unsplash.com/photo-1470058869958-2a77ade41c02?auto=format&fit=crop&w=300&q=80',
    },
    handcrafted: {
      font: 'var(--font-playfair-display)',
      colors: ['#F7F2EB', '#C9A58E', '#8A6B54'],
      image: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=300&q=80',
    },
    luxury: {
      font: 'var(--font-cormorant-garamond)',
      colors: ['#F7F7F7', '#D8C27A', '#A8A8A8'],
      image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=300&q=80',
    },
    fast: {
      font: 'var(--font-roboto)',
      colors: ['#F6FAFF', '#F28A8A', '#8DA5D9'],
      image: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=300&q=80',
    }
  };

  const currentStyle = stylesMap[activeVibe] || stylesMap.default;
  
  // 3. Overflow Protection Logic
  // If name is empty or too long (>8 chars), display "Brand" instead
  const displayName = (!storeName || storeName.length > 4) ?  storeName.charAt(0).toUpperCase() : storeName;

  return (
    <motion.div 
      key={activeVibe} // Triggers animation on vibe change
      initial={{ opacity: 0.8, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-white p-4 rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] border border-slate-100 w-[260px]"
    >
      <div className="grid grid-cols-2 gap-3">
        
        {/* 1. Logo Cell */}
        <div className="aspect-square rounded-xl border border-stone-100 flex items-center justify-center p-2 overflow-hidden bg-white relative group">
          <span 
            style={{ fontFamily: currentStyle.font }}
            className="text-4xl font-extrabold text-center leading-tight break-words w-full"
          >
             {displayName}
          </span>
        </div>

        {/* 2. Color Palette Cell */}
        <div className="aspect-square rounded-xl border border-stone-100 overflow-hidden flex shadow-inner">
            <div className="h-full w-1/2" style={{ backgroundColor: currentStyle.colors[0] }}></div>
            <div className="h-full w-1/2 flex flex-col">
                <div className="h-1/2 w-full" style={{ backgroundColor: currentStyle.colors[1] }}></div>
                <div className="h-1/2 w-full" style={{ backgroundColor: currentStyle.colors[2] }}></div>
            </div>
        </div>

        {/* 3. Image Cell */}
        <div className="aspect-square rounded-xl border border-stone-100 overflow-hidden relative">
             <img 
                src={currentStyle.image} 
                alt="Brand Vibe" 
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
             />
        </div>

        {/* 4. Typography Cell */}
        <div className="aspect-square rounded-xl border border-stone-100 flex items-center justify-center bg-gray-50">
            <span 
                style={{ fontFamily: currentStyle.font, color: currentStyle.colors[2] }}
                className="text-6xl"
            >
                Aa
            </span>
        </div>

      </div>
    </motion.div>
  );
};

// --- 2. Template Skeleton (Visual) ---
const TemplateSkeleton = ({ storeName }) => {
    return (
        <div className="w-full h-full flex flex-col bg-white overflow-hidden rounded-tl-[2rem]">
            {/* Navbar */}
            <div className="h-20 border-b border-slate-100 flex items-center justify-between px-8 shrink-0 bg-white/60 backdrop-blur-sm">
                <div className="flex gap-4 items-center">
                    <div className="h-10 w-10 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 font-bold text-sm">
                        {storeName ? storeName.charAt(0).toUpperCase() : 'B'}
                    </div>
                    <div className="hidden md:flex gap-3 items-center">
                        {storeName ? (
                            <span className="text-3xl font-extrabold text-slate-500 tracking-wide">
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
                    <div className="h-10 w-24 bg-slate-100 rounded-full"></div>
                </div>
            </div>

            <div className="flex-grow p-8 flex flex-col gap-8 overflow-y-auto no-scrollbar bg-slate-50/30">
                {/* Hero Section */}
                <div className="w-full aspect-[2.5/1] bg-white rounded-[2.5rem] border border-slate-100 relative overflow-hidden flex p-10 gap-10 items-center shadow-[0_4px_20px_-8px_rgba(0,0,0,0.05)]">
                    <div className="w-1/2 h-full bg-slate-50 rounded-[1.5rem] border border-slate-100 relative overflow-hidden">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-blue-100/50 rounded-full mix-blend-multiply filter blur-2xl opacity-60"></div>
                        <div className="absolute top-0 right-0 w-24 h-24 bg-purple-100/50 rounded-full mix-blend-multiply filter blur-2xl opacity-60"></div>
                    </div>
                    <div className="w-1/2 space-y-5 z-10">
                        <div className="h-4 w-20 bg-blue-50 rounded-full text-xs flex items-center justify-center text-blue-200 font-bold uppercase tracking-wider"></div>
                        <div className="space-y-3">
                            <div className="h-6 w-full bg-slate-200/60 rounded-2xl"></div>
                            <div className="h-6 w-3/4 bg-slate-200/60 rounded-2xl"></div>
                        </div>
                        <div className="h-12 w-36 bg-slate-900/5 rounded-full mt-4"></div>
                    </div>
                </div>

                {/* Feature Grid */}
                <div className="grid grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-44 bg-white rounded-[2rem] border border-slate-100 p-8 flex flex-col justify-between shadow-[0_2px_15px_-6px_rgba(0,0,0,0.03)]">
                            <div className="h-12 w-12 bg-slate-50 rounded-2xl border border-slate-100"></div>
                            <div className="space-y-2.5">
                                <div className="h-3 w-1/2 bg-slate-200/80 rounded-full"></div>
                                <div className="h-2 w-full bg-slate-100 rounded-full"></div>
                                <div className="h-2 w-3/4 bg-slate-100 rounded-full"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- 3. Mock Browser Component ---
const MockBrowser = ({ storeName, activeVibe, className }) => {
    const siteSlug = storeName 
        ? storeName.toLowerCase().replace(/[^a-z0-9]/g, '') 
        : 'your-site';

    return (
        <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className={`absolute bg-white rounded-tl-[2.5rem] shadow-[0_20px_80px_-20px_rgba(0,0,0,0.32)] border-l border-t border-gray-200/60 flex flex-col ${className}`}
        >
            {/* --- Brand Grid placed on the left --- */}
            <div className="absolute -left-[150px] top-[320px] z-50">
                 <BrandGrid storeName={storeName} activeVibe={activeVibe} />
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
                <TemplateSkeleton storeName={storeName} />
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
  const [activeVibe, setActiveVibe] = useState('modern'); // Default vibe

  const businessVibes = [
    { id: 'handcrafted', label: 'Handmade' },
    { id: 'bold', label: 'Trendy' },
    { id: 'cozy', label: 'Friendly' },
    { id: 'playful', label: 'Fun' },

    { id: 'modern', label: 'Stylish' },
    { id: 'trusted', label: 'Reliable' },
    { id: 'natural', label: 'Eco-Friendly' },

    { id: 'minimal', label: 'Clean' },
   // { id: 'bold', label: 'Strong' },
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
    // 1. Update the selection list (for saving later)
    setSelectedWords(prev => ({ ...prev, [id]: !prev[id] }));
    
    // 2. Update the active vibe for the visual preview immediately
    // (This fixes the issue where it wasn't updating on click)
    setActiveVibe(id);
  };

  const hasSelection = Object.values(selectedWords).some(Boolean);

  const handleContinue = () => {
     localStorage.setItem('businessVibes', JSON.stringify(selectedWords));
  };

  return (
    <div className="flex h-screen font-sans overflow-hidden bg-white">
      
      {/* --- LEFT SIDE (Form - 45%) --- */}
      <div className="w-full lg:w-[45%] flex flex-col justify-between p-16 xl:p-20 bg-white z-30 relative shadow-[20px_0_40px_-10px_rgba(0,0,0,0.03)]">
        
        {/* Logo */}
        <div className="absolute top-10 left-10 text-3xl font-bold text-gray-900 not-italic tracking-tight">
            BizVistaar
        </div>

        {/* Main Content */}
        <div className="flex flex-col justify-center h-full max-w-md ml-2">
            {/* Step Indicator */}
            <p className="text-xs font-bold text-gray-400 mb-6 tracking-widest uppercase">
              STEP 2 OF 3
            </p>

            {/* Heading */}
            <h2 className="text-3xl font-bold text-gray-900 mb-6 leading-snug not-italic">
              Which words best describe <span className="text-gray-500">{storeName}?</span>
            </h2>
            <p className="text-gray-400 text-sm mb-12">
              Select a few to help us understand your brand's personality.
            </p>

            {/* Clickable Chips Grid */}
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

        {/* Footer / Navigation Area */}
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

      {/* --- RIGHT SIDE (Visuals - 55%) --- */}
      <div className="hidden lg:block lg:w-[55%] bg-gray-50 relative overflow-hidden border-l border-gray-100">
        {/* Background Grid */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
           <GridBackgroundDemo />
        </div>

        {/* Mock Browser */}
        <div className="relative w-full h-full">
             <MockBrowser 
                storeName={storeName}
                activeVibe={activeVibe}
                className="absolute top-[10%] left-[35%] w-[100%] h-[100%] z-20"
             />
        </div>
      </div>
    </div>
  );
}

