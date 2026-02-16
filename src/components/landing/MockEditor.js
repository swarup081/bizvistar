'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  LayoutDashboard,
  Paintbrush,
  Settings,
  Search,
  Check,
  Menu,
  ShoppingBag,
  Globe,
  Smartphone,
  MousePointer2
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
  const [businessName, setBusinessName] = useState('My Business');
  const [isHovered, setIsHovered] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 50, y: 50 });
  const [isClicking, setIsClicking] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [activeTab, setActiveTab] = useState('website');

  // Refs for elements to target
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const publishBtnRef = useRef(null);

  // Animation Loop
  useEffect(() => {
    if (isHovered) return;

    let timeoutId;

    const runAnimation = async () => {
      // Helper delay
      const wait = (ms) => new Promise(resolve => timeoutId = setTimeout(resolve, ms));

      // Reset State
      setBusinessName('My Business');
      setIsPublished(false);
      setCursorPos({ x: 50, y: 300 }); // Start position (approx middle left)

      if (isHovered) return;

      // 1. Move to Input
      // We need approximate coordinates relative to container.
      // Assuming container is 800x600 or responsive.
      // We'll use % or fixed pixels based on the layout structure defined below.
      // Sidebar width is roughly 250px. Input is inside sidebar.
      await wait(1000);
      if (isHovered) return;
      setCursorPos({ x: 120, y: 180 }); // Approx input location

      // 2. Click Input
      await wait(800);
      if (isHovered) return;
      setIsClicking(true);
      await wait(150);
      setIsClicking(false);

      // 3. Type "My Awesome Shop"
      await wait(500);
      const targetText = "My Awesome Shop";
      for (let i = 0; i <= targetText.length; i++) {
        if (isHovered) break;
        setBusinessName(targetText.slice(0, i));
        await wait(50 + Math.random() * 50); // Typing speed variance
      }

      // 4. Move to Publish Button (Top Right)
      await wait(800);
      if (isHovered) return;
      // Container width is variable, so we might need to target an element or use high % x
      // For now, let's assume a standard desktop width mock or use logic relative to container width
      // If container is 100%, top right is ~90%, 40px
      setCursorPos({ x: 750, y: 40 });

      // 5. Click Publish
      await wait(800);
      if (isHovered) return;
      setIsClicking(true);
      await wait(150);
      setIsClicking(false);
      setIsPublished(true);

      // Confetti
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          // We can scope confetti to canvas if needed, but default is fine
        });
      }

      // 6. Wait and Loop
      await wait(3000);
      if (!isHovered) {
         runAnimation();
      }
    };

    runAnimation();

    return () => clearTimeout(timeoutId);
  }, [isHovered]);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-5xl mx-auto h-[500px] md:h-[600px] bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* --- Simulated Browser Bar --- */}
      <div className="h-10 bg-gray-50 border-b border-gray-200 flex items-center px-4 gap-2">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
          <div className="w-3 h-3 rounded-full bg-green-400"></div>
        </div>
        <div className="flex-1 mx-4 bg-white border border-gray-200 h-6 rounded text-xs flex items-center justify-center text-gray-400 font-mono">
          bizvistar.com/editor/new-shop
        </div>
      </div>

      {/* --- Main Editor Area --- */}
      <div className="flex flex-1 overflow-hidden relative">

        {/* --- Animated Cursor (Only show when NOT hovered) --- */}
        <AnimatePresence>
          {!isHovered && (
             <Cursor x={cursorPos.x} y={cursorPos.y} isClicking={isClicking} />
          )}
        </AnimatePresence>

        {/* --- Sidebar --- */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0 z-10">
           {/* Sidebar Tabs */}
           <div className="flex border-b border-gray-100">
              <button
                className={`flex-1 py-3 flex justify-center ${activeTab === 'website' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-400'}`}
                onClick={() => setActiveTab('website')}
              >
                 <LayoutDashboard size={20} />
              </button>
              <button
                className={`flex-1 py-3 flex justify-center ${activeTab === 'theme' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-400'}`}
                onClick={() => setActiveTab('theme')}
              >
                 <Paintbrush size={20} />
              </button>
              <button
                className={`flex-1 py-3 flex justify-center ${activeTab === 'settings' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-400'}`}
                onClick={() => setActiveTab('settings')}
              >
                 <Settings size={20} />
              </button>
           </div>

           {/* Sidebar Content */}
           <div className="p-4 space-y-6">
              <div>
                 <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Global Settings</h3>
                 <div className="space-y-3">
                    <div>
                       <label className="block text-xs font-medium text-gray-700 mb-1">Business Name</label>
                       <input
                         ref={inputRef}
                         type="text"
                         value={businessName}
                         onChange={(e) => setBusinessName(e.target.value)}
                         className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                         placeholder="Enter business name"
                       />
                    </div>
                    <div>
                       <label className="block text-xs font-medium text-gray-700 mb-1">Logo Text</label>
                       <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-50 text-gray-500 truncate">
                         {businessName || 'Your Logo'}
                       </div>
                    </div>
                 </div>
              </div>

              <div>
                 <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Sections</h3>
                 <div className="space-y-2">
                    <div className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 text-sm text-gray-600 cursor-pointer">
                       <ShoppingBag size={16} /> Products
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 text-sm text-gray-600 cursor-pointer">
                       <Menu size={16} /> Navigation
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* --- Preview Area --- */}
        <div className="flex-1 bg-gray-100 p-4 md:p-8 flex justify-center overflow-hidden relative">

           {/* Top Bar inside Preview */}
           <div className="absolute top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-20">
              <div className="flex items-center gap-4">
                 <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg border border-gray-200">
                    <div className="p-1.5 bg-white shadow-sm rounded border border-gray-200"><Globe size={14}/></div>
                    <div className="p-1.5 text-gray-400"><Smartphone size={14}/></div>
                 </div>
              </div>
              <div className="flex items-center gap-3">
                 <div className="text-sm text-gray-500 hidden sm:block">Last saved just now</div>
                 <button
                   ref={publishBtnRef}
                   className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all transform active:scale-95 ${isPublished ? 'bg-green-500 text-white' : 'bg-purple-600 text-white hover:bg-purple-700'}`}
                   onClick={() => {
                      setIsPublished(true);
                      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
                      setTimeout(() => setIsPublished(false), 2000);
                   }}
                 >
                    {isPublished ? (
                      <span className="flex items-center gap-1"><Check size={16}/> Live</span>
                    ) : (
                      "Publish"
                    )}
                 </button>
              </div>
           </div>

           {/* The "Website" Preview */}
           <div className="w-full max-w-2xl bg-white shadow-xl mt-16 rounded-t-lg overflow-hidden flex flex-col border border-gray-200/60 origin-top transform scale-[0.9] md:scale-100 transition-transform">
              {/* Fake Website Header */}
              <header className="h-20 border-b border-gray-100 flex items-center justify-between px-8 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
                 <h1 className="text-2xl font-bold text-gray-900 tracking-tight transition-all duration-300">
                    {businessName || 'Business Name'}
                 </h1>
                 <nav className="hidden sm:flex gap-6 text-sm font-medium text-gray-600">
                    <span>Home</span>
                    <span>Shop</span>
                    <span>About</span>
                    <span>Contact</span>
                 </nav>
              </header>

              {/* Fake Hero Section */}
              <div className="flex-1 bg-gradient-to-br from-purple-50 via-white to-pink-50 p-12 flex items-center justify-center text-center relative overflow-hidden">
                 {/* Decorative blobs */}
                 <div className="absolute top-10 left-10 w-32 h-32 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                 <div className="absolute top-10 right-10 w-32 h-32 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>

                 <div className="relative z-10 max-w-lg">
                    <span className="inline-block py-1 px-3 rounded-full bg-purple-100 text-purple-700 text-xs font-bold uppercase tracking-wider mb-4">
                       New Collection
                    </span>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
                       Discover Unique Handcrafted Items
                    </h2>
                    <p className="text-lg text-gray-600 mb-8">
                       Shop our latest arrivals and find something special for yourself or a loved one.
                    </p>
                    <button className="px-8 py-3 bg-gray-900 text-white font-semibold rounded-full hover:bg-gray-800 transition-transform hover:-translate-y-1 shadow-lg">
                       Shop Now
                    </button>
                 </div>
              </div>

              {/* Fake Products Grid (Partial) */}
              <div className="p-8 grid grid-cols-2 gap-6 bg-white">
                 <div className="aspect-[4/5] bg-gray-100 rounded-lg animate-pulse"></div>
                 <div className="aspect-[4/5] bg-gray-100 rounded-lg animate-pulse"></div>
              </div>
           </div>

        </div>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {isPublished && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 z-50"
          >
             <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
             <span className="font-medium">Your site is now live!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
