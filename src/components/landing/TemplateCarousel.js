'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { templates } from '@/lib/data/templates';
import Link from 'next/link';

export default function TemplateCarousel() {
  // Use a ref to track if we're dragging to prevent click on release
  const isDragging = useRef(false);
  const carouselRef = useRef(null);

  // State for manual navigation (optional if using pure scroll, but user asked for "slides one slide at a time")
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % templates.length);
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + templates.length) % templates.length);
  }, []);

  // Auto-slide logic
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000); // 5 seconds pause
    return () => clearInterval(interval);
  }, [handleNext]);

  // Calculating transform for carousel
  // We'll show 1 main item centered, or a row.
  // "standard carousel that slides one slide at a time"
  // Let's go with a centered active item approach.

  return (
    <div className="w-full py-20 bg-gray-50 overflow-hidden relative group">
      <div className="max-w-7xl mx-auto px-6 relative">

        {/* Header */}
        <div className="text-center mb-16">
           <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Stunning Designs for Every Business
           </h2>
           <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose from our professionally designed templates. Fully customizable and optimized for conversion.
           </p>
        </div>

        {/* Carousel Container */}
        <div className="relative h-[450px] flex items-center justify-center perspective-1000">
           <AnimatePresence initial={false} mode="popLayout">
              {templates.map((template, index) => {
                 // Logic to determine position relative to current index
                 // We want to show Previous, Current, Next
                 const offset = (index - currentIndex + templates.length) % templates.length;

                 // Normalize offset to be -1, 0, 1 for the visible 3 items
                 // If total is 6, logic needs care.
                 // Simpler: Just render the active one and neighbor placeholders?

                 // Let's use a simple transform logic based on index diff
                 let position = 0; // 0 = center, -1 = left, 1 = right, others hidden
                 if (index === currentIndex) position = 0;
                 else if (index === (currentIndex - 1 + templates.length) % templates.length) position = -1;
                 else if (index === (currentIndex + 1) % templates.length) position = 1;
                 else position = 2; // Hidden

                 if (position === 2) return null;

                 return (
                    <motion.div
                       key={template.title}
                       className="absolute top-0 w-[600px] h-[350px] md:h-[400px] bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden cursor-pointer"
                       initial={{
                          opacity: 0,
                          x: position === 1 ? 800 : -800,
                          scale: 0.8,
                          zIndex: 0
                       }}
                       animate={{
                          opacity: position === 0 ? 1 : 0.4,
                          x: position === 0 ? 0 : (position === -1 ? -450 : 450), // Offset for desktop
                          scale: position === 0 ? 1 : 0.85,
                          zIndex: position === 0 ? 10 : 1,
                          filter: position === 0 ? 'blur(0px)' : 'blur(2px)'
                       }}
                       exit={{
                          opacity: 0,
                          scale: 0.8,
                          x: position === -1 ? 800 : -800 // Exit direction?
                       }}
                       transition={{ duration: 0.6, ease: "easeInOut" }}
                       onClick={() => {
                          if (position === -1) handlePrev();
                          if (position === 1) handleNext();
                       }}
                    >
                       {/* Browser Bar */}
                       <div className="h-8 bg-gray-100 border-b border-gray-200 flex items-center px-3 gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
                          <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
                          <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
                          <div className="ml-auto text-xs text-gray-400 font-medium uppercase tracking-wider">
                             {template.title}
                          </div>
                       </div>

                       {/* Iframe Preview */}
                       <div className="relative w-full h-full bg-white overflow-hidden group-hover:bg-gray-50 transition-colors">
                          <iframe
                             src={template.url}
                             className="w-[1280px] h-[800px] border-0 transform origin-top-left scale-[0.47]" // Scale 600/1280 approx 0.468
                             title={template.title}
                             scrolling="no"
                             loading="lazy"
                             style={{ pointerEvents: 'none' }} // Disable interaction
                          />

                          {/* Hover Overlay for Active Item */}
                          {position === 0 && (
                             <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                                <Link
                                   href={template.previewUrl}
                                   target="_blank"
                                   className="bg-white text-gray-900 px-6 py-3 rounded-full font-bold shadow-lg transform translate-y-4 hover:translate-y-0 transition-all flex items-center gap-2"
                                >
                                   Preview Site <ExternalLink size={18} />
                                </Link>
                             </div>
                          )}
                       </div>
                    </motion.div>
                 );
              })}
           </AnimatePresence>
        </div>

        {/* Navigation Arrows */}
        <button
           onClick={handlePrev}
           className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-50 hover:scale-105 transition-all z-20"
        >
           <ChevronLeft size={24} />
        </button>
        <button
           onClick={handleNext}
           className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-50 hover:scale-105 transition-all z-20"
        >
           <ChevronRight size={24} />
        </button>

      </div>
    </div>
  );
}
