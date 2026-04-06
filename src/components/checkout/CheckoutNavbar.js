import Link from 'next/link';
import Logo from '@/lib/logo/logoOfBizvistar';

export default function CheckoutNavbar() {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/">
          <span className="text-3xl font-bold text-gray-900 cursor-pointer">
            <Logo />
          </span>
        </Link>
      </div>
    </nav>
  );
}
