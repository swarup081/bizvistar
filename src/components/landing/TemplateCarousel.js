'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ExternalLink, ChevronLeft, ChevronRight, LayoutTemplate } from 'lucide-react';
import { motion, useAnimation } from 'framer-motion';
import { templates } from '@/lib/data/templates';

export default function TemplateCarousel() {
  const [currentIndex, setCurrentIndex] = useState(templates.length);
  const [isHovered, setIsHovered] = useState(false);
  const [stepSize, setStepSize] = useState(432);
  const controls = useAnimation();

  // We use 3 sets to ensure we have enough buffer before and after for infinite loop illusion
  const duplicatedTemplates = [...templates, ...templates, ...templates];

  useEffect(() => {
    const handleResize = () => {
       // Card width (300/400) + Gap (32)
       setStepSize(window.innerWidth < 768 ? 332 : 432);
    };

    // Set initial
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-advance
  useEffect(() => {
    if (isHovered) return;

    // "Very slow auto changing"
    const interval = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 6000);

    return () => clearInterval(interval);
  }, [isHovered]);

  // Handle Animation & Snapping
  useEffect(() => {
    const xOffset = -(currentIndex * stepSize);

    controls.start({
       x: xOffset,
       transition: { duration: 0.8, ease: "easeInOut" } // Smoother transition
    });
  }, [currentIndex, stepSize, controls]);

  // Seamless Loop Logic
  useEffect(() => {
     const len = templates.length;
     // Forward Snap
     if (currentIndex >= 2 * len) {
        const timeout = setTimeout(() => {
           const newIndex = currentIndex - len;
           controls.set({ x: -(newIndex * stepSize) });
           setCurrentIndex(newIndex);
        }, 800);
        return () => clearTimeout(timeout);
     }

     // Backward Snap (if going below Set 2 start)
     if (currentIndex < len) {
        const timeout = setTimeout(() => {
           const newIndex = currentIndex + len;
           controls.set({ x: -(newIndex * stepSize) });
           setCurrentIndex(newIndex);
        }, 800);
        return () => clearTimeout(timeout);
     }
  }, [currentIndex, stepSize, controls]);

  const handlePrev = () => setCurrentIndex(prev => prev - 1);
  const handleNext = () => setCurrentIndex(prev => prev + 1);

  return (
    <div className="w-full py-24 bg-gray-50 border-t border-gray-100 overflow-hidden relative group">

      <div className="text-center mb-16 px-6">
        <div className="inline-flex items-center gap-2 bg-purple-50 text-purple-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-6 border border-purple-100">
            <LayoutTemplate size={16} />
            <span>Professional Designs</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
           Stunning Templates for <br className="hidden md:block"/>
           <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">Every Business</span>
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
           Choose from our professionally designed, high-converting templates.
           Customizable in seconds to fit your brand perfectly.
        </p>
      </div>

      {/* Navigation Buttons */}
      <div className="absolute top-1/2 left-4 md:left-12 z-20 mt-12 md:mt-16 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-4 group-hover:translate-x-0">
          <button
            onClick={handlePrev}
            className="p-4 bg-white/90 backdrop-blur-md border border-gray-200 rounded-full shadow-xl text-gray-800 hover:bg-white hover:scale-110 transition-all focus:outline-none"
            aria-label="Previous Template"
          >
             <ChevronLeft size={24} />
          </button>
      </div>
      <div className="absolute top-1/2 right-4 md:right-12 z-20 mt-12 md:mt-16 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
          <button
            onClick={handleNext}
            className="p-4 bg-white/90 backdrop-blur-md border border-gray-200 rounded-full shadow-xl text-gray-800 hover:bg-white hover:scale-110 transition-all focus:outline-none"
            aria-label="Next Template"
          >
             <ChevronRight size={24} />
          </button>
      </div>

      {/* Carousel Container */}
      <div
        className="relative w-full overflow-hidden py-10" // Added padding Y to avoid hover cut-off
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="absolute top-0 left-0 h-full w-12 md:w-32 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute top-0 right-0 h-full w-12 md:w-32 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none"></div>

        <motion.div
           className="flex gap-8 px-8 md:px-[calc(50vw-200px)]"
           animate={controls}
        >
           {duplicatedTemplates.map((template, index) => (
              <div
                key={`${template.title}-${index}`}
                className="w-[300px] md:w-[400px] flex-shrink-0 group/card"
              >
                 <div className="bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden hover:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.12)] transition-all duration-300 transform hover:-translate-y-2 hover:border-purple-100">
                    {/* Browser Bar */}
                    <div className="h-9 bg-gray-50 border-b border-gray-100 flex items-center px-4 gap-1.5">
                       <div className="w-2.5 h-2.5 rounded-full bg-red-400/80"></div>
                       <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80"></div>
                       <div className="w-2.5 h-2.5 rounded-full bg-green-400/80"></div>
                       <div className="ml-3 px-3 py-0.5 rounded-md bg-white border border-gray-200 text-[10px] text-gray-400 font-mono flex-grow text-center truncate shadow-sm">
                          storify.com/{template.title}
                       </div>
                    </div>

                    {/* Preview Area */}
                    <div className="relative aspect-[16/10] bg-gray-100 overflow-hidden">
                       <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${getGradient(template.title)} transition-transform duration-700 group-hover/card:scale-105`}>
                          <div className="text-center p-8 bg-white/80 backdrop-blur-md rounded-xl shadow-sm border border-white/50 max-w-[85%]">
                             <h3 className="text-2xl font-bold text-gray-800 capitalize mb-2 tracking-tight">{template.title}</h3>
                             <p className="text-xs font-medium text-gray-500 uppercase tracking-widest">{template.keywords[0]}</p>
                          </div>
                       </div>

                       {/* Hover Overlay */}
                       <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
                          <Link
                             href={template.previewUrl}
                             target="_blank"
                             className="bg-white text-gray-900 px-8 py-3 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-purple-50 hover:text-purple-700 transition-all transform hover:scale-105 shadow-xl"
                          >
                             View Demo <ExternalLink size={16}/>
                          </Link>
                       </div>
                    </div>

                    {/* Footer Info */}
                    <div className="p-5 bg-white border-t border-gray-50">
                       <div className="flex justify-between items-start mb-3">
                          <div>
                             <h4 className="font-bold capitalize text-gray-900 text-lg leading-tight">{template.title}</h4>
                             <p className="text-xs text-gray-500 mt-1 line-clamp-1">{template.description}</p>
                          </div>
                       </div>
                       <div className="flex gap-2 flex-wrap mt-4">
                          {template.keywords.slice(0, 3).map(k => (
                             <span key={k} className="text-[10px] font-medium text-gray-500 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-full">
                                {k}
                             </span>
                          ))}
                       </div>
                    </div>
                 </div>
              </div>
           ))}
        </motion.div>
      </div>
    </div>
  );
}

function getGradient(name) {
   const gradients = {
      flavornest: 'from-orange-100 via-amber-50 to-yellow-100',
      flara: 'from-pink-100 via-rose-50 to-rose-100',
      avenix: 'from-gray-100 via-gray-50 to-gray-200',
      blissly: 'from-amber-100 via-orange-50 to-yellow-50',
      frostify: 'from-blue-100 via-cyan-50 to-sky-100',
      aurora: 'from-emerald-100 via-teal-50 to-green-100',
   };
   return gradients[name] || 'from-gray-100 to-gray-200';
}
