'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; 
import { supabase } from '@/lib/supabaseClient'; 
import { Globe, User, ChevronDown, Search, X } from 'lucide-react'; 
import { cn } from '@/lib/utils'; // Assuming cn is available

// --- Primary Header Component (Non-Fixed, Scrolls) ---
const PrimaryHeader = ({ session, onLoginClick }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  const navLinks = [
    { label: 'My Sites', href: '#mysites', hasDropdown: false },
    { label: 'Product', href: '#product', hasDropdown: true },
    { label: 'Solutions', href: '#solutions', hasDropdown: true },
    { label: 'Resources', href: '#resources', hasDropdown: true },
    { label: 'Pricing', href: '/get-started/pricing', hasDropdown: false },
  ];

  const handleLogOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <header className="h-[65px] bg-white border-b border-gray-200 z-50 font-sans shadow-sm">
      <div className="mx-auto px-6 h-full flex items-center justify-between">
        
        {/* Left: Logo/Title */}
        <Link href="/" className="flex items-center space-x-2">
            <span className="text-3xl font-bold text-gray-900 not-italic tracking-tight">
                BizVistaar
            </span>
        </Link>
        
        {/* Center: Navigation Links */}
        <nav className="flex items-center h-full text-gray-800 font-medium text-base gap-6 ml-auto">
            {navLinks.map((link) => (
                <a 
                    key={link.label} 
                    href={link.href} 
                    className="flex items-center h-full hover:text-gray-900 transition-colors"
                >
                    {link.label}
                    {link.hasDropdown && <ChevronDown size={18} className="ml-1 text-gray-500" />}
                </a>
            ))}
            <div className="h-6 w-px bg-gray-300 mx-1"></div>
        </nav>

        {/* Right: Auth & Globe */}
        <div className="flex items-center ml-6 gap-4">
            <Globe className="w-5 h-5 text-gray-700 cursor-pointer" />
            
            {session ? (
                <div className="relative">
                  <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                       <User size={18} className="text-gray-500" />
                    </div>
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                      <div className="p-3 text-sm text-gray-700 border-b">
                         {session.user.email}
                      </div>
                      <button 
                        onClick={handleLogOut}
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                         Log Out
                      </button>
                    </div>
                  )}
                </div>
            ) : (
                <button 
                  onClick={onLoginClick}
                  className="px-5 py-2.5 text-sm font-semibold text-blue-600 border border-blue-600 rounded-full hover:bg-blue-50 transition-colors"
                >
                  Log In
                </button>
            )}
        </div>
      </div>
    </header>
  );
};

// --- Secondary Navigation Component (Sticky/Floating with Search) ---
const SecondaryNav = ({ filter, setFilter, defaultSearch, activeFilter }) => {
    const navItems = [
        { label: 'Business & Services', hasDropdown: true },
        { label: 'Store', hasDropdown: true },
        { label: 'Creative', hasDropdown: true },
        { label: 'Community', hasDropdown: true },
        { label: 'Blog', hasDropdown: true },
    ];
    
    // Handler for removing a filter tag (e.g., the pre-filled business type)
    const handleRemoveFilter = () => {
        setFilter(''); // Clear the filter
    }

    return (
        // Sticky at top-0 after PrimaryHeader scrolls past
        <nav className="w-full bg-white border-b border-gray-200 text-gray-700 font-medium text-base  sticky top-0 z-40">
            <div className="mx-auto px-6 max-w-screen-2xl h-14 flex items-center justify-between">
                
                {/* Left Side: Navigation Links */}
                <div className="flex items-center gap-8">
                    {navItems.map((item) => (
                        <a 
                            key={item.label}
                            href="#"
                            className={`flex items-center h-full transition-colors ${
                                item.isActive 
                                    ? 'text-blue-600 border-b-2 border-blue-600' 
                                    : 'hover:text-gray-900'
                            }`}
                        >
                            {item.label}
                            {item.hasDropdown && <ChevronDown size={18} className="ml-1 text-gray-500" />}
                        </a>
                    ))}
                </div>
                
                {/* Right Side: All Templates + Search/Filter */}
                <div className="flex items-center gap-6 h-full">
                    
                    {/* All Templates Link */}
                  
                    
                    {/* Search/Filter Area */}
                    {activeFilter ? (
                        <div className="flex items-center relative ml-4 border-b-2 border-black-700/80">
                            {/* Active Filter Pill with X */}
                            <span className="text-gray-800 text-base py-1">
                                {activeFilter}
                            </span>
                            <X size={18} className="ml-2 text-black cursor-pointer hover:text-black" onClick={handleRemoveFilter} />
                        </div>
                    ) : (
                        // Search Input (Styled like get-started)
                        <div className="relative flex items-center w-60 ml-4">
                            <input
                                type="text"
                                placeholder="Search all templates"
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="w-full bg-transparent border-0 border-b-2 border-gray-300 py-1 text-base text-gray-800 placeholder:text-gray-400 focus:ring-0 focus:border-black transition-colors duration-300 outline-none pr-7"
                            />
                            {/* Search Icon on the right */}
                            <Search size={18} className="absolute right-0 text-gray-400 cursor-pointer hover:text-gray-600" />
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

// --- Data for the templates (Extended with keywords and recommended status) ---
const templates = [
  {
    title: 'flavornest',
    description: 'A modern landing page focusing on delicious food and sweet products, perfect for pre-orders and a coming soon approach.',
    url: '/templates/flavornest',
    previewUrl: '/preview/flavornest',
    editor:'/editor/flavornest',
    keywords: ['Food', 'Sweets', 'Bakery', 'Mithai', 'Coming Soon'],
    isRecommended: true,
  },
  {
    title: 'flara',
    description: 'An elegant e-commerce design with a light, clean aesthetic, ideal for physical products like candles, apparel, or handmade goods.',
    url: '/templates/flara',
    previewUrl: '/preview/flara',
    editor:'/editor/flara',
    keywords: ['Retail', 'E-commerce', 'Candles', 'Handmade', 'Clean']
  },
  {
    title: 'avenix',
    description: 'A bold, minimalist fashion portfolio template to showcase your creative work and professional journey.',
    url: '/templates/avenix',
    previewUrl: '/preview/avenix',
    editor:'/editor/avenix',
    keywords: ['Fashion', 'Apparel', 'Minimalist', 'Bold', 'Portfolio']
  },
  {
    title: 'blissly',
    description: 'A cozy coffee shop/cafe theme, blending modern functionality like event management and product ordering with a warm, inviting feel.',
    url: '/templates/blissly',
    previewUrl: '/preview/blissly',
    editor:'/editor/blissly',
    keywords: ['Cafe', 'Restaurant', 'Events', 'Booking', 'Coffee']
  }
];

// --- Static List of Vibe Pills (from get-started/2) ---
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

// --- Reusable Template Card Component with Hover Logic ---
const TemplateCard = ({ title, description, url, previewUrl, editor, keywords, isRecommended }) => {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [selectedKeyword, setSelectedKeyword] = useState(null);

  const handleStartEditing = async () => {
    setIsCreating(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/sign-in');
      return;
    }

    try {
      const { data: template, error: templateError } = await supabase
        .from('templates')
        .select('id')
        .eq('name', title) 
        .single();

      if (templateError) throw new Error(`Could not find template: ${templateError.message}`);
      if (!template) throw new Error('Template not found in database.');

      const storeName = localStorage.getItem('storeName') || 'My New Site';
      const site_slug = storeName.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(); 

      const { data: newSite, error: insertError } = await supabase
        .from('websites')
        .insert({
          user_id: user.id,
          template_id: template.id,
          site_slug: site_slug,
          website_data: {} 
        })
        .select('id') 
        .single();

      if (insertError) throw new Error(`Could not create site: ${insertError.message}`);
      if (!newSite) throw new Error('Failed to create site entry.');
      
      router.push(`/editor/${title}?site_id=${newSite.id}`);

    } catch (error) {
      alert(`Error: ${error.message}`);
      setIsCreating(false);
    }
  };

  return (
    <motion.div
      className="group max-w-xl cursor-pointer relative" 
      whileHover="hover"
      initial="initial"
      animate="initial"
    >
      
      {/* Recommended Badge */}
      {isRecommended && (
        <span className="absolute -top-3 left-4 z-20 bg-black text-white text-xs font-bold px-3 py-1 rounded-full shadow-md uppercase tracking-wider">
          Recommended
        </span>
      )}

      {/* Container for the visual part (iframes). */}
       <div className="relative h-[320px]">

        {/* Mobile View - Positioned BEHIND the desktop view */}
        <motion.div
          className="absolute bottom-0 right-[-60px] z-0 w-[140px] h-[260px] transform overflow-hidden rounded-2xl bg-white shadow-lg p-1.5 pt-6"
          style={{ transformOrigin: "bottom right" }}
          variants={{
            initial: {
              x: -25,
              zIndex: 0,
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
            },
            hover: {
              x: [-25, 45, -30],
              zIndex: [0, 0, 20],
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              transition: {
                duration: 0.7,
                ease: "easeInOut",
                times: [0, 0.5, 1]
              },
            },
          }}
        >
          <div className="w-full h-full overflow-hidden rounded-b-xl bg-white">
            <iframe
              src={url}
              className="w-[350px] h-[667px] origin-top-left scale-[0.37] transform pointer-events-none"
              scrolling="no"
              title={`${title} Mobile Preview`}
            />
          </div>
        </motion.div>

        {/* Desktop View - Positioned IN FRONT of the mobile view */}
        <motion.div
          className="absolute left-0 top-0 z-10 h-[320px] w-[500px] overflow-hidden rounded-2xl border border-gray-200/60 bg-white shadow-xl p-1 pt-7"
          style={{ transformOrigin: "bottom left" }}
          variants={{
            initial: {
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.30)"
            },
            hover: {
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
            }
          }}
        >
          <div className="w-full h-full overflow-hidden rounded-b-xl bg-white">
            <iframe
              src={url}
              className="w-[1280px] h-[750px] origin-top-left scale-[0.39] transform pointer-events-none"
              scrolling="no"
              title={`${title} Desktop Preview`}
            />
          </div>
        </motion.div>
      </div>


      {/* --- Hover Info Block (MODIFIED FOR CONDITIONAL VISIBILITY) --- */}
      <div className="mt-8 min-h-[140px] transform px-2 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100">
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        <p className="mt-2 text-base leading-relaxed text-gray-600">{description}</p>
        
        <div className="mt-6 flex items-center gap-3">
            <button 
              onClick={handleStartEditing}
              disabled={isCreating}
              className="rounded-lg bg-gray-900 px-6 py-2.5 text-base font-semibold text-white shadow-sm transition-colors hover:bg-gray-800 disabled:bg-gray-400"
            >
              {isCreating ? 'Creating...' : 'Start Editing'}
            </button>
            <Link href={previewUrl} target="_blank" rel="noopener noreferrer">
                <button className="rounded-lg bg-white px-6 py-2.5 text-base font-semibold text-gray-800 shadow-sm ring-1 ring-inset ring-gray-300 transition-colors hover:bg-gray-50">
                    Preview Site
                </button>
            </Link>
        </div>
      </div>
    </motion.div>
  );
};


// --- Main Page (Container and Logic) ---
export default function TemplatesPage() {
  const [storeName, setStoreName] = useState("Your Business");
  const [session, setSession] = useState(null);
  const [selectedVibes, setSelectedVibes] = useState({});
  const [filter, setFilter] = useState(''); // State for the search/filter input
  const router = useRouter();

  // Load state and session
  useEffect(() => {
    const storedStoreName = localStorage.getItem('storeName');
    if (storedStoreName) {
      setStoreName(storedStoreName);
    }
    
    const storedVibes = localStorage.getItem('businessVibes');
    if (storedVibes) {
      try {
        setSelectedVibes(JSON.parse(storedVibes));
      } catch (e) {
        console.error("Failed to parse stored businessVibes:", e);
      }
    }
    
    // Set initial filter to business type
    const storedBusinessType = localStorage.getItem('businessType');
    if (storedBusinessType) {
        setFilter(storedBusinessType);
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    
    const { data: authListener } = supabase.auth.onAuthStateChange(
        (_event, session) => {
            setSession(session);
        }
    );
    
    return () => {
        authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLoginClick = useCallback(() => {
    router.push('/sign-in');
  }, [router]);
  
  // Logic to determine if a filter is active
  const activeFilter = filter.trim();

  return (
    // Outer container ensures main header and secondary nav backgrounds are pure white
    <div className="bg-white font-sans min-h-screen">
      
      {/* 1. Primary Header (Now scrolls) */}
      <PrimaryHeader session={session} onLoginClick={handleLoginClick} />
      
      {/* 2. Secondary Navigation Bar (Sticky/Floating) */}
      
      {/* Main Content Area (Background is now grayish) */}
      <div className="bg-gray-50 pb-20 pt-16"> {/* Added pt-16 for space below secondary nav */}
          <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
            
            {/* Top Content: Title (reverted) and "Sort by" */}
            <div className="text-left max-w-screen-2xl mx-auto mb-10">
                <div className="flex flex-col items-center text-center w-full space-y-3">
                    <h2 className="text-5xl font-bold tracking-tight not-italic text-gray-900">
                        Choose a Template for <span className="text-gray-500">{storeName}</span>
                    </h2>

                    <p className="text-gray-600 text-base mt-1">
                        Pick the perfect starting point for your brand.
                    </p>

                   
                </div>
            </div>

            <div className="text-center">
                {/* Business Vibe Filter Pills (Dynamically styled based on previous input) */}
                <div className="flex flex-wrap justify-center gap-3 mt-12 mb-20">
                   {businessVibes.map(({ id, label }) => {
                       const isSelected = !!selectedVibes[id];
                       return (
                           <button 
                               key={id}
                               className={`px-6 py-3 border rounded-full font-semibold transition-colors duration-200 ${
                                   isSelected
                                       ? 'bg-gray-900 text-white border-black' 
                                       : 'bg-white text-gray-700 border-gray-300 hover:border-gray-900'
                               }`}
                           >
                               {label}
                           </button>
                       );
                   })}
                </div>
            </div>

            <SecondaryNav filter={activeFilter} setFilter={setFilter} activeFilter={activeFilter} defaultSearch={localStorage.getItem('businessType') || ''} />

         
            {/* Template Grid Container */}
            <div className="mt-24 grid grid-cols-1 justify-items-start gap-x-16 gap-y-24 lg:grid-cols-2 lg:gap-x-10 lg:gap-y-28 pl-6">
              {templates.map((template, index) => (
                <TemplateCard key={`${template.title}-${index}`} {...template} />
              ))}
            </div>
          </div>
      </div>

       {/* Floating Contact Us Button */}
       <button className="fixed bottom-8 right-8 z-50 flex items-center gap-2 rounded-full bg-white px-5 py-3 font-semibold text-gray-800 shadow-lg ring-1 ring-inset ring-gray-200 transition-transform hover:scale-105">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
            </svg>
            Contact Us
       </button>
    </div>
  );
}