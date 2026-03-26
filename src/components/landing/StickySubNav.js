'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function StickySubNav() {
  const [activeSection, setActiveSection] = useState('pricing'); // Defaulting to pricing initially based on placement

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['overview', 'templates', 'pricing', 'faq'];
      let currentSection = '';

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Adjust threshold to detect which section is currently focused
          if (rect.top <= window.innerHeight / 2 && rect.bottom >= 100) {
            currentSection = section;
          }
        }
      }

      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Trigger once on mount

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'pricing', label: 'Pricing' },
    { id: 'templates', label: 'Templates' },
    { id: 'overview', label: 'How It Works' },
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'features', label: 'Features' },
    { id: 'faq', label: 'Faq' },
  ];

  return (
    // FIX: Removed "h-0" and used a negative margin "-mb-[64px]" instead.
    // This gives the sticky engine a real height to track (which fixes the stickiness), 
    // but visually pulls the Pricing section UP by 64px to completely eliminate the gap!
    <div className="sticky top-8 z-[100] hidden lg:block w-full max-w-[1440px] mx-auto pointer-events-none -mb-[64px]">
      
      <div className="w-max ml-6 xl:ml-10 pointer-events-auto inline-flex flex-row items-center gap-2 bg-white/95 backdrop-blur-md border border-gray-200 shadow-xl rounded-full p-2">
        
        {navItems.map((item) => (
          <Link 
            key={item.id}
            href={`#${item.id}`} 
            className="relative px-6 py-2.5 rounded-full text-sm font-bold outline-none group"
          >
            {/* Ultra-Smooth Sliding Background Pill */}
            {activeSection === item.id && (
              <motion.div
                layoutId="activeSubNavPill"
                className="absolute inset-0 bg-[#8A63D2] rounded-full shadow-md z-0"
                transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
              />
            )}
            
            <span className={cn(
              "relative z-10 transition-colors duration-300",
              activeSection === item.id 
                ? "text-white" 
                : "text-gray-500 group-hover:text-gray-900"
            )}>
              {item.label}
            </span>
          </Link>
        ))}
        
        {/* Vertical Divider 
        <div className="w-px h-6 bg-gray-200 mx-1"></div> */}
        
        {/* Back to Top Arrow */}
        <Link 
          href="#pricing" 
          className="flex items-center justify-center w-10 h-10 bg-gray-50 rounded-full text-gray-600 hover:text-white hover:bg-[#8A63D2] transition-all duration-300 shadow-sm border border-gray-200 ml-1" 
          title="Back to Top"
        >
          <ArrowUp className="w-5 h-5" />
        </Link>

      </div>
    </div>
  );
}