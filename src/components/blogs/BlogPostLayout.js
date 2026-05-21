'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import NewHeader from '@/components/landing/NewHeader';
import Footer from '@/components/Footer';
import { Marquee } from "@/components/marquee";
import { getRelatedPosts } from '@/data/blogData';

export default function BlogPostLayout({ 
  category,
  title,
  author = "Swarup",
  date,
  ctaText = "Turn your ideas into a website you love with Bizvistar →",
  ctaLink = "/auth",
  heroImage = "/editorssmock.png",
  heroAlt,
  heroFilter = "",
  tableOfContents = [],
  faqs = [],
  children,
  currentHref
}) {
  const [openFaq, setOpenFaq] = useState(0);
  const toggleFaq = (index) => setOpenFaq(openFaq === index ? null : index);

  return (
    <div className="bg-white text-gray-900 min-h-screen flex flex-col relative overflow-clip antialiased font-sans">
      <NewHeader />
      
      {/* Top Promotional Banner */}
      <div className="max-w-[1240px] w-[calc(100%-32px)] md:w-full mx-auto bg-[#d7e9b9] py-4 px-4 md:px-12 text-center z-10 mt-[24px] md:mt-[80px] rounded-xl sm:rounded-2xl mb-4 sm:mb-8 shadow-sm">
        <p className="text-[#0f172a] text-[15px] font-medium flex items-center justify-center flex-wrap gap-4 m-0">
          Create a website you love with Bizvistar
          <Link href="/templates" className="px-6 py-2 bg-[#000] hover:bg-gray-800 text-white rounded-full transition-all shadow-md inline-block text-[14px] font-bold tracking-wide">
            Start Now
          </Link>
        </p>
      </div>

      <main className="flex-grow pt-4 md:pt-8 pb-8 md:pb-24 max-w-[1240px] mx-auto px-6 md:px-10 w-full">
        {/* Breadcrumb & Title Section */}
        <div className="mb-8 max-w-[850px] text-left">
          <span className="inline-block bg-[#f1f1f4] text-[#3f3f46] text-[11px] font-bold tracking-[0.05em] px-3 py-1 rounded-sm mb-4 uppercase">
            {category}
          </span>
          <h1 className="text-[36px] md:text-[44px] lg:text-[48px] leading-[1.15] font-bold font-sans text-[#0f172a] tracking-tight mb-5">
            {title}
          </h1>
          <div className="text-gray-600 mb-6 text-[14px] flex items-center gap-3">
            <span className="font-normal text-gray-800">{author}</span>
            <span className="text-gray-400 text-[10px]">•</span>
            <span className="font-normal text-gray-800">{date}</span>
          </div>
          {ctaText && (
            <div className="font-bold text-[#8A63D2] text-[15px] flex items-center gap-2 mb-8 hover:text-[#6e4ea8] transition-colors">
              <Link href={ctaLink}>{ctaText}</Link>
            </div>
          )}
        </div>

        {/* Hero Image */}
        <div className="relative w-full aspect-[16/9] md:aspect-[2.2/1] mb-16 bg-[#F3F4F6] rounded-2xl overflow-hidden flex items-center justify-center border border-gray-200">
          <img src={heroImage} alt={heroAlt || title} className={`w-full h-full object-cover object-center ${heroFilter}`} />
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-[80px] relative">
          {/* Left Column: Main Article Content */}
          <div className="lg:col-span-8 pb-4 lg:pb-10">
            {children}

            {/* FAQ Section */}
            {faqs.length > 0 && (
              <>
                <h3 className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-16 pt-16">Frequently Asked Questions</h3>
                <div className="mt-8 mb-4 lg:mb-16">
                  {faqs.map((faq, index) => (
                    <div key={index}>
                      <button onClick={() => toggleFaq(index)}
                        className="w-full flex justify-between items-center py-6 text-left focus:outline-none hover:bg-gray-50/50 transition-colors px-2"
                      >
                        <span className="text-[18px] font-bold font-sans text-gray-900 flex items-center gap-4">
                          <svg className={`w-5 h-5 text-gray-400 transition-transform duration-200 shrink-0 ${openFaq === index ? 'transform rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                          </svg>
                          {faq.question}
                        </span>
                      </button>
                      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaq === index ? 'max-h-[500px] pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <p className="text-[16px] text-gray-700 leading-relaxed pl-[44px] pr-4">{faq.answer}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Right Column: Sticky Sidebar */}
          <div className="lg:col-span-4 relative hidden lg:block">
            <div className="sticky top-[120px] pt-4 flex flex-col gap-6 pb-10 max-h-[calc(100vh-120px)] overflow-y-auto no-scrollbar">
              {/* Promo Widget */}
              <div className="bg-[#E5E0FA] rounded-xl py-5 text-center shadow-sm border border-[#d6ccf5] overflow-hidden">
                <div className="px-5">
                  <h3 className="text-[18px] font-semibold font-sans text-[#1a1b4b] mb-4 mt-5 leading-[1.3] px-2">
                    Start strong with a free,<br />customizable template
                  </h3>
                </div>
                <div className="mb-6 relative w-full overflow-hidden">
                  <Marquee className="[--duration:40s]" pauseOnHover>
                    {['aurora', 'blissly', 'flara', 'frostify'].map((slug) => (
                      <img key={slug} src={`/templatemarquee/${slug}.png`} alt={slug} className="h-[100px] w-[150px] max-w-none rounded-md shadow-sm object-cover object-top cursor-pointer hover:scale-105 transition-transform border-2 border-[#d6ccf5] ring-1 ring-white" onClick={() => window.location.href='/templates'} />
                    ))}
                  </Marquee>
                </div>
                <div className="px-5">
                  <Link href="/templates">
                    <button className="bg-black mb-6 text-white text-[14px] font-bold py-2.5 px-6 rounded-[30px] hover:bg-gray-800 transition-colors w-[100%] shadow-md border border-gray-800">
                      Explore all templates
                    </button>
                  </Link>
                </div>
              </div>

              {/* Table of Contents */}
              {tableOfContents.length > 0 && (
                <div className="pl-2">
                  <h4 className="text-[16px] font-bold font-sans text-gray-900 mb-4">In this article</h4>
                  <ul className="space-y-3 text-[13px] text-gray-600">
                    {tableOfContents.map((item, idx) => (
                      <li key={idx}>
                        <Link href={item.href} className="hover:text-[#8A63D2] transition-colors underline decoration-gray-300">
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
