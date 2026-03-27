'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function StickySubNav() {
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['overview', 'pricing', 'templates', 'how-it-works', 'benefits', 'faq'];
      let currentSection = '';

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Check if element is in the upper middle part of the screen
          if (rect.top <= window.innerHeight * 0.4 && rect.bottom >= window.innerHeight * 0.2) {
            currentSection = section;
          }
        }
      }

      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Trigger once on mount to set initial state correctly
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'templates', label: 'Templates' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'benefits', label: 'Benefits' },
    { id: 'faq', label: 'FAQ' },
  ];

  return (
    <div className="sticky top-6 z-[100] hidden lg:block w-full max-w-[1440px] mx-auto pointer-events-none mb-4 transition-all duration-300">
      
      {/* Container aligned to center or a bit left depending on preference. ml-6 to mx-auto centers it */}
      <div className="w-max mx-auto pointer-events-auto inline-flex flex-row items-center gap-1 bg-white/90 backdrop-blur-md border border-gray-200 shadow-lg rounded-full p-1.5 transition-all">
        
        {navItems.map((item) => (
          <Link 
            key={item.id}
            href={`#${item.id}`} 
            className="relative px-4 py-1.5 rounded-full text-[13px] font-semibold tracking-wide outline-none group transition-all"
            onClick={(e) => {
              e.preventDefault();
              const element = document.getElementById(item.id);
              if (element) {
                // Offset calculation (top position - sticky nav height roughly)
                const y = element.getBoundingClientRect().top + window.scrollY - 100;
                window.scrollTo({ top: y, behavior: 'smooth' });
                setActiveSection(item.id);
              }
            }}
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