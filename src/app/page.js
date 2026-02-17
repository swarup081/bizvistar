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

           <div className="container mx-auto px-6 max-w-7xl relative z-10 text-center">

              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-6 leading-[1.15] max-w-4xl mx-auto">
                 Don&apos;t sell your dreams, <br/>
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                    Sell your products
                 </span>
              </h1>

              <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
                 Laoreet tempus vitae eu libero mattis. Pellentesque tellus purus eget eu leo.
                 Start your journey with us today.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-24 relative">
                 <Link href="/get-started">
                    <button className="px-10 py-4 bg-blue-600 text-white text-lg font-bold rounded-full hover:bg-blue-700 transition-all hover:scale-105 shadow-xl hover:shadow-2xl flex items-center gap-2 active:scale-95">
                       Build website <ArrowRight size={20} />
                    </button>
                 </Link>
              </div>

              {/* --- Real Editor Demo (Interactive) --- */}
              <div className="relative mx-auto max-w-[1400px] perspective-1000">

                 {/* Floating Card 1 (Left) */}
                 <motion.div
                    animate={{ y: [0, -12, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    className="absolute -left-12 top-20 z-20 hidden xl:flex items-center gap-3 bg-white p-4 rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-gray-100"
                 >
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 font-bold">
                       <User size={24} />
                    </div>
                    <div className="text-left">
                       <div className="text-sm font-bold text-gray-800">I have created 4 stores!</div>
                       <div className="text-xs text-gray-500">Within only 2 years</div>
                    </div>
                 </motion.div>

                 {/* Floating Card 2 (Right) */}
                 <motion.div
                    animate={{ y: [0, -15, 0] }}
                    transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                    className="absolute -right-8 bottom-40 z-20 hidden xl:flex flex-col gap-2 bg-white p-5 rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-gray-100 text-left max-w-[200px]"
                 >
                    <div className="flex items-center gap-2 mb-1">
                       <div className="p-1.5 bg-green-100 text-green-600 rounded-lg">
                          <Globe size={18} />
                       </div>
                       <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">Popular</span>
                    </div>
                    <div className="text-sm font-bold text-gray-800 leading-snug">
                       4 popular websites were in the market!
                    </div>
                 </motion.div>

                 {/* Glow effect behind editor */}
                 <div className="absolute -inset-4 bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-3xl rounded-[3rem] -z-10"></div>

                 {/* The Actual Real Editor Demo Component */}
                 <LandingEditor />
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
            <div className="mb-6 md:mb-0 flex items-center gap-2">
               <div className="w-8 h-8 bg-[#8A63D2] rounded-lg flex items-center justify-center text-white font-bold text-xl">S</div>
               <span className="text-2xl font-bold tracking-tight">Storify</span>
               <p className="text-gray-400 text-sm ml-4 border-l border-gray-700 pl-4">© {new Date().getFullYear()} Storify Inc.</p>
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
