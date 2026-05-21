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
    { question: "Does 'DM for Price' actually increase Instagram algorithm engagement?", answer: "While it may artificially inflate your comment section initially, the Instagram algorithm favors saves, shares, and watch time more than generic 'price?' comments. The loss in actual revenue far outweighs the vanity metrics." },
    { question: "How do I transition my followers to buying from a website?", answer: "Start adding 'Link in Bio' or using Instagram Shopping tags. Offer an exclusive discount code for their first website purchase to incentivize the transition from DMs to your automated store." },
    { question: "Is setting up a website expensive compared to selling on Instagram?", answer: "Not anymore. Platforms like Bizvistar allow you to set up an automated product catalog for a fraction of what you are losing in abandoned DM sales and wasted personal time." },
    { question: "What if I offer custom products that require quotes?", answer: "You can still use a website! Instead of 'DM for price', use a dynamic 'Request a Quote' form on your site. This collects all their requirements instantly without back-and-forth messaging." }
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
            BUSINESS STRATEGY
          </span>
          
          <h1 className="text-[36px] md:text-[44px] lg:text-[48px] leading-[1.15] font-bold font-sans text-[#0f172a] tracking-tight mb-5">
            Why "DM for Price" is Secretly Killing Your Instagram Business
          </h1>
          
          <div className="text-gray-600 mb-6 text-[14px] flex items-center gap-3">
            <span className="font-normal text-gray-800">Swarup</span>
            <span className="text-gray-400 text-[10px]">•</span>
            <span className="font-normal text-gray-800">May 21</span>
          </div>

          <div className="font-bold text-[#8A63D2] text-[15px] flex items-center gap-2 mb-8 hover:text-[#6e4ea8] transition-colors">
            <Link href="/auth">Turn your ideas into a website you love with Bizvistar →</Link>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative w-full aspect-[16/9] md:aspect-[2.2/1] mb-16 bg-[#F3F4F6] rounded-2xl overflow-hidden flex items-center justify-center border border-gray-200">
           <img 
             src="/editorssmock.png" 
             alt="Stop DM for Price" 
             className="w-full h-full object-cover object-center filter hue-rotate-30 saturate-150 brightness-95"
           />
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-[80px] relative">
          
          {/* Left Column: Main Article Content */}
          <div className="lg:col-span-8 pb-4 lg:pb-10">
            
            <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">
              We have all seen it. You scroll through Instagram, spot a beautiful product you want to buy instantly, only to read the dreaded caption: <strong>"DM for Price."</strong> While it might seem like a clever hack to force engagement and start conversations, it is actually destroying your sales funnel.
            </p>
            <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">
              In the age of Amazon Prime and instant checkouts, consumers expect absolute friction-free shopping. When you force a potential buyer to send a message, wait hours for a reply, and then negotiate payment methods, you are actively giving them time to reconsider their impulse purchase. The vast majority simply keep scrolling.
            </p>
            <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-12 font-normal">
              It is time to elevate your brand from a manual messaging hustle to a truly scalable online business. By introducing automated catalogs and passive income streams, you can sell while you sleep instead of acting as a 24/7 customer service representative.
            </p>

            <ul className="list-disc pl-6 text-[#8A63D2] font-medium text-[18px] mb-12 space-y-2">
              <li><Link href="#tldr" className="hover:underline text-[#8A63D2]">TL;DR: The manual selling trap</Link></li>
              <li><Link href="#scalable" className="hover:underline text-[#8A63D2]">01. Types of scalable online businesses</Link></li>
              <li><Link href="#passive" className="hover:underline text-[#8A63D2]">02. How to make passive income online</Link></li>
              <li><Link href="#ai-bots" className="hover:underline text-[#8A63D2]">03. 8 ways to make money with AI bots</Link></li>
              <li><Link href="#hobby" className="hover:underline text-[#8A63D2]">04. Turn your hobby into an automated income</Link></li>
              <li><Link href="#faq" className="hover:underline text-[#8A63D2]">Instagram Selling FAQ</Link></li>
            </ul>

            <h2 id="tldr" className="text-[28px] md:text-[32px] font-bold font-sans text-[#0f172a] mb-6 leading-tight tracking-tight">
              TL;DR: The manual selling trap
            </h2>
            <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">
              Every step between a customer seeing a product and paying for it is a hurdle. "DM for Price" introduces massive friction. By launching a dedicated website or automated catalog, you capture impulse buys instantly. Your business stops relying on your personal availability to answer messages and starts operating like a real, scalable enterprise.
            </p>
            
            <div className="mb-12 mt-12">
              <p className="text-[16px] font-bold text-gray-900 mb-4 tracking-tight">
                Launch Faster, Stress Free:
              </p>
              <div className="border-l-[4px] border-[#8A63D2] pl-6 py-2">
                <p className="text-[20px] md:text-[22px] text-[#334155] leading-relaxed font-medium">
                  "Skip the coding headaches and endless DMs. With Bizvistar, you can go from an idea to a fully automated storefront in less than a day."
                </p>
                <Link href="/auth" className="text-[#8A63D2] font-bold hover:underline flex items-center gap-1 text-[16px] mt-4">
                  Start Building Now <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>

            {/* Exact Table Replication */}
            <h3 className="text-[22px] font-bold font-sans text-gray-900 mb-4">Manual Selling vs Automated E-Commerce</h3>
            <div className="overflow-x-auto mb-16 border border-gray-200 rounded-lg shadow-sm">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-gray-100 text-gray-900">
                    <th className="p-3 font-bold font-sans text-[14px] border-r border-gray-200 w-[25%]">Feature</th>
                    <th className="p-3 font-bold font-sans text-[14px] border-r border-gray-200 w-[25%]">"DM for Price" Model</th>
                    <th className="p-3 font-bold font-sans text-[14px] w-[50%]">Automated Website Model</th>
                  </tr>
                </thead>
                <tbody className="text-[14px] text-gray-900">
                  <tr className="bg-white border-b border-gray-200">
                    <td className="p-3 font-semibold border-r border-gray-200 text-[#8A63D2]">Purchase Speed</td>
                    <td className="p-3 border-r border-gray-200 text-gray-700">Minutes to hours (depends on your reply).</td>
                    <td className="p-3 text-gray-700 font-bold">Instant checkout in seconds.</td>
                  </tr>
                  <tr className="bg-[#f9f9f9] border-b border-gray-200">
                    <td className="p-3 font-semibold border-r border-gray-200">Scalability</td>
                    <td className="p-3 border-r border-gray-200 text-gray-700">Capped by how many messages you can type.</td>
                    <td className="p-3 text-gray-700">Infinite. Handle 10 or 10,000 orders simultaneously.</td>
                  </tr>
                  <tr className="bg-white border-b border-gray-200">
                    <td className="p-3 font-semibold border-r border-gray-200">Trust Factor</td>
                    <td className="p-3 border-r border-gray-200 text-gray-700">Low. Seems shady and unverified.</td>
                    <td className="p-3 text-gray-700">High. Professional checkout builds immense brand trust.</td>
                  </tr>
                  <tr className="bg-[#f9f9f9] border-b border-gray-200">
                    <td className="p-3 font-semibold border-r border-gray-200">Payment Collection</td>
                    <td className="p-3 border-r border-gray-200 text-gray-700">Manual UPI requests or bank transfers.</td>
                    <td className="p-3 text-gray-700">Automated processing via secure gateways (Stripe/Razorpay).</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 id="scalable" className="text-[28px] md:text-[32px] font-bold font-sans text-gray-900 mb-6">01. Types of scalable online businesses</h2>
            <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-8 font-normal">
              To move away from manual DMs, you need to structure your business in a way that scales without your direct involvement. Here are the core models you can transition to using a modern platform.
            </p>

            {/* Yellow Grid Component for Types of Online Businesses */}
            <div className="bg-[#fffbeb] rounded-xl p-6 md:p-8 mb-12 relative border border-[#fef08a]">
              <h2 className="text-[26px] md:text-[32px] font-normal text-gray-900 leading-[1.1] mb-8 mt-2">
                Types of online businesses
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { title: "Ecommerce", desc: "Sell physical products • Stock & ship • Popular with niches" },
                  { title: "Digital products", desc: "Courses, ebooks, apps • No inventory • Scalable & automated" },
                  { title: "Affiliate marketing", desc: "Third-party products • Commission-based • Done via blogs, social" },
                  { title: "Dropshipping", desc: "No stock required • Low startup costs • Supplier ships directly" },
                  { title: "Subscription services", desc: "Recurring products • Build loyalty • Predictable income" },
                  { title: "Freelancing", desc: "Offer your skills • Project-based work • Work remotely" },
                  { title: "Content creation", desc: "Monetize content • Earn through ads • Consistent posting" },
                  { title: "Online marketplaces", desc: "Sell via platform • Link buyers & sellers • Charge for listings" }
                ].map((item, i) => (
                  <div key={i} className="bg-white p-5 rounded-lg flex flex-col h-full hover:shadow-md transition-shadow shadow-sm">
                    <h4 className="font-normal text-[18px] font-sans mb-3 text-gray-900">{item.title}</h4>
                    <ul className="text-[13px] text-gray-600 space-y-1">
                      {item.desc.split('•').map((point, idx) => (
                        <li key={idx} className="flex gap-1.5"><span className="opacity-60">→</span> <span>{point.trim()}</span></li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <h3 id="passive" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-12">02. How to make passive income online</h3>
            <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">
              Once your storefront is automated, you unlock the ability to generate passive income. This is the holy grail of digital business: doing the heavy lifting once to set up the system, and reaping the rewards continuously.
            </p>
            
            {/* Light Green List Component for Passive Income */}
            <div className="bg-[#dcfce7] rounded-xl p-6 md:p-8 mb-12 relative border border-[#bbf7d0]">
               <h2 className="text-[26px] md:text-[32px] font-normal text-gray-900 leading-[1.1] mb-8 mt-2">
                How to make passive income online
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                 {[
                   "01 Sell digital products", "02 Affiliate marketing", "03 Online courses", 
                   "04 YouTube channel", "05 Print on demand", "06 Stock photography & video",
                   "07 Dropshipping store", "08 Ad revenue from blogs", "09 License music or sounds",
                   "10 Sell AI-generated content", "11 Membership communities", "12 Invest in REITs & dividend stocks"
                 ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 border-b border-[#bbf7d0] pb-2">
                       <span className="text-gray-900 font-bold opacity-70">→</span>
                       <span className="text-gray-800 font-normal text-[16px]">{item}</span>
                    </div>
                 ))}
              </div>
            </div>

            <h3 id="ai-bots" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-12">03. 8 ways to make money with AI bots</h3>
            <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">
              If you still find yourself bogged down by customer queries—the "Does this come in blue?" questions—it's time to leverage Artificial Intelligence. AI bots can completely replace manual DM support while also opening up entirely new revenue streams for your brand.
            </p>

            {/* Dark Green Grid Component for AI Bots */}
            <div className="bg-[#0f4a43] rounded-xl p-6 md:p-8 mb-12 relative text-white">
              <h2 className="text-[26px] md:text-[36px] font-normal text-white leading-[1.1] mb-8 mt-2">
                8 ways to make money<br/>with AI bots
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { title: "Automate customer support", desc: "Sell AI chatbots to handle customer inquiries and support" },
                  { title: "Generate content with AI", desc: "Offer AI bots to create blog posts, social media and marketing materials" },
                  { title: "Personalize marketing with AI", desc: "Use AI to build custom marketing campaigns for businesses" },
                  { title: "Boost eCommerce with bots", desc: "Recommend products and handle transactions for online stores" },
                  { title: "Unlock insights with AI analysis", desc: "Sell AI bots that analyze business data and provide reports" },
                  { title: "Automate lead generation", desc: "Create bots to qualify leads and schedule appointments" },
                  { title: "Develop virtual assistants", desc: "Offer AI-driven assistants for tasks like scheduling and email management" },
                  { title: "Maximize profits with trading bots", desc: "Create AI trading bots to help clients trade stocks or cryptocurrencies" }
                ].map((item, i) => (
                  <div key={i} className="bg-[#c2d9cb] p-5 rounded-lg flex flex-col h-full hover:shadow-md transition-shadow">
                    <h4 className="font-normal text-[17px] font-sans mb-3 text-[#0f4a43] leading-[1.2]">{item.title}</h4>
                    <p className="text-[12px] text-[#0f4a43] leading-[1.4] opacity-90">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <h3 id="hobby" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-12">04. Turn your hobby into an automated income</h3>
            <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">
              Whether you are a stay at home parent, a student, or a teenager, the internet has democratized earning potential. Stop trading time for money in DMs. Instead, package your knowledge into digital products or freelance services and sell them through a centralized, automated hub.
            </p>

            <ul className="list-none space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <span className="text-[#8A63D2] font-bold mt-1">✓</span>
                <p className="text-[16px] text-gray-700 leading-relaxed m-0"><strong className="text-gray-900">Teach what you love:</strong> Package your hobbies into online courses or ebooks.</p>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#8A63D2] font-bold mt-1">✓</span>
                <p className="text-[16px] text-gray-700 leading-relaxed m-0"><strong className="text-gray-900">Offer freelance services:</strong> Stop DMing clients. Send them a professional booking link on your Bizvistar site.</p>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#8A63D2] font-bold mt-1">✓</span>
                <p className="text-[16px] text-gray-700 leading-relaxed m-0"><strong className="text-gray-900">Join Affiliate Programs:</strong> Curate your favorite products on a blog page and earn commissions on autopilot.</p>
              </li>
            </ul>

            <div className="mb-12 mt-12">
              <p className="text-[16px] font-bold text-gray-900 mb-4 tracking-tight">
                Pro Tip: Centralize Your Links
              </p>
              <div className="border-l-[4px] border-[#8A63D2] pl-6 py-2">
                <p className="text-[20px] md:text-[22px] text-[#334155] leading-relaxed font-medium">
                  "If you rely heavily on Instagram, replace your messy Linktree with a beautifully designed Bizvistar landing page. This gives you total control over your branding and analytics while seamlessly funneling users to your checkout pages."
                </p>
              </div>
            </div>

            <h3 id="faq" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-16 pt-16">Instagram Selling FAQ</h3>
            
            {/* FAQ Accordion */}
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
                  <div 
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaq === index ? 'max-h-[500px] pb-6 opacity-100' : 'max-h-0 opacity-0'}`}
                  >
                    <p className="text-[16px] text-gray-700 leading-relaxed pl-[44px] pr-4">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Right Column: Sticky Sidebar - Fully Sticky and visible */}
          <div className="lg:col-span-4 relative hidden lg:block">
            {/* Fixed Sticky Wrapper - Adjusted top offset and added top padding */}
            <div className="sticky top-[120px] pt-4 flex flex-col gap-6 pb-10 max-h-[calc(100vh-120px)] overflow-y-auto no-scrollbar">
              
              {/* Promo Widget - Reduced text size and padding to fit better */}
              <div className="bg-[#E5E0FA] rounded-xl py-5 text-center shadow-sm border border-[#d6ccf5] overflow-hidden">
                <div className="px-5">
                  <h3 className="text-[18px] font-semibold font-sans text-[#1a1b4b] mb-4 mt-5 leading-[1.3] px-2">
                    Start strong with a free,<br />customizable template
                  </h3>
                </div>
                
                {/* Visual template mockups - landscape crop */}
                <div className="mb-6 relative w-full overflow-hidden">
                   <Marquee className="[--duration:40s]" pauseOnHover>
                     {['aurora', 'blissly', 'flara', 'frostify'].map((slug) => (
                       <img 
                         key={slug}
                         src={`/templatemarquee/${slug}.png`} 
                         alt={slug} 
                         className="h-[100px] w-[150px] max-w-none rounded-md shadow-sm object-cover object-top cursor-pointer hover:scale-105 transition-transform border-2 border-[#d6ccf5] ring-1 ring-white"
                         onClick={() => window.location.href='/templates'}
                       />
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

              {/* Table of Contents List - Reduced text size */}
              <div className="pl-2">
                <h4 className="text-[16px] font-bold font-sans text-gray-900 mb-4">In this article</h4>
                <ul className="space-y-3 text-[13px] text-gray-600">
                  <li><Link href="#tldr" className="hover:text-[#8A63D2] transition-colors underline decoration-gray-300">TL;DR: The manual selling trap</Link></li>
                  <li><Link href="#scalable" className="hover:text-[#8A63D2] transition-colors underline decoration-gray-300">01. Types of scalable online businesses</Link></li>
                  <li><Link href="#passive" className="hover:text-[#8A63D2] transition-colors">02. How to make passive income online</Link></li>
                  <li><Link href="#ai-bots" className="hover:text-[#8A63D2] transition-colors">03. 8 ways to make money with AI bots</Link></li>
                  <li><Link href="#hobby" className="hover:text-[#8A63D2] transition-colors">04. Turn your hobby into an automated income</Link></li>
                  <li><Link href="#faq" className="hover:text-[#8A63D2] transition-colors">Instagram Selling FAQ</Link></li>
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