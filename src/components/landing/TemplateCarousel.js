'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, useAnimation } from 'framer-motion';
import { templates } from '@/lib/data/templates';

export default function TemplateCarousel() {
  const [currentIndex, setCurrentIndex] = useState(templates.length);
  const [isHovered, setIsHovered] = useState(false);
  const [stepSize, setStepSize] = useState(432);
  const controls = useAnimation();

  // We use 3 sets to ensure we have enough buffer before and after
  const duplicatedTemplates = [...templates, ...templates, ...templates];

  useEffect(() => {
    const handleResize = () => {
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

    const interval = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 3500);

    return () => clearInterval(interval);
  }, [isHovered]);

  // Handle Animation & Snapping
  useEffect(() => {
    const xOffset = -(currentIndex * stepSize);

    controls.start({
       x: xOffset,
       transition: { duration: 0.6, ease: "easeInOut" }
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
        }, 600);
        return () => clearTimeout(timeout);
     }

     // Backward Snap (if going below Set 2 start)
     if (currentIndex < len) {
        const timeout = setTimeout(() => {
           const newIndex = currentIndex + len;
           controls.set({ x: -(newIndex * stepSize) });
           setCurrentIndex(newIndex);
        }, 600);
        return () => clearTimeout(timeout);
     }
  }, [currentIndex, stepSize, controls]);

  const handlePrev = () => setCurrentIndex(prev => prev - 1);
  const handleNext = () => setCurrentIndex(prev => prev + 1);

  return (
    <div className="w-full py-24 bg-gray-50 border-t border-gray-100 overflow-hidden relative group">

      <div className="text-center mb-16 px-6">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
           Stunning Templates for <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">Every Business</span>
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
           Choose from our professionally designed, high-converting templates.
           Customizable in seconds.
        </p>
      </div>

      {/* Navigation Buttons */}
      <div className="absolute top-1/2 left-4 md:left-8 z-20 mt-12 md:mt-16 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handlePrev}
            className="p-3 bg-white/80 backdrop-blur-md border border-gray-200 rounded-full shadow-lg text-gray-800 hover:bg-white hover:scale-110 transition-all focus:outline-none"
            aria-label="Previous Template"
          >
             <ChevronLeft size={24} />
          </button>
      </div>
      <div className="absolute top-1/2 right-4 md:right-8 z-20 mt-12 md:mt-16 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleNext}
            className="p-3 bg-white/80 backdrop-blur-md border border-gray-200 rounded-full shadow-lg text-gray-800 hover:bg-white hover:scale-110 transition-all focus:outline-none"
            aria-label="Next Template"
          >
             <ChevronRight size={24} />
          </button>
      </div>

      {/* Carousel Container */}
      <div
        className="relative w-full overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="absolute top-0 left-0 h-full w-24 md:w-48 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute top-0 right-0 h-full w-24 md:w-48 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none"></div>

        <motion.div
           className="flex gap-8 px-8 md:px-[calc(50vw-200px)]"
           animate={controls}
        >
           {duplicatedTemplates.map((template, index) => (
              <div
                key={`${template.title}-${index}`}
                className="w-[300px] md:w-[400px] flex-shrink-0 group/card"
              >
                 <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                    {/* Browser Bar */}
                    <div className="h-8 bg-gray-100 border-b border-gray-200 flex items-center px-3 gap-1.5">
                       <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                       <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                       <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                       <div className="ml-auto text-[10px] text-gray-400 font-mono">
                          {template.url}
                       </div>
                    </div>

                    {/* Preview Area */}
                    <div className="relative aspect-[16/10] bg-gray-50 overflow-hidden">
                       <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${getGradient(template.title)}`}>
                          <div className="text-center p-6 bg-white/90 backdrop-blur-md rounded-lg shadow-sm max-w-[80%]">
                             <h3 className="text-xl font-bold text-gray-800 capitalize mb-1">{template.title}</h3>
                             <p className="text-xs text-gray-500 line-clamp-2">{template.description}</p>
                          </div>
                       </div>

                       <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
                          <Link
                             href={template.previewUrl}
                             target="_blank"
                             className="bg-white text-gray-900 px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-gray-100 transition-colors"
                          >
                             Live Preview <ExternalLink size={14}/>
                          </Link>
                       </div>
                    </div>

                    {/* Footer Info */}
                    <div className="p-4 bg-white">
                       <div className="flex justify-between items-center mb-2">
                          <span className="font-bold capitalize text-gray-900">{template.title}</span>
                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                             {template.keywords[0]}
                          </span>
                       </div>
                       <div className="flex gap-2 flex-wrap">
                          {template.keywords.slice(1, 3).map(k => (
                             <span key={k} className="text-[10px] text-gray-400 border border-gray-100 px-1.5 py-0.5 rounded">
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
      flavornest: 'from-orange-100 to-yellow-100',
      flara: 'from-pink-100 to-rose-100',
      avenix: 'from-gray-100 to-gray-300',
      blissly: 'from-amber-100 to-orange-50',
      frostify: 'from-blue-100 to-cyan-50',
      aurora: 'from-emerald-100 to-teal-50',
   };
   return gradients[name] || 'from-gray-100 to-gray-200';
}
