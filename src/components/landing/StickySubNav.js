'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function StickySubNav() {
  const navRef = useRef(null);
  const scrollContainerRef = useRef(null); // Ref for the horizontal scroll container
  const isClickScrolling = useRef(false);
  
  const [isSticky, setIsSticky] = useState(false);
  const [activeSection, setActiveSection] = useState('pricing');
  const [freezeOffset, setFreezeOffset] = useState(0);

  // 1. Existing Page Scroll & Sticky Logic
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['pricing', 'templates', 'how-it-works', 'testimonial', 'benefits', 'faq'];
      const NAV_OFFSET = navRef.current ? navRef.current.offsetHeight + 40 : 100;

      if (navRef.current) {
        const isDesktop = window.innerWidth >= 1024;
        // Adjust 64 to match your exact mobile top nav height
        const stickyThreshold = isDesktop ? 128 : 64; 
        setIsSticky(navRef.current.getBoundingClientRect().top <= stickyThreshold + 1);
      }

      const faqElement = document.getElementById('faq');
      if (faqElement) {
        const faqRect = faqElement.getBoundingClientRect();
        if (faqRect.top < NAV_OFFSET) {
          setFreezeOffset(faqRect.top - NAV_OFFSET);
        } else {
          setFreezeOffset(0);
        }
      }

      if (!isClickScrolling.current) {
        let currentSection = '';

        for (const section of sections) {
          const element = document.getElementById(section);
          if (element) {
            const rect = element.getBoundingClientRect();
            if (rect.top <= NAV_OFFSET + 5) {
              currentSection = section;
            }
          }
        }

        if (currentSection) {
          setActiveSection(currentSection);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 2. NEW: Auto-scroll the active pill into view
  useEffect(() => {
    if (scrollContainerRef.current && activeSection) {
      // Find the specific DOM element of the active link
      const activeElement = scrollContainerRef.current.querySelector(`[data-nav-item="${activeSection}"]`);
      
      if (activeElement) {
        // Smoothly scroll the container to center the active item
        activeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',   // Prevents vertical page jumping
          inline: 'center',   // Centers the item horizontally
        });
      }
    }
  }, [activeSection]);

  const navItems = [
    { id: 'pricing', label: 'Pricing' },
    { id: 'templates', label: 'Templates' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'testimonial', label: 'Testimonial' },
    { id: 'benefits', label: 'Benefits' },
    { id: 'faq', label: 'FAQ' },
  ];

  return (
    <div 
      ref={navRef} 
      className={cn(
        "z-[100] block w-full max-w-[1440px] mx-auto pointer-events-none",
        // Removed mb-4 on mobile to prevent bottom gaps, kept on desktop via lg:mb-4
        // Change top-[64px] to the exact height of your mobile header!
        "sticky top-[64px] lg:top-[128px] lg:mb-4 inset-x-0 flex justify-center lg:justify-start lg:pl-6 transition-transform"
      )}
      style={{
        transform: `translateY(${freezeOffset}px)`,
      }}
    >
      <div 
        ref={scrollContainerRef} // Attached the scroll ref here
        className={cn(
          "max-w-[100vw] lg:max-w-max pointer-events-auto flex flex-row items-center gap-1 bg-white/90 backdrop-blur-md border border-gray-200 lg:rounded-full p-1.5 transition-all duration-300 overflow-x-auto no-scrollbar",
          isSticky ? "shadow-xl lg:scale-[1.02]" : "shadow-lg scale-100"
        )}
      >
        
        <Link 
          href="#" 
          className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full text-gray-600 hover:bg-[#b9a8e0] hover:text-white transition-all duration-300 ml-1" 
          title="Back to Top"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <ArrowUp className="w-5 h-5" />
        </Link>

        {navItems.map((item) => (
          <Link 
            key={item.id}
            href={`#${item.id}`}
            data-nav-item={item.id} // Added data attribute to target for scrolling
            className="flex-shrink-0 relative px-4 py-1.5 rounded-full text-[13px] hover:bg-[#b9a8e0] hover:text-white font-semibold tracking-wide outline-none group transition-all"
            onClick={(e) => {
              e.preventDefault();
              
              const element = document.getElementById(item.id);
              if (element) {
                setActiveSection(item.id);
                isClickScrolling.current = true;
                
                const NAV_OFFSET = navRef.current ? navRef.current.offsetHeight + 40 : 140;
                const y = element.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
                
                window.scrollTo({ top: y, behavior: 'smooth' });

                const checkIfScrollDone = setInterval(() => {
                  const currentY = window.scrollY;
                  if (Math.abs(currentY - y) < 5 || (window.innerHeight + currentY) >= document.body.offsetHeight) {
                    isClickScrolling.current = false;
                    clearInterval(checkIfScrollDone);
                  }
                }, 100);
                
                setTimeout(() => clearInterval(checkIfScrollDone), 1500);
              }
            }}
          >
            {activeSection === item.id && (
              <motion.div
                layoutId="activeSubNavPill"
                className="absolute inset-0 bg-[#8A63D2] rounded-full shadow-md z-0"
                transition={{ 
                  type: "spring", 
                  stiffness: 400, 
                  damping: 35,
                  mass: 1
                }}
              />
            )}
            
            <span className={cn(
              "relative z-10 transition-colors duration-300",
              activeSection === item.id 
                ? "text-white" 
                : "text-gray-500 group-hover:text-white"
            )}>
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}