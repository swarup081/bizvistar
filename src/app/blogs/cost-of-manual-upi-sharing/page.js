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
    { question: "Are payment gateways expensive?", answer: "Payment gateways charge a small percentage fee (usually 2-3%), but the massive increase in conversion rates more than makes up for it. You will sell more when checkout is frictionless." },
    { question: "Can I still accept manual transfers?", answer: "Yes, Bizvistar allows you to configure manual payment methods alongside automated gateways, giving customers the best of both worlds. However, you will likely see 90% prefer the automated route." },
    { question: "How long does it take for money to reach my bank account?", answer: "Most integrated gateways process settlements within 2-3 business days, depositing directly into your registered business bank account automatically." },
    { question: "Is it secure for customers to pay on my website?", answer: "Extremely. Integrated gateways like Stripe and Razorpay handle all PCI compliance and security encryption, meaning you never store sensitive credit card data on your own servers." },
    { question: "What happens if a customer wants a refund?", answer: "With a gateway, you simply click a 'Refund' button in your dashboard. The money goes directly back to their original payment method. With manual UPI, you have to ask for their details and send it manually." },
    { question: "Do international customers use UPI?", answer: "No. If you rely on manual UPI, you are completely blocking out international buyers. Gateways allow you to accept global credit cards effortlessly." }
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
            CONVERSION RATE OPTIMIZATION
          </span>
          
          <h1 className="text-[36px] md:text-[44px] lg:text-[48px] leading-[1.15] font-bold font-sans text-[#0f172a] tracking-tight mb-5">
            The Cost of Chasing Payments: How Manual UPI Sharing is Costing You Orders
          </h1>
          
          <div className="text-gray-600 mb-6 text-[14px] flex items-center gap-3">
            <span className="font-normal text-gray-800">Swarup</span>
            <span className="text-gray-400 text-[10px]">•</span>
            <span className="font-normal text-gray-800">May 24</span>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-[80px] relative">
          
          {/* Left Column: Main Article Content */}
          <div className="lg:col-span-8 pb-4 lg:pb-10">
            
            {/* Hero Image */}
            <div className="relative w-full aspect-square mb-12 bg-[#F5D5C8] rounded-2xl overflow-hidden flex items-center justify-center border border-gray-200">
               <img 
                  src="/blogs/blog_hero_manual_upi.png" 
                  alt="The Cost of Manual UPI Sharing - Broken Payment Chain" 
                  className="w-full h-full object-contain"
                />
            </div>
            
            <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">
              You did the hard work. You sourced an amazing product, took beautiful photos, wrote compelling captions, and marketed it perfectly on social media. You finally convinced a customer to message you with intent to buy. They ask for the price, you tell them. They say "Yes, I want this. How do I pay?" You excitedly reply with your UPI ID or a QR code screenshot. You wait for the confirmation message. And then... silence. 
            </p>
            <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">
              Hours go by. You send a follow-up message: "Hi, did you manage to make the payment?" They leave you on read. You just lost a guaranteed sale at the very last possible millimeter of the finish line. 
            </p>
            <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-12 font-normal">
              This phenomenon is incredibly common in manual businesses, and it is entirely avoidable. In e-commerce, friction is the enemy of conversion. Every single second between a customer deciding they want to buy and actually completing the payment is a chance for them to get distracted, reconsider their budget, or simply forget. In this guide, we will break down the true mathematical and psychological cost of relying on manual payment sharing.
            </p>

            <ul className="list-disc pl-6 text-[#8A63D2] font-medium text-[18px] mb-12 space-y-2">
              <li><Link href="#tldr" className="hover:underline text-[#8A63D2]">TL;DR: The drop-off danger</Link></li>
              <li><Link href="#psychology" className="hover:underline text-[#8A63D2]">01. The psychology of the abandoned DM cart</Link></li>
              <li><Link href="#types" className="hover:underline text-[#8A63D2]">02. Understanding Buyer Types</Link></li>
              <li><Link href="#gateways" className="hover:underline text-[#8A63D2]">03. Types of Online Payment Gateways</Link></li>
              <li><Link href="#comparison" className="hover:underline text-[#8A63D2]">04. Financial Impact Analysis</Link></li>
              <li><Link href="#trust" className="hover:underline text-[#8A63D2]">05. Building trust through professional checkout</Link></li>
              <li><Link href="#faq" className="hover:underline text-[#8A63D2]">Payment Gateway FAQ</Link></li>
            </ul>

            <h2 id="tldr" className="text-[28px] md:text-[32px] font-bold font-sans text-[#0f172a] mb-6 leading-tight tracking-tight">
              TL;DR: The drop-off danger
            </h2>
            <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">
              Having a direct "Click to Pay via UPI/Card" button converts significantly better than sending your phone number or UPI ID in a chat. The math is undeniable. Integrated payment gateways capitalize on impulse momentum, locking in the sale instantly before the buyer's rational brain can talk them out of the purchase. 
            </p>
            <div className="relative w-full aspect-square md:aspect-[4/3] mb-8 mt-12 bg-[#F5D5C8] rounded-xl overflow-hidden border border-gray-200 shadow-sm flex items-center justify-center p-8">
               <img src="/blogs/blog_mid_manual_upi.png" alt="Secure Payment Gateway" className="w-full h-full object-contain" />
            </div>

            <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">
              Furthermore, professional checkout flows establish a baseline level of brand credibility and security trust that manual messaging simply cannot match, especially for higher-ticket items. Trying to save 2% on payment gateway fees by using manual UPI actually costs you 30-40% of your total potential revenue in lost sales.
            </p>

            <h3 id="psychology" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-12">01. The psychology of the abandoned DM cart</h3>
            <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">
              When a customer decides they want an item, they are riding a wave of dopamine. They are excited about how the product will make them look or feel. They are operating in a state of high emotional arousal and impulse. 
            </p>
            <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">
              If you hit them with a "Scan this QR code, open your banking app, type in the exact amount, enter your 6-digit pin, take a screenshot, open WhatsApp, and attach the image" process, you abruptly interrupt that dopamine hit. You replace the joy of shopping with the tedious administrative work of banking. You give them too much time to think, "Do I really need another pair of shoes right now?" A 1-click gateway bypasses this hesitation entirely.
            </p>

            <h3 id="types" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-12">02. Understanding Buyer Types</h3>
            
            {/* Split Colored Cards: 3 Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
              <div className="bg-[#fefce8] border border-[#fef08a] rounded-xl p-5 shadow-sm">
                <h3 className="text-[20px] font-normal text-gray-900 mb-3 leading-tight">The Impulse Buyer</h3>
                <p className="text-[14px] text-gray-700 leading-[1.5]">Wants it now. If they can click Apple Pay and be done in 3 seconds, they buy. If they have to copy a UPI ID, they leave.</p>
              </div>
              <div className="bg-[#e0f2fe] border border-[#bae6fd] rounded-xl p-5 shadow-sm">
                <h3 className="text-[20px] font-normal text-gray-900 mb-3 leading-tight">The Skeptic Buyer</h3>
                <p className="text-[14px] text-gray-700 leading-[1.5]">Scared of scams. Seeing a secure checkout page with buyer protection guarantees is the only way they complete the order.</p>
              </div>
              <div className="bg-[#dcfce7] border border-[#bbf7d0] rounded-xl p-5 shadow-sm">
                <h3 className="text-[20px] font-normal text-gray-900 mb-3 leading-tight">The Night Owl</h3>
                <p className="text-[14px] text-gray-700 leading-[1.5]">Shops at 2 AM. If they have to message you and wait until morning for a payment link, the urge to buy will be gone by sunrise.</p>
              </div>
            </div>

            <h3 id="gateways" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-12">03. Types of Online Payment Gateways</h3>
            
            {/* Yellow Grid Component */}
            <div className="bg-[#fffbeb] rounded-xl p-6 md:p-8 mb-12 relative border border-[#fef08a]">
              <h2 className="text-[26px] md:text-[32px] font-normal text-gray-900 leading-[1.1] mb-8 mt-2">
                Automated Payment Methods
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { title: "UPI Integration", desc: "Native Google Pay, PhonePe, and Paytm intent flow via mobile." },
                  { title: "Credit Cards", desc: "Accept Visa, Mastercard, and Amex securely via Stripe." },
                  { title: "Digital Wallets", desc: "1-click checkout with Apple Pay and Amazon Pay." },
                  { title: "Buy Now Pay Later", desc: "Increase AOV by offering EMI options via providers like Klarna." }
                ].map((item, i) => (
                  <div key={i} className="bg-white p-5 rounded-lg flex flex-col h-full hover:shadow-md transition-shadow shadow-sm">
                    <h4 className="font-normal text-[18px] font-sans mb-3 text-gray-900">{item.title}</h4>
                    <p className="text-[13px] text-gray-600 leading-[1.4]">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <h3 id="comparison" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-12">04. Financial Impact Analysis</h3>
            <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">
              The single biggest objection small business owners have to using platforms like Stripe or Razorpay is the standard 2% transaction fee. "Why would I give away 2% of my hard-earned money when I can just take UPI for free?" 
            </p>
            <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">
              This is a textbook example of being penny-wise and pound-foolish. Let's look at the actual mathematical reality of an e-commerce funnel to see why avoiding that 2% fee is a short-sighted mistake that is actively costing you tens of thousands of rupees in lost revenue every single month.
            </p>

            {/* Financial Impact Table */}
            <div className="overflow-x-auto mb-12 border border-gray-200 rounded-lg shadow-sm">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-gray-100 text-gray-900">
                    <th className="p-3 font-bold font-sans text-[14px] border-r border-gray-200 w-[33%]">Scenario (100 Leads @ ₹1000)</th>
                    <th className="p-3 font-bold font-sans text-[14px] border-r border-gray-200 w-[33%]">Manual UPI (0% Fee)</th>
                    <th className="p-3 font-bold font-sans text-[14px] w-[33%]">Gateway (2% Fee)</th>
                  </tr>
                </thead>
                <tbody className="text-[14px] text-gray-900">
                  <tr className="bg-white border-b border-gray-200">
                    <td className="p-3 font-semibold border-r border-gray-200 text-gray-700">Conversion Rate</td>
                    <td className="p-3 border-r border-gray-200 text-red-600 font-bold">50% (High friction drop-off)</td>
                    <td className="p-3 text-emerald-600 font-bold">80% (Frictionless checkout)</td>
                  </tr>
                  <tr className="bg-[#f9f9f9] border-b border-gray-200">
                    <td className="p-3 font-semibold border-r border-gray-200 text-gray-700">Completed Sales</td>
                    <td className="p-3 border-r border-gray-200 text-gray-700">50 Sales</td>
                    <td className="p-3 text-gray-700 font-bold">80 Sales</td>
                  </tr>
                  <tr className="bg-white border-b border-gray-200">
                    <td className="p-3 font-semibold border-r border-gray-200 text-gray-700">Gross Revenue</td>
                    <td className="p-3 border-r border-gray-200 text-gray-700">₹50,000</td>
                    <td className="p-3 text-gray-700 font-bold">₹80,000</td>
                  </tr>
                  <tr className="bg-[#f9f9f9] border-b border-gray-200">
                    <td className="p-3 font-semibold border-r border-gray-200 text-gray-700">Gateway Fees Paid</td>
                    <td className="p-3 border-r border-gray-200 text-gray-700">₹0</td>
                    <td className="p-3 text-red-600 font-bold">₹1,600</td>
                  </tr>
                  <tr className="bg-gray-100 border-b border-gray-200">
                    <td className="p-3 font-bold border-r border-gray-200 text-gray-900">Net Profit</td>
                    <td className="p-3 border-r border-gray-200 text-gray-900 font-bold">₹50,000</td>
                    <td className="p-3 text-emerald-600 font-bold text-[16px]">₹78,400</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mb-12 mt-12">
              <p className="text-[16px] font-bold text-gray-900 mb-4 tracking-tight">
                The Verdict
              </p>
              <div className="border-l-[4px] border-[#8A63D2] pl-6 py-2">
                <p className="text-[20px] md:text-[22px] text-[#334155] leading-relaxed font-medium">
                  "Trying to save 2% on fees by using manual UPI actually costs you nearly ₹30,000 in lost sales due to friction."
                </p>
              </div>
            </div>

            <h3 id="trust" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-12">05. Building trust through professional checkout</h3>
            
            {/* Dark Green Grid Component */}
            <div className="bg-[#0f4a43] rounded-xl p-6 md:p-8 mb-12 relative text-white">
              <h2 className="text-[26px] md:text-[36px] font-normal text-white leading-[1.1] mb-8 mt-2">
                8 features of a<br/>high-converting checkout
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { title: "SSL Encryption", desc: "The padlock icon that proves your site is highly secure." },
                  { title: "Trust Badges", desc: "Visa/Mastercard logos visually assure payment safety." },
                  { title: "Guest Checkout", desc: "Don't force users to make an account just to buy." },
                  { title: "Clear Shipping", desc: "Show delivery estimates before they enter card details." },
                  { title: "Auto-fill forms", desc: "Let Google auto-fill their address to save typing." },
                  { title: "Mobile UI", desc: "Large, thumb-friendly buttons for easy tapping." },
                  { title: "Instant Receipts", desc: "Emailing a branded PDF invoice the moment they pay." },
                  { title: "No hidden fees", desc: "Display total costs transparently to prevent abandonment." }
                ].map((item, i) => (
                  <div key={i} className="bg-[#c2d9cb] p-5 rounded-lg flex flex-col h-full hover:shadow-md transition-shadow">
                    <h4 className="font-normal text-[17px] font-sans mb-3 text-[#0f4a43] leading-[1.2]">{item.title}</h4>
                    <p className="text-[12px] text-[#0f4a43] leading-[1.4] opacity-90">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <h3 id="faq" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-16 pt-16">Payment Gateway FAQ</h3>
            
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
                  <li><Link href="#psychology" className="hover:text-[#8A63D2] transition-colors underline decoration-gray-300">01. Psychology of abandoned carts</Link></li>
                  <li><Link href="#types" className="hover:text-[#8A63D2] transition-colors underline decoration-gray-300">02. Understanding Buyer Types</Link></li>
                  <li><Link href="#gateways" className="hover:text-[#8A63D2] transition-colors underline decoration-gray-300">03. Types of Payment Gateways</Link></li>
                  <li><Link href="#comparison" className="hover:text-[#8A63D2] transition-colors underline decoration-gray-300">04. Financial Impact Analysis</Link></li>
                  <li><Link href="#trust" className="hover:text-[#8A63D2] transition-colors underline decoration-gray-300">05. Building trust</Link></li>
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
