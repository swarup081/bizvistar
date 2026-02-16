'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  LayoutDashboard,
  Paintbrush,
  Settings,
  ChevronDown,
  Monitor,
  Smartphone,
  MousePointer2,
  Check,
  Search,
  ShoppingBag,
  Menu,
  Image as ImageIcon,
  Info,
  RotateCcw,
  User,
  LogOut,
  HelpCircle,
  ExternalLink,
  Plus
} from 'lucide-react';
import Image from 'next/image';

// --- Icons & Helpers from Original Code ---

const Logo = ({ className }) => (
  <div className={`font-bold text-gray-900 tracking-tight flex items-center gap-1 ${className}`}>
    <div className="w-8 h-8 bg-[#8A63D2] rounded-lg flex items-center justify-center text-white font-bold text-xl">B</div>
    <span>BizVistar</span>
  </div>
);

const VerticalSeparator = () => (
  <div className="w-px h-[24px] bg-gray-300 mx-2"></div>
);

const MainTab = ({ icon: Icon, label, isActive }) => (
  <button
    className={`flex flex-col items-center gap-1 w-full py-4 px-2 font-medium transition-colors ${
      isActive
        ? 'border-b-2 border-[#8A63D2] text-[#8A63D2]'
        : 'text-gray-500 hover:text-gray-900'
    }`}
  >
    <Icon size={22} />
    <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
  </button>
);

const AccordionItem = ({ title, icon: Icon, isOpen, children }) => (
  <div className="border-b border-gray-200 bg-white">
    <div className="w-full flex items-center justify-between p-4 text-left text-gray-800 hover:bg-gray-50 transition-colors cursor-pointer">
      <div className="flex items-center gap-3">
        <Icon size={18} className="text-gray-500" />
        <span className="font-medium text-sm">{title}</span>
      </div>
      <ChevronDown
        size={18}
        className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
      />
    </div>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden"
        >
          <div className="p-4 bg-[#8A63D2]/5 border-t border-gray-100">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const EditorInput = ({ label, value, onChange, isFocused, readOnly }) => (
  <div className="mb-4">
    <label className="block text-xs font-medium text-gray-700 mb-1.5 uppercase tracking-wide">
      {label}
    </label>
    <div className={`relative transition-all duration-200 ${isFocused ? 'ring-2 ring-[#8A63D2] rounded-md' : ''}`}>
      <input
        type="text"
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8A63D2] focus:border-transparent bg-white shadow-sm ${readOnly ? 'cursor-default' : ''}`}
      />
      {isFocused && (
        <motion.div
          layoutId="cursor-caret"
          className="absolute right-3 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#8A63D2]"
          animate={{ opacity: [1, 0] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
        />
      )}
    </div>
  </div>
);

const EditorTextArea = ({ label, value }) => (
  <div className="mb-4">
    <label className="block text-xs font-medium text-gray-700 mb-1.5 uppercase tracking-wide">
      {label}
    </label>
    <textarea
      value={value}
      readOnly
      rows={3}
      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none resize-none bg-white shadow-sm text-gray-500"
    />
  </div>
);

// --- The Main Component ---

export default function LandingEditorDemo() {
  const [heroTitle, setHeroTitle] = useState('Handcrafted Candles');
  const [cursorPos, setCursorPos] = useState({ x: '50%', y: '50%' }); // Percentage based for responsiveness
  const [isClicking, setIsClicking] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [activeTab, setActiveTab] = useState('website'); // Default tab
  const [isPublished, setIsPublished] = useState(false);
  const [sidebarScroll, setSidebarScroll] = useState(0);

  // Refs for element positions
  const containerRef = useRef(null);

  // Animation Sequence
  useEffect(() => {
    if (isHovered) return;

    let timeoutId;
    const wait = (ms) => new Promise(resolve => timeoutId = setTimeout(resolve, ms));

    const runAnimation = async () => {
      // Reset
      setHeroTitle('Handcrafted Candles');
      setIsPublished(false);
      setCursorPos({ x: '50%', y: '50%' });

      await wait(1000);
      if (isHovered) return;

      // 1. Move to "Hero Section" Accordion (Assume it's open, move to Input)
      // Input is roughly at: Left 15%, Top 40% (relative to container)
      setCursorPos({ x: '14%', y: '42%' });

      await wait(1000);
      if (isHovered) return;

      // 2. Click Input
      setIsClicking(true);
      await wait(150);
      setIsClicking(false);

      // 3. Type "Premium Soy Wax"
      await wait(500);
      const targetText = "Premium Soy Wax";
      for (let i = 0; i <= targetText.length; i++) {
        if (isHovered) break;
        setHeroTitle(targetText.slice(0, i));
        await wait(50 + Math.random() * 50); // Typing speed variance
      }

      await wait(800);
      if (isHovered) return;

      // 4. Move to Publish Button (Top Right)
      // Button is roughly at: Right 5%, Top 5%
      setCursorPos({ x: '92%', y: '6%' });

      await wait(1000);
      if (isHovered) return;

      // 5. Click Publish
      setIsClicking(true);
      await wait(150);
      setIsClicking(false);

      // Celebration!
      setIsPublished(true);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        zIndex: 9999, // Ensure on top of modal
        disableForReducedMotion: true
      });

      // 6. Wait & Reset
      await wait(4000);
      if (!isHovered) runAnimation();
    };

    runAnimation();
    return () => clearTimeout(timeoutId);
  }, [isHovered]);


  return (
    <div
      className="relative w-full max-w-[1200px] mx-auto h-[600px] md:h-[700px] bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col font-sans select-none"
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Cursor Overlay */}
      <AnimatePresence>
        {!isHovered && (
          <motion.div
            className="absolute z-[100] pointer-events-none drop-shadow-xl"
            animate={{
              left: cursorPos.x,
              top: cursorPos.y,
              scale: isClicking ? 0.8 : 1
            }}
            transition={{
              type: "spring",
              stiffness: 80,
              damping: 15,
              scale: { duration: 0.1 }
            }}
          >
            <MousePointer2
              className="text-black fill-black w-6 h-6 -translate-x-1 -translate-y-1"
              strokeWidth={1}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- HEADER (EditorTopNav) --- */}
      <header className="w-full bg-white shadow-sm z-30 shrink-0">
        {/* Top Bar */}
        <div className="h-[60px] border-b border-gray-200 px-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Logo className="text-xl" />
            <div className="hidden lg:flex items-center gap-2">
               <button className="flex items-center gap-2 text-sm font-medium text-gray-700 px-3 py-2 rounded-md hover:bg-gray-50">Hire a Professional</button>
               <button className="flex items-center gap-2 text-sm font-medium text-gray-700 px-3 py-2 rounded-md hover:bg-gray-50">Help</button>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <button className="flex items-center gap-2 text-sm font-medium text-gray-700 px-3 py-2 rounded-md hover:bg-gray-50">
               <RotateCcw size={16} /> Reset
             </button>
             <div className="w-px h-5 bg-gray-300"></div>
             <div className="hidden lg:flex items-center gap-2 text-sm font-medium text-[#8A63D2] px-3 py-2">
                <Check size={16} /> Saved
             </div>
             <button className="flex items-center gap-2 text-sm font-medium text-purple-600 px-4 py-2 rounded-full hover:bg-purple-50 transition-colors">
                Preview
             </button>
             <motion.button
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 text-white text-sm font-medium px-6 py-2 rounded-full transition-colors shadow-sm ${isPublished ? 'bg-green-600' : 'bg-black hover:bg-gray-800'}`}
             >
                {isPublished ? 'Published!' : 'Publish'}
             </motion.button>
          </div>
        </div>

        {/* Sub Bar */}
        <div className="h-[50px] border-b border-gray-200 px-4 flex items-center justify-between bg-white">
           <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-900 font-medium cursor-pointer px-2 py-1 hover:bg-gray-100 rounded">
                 Page: Home <ChevronDown size={14} className="text-gray-500"/>
              </div>
              <VerticalSeparator />
              <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
                 <div className="p-1.5 bg-white shadow-sm rounded text-[#8A63D2]"><Monitor size={16}/></div>
                 <div className="p-1.5 text-gray-400"><Smartphone size={16}/></div>
              </div>
           </div>

           <div className="flex-grow max-w-xl mx-8 hidden lg:block">
              <div className="bg-gray-50 border border-gray-200 rounded-full px-4 py-1.5 text-xs text-gray-500 flex items-center justify-center gap-2">
                 <span>https://your-site.bizvistaar.com</span>
                 <span className="text-purple-600 font-medium cursor-pointer hover:underline">Connect Domain</span>
              </div>
           </div>

           <div className="flex items-center gap-2 text-gray-400">
              <RotateCcw size={18} className="rotate-180" />
              <RotateCcw size={18} />
           </div>
        </div>
      </header>


      {/* --- BODY --- */}
      <div className="flex flex-1 overflow-hidden relative bg-[#F3F4F6]">

        {/* --- SIDEBAR (EditorSidebar) --- */}
        <aside className="w-80 bg-white border-r border-gray-200 flex flex-col shrink-0 z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
           {/* Tabs */}
           <div className="flex items-center border-b border-gray-200 bg-white">
              <MainTab icon={LayoutDashboard} label="Website" isActive={activeTab === 'website'} />
              <MainTab icon={Paintbrush} label="Theme" isActive={activeTab === 'theme'} />
              <MainTab icon={Settings} label="Settings" isActive={activeTab === 'settings'} />
           </div>

           {/* Content */}
           <div className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="p-0 pb-20">
                 {/* Mock Content for 'Website' Tab */}

                 {/* Global Settings (Closed) */}
                 <AccordionItem title="Global Settings" icon={Info} isOpen={false} />

                 {/* Hero Section (Open) */}
                 <AccordionItem title="Hero Section" icon={ImageIcon} isOpen={true}>
                    <EditorInput
                      label="Title"
                      value={heroTitle}
                      onChange={(e) => setHeroTitle(e.target.value)}
                      readOnly={!isHovered} // Editable only on hover
                      isFocused={heroTitle !== 'Handcrafted Candles' && !isPublished && !isHovered} // Simulated focus state when animating
                    />
                    <EditorTextArea
                      label="Subtitle"
                      value="Discover our new collection of soy wax candles, hand-poured with natural essential oils for a calming ambiance."
                    />
                    <EditorInput label="Button Text" value="Shop Collection" readOnly={!isHovered} />
                 </AccordionItem>

                 {/* Other Sections (Closed) */}
                 <AccordionItem title="About Section" icon={User} isOpen={false} />
                 <AccordionItem title="Products & Categories" icon={ShoppingBag} isOpen={false} />
                 <AccordionItem title="Footer" icon={Menu} isOpen={false} />
              </div>
           </div>
        </aside>

        {/* --- PREVIEW AREA (Flara Template Mock) --- */}
        <main className="flex-1 overflow-hidden relative flex items-center justify-center p-8 bg-[#F3F4F6]">

           {/* The "Iframe" Window */}
           <div className="w-full max-w-[1024px] h-full bg-white shadow-xl rounded-lg overflow-hidden flex flex-col origin-top transition-all duration-500">

              {/* Flara Template Header */}
              <header className="h-20 px-8 flex items-center justify-between border-b border-[#E6D5C3]/30 bg-[#FFFBF7] sticky top-0 z-10 shrink-0">
                 <div className="text-2xl font-bold font-serif text-[#4A4A4A] tracking-wider">L U M I E R E</div>
                 <nav className="hidden md:flex gap-8 text-sm font-medium text-[#4A4A4A]/80 font-sans tracking-wide">
                    <span>Home</span>
                    <span>Shop</span>
                    <span>About</span>
                    <span>Contact</span>
                 </nav>
                 <div className="flex items-center gap-5 text-[#4A4A4A]">
                    <Search size={20} strokeWidth={1.5} />
                    <ShoppingBag size={20} strokeWidth={1.5} />
                 </div>
              </header>

              {/* Flara Template Hero */}
              <div className="relative bg-[#FFFBF7] flex-1 overflow-hidden">
                 <div className="grid md:grid-cols-2 h-full">
                    {/* Left Content */}
                    <div className="flex flex-col justify-center px-12 md:px-16 items-start gap-8 z-10">
                       <span className="text-xs font-bold tracking-[0.25em] text-[#B08968] uppercase pl-1">New Arrival</span>

                       <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-serif text-[#2C2C2C] leading-[1.1] tracking-tight break-words max-w-full">
                          {heroTitle}
                       </h1>

                       <p className="text-[#6B6B6B] text-lg max-w-sm leading-relaxed font-serif italic">
                          Discover our new collection of soy wax candles, hand-poured with natural essential oils.
                       </p>

                       <button className="mt-4 px-10 py-4 bg-[#2C2C2C] text-[#FFFBF7] text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#4A4A4A] transition-colors shadow-lg">
                          Shop Collection
                       </button>
                    </div>

                    {/* Right Image Placeholder */}
                    <div className="relative h-full bg-[#E6D5C3]/20 flex items-center justify-center overflow-hidden">
                       <div className="absolute inset-0 bg-gradient-to-tr from-[#FFFBF7] via-transparent to-transparent z-10"></div>

                       {/* Abstract Shape/Image */}
                       <div className="relative w-[80%] h-[80%]">
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-96 bg-[#D4C3B2] rounded-t-[10rem] shadow-2xl overflow-hidden">
                              {/* Candle Inner */}
                              <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-transparent"></div>
                              <div className="absolute bottom-0 w-full h-1/2 bg-white/30 backdrop-blur-sm border-t border-white/40 flex items-center justify-center flex-col gap-2">
                                  <div className="w-12 h-px bg-[#4A4A4A]/20"></div>
                                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#4A4A4A]/60">Scented Candle</span>
                              </div>
                          </div>
                          {/* Decorative Circle */}
                          <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#B08968]/10 rounded-full blur-2xl"></div>
                       </div>
                    </div>
                 </div>
              </div>

           </div>
        </main>

        {/* Success Modal (Toast) */}
        <AnimatePresence>
          {isPublished && (
            <motion.div
              initial={{ opacity: 0, y: 50, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: 20, x: '-50%' }}
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-50 bg-white pl-4 pr-6 py-4 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-100 flex items-center gap-4 min-w-[320px]"
            >
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0 text-green-600">
                <Check size={20} strokeWidth={3} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">Site Published!</h4>
                <p className="text-gray-500 text-xs mt-0.5">Your site is now live at <span className="text-purple-600 font-medium">bizvistaar.com</span></p>
              </div>
              <button className="ml-auto text-gray-400 hover:text-gray-600">
                <ExternalLink size={16} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
