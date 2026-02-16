'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Logo from '@/lib/logo/logoOfBizVistar';

export default function NewHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'Templates', href: '/templates' },
    { label: 'Pricing', href: '#pricing' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
            <Logo />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
           {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                 {link.label}
              </Link>
           ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
           <Link
             href="/sign-in"
             className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
           >
              Log in
           </Link>
           <Link
             href="/get-started"
             className="bg-gray-900 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-800 transition-all hover:scale-105 shadow-sm"
           >
              Start Free Trial
           </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-gray-600"
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
             className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
           >
              <div className="flex flex-col p-6 space-y-4">
                 {navLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="text-lg font-medium text-gray-900 py-2 border-b border-gray-50"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                       {link.label}
                    </Link>
                 ))}
                 <div className="pt-4 flex flex-col gap-3">
                    <Link
                      href="/sign-in"
                      className="w-full text-center py-3 border border-gray-200 rounded-lg font-medium text-gray-700"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                       Log in
                    </Link>
                    <Link
                      href="/get-started"
                      className="w-full text-center py-3 bg-gray-900 text-white rounded-lg font-bold"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                       Start Free Trial
                    </Link>
                 </div>
              </div>
           </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
