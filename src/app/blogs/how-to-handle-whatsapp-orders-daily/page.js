'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import NewHeader from '@/components/landing/NewHeader';
import Footer from '@/components/Footer';
import { Marquee } from "@/components/marquee";

export default function BlogPost() {
  const [openFaq, setOpenFaq] = useState(0);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    { question: "Can I still use WhatsApp for customer support?", answer: "Absolutely. A website handles the transactions and catalog browsing, freeing you up to use WhatsApp strictly for high-value customer support, building relationships, and answering complex product questions." },
    { question: "How do I move existing WhatsApp customers to my site?", answer: "Send a broadcast message with a special discount code that only works on your new website. Explain that the new system is to serve them faster. They will appreciate the seamless checkout experience." },
    { question: "Will I lose the personal touch of chatting?", answer: "No, you actually improve the experience. Customers who know exactly what they want can buy instantly without waiting for your reply, while customers who genuinely need help will still message you. It filters out the noise." },
    { question: "What if my products require customization?", answer: "You can add custom text fields and file upload options directly on your website's product pages. The customer provides all the necessary details at checkout, completely eliminating back-and-forth messaging." },
    { question: "Is managing a dashboard harder than checking WhatsApp?", answer: "It is exponentially easier. Instead of scrolling through hundreds of chats to find an address, your dashboard presents all orders in a clean, filterable list. You can print 50 shipping labels with one click." },
    { question: "How much time does automation actually save?", answer: "On average, a manual WhatsApp order takes 5-10 minutes of active chatting, payment verification, and data entry. For 50 orders, that is over 6 hours of manual work saved every single day." }
  ];

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
            OPERATIONS & SCALING
          </span>
          
          <h1 className="text-[36px] md:text-[44px] lg:text-[48px] leading-[1.15] font-bold font-sans text-[#0f172a] tracking-tight mb-5">
            How to Handle 50+ WhatsApp Orders Daily Without Going Crazy
          </h1>
          
          <div className="text-gray-600 mb-6 text-[14px] flex items-center gap-3">
            <span className="font-normal text-gray-800">Swarup</span>
            <span className="text-gray-400 text-[10px]">•</span>
            <span className="font-normal text-gray-800">May 22</span>
          </div>

          <div className="font-bold text-[#8A63D2] text-[15px] flex items-center gap-2 mb-8 hover:text-[#6e4ea8] transition-colors">
            <Link href="/auth">Automate your orders with Bizvistar →</Link>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative w-full aspect-[16/9] md:aspect-[2.2/1] mb-16 bg-[#F3F4F6] rounded-2xl overflow-hidden flex items-center justify-center border border-gray-200">
           <img 
             src="/editorssmock.png" 
             alt="WhatsApp Order Management Dashboard" 
             className="w-full h-full object-cover object-center filter grayscale-[20%]"
           />
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-[80px] relative">
          
          {/* Left Column: Main Article Content */}
          <div className="lg:col-span-8 pb-4 lg:pb-10">
            
            <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">
              Getting your first few sales on WhatsApp feels incredible. The notification pings, you chat with the customer, answer their questions, share your catalog PDF, and manually note down their shipping address. It feels like a real, intimate business connection. You are building relationships one message at a time. But what happens when 5 orders a day turns into 50? What happens during a holiday rush or a viral Instagram Reel? What was once exciting quickly becomes a logistical nightmare of copy-pasting addresses, losing track of payments, and accidentally missing orders. The very tool that helped you start your business is now actively preventing it from growing.
            </p>
            <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">
              Managing orders through a chat interface is fundamentally broken. WhatsApp was built for conversational messaging, not inventory management or logistics tracking. As you scale, relying on chat for transactions will inevitably lead to burnout, unhappy customers, and stalled growth. You simply cannot type fast enough to compete with an automated website. When a customer messages you at 2:00 AM asking for a price, they don't want to wait until 9:00 AM for a reply—they want to buy immediately. 
            </p>
            <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">
              The transition from manual selling to automated systems is the single most important hurdle a small business owner faces. It requires stepping back from the day-to-day grind of answering basic questions and trusting software to handle the heavy lifting. In this guide, we will break down exactly why manual WhatsApp ordering caps your revenue, the hidden costs of human error, and how you can seamlessly transition your buyers to a centralized dashboard without losing the personal touch that made your brand special in the first place.
            </p>

            <ul className="list-disc pl-6 text-[#8A63D2] font-medium text-[18px] mb-12 space-y-2">
              <li><Link href="#tldr" className="hover:underline text-[#8A63D2]">TL;DR: The scaling bottleneck</Link></li>
              <li><Link href="#anatomy" className="hover:underline text-[#8A63D2]">01. The exhausting anatomy of a chat order</Link></li>
              <li><Link href="#signs" className="hover:underline text-[#8A63D2]">02. 10 signs you need to automate</Link></li>
              <li><Link href="#problem" className="hover:underline text-[#8A63D2]">03. The hidden costs of human error</Link></li>
              <li><Link href="#mindset" className="hover:underline text-[#8A63D2]">04. The Solopreneur vs The CEO</Link></li>
              <li><Link href="#solution" className="hover:underline text-[#8A63D2]">05. Moving to a centralized dashboard</Link></li>
              <li><Link href="#faq" className="hover:underline text-[#8A63D2]">Order Management FAQ</Link></li>
            </ul>

            <h2 id="tldr" className="text-[28px] md:text-[32px] font-bold font-sans text-[#0f172a] mb-6 leading-tight tracking-tight">
              TL;DR: The scaling bottleneck
            </h2>
            <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">
              You cannot scale a business using a chat app built for personal messaging. Manual data entry is slow, error-prone, and visually exhausting for the buyer. By moving your catalog to a dedicated website, you completely eliminate manual order entry, automate payment tracking with integrated gateways, and reclaim hours of your day. 
            </p>
            <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">
              More importantly, you train your customers to self-serve. WhatsApp then evolves from a bottleneck into a powerful tool for high-ticket marketing, personalized VIP support, and post-purchase relationship building, rather than a frustrating barrier to entry for basic sales.
            </p>
            
            <div className="mb-12 mt-12">
              <p className="text-[16px] font-bold text-gray-900 mb-4 tracking-tight">
                Pro Tip: Reclaim Your Time
              </p>
              <div className="border-l-[4px] border-[#8A63D2] pl-6 py-2">
                <p className="text-[20px] md:text-[22px] text-[#334155] leading-relaxed font-medium">
                  "Stop copying and pasting addresses. With Bizvistar, orders flow directly into a clean dashboard, ready for fulfillment, letting you focus on scaling rather than typing."
                </p>
              </div>
            </div>

            <h3 id="anatomy" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-12">01. The exhausting anatomy of a chat order</h3>
            <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">
              To understand why manual selling breaks, we must dissect the process. Every single transaction through WhatsApp requires a minimum of five distinct touchpoints. You have the initial query, the catalog exchange, the negotiation or price confirmation, the payment verification, and finally, the address collection. 
            </p>
            <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">
              When multiplied by 50 customers, you are sending over 250 manual messages a day just to process basic transactions. This doesn't even account for customers who ask questions but don't buy, or customers who take three days to reply with a pincode. It is a fragmented, asynchronous nightmare that leaves you constantly checking your phone, terrified of missing a message.
            </p>

            {/* Pink Grid Component for The Process */}
            <div className="bg-[#fce7f3] rounded-xl p-6 md:p-8 mb-12 relative">
              <div className="absolute top-6 left-6 text-[10px] font-bold tracking-widest text-pink-800 uppercase">The Manual Grind</div>
              <h2 className="text-[26px] md:text-[32px] font-normal text-gray-900 leading-[1.1] mb-8 mt-6">
                The 5 stages of WhatsApp chaos
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { step: "01", title: "The Query", desc: "Customer asks 'Is this available?' or 'Price?'. You manually check stock and reply." },
                  { step: "02", title: "The Catalog", desc: "You send a heavy PDF or dozens of photos. They take hours to reply." },
                  { step: "03", title: "The Payment", desc: "You send your UPI ID. They send a screenshot. You check your bank app to verify." },
                  { step: "04", title: "The Details", desc: "You ask for their address. They send it in 4 separate, fragmented messages." },
                  { step: "05", title: "The Entry", desc: "You copy their messy address into your shipping software or Excel sheet." }
                ].map((item, i) => (
                  <div key={i} className="bg-white p-5 rounded-lg flex flex-col h-full shadow-sm">
                    <span className="text-pink-500 font-bold text-[14px] mb-1">Step {item.step}</span>
                    <h4 className="font-bold text-[15px] font-sans mb-2 text-gray-900">{item.title}</h4>
                    <p className="text-[13px] text-gray-600 leading-[1.5]">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <h3 id="signs" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-12">02. 10 signs you need to automate your orders immediately</h3>
            
            {/* Mint Green List Component */}
            <div className="bg-[#dcfce7] rounded-xl p-6 md:p-8 mb-12 relative border border-[#bbf7d0]">
               <h2 className="text-[26px] md:text-[32px] font-normal text-gray-900 leading-[1.1] mb-8 mt-2">
                Red flags of manual scaling
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                 {[
                   "01 You lose sleep answering DMs", "02 You mix up customer addresses", "03 You oversell out-of-stock items", 
                   "04 You dread checking your phone", "05 Customers complain about slow replies", "06 You hire someone just to reply to texts",
                   "07 You lose track of who paid via UPI", "08 You send the wrong product to a buyer", "09 You hate manually typing shipping labels",
                   "10 Your growth is capped by your typing speed"
                 ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 border-b border-[#bbf7d0] pb-2">
                       <span className="text-gray-900 font-bold opacity-70">→</span>
                       <span className="text-gray-800 font-normal text-[15px]">{item}</span>
                    </div>
                 ))}
              </div>
            </div>

            <h3 id="problem" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-12">03. The hidden costs of human error</h3>
            <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">
              Beyond just wasting time, manual entry introduces critical points of failure. When you are rushing to reply to 20 people at once, you will inevitably make mistakes. You might misread a blurry UPI payment screenshot, forget to deduct an item from your mental inventory (leading to a dreaded oversell), or copy a pincode incorrectly.
            </p>
            <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">
              These are not just minor inconveniences; they are brand-damaging events. Sending a package to the wrong address because of a copy-paste error means you lose the cost of the product, the cost of shipping, and the trust of that customer forever. Managing a live inventory across multiple chat windows is mathematically impossible for a single human being to do accurately at scale. You need software to act as the single source of truth.
            </p>

            <div className="overflow-x-auto mb-16 border border-gray-200 rounded-lg shadow-sm">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-gray-100 text-gray-900">
                    <th className="p-3 font-bold font-sans text-[14px] border-r border-gray-200 w-[25%]">Task</th>
                    <th className="p-3 font-bold font-sans text-[14px] border-r border-gray-200 w-[25%]">WhatsApp Flow</th>
                    <th className="p-3 font-bold font-sans text-[14px] w-[50%]">Website Dashboard Flow</th>
                  </tr>
                </thead>
                <tbody className="text-[14px] text-gray-900">
                  <tr className="bg-white border-b border-gray-200">
                    <td className="p-3 font-semibold border-r border-gray-200 text-[#8A63D2]">Order Entry</td>
                    <td className="p-3 border-r border-gray-200 text-gray-700">Manually typing out customer details into a spreadsheet.</td>
                    <td className="p-3 text-gray-700 font-bold">Customers input their own data securely at checkout.</td>
                  </tr>
                  <tr className="bg-[#f9f9f9] border-b border-gray-200">
                    <td className="p-3 font-semibold border-r border-gray-200">Inventory</td>
                    <td className="p-3 border-r border-gray-200 text-gray-700">Constantly checking the shelf before confirming an order.</td>
                    <td className="p-3 text-gray-700">Auto-syncs. Items show as 'Sold Out' instantly.</td>
                  </tr>
                  <tr className="bg-white border-b border-gray-200">
                    <td className="p-3 font-semibold border-r border-gray-200">Tracking</td>
                    <td className="p-3 border-r border-gray-200 text-gray-700">Copying tracking IDs and messaging customers individually.</td>
                    <td className="p-3 text-gray-700">Automated dispatch emails sent with one click.</td>
                  </tr>
                  <tr className="bg-[#f9f9f9] border-b border-gray-200">
                    <td className="p-3 font-semibold border-r border-gray-200">Receipts</td>
                    <td className="p-3 border-r border-gray-200 text-gray-700">Writing manual invoices on paper or Word docs.</td>
                    <td className="p-3 text-gray-700">Professional PDF receipts emailed instantly upon payment.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 id="mindset" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-12">04. The Solopreneur vs The CEO</h3>
            <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">
              Scaling requires a fundamental shift in how you view your time. Many business owners trap themselves in the "Solopreneur" mindset, believing that nobody else can handle customer interactions as well as they can. They equate manual labor with "hustle," wearing their exhaustion as a badge of honor. But typing addresses is not high-value work.
            </p>
            <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-8 font-normal">
              A CEO, on the other hand, works ON the business rather than IN it. They understand that every minute spent copying a tracking ID is a minute stolen from sourcing new products, optimizing ad campaigns, or building strategic partnerships. Moving to an automated system forces you to adopt the CEO mindset, prioritizing leverage and scale over manual control.
            </p>

            {/* Split Colored Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="bg-[#fefce8] border border-[#fef08a] rounded-xl p-6 shadow-sm">
                <h3 className="text-[24px] font-normal text-gray-900 mb-4 leading-tight">The Solopreneur Mindset</h3>
                <ul className="space-y-3 text-[14px] text-gray-700">
                  <li className="flex gap-2"><span>•</span> <span>"I need to personally thank every buyer."</span></li>
                  <li className="flex gap-2"><span>•</span> <span>"Automated emails feel robotic."</span></li>
                  <li className="flex gap-2"><span>•</span> <span>"I can just memorize my inventory."</span></li>
                  <li className="flex gap-2"><span>•</span> <span>"I'll just hire someone to reply to my DMs."</span></li>
                </ul>
              </div>
              <div className="bg-[#e0f2fe] border border-[#bae6fd] rounded-xl p-6 shadow-sm">
                <h3 className="text-[24px] font-normal text-gray-900 mb-4 leading-tight">The CEO Mindset</h3>
                <ul className="space-y-3 text-[14px] text-gray-700">
                  <li className="flex gap-2"><span>•</span> <span>"Speed and accuracy are the best 'thank you'."</span></li>
                  <li className="flex gap-2"><span>•</span> <span>"Automation lets me focus on strategy."</span></li>
                  <li className="flex gap-2"><span>•</span> <span>"Software tracks inventory better than humans."</span></li>
                  <li className="flex gap-2"><span>•</span> <span>"Software is cheaper and faster than an assistant."</span></li>
                </ul>
              </div>
            </div>

            <h3 id="solution" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-12">05. Moving to a centralized dashboard</h3>
            <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">
              Transitioning is easier than you think, and your customers will actually thank you for it. Once your Bizvistar store is live, you don't need to completely abandon WhatsApp. Instead, set up a Business Auto-Reply with a friendly message and a link to your new shop.
            </p>
            <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">
              Inform your customers that to provide them with faster service, accurate stock levels, and secure checkout, you have upgraded to a professional website. You will be amazed at how quickly they adapt. For those who still struggle, you can use the website to generate a direct checkout link and paste it back into the chat, slowly training them to use the automated system.
            </p>

            {/* Time Analysis Table */}
            <h3 className="text-[22px] font-bold font-sans text-gray-900 mb-4 mt-12">Time Analysis: Processing 50 Orders Daily</h3>
            <div className="overflow-x-auto mb-16 border border-gray-200 rounded-lg shadow-sm">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-gray-100 text-gray-900">
                    <th className="p-3 font-bold font-sans text-[14px] border-r border-gray-200 w-[33%]">Activity</th>
                    <th className="p-3 font-bold font-sans text-[14px] border-r border-gray-200 w-[33%]">Manual (WhatsApp)</th>
                    <th className="p-3 font-bold font-sans text-[14px] w-[33%]">Automated (Website)</th>
                  </tr>
                </thead>
                <tbody className="text-[14px] text-gray-900">
                  <tr className="bg-white border-b border-gray-200">
                    <td className="p-3 font-semibold border-r border-gray-200 text-gray-700">Answering "Price?"</td>
                    <td className="p-3 border-r border-gray-200 text-gray-700">60 mins</td>
                    <td className="p-3 text-emerald-600 font-bold">0 mins (Prices are public)</td>
                  </tr>
                  <tr className="bg-[#f9f9f9] border-b border-gray-200">
                    <td className="p-3 font-semibold border-r border-gray-200 text-gray-700">Collecting Addresses</td>
                    <td className="p-3 border-r border-gray-200 text-gray-700">90 mins</td>
                    <td className="p-3 text-emerald-600 font-bold">0 mins (Self-serve)</td>
                  </tr>
                  <tr className="bg-white border-b border-gray-200">
                    <td className="p-3 font-semibold border-r border-gray-200 text-gray-700">Verifying Payments</td>
                    <td className="p-3 border-r border-gray-200 text-gray-700">45 mins</td>
                    <td className="p-3 text-emerald-600 font-bold">0 mins (Auto-verified)</td>
                  </tr>
                  <tr className="bg-[#f9f9f9] border-b border-gray-200">
                    <td className="p-3 font-semibold border-r border-gray-200 text-gray-700">Generating Labels</td>
                    <td className="p-3 border-r border-gray-200 text-gray-700">120 mins</td>
                    <td className="p-3 text-emerald-600 font-bold">5 mins (Bulk export)</td>
                  </tr>
                  <tr className="bg-gray-100 border-b border-gray-200">
                    <td className="p-3 font-bold border-r border-gray-200 text-gray-900">Total Time Spent</td>
                    <td className="p-3 border-r border-gray-200 text-red-600 font-bold">5+ Hours / Day</td>
                    <td className="p-3 text-emerald-600 font-bold">5 Minutes / Day</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Blue Grid Component */}
            <div className="bg-[#e0e7ff] rounded-xl p-6 md:p-8 mb-12 relative mt-8">
              <h2 className="text-[26px] md:text-[32px] font-normal text-gray-900 leading-[1.1] mb-8 mt-2">
                The pillars of order automation
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: "Centralized Dashboard", desc: "View all pending, shipped, and completed orders in one single unified screen. Filter by date or status instantly." },
                  { title: "Inventory Sync", desc: "Never accidentally sell an out-of-stock item again with live quantity tracking that updates the second a purchase is made." },
                  { title: "Automated Receipts", desc: "The system generates a professional invoice and emails the customer their receipt instantly upon successful payment." },
                  { title: "Shipping Integration", desc: "Generate, format, and print standardized shipping labels directly from the order page without re-typing anything." }
                ].map((item, i) => (
                  <div key={i} className="bg-[#c7d2fe] p-5 rounded-lg flex flex-col h-full hover:shadow-md transition-shadow">
                    <h4 className="font-bold text-[16px] font-sans mb-2 text-gray-900">{item.title}</h4>
                    <p className="text-[14px] text-gray-800 leading-[1.5]">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <h3 id="faq" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-16 pt-16">Order Management FAQ</h3>
            
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
                  <li><Link href="#tldr" className="hover:text-[#8A63D2] transition-colors underline decoration-gray-300">TL;DR: The scaling bottleneck</Link></li>
                  <li><Link href="#anatomy" className="hover:text-[#8A63D2] transition-colors underline decoration-gray-300">01. The exhausting anatomy</Link></li>
                  <li><Link href="#signs" className="hover:text-[#8A63D2] transition-colors underline decoration-gray-300">02. 10 signs you need to automate</Link></li>
                  <li><Link href="#problem" className="hover:text-[#8A63D2] transition-colors underline decoration-gray-300">03. Hidden costs of human error</Link></li>
                  <li><Link href="#mindset" className="hover:text-[#8A63D2] transition-colors underline decoration-gray-300">04. The Solopreneur vs The CEO</Link></li>
                  <li><Link href="#solution" className="hover:text-[#8A63D2] transition-colors">05. Moving to a centralized dashboard</Link></li>
                  <li><Link href="#faq" className="hover:text-[#8A63D2] transition-colors">Order Management FAQ</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
