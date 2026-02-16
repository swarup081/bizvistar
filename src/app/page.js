'use client';

import Link from 'next/link';
import NewHeader from '@/components/landing/NewHeader';
import MockEditor from '@/components/landing/MockEditor';
import TemplateCarousel from '@/components/landing/TemplateCarousel';
import { ArrowRight, Star, CheckCircle2 } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="bg-white font-sans text-gray-900 min-h-screen flex flex-col">
      <NewHeader />
      
      <main className="flex-grow pt-20">
        {/* --- Hero Section --- */}
        <section className="relative pt-20 pb-32 overflow-hidden bg-gradient-to-b from-purple-50/50 via-white to-white">
           <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

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
              <div className="relative mx-auto max-w-5xl perspective-1000">
                 {/* Glow effect behind editor */}
                 <div className="absolute -inset-4 bg-gradient-to-r from-purple-400 to-blue-400 opacity-20 blur-2xl rounded-[3rem] -z-10"></div>

                 <MockEditor />

                 <p className="mt-6 text-sm text-gray-500 font-medium flex items-center justify-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Interactive Demo: Hover to try it yourself!
                 </p>
              </div>

           </div>
        </section>

        {/* --- Carousel Section --- */}
        <section className="py-20 bg-gray-50 border-t border-gray-100">
           <TemplateCarousel />
        </section>

        {/* --- Features / Social Proof (Placeholder for now) --- */}
        <section className="py-20 bg-white">
           <div className="container mx-auto px-6 max-w-4xl text-center">
              <h3 className="text-3xl font-bold mb-12">Everything you need to grow</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 {[
                    { title: "Zero Coding", desc: "No technical skills needed. Our AI handles the heavy lifting." },
                    { title: "Mobile Ready", desc: "Your site looks perfect on every device, automatically." },
                    { title: "SEO Optimized", desc: "Get found on Google with built-in SEO tools." }
                 ].map((feature, i) => (
                    <div key={i} className="p-6 bg-gray-50 rounded-2xl">
                       <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4 text-purple-600">
                          <CheckCircle2 size={24} />
                       </div>
                       <h4 className="font-bold text-lg mb-2">{feature.title}</h4>
                       <p className="text-gray-600">{feature.desc}</p>
                    </div>
                 ))}
              </div>
           </div>
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
