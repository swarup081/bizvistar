'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import NewHeader from '@/components/landing/NewHeader';
import Footer from '@/components/Footer';
import { Marquee } from "@/components/marquee";
import BlogSecondaryNav from '@/components/blogs/BlogSecondaryNav';
import BlogBentoGrid from '@/components/blogs/BlogBentoGrid';
import { ALL_BLOG_POSTS } from '@/data/blogData';

export default function BlogPost() {
  const [openFaq, setOpenFaq] = useState(0);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    { question: "Will I lose engagement if I direct people away from Instagram?", answer: "No. You keep your top-of-funnel engagement high with Reels and Stories, but you transition the transactional phase to a platform built for it. Likes and comments are great, but closed sales are what pay the bills." },
    { question: "Do customers trust random websites?", answer: "Customers trust modern, secure websites far more than transferring money to a random UPI ID sent in a DM. A professional storefront with SSL and clear policies establishes massive brand credibility." },
    { question: "Can I still sell in DMs?", answer: "Yes, but you can send them a direct product link in the DM, allowing them to view rich details, high-res images, and checkout instantly rather than typing out bank details." },
    { question: "Does the Instagram algorithm punish external links?", answer: "Not if used correctly. Focus your in-app content on engagement, and use the 'Link in Bio' or Instagram Shopping tags strategically. The algorithm rewards content that keeps people watching." },
    { question: "How do I build a website if I only know social media?", reflex: false, answer: "Platforms like Bizvistar are designed specifically for social media creators and merchants. You don't need coding skills. It's as easy as organizing your Instagram highlights." },
    { question: "Can I track where my buyers are coming from?", answer: "Absolutely. This is the biggest advantage of a website. You can connect Facebook Pixel or Google Analytics to see exactly which posts are generating actual revenue, not just views." }
  ];

  return (
    <div className="bg-white text-gray-900 min-h-screen flex flex-col relative overflow-clip antialiased font-sans">
      
      <NewHeader />

      <div className="bg-gray-50/50 pb-8 pt-4 md:pt-12 z-[100] relative">
        <BlogSecondaryNav posts={ALL_BLOG_POSTS.slice(0, 6)} />
      </div>
      
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
            MARKETING & SALES
          </span>
          
          <h1 className="text-[36px] md:text-[44px] lg:text-[48px] leading-[1.15] font-bold font-sans text-[#0f172a] tracking-tight mb-5">
            Instagram DM vs. A Professional Website: Where Should Your Customers Shop?
          </h1>
          
          <div className="text-gray-600 mb-6 text-[14px] flex items-center gap-3">
            <span className="font-normal text-gray-800">Swarup</span>
            <span className="text-gray-400 text-[10px]">•</span>
            <span className="font-normal text-gray-800">May 23</span>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-[80px] relative">
          
          {/* Left Column: Main Article Content */}
          <div className="lg:col-span-8 pb-4 lg:pb-10">
            
            {/* Hero Image */}
            <div className="relative w-full aspect-square mb-12 bg-[#F5E6A3] rounded-2xl overflow-hidden flex items-center justify-center border border-gray-200">
               <img 
                  src="/blogs/blog_hero_instagram_vs_website.png" 
                  alt="Instagram DM vs Professional Website - Where Should Customers Shop" 
                  className="w-full h-full object-contain"
                />
            </div>
            
            <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">
              Instagram is arguably the greatest discovery engine ever built for small businesses. Its algorithm is incredibly efficient at finding people who might be interested in your aesthetic, your products, and your story. Visuals pop, communities form rapidly in comment sections, and trends can take a micro-business viral overnight. But there is a massive difference between a discovery engine designed to keep people scrolling, and a conversion engine designed to get them to checkout.
            </p>
            <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">
              Many business owners confuse the two. They rely entirely on Instagram Direct Messages (DMs) to close complex sales, effectively treating a personal social media chat app like an enterprise e-commerce platform. They measure their business success in vanity metrics—likes, saves, and follower counts—while constantly wondering why their actual bank accounts do not reflect their perceived online popularity. 
            </p>
            <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">
              If your entire business lives inside Instagram, you are building your house on rented land. A single algorithm change or a shadowban can wipe out your revenue stream in a day. In this breakdown, we will explore why you need to transition your audience from an environment of infinite distraction (Instagram) to an environment of pure focus and intent (your own website).
            </p>

            <ul className="list-disc pl-6 text-[#8A63D2] font-medium text-[18px] mb-12 space-y-2">
              <li><Link href="#tldr" className="hover:underline text-[#8A63D2]">TL;DR: The Discovery vs Closing dynamic</Link></li>
              <li><Link href="#multipliers" className="hover:underline text-[#8A63D2]">01. 8 ways a website multiplies your Instagram efforts</Link></li>
              <li><Link href="#discovery" className="hover:underline text-[#8A63D2]">02. Why Instagram is the ultimate hook</Link></li>
              <li><Link href="#comparison" className="hover:underline text-[#8A63D2]">03. Metrics that Matter: Analytics vs Vanity</Link></li>
              <li><Link href="#funnel" className="hover:underline text-[#8A63D2]">04. 10 ways to funnel traffic effectively</Link></li>
              <li><Link href="#journey" className="hover:underline text-[#8A63D2]">05. The Ideal Customer Journey</Link></li>
              <li><Link href="#faq" className="hover:underline text-[#8A63D2]">Instagram vs Website FAQ</Link></li>
            </ul>

            <h2 id="tldr" className="text-[28px] md:text-[32px] font-bold font-sans text-[#0f172a] mb-6 leading-tight tracking-tight">
              TL;DR: Discovery vs Closing
            </h2>
            <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">
              A fair and honest comparison shows that Instagram is practically unmatched for getting top-of-funnel eyeballs on your product. It is your billboard, your TV commercial, and your PR engine all rolled into one. However, a professional website is built from the ground up for one specific purpose: closing the sale as smoothly, securely, and rapidly as possible. 
            </p>
            <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">
              Stop trying to force a square peg into a round hole. Use Instagram to generate desire, and use a Bizvistar website to capture that desire and convert it into cold, hard revenue while the customer is still highly motivated to buy.
            </p>

            <h3 id="multipliers" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-12">01. 8 ways a website multiplies your Instagram efforts</h3>
            
            {/* Dark Green Grid Component */}
            <div className="bg-[#0f4a43] rounded-xl p-6 md:p-8 mb-12 relative text-white">
              <h2 className="text-[26px] md:text-[36px] font-normal text-white leading-[1.1] mb-8 mt-2">
                8 ways to leverage<br/>a website for IG
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { title: "Automate checkout", desc: "Customers buy instantly without needing you to reply." },
                  { title: "Capture emails", desc: "Build a newsletter list independent of social algorithms." },
                  { title: "Retarget with Pixels", desc: "Run ads to people who visited your site but didn't buy." },
                  { title: "Showcase variations", desc: "Let customers view colors/sizes in high resolution." },
                  { title: "Build SEO traffic", desc: "Get found on Google, not just in the IG explore page." },
                  { title: "Process global payments", desc: "Accept international credit cards securely." },
                  { title: "Offer discount codes", desc: "Create urgency with flash sales and coupon popups." },
                  { title: "Establish authority", desc: "A custom domain instantly elevates your brand image." }
                ].map((item, i) => (
                  <div key={i} className="bg-[#c2d9cb] p-5 rounded-lg flex flex-col h-full hover:shadow-md transition-shadow">
                    <h4 className="font-normal text-[17px] font-sans mb-3 text-[#0f4a43] leading-[1.2]">{item.title}</h4>
                    <p className="text-[12px] text-[#0f4a43] leading-[1.4] opacity-90">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <h3 id="discovery" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-12">02. Why Instagram is the ultimate hook</h3>
            <div className="relative w-full aspect-square md:aspect-[4/3] mb-8 mt-12 bg-[#F5E6A3] rounded-xl overflow-hidden border border-gray-200 shadow-sm flex items-center justify-center p-8">
               <img src="/blogs/blog_mid_instagram_vs_website.png" alt="Instagram DM vs Website Comparison" className="w-full h-full object-contain" />
            </div>

            <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">
              You should absolutely be heavily invested in Instagram marketing. The platform's algorithm is a masterpiece of machine learning, designed to put your highly engaging visual content in front of thousands of highly targeted potential customers who have never heard of you—completely for free. The organic reach of a well-crafted Reel is something that would have cost thousands of dollars in traditional advertising a decade ago.
            </p>
            <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">
              But you must understand Instagram's core business model. Instagram's singular goal is to keep users on Instagram for as long as humanly possible so they can serve them more ads. It wants them scrolling to the next Reel, endlessly consuming content. It does *not* necessarily want them leaving the app to finish a complex purchase with you. When you try to sell in DMs, you are fighting against the app's core design, competing for attention with funny cat videos and messages from their friends.
            </p>

            <h3 id="comparison" className="text-[22px] font-bold font-sans text-gray-900 mb-4 mt-12">Metrics that Matter: Analytics vs Vanity</h3>
            <div className="overflow-x-auto mb-16 border border-gray-200 rounded-lg shadow-sm">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-gray-100 text-gray-900">
                    <th className="p-3 font-bold font-sans text-[14px] border-r border-gray-200 w-[33%]">Metric Type</th>
                    <th className="p-3 font-bold font-sans text-[14px] border-r border-gray-200 w-[33%]">Instagram Focus (Vanity)</th>
                    <th className="p-3 font-bold font-sans text-[14px] w-[33%]">Website Focus (Revenue)</th>
                  </tr>
                </thead>
                <tbody className="text-[14px] text-gray-900">
                  <tr className="bg-white border-b border-gray-200">
                    <td className="p-3 font-semibold border-r border-gray-200 text-gray-700">Engagement</td>
                    <td className="p-3 border-r border-gray-200 text-gray-700">Likes, Comments, Shares</td>
                    <td className="p-3 text-emerald-600 font-bold">Add to Carts, Checkout Initiated</td>
                  </tr>
                  <tr className="bg-[#f9f9f9] border-b border-gray-200">
                    <td className="p-3 font-semibold border-r border-gray-200 text-gray-700">Audience Value</td>
                    <td className="p-3 border-r border-gray-200 text-gray-700">Follower Count</td>
                    <td className="p-3 text-emerald-600 font-bold">Customer Lifetime Value (LTV)</td>
                  </tr>
                  <tr className="bg-white border-b border-gray-200">
                    <td className="p-3 font-semibold border-r border-gray-200 text-gray-700">Content Success</td>
                    <td className="p-3 border-r border-gray-200 text-gray-700">Reel Views (Millions)</td>
                    <td className="p-3 text-emerald-600 font-bold">Conversion Rate (%)</td>
                  </tr>
                  <tr className="bg-[#f9f9f9] border-b border-gray-200">
                    <td className="p-3 font-semibold border-r border-gray-200 text-gray-700">Retention</td>
                    <td className="p-3 border-r border-gray-200 text-gray-700">Story Views</td>
                    <td className="p-3 text-emerald-600 font-bold">Email List Subscribers</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 id="funnel" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-12">04. 10 ways to funnel traffic effectively</h3>
            
            {/* Mint Green List Component */}
            <div className="bg-[#dcfce7] rounded-xl p-6 md:p-8 mb-12 relative border border-[#bbf7d0]">
               <h2 className="text-[26px] md:text-[32px] font-normal text-gray-900 leading-[1.1] mb-8 mt-2">
                Drive clicks to your site
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                 {[
                   "01 Link in bio via linktree alternative", "02 Instagram Shopping tags", "03 Story 'Link' stickers daily", 
                   "04 Pinned comments on viral reels", "05 'Comment LINK' auto-DM tools", "06 Exclusive website-only discounts",
                   "07 Highlight dedicated to 'How to buy'", "08 Lead magnets (Free PDF guides)", "09 Affiliate links for influencers",
                   "10 Retargeting ads to engaged users"
                 ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 border-b border-[#bbf7d0] pb-2">
                       <span className="text-gray-900 font-bold opacity-70">→</span>
                       <span className="text-gray-800 font-normal text-[15px]">{item}</span>
                    </div>
                 ))}
              </div>
            </div>

            <h3 id="journey" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-12">05. The Ideal Customer Journey</h3>
            <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">
              So, what does the perfect modern e-commerce funnel actually look like? It combines the viral, highly engaging nature of Instagram with the secure, conversion-optimized architecture of a dedicated website. You play to the strengths of both platforms rather than treating them as mutually exclusive.
            </p>
            <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">
              The goal is to move the user seamlessly from a passive state of entertainment (scrolling Reels) into an active state of intent (clicking your link), and finally into a state of commitment (entering their payment details on your site). Here is the four-stage framework you should be aiming to build for every single product launch.
            </p>
            
            {/* Yellow Grid Component */}
            <div className="bg-[#fffbeb] rounded-xl p-6 md:p-8 mb-12 relative border border-[#fef08a] mt-8">
              <h2 className="text-[26px] md:text-[32px] font-normal text-gray-900 leading-[1.1] mb-8 mt-2">
                Instagram to Checkout
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { title: "Stage 1: Hook", desc: "A customer sees an engaging Reel or post showcasing your product in action." },
                  { title: "Stage 2: Interest", desc: "They click the link in your bio or swipe up directly on a targeted story." },
                  { title: "Stage 3: Browsing", desc: "They land on your beautifully designed website, viewing rich details and variants." },
                  { title: "Stage 4: Closing", desc: "They add to cart and checkout instantly with saved payment info." }
                ].map((item, i) => (
                  <div key={i} className="bg-white p-5 rounded-lg flex flex-col h-full shadow-sm">
                    <h4 className="font-bold text-[15px] font-sans mb-3 text-gray-900">{item.title}</h4>
                    <p className="text-[13px] text-gray-600 leading-[1.4]">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-12 mt-12">
              <p className="text-[16px] font-bold text-gray-900 mb-4 tracking-tight">
                Advanced Strategy: Retargeting
              </p>
              <div className="border-l-[4px] border-[#8A63D2] pl-6 py-2">
                <p className="text-[20px] md:text-[22px] text-[#334155] leading-relaxed font-medium">
                  "When users visit your Bizvistar site from Instagram, your Facebook Pixel captures their data. If they abandon their cart, you can now run highly targeted ads specifically to them, offering a 10% discount to finish their purchase. You cannot do this with DMs!"
                </p>
              </div>
            </div>

            <h3 id="faq" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-16 pt-16">Instagram vs Website FAQ</h3>
            
            <div className="mt-8 mb-4 lg:mb-16">
              {faqs.map((faq, index) => (
                <div key={index} className="">
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

          </div>

          <div className="lg:col-span-4 relative hidden lg:block">
            <div className="sticky top-[120px] pt-4 flex flex-col gap-6 pb-10 max-h-[calc(100vh-120px)] overflow-y-auto no-scrollbar">
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
                    <button className="bg-black mb-6 text-white text-[14px] font-bold py-2.5 px-6 rounded-[30px] hover:bg-gray-800 transition-colors w-[100%] shadow-md border border-gray-800">Explore all templates</button>
                  </Link>
                </div>
              </div>

              <div className="pl-2">
                <h4 className="text-[16px] font-bold font-sans text-gray-900 mb-4">In this article</h4>
                <ul className="space-y-3 text-[13px] text-gray-600">
                  <li><Link href="#tldr" className="hover:text-[#8A63D2] transition-colors underline decoration-gray-300">TL;DR</Link></li>
                  <li><Link href="#multipliers" className="hover:text-[#8A63D2] transition-colors underline decoration-gray-300">01. 8 website multipliers</Link></li>
                  <li><Link href="#discovery" className="hover:text-[#8A63D2] transition-colors underline decoration-gray-300">02. Instagram as a hook</Link></li>
                  <li><Link href="#comparison" className="hover:text-[#8A63D2] transition-colors underline decoration-gray-300">03. Metrics that Matter</Link></li>
                  <li><Link href="#funnel" className="hover:text-[#8A63D2] transition-colors underline decoration-gray-300">04. 10 ways to funnel traffic</Link></li>
                  <li><Link href="#journey" className="hover:text-[#8A63D2] transition-colors">05. The Customer Journey</Link></li>
                  <li><Link href="#faq" className="hover:text-[#8A63D2] transition-colors">FAQ</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Related Blogs using Bento Grid */}
      <div className="w-full bg-gray-50 py-12 md:py-24 border-t border-gray-200 mt-12">
        <div className="max-w-[1440px] mx-auto px-4 md:px-6 mb-8">
           <h2 className="text-[32px] md:text-[40px] font-black font-sans text-gray-900 tracking-tight">
             Explore more articles
           </h2>
        </div>
        <BlogBentoGrid posts={ALL_BLOG_POSTS.slice(0, 6)} />
      </div>

      <Footer />
    </div>
  );
}
