'use client';

import Link from 'next/link';

export default function HowItWorks() {
  const steps = [
    {
      id: "1.",
      title: "Find a platform.",
      description: "Pick a secure and reliable free website builder like BizVistar to create, host and manage your site in one place.",
    },
    {
      id: "2.",
      title: "Plan your website.",
      description: "Map out your goals, site structure and who your audience is to make sure your business stays on track.",
    },
    {
      id: "3.",
      title: "Start creating.",
      description: "Choose from 2,000+ free templates built for every industry or use the AI website builder.",
    },
    {
      id: "4.",
      title: "Customize everything.",
      description: "Use the drag and drop editor and built-in AI tools to adjust colors, fonts and animations to reflect your brand.",
    },
    {
      id: "5.",
      title: "Optimize for search engines.",
      description: "Set up your site for strong organic visibility with a suite of built-in SEO tools.",
    }
  ];

  return (
    <section className="py-24 bg-[#F4F5F8] relative">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-32">
          
          {/* Left Side: Title and Buttons */}
          <div className="lg:w-5/12">
            {/* The sticky class keeps this section in view while the user scrolls down the list */}
            <div className="sticky top-32">
              <h2 className="text-4xl lg:text-6xl  font-medium text-gray-900 leading-[1.1] tracking-tight mb-8">
                How to create a<br />
                website for free
              </h2>
              
              <p className="text-[20px] lg:text-[22px] text-gray-800 leading-snug mb-10 font-normal max-w-sm">
                Follow these 5 simple steps to create a website today.
              </p>
              
              <div className="flex items-center gap-6">
                <Link href="/get-started">
                  <button className="px-8 py-3.5 bg-black text-white text-[16px] font-medium rounded-full hover:bg-gray-800 transition-colors">
                    Get Started
                  </button>
                </Link>
                <Link href="/support" className="group flex items-center text-[16px] font-medium text-black">
              <span className="border-b border-black pb-[1px] mr-1">Contact us</span>
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
              </div>
            </div>
          </div>

          {/* Right Side: The 7 Steps List */}
          <div className="lg:w-7/12">
            <div className="flex flex-col">
              {steps.map((step, index) => (
                <div 
                  key={index} 
                  className={`flex gap-6 py-8 ${index === 0 ? 'pt-0' : ''} ${
                    index !== steps.length - 1 ? 'border-b border-[#D8D8D8]' : ''
                  }`}
                >
                  <div className="text-gray-500 text-lg w-6 flex-shrink-0 font-light mt-0.5">
                    {step.id}
                  </div>
                  <div>
                    <p className="text-[17px] leading-relaxed text-[#161616]">
                      <span className="font-semibold">{step.title}</span> {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}