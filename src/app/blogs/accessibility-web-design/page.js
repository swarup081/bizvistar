'use client';
import Link from 'next/link';
import BlogPostLayout from '@/components/blogs/BlogPostLayout';

export default function BlogPost() {
  const faqs = [{"question":"Is web accessibility legally required in India?","answer":"The Rights of Persons with Disabilities Act 2016 requires government websites to be accessible. While private businesses are not yet strictly mandated, global trends suggest regulations are coming. Getting ahead now avoids future scrambles."},{"question":"Does accessibility hurt my design?","answer":"Not at all. Accessible design IS good design. Clear contrast, readable text, logical navigation, and descriptive content improve the experience for ALL users, not just those with disabilities."},{"question":"How much does accessibility cost to implement?","answer":"For existing Bizvistar websites, most accessibility improvements are free — adding alt text, improving contrast, and fixing heading structure cost nothing but time."}];
  const toc = [{"href":"#basics","label":"01. Accessibility fundamentals"},{"href":"#design","label":"02. Inclusive design principles"},{"href":"#test","label":"03. Testing your accessibility"},{"href":"#faq","label":"FAQ"}];
  return (
    <BlogPostLayout category="DESIGN & SEO" title="Web Accessibility: Why Your Website Must Work for Everyone" date="Apr 23" heroImage="/blogs/blog_tiktok_1778964932618.png" tableOfContents={toc} faqs={faqs} currentHref="/blogs/accessibility-web-design">
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">1 in 5 people worldwide has some form of disability. In India, that is over 280 million potential customers. If your website cannot be navigated by someone using a screen reader, or read by someone with color blindness, you are excluding a massive market. Beyond ethics, accessible websites rank higher on Google, face fewer legal risks, and provide better UX for everyone.</p>
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-12 font-normal">This guide covers practical accessibility improvements that any business owner can implement. You do not need to become a WCAG expert — just following these core principles will make your website significantly more inclusive and better for all users.</p>
      <ul className="list-disc pl-6 text-[#8A63D2] font-medium text-[18px] mb-12 space-y-2">
        <li><Link href="#basics" className="hover:underline text-[#8A63D2]">01. Accessibility fundamentals</Link></li>
        <li><Link href="#design" className="hover:underline text-[#8A63D2]">02. Inclusive design principles</Link></li>
        <li><Link href="#test" className="hover:underline text-[#8A63D2]">03. Testing your accessibility</Link></li>
      </ul>
      <h3 id="basics" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-12">01. Accessibility fundamentals</h3>
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">Add alt text to every image describing what it shows. Ensure sufficient color contrast (4.5:1 ratio minimum for text). Make all interactive elements keyboard-navigable. Use semantic HTML (proper headings, lists, buttons). Provide text alternatives for video content. These five changes alone address 80% of common accessibility issues.</p>

      <h3 id="design" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-12">02. Inclusive design principles</h3>
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">Never rely on color alone to convey information (red for errors, green for success). Always pair with icons or text labels. Use readable font sizes (minimum 16px for body text). Ensure clickable areas are at least 44x44 pixels for touch targets. Provide clear focus indicators for keyboard navigation. Avoid auto-playing videos or animations that cannot be paused.</p>

      <h3 id="test" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-12">03. Testing your accessibility</h3>
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">Use the free WAVE browser extension to scan any page for accessibility issues. Test keyboard navigation by unplugging your mouse and using Tab, Enter, and arrow keys. Try your site with VoiceOver (Mac) or NVDA (Windows) screen readers. Ask someone with different abilities to test your site — real-world testing reveals issues automated tools miss.</p>
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
