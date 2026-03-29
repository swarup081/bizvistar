import React from 'react';
import Link from 'next/link';
import Logo from '@/lib/logo/logoOfBizVistar';

const footerData = [
  {
    title: "Product",
    links: [
      { name: "Website Templates", href: "#" },
      { name: "Website Builder", href: "#" },
      { name: "E-Commerce", href: "#" },
      { name: "AI Features", href: "#" },
      { name: "Integrations", href: "#" },
      { name: "Hosting", href: "#" },
      { name: "Domain Names", href: "#" },
      { name: "Mobile App Builder", href: "#" }
    ]
  },
  {
    title: "Solutions",
    links: [
      { name: "Online Store", href: "#" },
      { name: "Portfolio Website", href: "#" },
      { name: "Blog Website", href: "#" },
      { name: "Service Business", href: "#" },
      { name: "Agencies", href: "#" },
      { name: "Enterprise", href: "#" },
      { name: "Creators", href: "#" }
    ]
  },
  {
    title: "Resources",
    links: [
      { name: "Blog", href: "#" },
      { name: "Help Center", href: "#" },
      { name: "Community", href: "#" },
      { name: "Guides & Tutorials", href: "#" },
      { name: "API Documentation", href: "#" },
      { name: "Marketplace", href: "#" }
    ]
  },
  {
    title: "Support",
    links: [
      { name: "Contact Support", href: "#" },
      { name: "Hire an Expert", href: "#" },
      { name: "Report Abuse", href: "#" },
      { name: "System Status", href: "#", highlight: true }
    ]
  },
  {
    title: "Company",
    links: [
      { name: "About Us", href: "#" },
      { name: "Careers", href: "#" },
      { name: "Partners", href: "#" },
      { name: "Affiliate Program", href: "#" },
      { name: "Press & Media", href: "#" },
      { name: "Contact Us", href: "#" }
    ]
  }
];

const BrandSection = () => (
  <div className="flex flex-col text-sm text-gray-800">
    <div className="mb-6 hover:opacity-80 transition-opacity">
      <Link href="/">
        <Logo className="text-3xl" />
      </Link>
    </div>
    <p className="leading-relaxed mb-6">
      BizVistar is a powerful platform that empowers businesses and individuals to build professional websites effortlessly. With intelligent design tools and comprehensive business solutions, BizVistar provides everything you need to create, manage, and scale your online presence.
    </p>
    <div className="flex flex-col gap-4">
      <Link href="#" className="hover:text-black transition-colors">About Us</Link>
      <Link href="#" className="hover:text-black transition-colors">Contact Us</Link>
    </div>
  </div>
);

export default function Footer() {
  return (
    <footer className="w-full bg-white text-gray-800 font-sans border-t border-gray-200 relative pb-10 overflow-hidden">
     

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 pt-16">
        {/* Top Section Layout */}
        <div className="flex flex-col lg:flex-row lg:justify-between gap-12 lg:gap-8">
          
          {/* Mobile Brand Introduction (Hidden on Desktop) */}
          <div className="block lg:hidden">
            <BrandSection />
          </div>

          {/* Links Section */}
          <div className="w-full lg:w-[75%] grid grid-cols-1 lg:grid-cols-5 lg:gap-6 border-t border-gray-200 lg:border-t-0">
            {footerData.map((section, idx) => (
              <details 
                key={idx} 
                className="group lg:pointer-events-none lg:open border-b border-gray-200 lg:border-b-0"
                open
              >
                <summary className="list-none flex justify-between items-center py-5 lg:py-0 cursor-pointer lg:cursor-auto lg:block">
                  <h3 className="text-[15px] font-medium text-black">
                    {section.title}
                  </h3>
                  {/* Chevron for mobile accordion */}
                  <svg 
                    className="w-4 h-4 text-gray-500 transition-transform duration-200 group-open:-rotate-180 lg:hidden" 
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                
                <ul className="pb-5 lg:pb-0 lg:pt-6 flex flex-col gap-3.5 text-[14px] text-gray-600">
                  {section.links.map((link, linkIdx) => {
                    const linkName = link.name;
                    const linkHref = link.href || "#";
                    const isHighlight = link.highlight || false;

                    return (
                      <li key={linkIdx}>
                        <Link 
                          href={linkHref}
                          className={`hover:text-black transition-colors ${isHighlight ? 'text-blue-600 hover:text-blue-700 font-medium' : ''}`}
                        >
                          {linkName}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </details>
            ))}
          </div>

          {/* Desktop Brand Section (Hidden on Mobile) */}
          <div className="hidden lg:block lg:w-[25%] pl-8">
            <BrandSection />
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t border-gray-200 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          
          {/* Social Icons */}
          <div className="flex items-center gap-4 text-black">
            {/* Facebook */}
            <Link href="#" aria-label="Facebook"><svg className="w-5 h-5 hover:opacity-75" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z"/></svg></Link>
            {/* YouTube */}
            <Link href="#" aria-label="YouTube"><svg className="w-5 h-5 hover:opacity-75" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg></Link>
            {/* Instagram */}
            <Link href="#" aria-label="Instagram"><svg className="w-5 h-5 hover:opacity-75" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg></Link>
            {/* TikTok */}
            <Link href="#" aria-label="TikTok"><svg className="w-5 h-5 hover:opacity-75" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.04.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 2.78-1.15 5.54-3.33 7.42-2.25 1.95-5.36 2.71-8.32 2.18-2.58-.46-4.98-2.02-6.28-4.27-1.35-2.33-1.57-5.26-.59-7.75 1.05-2.68 3.51-4.74 6.37-5.32 1.2-.24 2.45-.26 3.66-.08v4.11c-1.64-.28-3.42-.04-4.79 1.01-1.39 1.05-2.14 2.82-1.92 4.56.24 1.83 1.54 3.44 3.28 4.02 1.78.58 3.86.37 5.37-.87 1.34-1.09 2.06-2.77 2.1-4.49.12-6.14.07-12.28.09-18.42h-2.05z"/></svg></Link>
            {/* Pinterest */}
            <Link href="#" aria-label="Pinterest"><svg className="w-5 h-5 hover:opacity-75" fill="currentColor" viewBox="0 0 24 24"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.951-7.252 4.185 0 7.439 2.984 7.439 6.963 0 4.162-2.624 7.51-6.273 7.51-1.223 0-2.373-.635-2.766-1.388l-.753 2.871c-.272 1.037-1.01 2.333-1.503 3.122 1.134.348 2.334.536 3.585.536 6.621 0 11.988-5.367 11.988-11.987C24.005 5.367 18.638 0 12.017 0z"/></svg></Link>
            {/* X (Twitter) */}
            <Link href="#" aria-label="X"><svg className="w-5 h-5 hover:opacity-75" fill="currentColor" viewBox="0 0 24 24"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg></Link>
            {/* LinkedIn */}
            <Link href="#" aria-label="LinkedIn"><svg className="w-5 h-5 hover:opacity-75" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></Link>
          </div>

          {/* Legal Links & Copyright */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 text-sm text-gray-500">
            <div className="flex gap-6">
              <Link href="#" className="hover:text-black transition-colors">Terms of Service</Link>
              <Link href="#" className="hover:text-black transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-black transition-colors">Refund Policy</Link>
            </div>
            <span>© {new Date().getFullYear()} BizVistar. All rights reserved.</span>
          </div>

        </div>
      </div>
    </footer>
  );
}