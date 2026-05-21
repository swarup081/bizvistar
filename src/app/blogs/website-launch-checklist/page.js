'use client';
import Link from 'next/link';
import BlogPostLayout from '@/components/blogs/BlogPostLayout';

export default function BlogPost() {
  const faqs = [
    {
        "question": "How long should I test before launching?",
        "answer": "Minimum 48 hours of testing across devices and browsers. Have at least 3 people who are NOT involved in the build test the site independently."
    },
    {
        "question": "What's the most commonly missed item?",
        "answer": "Meta descriptions. Most people forget to write custom meta descriptions for each page, resulting in Google showing random text snippets in search results."
    },
    {
        "question": "Should I soft-launch first?",
        "answer": "Yes. Share with a small group (20-50 people) first to catch issues before a public launch. This limits the damage of any bugs."
    }
];

  const toc = [
    {
        "href": "#content",
        "label": "01. Content verification (Items 1-8)"
    },
    {
        "href": "#technical",
        "label": "02. Technical checks (Items 9-16)"
    },
    {
        "href": "#launch",
        "label": "03. Launch day actions (Items 17-25)"
    },
    {
        "href": "#faq",
        "label": "FAQ"
    }
];

  return (
    <BlogPostLayout category="GETTING STARTED" title="The Ultimate Website Launch Checklist: 25 Things to Verify" date="May 13" heroImage="/blogs/blog_club_1778965424607.png" heroAlt="The Ultimate Website Launch Checklist: 25 Things to Verify" tableOfContents={toc} faqs={faqs} currentHref="/blogs/website-launch-checklist">
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">You have spent weeks designing your website, writing copy, and uploading products. The temptation to hit publish immediately is overwhelming. But launching without a thorough pre-flight check is like taking off in an airplane without running through the safety checklist. One missed item can crash the entire experience for your visitors.</p>
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-12 font-normal">This 25-point checklist covers everything from technical SEO to broken links to mobile responsiveness to legal compliance. Print it out, check each item off, and launch with absolute confidence that your site is ready to impress.</p>

      <ul className="list-disc pl-6 text-[#8A63D2] font-medium text-[18px] mb-12 space-y-2">
        <li><Link href="#content" className="hover:underline text-[#8A63D2]">01. Content verification (Items 1-8)</Link></li>
        <li><Link href="#technical" className="hover:underline text-[#8A63D2]">02. Technical checks (Items 9-16)</Link></li>
        <li><Link href="#launch" className="hover:underline text-[#8A63D2]">03. Launch day actions (Items 17-25)</Link></li>
      </ul>

      <h3 id="content" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-12">01. Content verification (Items 1-8)</h3>
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">Check all text for typos and grammar. Verify all images load correctly. Ensure placeholder 'Lorem ipsum' text is replaced. Confirm contact information is accurate. Test all internal and external links. Review meta titles and descriptions for every page. Add alt text to all images. Ensure consistent brand voice across pages.</p>

      <h3 id="technical" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-12">02. Technical checks (Items 9-16)</h3>
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">Test page load speed (under 3 seconds). Verify SSL certificate is active (padlock icon). Check mobile responsiveness on 3+ devices. Confirm favicon is set. Test all forms (contact, newsletter, checkout). Verify 404 error page exists. Check browser compatibility (Chrome, Safari, Firefox). Ensure analytics tracking code is installed.</p>

      <h3 id="launch" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-12">03. Launch day actions (Items 17-25)</h3>
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">Submit sitemap to Google Search Console. Set up Google My Business listing. Create social media announcement posts. Send launch email to your subscriber list. Monitor server performance for first 24 hours. Test the complete checkout flow with a real purchase. Set up uptime monitoring alerts. Create a backup. Celebrate!</p>

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
