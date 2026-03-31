'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Logo from '@/lib/logo/logoOfBizVistar';

export default function NewHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isTimerLoaded, setIsTimerLoaded] = useState(false);

  useEffect(() => {
    let interval;

    const fetchTimer = async () => {
      try {
        const res = await fetch('/api/promo-timer');
        const data = await res.json();
        const targetDate = data.targetDate;

        const calculateTimeLeft = () => {
          const now = new Date().getTime();
          const difference = targetDate - now;

          if (difference > 0) {
            setTimeLeft({
              days: Math.floor(difference / (1000 * 60 * 60 * 24)),
              hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
              minutes: Math.floor((difference / 1000 / 60) % 60),
              seconds: Math.floor((difference / 1000) % 60),
            });
            setIsTimerLoaded(true);
          } else {
            // Re-fetch when time runs out to get the next target date
            clearInterval(interval);
            fetchTimer();
          }
        };

        calculateTimeLeft();
        interval = setInterval(calculateTimeLeft, 1000);

      } catch (error) {
        console.error("Failed to fetch timer", error);
        setIsTimerLoaded(true); // Stop loading state even on error
      }
    };

    fetchTimer();

    return () => clearInterval(interval);
  }, []);

  const formatTime = (value) => value.toString().padStart(2, '0');

  const navLinks = [
    { label: 'Sell', href: '#' },
    { label: 'Market', href: '#' },
    { label: 'Platform', href: '#' },
    { label: 'Manage', href: '#' },
    { label: 'Pricing', href: '/pricing' },
  ];

  return (
    <div className="sticky top-0 left-0 right-0 z-[110] bg-white transition-all duration-300 shadow-sm">
      {/* Top Banner */}
      <div className="bg-[#1a1a1a] text-white text-xs md:text-[15px] py-2.5 text-center px-4 font-medium flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 font-sans tracking-wide">
         <span>Don’t miss the limited-time deals!</span>
         {isTimerLoaded ? (
            <span className="flex items-center gap-1 font-sans font-bold text-[18px] md:text-[20px] text-[#cfff04] tracking-wider">
              {formatTime(timeLeft.days)}<span className="text-[11px] md:text-[12px] font-sans font-medium text-gray-300 -ml-0.5">D</span>&nbsp;
              {formatTime(timeLeft.hours)}<span className="text-[11px] md:text-[12px] font-sans font-medium text-gray-300 -ml-0.5">H</span>&nbsp;
              {formatTime(timeLeft.minutes)}<span className="text-[11px] md:text-[12px] font-sans font-medium text-gray-300 -ml-0.5">M</span>&nbsp;
              {formatTime(timeLeft.seconds)}<span className="text-[11px] md:text-[12px] font-sans font-medium text-gray-300 -ml-0.5">S</span>
            </span>
         ) : (
            <span className="opacity-0 w-24">00D 00H 00M 00S</span>
         )}
         <Link href="#pricing" className="underline font-bold hover:text-gray-300 decoration-2 underline-offset-4">
            Explore
         </Link>
      </div>

      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all duration-300 w-full relative">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between relative">
          
          {/* Logo */}
          <Link href="/" className="flex font- items-center gap-2 hover:opacity-80 transition-opacity">
          <Logo className="text-2xl lg:text-3xl" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
             {navLinks.map((link) => (
                <Link 
                  key={link.label} 
                  href={link.href}
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors relative group"
                >
                   {link.label}
                   <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-900 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
                </Link>
             ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-6">
             <Link 
               href="/sign-in" 
               className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
             >
                Log in
             </Link>
             <Link 
               href="/get-started" 
               className="bg-[#000] text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-[#000] transition-all hover:scale-105 shadow-md active:scale-95"
             >
                Start free trial
             </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
             {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
             <motion.div
               initial={{ opacity: 0, height: 0 }}
               animate={{ opacity: 1, height: 'auto' }}
               exit={{ opacity: 0, height: 0 }}
               className="md:hidden bg-white border-b border-gray-100 overflow-hidden shadow-lg absolute w-full left-0 top-full z-50"
             >
                <div className="flex flex-col p-6 space-y-4">
                   {navLinks.map((link) => (
                      <Link 
                        key={link.label} 
                        href={link.href}
                        className="text-lg font-medium text-gray-900 py-3 border-b border-gray-50 flex items-center justify-between group"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                         {link.label}
                         <span className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400">→</span>
                      </Link>
                   ))}
                   <div className="pt-6 flex flex-col gap-4">
                      <Link 
                        href="/sign-in"
                        className="w-full text-center py-3 border border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                         Log in
                      </Link>
                      <Link 
                        href="/get-started"
                        className="w-full text-center py-3 bg-[#00000] text-white rounded-lg font-bold hover:bg-[#000] transition-colors shadow-sm"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                         Start free trial
                      </Link>
                   </div>
                </div>
             </motion.div>
          )}
        </AnimatePresence>
      </header>
    </div>
  );
}
