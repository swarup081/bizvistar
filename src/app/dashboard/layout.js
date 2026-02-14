"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { 
  LayoutGrid, 
  Globe, 
  Package, 
  AppWindow, 
  Users, 
  PieChart, 
  Bell, 
  MessageCircle, 
  User,
  Tag,
  Menu, // Hamburger Icon
  X, // Close Icon
  LogOut
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from '@/lib/logo/logoOfBizVistar';
// import PostPaymentManager from '@/components/dashboard/PostPaymentManager';

export default function DashboardLayout({ children }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(false); // Safe hook for window width
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', icon: LayoutGrid, href: '/dashboard' },
    { name: 'Website', icon: Globe, href: '/dashboard/website' },
    { name: 'Orders', icon: Package, href: '/dashboard/orders' },
    { name: 'Products', icon: Tag, href: '/dashboard/products' },
    //{ name: 'Apps', icon: AppWindow, href: '/dashboard/apps' },
    { name: 'Analytics', icon: PieChart, href: '/dashboard/analytics' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Check viewport size safely on client
    const handleResize = () => {
        setIsMobileViewport(window.innerWidth < 1024);
    };
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);

    return () => {
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    // Outer container:
    // - Desktop: Standard padding (p-7)
    // - Mobile: NO padding (p-0) to ensure full edge-to-edge navbar and content
    <div className={`min-h-screen font-sans text-[#333333] bg-[#F3F4F6]
        ${pathname === '/dashboard/website' ? 'p-0 lg:p-7' : 'p-0 lg:p-7'} 
    `}>
      {/* <Suspense fallback={null}>
        <PostPaymentManager />
      </Suspense> */}
      
      {/* Header */}
      <header 
        className={`sticky top-0 z-50 bg-white flex items-center justify-between transition-all duration-300 ease-in-out
          ${isScrolled || isMobileViewport // Always flat/full-width on mobile or scrolled
            ? 'rounded-none shadow-sm w-full left-0 top-0 px-4 py-4 lg:w-[calc(100%+3.5rem)] lg:-mx-7 lg:px-10' // Mobile: Standard full width, Desktop: Negative margins if scrolled
            : 'rounded-full shadow-sm px-6 py-4' // Default floating state (Desktop)
          }`}
      >
        {/* Left: Logo */}
        <Link href="/dashboard" className="flex-shrink-0">
          <Logo className="text-2xl lg:text-3xl" />
        </Link>

        {/* Center: Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors text-sm font-medium
                  ${isActive 
                    ? 'bg-[#8A63D2] text-white shadow-md' 
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                  }`}
              >
                <item.icon size={18} className={isActive ? 'text-white' : 'text-gray-400'} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Right: User Controls (Desktop) */}
        <div className="hidden lg:flex items-center gap-4">
          <button className="p-2 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">
            <Bell size={20} />
          </button>
          <div className="h-10 w-10 rounded-full bg-gray-300 overflow-hidden border-2 border-white shadow-sm">
             <div className="h-full w-full bg-gray-200 flex items-center justify-center text-gray-500">
               <User size={20} />
             </div>
          </div>
        </div>

        {/* Right: Hamburger (Mobile) */}
        <div className="flex lg:hidden items-center gap-3">
            <button className="p-2 text-gray-600" onClick={() => setIsMobileMenuOpen(true)}>
                <Menu size={24} />
            </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-white flex flex-col animate-in slide-in-from-right duration-200 lg:hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <Logo className="text-2xl" />
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-600">
                    <X size={24} />
                </button>
            </div>
            <nav className="flex-grow flex flex-col p-4 space-y-2 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-base font-medium
                        ${isActive 
                            ? 'bg-[#8A63D2]/10 text-[#8A63D2]' 
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        <item.icon size={20} className={isActive ? 'text-[#8A63D2]' : 'text-gray-500'} />
                        {item.name}
                    </Link>
                    );
                })}
                <hr className="my-4 border-gray-200" />
                <Link
                    href="/dashboard/profile"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 text-base font-medium"
                >
                    <User size={20} className="text-gray-500" />
                    Profile
                </Link>
                <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 text-base font-medium text-left w-full">
                    <LogOut size={20} />
                    Sign Out
                </button>
            </nav>
        </div>
      )}

      {/* Main Content */}
      <main className={`
        bg-[#fff] font-sans text-[#333333] transition-all
        ${pathname === '/dashboard/website' 
            ? 'rounded-none lg:rounded-[2rem] p-0 overflow-hidden h-[calc(100vh-80px)] lg:h-[calc(100vh-140px)] mt-0 lg:mt-5' 
            // Mobile: Full width (p-4), no rounding, no margin top to flush with header
            : 'rounded-none lg:rounded-[2rem] p-4 lg:p-10 min-h-[500px] mt-0 lg:mt-5'
        }
      `}>
        {children}
      </main>

    </div>
  );
}
