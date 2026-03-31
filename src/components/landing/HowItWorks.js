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
      <div className="max-w-[800px] mx-auto px-6">

        <div className="flex flex-col lg:flex-row justify-between gap-16 lg:gap-24">
          {/* Header content centered or left-aligned as per screenshot */}
          <div className="mb-14 lg:w-1/2 lg:sticky lg:top-40 self-start">
            <h2 className="text-[44px] lg:text-[56px] font-medium text-gray-900 leading-[1.1] tracking-tight mb-6">
              How to create a<br />
              website for free
            </h2>

            <p className="text-[20px] lg:text-[22px] text-gray-800 leading-snug mb-6 font-normal max-w-md">
              Follow these 7 simple steps<br/>
              to create a website today.
            </p>

            <div className="flex items-center">
              <Link href="/get-started" className="group flex items-center text-[18px] font-medium text-black">
                <span className="border-b border-black pb-[1px] mr-1">Learn more</span>
                <span className="transition-transform group-hover:translate-x-1 ml-1">→</span>
              </Link>
            </div>
          </div>

          {/* Steps List matching screenshot design */}
          <div className="flex flex-col lg:w-1/2">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex gap-4 py-8 ${index === 0 ? 'pt-0' : ''} ${
                index !== steps.length - 1 ? 'border-b border-gray-400/30' : ''
              }`}
            >
              <div className="text-gray-400 text-xl w-6 flex-shrink-0 font-normal">
                {step.id}
              </div>
              <div className="ml-1">
                <p className="text-[18px] leading-[1.6] text-gray-900 font-light tracking-wide">
                  <span className="font-bold text-black">{step.title}</span> {step.description}
                </p>
              </div>
            </div>
          ))}
          </div>
        </div>

      </div>
    </section>
  );
}