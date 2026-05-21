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
    { question: "How do I handle custom text on cakes through a website?", answer: "Bizvistar allows you to add custom text input fields directly on the product page. When a customer adds a cake to their cart, they must type in their desired message. This is attached directly to their order invoice, eliminating the need to ask them via DM." },
    { question: "Can I restrict deliveries to my local city?", answer: "Yes. You can set up pin-code-based delivery restrictions. If a customer tries to checkout with a pincode outside of your serviceable delivery radius, the system will prevent the transaction, saving you from having to refund unserviceable orders." },
    { question: "What if I need 48 hours notice for custom cakes?", answer: "You can clearly state your lead times in the product description and set up a mandatory 'Date Required' calendar picker at checkout. You can easily configure it to block out dates that are within your 48-hour no-bake window." },
    { question: "How do I manage inventory when ingredients are perishable?", answer: "Set strict inventory caps. If you only have enough premium chocolate to make 15 hampers this weekend, set the inventory to 15. Once sold out, the site will automatically mark them as unavailable, preventing you from over-promising." },
    { question: "Do I need an FSSAI license to sell on a website?", answer: "Generally, yes. Most payment gateways require basic business registration and FSSAI (in India) for food businesses to process payments. Displaying your FSSAI number on your footer also drastically increases customer trust." },
    { question: "How do I calculate shipping for fragile hampers?", answer: "You can set flat-rate local delivery fees or integrate with hyper-local delivery partners like Dunzo or Borzo directly if supported. For pan-India dry hampers, weight-based shipping rules ensure you don't lose money on courier fees." }
  ];

  return (
    <div className="bg-white text-gray-900 min-h-screen flex flex-col relative overflow-clip antialiased font-sans">
      
      <NewHeader />
      
      {/* Top Promotional Banner */}
      <div className="max-w-[1240px] w-[calc(100%-32px)] md:w-full mx-auto bg-[#d7e9b9] py-4 px-4 md:px-12 text-center z-10 mt-[24px] md:mt-[80px] rounded-xl sm:rounded-2xl mb-4 sm:mb-8 shadow-sm">
        <p className="text-[#0f172a] text-[15px] font-medium flex items-center justify-center flex-wrap gap-4 m-0">
          Create a bakery website you love with Bizvistar
          <Link href="/templates" className="px-6 py-2 bg-[#000] hover:bg-gray-800 text-white rounded-full transition-all shadow-md inline-block text-[14px] font-bold tracking-wide">
            Start Now
          </Link>
        </p>
      </div>

      <main className="flex-grow pt-4 md:pt-8 pb-8 md:pb-24 max-w-[1240px] mx-auto px-6 md:px-10 w-full">
        
        {/* Breadcrumb & Title Section */}
        <div className="mb-8 max-w-[850px] text-left">
          <span className="inline-block bg-[#f1f1f4] text-[#3f3f46] text-[11px] font-bold tracking-[0.05em] px-3 py-1 rounded-sm mb-4 uppercase">
            FOOD & BEVERAGE E-COMMERCE
          </span>
          
          <h1 className="text-[36px] md:text-[44px] lg:text-[48px] leading-[1.15] font-bold font-sans text-[#0f172a] tracking-tight mb-5">
            The Ultimate Guide to Selling Custom Home-Baked Cakes & Hampers Online
          </h1>
          
          <div className="text-gray-600 mb-6 text-[14px] flex items-center gap-3">
            <span className="font-normal text-gray-800">Swarup</span>
            <span className="text-gray-400 text-[10px]">•</span>
            <span className="font-normal text-gray-800">May 25</span>
          </div>

          <div className="font-bold text-[#8A63D2] text-[15px] flex items-center gap-2 mb-8 hover:text-[#6e4ea8] transition-colors">
            <Link href="/auth">Launch your bakery store today →</Link>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative w-full aspect-[16/9] md:aspect-[2.2/1] mb-16 bg-[#F3F4F6] rounded-2xl overflow-hidden flex items-center justify-center border border-gray-200">
           <img 
             src="/blogs/blog_cake_1778965507710.png" 
             alt="Custom Cakes and Hampers Online" 
             className="w-full h-full object-cover object-center"
           />
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-[80px] relative">
          
          {/* Left Column: Main Article Content */}
          <div className="lg:col-span-8 pb-4 lg:pb-10">
            
            <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">
              Starting a home-baking business often begins as a passion project. You bake for friends, they tell their friends, and suddenly your Instagram DMs are flooded with requests for custom birthday cakes, festive hampers, and artisanal brownies. It is an exhilarating feeling to see your culinary art turn into a profitable enterprise.
            </p>
            <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">
              However, selling food online presents a unique set of logistical nightmares that clothing or software brands simply do not face. A t-shirt can sit in a warehouse for six months; a fresh cream cake cannot. A software subscription does not shatter if the delivery driver hits a pothole. Food e-commerce is a high-stakes game of extreme time-sensitivity, temperature control, and hyper-local logistics. 
            </p>
            <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">
              When a holiday like Diwali or Valentine's Day hits, the sheer volume of custom requests—"Can you write Happy Anniversary in blue icing?", "Does the hamper include eggless options?"—can easily overwhelm a solo baker relying on WhatsApp. In this guide, we will break down exactly how to systemize your home bakery, manage brutal weekend rushes, and handle complex customization without losing your mind.
            </p>

            <ul className="list-disc pl-6 text-[#8A63D2] font-medium text-[18px] mb-12 space-y-2">
              <li><Link href="#tldr" className="hover:underline text-[#8A63D2]">TL;DR: The perishable scaling problem</Link></li>
              <li><Link href="#pillars" className="hover:underline text-[#8A63D2]">01. The 4 Pillars of Food E-commerce</Link></li>
              <li><Link href="#customization" className="hover:underline text-[#8A63D2]">02. Automating Customization Details</Link></li>
              <li><Link href="#mindset" className="hover:underline text-[#8A63D2]">03. The Hobbyist vs The Bakery CEO</Link></li>
              <li><Link href="#rushes" className="hover:underline text-[#8A63D2]">04. 5 Rules for Managing Weekend Rushes</Link></li>
              <li><Link href="#faq" className="hover:underline text-[#8A63D2]">Food E-commerce FAQ</Link></li>
            </ul>

            <h2 id="tldr" className="text-[28px] md:text-[32px] font-bold font-sans text-[#0f172a] mb-6 leading-tight tracking-tight">
              TL;DR: The Perishable Scaling Problem
            </h2>
            <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">
              You cannot scale a bakery if you are spending three hours a day typing out ingredient lists in DMs. E-commerce for food requires ruthless inventory capping, hyper-specific delivery date pickers, and automated custom-text fields. 
            </p>
            <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">
              By moving your menu to a Bizvistar website, you force customers to provide all necessary data (delivery dates, cake messages, dietary requirements) at the exact moment of checkout. This allows you to step away from your phone and get back into the kitchen where your actual value is created.
            </p>

            <div className="mb-12 mt-12">
              <p className="text-[16px] font-bold text-gray-900 mb-4 tracking-tight">
                Pro Tip: Menu Batching
              </p>
              <div className="border-l-[4px] border-[#8A63D2] pl-6 py-2">
                <p className="text-[20px] md:text-[22px] text-[#334155] leading-relaxed font-medium">
                  "Do not offer an endless, 'make-anything' menu. Instead, curate a fixed collection of your top 10 best-sellers and limit customizations strictly to size and icing text. Constraining choices increases your production speed tenfold."
                </p>
              </div>
            </div>

            <h3 id="pillars" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-12">01. The 4 Pillars of Food E-commerce</h3>
            <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">
              Selling perishables requires an entirely different operational architecture. You cannot afford to figure things out on the fly when you have fresh ingredients degrading by the hour. These four pillars must be structurally integrated into your website.
            </p>
            
            {/* Yellow Grid Component */}
            <div className="bg-[#fffbeb] rounded-xl p-6 md:p-8 mb-12 relative border border-[#fef08a]">
              <h2 className="text-[26px] md:text-[32px] font-normal text-gray-900 leading-[1.1] mb-8 mt-2">
                The Bakery Scaling Blueprint
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: "Strict Lead Times", desc: "A mandatory 48-hour buffer between payment and delivery. No more 'Can you make this for tonight?' panic attacks." },
                  { title: "Radius Restrictions", desc: "Hard-coded pincode validation at checkout. You only accept orders from areas your delivery partner can safely reach." },
                  { title: "Dietary Transparency", desc: "Clear, permanent labels on every product page (Eggless, Gluten-Free, Nut Warnings) to eliminate redundant questions." },
                  { title: "Hard Inventory Caps", desc: "The website stops accepting orders the moment you hit your physical baking limit of 20 cakes for the weekend." }
                ].map((item, i) => (
                  <div key={i} className="bg-white p-5 rounded-lg flex flex-col h-full hover:shadow-md transition-shadow shadow-sm">
                    <h4 className="font-bold text-[18px] font-sans mb-3 text-gray-900">{item.title}</h4>
                    <p className="text-[14px] text-gray-700 leading-[1.5]">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <h3 id="customization" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-12">02. Automating Customization Details</h3>
            <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">
              The biggest bottleneck for bespoke bakers is the back-and-forth negotiation of customization. A customer wants a cake, but they also want it eggless, with a specific message written on top, and they want it delivered exactly at 11:30 AM on a Sunday. 
            </p>
            <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">
              Managing this over WhatsApp leads to catastrophic errors. You will inevitably forget the message, misplace the date, or forget the dietary requirement because it is buried in a chat log from three days ago.
            </p>

            {/* Customization Table */}
            <div className="overflow-x-auto mb-16 border border-gray-200 rounded-lg shadow-sm mt-8">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-gray-100 text-gray-900">
                    <th className="p-3 font-bold font-sans text-[14px] border-r border-gray-200 w-[25%]">Requirement</th>
                    <th className="p-3 font-bold font-sans text-[14px] border-r border-gray-200 w-[37%]">Manual Order (WhatsApp)</th>
                    <th className="p-3 font-bold font-sans text-[14px] w-[37%]">Automated Order (Website)</th>
                  </tr>
                </thead>
                <tbody className="text-[14px] text-gray-900">
                  <tr className="bg-white border-b border-gray-200">
                    <td className="p-3 font-semibold border-r border-gray-200 text-[#8A63D2]">Cake Message</td>
                    <td className="p-3 border-r border-gray-200 text-gray-700">Buried in chat. Often forgotten or misspelled by the baker.</td>
                    <td className="p-3 text-emerald-600 font-bold">Typed by the customer into a mandatory checkout field.</td>
                  </tr>
                  <tr className="bg-[#f9f9f9] border-b border-gray-200">
                    <td className="p-3 font-semibold border-r border-gray-200">Dietary Needs</td>
                    <td className="p-3 border-r border-gray-200 text-gray-700">Constantly answering "Is this eggless?" one by one.</td>
                    <td className="p-3 text-emerald-600 font-bold">Clear toggle options (Eggless +$5) auto-update the price.</td>
                  </tr>
                  <tr className="bg-white border-b border-gray-200">
                    <td className="p-3 font-semibold border-r border-gray-200">Delivery Date</td>
                    <td className="p-3 border-r border-gray-200 text-gray-700">Manually adding events to your personal Google Calendar.</td>
                    <td className="p-3 text-emerald-600 font-bold">Calendar picker forces them to choose an available slot.</td>
                  </tr>
                  <tr className="bg-[#f9f9f9] border-b border-gray-200">
                    <td className="p-3 font-semibold border-r border-gray-200">Reference Images</td>
                    <td className="p-3 border-r border-gray-200 text-gray-700">Downloading dozens of Pinterest screenshots to your camera roll.</td>
                    <td className="p-3 text-emerald-600 font-bold">File upload button attached directly to their specific invoice.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 id="mindset" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-12">03. The Hobbyist vs The Bakery CEO</h3>
            <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-8 font-normal">
              Many incredibly talented bakers fail to build profitable businesses because they refuse to step out of the "Hobbyist" mindset. They view saying "no" to a customer's wild request as a failure of customer service, rather than a necessary boundary for scale. 
            </p>

            {/* Split Colored Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="bg-[#fefce8] border border-[#fef08a] rounded-xl p-6 shadow-sm">
                <h3 className="text-[24px] font-normal text-gray-900 mb-4 leading-tight">The Hobbyist Mindset</h3>
                <ul className="space-y-3 text-[14px] text-gray-700">
                  <li className="flex gap-2"><span>•</span> <span>Takes on 15 completely different custom designs in one weekend.</span></li>
                  <li className="flex gap-2"><span>•</span> <span>Spends hours sourcing hyper-specific ingredients for one cake.</span></li>
                  <li className="flex gap-2"><span>•</span> <span>Stays up until 4 AM baking, resulting in severe burnout.</span></li>
                  <li className="flex gap-2"><span>•</span> <span>Prices based on emotion, often making zero profit after labor.</span></li>
                </ul>
              </div>
              <div className="bg-[#e0f2fe] border border-[#bae6fd] rounded-xl p-6 shadow-sm">
                <h3 className="text-[24px] font-normal text-gray-900 mb-4 leading-tight">The Bakery CEO</h3>
                <ul className="space-y-3 text-[14px] text-gray-700">
                  <li className="flex gap-2"><span>•</span> <span>Sells a standardized 'Signature Collection' that can be batch-baked.</span></li>
                  <li className="flex gap-2"><span>•</span> <span>Buys core premium ingredients in bulk, lowering unit costs.</span></li>
                  <li className="flex gap-2"><span>•</span> <span>Cuts off orders exactly when capacity is reached.</span></li>
                  <li className="flex gap-2"><span>•</span> <span>Prices scientifically based on ingredients, overhead, and time.</span></li>
                </ul>
              </div>
            </div>

            <h3 id="rushes" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-12">04. 5 Rules for Managing Weekend Rushes</h3>
            <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">
              Festive seasons and busy weekends are when food businesses make or break their reputations. If you accept too many orders and deliver late, sloppy, or melted products, the negative reviews will haunt you. To survive the rush, you must enforce rigid operational rules.
            </p>

            {/* Mint Green List Component */}
            <div className="bg-[#dcfce7] rounded-xl p-6 md:p-8 mb-12 relative border border-[#bbf7d0] mt-8">
               <h2 className="text-[26px] md:text-[32px] font-normal text-gray-900 leading-[1.1] mb-8 mt-2">
                Surviving the Holiday Surge
              </h2>
              <div className="flex flex-col gap-y-4">
                 {[
                   { title: "01 Limit the Menu", desc: "Disable all custom-design options two weeks before a major holiday. Only sell set festive hampers." },
                   { title: "02 Pre-schedule Deliveries", desc: "Batch deliveries by zone. North city gets deliveries 10AM-1PM, South city gets 2PM-5PM." },
                   { title: "03 Prepare Packaging First", desc: "Fold boxes, attach ribbons, and write thank-you notes days before the actual baking begins." },
                   { title: "04 Buffer Your Inventory", desc: "If you can bake 50 items, cap the website at 45 to allow room for inevitable kitchen disasters." },
                   { title: "05 Automate Confirmations", desc: "Ensure your website sends a massive, clear email stating: 'Your order is confirmed for Friday.'" }
                 ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4 border-b border-[#bbf7d0] pb-4 last:border-0 last:pb-0">
                       <span className="text-emerald-700 font-bold text-[20px] pt-1">→</span>
                       <div>
                         <span className="text-gray-900 font-bold text-[18px] block mb-1">{item.title}</span>
                         <span className="text-gray-700 font-normal text-[15px] leading-relaxed">{item.desc}</span>
                       </div>
                    </div>
                 ))}
              </div>
            </div>

            <h3 id="faq" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-16 pt-16">Food E-commerce FAQ</h3>
            
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
                  <li><Link href="#pillars" className="hover:text-[#8A63D2] transition-colors underline decoration-gray-300">01. 4 Pillars of Food E-commerce</Link></li>
                  <li><Link href="#customization" className="hover:text-[#8A63D2] transition-colors underline decoration-gray-300">02. Automating Customization</Link></li>
                  <li><Link href="#mindset" className="hover:text-[#8A63D2] transition-colors underline decoration-gray-300">03. The Hobbyist vs The CEO</Link></li>
                  <li><Link href="#rushes" className="hover:text-[#8A63D2] transition-colors underline decoration-gray-300">04. 5 Rules for Weekend Rushes</Link></li>
                  <li><Link href="#faq" className="hover:text-[#8A63D2] transition-colors">Food E-commerce FAQ</Link></li>
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
