'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { GridBackgroundDemo } from "@/components/GridBackgroundDemo";
import { motion } from 'framer-motion';
import { Globe, Sparkles, Palette } from 'lucide-react';

const PencilIcon = ({ className }) => (
    <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
  </svg>
);
  

  const GlobeIcon = ({ className }) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" x2="22" y1="12" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );

  const ThreeBarsIcon = ({ className }) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className={className}
    >
      {/* Three Vertical Bars */}
      <rect x="3" y="3" width="4" height="18" />
      <rect x="10" y="3" width="4" height="18" />
      <rect x="17" y="3" width="4" height="18" />
  
      {/* Mouse Cursor interacting with the first bar */}
    
    </svg>
  );
// --- 1. Enhanced Template Skeleton with Subtle Colors & Rounded Curves ---
const TemplateSkeleton = ({ storeName }) => {
  return (
    <div className="w-full h-full flex flex-col bg-white overflow-hidden rounded-tl-[2rem]">
      {/* Navbar */}
      <div className="h-20 border-b border-slate-100 flex items-center justify-between px-8 shrink-0 bg-white/60 backdrop-blur-sm">
        <div className="flex gap-4 items-center">
            {/* Logo Placeholder */}
            <div className="h-10 w-10 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 font-bold text-sm">
                {storeName ? storeName.charAt(0).toUpperCase() : 'B'}
            </div>
            {/* Nav Links */}
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
        {/* Actions */}
        <div className="flex gap-4">
           <div className="h-10 w-10 bg-slate-100 rounded-full"></div>
           <div className="h-10 w-24 bg-slate-100 rounded-full"></div>
        </div>
      </div>

      <div className="flex-grow p-8 flex flex-col gap-8 overflow-y-auto no-scrollbar bg-slate-50/30">
          {/* Hero Section - SWAPPED LAYOUT (Visual Left, Text Right) */}
          <div className="w-full aspect-[2.5/1] bg-white rounded-[2.5rem] border border-slate-100 relative overflow-hidden flex p-10 gap-10 items-center shadow-[0_4px_20px_-8px_rgba(0,0,0,0.05)]">
             
             {/* Hero Visual (Left) */}
             <div className="w-1/2 h-full bg-slate-50 rounded-[1.5rem] border border-slate-100 relative overflow-hidden">
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-blue-100/50 rounded-full mix-blend-multiply filter blur-2xl opacity-60"></div>
                 <div className="absolute top-0 right-0 w-24 h-24 bg-purple-100/50 rounded-full mix-blend-multiply filter blur-2xl opacity-60"></div>
             </div>

             {/* Hero Text (Right) */}
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

// --- 2. Mock Browser - Positioned & Styled ---
const MockBrowser = ({ storeName, className }) => {
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
            {/* --- Vertical Process Flow (Left Side) --- */}
            <div className="absolute -left-[150px] top-[320px] z-50 flex flex-col items-center w-[280px]">
                
                {/* Card 1: Subdomain */}
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white p-5 rounded-lg shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-slate-200 max-w-[295px] flex flex-col justify-center  min-h-[55px]"
                >
                    <span className="text-sm font-bold text-slate-500 flex items-center gap-2"> <PencilIcon className="w-6 h-6 text-slate-700" />Crafting your brand identity </span>
                </motion.div>

                {/* Connector Line 1 */}
                <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: 24 }}
                    transition={{ delay: 0.6, duration: 0.3 }}
                    className="w-[3px] bg-slate-600"
                ></motion.div>

                {/* Middle Pill: AI Process */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 }}
                    className="bg-white p-4 rounded-lg shadow-[0_6px_24px_rgba(0,0,0,0.05)] border border-slate-200 w-auto flex flex-col justify-center min-h-[55px]"
                >
                                  <span className="text-sm font-bold text-slate-500 flex items-center gap-2"> <GlobeIcon className="w-6 h-6 text-slate-800" />Subdomain</span>
                     </motion.div>

                {/* Connector Line 2 */}
                <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: 24 }}
                    transition={{ delay: 0.8, duration: 0.3 }}
                    className="w-[3px] bg-slate-600"
                ></motion.div>

                {/* Card 3: Brand Identity */}
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="bg-white p-5 rounded-lg shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-slate-200 max-w-[255px] flex flex-col justify-center  min-h-[55px]"
                >
                     <span className="text-sm font-bold text-slate-500 flex items-center gap-2"> <ThreeBarsIcon className="w-6 h-6 text-slate-800" />Infusing your Brand </span>
                </motion.div>

            </div>

            {/* Browser Header */}
            <div className="h-16 border-b border-slate-100 flex items-center px-6 gap-5 shrink-0 z-20 relative rounded-tl-[2.5rem] bg-white">
                {/* Window Controls */}
                <div className="flex gap-2.5">
                    <div className="w-3.5 h-3.5 rounded-full bg-[#FF5F57] border border-black/5"></div>
                    <div className="w-3.5 h-3.5 rounded-full bg-[#FFBD2E] border border-black/5"></div>
                    <div className="w-3.5 h-3.5 rounded-full bg-[#28C840] border border-black/5"></div>
                </div>
                
                {/* URL Bar */}
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
                {/* Subtle overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-slate-50/20 pointer-events-none"></div>
            </div>
        </motion.div>
    );
};

export default function StepTwo() {
  const [storeName, setStoreName] = useState('');
  const [businessType, setBusinessType] = useState('restaurant');

  useEffect(() => {
    const storedBusinessType = localStorage.getItem('businessType');
    if (storedBusinessType) {
      setBusinessType(storedBusinessType);
    }
  }, []);

  const handleContinue = () => {
    localStorage.setItem('storeName', storeName);
  };

  return (
    <div className="flex h-screen font-sans overflow-hidden bg-white">
      
      {/* --- LEFT SIDE (Form - 40%) --- */}
         <div className="w-full lg:w-[45%] flex flex-col justify-between p-16 xl:p-20 bg-white z-30 relative shadow-[20px_0_40px_-10px_rgba(0,0,0,0.03)]">
        
        {/* Logo - Matched to Get Started Page */}
        <div className="absolute top-10 left-10 text-3xl font-bold text-gray-900 not-italic tracking-tight">
            BizVistaar
        </div>

        {/* Main Content */}
        <div className="flex flex-col justify-center h-full max-w-md ml-2">
            {/* Step Indicator */}
            <p className="text-xs font-bold text-gray-400 mb-6 tracking-widest uppercase">
              Step 1 of 3
            </p>

            {/* Heading - Matched to Get Started Page */}
            <h2 className="text-3xl font-bold text-gray-900 mb-6 leading-snug not-italic">
              What is the name of your <span className="text-gray-500">{businessType.toLowerCase()} ?</span>
            </h2>

            {/* Styled Input */}
            <div className="relative group mb-16">
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder={`e.g ${businessType} Name`}
                  className="w-full bg-transparent border-0 border-b-2 border-gray-300 py-3 text-xl text-gray-900 placeholder:text-gray-400 focus:ring-0 focus:border-black transition-colors duration-300 outline-none font-medium"
                  autoFocus
                />
            </div>
            <p className="text-gray-400 text-sm mb-12">
              Don't worry, you can always change this later.
            </p>
        </div>

        {/* Footer / Navigation Area */}
        <div className="flex items-center justify-between w-full">
            <Link href="/get-started">
                <button className="text-gray-600 hover:text-gray-900 font-medium text-m flex items-center gap-1 transition-colors">
                ← Back
                </button>
            </Link>

            <Link href="/get-started/2" passHref className={!storeName.trim() ? "pointer-events-none" : ""}>
                <button
                    onClick={handleContinue}
                    disabled={!storeName.trim()}
                    // Matched button style from previous page
                    className="px-6 py-2.5 bg-gray-900 text-white font-medium text-sm rounded-full hover:bg-gray-700 disabled:bg-gray-300 disabled:text-gray-500 transition-colors shadow-sm"
                >
                    Continue 
                </button>
            </Link>
        </div>
      </div>
      {/* --- RIGHT SIDE (Visuals - 60%) --- */}
      <div className="hidden lg:block lg:w-[55%] bg-gray-50 relative overflow-hidden border-l border-gray-100">
        {/* Background Grid */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
           <GridBackgroundDemo />
        </div>

        {/* Mock Browser */}
        <div className="relative w-full h-full">
             <MockBrowser 
                storeName={storeName}
                // Positioned to bleed off right/bottom edges significantly
                // Starts 15% from left edge of panel, 20% from top edge
                // Height/Width > 100% ensures cutoff
                className="absolute top-[10%] left-[35%] w-[100%] h-[100%] z-20"
             />
        </div>
      </div>
    </div>
  );
}