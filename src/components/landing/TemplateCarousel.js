'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { templates } from '@/lib/data/templates';
import Link from 'next/link';

// 1. ID-BASED DATA LOOKUP
const templateDetailsMap = {
  0: { 
    category: 'Fashion & Apparel', 
    tag: 'High Volume Sales', 
    feature: 'Instagram Feed Ready' 
  },
  1: { 
    category: 'Electronics & Tech', 
    tag: 'Specs Optimized', 
    feature: 'Comparison Tables' 
  },
  2: { 
    category: 'Home & Living', 
    tag: 'Gallery Focused', 
    feature: '3D Product View' 
  },
  3: { 
    category: 'Beauty & Cosmetics', 
    tag: 'Brand Story', 
    feature: 'Subscription Models' 
  },
  default: { 
    category: 'Multi-Purpose', 
    tag: 'Conversion Ready', 
    feature: 'SEO Optimized' 
  }
};

export default function TemplateCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide logic
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000); 
    return () => clearInterval(interval);
  }, [currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % templates.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + templates.length) % templates.length);
  };

  return (
    <div className="w-full py-20 bg-white overflow-hidden relative group">
      <div className="max-w-7xl mx-auto px-6 relative">
        
        {/* Header */}
        <div className="text-center mb-20">
           <h2 className="text-6xl not-italic font-bold text-gray-900 mb-4">
              Stunning Designs <br/> for Every Business possible
           </h2>
           <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose from our professionally designed templates. Fully customizable and optimized for conversion.
           </p>
        </div>

        {/* Carousel Container */}
        <div className="relative h-[650px] flex items-center justify-center perspective-1000">
           <AnimatePresence initial={false} mode="popLayout">
              {templates.map((template, index) => {
                 const offset = (index - currentIndex + templates.length) % templates.length;
                 
                 let position = 0; 
                 if (index === currentIndex) position = 0;
                 else if (index === (currentIndex - 1 + templates.length) % templates.length) position = -1;
                 else if (index === (currentIndex + 1) % templates.length) position = 1;
                 else position = 2; // Hidden

                 if (position === 2) return null;

                 const isActive = position === 0;
                 const details = templateDetailsMap[index] || templateDetailsMap.default;

                 return (
                    <motion.div
                       key={template.title}
                       // ADDED: Added 'group' to detect hover on the entire active card
                       className="absolute top-0 w-[680px] cursor-pointer group"
                       initial={{ 
                          opacity: 0, 
                          x: position === 1 ? 900 : -900,
                          scale: 0.8,
                          zIndex: 0 
                       }}
                       animate={{ 
                          opacity: isActive ? 1 : 0.4,
                          x: isActive ? 0 : (position === -1 ? -850 : 850),
                          y: isActive ? 0 : 30,
                          scale: isActive ? 1 : 0.85,
                          zIndex: isActive ? 10 : 1,
                          filter: isActive ? 'blur(0px)' : 'blur(0px)'
                       }}
                       exit={{ 
                          opacity: 0,
                          scale: 0.8,
                          x: position === -1 ? 900 : -900 
                       }}
                       transition={{ duration: 0.6, ease: "easeInOut" }}
                       onClick={() => {
                          if (position === -1) handlePrev();
                          else if (position === 1) handleNext();
                          // ADDED: Redirect when the active template is clicked
                          else if (position === 0) window.open(template.previewUrl, '_blank'); 
                       }}
                    >
                       {/* DEVICE FRAME */}
                       <div
                         className={`transition-all duration-500 ease-in-out ${
                           isActive
                             ? 'bg-gray-900 shadow-2xl px-5 pt-5 pb-0'
                             : 'bg-transparent shadow-xl p-0'
                         }`}
                       >
                           {/* INNER CONTENT WRAPPER */}
                           <div className="overflow-hidden bg-white relative h-[420px] w-full">
                               {/* Browser Bar - Square Buttons */}
                               <div className="h-8 bg-gray-100 border-b border-gray-200 flex items-center px-4 gap-2 absolute top-0 w-full z-10">
                                  <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                                  <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                               </div>

                               {/* Iframe Preview */}
                               <div className="w-full h-full bg-gray-50 pt-8 relative">
                                  <div className="absolute inset-0 z-10" /> 
                                  
                                  <iframe 
                                     src={template.url} 
                                     className="w-[1446px] h-[900px] border-0 transform origin-top-left scale-[0.443]" 
                                     title={template.title}
                                     scrolling="no"
                                     loading="lazy"
                                  />
                                  
                                  {/* Hover Button */}
                                  {isActive && (
                                     // ADDED: pointer-events-none so it doesn't block the click action, and updated animations to respond to 'group-hover'
                                     <div className="absolute inset-0 z-20 mb-7 mr-4 pointer-events-none flex items-end justify-end overflow-hidden">
                                        <div 
                                           className="bg-white border-2 border-black text-gray-900 px-6 py-2 font-bold shadow-lg transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out flex items-center gap-2 uppercase tracking-wider text-sm"
                                        >
                                           View 
                                        </div>
                                     </div>
                                  )}
                               </div>
                           </div>
                       </div>

                       {/* DYNAMIC BOTTOM TEXT */}
                       <div className={`mt-6 flex justify-between items-start px-1 transition-all duration-500 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                            
                            {/* Left Side: URL & Category */}
                            <div className="text-left">
                                {/* CHANGED: Replaced Link with a div to avoid double-firing events since the parent handles the click */}
                                <div className="block group/text">
                                    <h3 className="text-xl font-bold text-gray-900 group-hover/text:text-gray-600 transition-colors">
                                        www.{template.title.toLowerCase().replace(/[^a-z0-9]/g, '')}.com
                                    </h3>
                                </div>
                                <p className="text-sm font-medium text-gray-500 mt-1">
                                    Category: <span className="text-gray-900 font-bold">{details.category}</span>
                                </p>
                            </div>

                            {/* Right Side: Unique Tags */}
                            <div className="text-right">
                                <p className="text-sm font-bold text-gray-900">{details.tag}</p>
                                <p className="text-sm text-gray-500 mt-1">{details.feature}</p>
                            </div>
                       </div>

                    </motion.div>
                 );
              })}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
}