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
    { question: "Do I need coding skills to build a website?", answer: "No. Modern platforms like Bizvistar use intuitive drag and drop editors, meaning you can build a professional website entirely without touching a single line of code." },
    { question: "How long does it take to build a website?", answer: "If you use a template and have your content ready, you can build and launch a fully functional website in just a few hours. Custom coding would typically take weeks or months." },
    { question: "Should I buy my domain name first?", answer: "Yes, securing your domain name early is highly recommended to protect your brand identity. You can easily connect it to your Bizvistar site whenever you are ready." },
    { question: "Is web hosting included with Bizvistar?", answer: "Yes, all Bizvistar plans include premium, secure cloud hosting. You do not need to purchase or manage external hosting providers." },
    { question: "Can I sell products on my website?", answer: "Absolutely. You can easily add ecommerce functionality to your site, allowing you to process payments, manage inventory, and sell physical or digital products globally." },
    { question: "Will my website work on mobile phones?", answer: "Yes, all Bizvistar templates are automatically optimized for mobile devices, ensuring your site looks perfect on screens of any size." }
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
            WEBSITE BUILDING
          </span>
          
          <h1 className="text-[36px] md:text-[44px] lg:text-[48px] leading-[1.15] font-bold font-sans text-[#0f172a] tracking-tight mb-5">
            How to build a website from scratch in 2026
          </h1>
          
          <div className="text-gray-600 mb-6 text-[14px] flex items-center gap-3">
            <span className="font-normal text-gray-800">Swarup</span>
            <span className="text-gray-400 text-[10px]">•</span>
            <span className="font-normal text-gray-800">May 20</span>
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
              Building a website from scratch used to mean months of coding, expensive developer fees, and endless frustration. Today, establishing a professional online presence is faster and more accessible than ever. Whether you are launching a personal portfolio, a bustling ecommerce store, or a corporate landing page, the fundamental steps to building a successful website have been radically simplified.
            </p>
            <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">
              With powerful all in one platforms like Bizvistar, you no longer need to piece together separate hosting providers, security certificates, and clunky plugins. Everything you need is seamlessly integrated into a single ecosystem. This guide will walk you through the exact process of taking your idea from a blank canvas to a fully functioning, beautiful website that attracts customers and drives growth.
            </p>
            <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-12 font-normal">
              From selecting the perfect domain name to customizing your digital storefront and optimizing for mobile screens, we have broken down the entire journey into clear, actionable steps. Let us dive into the ultimate blueprint for building your website in 2026.
            </p>

            <ul className="list-disc pl-6 text-[#8A63D2] font-medium text-[18px] mb-12 space-y-2">
              <li><Link href="#tldr" className="hover:underline text-[#8A63D2]">TL;DR: The website building process</Link></li>
              <li><Link href="#domain-name" className="hover:underline text-[#8A63D2]">01. How to choose a domain name</Link></li>
              <li><Link href="#template" className="hover:underline text-[#8A63D2]">02. How to customize your website template</Link></li>
              <li><Link href="#features" className="hover:underline text-[#8A63D2]">03. Adding essential features and tools</Link></li>
              <li><Link href="#launch" className="hover:underline text-[#8A63D2]">04. Launching and maintaining your site</Link></li>
              <li><Link href="#seo" className="hover:underline text-[#8A63D2]">05. SEO and Marketing Best Practices</Link></li>
              <li><Link href="#faq" className="hover:underline text-[#8A63D2]">Building a website FAQ</Link></li>
            </ul>

            <h2 id="tldr" className="text-[28px] md:text-[32px] font-bold font-sans text-[#0f172a] mb-6 leading-tight tracking-tight">
              TL;DR: The website building process
            </h2>
            <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">
              If you want to get online fast, the process is straightforward: secure a memorable domain name, pick a professionally designed template that fits your industry, and replace the placeholder content with your own text and images. With a platform like Bizvistar, technical details like SSL security and mobile optimization are handled automatically in the background.
            </p>
            <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-12 font-normal">
              The key to success is preparation. Before you start dragging and dropping elements, have a clear understanding of your brand identity, your target audience, and the primary goal of your website. A well planned strategy ensures your design choices will actively support your business objectives.
            </p>

            {/* Additional Content Highlight Block */}
           <div className="mb-12 mt-12">
              <p className="text-[16px] font-bold text-gray-900 mb-4 tracking-tight">
                Launch Faster, Stress Free:
              </p>
              <div className="border-l-[4px] border-[#8A63D2] pl-6 py-2">
                <p className="text-[20px] md:text-[22px] text-[#334155] leading-relaxed font-medium">
                  "Skip the coding headaches. With Bizvistar, you can go from an idea to a fully launched website in less than a day."
                </p>
                <Link href="/auth" className="text-[#8A63D2] font-bold hover:underline flex items-center gap-1 text-[16px] mt-4">
                  Start Building Now <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>

            {/* Exact Table Replication */}
            <h3 className="text-[22px] font-bold font-sans text-gray-900 mb-4">Website building phases (and how Bizvistar simplifies them)</h3>
            <div className="overflow-x-auto mb-16 border border-gray-200 rounded-lg shadow-sm">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-gray-100 text-gray-900">
                    <th className="p-3 font-bold font-sans text-[14px] border-r border-gray-200 w-[25%]">Phase</th>
                    <th className="p-3 font-bold font-sans text-[14px] border-r border-gray-200 w-[25%]">Traditional Approach</th>
                    <th className="p-3 font-bold font-sans text-[14px] w-[50%]">The Bizvistar Advantage</th>
                  </tr>
                </thead>
                <tbody className="text-[14px] text-gray-900">
                  <tr className="bg-white border-b border-gray-200">
                    <td className="p-3 font-semibold border-r border-gray-200 text-[#8A63D2]">Foundation</td>
                    <td className="p-3 border-r border-gray-200 text-gray-700">Buying hosting and SSL separately.</td>
                    <td className="p-3 text-gray-700">Premium cloud hosting and SSL are built in automatically.</td>
                  </tr>
                  <tr className="bg-[#f9f9f9] border-b border-gray-200">
                    <td className="p-3 font-semibold border-r border-gray-200">Design</td>
                    <td className="p-3 border-r border-gray-200 text-gray-700">Hiring UI/UX designers for custom mockups.</td>
                    <td className="p-3 text-gray-700">Access a library of beautiful, high converting templates instantly.</td>
                  </tr>
                  <tr className="bg-white border-b border-gray-200">
                    <td className="p-3 font-semibold border-r border-gray-200">Development</td>
                    <td className="p-3 border-r border-gray-200 text-gray-700">Writing HTML, CSS, and backend code.</td>
                    <td className="p-3 text-gray-700">Visual drag and drop editor requires zero coding skills.</td>
                  </tr>
                  <tr className="bg-[#f9f9f9] border-b border-gray-200">
                    <td className="p-3 font-semibold border-r border-gray-200">Mobile Optimization</td>
                    <td className="p-3 border-r border-gray-200 text-gray-700">Writing custom media queries for devices.</td>
                    <td className="p-3 text-gray-700">Templates automatically adjust perfectly to mobile screens.</td>
                  </tr>
                  <tr className="bg-white border-b border-gray-200">
                    <td className="p-3 font-semibold border-r border-gray-200">Ecommerce</td>
                    <td className="p-3 border-r border-gray-200 text-gray-700">Installing complex payment plugins.</td>
                    <td className="p-3 text-gray-700">Native checkout systems and secure payment gateways integrated.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 id="domain-name" className="text-[28px] md:text-[32px] font-bold font-sans text-gray-900 mb-6">01. How to choose a domain name</h2>
            <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-8 font-normal">
              Your domain name is your digital address. It is how customers find you, remember you, and share your business with others. Choosing the right name is critical for branding and search engine visibility. Here are the top ten rules for securing the perfect domain.
            </p>

            {/* Blue Grid Component for Domain Steps */}
            <div className="bg-[#e0e7ff] rounded-xl p-6 md:p-8 mb-12 relative">
              <div className="absolute top-6 left-6 text-[10px] font-bold tracking-widest text-gray-800 uppercase">Bizvistar Guide</div>
              <h2 className="text-[26px] md:text-[32px] font-normal text-gray-900 leading-[1.1] mb-8 mt-6">
                How to choose a domain name
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { step: "01", title: "Choose a generator", desc: "Use a domain name generator for quick and creative brand ideas." },
                  { step: "02", title: "Keep it short", desc: "Shorter names are easier to remember and look better on marketing materials." },
                  { step: "03", title: "Make it easy to type", desc: "Avoid complex spelling that could lead customers to the wrong website." },
                  { step: "04", title: "Avoid numbers & dashes", desc: "Numbers and hyphens cause confusion when spoken aloud." },
                  { step: "05", title: "Stay on brand", desc: "Ensure your domain aligns perfectly with your overall brand identity." },
                  { step: "06", title: "Include keywords", desc: "Relevant keywords can give you a slight boost in search engine rankings." },
                  { step: "07", title: "Pick the right extension", desc: "Choose popular extensions like .com or regional ones like .in for local trust." },
                  { step: "08", title: "Plan for the long term", desc: "Do not pick a name so specific that it limits your future business growth." },
                  { step: "09", title: "Check its availability", desc: "Verify that the name is not already trademarked or heavily used." },
                  { step: "10", title: "Register your domain", desc: "Lock it in immediately through a registrar before someone else takes it." }
                ].map((item, i) => (
                  <div key={i} className="bg-[#c7d2fe] p-5 rounded-lg flex flex-col h-full hover:shadow-md transition-shadow">
                    <span className="text-gray-700 text-[11px] font-medium block mb-1">{item.step}</span>
                    <h4 className="font-bold text-[15px] font-sans mb-1 text-gray-900">{item.title}</h4>
                    <p className="text-[12px] text-gray-700 leading-[1.4]">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <h3 id="template" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-12">02. How to customize your website template</h3>
            <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">
              Templates are the secret weapon of modern web design. Instead of staring at a blank screen, you start with a proven, architecturally sound layout. However, a template is just a foundation. The real magic happens when you inject your unique brand personality into it. 
            </p>
            
            {/* Pink Grid Component for Template Customization */}
            <div className="bg-[#fce7f3] rounded-xl p-6 md:p-8 mb-12 relative">
              <div className="absolute top-6 left-6 text-[10px] font-bold tracking-widest text-gray-800 uppercase">Bizvistar Guide</div>
              <h2 className="text-[26px] md:text-[32px] font-normal text-gray-900 leading-[1.1] mb-8 mt-6">
                How to customize your website template
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { title: "Choose your template", desc: "Pick one that fits your niche and content style from our vast library." },
                  { title: "Edit website content", desc: "Replace placeholder text with your brand messaging and clear calls to action." },
                  { title: "Update images and videos", desc: "Use high quality photos, graphics or videos that reflect your brand identity." },
                  { title: "Adjust colors & fonts", desc: "Align with your brand palette and typography for a consistent look people will recognize." },
                  { title: "Rearrange layouts", desc: "Move sections, columns and elements to suit your specific content hierarchy." },
                  { title: "Add functionality", desc: "Include features like contact forms, social links, online scheduling or eCommerce tools." },
                  { title: "Optimize for mobile", desc: "Check each page of your template on a phone and make sure buttons are easy to tap." },
                  { title: "Test & preview site", desc: "Check every page before publishing to make sure everything works seamlessly." }
                ].map((item, i) => (
                  <div key={i} className="bg-white p-5 rounded-lg flex flex-col h-full hover:shadow-md transition-shadow cursor-pointer" onClick={() => window.location.href='/templates'}>
                    <h4 className="font-bold text-[15px] font-sans mb-1 text-gray-900">{item.title}</h4>
                    <p className="text-[12px] text-gray-600 leading-[1.4]">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <h3 id="features" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-12">03. Adding essential features and tools</h3>
            <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">
              A beautiful design is only half the battle. Your website needs to actively work for your business. This means integrating the right tools to capture leads, process sales, and analyze visitor behavior. With Bizvistar, expanding your site functionality is as easy as flipping a switch.
            </p>

            <div className="relative w-full aspect-[16/9] md:aspect-[2/1] mb-8 mt-8 bg-[#F3F4F6] rounded-xl overflow-hidden border border-gray-200 shadow-sm flex items-center justify-center">
               <img src="/editorssmock.png" alt="Bizvistar Dashboard Integration" className="w-full h-full object-cover filter brightness-95" />
            </div>

            <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">
              If you are selling products, you will want to activate our native ecommerce suite. This instantly provides secure checkout flows, dynamic shipping calculators, and inventory management. For service based businesses, integrating booking calendars and automated email capture forms is essential for converting traffic into paying clients.
            </p>

            <ul className="list-none space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <span className="text-[#8A63D2] font-bold mt-1">✓</span>
                <p className="text-[16px] text-gray-700 leading-relaxed m-0"><strong className="text-gray-900">Payment Gateways:</strong> Seamlessly accept credit cards, UPI, and net banking with built in secure integrations.</p>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#8A63D2] font-bold mt-1">✓</span>
                <p className="text-[16px] text-gray-700 leading-relaxed m-0"><strong className="text-gray-900">Lead Capture Forms:</strong> Build custom forms to collect visitor information directly into your CRM.</p>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#8A63D2] font-bold mt-1">✓</span>
                <p className="text-[16px] text-gray-700 leading-relaxed m-0"><strong className="text-gray-900">Analytics Dashboard:</strong> Track page views, bounce rates, and traffic sources directly from your admin panel.</p>
              </li>
            </ul>

            {/* Additional Content Image Placeholder */}
            <div className="w-full min-h-[300px] md:min-h-0 md:aspect-[21/9] bg-[#E5E0FA] rounded-2xl mb-12 mt-12 flex flex-col items-center justify-center overflow-hidden relative shadow-inner">
               <img src="/landing/bgwaveytexture.png" className="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none" alt="Texture" />
               <div className="text-center p-6 md:p-8 z-10 relative">
                 <h3 className="text-2xl md:text-3xl font-black text-[#1a1b4b] mb-4">Launch Your Dream Site Today</h3>
                 <p className="text-[#1a1b4b] text-base md:text-lg max-w-2xl mx-auto mb-6">With Bizvistar, you are in complete control of your website. Update text, change images, and launch new products instantly.</p>
                 <Link href="/auth" className="px-6 md:px-8 py-3 bg-[#1a1b4b] text-white rounded-full font-bold hover:bg-black transition-colors inline-block text-[14px] md:text-[16px]">Start Building Free</Link>
              </div>
            </div>

            <h3 id="launch" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-12">04. Launching and maintaining your site</h3>
            <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">
              The moments before you hit publish are crucial. Always conduct a thorough review of your live preview. Click every link, submit every form, and test the checkout process to ensure a frictionless experience for your future customers. Double check your mobile layout, as the majority of your traffic will likely come from smartphones.
            </p>
            <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">
              Once you go live, the work does not stop. A successful website is a living digital document. You should regularly review your analytics dashboard to understand how users interact with your content. Update your product imagery, refine your copywriting based on conversion data, and consistently publish new content to keep search engines engaged.
            </p>
            <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">
              Fortunately, maintaining a Bizvistar site is effortless. Technical maintenance, server security, and software updates are handled automatically by our engineering team. You simply focus on what matters most: growing your business and connecting with your audience.
            </p>

            <h3 id="seo" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-12">05. SEO and Marketing Best Practices</h3>
            <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">
              Once your website is live, the next critical step is ensuring people can actually find it. Search Engine Optimization (SEO) is the process of improving your site visibility on search engines like Google. Bizvistar comes packed with built in tools to give you a massive head start.
            </p>
            <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">
              Begin by customizing your meta titles and descriptions for every page. These are the snippets of text that appear in search results. Ensure you use relevant keywords that your target audience is actively searching for. Additionally, structure your content with clear H1, H2, and H3 headings to help search engines understand the hierarchy of your information.
            </p>
            
            <div className="mb-12 mt-12">
              <p className="text-[16px] font-bold text-gray-900 mb-4 tracking-tight">
                Pro Tip: Image Optimization
              </p>
              <div className="border-l-[4px] border-[#8A63D2] pl-6 py-2">
                <p className="text-[20px] md:text-[22px] text-[#334155] leading-relaxed font-medium">
                  "Always compress your images before uploading them. Large image files drastically slow down your page load times, which frustrates visitors and acts as a major negative ranking factor for Google's algorithm. Keep files under 200KB whenever possible!"
                </p>
              </div>
            </div>

            <h3 id="faq" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-16 pt-16">Building a website FAQ</h3>
            
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
                  <li><Link href="#tldr" className="hover:text-[#8A63D2] transition-colors underline decoration-gray-300">TL;DR: The website building process</Link></li>
                  <li><Link href="#domain-name" className="hover:text-[#8A63D2] transition-colors underline decoration-gray-300">01. How to choose a domain name</Link></li>
                  <li><Link href="#template" className="hover:text-[#8A63D2] transition-colors">02. How to customize your website template</Link></li>
                  <li><Link href="#features" className="hover:text-[#8A63D2] transition-colors">03. Adding essential features and tools</Link></li>
                  <li><Link href="#launch" className="hover:text-[#8A63D2] transition-colors">04. Launching and maintaining your site</Link></li>
                  <li><Link href="#seo" className="hover:text-[#8A63D2] transition-colors">05. SEO and Marketing Best Practices</Link></li>
                  <li><Link href="#faq" className="hover:text-[#8A63D2] transition-colors">Building a website FAQ</Link></li>
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