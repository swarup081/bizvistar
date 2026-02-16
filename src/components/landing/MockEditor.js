'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  LayoutDashboard,
  Paintbrush,
  Settings,
  Menu,
  ShoppingBag,
  Search,
  Check,
  Globe,
  Smartphone,
  MousePointer2,
  ChevronDown
} from 'lucide-react';

const Cursor = ({ x, y, isClicking }) => (
  <motion.div
    className="absolute z-50 pointer-events-none drop-shadow-xl"
    animate={{ x, y, scale: isClicking ? 0.8 : 1 }}
    transition={{
      type: "spring",
      stiffness: 150,
      damping: 15,
      scale: { duration: 0.1 }
    }}
  >
    <MousePointer2
      className="text-black fill-black w-6 h-6"
      strokeWidth={1}
    />
  </motion.div>
);

export default function MockEditor() {
  const [heroTitle, setHeroTitle] = useState('Handcrafted Candles');
  const [isHovered, setIsHovered] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 50, y: 300 });
  const [isClicking, setIsClicking] = useState(false);
  const [activeTab, setActiveTab] = useState('website');
  const [isPublished, setIsPublished] = useState(false);

  const containerRef = useRef(null);

  // Animation Loop
  useEffect(() => {
    if (isHovered) return;

    let timeoutId;
    const wait = (ms) => new Promise(resolve => timeoutId = setTimeout(resolve, ms));

    const runAnimation = async () => {
      // Reset state
      setHeroTitle('Handcrafted Candles');
      setIsPublished(false);
      setCursorPos({ x: 300, y: 300 }); // Idle position

      if (isHovered) return;

      // 1. Move to Sidebar Input (Title)
      await wait(1000);
      if (isHovered) return;
      setCursorPos({ x: 120, y: 160 });

      // 2. Click Input
      await wait(800);
      if (isHovered) return;
      setIsClicking(true);
      await wait(150);
      setIsClicking(false);

      // 3. Type "Premium Soy Wax"
      await wait(500);
      const targetText = "Premium Soy Wax";
      for (let i = 0; i <= targetText.length; i++) {
        if (isHovered) break;
        setHeroTitle(targetText.slice(0, i));
        await wait(50 + Math.random() * 50);
      }

      // 4. Move to "Publish" button (Top Right)
      await wait(800);
      if (isHovered) return;
      setCursorPos({ x: 750, y: 40 });

      // 5. Click Publish
      await wait(800);
      if (isHovered) return;
      setIsClicking(true);

      // Trigger Confetti & Success State
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        disableForReducedMotion: true
      });
      setIsPublished(true);

      await wait(150);
      setIsClicking(false);

      // 6. Wait in "Published" state
      await wait(4000);

      // 7. Reset Loop
      if (!isHovered) runAnimation();
    };

    runAnimation();
    return () => clearTimeout(timeoutId);
  }, [isHovered]);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-5xl mx-auto h-[500px] md:h-[600px] bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col font-sans"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* --- Top Navigation (Mock) --- */}
      <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-20">
        <div className="flex items-center gap-4">
           <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold">B</div>
           <div className="h-4 w-px bg-gray-300"></div>
           <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
              <span>Home</span> <ChevronDown size={14} />
           </div>
        </div>

        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg border border-gray-200">
            <div className="p-1.5 bg-white shadow-sm rounded border border-gray-200 text-gray-800"><Globe size={14}/></div>
            <div className="p-1.5 text-gray-400"><Smartphone size={14}/></div>
        </div>

        <div className="flex items-center gap-3">
           <button className="text-sm font-semibold text-gray-500 hover:text-gray-900">Preview</button>
           <button className="bg-purple-600 text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-purple-700 transition-colors">
              Publish
           </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Cursor Layer */}
        <AnimatePresence>
          {!isHovered && <Cursor x={cursorPos.x} y={cursorPos.y} isClicking={isClicking} />}
        </AnimatePresence>

        {/* Success Overlay */}
        <AnimatePresence>
          {isPublished && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-center justify-center"
            >
              <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-sm mx-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                  <Check size={32} strokeWidth={3} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Your site is live!</h3>
                <p className="text-gray-600 mb-6">Congratulations! Your changes have been published successfully.</p>
                <div className="flex justify-center gap-3">
                   <button className="px-5 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-lg">View Site</button>
                   <button className="px-5 py-2.5 bg-purple-600 text-white font-semibold rounded-lg">Share</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- Sidebar (Editor Controls) --- */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0 z-10">
           {/* Sidebar Tabs */}
           <div className="flex border-b border-gray-100">
              <button onClick={() => setActiveTab('website')} className={`flex-1 py-3 flex justify-center border-b-2 ${activeTab === 'website' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-400'}`}><LayoutDashboard size={18}/></button>
              <button onClick={() => setActiveTab('theme')} className={`flex-1 py-3 flex justify-center border-b-2 ${activeTab === 'theme' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-400'}`}><Paintbrush size={18}/></button>
              <button onClick={() => setActiveTab('settings')} className={`flex-1 py-3 flex justify-center border-b-2 ${activeTab === 'settings' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-400'}`}><Settings size={18}/></button>
           </div>

           <div className="p-4 space-y-6 overflow-y-auto">
              <div>
                 <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">Hero Section</h3>
                 <div className="space-y-3">
                    <div>
                       <label className="text-xs font-medium text-gray-700 block mb-1">Headline</label>
                       <input
                         type="text"
                         value={heroTitle}
                         onChange={(e) => setHeroTitle(e.target.value)}
                         className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 outline-none"
                       />
                    </div>
                    <div>
                       <label className="text-xs font-medium text-gray-700 block mb-1">Button Text</label>
                       <input type="text" defaultValue="Shop Collection" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 outline-none" />
                    </div>
                 </div>
              </div>

              <div>
                 <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">Navigation</h3>
                 <div className="space-y-2">
                    <div className="p-2 border border-gray-200 rounded flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:bg-gray-50">
                       <Menu size={14}/> Main Menu
                    </div>
                    <div className="p-2 border border-gray-200 rounded flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:bg-gray-50">
                       <ShoppingBag size={14}/> Cart Settings
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* --- Preview Area (Canvas) --- */}
        <div className="flex-1 bg-gray-100 p-4 md:p-8 flex justify-center overflow-hidden relative">

           {/* Mock "Flara" Template Preview */}
           <div className="w-full max-w-[1024px] bg-white shadow-xl rounded-lg overflow-hidden flex flex-col origin-top transform scale-[0.8] md:scale-[0.9] lg:scale-100 transition-transform theme-candlea-beige">

              {/* Header */}
              <header className="h-20 px-8 flex items-center justify-between border-b border-brand-primary/20 bg-brand-bg sticky top-0 z-10">
                 <div className="text-xl font-bold font-serif text-brand-text tracking-wide">L U M I E R E</div>
                 <nav className="hidden md:flex gap-8 text-sm font-medium text-brand-text/80">
                    <span>Home</span>
                    <span>Shop</span>
                    <span>About</span>
                    <span>Contact</span>
                 </nav>
                 <div className="flex items-center gap-4 text-brand-text">
                    <Search size={18} />
                    <ShoppingBag size={18} />
                 </div>
              </header>

              {/* Hero Section */}
              <div className="relative bg-brand-bg flex-1">
                 <div className="grid md:grid-cols-2 h-[500px]">
                    <div className="flex flex-col justify-center px-12 md:px-16 items-start gap-6">
                       <span className="text-xs font-bold tracking-[0.2em] text-brand-secondary uppercase">New Arrival</span>
                       <h1 className="text-5xl md:text-6xl font-bold font-serif text-brand-text leading-[1.1]">
                          {heroTitle}
                       </h1>
                       <p className="text-brand-text/70 max-w-sm leading-relaxed">
                          Discover our new collection of soy wax candles, hand-poured with natural essential oils for a calming ambiance.
                       </p>
                       <button className="mt-4 px-8 py-3 bg-brand-secondary text-brand-bg text-sm font-bold tracking-widest uppercase hover:opacity-90 transition-opacity">
                          Shop Collection
                       </button>
                    </div>
                    <div className="relative h-full bg-brand-primary/30">
                       <div className="absolute inset-0 bg-gradient-to-tr from-brand-bg to-transparent z-10"></div>
                       {/* Placeholder for Candle Image - Using a soft gradient/shape */}
                       <div className="w-full h-full flex items-center justify-center">
                          <div className="w-64 h-80 bg-[#E8DCC4] rounded-t-full shadow-2xl relative overflow-hidden">
                             <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10"></div>
                             {/* Mock Candle Jar */}
                             <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-56 bg-white/90 backdrop-blur-sm rounded-t-lg border border-white/50 flex items-center justify-center">
                                <div className="text-center">
                                   <div className="text-xs font-serif text-gray-800 tracking-widest mb-1">LUMIERE</div>
                                   <div className="w-8 h-px bg-gray-400 mx-auto"></div>
                                   <div className="text-[10px] text-gray-500 mt-1 uppercase">Scented Candle</div>
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

           </div>
        </div>
      </div>
    </div>
  );
}
