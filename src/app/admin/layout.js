"use client";

import React, { useState, useEffect } from 'react';
import {
  LayoutGrid,
  Users,
  Globe,
  Package,
  Share2,
  Palette,
  Menu,
  X,
  LogOut,
  User,
  ShieldCheck,
  MessageSquare
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import Logo from '@/lib/logo/logoOfBizVistar';
import AdminGuard from '@/components/admin/AdminGuard';

export default function AdminLayout({ children }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [session, setSession] = useState(null);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => { setSession(session); }
    );
    supabase.auth.getSession().then(({ data: { session } }) => { setSession(session); });
    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/sign-in');
  };

  const navItems = [
    { name: 'Dashboard', icon: LayoutGrid, href: '/admin' },
    { name: 'Users', icon: Users, href: '/admin/users' },
    { name: 'Websites', icon: Globe, href: '/admin/websites' },
    { name: 'Orders', icon: Package, href: '/admin/orders' },
    { name: 'Templates', icon: Palette, href: '/admin/templates' },
    { name: 'Shared Links', icon: Share2, href: '/admin/shared-links' },
    { name: 'Chats', icon: MessageSquare, href: '/admin/chats' },
  ];

  useEffect(() => {
    const handleScroll = () => { setIsScrolled(window.scrollY > 20); };
    const handleResize = () => { setIsMobileViewport(window.innerWidth < 1024); };
    handleResize();
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => { setIsMobileMenuOpen(false); }, [pathname]);

  const isActive = (href) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <AdminGuard>
      <div className={`min-h-screen font-sans text-[#333333] bg-[#F3F4F6] p-0 lg:p-7`}>
        {/* Header */}
        <header
          className={`sticky top-0 z-50 bg-white flex items-center justify-between transition-all duration-300 ease-in-out
            ${isScrolled || isMobileViewport
              ? 'rounded-none shadow-sm w-full left-0 top-0 px-4 py-4 lg:w-[calc(100%+3.5rem)] lg:-mx-7 lg:px-10'
              : 'rounded-full shadow-sm px-6 py-4'
            }`}
        >
          {/* Left: Logo + Admin Badge */}
          <Link href="/admin" className="flex items-center gap-2 flex-shrink-0">
            <Logo className="text-2xl lg:text-3xl" />
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#8A63D2]/10 text-[#8A63D2] text-xs font-bold uppercase tracking-wider">
              <ShieldCheck size={12} />
              Admin
            </span>
          </Link>

          {/* Center: Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors text-sm font-medium
                  ${isActive(item.href)
                    ? 'bg-[#8A63D2] text-white shadow-md'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                  }`}
              >
                <item.icon size={18} className={isActive(item.href) ? 'text-white' : 'text-gray-400'} />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right: User Controls (Desktop) */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/dashboard"
              className="px-3 py-1.5 text-xs font-medium text-gray-500 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
            >
              User Dashboard →
            </Link>
            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="h-10 w-10 rounded-full bg-gray-50 border-2 border-[#8A63D2]/30 overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-center"
              >
                <User size={20} className="text-[#8A63D2]" />
              </button>

              <AnimatePresence>
                {isProfileDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute right-0 mt-3 w-64 bg-white border border-gray-100 rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 z-50 overflow-hidden origin-top-right"
                  >
                    <div className="px-5 py-4 border-b border-gray-50 bg-gray-50/50">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Admin Account</p>
                      <p className="text-sm font-bold text-gray-900 truncate" title={session?.user?.email}>
                        {session?.user?.email || 'Loading...'}
                      </p>
                    </div>
                    <div className="py-2">
                      <Link
                        href="/dashboard"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="w-full text-left px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 font-medium transition-colors flex items-center gap-3"
                      >
                        <LayoutGrid size={18} className="text-gray-400" />
                        User Dashboard
                      </Link>
                      <div className="h-px bg-gray-100 my-1"></div>
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-5 py-2.5 text-sm text-red-600 hover:bg-red-50 font-medium transition-colors flex items-center gap-3"
                      >
                        <LogOut size={18} />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right: Hamburger (Mobile) */}
          <div className="flex lg:hidden items-center gap-3">
            <span className="inline-flex sm:hidden items-center px-2 py-1 rounded-full bg-[#8A63D2]/10 text-[#8A63D2] text-[10px] font-bold">
              <ShieldCheck size={10} className="mr-0.5" />
              Admin
            </span>
            <button className="p-2 text-gray-600" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={24} />
            </button>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[60] bg-white flex flex-col animate-in slide-in-from-right duration-200 lg:hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Logo className="text-2xl" />
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#8A63D2]/10 text-[#8A63D2] text-[10px] font-bold uppercase">
                  <ShieldCheck size={10} />
                  Admin
                </span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-600">
                <X size={24} />
              </button>
            </div>
            <nav className="flex-grow flex flex-col p-4 space-y-2 overflow-y-auto">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-base font-medium
                    ${isActive(item.href)
                      ? 'bg-[#8A63D2]/10 text-[#8A63D2]'
                      : 'text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  <item.icon size={20} className={isActive(item.href) ? 'text-[#8A63D2]' : 'text-gray-500'} />
                  {item.name}
                </Link>
              ))}
              <hr className="my-4 border-gray-200" />
              <Link
                href="/dashboard"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 text-base font-medium"
              >
                <LayoutGrid size={20} className="text-gray-500" />
                User Dashboard
              </Link>
              <button onClick={handleSignOut} className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 text-base font-medium text-left w-full">
                <LogOut size={20} />
                Sign Out
              </button>
            </nav>
          </div>
        )}

        {/* Main Content */}
        <main className="bg-[#fff] font-sans text-[#333333] transition-all rounded-none lg:rounded-[2rem] p-4 lg:p-10 min-h-[500px] mt-0 lg:mt-5">
          {children}
        </main>
      </div>
    </AdminGuard>
  );
}
