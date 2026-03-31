'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function StickySubNav() {
  const navRef = useRef(null);
  const isClickScrolling = useRef(false);
  
  const [offsetTop, setOffsetTop] = useState(0);
  const [isSticky, setIsSticky] = useState(false);
  const [activeSection, setActiveSection] = useState('pricing');
  
  // New state to track the physical lock position
  const [freezeOffset, setFreezeOffset] = useState(0);

  useEffect(() => {
    if (navRef.current) {
      setOffsetTop(navRef.current.offsetTop);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['pricing', 'templates', 'how-it-works', 'testimonial', 'benefits', 'faq'];
      const NAV_OFFSET = navRef.current ? navRef.current.offsetHeight + 40 : 100;

      // 1. Sticky Logic
      const shouldBeSticky = window.scrollY > offsetTop - 24;
      setIsSticky(shouldBeSticky);

      // 2. Freeze Logic: Physically dock the navbar when FAQ is active
      const faqElement = document.getElementById('faq');
      if (faqElement) {
        const faqRect = faqElement.getBoundingClientRect();
        
        // If the FAQ section goes higher than the nav's resting offset, 
        // we push the nav up by that exact pixel difference to "freeze" it to the page.
        if (faqRect.top < NAV_OFFSET) {
          setFreezeOffset(faqRect.top - NAV_OFFSET);
        } else {
          setFreezeOffset(0);
        }
      }

      // 3. Scroll Spy Logic
      if (!isClickScrolling.current) {
        let currentSection = '';

        for (const section of sections) {
          const element = document.getElementById(section);
          if (element) {
            const rect = element.getBoundingClientRect();
            // Buffer to ensure we catch the section as it hits the nav
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
  }, [offsetTop]);

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
        "z-[100] block w-full max-w-[1440px] mx-auto pointer-events-none mb-4",
        isSticky ? "fixed top-[135px] lg:top-6 inset-x-0 flex justify-center lg:justify-start lg:pl-6" : "relative flex justify-center lg:justify-start lg:pl-6"
      )}
      // This applies the hardware-accelerated freeze lock
      style={{
        transform: `translateY(${freezeOffset}px)`,
      }}
    >
      {/* The inner container keeps the scale and shadow transitions so it still feels smooth */}
      <div className={cn(
        "max-w-[95vw] lg:max-w-max pointer-events-auto flex flex-row items-center gap-1 bg-white/90 backdrop-blur-md border border-gray-200 rounded-full p-1.5 transition-all duration-300 overflow-x-auto no-scrollbar",
        isSticky ? "shadow-xl scale-[1.02]" : "shadow-lg scale-100"
      )}>
        
        {/* Back to Top Arrow */}
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