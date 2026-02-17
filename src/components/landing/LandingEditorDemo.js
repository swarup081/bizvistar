'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Paintbrush,
  ChevronDown,
  Monitor,
  Smartphone,
  MousePointer2,
  Check,
  Search,
  ShoppingBag,
  Image as ImageIcon,
  Info,
  RotateCcw,
  User,
  ExternalLink,
  Type
} from 'lucide-react';

// --- Icons & Helpers ---

const Logo = ({ className }) => (
  <div className={`font-bold text-gray-900 tracking-tight flex items-center gap-2 ${className}`}>
    <div className="w-8 h-8 bg-[#8A63D2] rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-sm">S</div>
    <span className="text-xl">Storify</span>
  </div>
);

const VerticalSeparator = () => (
  <div className="w-px h-[24px] bg-gray-300 mx-2"></div>
);

const MainTab = ({ icon: Icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center gap-1 w-full py-4 px-2 font-medium transition-colors ${
      isActive
        ? 'border-b-2 border-[#8A63D2] text-[#8A63D2]'
        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
    }`}
  >
    <Icon size={20} />
    <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
  </button>
);

const AccordionItem = ({ title, icon: Icon, isOpen, onToggle, children }) => (
  <div className="border-b border-gray-200 bg-white">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between p-4 text-left text-gray-800 hover:bg-gray-50 transition-colors focus:outline-none"
    >
      <div className="flex items-center gap-3">
        <Icon size={18} className="text-gray-500" />
        <span className="font-medium text-sm">{title}</span>
      </div>
      <ChevronDown
        size={16}
        className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
      />
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden"
        >
          <div className="p-4 bg-[#F9FAFB] border-t border-gray-100 space-y-4">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const EditorInput = ({ label, value, onChange, isFocused, readOnly, placeholder }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
      {label}
    </label>
    <div className={`relative transition-all duration-200 ${isFocused ? 'ring-2 ring-[#8A63D2] rounded-md ring-offset-1' : ''}`}>
      <input
        type="text"
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        placeholder={placeholder}
        className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-[#8A63D2] bg-white shadow-sm ${readOnly ? 'cursor-default' : ''}`}
      />
      {isFocused && (
        <motion.div
          layoutId="cursor-caret"
          className="absolute right-3 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-[#8A63D2]"
          animate={{ opacity: [1, 0] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
        />
      )}
    </div>
  </div>
);

const ThemeOption = ({ color, name, isSelected, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 p-2 rounded-lg border transition-all ${isSelected ? 'border-[#8A63D2] bg-[#8A63D2]/5 ring-1 ring-[#8A63D2]' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
  >
    <div className="w-8 h-8 rounded-full border shadow-sm" style={{ background: color }}></div>
    <span className="text-sm font-medium text-gray-700">{name}</span>
    {isSelected && <Check size={16} className="ml-auto text-[#8A63D2]" />}
  </button>
);

// --- The Main Component ---

export default function LandingEditorDemo() {
  // State
  const [heroTitle, setHeroTitle] = useState('Handcrafted Candles');
  const [businessName, setBusinessName] = useState('My Store');
  const [themeColor, setThemeColor] = useState('light'); // 'light', 'dark', 'pastel'
  const [cursorPos, setCursorPos] = useState({ x: '50%', y: '50%' });
  const [isClicking, setIsClicking] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [activeTab, setActiveTab] = useState('website');
  const [isPublished, setIsPublished] = useState(false);

  // Accordion State
  const [globalOpen, setGlobalOpen] = useState(false);
  const [heroOpen, setHeroOpen] = useState(true);

  const containerRef = useRef(null);

  // Animation Sequence
  useEffect(() => {
    if (isHovered) return;

    let timeoutId;
    const wait = (ms) => new Promise(resolve => timeoutId = setTimeout(resolve, ms));

    const runAnimation = async () => {
      // Reset
      setHeroTitle('Handcrafted Candles');
      setBusinessName('My Store');
      setThemeColor('light');
      setIsPublished(false);
      setGlobalOpen(false);
      setHeroOpen(true);
      setActiveTab('website');
      setCursorPos({ x: '50%', y: '50%' });

      await wait(1000);
      if (isHovered) return;

      // 1. Move to "Global Settings" Accordion
      // Right Sidebar, Top area. X ~ 85%, Y ~ 20%
      setCursorPos({ x: '85%', y: '18%' });

      await wait(800);
      if (isHovered) return;

      // 2. Click "Global Settings"
      setIsClicking(true);
      await wait(150);
      setGlobalOpen(true);
      setHeroOpen(false);
      setIsClicking(false);

      await wait(800);
      if (isHovered) return;

      // 3. Move to "Business Name" Input
      setCursorPos({ x: '85%', y: '28%' });

      await wait(800);
      if (isHovered) return;

      // 4. Click Input
      setIsClicking(true);
      await wait(150);
      setIsClicking(false);

      // 5. Type "Storify"
      await wait(500);
      const targetName = "Storify";
      for (let i = 0; i <= targetName.length; i++) {
        if (isHovered) break;
        setBusinessName(targetName.slice(0, i));
        await wait(50 + Math.random() * 50);
      }

      await wait(800);
      if (isHovered) return;

      // 6. Move to "Theme" Tab
      // Top of Right Sidebar. X ~ 87%, Y ~ 12%
      setCursorPos({ x: '87%', y: '12%' });

      await wait(800);
      if (isHovered) return;

      // 7. Click "Theme" Tab
      setIsClicking(true);
      await wait(150);
      setActiveTab('theme');
      setIsClicking(false);

      await wait(1000);
      if (isHovered) return;

      // 8. Move to "Pastel Theme" Option
      // Inside Theme Tab content. X ~ 87%, Y ~ 25%
      setCursorPos({ x: '87%', y: '35%' }); // Slightly lower for second option

      await wait(800);
      if (isHovered) return;

      // 9. Click "Pastel Theme"
      setIsClicking(true);
      await wait(150);
      setThemeColor('pastel');
      setIsClicking(false);

      await wait(1000);
      if (isHovered) return;

      // 10. Move to Publish Button
      // Header Right Top. X ~ 92%, Y ~ 6%
      setCursorPos({ x: '92%', y: '6%' });

      await wait(800);
      if (isHovered) return;

      // 11. Click Publish
      setIsClicking(true);
      await wait(150);
      setIsClicking(false);

      setIsPublished(true);
      // Removed celebration (confetti) logic as requested

      await wait(5000);
      if (!isHovered) runAnimation();
    };

    runAnimation();
    return () => clearTimeout(timeoutId);
  }, [isHovered]);

  // Derived Styles based on Theme
  const getThemeStyles = () => {
    switch(themeColor) {
      case 'dark':
        return { bg: '#1a1a1a', text: '#ffffff', accent: '#3b82f6', secondary: '#333333' };
      case 'pastel':
        return { bg: '#FFFBF7', text: '#4A4A4A', accent: '#D4C3B2', secondary: '#E6D5C3' }; // Flara-ish
      default: // light
        return { bg: '#ffffff', text: '#111827', accent: '#8A63D2', secondary: '#f3f4f6' };
    }
  };
  const styles = getThemeStyles();

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

      {/* --- HEADER --- */}
      <header className="w-full bg-white shadow-sm z-30 shrink-0 relative">
        {/* Top Bar */}
        <div className="h-[60px] border-b border-gray-200 px-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Logo className="text-xl" />
            <div className="hidden lg:flex items-center gap-2">
               <button className="flex items-center gap-2 text-sm font-medium text-gray-600 px-3 py-2 rounded-md hover:bg-gray-50 transition-colors">Hire Expert</button>
               <button className="flex items-center gap-2 text-sm font-medium text-gray-600 px-3 py-2 rounded-md hover:bg-gray-50 transition-colors">Help</button>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <button className="flex items-center gap-2 text-sm font-medium text-gray-600 px-3 py-2 rounded-md hover:bg-gray-50 transition-colors">
               <RotateCcw size={16} /> <span className="hidden sm:inline">Reset</span>
             </button>
             <div className="w-px h-5 bg-gray-300 hidden sm:block"></div>
             <div className="hidden lg:flex items-center gap-2 text-sm font-medium text-[#8A63D2] px-3 py-2">
                <Check size={16} /> Saved
             </div>
             <button className="flex items-center gap-2 text-sm font-medium text-purple-600 px-4 py-2 rounded-full hover:bg-purple-50 transition-colors">
                Preview
             </button>
             <motion.button
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 text-white text-sm font-medium px-6 py-2 rounded-full transition-colors shadow-md hover:shadow-lg ${isPublished ? 'bg-green-600' : 'bg-gray-900 hover:bg-black'}`}
             >
                {isPublished ? 'Published!' : 'Publish'}
             </motion.button>
          </div>
        </div>

        {/* Sub Bar */}
        <div className="h-[50px] border-b border-gray-200 px-4 flex items-center justify-between bg-gray-50/50">
           <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-700 font-medium cursor-pointer px-2 py-1 hover:bg-gray-100 rounded transition-colors">
                 Page: <span className="font-bold text-gray-900">Home</span> <ChevronDown size={14} className="text-gray-400"/>
              </div>
              <VerticalSeparator />
              <div className="flex items-center gap-1 bg-gray-200/50 p-1 rounded-lg">
                 <div className="p-1.5 bg-white shadow-sm rounded text-[#8A63D2]"><Monitor size={16}/></div>
                 <div className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"><Smartphone size={16}/></div>
              </div>
           </div>

           <div className="flex-grow max-w-xl mx-8 hidden lg:block text-center">
              <div className="inline-flex bg-white border border-gray-200 rounded-full px-4 py-1.5 text-xs text-gray-500 items-center justify-center gap-2 shadow-sm">
                 <span>https://{businessName.toLowerCase().replace(/\s+/g, '-') || 'your-site'}.storify.com</span>
                 <span className="text-purple-600 font-medium cursor-pointer hover:underline">Connect Domain</span>
              </div>
           </div>

           <div className="flex items-center gap-2 text-gray-400">
              <button className="p-1.5 hover:bg-gray-100 rounded transition-colors"><RotateCcw size={18} className="rotate-180" /></button>
              <button className="p-1.5 hover:bg-gray-100 rounded transition-colors"><RotateCcw size={18} /></button>
           </div>
        </div>
      </header>


      {/* --- BODY --- */}
      <div className="flex flex-1 overflow-hidden relative bg-[#F3F4F6]">

        {/* --- MAIN PREVIEW (Left Side now) --- */}
        <main className="flex-1 overflow-hidden relative flex items-center justify-center p-4 md:p-8 bg-[#F3F4F6]">

           {/* The "Iframe" Window */}
           <div
             className="w-full h-full bg-white shadow-2xl rounded-lg overflow-hidden flex flex-col origin-top transition-all duration-500 border border-gray-200/50"
             style={{ maxWidth: '100%' }}
           >

              {/* Template Content (Flara Style / Dynamic Theme) */}
              <div className="flex-1 overflow-y-auto custom-scrollbar relative" style={{ backgroundColor: styles.bg, color: styles.text }}>

                 {/* Header */}
                 <header className="h-20 px-8 flex items-center justify-between sticky top-0 z-10 shrink-0 transition-colors duration-300" style={{ borderBottom: `1px solid ${styles.secondary}30`, backgroundColor: styles.bg }}>
                     <div className="text-2xl font-bold font-serif tracking-wider">{businessName}</div>
                     <nav className="hidden md:flex gap-8 text-sm font-medium opacity-80 font-sans tracking-wide">
                        <span>Home</span>
                        <span>Shop</span>
                        <span>About</span>
                        <span>Contact</span>
                     </nav>
                     <div className="flex items-center gap-5 opacity-80">
                        <Search size={20} strokeWidth={1.5} />
                        <ShoppingBag size={20} strokeWidth={1.5} />
                     </div>
                 </header>

                 {/* Hero Section */}
                 <div className="min-h-[500px] flex items-center justify-center px-8 md:px-16 py-12">
                    <div className="grid md:grid-cols-2 gap-12 items-center w-full max-w-6xl">
                        {/* Text */}
                        <div className="flex flex-col items-start gap-6 z-10">
                           <span className="text-xs font-bold tracking-[0.25em] opacity-60 uppercase pl-1">New Collection</span>

                           <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-serif leading-[1.1] tracking-tight break-words max-w-full">
                              {heroTitle}
                           </h1>

                           <p className="text-lg opacity-70 max-w-sm leading-relaxed font-serif italic">
                              Discover our new collection of soy wax candles, hand-poured with natural essential oils.
                           </p>

                           <button
                             className="mt-4 px-10 py-4 text-xs font-bold tracking-[0.2em] uppercase transition-all shadow-lg hover:shadow-xl hover:scale-105"
                             style={{ backgroundColor: styles.text, color: styles.bg }}
                           >
                              Shop Now
                           </button>
                        </div>

                        {/* Image/Graphic */}
                        <div className="relative h-[400px] w-full flex items-center justify-center">
                            <div className="absolute inset-0 rounded-t-[10rem] opacity-20 transform translate-x-4 translate-y-4" style={{ backgroundColor: styles.accent }}></div>
                            <div className="relative w-full h-full rounded-t-[10rem] overflow-hidden shadow-2xl flex items-center justify-center bg-gray-100">
                                {/* Placeholder Content */}
                                <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-transparent"></div>
                                <div className="w-32 h-48 bg-white/20 backdrop-blur-sm border border-white/30 rounded flex flex-col items-center justify-center gap-2">
                                    <div className="w-16 h-16 rounded-full bg-white/40 mb-2"></div>
                                    <div className="w-20 h-2 bg-white/40 rounded"></div>
                                    <div className="w-12 h-2 bg-white/40 rounded"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                 </div>

              </div>

           </div>
        </main>

        {/* --- SIDEBAR (Right Side now) --- */}
        <aside className="w-80 bg-white border-l border-gray-200 flex flex-col shrink-0 z-20 shadow-[-4px_0_24px_rgba(0,0,0,0.02)]">
           {/* Tabs */}
           <div className="flex items-center border-b border-gray-200 bg-white px-2">
              <MainTab icon={LayoutDashboard} label="Website" isActive={activeTab === 'website'} onClick={() => setActiveTab('website')} />
              <MainTab icon={Paintbrush} label="Theme" isActive={activeTab === 'theme'} onClick={() => setActiveTab('theme')} />
           </div>

           {/* Content */}
           <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
              <div className="pb-20">

                 {activeTab === 'website' && (
                   <>
                      {/* Global Settings */}
                      <AccordionItem
                        title="Global Settings"
                        icon={Info}
                        isOpen={globalOpen}
                        onToggle={() => setGlobalOpen(!globalOpen)}
                      >
                         <EditorInput
                           label="Business Name"
                           value={businessName}
                           onChange={(e) => setBusinessName(e.target.value)}
                           isFocused={businessName !== 'My Store' && !isPublished && !isHovered}
                           placeholder="Enter store name"
                         />
                         <div className="h-2"></div>
                         <EditorInput label="Support Email" value="" placeholder="support@example.com" readOnly />
                      </AccordionItem>

                      {/* Hero Section */}
                      <AccordionItem
                        title="Hero Section"
                        icon={ImageIcon}
                        isOpen={heroOpen}
                        onToggle={() => setHeroOpen(!heroOpen)}
                      >
                          <EditorInput
                            label="Headline"
                            value={heroTitle}
                            onChange={(e) => setHeroTitle(e.target.value)}
                            readOnly={!isHovered}
                          />
                          <div className="h-4"></div>
                          <div className="text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Background Image</div>
                          <div className="w-full h-24 bg-gray-100 rounded-md border border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 gap-1 cursor-pointer hover:bg-gray-50 transition-colors">
                             <ImageIcon size={20} />
                             <span className="text-[10px]">Click to upload</span>
                          </div>
                      </AccordionItem>

                      {/* Other Sections */}
                      <AccordionItem title="Products" icon={ShoppingBag} isOpen={false} onToggle={() => {}} />
                      <AccordionItem title="About Us" icon={User} isOpen={false} onToggle={() => {}} />
                   </>
                 )}

                 {activeTab === 'theme' && (
                    <div className="p-4 space-y-6">
                       <div>
                          <label className="block text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">Color Scheme</label>
                          <div className="space-y-2">
                             <ThemeOption
                               name="Minimal Light"
                               color="#ffffff"
                               isSelected={themeColor === 'light'}
                               onClick={() => setThemeColor('light')}
                             />
                             <ThemeOption
                               name="Elegant Pastel"
                               color="#FFFBF7"
                               isSelected={themeColor === 'pastel'}
                               onClick={() => setThemeColor('pastel')}
                             />
                             <ThemeOption
                               name="Modern Dark"
                               color="#1a1a1a"
                               isSelected={themeColor === 'dark'}
                               onClick={() => setThemeColor('dark')}
                             />
                          </div>
                       </div>

                       <div>
                          <label className="block text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">Typography</label>
                          <div className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg bg-gray-50">
                             <Type size={18} className="text-gray-500"/>
                             <span className="text-sm font-medium text-gray-700">Serif Display</span>
                             <span className="text-xs text-gray-400 ml-auto">Aa</span>
                          </div>
                       </div>
                    </div>
                 )}

              </div>
           </div>
        </aside>

        {/* Success Modal (Toast) */}
        <AnimatePresence>
          {isPublished && (
            <motion.div
              initial={{ opacity: 0, y: 50, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: 20, x: '-50%' }}
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-50 bg-white pl-4 pr-6 py-4 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-100 flex items-center gap-4 min-w-[340px]"
            >
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center shrink-0 text-green-600 shadow-sm">
                <Check size={24} strokeWidth={3} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">Site Published Successfully!</h4>
                <p className="text-gray-500 text-xs mt-0.5">Your site is live at <span className="text-purple-600 font-medium font-mono">storify.com/{businessName.toLowerCase()}</span></p>
              </div>
              <button className="ml-auto text-gray-400 hover:text-gray-600">
                <ExternalLink size={18} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
