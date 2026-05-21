'use client';
import Link from 'next/link';
import BlogPostLayout from '@/components/blogs/BlogPostLayout';

export default function BlogPost() {
  const faqs = [{"question":"Do I need to be good at math for analytics?","answer":"No. Modern analytics tools do all calculations for you. You just need to understand what the numbers mean and what actions to take based on trends."},{"question":"How often should I check analytics?","answer":"Weekly for overall performance, monthly for trend analysis. Daily checking leads to reactive decisions based on normal statistical variance."},{"question":"What is a good conversion rate?","answer":"E-commerce average is 2-3%. Above 3% is good, above 5% is excellent. If you are below 1%, your website has significant conversion issues that need addressing."}];
  const toc = [{"href":"#metrics","label":"01. The only 5 metrics that matter"},{"href":"#tools","label":"02. Setting up Google Analytics"},{"href":"#decisions","label":"03. Making data-driven decisions"},{"href":"#faq","label":"FAQ"}];
  return (
    <BlogPostLayout category="OPERATIONS" title="Understanding Business Analytics: A Beginners Guide to Data-Driven Decisions" date="Apr 28" heroImage="/blogs/blog_ai_1778964944951.png" tableOfContents={toc} faqs={faqs} currentHref="/blogs/business-analytics-beginners">
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">Most small business owners make decisions based on gut feeling. They think their best product is the blue t-shirt because customers compliment it most. But when they check the actual sales data, the plain black t-shirt outsells it 3-to-1. Gut feelings are unreliable. Data is not. Understanding basic business analytics transforms you from a guessing entrepreneur into a strategic one.</p>
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-12 font-normal">This guide teaches non-technical business owners how to read and interpret website analytics, track meaningful KPIs, and make confident business decisions backed by real customer behavior data.</p>
      <ul className="list-disc pl-6 text-[#8A63D2] font-medium text-[18px] mb-12 space-y-2">
        <li><Link href="#metrics" className="hover:underline text-[#8A63D2]">01. The only 5 metrics that matter</Link></li>
        <li><Link href="#tools" className="hover:underline text-[#8A63D2]">02. Setting up Google Analytics</Link></li>
        <li><Link href="#decisions" className="hover:underline text-[#8A63D2]">03. Making data-driven decisions</Link></li>
      </ul>
      <h3 id="metrics" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-12">01. The only 5 metrics that matter</h3>
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">For most small businesses, these five metrics tell you everything: Traffic (how many people visit your site), Conversion Rate (what percentage buy), Average Order Value (how much they spend), Customer Acquisition Cost (how much you spend to get each customer), and Customer Lifetime Value (how much they spend total). Everything else is noise until you master these five.</p>

      <h3 id="tools" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-12">02. Setting up Google Analytics</h3>
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">Install Google Analytics 4 on your Bizvistar website (takes 2 minutes with your tracking ID). The Acquisition report shows where traffic comes from. The Engagement report shows which pages perform best. The Monetization report shows revenue data. Check these weekly — not daily, to avoid reactive decision-making based on normal daily fluctuations.</p>

      <h3 id="decisions" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-12">03. Making data-driven decisions</h3>
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">If a product page gets high traffic but low conversions, the problem is the page itself (price, photos, description). If a product gets low traffic but high conversions, it needs more promotion — it converts well when people see it. If a traffic source has high bounce rate, the audience is mismatched. Every metric tells a story about what to fix or amplify.</p>
      <div className="w-full min-h-[250px] md:min-h-0 md:aspect-[21/9] bg-[#E5E0FA] rounded-2xl mb-12 mt-12 flex flex-col items-center justify-center overflow-hidden relative shadow-inner">
        <img src="/landing/bgwaveytexture.png" className="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none" alt="Texture" />
        <div className="text-center p-6 md:p-8 z-10 relative">
          <h3 className="text-2xl md:text-3xl font-black text-[#1a1b4b] mb-4">Ready to Get Started?</h3>
          <p className="text-[#1a1b4b] text-base md:text-lg max-w-2xl mx-auto mb-6">Build your professional website today with Bizvistar.</p>
          <Link href="/auth" className="px-6 md:px-8 py-3 bg-[#1a1b4b] text-white rounded-full font-bold hover:bg-black transition-colors inline-block text-[14px] md:text-[16px]">Start Building Free</Link>
        </div>
      </div>
    </BlogPostLayout>
  );
}
