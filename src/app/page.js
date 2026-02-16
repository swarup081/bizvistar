'use client';

import Link from 'next/link';
import NewHeader from '@/components/landing/NewHeader';
import LandingEditorDemo from '@/components/landing/LandingEditorDemo';
import TemplateCarousel from '@/components/landing/TemplateCarousel';
import { ArrowRight, Star } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="bg-white font-sans text-gray-900 min-h-screen flex flex-col overflow-x-hidden">
      <NewHeader />
      
      <main className="flex-grow pt-20">
        {/* --- Hero Section --- */}
        <section className="relative pt-20 pb-32 overflow-hidden bg-gradient-to-b from-purple-50/50 via-white to-white">
           <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 pointer-events-none"></div>

           <div className="container mx-auto px-6 max-w-7xl relative z-10 text-center">

              <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-8 animate-fade-in-up">
                 <Star size={14} fill="currentColor" />
                 <span>Trusted by 10,000+ Small Businesses</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-6 leading-[1.1]">
                 Build Your Professional <br className="hidden md:block"/>
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                    Business Website
                 </span> in Minutes
              </h1>

              <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
                 The easiest website builder for non-techies.
                 Pick a template, edit with a click, and launch your dream online store today.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
                 <Link href="/get-started">
                    <button className="px-8 py-4 bg-gray-900 text-white text-lg font-bold rounded-full hover:bg-gray-800 transition-all hover:scale-105 shadow-xl flex items-center gap-2">
                       Start for Free <ArrowRight size={20} />
                    </button>
                 </Link>
                 <Link href="/templates">
                    <button className="px-8 py-4 bg-white text-gray-900 border border-gray-200 text-lg font-bold rounded-full hover:bg-gray-50 transition-all hover:border-gray-300">
                       View Templates
                    </button>
                 </Link>
              </div>

              {/* --- Mock Editor Demo --- */}
              <div className="relative mx-auto max-w-6xl perspective-1000">
                 {/* Glow effect behind editor */}
                 <div className="absolute -inset-4 bg-gradient-to-r from-purple-400 to-blue-400 opacity-20 blur-2xl rounded-[3rem] -z-10"></div>

                 <LandingEditorDemo />
              </div>

           </div>
        </section>

        {/* --- Carousel Section --- */}
        <section className="py-20 bg-gray-50 border-t border-gray-100">
           <TemplateCarousel />
        </section>

      </main>

      {/* --- Simple Footer --- */}
      <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
         <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
               <span className="text-2xl font-bold tracking-tight">BizVistar</span>
               <p className="text-gray-400 text-sm mt-2">© {new Date().getFullYear()} BizVistar. All rights reserved.</p>
            </div>
            <div className="flex gap-8 text-sm text-gray-400">
               <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
               <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
               <Link href="#" className="hover:text-white transition-colors">Contact</Link>
            </div>
         </div>
      </footer>
    </div>
  );
}
