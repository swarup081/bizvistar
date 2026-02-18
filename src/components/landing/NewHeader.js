'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Logo from '@/lib/logo/logoOfBizVistar';

export default function NewHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Sell', href: '#' },
    { label: 'Market', href: '#' },
    { label: 'Platform', href: '#' },
    { label: 'Manage', href: '#' },
    { label: 'Pricing', href: '/pricing' },
  ];

  return (
    <>
      {/* Top Banner */}
      <div className="bg-[#1a1a1a] text-white text-xs md:text-sm py-2.5 text-center px-4 font-medium">
         Start a free trial and enjoy 3 months of Storify for $1/month on select plans. 
         <Link href="/get-started" className="underline ml-1 hover:text-gray-300">Sign up now</Link>
      </div>

      <header className="sticky top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
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
               className="md:hidden bg-white border-b border-gray-100 overflow-hidden shadow-lg absolute w-full left-0 top-full"
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
    </>
  );
}
