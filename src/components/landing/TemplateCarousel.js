'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { motion, useAnimation, useMotionValue } from 'framer-motion';
import { templates } from '@/lib/data/templates';

export default function TemplateCarousel() {
  const [width, setWidth] = useState(0);
  const carouselRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const controls = useAnimation();

  // Duplicate templates to ensure seamless loop
  // We use 3 sets to ensure we have enough buffer before and after
  const duplicatedTemplates = [...templates, ...templates, ...templates];

  // Card dimensions + gap
  // Mobile: 300px + 32px (gap-8) = 332px
  // Desktop: 400px + 32px (gap-8) = 432px
  const getStepSize = () => {
     if (typeof window !== 'undefined') {
        return window.innerWidth < 768 ? 332 : 432;
     }
     return 432;
  };

  useEffect(() => {
    // Auto-advance
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        // If we reached the end of the first set (original length),
        // we logically want to go to the next one, but we handle the reset via animation complete usually.
        // Simplified: Just keep incrementing, and if we go too far, we reset.
        return prev + 1;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Handle Animation
  useEffect(() => {
    const stepSize = getStepSize();
    const xOffset = -(currentIndex * stepSize);

    // If we have scrolled past the first set of templates, snap back to 0 (visually identical)
    // The "first set" ends at index = templates.length
    if (currentIndex > templates.length) {
       // Snap instantly to index 1 (since we are visually at index 1 of the 2nd set)
       // Wait, no.
       // Visually: Set 1 [A, B, C] | Set 2 [A, B, C]
       // Index 0: A1
       // Index 1: B1
       // Index 2: C1
       // Index 3: A2 (Visually same as A1)

       // So if currentIndex becomes 3 (templates.length), we animate to it.
       // Then AFTER animation, we snap to 0.
       // But useEffect triggers on change.

       // Let's use a standard pattern:
       // Animate to new index.
       controls.start({
          x: xOffset,
          transition: { duration: 0.8, ease: "easeInOut" }
       }).then(() => {
          // Check if we need to reset
          // Actually simpler: If we are AT the reset point, snap back.
          // But we just animated TO it.
          // The visual duplicate is at index `templates.length`.
       });
    } else {
       controls.start({
          x: xOffset,
          transition: { duration: 0.8, ease: "easeInOut" }
       });
    }
  }, [currentIndex, controls]);

  // Handling the seamless loop reset
  // If currentIndex === templates.length, we are showing the first item of the *second* set.
  // This is visually identical to currentIndex === 0.
  // So we should animate to it, and then instantly reset to 0.
  useEffect(() => {
     if (currentIndex === templates.length) {
        const timeout = setTimeout(() => {
           setCurrentIndex(0);
           const stepSize = getStepSize();
           controls.set({ x: 0 }); // Instant snap
        }, 800); // Match transition duration
        return () => clearTimeout(timeout);
     }
  }, [currentIndex, controls]);


  return (
    <div className="w-full py-24 bg-gray-50 border-t border-gray-100 overflow-hidden">

      <div className="text-center mb-16 px-6">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
           Stunning Templates for <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">Every Business</span>
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
           Choose from our professionally designed, high-converting templates.
           Customizable in seconds.
        </p>
      </div>

      {/* Carousel Container */}
      <div className="relative w-full overflow-hidden" ref={carouselRef}>
        {/* Gradient Masks */}
        <div className="absolute top-0 left-0 h-full w-24 md:w-48 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute top-0 right-0 h-full w-24 md:w-48 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none"></div>

        <motion.div
           className="flex gap-8 px-8 md:px-[calc(50vw-200px)]" // Center initial item roughly
           animate={controls}
        >
           {duplicatedTemplates.map((template, index) => (
              <div
                key={`${template.title}-${index}`}
                className="w-[300px] md:w-[400px] flex-shrink-0 group"
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

                       <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
