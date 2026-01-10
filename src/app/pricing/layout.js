import Link from 'next/link';
import { Check } from 'lucide-react';
import Logo from '@/lib/logo/Logo';

// Reusable Checkmark Icon
const CheckIcon = () => (
  <Check className="w-5 h-5 text-blue-600" strokeWidth={3} />
);

export default function PricingLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <nav className="container mx-5 px-6 py-4 flex justify-between items-center">
          <Link href="/">
            <span className="text-3xl  font-bold text-gray-900 cursor-pointer">
              <Logo/>
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <span className="hidden sm:flex items-center gap-2 text-sm text-gray-700">
              <CheckIcon /> Custom domain
            </span>
            <span className="hidden md:flex items-center gap-2 text-sm text-gray-700">
              <CheckIcon /> No BizVistar branding
            </span>
            <span className="hidden lg:flex items-center gap-2 text-sm text-gray-700">
              <CheckIcon /> 24/7 customer care
            </span>
          </div>
        </nav>
      </header>

      {/* Main Content (Your Page) */}
      <main>
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="container mx-auto px-6 py-12 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} BizVistar. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-4">
            <Link href="/terms"><span className="hover:underline cursor-pointer">Terms of Use</span></Link>
            <Link href="/privacy"><span className="hover:underline cursor-pointer">Privacy Policy</span></Link>
          </div>
        </div>
      </footer>
    </div>
  );
}