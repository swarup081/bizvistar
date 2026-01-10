// src/app/get-started/3/page.js
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { GridBackgroundDemo } from "@/components/GridBackgroundDemo";
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MapPin, Calendar, ShoppingBag, Tags, Menu } from 'lucide-react'; // Menu added for versatility
import Logo from '@/lib/logo/Logo';

// --- Shared Styles & Logic (Consistent with Step 2) ---
const stylesMap = {
  default: { colors: ['#F9FAFB', '#E5E7EB', '#1F2937'] },
  elegant: { colors: ['#FAFAF9', '#F0EEE8', '#5A534B'] },
  cozy: { colors: ['#FFF7ED', '#FFEDD5', '#9A3412'] },
  modern: { colors: ['#F8FAFC', '#E8EDF5', '#1E293B'] },
  trusted: { colors: ['#F0F9FF', '#E0F2FE', '#0369A1'] },
  minimal: { colors: ['#FFFFFF', '#F3F4F6', '#111827'] },
  bold: { colors: ['#F9FAFB', '#E5E7EB', '#1F2937'] },
  vintage: { colors: ['#FEFCE8', '#F3F4F6', '#713F12'] },
  playful: { colors: ['#FFF1F2', '#FFE4E6', '#BE123C'] },
  natural: { colors: ['#F0FDF4', '#DCFCE7', '#166534'] },
  handcrafted: { colors: ['#FFEDD5', '#FFDCC2', '#7C2D12'] },
  luxury: { colors: ['#F9F9F9', '#EDEDF0', '#27272A'] },
  fast: { colors: ['#FEF2F2', '#FEE2E2', '#991B1B'] }
};

const getThemeLogic = (selectedVibes, activeVibe) => {
  if (!selectedVibes) return { mixedColors: stylesMap.default.colors };
  const activeKeys = Object.keys(selectedVibes).filter(key => selectedVibes[key]);
  
  let mixedColors = [...stylesMap.default.colors];
  if (activeKeys.length >= 1) {
     const primaryStyle = stylesMap[activeKeys[0]] || stylesMap.default;
     mixedColors = [...primaryStyle.colors];
  }
  return { mixedColors };
};

// --- BASE CARD TEMPLATE (Enforces uniform size/position and clean UI) ---
const BaseCard = ({ colors, title, subtitle, mainContent }) => (
  <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="w-[260px] bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 h-[320px] flex flex-col" 
  >
      {/* Header - Fixed to original style */}
      <div className="px-5 py-4 border-b border-slate-100 flex-shrink-0 " style={{ backgroundColor: colors[1] }}>
          <p className="text-[11px] font-bold uppercase tracking-wide" style={{ color: colors[2] }}>
              SUBJECT: <span className="font-normal normal-case opacity-70">{title}</span>
          </p>
      </div>
      {/* Content Body - Uses main background color, ensuring uniformity and cleanliness */}
      <div className="p-5 text-center flex flex-col items-center flex-grow" style={{ backgroundColor: colors[0], color: colors[2], minHeight: '230px' }}>
          {/* NEW: Use a distinct font for subtitle, like a bold sans-serif */}
          <h3 className="text-gray-900 font-bold text-sm mb-2 tracking-wide not-italic">{subtitle}</h3> 
          {/* Content Wrapper to hold elements and use remaining space */}
          <div className="flex-grow w-full flex flex-col items-center justify-center">
              {mainContent}
          </div>
      </div>
  </motion.div>
);


// --- VISUAL COMPONENT 1: Order Confirmation (UI Improved) ---
const OrderVisualComp = ({ colors }) => (
<BaseCard
  colors={colors}
  title="Order confirmation"
  subtitle="Order Confirmed! Preparing Delivery"
  mainContent={(
      <>
          <p className="text-[10px] text-gray-500 leading-relaxed mb-4 px-2">
              Order is confirmed and successfully paid.
          </p>
          {/* Main Content Block (Order Summary) */}
          <div className="w-full p-3 rounded-lg text-left text-gray-900 border" style={{ backgroundColor: colors[1], borderColor: colors[2], opacity: 0.2 }}>
              
              {/* Simulated Header Row */}
              <div className="flex justify-between items-center py-1 border-b border-white/60">
                  <div className="h-3 w-16 bg-white rounded-full font-bold text-xs"></div>
                  <div className="h-3 w-8" style={{ backgroundColor: colors[2], opacity: 0.4 }}></div>
              </div>
              {/* Simulated Item 1 */}
              <div className="flex justify-between items-center py-1 border-b border-white/60">
                  <div className="h-3 w-12 bg-white rounded-full text-xs"></div>
                  <div className="h-3 w-8" style={{ backgroundColor: colors[2], opacity: 0.4 }}></div>
              </div>
              {/* Simulated Total - Higher contrast bar */}
              <div className="flex justify-between items-center pt-3 mt-2 font-bold border-t border-white/80">
                  <span className="text-xs">Total</span>
                  <div className="ml-auto h-2 w-1/5 rounded-full" style={{ backgroundColor: colors[2], opacity: 0.6 }}></div>
                  </div>
          </div>
          {/* Delivery Status Bar - Cleaner, higher contrast status text */}
          <div className="h-8 w-full mt-3 rounded-md flex items-center px-3 font-medium text-xs border" style={{ backgroundColor: colors[0], borderColor: colors[2], opacity: 0.2 }}>
              <span className="text-xs" style={{ color: colors[2], opacity: 0.8 }}>Status: In Progress</span>
              <div className="ml-auto h-2 w-1/4 rounded-full" style={{ backgroundColor: colors[2], opacity: 0.6 }}></div>
          </div>
      </>
  )}
/>
);

// --- VISUAL COMPONENT 2: Reviews ---
const ReviewVisualComp = ({ colors }) => (
<BaseCard
  colors={colors}
  title="New Customer Review"
  subtitle="You received a 5-Star Review"
  mainContent={(
      <>
          <p className="text-[10px] text-gray-500 leading-relaxed mb-4 px-2">
              "I absolutely love the quality and the attention to detail."
          </p>
          <div className="w-full text-left p-4 rounded-lg shadow-inner" style={{ backgroundColor: colors[1] }}>
              <div className="flex gap-0.5 mb-3 justify-items-start">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 fill-current text-yellow-500" />)}
              </div>
              {/* Text placeholders */}
              <div className="h-3 w-full bg-white rounded-full mb-1.5"></div>
              <div className="h-3 w-3/4 bg-white rounded-full"></div>
              
              <div className="flex items-center gap-2 mt-4 pt-2 border-t border-white/40">
                  <div className="w-6 h-6 rounded-full" style={{ backgroundColor: colors[2], opacity: 0.8 }}></div>
                  <div className="h-2 w-16 bg-white rounded-full"></div>
              </div>
          </div>
      </>
  )}
/>
);

// --- VISUAL COMPONENT 3: Inventory / Dashboard ---
const InventoryVisualComp = ({ colors }) => (
<BaseCard
  colors={colors}
  title="Low Stock Alert"
  subtitle="Check inventory for quick action"
  mainContent={(
      <>
          <p className="text-[10px] text-gray-500 leading-relaxed mb-4 px-2">
              Product stock levels require immediate attention.
          </p>
          <div className="w-full p-3 rounded-lg shadow-inner" style={{ backgroundColor: colors[1] }}>
              {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3 p-1.5 hover:opacity-80 transition-colors">
                      <div className="w-8 h-8 rounded flex-shrink-0" style={{ backgroundColor: colors[2], opacity: 0.3 }}></div> 
                      <div className="flex-grow min-w-0 text-left">
                          <div className="h-2 w-20 bg-white rounded mb-1"></div>
                          <div className="h-1.5 w-12 bg-white/70 rounded"></div>
                      </div>
                      <div className="text-right">
                          <span className="text-xs font-bold" style={{ color: colors[2] }}>{12 * i}</span> 
                          <p className="text-[8px] text-gray-500">units</p>
                      </div>
                  </div>
              ))}
              <div className="h-6 w-full rounded-md mt-2" style={{ backgroundColor: colors[2], opacity: 0.1 }}></div>
          </div>
      </>
  )}
/>
);

// --- VISUAL COMPONENT 4: Menu / List (Generic Text) ---
const MenuVisualComp = ({ colors }) => (
<BaseCard
  colors={colors}
  title="Digital Menu Preview"
  subtitle="Explore our featured list"
  mainContent={(
      <>
          <p className="text-[10px] text-gray-500 leading-relaxed mb-4 px-2">
              Digital list of available items or services for customers.
          </p>
          <div className="w-full p-4 rounded-lg shadow-inner" style={{ backgroundColor: colors[1] }}>
               <Menu className="w-8 h-8 mx-auto mb-3" style={{ color: colors[2], opacity: 0.8 }} />
              <div className="space-y-1 text-left">
                  {[1, 2, 3].map((i) => (
                      <div key={i} className="flex justify-between items-center py-1 border-b border-white/40 last:border-b-0">
                          <div>
                              {/* Generic placeholders for item details */}
                              <div className="h-3 w-24 font-bold bg-white rounded-full"></div> 
                              <div className="h-2 w-16 text-[9px] bg-white/70 rounded-full mt-0.5"></div>
                          </div>
                          <span className="text-sm font-medium" style={{ color: colors[2] }}>{7 + i * 2}.00</span>
                      </div>
                  ))}
              </div>
          </div>
      </>
  )}
/>
);

// --- VISUAL COMPONENT 5: Booking (UI Improved, No Checkmark) ---
const BookingVisualComp = ({ colors }) => (
<BaseCard
  colors={colors}
  title="Appointment Details"
  subtitle="Details Confirmed"
  mainContent={(
      <>
          {/* Cleaner, softer status circle/icon placeholder */}
          <div className="mt-2 w-12 h-12 rounded-full mx-auto flex items-center justify-center border-4" style={{ borderColor: colors[2], opacity: 0.2 }}>
               <Calendar className="w-6 h-6" style={{ color: colors[2], opacity: 0.8 }} />
          </div>
          
          {/* Main Content Block */}
          <div className="w-full p-4 mt-4 rounded-lg text-left text-gray-900 space-y-3" style={{ backgroundColor: colors[1] }}>
               
               {/* Simulated Name/Service - Service Title */}
               <div className="flex items-center gap-3 text-sm border-b border-white/50 pb-2">
                   <span className="text-xs text-gray-600">Service:</span>
                   <div className="h-3 w-3/5 rounded-full bg-white font-bold"></div>
               </div>

               {/* Date/Time */}
               <div className="flex items-center gap-3 text-sm">
                   <Calendar className="w-4 h-4" style={{ color: colors[2], opacity: 0.8 }} />
                   <div className="h-3 w-32 rounded-full bg-white"></div>
               </div>
               {/* Address */}
               <div className="flex items-center gap-3 text-sm">
                   <MapPin className="w-4 h-4" style={{ color: colors[2], opacity: 0.8 }} />
                   <div className="h-3 w-24 rounded-full bg-white"></div>
               </div>
               {/* Action button placeholder */}
               <div className="h-8 w-full mt-3 rounded-md" style={{ backgroundColor: colors[2], opacity: 0.2 }}></div>
          </div>
      </>
  )}
/>
);

// --- VISUAL COMPONENT 6: Promo Code ---
const PromoVisualComp = ({ colors }) => (
<BaseCard
  colors={colors}
  title="Active Promotion"
  subtitle="Save on your next purchase"
  mainContent={(
      <>
          <p className="text-[10px] text-gray-500 leading-relaxed mb-4 px-2">
              Automatically apply your promotion at checkout.
          </p>
          <div className="w-full p-4 rounded-lg shadow-inner" style={{ backgroundColor: colors[1] }}>
               <Tags className="w-8 h-8 mx-auto" style={{ color: colors[2], opacity: 0.8 }} />
              <div className="text-center mt-3">
                  <h4 className="text-3xl font-bold mb-1 font-serif">CODE15</h4>
                  <p className="text-xs text-gray-600">Use this code for 15% off</p>
              </div>
              <div className="h-10 w-full rounded-md mt-3" style={{ backgroundColor: colors[2], opacity: 0.2 }}></div>
          </div>
      </>
  )}
/>
);


// List of features to cycle through
const CYCLE_FEATURES = [
  'delivery', 
  'reviews', 
  'inventory', 
  'menu', 
  'booking', 
  'discounts'
];

// --- Dynamic Overlay Manager (Now a self-cycling carousel) ---
const DynamicVisualOverlay = ({ colors }) => {
    const [cycleIndex, setCycleIndex] = useState(0);
    const featureId = CYCLE_FEATURES[cycleIndex];

    // Auto-cycle logic
    useEffect(() => {
        const interval = setInterval(() => {
            setCycleIndex(prevIndex => (prevIndex + 1) % CYCLE_FEATURES.length);
        }, 3000); // Change every 3 seconds

        return () => clearInterval(interval);
    }, []);

    const getVisual = (id) => {
        switch (id) {
            case 'delivery':
            case 'store':
            case 'products':
            case 'payments':
                return <OrderVisualComp colors={colors} />;
            case 'reviews':
            case 'testimonials':
                return <ReviewVisualComp colors={colors} />;
            case 'inventory':
                return <InventoryVisualComp colors={colors} />;
            case 'menu':
            case 'gallery':
            case 'portfolio':
                return <MenuVisualComp colors={colors} />;
            case 'booking':
            case 'appointments':
            case 'contact':
                return <BookingVisualComp colors={colors} />;
            case 'discounts':
            case 'promocodes':
                return <PromoVisualComp colors={colors} />;
            default:
                return <OrderVisual colors={colors} />;
        }
    };

    return (
        <AnimatePresence mode="wait">
            <div key={featureId || 'default'}>
                {getVisual(featureId)}
            </div>
        </AnimatePresence>
    );
};

// --- Template Skeleton (Background) ---
const TemplateSkeleton = ({ storeName, colors }) => {
    const bg = colors ? colors[0] : '#F9FAFB';
    const secondary = colors ? colors[1] : '#E5E7EB';
    const accent = colors ? colors[2] : '#1F2937';

    return (
<div className="w-full h-full flex flex-col bg-white overflow-hidden rounded-tl-[2rem]">
            {/* Navbar */}
            <div 
                className="h-20 border-b border-slate-100 flex items-center justify-between px-8 shrink-0 bg-white/80 backdrop-blur-sm transition-colors duration-500"
            >
                <div className="flex gap-4 items-center">
                    {/* Logo Box: Uses the accent color very subtly */}
                    <div 
                        className="h-10 w-10 rounded-2xl flex items-center justify-center font-bold text-sm shadow-sm transition-colors duration-500"
                        style={{ 
                            backgroundColor: colors[0], 
                            color: colors[2] 
                        }}
                    >
                        {storeName ? storeName.charAt(0).toUpperCase() : 'B'}
                    </div>
                    <div className="hidden md:flex gap-3 items-center">
                        {storeName ? (
                            <span className="text-3xl font-extrabold tracking-wide transition-colors duration-500" style={{ color: colors[2], opacity: 0.9 }}>
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
                    {/* CTA Button: Uses the secondary color lightly */}
                    <div 
                        className="h-10 w-24 rounded-full transition-colors duration-500"
                        style={{ backgroundColor: colors[1], opacity: 0.5 }}
                    ></div>
                </div>
            </div>

            <div className="flex-grow p-8 flex flex-col gap-8 overflow-y-auto no-scrollbar bg-slate-50/20">
                {/* Hero Section */}
                <div className="w-full aspect-[2.5/1] bg-white/90 rounded-[2.5rem] border border-slate-100 relative overflow-hidden flex p-10 gap-10 items-center shadow-[0_4px_20px_-8px_rgba(0,0,0,0.05)]">
                    {/* Hero Image Placeholder - Uses background color tint */}
                    <div className="w-1/2 h-full rounded-[1.5rem] border border-slate-100 relative overflow-hidden transition-colors duration-500" style={{ backgroundColor: colors[0] }}>
                         {/* Subtle Blobs - Only visible as a tint */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full mix-blend-multiply filter blur-2xl opacity-30 transition-colors duration-500" style={{ backgroundColor: colors[1] }}></div>
                    </div>
                    
                    {/* Hero Text Placeholders */}
                    <div className="w-1/2 space-y-5 z-10">
                        <div className="h-4 w-20 rounded-full text-xs flex items-center justify-center font-bold uppercase tracking-wider transition-colors duration-500" style={{ backgroundColor: colors[1], color: colors[2], opacity: 0.6 }}></div>
                        <div className="space-y-3">
                            <div className="h-6 w-full bg-slate-200/60 rounded-2xl"></div>
                            <div className="h-6 w-3/4 bg-slate-200/60 rounded-2xl"></div>
                        </div>
                        <div className="h-12 w-36 rounded-full mt-4 transition-colors duration-500" style={{ backgroundColor: colors[2], opacity: 0.1 }}></div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6 auto-rows-[11rem]">
                    
                    {/* 1. Big Integrated Grid (Spans 2 rows, taking the place of 1 & 3) */}
                    <div className="row-span-2 bg-white rounded-[2rem] border border-slate-100 p-6 flex flex-col justify-between shadow-[0_2px_15px_-6px_rgba(0,0,0,0.03)] group hover:shadow-md transition-shadow">
                        <div 
                            className="w-full flex-grow rounded-2xl border border-slate-50 transition-colors duration-500 mb-4 relative overflow-hidden"
                            style={{ backgroundColor: colors[0] }}
                        >
                             {/* Subtle detail inside big card */}
                            <div className="absolute bottom-4 left-4 h-8 w-8 rounded-full bg-white/60"></div>
                        </div>
                        <div className="space-y-2.5 shrink-0">
                            <div className="h-3 w-1/3 bg-slate-200/80 rounded-full"></div>
                            <div className="h-2 w-full bg-slate-100 rounded-full"></div>
                            <div className="h-2 w-3/4 bg-slate-100 rounded-full"></div>
                        </div>
                    </div>

                    {/* 2. Top Right Card */}
                    <div className="bg-white rounded-[2rem] border border-slate-100 p-6 flex flex-col justify-between shadow-[0_2px_15px_-6px_rgba(0,0,0,0.03)] group hover:shadow-md transition-shadow">
                        <div 
                            className="h-10 w-10 rounded-2xl border border-slate-50 transition-colors duration-500"
                            style={{ backgroundColor: colors[0] }}
                        ></div>
                        <div className="space-y-2.5">
                            <div className="h-3 w-1/2 bg-slate-200/80 rounded-full"></div>
                            <div className="h-2 w-full bg-slate-100 rounded-full"></div>
                        </div>
                    </div>

                    {/* 3. Bottom Right Card */}
                    <div className="bg-white rounded-[2rem] border border-slate-100 p-6 flex flex-col justify-between shadow-[0_2px_15px_-6px_rgba(0,0,0,0.03)] group hover:shadow-md transition-shadow">
                        <div 
                            className="h-10 w-10 rounded-2xl border border-slate-50 transition-colors duration-500"
                            style={{ backgroundColor: colors[0] }}
                        ></div>
                        <div className="space-y-2.5">
                             <div className="h-3 w-1/2 bg-slate-200/80 rounded-full"></div>
                             <div className="h-2 w-full bg-slate-100 rounded-full"></div>
                        </div>
                    </div>

                </div>
        </div>
        </div>
    );
};

// --- Mock Browser Container ---
const MockBrowser = ({ storeName, selectedVibes, activeVibe, hoveredFeature, className }) => {
    const siteSlug = storeName ? storeName.toLowerCase().replace(/[^a-z0-9]/g, '') : 'your-site';
    const { mixedColors } = getThemeLogic(selectedVibes, activeVibe);

    return (
        <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className={`absolute bg-white rounded-tl-[2.5rem] shadow-[0_20px_80px_-20px_rgba(0,0,0,0.32)] border-l border-t border-gray-200/60 flex flex-col ${className}`}
        >
            {/* Floating Visual Card */}
            <div className="absolute -left-[130px] top-[240px] z-50">
                 <DynamicVisualOverlay hoveredFeature={hoveredFeature} colors={mixedColors} />
            </div>

            {/* Browser Header */}
            <div className="h-16 border-b border-slate-100 flex items-center px-6 gap-5 shrink-0 z-20 relative rounded-tl-[2.5rem] bg-white">
                <div className="flex gap-2.5">
                    <div className="w-3.5 h-3.5 rounded-full bg-[#FF5F57] border border-black/5"></div>
                    <div className="w-3.5 h-3.5 rounded-full bg-[#FFBD2E] border border-black/5"></div>
                    <div className="w-3.5 h-3.5 rounded-full bg-[#28C840] border border-black/5"></div>
                </div>
                <div className="flex-grow h-10 bg-slate-50 border border-slate-200/60 rounded-3xl flex items-center px-4 justify-start gap-3 relative transition-colors duration-300">
                     <div className="w-4 h-4 rounded-full bg-gray-300"></div>
                     <span className="text-sm text-slate-500 font-medium truncate font-sans tracking-wide transition-colors">
                        <span className="text-slate-600 font-bold">{siteSlug}</span>.bizvistar.in
                     </span>
                </div>
            </div>
            
            {/* Main Skeleton */}
            <div className="flex-grow relative overflow-hidden bg-white">
                <TemplateSkeleton storeName={storeName} colors={mixedColors} />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-slate-50/20 pointer-events-none"></div>
            </div>
        </motion.div>
    );
};

// --- Feature Chip (Pill style from Step 2) ---
const FeatureChip = ({ id, label, isSelected, onChange, onHover }) => (
    <label
      htmlFor={id}
      onMouseEnter={() => onHover(id)} // Trigger visual change
      className={`flex items-center justify-center px-4 py-3 border rounded-full cursor-pointer transition-all duration-200 select-none text-center text-sm font-medium ${
        isSelected
          ? 'border-black bg-gray-900 text-white shadow-md' // Selected
          : 'border-gray-300 bg-white text-gray-600 hover:border-gray-900 hover:text-gray-900' // Default
      }`}
    >
      {label}
      <input id={id} type="checkbox" className="hidden" checked={isSelected} onChange={onChange} />
    </label>
);

// --- Dynamic Feature Sets ---
const FEATURE_SETS = {
  food: [
    { id: 'menu', label: 'Digital Menu (QR)' },
    { id: 'delivery', label: 'Home Delivery' },
    { id: 'booking', label: 'Table Booking' },
    { id: 'location', label: 'Location & Hours' },
    { id: 'reviews', label: 'Customer Reviews' },
    { id: 'gallery', label: 'Food Gallery' },
  ],
  retail: [
    { id: 'store', label: 'Online Store' },
    { id: 'shipping', label: 'Home Delivery' },
    { id: 'inventory', label: 'Inventory Mgmt' },
    { id: 'discounts', label: 'Promo Codes' },
    { id: 'reviews', label: 'Product Reviews' },
    { id: 'payments', label: 'Online Payments' },
  ],
  service: [
    { id: 'appointments', label: 'Book Appointments' },
    { id: 'services', label: 'Service Menu' },
    { id: 'team', label: 'Our Team' },
    { id: 'contact', label: 'Contact Form' },
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'portfolio', label: 'Work Portfolio' },
  ],
  default: [
    { id: 'products', label: 'Physical Products' },
    { id: 'digital', label: 'Digital Products' },
    { id: 'services', label: 'Services' },
    { id: 'dropshipping', label: 'Dropshipping' },
    { id: 'pod', label: 'Print-on-Demand' },
    { id: 'blog', label: 'Blog / Content' },
  ]
};

export default function StepThree() {
  const [storeName, setStoreName] = useState('your business');
  const [businessType, setBusinessType] = useState('');
  const [selectedFeatures, setSelectedFeatures] = useState({});
  const [features, setFeatures] = useState(FEATURE_SETS.default);
  
  // Theme state
  const [selectedVibes, setSelectedVibes] = useState({});
  const [activeVibe, setActiveVibe] = useState('modern');
  
  // Hover state for dynamic visual
  const [hoveredFeature, setHoveredFeature] = useState('default');

  // --- Load Data ---
  useEffect(() => {
    const storedStoreName = localStorage.getItem('storeName');
    if (storedStoreName) setStoreName(storedStoreName);

    const storedType = localStorage.getItem('businessType') || '';
    setBusinessType(storedType);
    
    const storedVibes = localStorage.getItem('businessVibes');
    if (storedVibes) {
        const parsedVibes = JSON.parse(storedVibes);
        setSelectedVibes(parsedVibes);
        const keys = Object.keys(parsedVibes).filter(k => parsedVibes[k]);
        if (keys.length > 0) setActiveVibe(keys[keys.length - 1]);
    }

    const lowerType = storedType.toLowerCase();

    // Determine appropriate features based on business type input
    if (['restaurant', 'cafe', 'bakery', 'food', 'coffee', 'sweet', 'kitchen', 'catering', 'bar', 'pub'].some(t => lowerType.includes(t))) {
        setFeatures(FEATURE_SETS.food);
        setHoveredFeature('menu'); // Default visual
    } else if (['shop', 'store', 'boutique', 'retail', 'mart', 'jewellery', 'clothing', 'fashion', 'market'].some(t => lowerType.includes(t))) {
        setFeatures(FEATURE_SETS.retail);
        setHoveredFeature('store'); // Default visual
    } else if (['salon', 'clinic', 'doctor', 'gym', 'yoga', 'consultant', 'agency', 'repair', 'service', 'dentist', 'lawyer'].some(t => lowerType.includes(t))) {
        setFeatures(FEATURE_SETS.service);
        setHoveredFeature('appointments'); // Default visual
    } else {
        setFeatures(FEATURE_SETS.default);
    }
  }, []);

  const handleFeatureChange = (id) => {
    setSelectedFeatures(prev => ({ ...prev, [id]: !prev[id] }));
  };
  
  const handleContinue = () => {
      localStorage.setItem('selectedFeatures', JSON.stringify(selectedFeatures));
  }

  return (
    <div className="flex h-screen font-sans overflow-hidden bg-white">
      
      {/* --- LEFT SIDE (Form) --- */}
      <div className="w-full lg:w-[45%] flex flex-col justify-between p-16 xl:p-20 bg-white z-30 relative shadow-[20px_0_40px_-10px_rgba(0,0,0,0.03)]">
        <div className="absolute top-4 left-10 text-3xl font-bold text-gray-900 not-italic tracking-tight">
            <Logo/>
        </div>

        <div className="flex flex-col justify-center h-full max-w-md ml-2">
            <p className="text-xs font-bold text-gray-400 mb-6 tracking-widest uppercase">
              STEP 3 OF 3
            </p>
            <h2 className="text-3xl font-bold text-gray-900 mb-4 leading-snug not-italic">
              What features does <span className="text-gray-500">{storeName}</span> need?
            </h2>
            <p className="text-gray-400 text-sm mb-10">
              Select the tools you need. We&apos;ll set them up for you.
            </p>

            {/* Dynamic Feature Grid (Pills) */}
            <div className="grid grid-cols-2 gap-3 mb-8">
                {features.map(feature => (
                    <FeatureChip
                        key={feature.id}
                        id={feature.id}
                        label={feature.label}
                        isSelected={!!selectedFeatures[feature.id]}
                        onChange={() => handleFeatureChange(feature.id)}
                        onHover={setHoveredFeature} // Pass setter to update visual on hover
                    />
                ))}
            </div>
        </div>

        <div className="flex items-center justify-between w-full">
            <Link href="/get-started/2">
                <button className="text-gray-600 hover:text-gray-900 font-medium text-m flex items-center gap-1 transition-colors">
                ← Back
                </button>
            </Link>

            <Link href="/templates" passHref>
                <button
                    onClick={handleContinue}
                    className="px-8 py-2.5 bg-gray-900 text-white font-medium text-sm rounded-full hover:bg-gray-700 transition-colors shadow-sm"
                >
                    Finish
                </button>
            </Link>
        </div>
      </div>

      {/* --- RIGHT SIDE (Visuals) --- */}
      <div className="hidden lg:block lg:w-[55%] bg-gray-50 relative overflow-hidden border-l border-gray-100">
        <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
           <GridBackgroundDemo />
        </div>
        <div className="relative w-full h-full">
             {/* Mock Browser with Themed Skeleton & Dynamic Card */}
             <MockBrowser 
                storeName={storeName}
                selectedVibes={selectedVibes}
                activeVibe={activeVibe}
                hoveredFeature={hoveredFeature}
                className="absolute top-[10%] left-[35%] w-[100%] h-[100%] z-20"
             />
        </div>
      </div>
    </div>
  );
}