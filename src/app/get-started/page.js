'use client';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { GridBackgroundDemo } from "@/components/GridBackgroundDemo";
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '@/lib/logo/Logo';

// --- 1. Smart Skeleton Component (Subtle but Distinct Colors) ---
const TemplateSkeleton = ({ variant }) => {
  
  const renderContent = () => {
    switch (variant) {
      case 'centered':
        return (
          <div className="flex flex-col items-center text-center mt-6 gap-3 animate-pulse">
            <div className="h-6 w-3/4 bg-gray-200 rounded-lg"></div>
            <div className="h-3 w-1/2 bg-gray-100 rounded-lg"></div>
            <div className="h-8 w-28 bg-gray-100 rounded-full mt-3"></div>
            {/* Subtle Orange */}
            <div className="w-full h-36 bg-orange-100 rounded-xl mt-6 border border-orange-200 mx-auto"></div>
          </div>
        );
      case 'grid':
        return (
          <div className="flex flex-col gap-3 mt-4 px-1 animate-pulse">
             <div className="h-8 w-2/3 bg-gray-200 rounded-lg mb-2"></div>
             <div className="grid grid-cols-2 gap-3">
                {/* Subtle Green */}
                <div className="h-24 bg-green-100 rounded-lg border border-green-200"></div>
                <div className="h-24 bg-green-100 rounded-lg border border-green-200"></div>
                <div className="h-24 bg-green-100 rounded-lg border border-green-200"></div>
                <div className="h-24 bg-green-100 rounded-lg border border-green-200"></div>
             </div>
          </div>
        );
      case 'feature':
        return (
           <div className="flex gap-3 items-center h-48 px-1 mt-4 animate-pulse">
              {/* Subtle Purple */}
              <div className="w-1/2 h-40 bg-purple-100 rounded-lg border border-purple-200"></div>
              <div className="w-1/2 flex flex-col gap-2">
                  <div className="h-5 w-full bg-gray-200 rounded-md"></div>
                  <div className="h-2 w-full bg-gray-100 rounded-md"></div>
                  <div className="h-2 w-4/5 bg-gray-100 rounded-md"></div>
                  <div className="h-2 w-full bg-gray-100 rounded-md"></div>
                  <div className="h-8 w-20 bg-purple-100 rounded-md mt-2"></div>
              </div>
           </div>
        );
      case 'minimal':
        return (
           <div className="flex flex-col px-3 mt-6 animate-pulse gap-5">
              <div className="h-14 w-full bg-gray-100 rounded-xl border border-gray-200"></div>
              <div className="flex gap-2">
                 <div className="h-24 w-1/3 bg-gray-50 border border-gray-200 rounded-lg"></div>
                 <div className="h-24 w-1/3 bg-gray-50 border border-gray-200 rounded-lg"></div>
                 <div className="h-24 w-1/3 bg-gray-50 border border-gray-200 rounded-lg"></div>
              </div>
              <div className="h-28 w-full bg-gray-100 border border-gray-200 rounded-xl"></div>
           </div>
        );
      case 'ecommerce':
        return (
           <div className="flex flex-col mt-2 animate-pulse px-1">
              {/* Hero Banner - Subtle Blue */}
              <div className="w-full h-32 bg-blue-100 rounded-lg mb-4 border border-blue-200 relative">
                 <div className="absolute bottom-3 left-3 h-4 w-24 bg-white/60 rounded-md"></div>
              </div>
              {/* Product Row */}
              <div className="grid grid-cols-3 gap-2">
                  <div className="flex flex-col gap-1">
                    <div className="h-16 bg-gray-100 rounded-md border border-gray-200"></div>
                    <div className="h-2 w-full bg-gray-50 rounded-sm"></div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="h-16 bg-gray-100 rounded-md border border-gray-200"></div>
                    <div className="h-2 w-full bg-gray-50 rounded-sm"></div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="h-16 bg-gray-100 rounded-md border border-gray-200"></div>
                    <div className="h-2 w-full bg-gray-50 rounded-sm"></div>
                  </div>
              </div>
           </div>
        );
      case 'blog':
        return (
           <div className="flex gap-4 mt-4 px-2 animate-pulse h-full">
              {/* Sidebar */}
              <div className="w-1/4 flex flex-col gap-2 border-r border-dashed border-gray-200 pr-2">
                 <div className="h-3 w-full bg-gray-200 rounded-full"></div>
                 <div className="h-3 w-3/4 bg-gray-100 rounded-full"></div>
                 <div className="h-3 w-5/6 bg-gray-100 rounded-full"></div>
                 <div className="h-3 w-4/5 bg-gray-100 rounded-full"></div>
              </div>
              {/* Content */}
              <div className="w-3/4 flex flex-col gap-4">
                 <div className="h-24 w-full bg-gray-50 border border-gray-200 rounded-lg"></div>
                 <div className="h-4 w-2/3 bg-gray-200 rounded-md"></div>
                 <div className="space-y-1">
                    <div className="h-2 w-full bg-gray-100 rounded"></div>
                    <div className="h-2 w-full bg-gray-100 rounded"></div>
                    <div className="h-2 w-5/6 bg-gray-100 rounded"></div>
                 </div>
              </div>
           </div>
        );
      case 'portfolio':
        return (
           <div className="flex flex-col mt-4 px-1 animate-pulse">
              <div className="h-6 w-1/2 bg-gray-200 rounded-lg mb-4 self-center"></div>
              <div className="grid grid-cols-2 gap-2 h-48">
                  <div className="bg-gray-100 rounded-lg h-full border border-gray-200"></div>
                  <div className="flex flex-col gap-2 h-full">
                      <div className="bg-gray-100 rounded-lg h-1/2 border border-gray-200"></div>
                      <div className="bg-gray-100 rounded-lg h-1/2 border border-gray-200"></div>
                  </div>
              </div>
           </div>
        );
      case 'split':
      default:
        return (
          <div className="flex gap-4 items-center h-48 px-2 mt-2 animate-pulse">
             <div className="w-5/12 flex flex-col gap-2">
                <div className="h-6 w-full bg-gray-200 rounded-lg"></div>
                <div className="h-6 w-2/3 bg-gray-200 rounded-lg"></div>
                <div className="h-3 w-full bg-gray-100 rounded-lg mt-1"></div>
                <div className="h-9 w-24 bg-blue-100 rounded-md mt-2"></div>
             </div>
             {/* Subtle Blue Split */}
             <div className="w-7/12 h-40 bg-blue-50 rounded-tl-[30px] rounded-br-[30px] border border-blue-100 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-blue-100/20"></div>
             </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-white p-4 overflow-hidden">
      {/* Nav Bar Skeleton */}
      <div className="flex justify-between items-center mb-4 px-1 shrink-0">
        <div className="h-3 w-24 bg-gray-200 rounded-full"></div>
        <div className="flex gap-2">
           <div className="h-2 w-10 bg-gray-100 rounded-full"></div>
           <div className="h-2 w-10 bg-gray-100 rounded-full"></div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow">
        {renderContent()}
      </div>

      {/* Bottom Grid (Common Footer/Features) */}
      <div className="grid grid-cols-3 gap-2 mt-auto pt-4 shrink-0">
          <div className="h-10 bg-gray-50 rounded-md border border-gray-100"></div>
          <div className="h-10 bg-gray-50 rounded-md border border-gray-100"></div>
          <div className="h-10 bg-gray-50 rounded-md border border-gray-100"></div>
      </div>
    </div>
  );
};

// --- 2. Mock Browser Component ---
const MockBrowser = ({ variant, className }) => {
    return (
        <div 
            className={`absolute bg-white rounded-xl overflow-hidden shadow-[0_30px_60px_-12px_rgba(0,0,0,0.12)] border border-gray-200 flex flex-col ${className}`}
            style={{ transition: 'all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)' }}
        >
            {/* Browser Header */}
            <div className="h-8 bg-white border-b border-gray-100 flex items-center px-3 gap-1.5 shrink-0 z-20 relative">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57] border border-black/5"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] border border-black/5"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#28C840] border border-black/5"></div>
                {/* URL Bar Visual */}
                <div className="ml-3 h-5 bg-gray-50 border border-gray-100 rounded-md flex-grow max-w-[200px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center px-2">
                     <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                     <div className="w-16 h-1 bg-gray-300 rounded-full"></div>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-grow relative bg-white overflow-hidden group">
                {/* The Grid/Skeleton Layer */}
                <div className={`absolute inset-0 z-10 bg-white`}>
                    <TemplateSkeleton variant={variant} />
                </div>
                
                {/* Subtle Highlight Overlay */}
                <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-black/5 rounded-b-xl"></div>
            </div>
        </div>
    );
};

export default function StepOne() {
    // --- LEFT SIDE LOGIC (UNCHANGED) ---
    const [searchValue, setSearchValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const autocompleteRef = useRef(null); 

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
    
    const exampleBusinessTypes = [
        'Restaurant', 'Online Store', 'Portfolio', 'Salon', 'Cafe', 
        'Clothing Boutique', 'Cloud Kitchen'
    ];

    const getFilteredSuggestions = (value) => {
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
    };

    useEffect(() => {
        getFilteredSuggestions(searchValue);
    }, [searchValue]);

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

    const handleSuggestionClick = (suggestion) => {
        setSearchValue(suggestion);
        localStorage.setItem('businessType', suggestion);
        setSuggestions([]); 
    };

    const handleContinue = () => {
        localStorage.setItem('businessType', searchValue);
    };

    // --- RIGHT SIDE ANIMATION LOGIC (UNCHANGED) ---
    const templatePairs = [
        [
            { variant: 'split' }, 
            { variant: 'minimal' }
        ],
        [
            { variant: 'portfolio' }, 
            { variant: 'centered' }
        ],
        [
            { variant: 'ecommerce' },
            { variant: 'feature' }
        ],
        [
            { variant: 'blog' },
            { variant: 'grid' }
        ]
    ];

    const [activePairIndex, setActivePairIndex] = useState(0);
    
    useEffect(() => {
        const timer = setTimeout(() => {
            setActivePairIndex((prev) => (prev + 1) % templatePairs.length);
        }, 5000); // 5s duration

        return () => clearTimeout(timer);
    }, [activePairIndex]);

    // Pure Crossfade Variants (Smooth)
    const fadeVariants = {
        initial: { opacity: 0 },
        animate: { 
            opacity: 1, 
            transition: { duration: 1.2, ease: "easeInOut" } 
        },
        exit: { 
            opacity: 0, 
            transition: { duration: 1.2, ease: "easeInOut" } 
        },
    };

    return (
        <div className="flex h-screen font-sans overflow-hidden">
            
            {/* --- LEFT SIDE --- */}
            <div className="w-1/2 flex flex-col justify-between p-16 bg-white z-20 shadow-[10px_0_30px_rgba(0,0,0,0.02)] relative">
                
                <div className="absolute top-4 left-10 text-3xl font-bold text-gray-900 not-italic tracking-tight">
                    <Logo/>
                </div>

                <div className="flex flex-col justify-center h-full">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 not-italic leading-snug">
                        What type of website do you want to create?
                    </h2>
                    
                    <div className="relative ml-5 mb-6 max-w-lg" ref={autocompleteRef}>
                        <div className="flex items-end space-x-4">
                            <div className="relative flex-grow">
                                <svg className="absolute left-1 top-1/2 -translate-y-1/2 w-5 h-5 text-black-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                </svg>
                                <input
                                    type="text"
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    onFocus={() => getFilteredSuggestions(searchValue)}
                                    placeholder="Search for your business or site type"
                                    className="w-full bg-transparent border-0 border-b-2 border-gray-300 py-2 pl-9 text-lg text-gray-800 placeholder:text-gray-400 focus:ring-0 focus:border-black transition-colors duration-300 outline-none"
                                />
                                {suggestions.length > 0 && (
                                    <ul className="autocomplete-scrollbar absolute z-10 w-full mt-2 top-full bg-white border border-gray-200 rounded-2xl shadow-lg max-h-60 overflow-y-auto">
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
                            <Link href="/get-started/1" passHref>
                                <button 
                                    disabled={!searchValue}
                                    onClick={handleContinue}
                                    className="px-6 py-2.5 bg-gray-900 text-white font-medium text-sm rounded-full hover:bg-gray-700 disabled:bg-gray-300 disabled:text-gray-500 transition-colors"
                                >
                                    Continue
                                </button>
                            </Link>
                        </div>
                    </div>
                    
                    <p className="text-xs  ml-10  font-semibold text-gray-400 mb-2 tracking-widest uppercase pl-0">
                        Examples
                    </p>
                    <ul className="space-y-1.5  ml-10  pl-0 font-normal">
                        {exampleBusinessTypes.map((type) => (
                            <li key={type}>
                                <button
                                    onClick={() => handleSuggestionClick(type)}
                                    className="text-gray-600 hover:text-black text-m cursor-pointer font-normal transition-colors"
                                >
                                    {type}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                
                <div>
                    <Link href="/">
                        <button className="text-gray-600 hover:text-gray-900 font-medium text-m flex items-center gap-1">
                        ← Back
                        </button>
                    </Link>
                </div>
            </div>

            {/* --- RIGHT SIDE (Enhanced) --- */}
            <div className="w-1/2 bg-gray-50 relative overflow-hidden flex items-center justify-center">
                {/* 1. Background Grid */}
                <div className="absolute inset-0 z-0 pointer-events-none opacity-60">
                   <GridBackgroundDemo />
                </div>

                {/* 2. Floating Templates Container (Moved up to make space for text) */}
                <div className="relative z-10 w-[900px] h-[650px] flex items-center justify-center -mt-20">
                    <AnimatePresence>
                        <motion.div
                            key={activePairIndex}
                            variants={fadeVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            className="absolute inset-0 w-full h-full"
                        >
                            {/* Card 1 - Left */}
                            <MockBrowser 
                                variant={templatePairs[activePairIndex][0].variant}
                                className="top-[10%] left-[8%] w-[300px] h-[420px] z-20 hover:z-30 shadow-2xl"
                            />

                            {/* Card 2 - Right */}
                            <MockBrowser 
                                variant={templatePairs[activePairIndex][1].variant}
                                className="top-[15%] right-[8%] w-[300px] h-[420px] z-20 hover:z-30 shadow-2xl"
                            />
                        </motion.div>
                    </AnimatePresence>
                    
                    {/* Decorative Blob */}
                    <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-200/20 rounded-full blur-[80px] z-0 pointer-events-none"></div>
                </div>

                 {/* 3. Bottom Text and Arrow Area - Positioned EXACTLY like screenshot */}
                 <div className="absolute bottom-20 left-12 max-w-xl z-30 flex items-start gap-0">
                    {/* Hand-drawn Arrow SVG */}
                    <svg 
                        className="flex-shrink-0 w-20 h-20 text-black transform translate-y-1" 
                        viewBox="0 0 100 100" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {/* Curved "Elbow" Path: 
                           Starts top-left, curves down, then turns sharply right to point at text.
                        */}
                        <path 
                            d="M 25 15 Q 25 55 75 60" 
                            stroke="currentColor" 
                            strokeWidth="2.5" 
                            strokeLinecap="round" 
                            fill="none" 
                        />
                        {/* Arrow Head pointing right */}
                        <path 
                            d="M 65 50 L 80 60 L 65 70" 
                            stroke="currentColor" 
                            strokeWidth="2.5" 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            fill="none" 
                        />
                    </svg>

                    <p className="text-gray-900 font-normal text-m leading-snug mt-10">
                        We&apos;re ready to build your website, from Instagram DM sellers to local shops and service businesses. Just add your details, and we&apos;ll make sure you look amazing online without the tech stress.
                    </p>
                    </div>
            </div>
        </div>
    );
}