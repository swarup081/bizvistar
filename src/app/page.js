'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, ArrowRight, CheckCircle2, Star, Zap,
  Shield, BarChart3, Globe, Smartphone, Layout, ChevronRight
} from 'lucide-react';

// --- Shared Components ---

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyle = "px-6 py-3 rounded-full font-medium transition-all duration-200 flex items-center justify-center";
  const variants = {
    primary: "bg-[#8A63D2] text-white hover:bg-[#7651c0] shadow-md hover:shadow-lg",
    secondary: "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50",
    text: "text-gray-600 hover:text-[#8A63D2] px-4",
    outline: "border-2 border-gray-900 text-gray-900 hover:bg-gray-50"
  };
  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const SectionHeader = ({ title, subtitle, center = false }) => (
  <div className={`mb-12 ${center ? 'text-center max-w-3xl mx-auto' : ''}`}>
    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">{title}</h2>
    {subtitle && <p className="text-lg text-gray-600 leading-relaxed">{subtitle}</p>}
  </div>
);

const PlaceholderImage = ({ height = "h-64", color = "bg-gray-100", label }) => (
  <div className={`w-full ${height} ${color} rounded-2xl flex items-center justify-center overflow-hidden border border-gray-200`}>
    <span className="text-gray-400 font-medium text-sm uppercase tracking-widest">{label || 'Image Placeholder'}</span>
  </div>
);

// --- Sections ---

// 1. Navigation
const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#8A63D2] rounded-lg"></div>
                    <span className="text-xl font-bold text-gray-900 tracking-tight">BizVistar</span>
                </Link>
                
                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    <Link href="#" className="text-sm font-medium text-gray-600 hover:text-[#8A63D2]">Features</Link>
                    <Link href="#" className="text-sm font-medium text-gray-600 hover:text-[#8A63D2]">Templates</Link>
                    <Link href="#" className="text-sm font-medium text-gray-600 hover:text-[#8A63D2]">Pricing</Link>
                    <Link href="#" className="text-sm font-medium text-gray-600 hover:text-[#8A63D2]">Resources</Link>
                </div>

                <div className="hidden md:flex items-center gap-4">
                    <Link href="/sign-in" className="text-sm font-medium text-gray-900 hover:text-[#8A63D2]">Log in</Link>
                    <Link href="/get-started">
                        <Button variant="primary" className="py-2 px-5 text-sm">Get Started</Button>
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-600">
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
                    >
                        <div className="flex flex-col p-6 gap-4">
                             <Link href="#" className="text-base font-medium text-gray-900">Features</Link>
                             <Link href="#" className="text-base font-medium text-gray-900">Templates</Link>
                             <Link href="#" className="text-base font-medium text-gray-900">Pricing</Link>
                             <Link href="#" className="text-base font-medium text-gray-900">Resources</Link>
                             <div className="h-px bg-gray-100 my-2"></div>
                             <Link href="/sign-in" className="text-base font-medium text-gray-900">Log in</Link>
                             <Link href="/get-started">
                                <Button className="w-full">Get Started</Button>
                             </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

// 2. Hero Section
const Hero = () => (
  <section className="pt-32 pb-20 px-6">
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      <div className="space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-[#8A63D2] text-sm font-medium">
          <span className="flex h-2 w-2 rounded-full bg-[#8A63D2]"></span>
          New: AI Website Builder 2.0
        </div>
        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-[1.1] tracking-tight">
          Build your dream website in <span className="text-[#8A63D2]">minutes.</span>
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
          BizVistar empowers you to launch, manage, and grow your business online with zero coding skills required.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/get-started">
             <Button className="w-full sm:w-auto px-8">Start for free</Button>
          </Link>
          <Button variant="secondary" className="w-full sm:w-auto px-8">View Demo</Button>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex -space-x-2">
            {[1,2,3,4].map(i => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200"></div>
            ))}
          </div>
          <p>Trusted by 10,000+ creators</p>
        </div>
      </div>
      <div className="relative">
         <PlaceholderImage height="h-[500px]" color="bg-gradient-to-br from-gray-100 to-gray-200" label="Hero Product Shot" />
         {/* Floating Elements */}
         <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-8 top-1/4 bg-white p-4 rounded-xl shadow-xl border border-gray-100"
         >
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                    <p className="text-xs text-gray-500">Sales Growth</p>
                    <p className="text-sm font-bold text-gray-900">+124%</p>
                </div>
            </div>
         </motion.div>
      </div>
    </div>
  </section>
);

// 3. Social Proof
const Logos = () => (
  <section className="py-12 border-y border-gray-100 bg-white">
    <div className="max-w-7xl mx-auto px-6 text-center">
      <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-8">Trusted by industry leaders</p>
      <div className="flex flex-wrap justify-center items-center gap-12 opacity-50 grayscale">
        {[1,2,3,4,5,6].map(i => (
           <div key={i} className="h-8 w-32 bg-gray-300 rounded"></div>
        ))}
      </div>
    </div>
  </section>
);

// 4. Feature 1 (Left Text, Right Image)
const Feature1 = () => (
  <section className="py-24 px-6 bg-white">
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
      <div>
        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
            <Zap className="w-6 h-6 text-[#8A63D2]" />
        </div>
        <SectionHeader
            title="Lightning fast performance."
            subtitle="Don't lose customers to slow loading times. Our infrastructure ensures your site loads instantly, everywhere."
        />
        <ul className="space-y-4">
            {['Global CDN', 'Image Optimization', '99.9% Uptime'].map((item) => (
                <li key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#8A63D2]" />
                    <span className="text-gray-700 font-medium">{item}</span>
                </li>
            ))}
        </ul>
      </div>
      <PlaceholderImage height="h-[500px]" color="bg-gray-50" label="Performance Dashboard" />
    </div>
  </section>
);

// 5. Feature 2 (Right Text, Left Image)
const Feature2 = () => (
  <section className="py-24 px-6 bg-gray-50/50">
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
      <div className="order-2 lg:order-1">
        <PlaceholderImage height="h-[500px]" color="bg-white shadow-sm" label="Design Editor Interface" />
      </div>
      <div className="order-1 lg:order-2">
        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
            <Layout className="w-6 h-6 text-blue-600" />
        </div>
        <SectionHeader
            title="Design without limits."
            subtitle="Our drag-and-drop editor gives you complete control. Customize every pixel to match your brand identity perfectly."
        />
        <Button variant="outline" className="mt-4">Explore Editor</Button>
      </div>
    </div>
  </section>
);

// 6. Carousel Section (FIXED LOGIC)
const CarouselSection = () => {
    const [activeIndex, setActiveIndex] = useState(2);
    const items = [
        { id: 0, title: "Modern", color: "bg-red-100" },
        { id: 1, title: "Classic", color: "bg-orange-100" },
        { id: 2, title: "Elegant", color: "bg-[#8A63D2]/20" },
        { id: 3, title: "Bold", color: "bg-green-100" },
        { id: 4, title: "Minimal", color: "bg-blue-100" },
    ];

    const CARD_WIDTH = 280; // Fixed width for desktop
    const GAP = 32; // gap-8 = 32px

    return (
        <section className="py-32 overflow-hidden bg-white">
            <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose your style</h2>
                <p className="text-gray-600">Click on a template to bring it to focus.</p>
            </div>

            {/* Carousel Container */}
            <div className="relative h-[500px] w-full flex items-center justify-center">
                {/*
                   We translate the container so that the active item is always in the center.
                   The center of the active item is at: index * (CARD_WIDTH + GAP) + CARD_WIDTH/2
                   We want this point to be at 50% of the screen.
                */}
                <motion.div
                    className="flex gap-8 absolute left-1/2"
                    initial={false}
                    animate={{
                        x: - (activeIndex * (CARD_WIDTH + GAP)) - (CARD_WIDTH / 2)
                    }}
                    transition={{ type: "spring", stiffness: 200, damping: 25 }}
                >
                    {items.map((item, index) => {
                        const isActive = index === activeIndex;
                        return (
                            <motion.div
                                key={item.id}
                                onClick={() => setActiveIndex(index)}
                                className={`relative cursor-pointer rounded-2xl shadow-xl overflow-hidden flex-shrink-0 transition-shadow duration-300 ${isActive ? 'shadow-2xl ring-4 ring-[#8A63D2]/20' : ''}`}
                                style={{
                                    width: `${CARD_WIDTH}px`,
                                    height: '400px',
                                }}
                                animate={{
                                    scale: isActive ? 1.1 : 0.9,
                                    opacity: isActive ? 1 : 0.5,
                                    y: isActive ? 0 : 20
                                }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className={`w-full h-full ${item.color} flex flex-col items-center justify-center p-6 border border-gray-200 bg-white`}>
                                    <div className="w-full h-3/4 bg-gray-100 rounded-lg mb-4"></div>
                                    <h3 className={`text-xl font-bold ${isActive ? 'text-[#8A63D2]' : 'text-gray-400'}`}>{item.title}</h3>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
};

// 7. Feature 3 (Grid)
const FeatureGrid = () => (
    <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
            <SectionHeader title="Everything you need to grow." center />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { icon: Globe, title: "Custom Domain", desc: "Connect your own domain name instantly." },
                    { icon: Shield, title: "Secure SSL", desc: "Free SSL certificate included with every site." },
                    { icon: Smartphone, title: "Mobile Responsive", desc: "Looks perfect on desktops, tablets, and phones." },
                    { icon: BarChart3, title: "Analytics", desc: "Track visitors and understand your audience." },
                    { icon: Zap, title: "SEO Optimized", desc: "Built-in tools to help you rank on Google." },
                    { icon: Star, title: "24/7 Support", desc: "We are here to help you anytime, day or night." }
                ].map((feature, i) => (
                    <div key={i} className="bg-white p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow">
                        <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mb-6">
                            <feature.icon className="w-6 h-6 text-[#8A63D2]" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                        <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

// 8. Testimonials
const Testimonials = () => (
    <section className="py-24 px-6 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
            <SectionHeader title="Loved by thousands." center />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="p-8 rounded-2xl bg-gray-50 border border-gray-100">
                        <div className="flex text-yellow-400 mb-4">
                            {[1,2,3,4,5].map(star => <Star key={star} className="w-4 h-4 fill-current" />)}
                        </div>
                        <p className="text-gray-700 mb-6">"BizVistar transformed how we do business. The website builder is incredibly intuitive and the results are professional."</p>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                            <div>
                                <p className="font-bold text-gray-900 text-sm">Sarah Johnson</p>
                                <p className="text-xs text-gray-500">Founder, Studio X</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

// 9. CTA Section
const CTA = () => (
    <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto bg-[#8A63D2] rounded-3xl p-12 md:p-20 text-center text-white relative overflow-hidden">
             {/* Background decorative circles */}
             <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
             <div className="absolute bottom-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full translate-x-1/3 translate-y-1/3"></div>

             <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Ready to launch?</h2>
                <p className="text-lg md:text-xl text-purple-100 mb-10 max-w-2xl mx-auto">
                    Join 10,000+ businesses growing with BizVistar today. No credit card required.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link href="/get-started">
                        <button className="px-8 py-4 bg-white text-[#8A63D2] rounded-full font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg">
                            Get Started Now
                        </button>
                    </Link>
                    <button className="px-8 py-4 bg-transparent border-2 border-purple-300 text-white rounded-full font-bold text-lg hover:bg-purple-800 transition-colors">
                        Contact Sales
                    </button>
                </div>
             </div>
        </div>
    </section>
);

// 10. Footer
const Footer = () => (
    <footer className="bg-white pt-20 pb-10 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
                <div className="col-span-2 lg:col-span-2">
                    <Link href="/" className="flex items-center gap-2 mb-6">
                        <div className="w-8 h-8 bg-[#8A63D2] rounded-lg"></div>
                        <span className="text-xl font-bold text-gray-900 tracking-tight">BizVistar</span>
                    </Link>
                    <p className="text-gray-500 text-sm leading-relaxed max-w-xs mb-6">
                        The all-in-one platform for building, managing, and growing your online business presence.
                    </p>
                    <div className="flex gap-4">
                        {[1,2,3,4].map(i => <div key={i} className="w-8 h-8 bg-gray-100 rounded-full hover:bg-[#8A63D2] hover:text-white transition-colors"></div>)}
                    </div>
                </div>
                
                <div>
                    <h4 className="font-bold text-gray-900 mb-6">Product</h4>
                    <ul className="space-y-4 text-sm text-gray-600">
                        <li><Link href="#" className="hover:text-[#8A63D2]">Features</Link></li>
                        <li><Link href="#" className="hover:text-[#8A63D2]">Templates</Link></li>
                        <li><Link href="#" className="hover:text-[#8A63D2]">Pricing</Link></li>
                        <li><Link href="#" className="hover:text-[#8A63D2]">Showcase</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold text-gray-900 mb-6">Company</h4>
                    <ul className="space-y-4 text-sm text-gray-600">
                        <li><Link href="#" className="hover:text-[#8A63D2]">About</Link></li>
                        <li><Link href="#" className="hover:text-[#8A63D2]">Careers</Link></li>
                        <li><Link href="#" className="hover:text-[#8A63D2]">Blog</Link></li>
                        <li><Link href="#" className="hover:text-[#8A63D2]">Contact</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold text-gray-900 mb-6">Legal</h4>
                    <ul className="space-y-4 text-sm text-gray-600">
                        <li><Link href="#" className="hover:text-[#8A63D2]">Privacy</Link></li>
                        <li><Link href="#" className="hover:text-[#8A63D2]">Terms</Link></li>
                        <li><Link href="#" className="hover:text-[#8A63D2]">Security</Link></li>
                    </ul>
                </div>
            </div>

            <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-sm text-gray-500">© 2024 BizVistar Inc. All rights reserved.</p>
                <div className="flex gap-8 text-sm text-gray-500">
                    <span>Made with ❤️ in India</span>
                </div>
            </div>
        </div>
    </footer>
);


export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-[#8A63D2] selection:text-white">
      <Navbar />
      <Hero />
      <Logos />
      <Feature1 />
      <Feature2 />
      <CarouselSection />
      <FeatureGrid />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
}
