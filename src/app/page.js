'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import NewHeader from '@/components/landing/NewHeader';
import LandingEditor from '@/components/landing/LandingEditor';
import TemplateCarousel from '@/components/landing/TemplateCarousel';
import { ArrowRight, User, Globe } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="bg-white font-sans text-gray-900 min-h-screen flex flex-col overflow-x-hidden">
      <NewHeader />
      
      <main className="flex-grow pt-0">
        {/* --- Hero Section --- */}
        <section className="relative pt-20 pb-32 overflow-hidden bg-[#Fdfdfd]">
           {/* Background Decorations */}
           <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
              <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-purple-100/40 rounded-full blur-[120px]"></div>
              <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-blue-100/40 rounded-full blur-[100px]"></div>
           </div>

           {/* --- NEW ADDITION: Wavy Background Texture --- */}
           {/* Positioned absolute top/right to cover top and side of editor */}
           <div className="absolute top-104 scale-0.5 right-0 w-full h-[80%] pointer-events-none z-0">
              <img 
                src="/landing/bgwaveytexture.png" 
                alt="Background Texture" 
                className="w-full h-[80%] object-cover opacity-15" 
              />
           </div>
           
           <div className="container mx-auto px-6 max-w-7xl relative z-10 text-center">
              
              <h1 className="text-5xl not-italic md:text-7xl font-bold  tracking-tight text-gray-900 mb-16 leading-[1.15] max-w-4xl mx-auto">
                 Don&apos;t sell your dreams, <br/>
                 <span className="text-transparent not-italic bg-clip-text bg-black">
                    Sell your products
                 </span>
              </h1>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-5 text-center sm:text-left">

                {/* Arrow pointing to editor */}
                <img
                  src="/landing/arrowdirntoeditor.png"
                  alt="Arrow pointing to editor"
                  className="hidden sm:block w-34 pt-20 mr-0"
                />

                <Link href="/get-started">
                  <button className="px-10 py-4 bg-[#8A63D2] text-white text-lg font-bold rounded-2xl hover:bg-[#8A63D2] transition-all hover:scale-105 shadow-xl hover:shadow-2xl flex items-center gap-2 active:scale-95">
                    Build website
                  </button>
                </Link>

                <p className="text-xl text-gray-500 max-w-md leading-relaxed font-light">
                  Laoreet tempus vitae eu libero mattis.<br />
                  Start your journey with us today.
                </p>

              </div>

              {/* --- Real Editor Demo (Interactive) --- */}
              <div className="relative mx-auto max-w-[1400px] perspective-1000">
                 
                 {/* Glow effect behind editor */}
                 <div className="absolute -inset-4 bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-3xl rounded-[3rem] -z-10"></div>
                 
                 {/* The Actual Real Editor Demo Component */}
                 <LandingEditor />
              </div>

           </div>
        </section>

        {/* --- Carousel Section --- */}
        <section className="py-20 bg-white border-t border-gray-100">
           <TemplateCarousel />
        </section>

      </main>

      {/* --- Simple Footer --- */}
      <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
         <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0 flex items-center gap-2">
               <span className="text-2xl font-bold tracking-tight">BizVistar</span>
               <p className="text-gray-400 text-sm ml-4 border-l border-gray-700 pl-4">© {new Date().getFullYear()} BizVistar Inc.</p>
            </div>
            <div className="flex gap-8 text-sm text-gray-400 font-medium">
               <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
               <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
               <Link href="#" className="hover:text-white transition-colors">Contact Support</Link>
            </div>
         </div>
      </footer>
    </div>
  );
}