// src/components/ui/Header.js
import { ShoppingBag, Menu } from 'lucide-react';
import Link from 'next/link';

export const Header = ({ 
  logoText, 
  links = [], 
  cartCount = 0, 
  onCartClick,
  className = "bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100"
}) => {
  return (
    <header className={className}>
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold font-serif text-gray-900 tracking-tight">
          {logoText}
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-8">
          {links.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className="text-sm font-medium text-gray-600 hover:text-black uppercase tracking-wider transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-6">
          <button onClick={onCartClick} className="relative group p-1">
            <ShoppingBag className="w-6 h-6 text-gray-700 group-hover:scale-110 transition-transform" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
          
          {/* Mobile Menu Trigger (Visual only for now) */}
          <button className="md:hidden">
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </div>
    </header>
  );
};