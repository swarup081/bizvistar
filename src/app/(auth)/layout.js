'use client';

import Link from 'next/link';
import Logo from '@/lib/logo/logoOfBizVistar';

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen font-sans bg-[#F5F7FD] flex flex-col">
      {/* Header with static Logo */}
      <header className="p-8 pb-0">
          <Link href="/" className="inline-block">
            <Logo className="text-3xl" />
          </Link>
      </header>

      {/* Main Content Centered */}
      <main className="flex-grow flex items-center justify-center p-4">
        {children}
      </main>
    </div>
  );
}
