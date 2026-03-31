import re

# 1. NewHeader.js: Restore top banner styling to dark theme as requested (but keep the timer and new text)
with open('src/components/landing/NewHeader.js', 'r') as f:
    content = f.read()

# Replace banner style
content = content.replace('bg-[#cfff04] text-[#111827]', 'bg-[#1a1a1a] text-white')
content = content.replace('text-gray-800', 'text-gray-300')
content = content.replace('hover:text-gray-700', 'hover:text-gray-300')

with open('src/components/landing/NewHeader.js', 'w') as f:
    f.write(content)

# 2. page.js: Revert template rendering to conditionally show Carousel on desktop, Showcase on mobile
with open('src/app/page.js', 'r') as f:
    content = f.read()

# Update template section
if 'TemplatesShowcaseUI' in content and 'TemplateCarousel' in content:
    # We will manually replace the templates section via a targeted replace
    old_template_section = """        {/* --- Templates Marquee Section --- */}
        <section id="templates" className="mt-16 sm:mt-24">
          <h2 className="text-4xl sm:text-6xl font-bold text-gray-900 text-center mb-6 sm:mb-8 px-4 leading-tight">
             Stunning Designs <br/> for Every Business possible
          </h2>
          <div className="mb-10 w-full overflow-hidden">
             <div className="flex justify-center scale-90 sm:scale-100 transform origin-center">
                <TemplatesShowcaseUI />
             </div>
          </div>
        </section>"""

    new_template_section = """        {/* --- Templates Section --- */}
        <section id="templates" className="mt-16 sm:mt-24">
          <h2 className="text-4xl sm:text-6xl font-bold text-gray-900 text-center mb-6 sm:mb-8 px-4 leading-tight">
             Stunning Designs <br/> for Every Business possible
          </h2>
          <div className="mb-10 w-full overflow-hidden">
             {/* Mobile / Smaller screens: Marquee */}
             <div className="flex sm:hidden justify-center transform origin-center">
                <TemplatesShowcaseUI />
             </div>
             {/* Desktop / Larger screens: Carousel */}
             <div className="hidden sm:block w-full">
                <TemplateCarousel />
             </div>
          </div>
        </section>"""

    content = content.replace(old_template_section, new_template_section)

with open('src/app/page.js', 'w') as f:
    f.write(content)

print("Updates applied.")
