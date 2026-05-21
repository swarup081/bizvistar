'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import NewHeader from '@/components/landing/NewHeader';
import Footer from '@/components/Footer';
import { Marquee } from "@/components/marquee";
import BlogSecondaryNav from '@/components/blogs/BlogSecondaryNav';
import BlogBentoGrid from '@/components/blogs/BlogBentoGrid';

const BLOG_POSTS = [
  {
    title: "How to Handle 50+ WhatsApp Orders Daily Without Going Crazy",
    image: "/blogs/blog_club_1778965424607.png",
    href: "/blogs/how-to-handle-whatsapp-orders-daily",
  },
  {
    title: "Instagram DM vs. A Professional Website: Where Should Your Customers Shop?",
    image: "/blogs/blog_gummy_1778965453467.png",
    href: "/blogs/instagram-dm-vs-website-comparison",
  },
  {
    title: "The Cost of Chasing Payments: How Manual UPI Sharing is Costing You Orders",
    image: "/blogs/blog_sneaker_1778965493480.png",
    href: "/blogs/cost-of-manual-upi-sharing",
  },
  {
    title: "Why \"DM for Price\" is Secretly Killing Your Instagram Business",
    image: "/blogs/blog_ai_1778964944951.png",
    href: "/blogs/why-dm-for-price-is-killing-your-business",
  },
  {
    title: "How to build a website from scratch in 2026: A complete guide",
    image: "/blogs/blog_startup_1778964908511.png",
    href: "/blogs/how-to-build-website-from-scratch-in-bizvistar-guide",
  },
  {
    title: "How much does a website cost in 2026?",
    image: "/editorssmock.png",
    href: "/blogs/website-cost-2026",
  }
];

export default function BlogPost() {
  const [openFaq, setOpenFaq] = useState(0);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    { question: "How much does a website redesign cost?", answer: "The cost of a website redesign in India can vary greatly depending on the scope. A basic redesign by a freelancer might cost ₹10,000, while a professional agency could charge between ₹50,000 to ₹5,00,000+ for a corporate website." },
    { question: "How much does it cost to keep a small website running?", answer: "Traditionally, it costs between ₹1,000 to ₹5,000 per month for basic hosting, security, and domain renewals. With Bizvistar, this is completely included in your affordable monthly subscription." },
    { question: "How much does a website cost per month?", answer: "Depending on the platform, it can range from free to over ₹15,000 per month for advanced enterprise features. Most basic SaaS website builders start around ₹500 to ₹1,500 per month." },
    { question: "Are there hidden fees in website creation?", answer: "Yes, if you use traditional open source platforms, you might face unexpected costs for premium themes, essential plugins, SSL certificates, and developer maintenance fees. Bizvistar eliminates these with an all in one pricing model." },
    { question: "How much does domain registration cost?", answer: "A standard .com or .in domain generally costs between ₹800 and ₹1,500 per year. Premium domains, however, can be significantly more expensive based on market demand." },
    { question: "Is it cheaper to build a website myself or hire a professional?", answer: "Building it yourself using an intuitive platform like Bizvistar is drastically cheaper, often costing just a fraction of a developer fee, while hiring an agency can cost upwards of ₹1,00,000." },
    { question: "Are there additional costs for mobile website optimization?", answer: "Historically, developers charged extra for responsive design. Today, platforms like Bizvistar automatically optimize your site for mobile devices at no extra cost." }
  ];

  return (
    <div className="bg-white text-gray-900 min-h-screen flex flex-col relative overflow-clip antialiased font-sans">
      
      <NewHeader />

      <div className="bg-gray-50/50 pb-8 pt-4 md:pt-12 z-[100] relative">
        <BlogSecondaryNav posts={BLOG_POSTS} />
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
        
        {/* Breadcrumb & Title Section - Made smaller and kept left-aligned */}
        <div className="mb-8 max-w-[850px] text-left">
          <span className="inline-block bg-[#f1f1f4] text-[#3f3f46] text-[11px] font-bold tracking-[0.05em] px-3 py-1 rounded-sm mb-4 uppercase">
            WEBSITE ESSENTIALS
          </span>
          
          <h1 className="text-[36px] md:text-[44px] lg:text-[48px] leading-[1.15] font-bold font-sans text-[#0f172a] tracking-tight mb-5">
            How much does a website cost in 2026?
          </h1>
          
          <div className="text-gray-600 mb-6 text-[14px] flex items-center gap-3">
            <span className="font-normal text-gray-800">Swarup</span>
            <span className="text-gray-400 text-[10px]">•</span>
            <span className="font-normal text-gray-800">May 19</span>
          </div>

          <div className="font-bold text-[#8A63D2] text-[15px] flex items-center gap-2 mb-8 hover:text-[#6e4ea8] transition-colors">
            <Link href="/auth">Turn your ideas into a website you love with Bizvistar →</Link>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative w-full aspect-[16/9] md:aspect-[2.2/1] mb-16 bg-[#F3F4F6] rounded-2xl overflow-hidden flex items-center justify-center border border-gray-200">
           <img 
             src="/editorssmock.png" 
             alt="Bizvistar Website Editor Interface" 
             className="w-full h-full object-cover object-center"
           />
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-[80px] relative">
          
          {/* Left Column: Main Article Content */}
          <div className="lg:col-span-8 pb-4 lg:pb-10">
            
            <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">
              Finding out the real cost of building a website in India can feel confusing with so many hidden fees. While flashy ads promise working sites for very little money, growing a business online is often much different. From necessary tools to important security steps, a cheap project can quickly become very expensive. To protect your business, you need complete honesty about what goes into a modern website and exactly what you should pay for it.
            </p>
            <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">
              The digital world has changed a lot heading into 2026. Top design agencies still charge premium prices, often quoting 100,000 rupees or more just for a basic corporate site. However, the technology available to everyday business owners has made web design open to everyone. Artificial intelligence, simple building blocks, and complete software platforms have completely removed the need for large developer teams.
            </p>
            <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-12 font-normal">
              Figuring out your true online budget means taking a close look at your business goals. A simple portfolio needs very different tools than a busy ecommerce store handling thousands of sales. By looking at the main parts of web building like hosting, design, features, and upkeep, you can plan your money wisely. Let us break down the real numbers behind launching a successful website today.
            </p>

            <ul className="list-disc pl-6 text-[#8A63D2] font-medium text-[18px] mb-12 space-y-2">
              <li><Link href="#tldr" className="hover:underline text-[#8A63D2]">How much does it cost to make a website?</Link></li>
              <li><Link href="#cost-factors" className="hover:underline text-[#8A63D2]">What factors influence the cost to build a website?</Link></li>
              <li><Link href="#website-builder" className="hover:underline text-[#8A63D2]">01. Website builder</Link></li>
              <li><Link href="#design" className="hover:underline text-[#8A63D2]">02. Website design and interface</Link></li>
              <li><Link href="#hosting" className="hover:underline text-[#8A63D2]">03. Hosting, Domains, and Security</Link></li>
              <li><Link href="#ecommerce" className="hover:underline text-[#8A63D2]">04. E-Commerce and Marketing Tools</Link></li>
              <li><Link href="#faq" className="hover:underline text-[#8A63D2]">How much does a website cost FAQ</Link></li>
            </ul>

            <h2 id="tldr" className="text-[28px] md:text-[32px] font-bold font-sans text-[#0f172a] mb-6 leading-tight tracking-tight">
              TL;DR: how much does a website cost?
            </h2>
            <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">
              A simple website can cost as little as ₹499 to ₹1,500 per month if you’re creating it yourself using an all-in-one platform. On the other extreme, hiring a professional agency (involving UI designers, copywriters, and backend developers) can easily cost between ₹50,000 to over ₹5,00,000 in upfront capital. That&apos;s a massive range, so let&apos;s break down the exact factors that dictate these costs.
            </p>
            <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-12 font-normal">
              For most small to medium-sized Indian businesses, the absolute sweet spot lies in utilizing a consolidated platform like Bizvistar. This approach bundles your cloud hosting, SSL security, premium design templates, and e-commerce payment gateways into a single predictable monthly fee. This drastically reduces the Total Cost of Ownership (TCO) compared to patching together different services.
            </p>

            {/* Additional Content Highlight Block */}
           <div className="mb-12 mt-12">
              <p className="text-[16px] font-bold text-gray-900 mb-4 tracking-tight">
                Transparent Pricing, No Surprises:
              </p>
              <div className="border-l-[4px] border-[#8A63D2] pl-6 py-2">
                <p className="text-[20px] md:text-[22px] text-[#334155] leading-relaxed font-medium">
                  "Stop paying unpredictable agency retainers. With an all in one platform, your costs are fixed and fully transparent from day one."
                </p>
                <Link href="/pricing" className="text-[#8A63D2] font-bold hover:underline flex items-center gap-1 text-[16px] mt-4">
                  View Bizvistar Plans <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>

            {/* Exact Table Replication */}
            <h3 className="text-[22px] font-bold font-sans text-gray-900 mb-4">What goes into website costs (and how much you can expect to spend)</h3>
            <div className="overflow-x-auto mb-16 border border-gray-200 rounded-lg shadow-sm">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-gray-100 text-gray-900">
                    <th className="p-3 font-bold font-sans text-[14px] border-r border-gray-200 w-[25%]">Cost factor</th>
                    <th className="p-3 font-bold font-sans text-[14px] border-r border-gray-200 w-[25%]">Average cost range</th>
                    <th className="p-3 font-bold font-sans text-[14px] w-[50%]">What’s included</th>
                  </tr>
                </thead>
                <tbody className="text-[14px] text-gray-900">
                  <tr className="bg-white border-b border-gray-200">
                    <td className="p-3 font-semibold border-r border-gray-200 text-[#8A63D2]">Bizvistar (All in one)</td>
                    <td className="p-3 border-r border-gray-200 text-gray-700 font-bold">Starts at ₹0 to ₹1,499 per month</td>
                    <td className="p-3 text-gray-700">Everything: Drag and drop builder, cloud hosting, domains, templates, CMS, Ecommerce & SSL.</td>
                  </tr>
                  <tr className="bg-[#f9f9f9] border-b border-gray-200">
                    <td className="p-3 font-semibold border-r border-gray-200">Website design & UI/UX</td>
                    <td className="p-3 border-r border-gray-200 text-gray-700">₹15,000 to ₹2,00,000+ (One time)</td>
                    <td className="p-3 text-gray-700">Hiring agencies for custom figma design work, branding, typography, and copywriting.</td>
                  </tr>
                  <tr className="bg-white border-b border-gray-200">
                    <td className="p-3 font-semibold border-r border-gray-200">Web hosting (External)</td>
                    <td className="p-3 border-r border-gray-200 text-gray-700">₹200 to ₹10,000 per month</td>
                    <td className="p-3 text-gray-700">Server space (Shared vs AWS/Cloud hosting). Built in free with Bizvistar.</td>
                  </tr>
                  <tr className="bg-[#f9f9f9] border-b border-gray-200">
                    <td className="p-3 font-semibold border-r border-gray-200">Domains</td>
                    <td className="p-3 border-r border-gray-200 text-gray-700">₹800 to ₹2,000 per year</td>
                    <td className="p-3 text-gray-700">Custom web addresses (e.g., yourbusiness.in). Free for the first year on annual plans.</td>
                  </tr>
                  <tr className="bg-white border-b border-gray-200">
                    <td className="p-3 font-semibold border-r border-gray-200">CMS Plugins & Add ons</td>
                    <td className="p-3 border-r border-gray-200 text-gray-700">₹1,000 to ₹10,000 per month</td>
                    <td className="p-3 text-gray-700">Subscriptions for page builders, SEO tools, and caching on open source platforms.</td>
                  </tr>
                  <tr className="bg-[#f9f9f9] border-b border-gray-200">
                    <td className="p-3 font-semibold border-r border-gray-200">Ecommerce functionality</td>
                    <td className="p-3 border-r border-gray-200 text-gray-700">2% to 3% Transaction Fees</td>
                    <td className="p-3 text-gray-700">Payment gateways (Razorpay, Stripe) integration and order management systems.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 id="cost-factors" className="text-[28px] md:text-[32px] font-bold font-sans text-gray-900 mb-6">Key website cost factors</h2>
            <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-8 font-normal">
              Here’s a detailed look at the factors that influence website costs and what determines them. We’ve provided average cost ranges based on both do-it-yourself solutions and higher-end traditional agency approaches to help you estimate expenses.
            </p>

            {/* Green Grid Component */}
            <div className="bg-[#d4e9cd] rounded-xl p-6 md:p-8 mb-12 relative">
              <div className="absolute top-6 left-6 text-[10px] font-bold tracking-widest text-gray-800 uppercase">Bizvistar Guide</div>
              <h2 className="text-[26px] md:text-[32px] font-normal text-gray-900 leading-[1.1] mb-8 mt-6">
                Website cost factors
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="bg-white p-5 rounded-lg flex flex-col h-full hover:shadow-md transition-shadow cursor-pointer" onClick={() => window.location.href='/auth'}>
                  <span className="text-gray-500 text-[11px] font-medium block mb-1">01</span>
                  <h4 className="font-bold text-[15px] font-sans mb-1 text-gray-900">Website builder</h4>
                  <p className="text-[12px] text-gray-600 leading-[1.4]">An all in one website builder bundles hosting, templates, and tools. Costs range from free to ₹2,000+ per month depending on features and business needs.</p>
                </div>
                <div className="bg-white p-5 rounded-lg flex flex-col h-full hover:shadow-md transition-shadow cursor-pointer" onClick={() => window.location.href='/templates'}>
                  <span className="text-gray-500 text-[11px] font-medium block mb-1">02</span>
                  <h4 className="font-bold text-[15px] font-sans mb-1 text-gray-900">Website design</h4>
                  <p className="text-[12px] text-gray-600 leading-[1.4]">Good design builds trust and drives conversions. Costs range from free with DIY builders to lakhs of rupees for a fully custom designed agency website.</p>
                </div>
                <div className="bg-white p-5 rounded-lg flex flex-col h-full hover:shadow-md transition-shadow cursor-pointer" onClick={() => window.location.href='/pricing'}>
                  <span className="text-gray-500 text-[11px] font-medium block mb-1">03</span>
                  <h4 className="font-bold text-[15px] font-sans mb-1 text-gray-900">Web hosting</h4>
                  <p className="text-[12px] text-gray-600 leading-[1.4]">Hosting keeps your website live. Costs range from free on a subdomain to ₹5,000+ per month for AWS cloud hosting.</p>
                </div>
                <div className="bg-white p-5 rounded-lg flex flex-col h-full hover:shadow-md transition-shadow cursor-pointer" onClick={() => window.location.href='/pricing'}>
                  <span className="text-gray-500 text-[11px] font-medium block mb-1">04</span>
                  <h4 className="font-bold text-[15px] font-sans mb-1 text-gray-900">Domains</h4>
                  <p className="text-[12px] text-gray-600 leading-[1.4]">A custom domain typically costs ₹800 to ₹1,500 per year. Premium or high demand domain names can cost significantly more.</p>
                </div>
                <div className="bg-white p-5 rounded-lg flex flex-col h-full hover:shadow-md transition-shadow cursor-pointer" onClick={() => window.location.href='/auth'}>
                  <span className="text-gray-500 text-[11px] font-medium block mb-1">05</span>
                  <h4 className="font-bold text-[15px] font-sans mb-1 text-gray-900">Ecommerce</h4>
                  <p className="text-[12px] text-gray-600 leading-[1.4]">Selling online adds costs for payment processing. Expect transaction fees of ~2% (Razorpay/Stripe) plus premium monthly plan costs.</p>
                </div>
                <div className="bg-white p-5 rounded-lg flex flex-col h-full hover:shadow-md transition-shadow cursor-pointer" onClick={() => window.location.href='/auth'}>
                  <span className="text-gray-500 text-[11px] font-medium block mb-1">06</span>
                  <h4 className="font-bold text-[15px] font-sans mb-1 text-gray-900">Marketing tools</h4>
                  <p className="text-[12px] text-gray-600 leading-[1.4]">Email marketing and SEO tools each carry their own costs. Budget ₹1,000 to ₹5,000+ per month depending on the channels.</p>
                </div>
              </div>
            </div>

            <h3 id="website-builder" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-12">01. Website builder</h3>
            <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">
              The days of hiring separate frontend, backend, and database engineers to launch a standard business website are officially over. In the past, putting together a working website meant connecting fragile systems and paying very high hourly rates. Today, modern website builders have packed entire engineering teams into easy visual screens. For a fraction of a single developer daily rate, you can now get premium tools.
            </p>
            <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">
              However, the real money drain of traditional web building is not the upfront cost, it is the technical debt. When you try to stitch together a mix of different services like buying a domain from one company, hosting from another, and relying on old open source plugins for basic features, you create a risky setup. A single bad update can instantly crash your checkout page, costing you thousands in lost sales and emergency repair fees.
            </p>
            <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">
              This is exactly why complete platforms like Bizvistar prove their massive value. By working inside a closed and carefully managed system, compatibility issues are completely removed. Every single part, from your mobile image galleries to your secure payment gateways, is looked after by a dedicated team of engineers. Your subscription is an investment in total reliability, automatic security updates, and the peace of mind that your site will simply work.
            </p>

            {/* Additional Content Image Placeholder */}
            <div className="w-full min-h-[300px] md:min-h-0 md:aspect-[21/9] bg-[#E5E0FA] rounded-2xl mb-12 mt-12 flex flex-col items-center justify-center overflow-hidden relative shadow-inner">
               <img src="/landing/bgwaveytexture.png" className="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none" alt="Texture" />
               <div className="text-center p-6 md:p-8 z-10 relative">
                 <h3 className="text-2xl md:text-3xl font-black text-[#1a1b4b] mb-4">Stop Paying Developer Retainers</h3>
                 <p className="text-[#1a1b4b] text-base md:text-lg max-w-2xl mx-auto mb-6">With Bizvistar, you are in complete control of your website. Update text, change images, and launch new products instantly without waiting for an agency.</p>
                 <Link href="/auth" className="px-6 md:px-8 py-3 bg-[#1a1b4b] text-white rounded-full font-bold hover:bg-black transition-colors inline-block text-[14px] md:text-[16px]">Start Building Free</Link>
              </div>
            </div>

            <h3 id="design" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-12">02. Website design and interface</h3>
            <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">
              In today highly competitive digital market, a beautiful design is no longer a luxury. It is the absolute minimum requirement to build consumer trust. The moment a potential customer lands on your page, they make a split second judgment about your brand based entirely on your design. A messy layout, poor fonts, or bad colors will instantly drive good traffic straight to your competitors.
            </p>
            <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">
              Also, professional design is directly connected to your profits through conversion rate optimization. A beautiful website that fails to guide users smoothly toward a purchase is broken. Traditional design agencies spend weeks studying users, creating wireframes, and testing pages to perfect this flow. This careful process easily pushes project costs past the 200,000 rupee mark for custom builds.
            </p>
            <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">
              For most growing businesses, paying that much money upfront is simply not possible. Bizvistar solves this problem by giving you instant access to a library of beautiful and highly optimized templates. These layouts are not just visually stunning. They are built based on data from thousands of successful online businesses. By using these strong foundations, you skip the expensive testing phase and can launch a breathtaking and profitable website in just a few hours.
            </p>

            <h3 id="hosting" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-12">03. Hosting, Domains, and Security (SSL)</h3>
            <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">
              Web hosting is the invisible backbone of your digital presence. Compromising on it is the most expensive mistake a business can make. Cheap hosts often trick founders with shockingly low starting prices, only to slow down speeds and charge massive renewal fees later. Even worse, shared hosting means your website speed and security are directly affected by the behavior of hundreds of other unrelated websites sitting on the exact same server.
            </p>
            <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">
              Beyond the server itself, your online space needs a custom domain and mandatory security rules. A standard domain is an expected annual cost, but SSL encryption is an absolute necessity. Search engines actively penalize sites without active SSL certificates, and modern browsers will literally block users from visiting them. Managing these certificates manually takes technical skill and constant attention to prevent terrible expirations.
            </p>
            <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">
              Bizvistar eliminates this completely by including premium global cloud hosting directly out of the box. You benefit from lightning fast load times and endless growth potential, meaning a sudden viral traffic spike will never crash your store. Also, custom domain connections and automatic SSL certificates are handled entirely in the background. This frees you from technical chores and protects your brand reputation.
            </p>

            <h3 id="ecommerce" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-12">04. E-Commerce and Marketing Tools</h3>
            <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">
              Moving from a simple brochure site to a fully working ecommerce system brings a massive layer of complexity. Securely processing payments, calculating shipping rates, and managing live inventory needs a very strong technical foundation. Building a custom ecommerce setup from scratch needs special backend knowledge and easily demands investments over 150,000 rupees for even the most basic store.
            </p>
            <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">
              The hidden costs of open source ecommerce are equally dangerous. While the base software might be free, you are immediately forced to buy extra add ons for essential features like abandoned cart recovery, detailed analytics, and local Indian payment connections like Razorpay or PayU. These repeating plugin fees can easily stack up and drain your monthly budget.
            </p>
            <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">
              Bizvistar makes digital selling available to everyone by providing a complete and smooth selling environment right away. You do not need to juggle extra apps or hire specialists to start making money. From secure checkouts to built in marketing automation and SEO tools, everything you need to attract and keep customers is perfectly integrated. You simply upload your products, connect your bank, and focus entirely on growing your business.
            </p>

            <h3 id="faq" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-16 pt-16">How much does a website cost FAQ</h3>
            
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
                  <li><Link href="#tldr" className="hover:text-[#8A63D2] transition-colors underline decoration-gray-300">TL;DR: how much does a website cost?</Link></li>
                  <li><Link href="#cost-factors" className="hover:text-[#8A63D2] transition-colors underline decoration-gray-300">Key website cost factors</Link></li>
                  <li><Link href="#website-builder" className="hover:text-[#8A63D2] transition-colors">01. Website builder</Link></li>
                  <li><Link href="#design" className="hover:text-[#8A63D2] transition-colors">02. Website design and interface</Link></li>
                  <li><Link href="#hosting" className="hover:text-[#8A63D2] transition-colors">03. Hosting, Domains, and Security</Link></li>
                  <li><Link href="#ecommerce" className="hover:text-[#8A63D2] transition-colors">04. E-Commerce and Marketing Tools</Link></li>
                  <li><Link href="#faq" className="hover:text-[#8A63D2] transition-colors">How much does a website cost FAQ</Link></li>
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
        <BlogBentoGrid posts={BLOG_POSTS} />
      </div>

      <Footer />
    </div>
  );
}