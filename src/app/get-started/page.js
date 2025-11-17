'use client';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { GridBackgroundDemo } from "@/components/GridBackgroundDemo";
import { motion, AnimatePresence } from 'framer-motion';

// --- 1. Smart Skeleton Component (UNCHANGED) ---
const TemplateSkeleton = ({ variant }) => {
  
  const renderContent = () => {
    switch (variant) {
      case 'centered':
        return (
          <div className="flex flex-col items-center text-center mt-4 gap-3 animate-pulse">
            <div className="h-6 w-2/3 bg-gray-800/10 rounded-lg"></div>
            <div className="h-3 w-1/2 bg-gray-200 rounded-lg"></div>
            <div className="h-8 w-32 bg-gray-800/20 rounded-full mt-2"></div>
            <div className="w-full h-32 bg-orange-50 rounded-xl mt-6 border border-orange-100"></div>
          </div>
        );
      case 'grid':
        return (
          <div className="flex flex-col gap-4 mt-2 px-2 animate-pulse">
             <div className="h-8 w-3/4 bg-gray-800/10 rounded-lg"></div>
             <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="h-24 bg-green-50 rounded-lg border border-green-100"></div>
                <div className="h-24 bg-green-50 rounded-lg border border-green-100"></div>
                <div className="h-24 bg-green-50 rounded-lg border border-green-100"></div>
                <div className="h-24 bg-green-50 rounded-lg border border-green-100"></div>
             </div>
          </div>
        );
      case 'feature':
        return (
           <div className="flex gap-4 items-center h-48 px-2 mt-2 animate-pulse">
              <div className="w-5/12 h-full bg-purple-50 rounded-r-xl border-y border-r border-purple-100"></div>
              <div className="w-7/12 flex flex-col gap-2">
                  <div className="h-5 w-full bg-gray-800/10 rounded-md"></div>
                  <div className="h-2 w-full bg-gray-100 rounded-md"></div>
                  <div className="h-2 w-5/6 bg-gray-100 rounded-md"></div>
                  <div className="h-2 w-full bg-gray-100 rounded-md"></div>
                  <div className="h-8 w-24 bg-purple-100 rounded-md mt-2"></div>
              </div>
           </div>
        );
      case 'minimal':
        return (
           <div className="flex flex-col px-4 mt-6 animate-pulse gap-6">
              <div className="h-12 w-10/12 bg-gray-900/5 rounded-xl"></div>
              <div className="flex gap-3">
                 <div className="h-20 w-1/3 bg-gray-50 border border-gray-100 rounded-lg"></div>
                 <div className="h-20 w-1/3 bg-gray-50 border border-gray-100 rounded-lg"></div>
                 <div className="h-20 w-1/3 bg-gray-50 border border-gray-100 rounded-lg"></div>
              </div>
              <div className="h-32 w-full bg-gray-100 rounded-xl"></div>
           </div>
        );
      case 'split':
      default:
        return (
          <div className="flex gap-6 items-center h-40 px-2 animate-pulse">
             <div className="w-1/2 flex flex-col gap-3">
                <div className="h-6 w-3/4 bg-gray-800/10 rounded-lg"></div>
                <div className="h-6 w-1/2 bg-gray-800/10 rounded-lg"></div>
                <div className="h-3 w-full bg-gray-100 rounded-lg mt-1"></div>
                <div className="h-8 w-28 bg-gray-900/10 rounded-md mt-2"></div>
             </div>
             <div className="w-1/2 h-full bg-blue-50 rounded-tl-[40px] rounded-br-[40px] border border-blue-100 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-blue-100/50"></div>
             </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-white p-4 overflow-hidden">
      {/* Nav Bar Skeleton */}
      <div className="flex justify-between items-center mb-6 px-2">
        <div className="h-2 w-20 bg-gray-200 rounded-full"></div>
        <div className="flex gap-3">
           <div className="h-2 w-12 bg-gray-100 rounded-full"></div>
           <div className="h-2 w-12 bg-gray-100 rounded-full"></div>
        </div>
      </div>

      {renderContent()}

      {/* Bottom Grid (Common Footer/Features) */}
      <div className="grid grid-cols-3 gap-3 mt-auto mb-2 px-2">
          <div className="h-12 bg-gray-50 rounded-lg border border-gray-100"></div>
          <div className="h-12 bg-gray-50 rounded-lg border border-gray-100"></div>
          <div className="h-12 bg-gray-50 rounded-lg border border-gray-100"></div>
      </div>
    </div>
  );
};

// --- 2. Mock Browser Component (UNCHANGED) ---
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
            { variant: 'grid' }
        ],
        [
            { variant: 'centered' }, 
            { variant: 'feature' }
        ],
        [
            { variant: 'minimal' }, 
            { variant: 'split' }
        ],
        [
            { variant: 'grid' }, 
            { variant: 'centered' }
        ]
    ];

    const [activePairIndex, setActivePairIndex] = useState(0);
    
    useEffect(() => {
        const timer = setTimeout(() => {
            setActivePairIndex((prev) => (prev + 1) % templatePairs.length);
        }, 4000);

        return () => clearTimeout(timer);
    }, [activePairIndex]);

    const blinkVariants = {
        initial: { opacity: 0, scale: 0.98 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 1.02 },
    };

    return (
        <div className="flex h-screen font-sans overflow-hidden">
            
            {/* --- LEFT SIDE (MODIFIED) --- */}
            <div className="w-1/2 flex flex-col justify-between p-16 bg-white z-20 shadow-[10px_0_30px_rgba(0,0,0,0.02)] relative">
                
                {/* LOGO: Absolutely positioned top-left */}
                <div className="absolute top-10 left-10 text-3xl font-bold text-gray-900 not-italic tracking-tight">
                    BizVistar
                </div>

                {/* Main Content Container - Centered Vertically */}
                <div className="flex flex-col justify-center h-full">
                    
                    {/* HEADING */}
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 not-italic leading-snug">
                        What type of website do you want to create?
                    </h2>
                    
                    {/* SEARCH BAR CONTAINER: Width decreased (max-w-lg) */}
                    <div className="relative ml-5 mb-6 max-w-lg" ref={autocompleteRef}>
                        <div className="flex items-end space-x-4">
                            <div className="relative flex-grow">
                                <svg className="absolute left-1 top-1/2 -translate-y-1/2 w-5 h-5 text-black-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                </svg>
                                {/* INPUT */}
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
                            {/* BUTTON */}
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
                    
                    {/* EXAMPLES HEADER */}
                    <p className="text-xs  ml-10  font-semibold text-gray-400 mb-2 tracking-widest uppercase pl-0">
                        Examples
                    </p>
                    {/* EXAMPLES LIST: Increased size (text-lg) & Black Hover */}
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
                
                {/* Back Button (Bottom Left) */}
                <div>
                    <Link href="/">
                        <button className="text-gray-600 hover:text-gray-900 font-medium text-sm flex items-center gap-1">
                             Back
                        </button>
                    </Link>
                </div>
            </div>

            {/* --- RIGHT SIDE (Unchanged) --- */}
            <div className="w-1/2 bg-gray-50 relative overflow-hidden flex items-center justify-center">
                {/* 1. Background Grid */}
                <div className="absolute inset-0 z-0 pointer-events-none opacity-60">
                   <GridBackgroundDemo />
                </div>

                {/* 2. Floating Templates Container */}
                <div className="relative z-10 w-full h-full flex items-center justify-center">
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={activePairIndex}
                            variants={blinkVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            transition={{ duration: 0.25, ease: "easeInOut" }} 
                            className="relative w-[900px] h-[650px]"
                        >
                            {/* Card 1 */}
                            <MockBrowser 
                                variant={templatePairs[activePairIndex][0].variant}
                                className="top-[5%] left-[8%] w-[300px] h-[420px] z-20 hover:z-30"
                            />

                            {/* Card 2 */}
                            <MockBrowser 
                                variant={templatePairs[activePairIndex][1].variant}
                                className="top-[10%] right-[8%] w-[300px] h-[420px] z-20 hover:z-30"
                            />
                            
                            {/* Decorative Blob */}
                            <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-200/20 rounded-full blur-[80px] z-0 pointer-events-none"></div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}