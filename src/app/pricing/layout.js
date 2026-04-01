import Link from 'next/link';
import { Check } from 'lucide-react';
import Logo from '@/lib/logo/logoOfBizVistar';
import Footer from '@/components/Footer';
import NewHeader from '@/components/landing/NewHeader';



// Reusable Checkmark Icon
const CheckIcon = () => (
  <Check className="w-5 h-5 text-blue-600" strokeWidth={3} />
);

export default function PricingLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <NewHeader />
      </header>

      {/* Main Content (Your Page) */}
      <main>
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <Footer/>
      </footer>
    </div>
  );
}