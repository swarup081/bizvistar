'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
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
                <Link
                    key={link.label} 
                    href={link.href} 
                    className="flex items-center h-full hover:text-gray-900 transition-colors"
                >
                    {link.label}
                    {link.hasDropdown && <ChevronDown size={18} className="ml-1 text-gray-500" />}
                </Link>
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
                      <div className="p-3 text-sm text-gray-700 border-b truncate">
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


// --- Business Type Data (Moved outside components for reusability) ---
const allBusinessTypes = [
    'Retail Shop', 'Kirana Store / General Store', 'Online Store', 'Clothing Boutique', 'Saree Shop',
    'Footwear Store', 'Stationery Shop', 'Bookstore', 'Gift Shop', 'Mobile Store',
    'Electronics Store', 'Supermarket / Mini-Mart', 'Toy Store', 'Hardware Store', 'Pet Store',
    'Handmade Crafts Store', 'Candle Shop', 'Artificial Jewellery Shop', 'Jewellery Store',
    'Handicraft Emporium', 'Pottery Shop', 'Custom Gift Maker', 'Home Decor Boutique',
    'Restaurant', 'Indian Restaurant', 'Ethnic/Theme Restaurant', 'Cafe', 'Bakery & Cake Shop',
    'Sweet Shop', 'Tea Stall', 'Juice Center', 'Food Truck', 'Cloud Kitchen',
    'Catering Service', 'Home Baker', 'Salon', 'Beauty Salon', 'Hair Salon',
    'Nail Salon', 'Barbershop', 'Spa', 'Gym / Fitness Center', 'Yoga Studio',
    'Healthcare Clinic', 'Doctor', 'Dentist', 'Pharmacy', 'Veterinary Clinic',
    'Portfolio', 'Photographer', 'Designer', 'Developer', 'Artist', 'Blogger',
    'Writer', 'Influencer', 'Consultant', 'Marketing Consultant', 'Financial Consultant',
    'Business Consultant', 'Real Estate Agency', 'Construction Company', 'Law Firm',
    'Technology Company', 'SaaS', 'Web Development Agency', 'Digital Marketing Agency',
    'Event', 'Wedding Planner', 'Event Management', 'Educational Institution',
    'Tutor / Coaching Center', 'Dance School', 'Music School', 'Automobile Repair',
    'Car Wash', 'Mobile Repair Shop', 'Computer Repair', 'Dry Cleaner / Laundry Service',
    'Electrician', 'Plumber'
];

// --- Secondary Navigation Component (Sticky/Floating with Search) ---
const SecondaryNav = ({ filter, setFilter }) => {
    const autocompleteRef = useRef(null);
    const router = useRouter();
    
    // Internal state for the search input value and suggestions
    const [searchValue, setSearchValue] = useState(filter); 
    const [suggestions, setSuggestions] = useState([]);
    // Use 'All Templates' as the default active category
    const [activeCategory, setActiveCategory] = useState('All Templates'); 
    
    // Sync external filter prop with internal searchValue state and update active category
    useEffect(() => {
        setSearchValue(filter);
        if (filter) {
             // Try to set the active category based on the filter value if it matches a category keyword
             const matchingItem = navItems.find(item => item.keyword.toLowerCase() === filter.toLowerCase());
             if (matchingItem) {
                 setActiveCategory(matchingItem.label);
             } else {
                 // If a specific business type is set via search, clear category highlight
                 setActiveCategory(null); 
             }
        } else {
             // If filter is empty, default to "All Templates"
             setActiveCategory('All Templates');
        }

    }, [filter]);

    // UPDATED NAV ITEMS - concise labels, added keywords for filtering logic
    const navItems = [
        { label: 'All Templates', keyword: '', href: '#all-templates' }, 
        { label: 'Services', keyword: 'Consultant', href: '#services' }, 
        { label: 'Store', keyword: 'Retail', href: '#store' }, 
        { label: 'Creative', keyword: 'Portfolio', href: '#creative' }, 
        { label: 'Community', keyword: 'Event', href: '#community' }, 
        { label: 'Blog/Media', keyword: 'Blogger', href: '#blog' },
    ];
    
    // Function to get filtered suggestions
    const getFilteredSuggestions = useCallback((value) => {
        if (value.length > 1) {
            const lowerSearchValue = value.toLowerCase();
            const filtered = allBusinessTypes
                .filter(type => type.toLowerCase().includes(lowerSearchValue))
                .sort((a, b) => {
                    const aLower = a.toLowerCase();
                    const bLower = b.toLowerCase();
                    if (aLower.startsWith(lowerSearchValue) && !bLower.startsWith(lowerSearchValue)) return -1;
                    if (!aLower.startsWith(lowerSearchValue) && bLower.startsWith(lowerSearchValue)) return 1;
                    if (a.length !== b.length) return a.length - b.length;
                    return aLower.localeCompare(bLower);
                });
            setSuggestions(filtered);
        } else {
            setSuggestions([]);
        }
    }, []);

    // Handle suggestion click (updates both internal state and external filter state)
    const handleSuggestionClick = (suggestion) => {
        setSearchValue(suggestion);
        setFilter(suggestion); // Update the filter state in the parent component
        localStorage.setItem('businessType', suggestion);
        setSuggestions([]); 
        setActiveCategory(null); // Clear category selection when search is used
    };

    // New: Handle category click
    const handleCategoryClick = (label, keyword) => {
        setActiveCategory(label);
        setFilter(keyword); // Apply category filter to parent state
        setSearchValue(''); // Clear manual search when category is selected
        localStorage.removeItem('businessType'); // Clear saved business type when switching to a category
        setSuggestions([]); 
    }

    // New: Handle clearing the search field (X button)
    const handleClearSearch = () => {
        setSearchValue('');
        setFilter('');
        localStorage.removeItem('businessType');
        setSuggestions([]);
        // Re-default to 'All Templates' visual state
        setActiveCategory('All Templates');
    };

    // Effect to run filtering when searchValue changes
    useEffect(() => {
        if (document.activeElement === document.getElementById('search-input') || suggestions.length > 0) {
            getFilteredSuggestions(searchValue);
        } else {
             if(searchValue && searchValue.length === 0) {
                 setSuggestions([]);
             }
        }
    }, [searchValue, getFilteredSuggestions, suggestions.length]);


    // Close suggestions when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (autocompleteRef.current && !autocompleteRef.current.contains(event.target)) {
                setSuggestions([]);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [autocompleteRef]);


    return (
        // Sticky at top-0 after PrimaryHeader scrolls past
        <nav className="w-full bg-white border-b border-gray-200 text-gray-700 font-sans sticky top-[0px] z-40">
            <div className="mx-auto px-12 max-w-screen-2xl h-14 flex items-center justify-between">
                
                {/* Left Side: Navigation Links (Filters with smoother UI) */}
                <div className="flex items-center gap-6 text-base font-medium h-full">
                    {/* Using motion.button and layoutId for smooth underline transition */}
                    {navItems.map((item) => (
                        <motion.button 
                            key={item.label}
                            onClick={() => handleCategoryClick(item.label, item.keyword)}
                            className={cn(
                                'flex items-center h-full transition-colors relative', 
                                'pt-3', // Added pt-3 for better alignment/baseline
                                activeCategory === item.label
                                    ? 'text-gray-900 font-semibold' 
                                    : 'text-gray-600 hover:text-gray-900'
                            )}
                        >
                            {item.label}
                            {/* Visual Indicator for Active Category (Bottom line) */}
                            {activeCategory === item.label && (
                                <motion.div 
                                    layoutId="category-underline"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" 
                                    transition={{ duration: 0.2, type: "tween" }}
                                />
                            )}
                        </motion.button>
                    ))}
                </div>
                
                {/* Right Side: Search/Filter (Shorter Dash and Clear Button) */}
                <div className="relative ml-5 max-w-md w-76" ref={autocompleteRef}> 
                    <div className="flex items-end">
                        <div className="relative flex-grow">
                            <Search className="absolute left-1 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input
                                id="search-input"
                                type="text"
                                value={searchValue}
                                onChange={(e) => { 
                                    setSearchValue(e.target.value); 
                                    setFilter(e.target.value);
                                    setActiveCategory(null); // Remove category highlight on manual search
                                }}
                                onFocus={() => getFilteredSuggestions(searchValue)}
                                placeholder="Search for your business "
                                // pt-3/pb-2 for alignment, pr-8 accounts for the X button
                                className="w-full bg-transparent border-0 border-b-2 border-gray-300 pt-3 pb-2 pl-9 text-lg text-gray-800 placeholder:text-gray-400 focus:ring-0 focus:border-black transition-colors duration-300 outline-none pr-8"
                            />
                            
                            {/* Clear Button (X) - visible when search value exists */}
                            {searchValue && (
                                <button 
                                    onClick={handleClearSearch} 
                                    className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-gray-900 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            )}
                            
                            {suggestions.length > 0 && (
                                <ul className="autocomplete-scrollbar absolute z-50 w-full mt-2 top-full bg-white border border-gray-200 rounded-2xl shadow-lg max-h-60 overflow-y-auto">
                                    {suggestions.map((suggestion, index) => (
                                        <li
                                            key={index}
                                            onClick={() => handleSuggestionClick(suggestion)}
                                            className="px-6 py-2.5 text-base cursor-pointer hover:bg-gray-100 first:rounded-t-2xl last:rounded-b-2xl"
                                        >
                                            {suggestion}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
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
    keywords: ['Food', 'Sweets', 'Bakery', 'Mithai', 'Coming Soon', 'Restaurant', 'Cafe', 'Cloud Kitchen'],
    isRecommended: true,
  },
  {
    title: 'flara',
    description: 'An elegant e-commerce design with a light, clean aesthetic, ideal for physical products like candles, apparel, or handmade goods.',
    url: '/templates/flara',
    previewUrl: '/preview/flara',
    editor:'/editor/flara',
    keywords: ['Retail', 'E-commerce', 'Candles', 'Handmade', 'Clean', 'Online Store', 'Clothing Boutique'],
    isRecommended: false,
  },
  {
    title: 'avenix',
    description: 'A bold, minimalist fashion portfolio template to showcase your creative work and professional journey.',
    url: '/templates/avenix',
    previewUrl: '/preview/avenix',
    editor:'/editor/avenix',
    keywords: ['Fashion', 'Apparel', 'Minimalist', 'Bold', 'Portfolio', 'Designer', 'Photographer', 'Creative'],
    isRecommended: false,
  },
  {
    title: 'blissly',
    description: 'A cozy coffee shop/cafe theme, blending modern functionality like event management and product ordering with a warm, inviting feel.',
    url: '/templates/blissly',
    previewUrl: '/preview/blissly',
    editor:'/editor/blissly',
    keywords: ['Cafe', 'Restaurant', 'Events', 'Booking', 'Coffee', 'Community'],
    isRecommended: false,
  },
  {
    title: 'frostify',
    description: 'A cozy coffee shop/cafe theme, blending modern functionality like event management and product ordering with a warm, inviting feel.',
    url: '/templates/frostify',
    previewUrl: '/preview/frostify',
    editor:'/editor/frostify',
    keywords: ['Cafe', 'Restaurant', 'Events', 'Booking', 'Coffee', 'Community'],
    isRecommended: false,
  },
  {
    title: 'aurora',
    description: 'A cozy coffee shop/cafe theme, blending modern functionality like event management and product ordering with a warm, inviting feel.',
    url: '/templates/aurora',
    previewUrl: '/preview/aurora',
    editor:'/editor/aurora',
    keywords: ['Craft', 'Restaurant', 'Events', 'Booking', 'Coffee', 'Community'],
    isRecommended: false,
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
      // Check if user already has a site (Enforce 1 site per user)
      const { data: existingSite } = await supabase
        .from('websites')
        .select('id')
        .eq('user_id', user.id)
        .limit(1)
        .maybeSingle();

      if (existingSite) {
          alert("You already have a live project. You can only have one shop.");
          router.push('/dashboard/website'); // Redirect to existing dashboard
          return;
      }

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


      {/* --- Hover Info Block --- */}
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
            {/* FIX APPLIED HERE: Replaced Link with deprecated legacyBehavior prop with a standard <a> tag for external link */}
            <a 
              href={previewUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="rounded-lg bg-white px-6 py-2.5 text-base font-semibold text-gray-800 shadow-sm ring-1 ring-inset ring-gray-300 transition-colors hover:bg-gray-50 flex items-center justify-center"
            >
                Preview Site
            </a>
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

  // Logic for filtering templates (A basic example based on the business type/keyword filter)
  const filteredTemplates = activeFilter 
    ? templates.filter(template => 
        template.keywords.some(keyword => 
            keyword.toLowerCase().includes(activeFilter.toLowerCase())
        )
      )
    : templates;


  return (
    // Outer container ensures main header and secondary nav backgrounds are pure white
    <div className="bg-white font-sans min-h-screen">
      
      {/* 1. Primary Header (Now scrolls) */}
      <PrimaryHeader session={session} onLoginClick={handleLoginClick} />
      
      {/* 2. Secondary Navigation Bar (Sticky/Floating) - Passed filter state */}
      <SecondaryNav filter={filter} setFilter={setFilter} />
      
      {/* Main Content Area (Background is now grayish) */}
      <div className="bg-gray-50 pb-20 pt-16"> {/* pt-16 for space below sticky nav */}
          <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
            
            {/* Top Content: Title and "Sort by" */}
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

            {/* Template Grid Container */}
            <div className="mt-12 grid grid-cols-1 justify-items-start gap-x-16 gap-y-24 lg:grid-cols-2 lg:gap-x-10 lg:gap-y-28 pl-6">
              {filteredTemplates.map((template, index) => (
                <TemplateCard key={`${template.title}-${index}`} {...template} />
              ))}

              {filteredTemplates.length === 0 && (
                <div className="lg:col-span-2 text-center py-20">
                    <p className="text-2xl text-gray-600">No templates found for: <span className="font-bold">"{activeFilter}"</span></p>
                    <p className="text-gray-500 mt-2">Try a different search term or view all templates.</p>
                    {activeFilter && (
                       <button 
                          onClick={() => setFilter('')}
                          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                       >
                         View All Templates
                       </button>
                    )}
                </div>
              )}
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