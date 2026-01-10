"use client";

import React, { useState, useEffect } from 'react';
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
  Tag
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
export default function DashboardLayout({ children }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', icon: LayoutGrid, href: '/dashboard' },
    { name: 'Website', icon: Globe, href: '/dashboard/website' },
    { name: 'Orders', icon: Package, href: '/dashboard/orders' },
    { name: 'Products', icon: Tag, href: '/dashboard/products' },
    { name: 'Apps', icon: AppWindow, href: '/dashboard/apps' },
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
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    // The outer container has p-7 (28px) padding.
    // To make the header full-width when scrolled, we use negative margins to counteract the padding.
    <div className="min-h-screen p-7 bg-[#F3F4F6] font-sans text-[#333333]">
      {/* Header */}
      <header 
        className={`sticky top-0 z-50 bg-white flex items-center justify-between transition-all duration-300 ease-in-out
          ${isScrolled 
            ? 'rounded-none shadow-md w-[calc(100%+3.5rem)] -mx-7 px-10 py-4' // Full width, remove rounded, adjust padding
            : 'rounded-full shadow-sm px-6 py-4' // Default floating state
          }`}
      >
        {/* Left: Logo */}
        <span className="text-3xl font-bold text-gray-900 not-italic tracking-tight">
          BizVistaar
        </span>

        {/* Center: Navigation */}
        <nav className="hidden md:flex items-center gap-6">
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

        {/* Right: User Controls */}
        <div className="flex items-center gap-4">
         
        <button className="p-2 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">
            <Bell size={20} />
          </button>
          <div className="h-10 w-10 rounded-full bg-gray-300 overflow-hidden border-2 border-white shadow-sm">
             {/* Placeholder User Image */}
             <div className="h-full w-full bg-gray-200 flex items-center justify-center text-gray-500">
               <User size={20} />
             </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={`mt-5 rounded-[2rem] bg-[#fff] font-sans text-[#333333] ${
        pathname === '/dashboard/website' ? 'p-0 overflow-hidden h-[calc(100vh-140px)]' : 'p-10 min-h-[500px]'
      }`}>
        {children}
      </main>

    </div>
  );
}
