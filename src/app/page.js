'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import NewHeader from '@/components/landing/NewHeader';
import LandingEditor from '@/components/landing/LandingEditor';
import TemplateCarousel from '@/components/landing/TemplateCarousel';
import StickySubNav from '@/components/landing/StickySubNav';
import PricingSection from '@/components/landing/PricingSection';
import HowItWorks from '@/components/landing/HowItWorks';
import MarqueeDemo from '@/components/landing/MarqueeDemo'; 
import BenefitsSection from '@/components/landing/BenefitsSection';
import FaqSection from '@/components/checkout/FaqSection';
import Footer from '@/components/Footer';


export default function LandingPage() {
  return (
    <div className="bg-white font-sans text-gray-900 min-h-screen flex flex-col overflow-x-hidden relative">
      <NewHeader />
      
      <main className="flex-grow pt-0">
        {/* --- Hero Section --- */}
        <section id="overview" className="relative pt-20 pb-32 overflow-hidden bg-[#Fdfdfd] scroll-mt-24">
           {/* Background Decorations */}
           <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
              <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-brand-100/40 rounded-full blur-[120px]"></div>
              <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-blue-100/40 rounded-full blur-[100px]"></div>
           </div>

           {/* Wavy Background Texture */}
           <div className="absolute top-104 scale-0.5 right-0 w-full h-[80%] pointer-events-none z-0">
              <img 
                src="/landing/bgwaveytexture.png" 
                alt="Background Texture" 
                className="w-full h-[80%] object-cover opacity-15" 
              />
           </div>
           
           <div className="container mx-auto px-6 max-w-7xl relative z-10 text-center">
              <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
                 <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight mb-4 sm:mb-6">
                    Don&apos;t sell your dreams, <br/>
                    <span className="text-transparent not-italic bg-clip-text bg-black">
                       Sell your products
                    </span>
                 </h1>

                 <p className="text-sm sm:text-xl text-gray-600 mb-8 sm:mb-10 max-w-2xl mx-auto">
                   Laoreet tempus vitae eu libero mattis.<br />
                   Start your journey with us today.
                 </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-5 text-center sm:text-left">
                {/* Arrow pointing to editor */}
                <img
                  src="/landing/arrowdirntoeditor.png"
                  alt="Arrow pointing to editor"
                  className="hidden sm:block w-34 pt-20 mr-0"
                />

                <Link href="/get-started">
                  <button className="px-10 py-4 bg-[#8A63D2] text-white text-lg font-bold rounded-2xl hover:bg-[#7554b3] transition-all hover:scale-105 shadow-xl hover:shadow-2xl flex items-center gap-2 active:scale-95">
                    Build website
                  </button>
                </Link>
              </div>

              {/* --- Real Editor Demo (Interactive) --- */}
              <div className="relative mx-auto max-w-[1400px] perspective-1000">
                 {/* Glow effect behind editor */}
                 <div className="absolute -inset-4 bg-gradient-to-r from-blue-400/20 to-brand-400/20 blur-3xl rounded-[3rem] -z-10"></div>
                 <LandingEditor />
              </div>
           </div>
        </section>

  

        {/* --- STICKY NAV COMES EXACTLY HERE AFTER CAROUSEL --- */}
        <StickySubNav />

        {/* --- PRICING SECTION --- */}
        <section id="pricing" >
          <PricingSection />
        </section>

        {/* --- Carousel Section --- */}
        <section id="templates" >
          <TemplateCarousel />
        </section>

        <div className="flex justify-center">
          <Link href="/templates">
            <button className="px-8 py-6 bg-[#000] mb-10 text-white text-lg font-bold rounded-2xl transition-all hover:scale-105 shadow-xl hover:shadow-2xl flex items-center gap-3 active:scale-95">
            Browse All Templates
              <motion.span
                animate={{ x: [0, 10, 0] }}
                transition={{ duration: 0.9, ease: 'easeInOut', repeat: Infinity, repeatDelay: 3 }}
                className="inline-block text-xl"
              >
                →
              </motion.span>
            </button>
          </Link>
        </div>

        {/* --- HOW IT WORKS SECTION --- */}
        <section id="how-it-works" >
          <HowItWorks />
        </section>

              {/* --- THRIVING WITH WIX (HORIZONTAL SCROLL) --- */}
        <section id="testimonial" >
                <MarqueeDemo />
         </section>

              {/* --- NEW BENEFITS SECTION INSERTED HERE --- */}
        <section id="benefits" >
          <BenefitsSection />
        </section>
          {/* --- FAQ SECTION --- */}
          <section id="faq" >
          <div className="container my-25 mt-40 mx-auto px-6 max-w-7xl">
            <FaqSection pageType="landing" />
          </div>
        </section>

         

        

      </main>

      {/* --- Simple Footer --- */}
      <footer >
       <Footer/>
      </footer>
    </div>
  );
}