'use client';

import Link from 'next/link';
import { GridBackgroundDemo } from "@/components/GridBackgroundDemo"; // Reusing the grid background

export default function AuthLayout({ children }) {
  return (
    <div className="flex h-screen font-sans bg-white">
      {/* Left Side - Branding and Visual */}
      <div className="hidden lg:flex w-1/2 bg-gray-50 flex-col items-center justify-center p-12 relative overflow-hidden">
        {/* Grid Background */}
        <GridBackgroundDemo />

        {/* Content Overlay */}
        <div className="relative z-10 flex flex-col items-center text-center">
            <Link href="/">
                <span className="text-3xl font-bold text-gray-900 cursor-pointer">
                    BizVistar
                </span>
            </Link>
            <p className="text-xl text-gray-600 mt-4 max-w-sm">
                Empowering local businesses with a professional digital presence.
            </p>
        </div>
      </div>

      {/* Right Side - Form Content */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 sm:p-16 overflow-y-auto">
        <div className="w-full max-w-md mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}