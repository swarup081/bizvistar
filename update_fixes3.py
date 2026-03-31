import re

# Fix Benefits section image styling based on user feedback to match desktop
with open('src/components/landing/BenefitsSection.js', 'r') as f:
    content = f.read()

# Make the wrapper slightly smaller or match the request to scale down and reposition
old_mobile_image = """            {/* Mobile Image Placeholder */}
            <div className="block lg:hidden w-[90%] sm:w-[80%] max-w-sm relative overflow-hidden shadow-2xl bg-white border border-gray-200 rounded-[2.5rem] mt-10 p-2">"""

new_mobile_image = """            {/* Mobile Image Placeholder */}
            <div className="block lg:hidden w-full sm:w-[80%] max-w-md relative overflow-hidden shadow-xl bg-white/50 border border-gray-200 rounded-xl mt-8 mx-auto">"""

content = content.replace(old_mobile_image, new_mobile_image)

# Ensure the image itself scales properly
content = content.replace('w-full h-auto object-cover block rounded-[2rem]', 'w-full h-auto object-cover block rounded-lg')
content = content.replace('w-full h-auto object-cover block rounded-[2rem] object-left-top', 'w-full h-auto object-cover block rounded-lg object-left-top')

with open('src/components/landing/BenefitsSection.js', 'w') as f:
    f.write(content)

# Sticky Nav issue: The user complained about the sticky nav breaking or not being sticky
# In StickySubNav.js, ensure it attaches nicely below NewHeader
with open('src/components/landing/StickySubNav.js', 'r') as f:
    content = f.read()

content = content.replace('isSticky ? "fixed top-[135px] lg:top-6 inset-x-0 flex justify-center lg:justify-start lg:pl-6" : "relative flex justify-center lg:justify-start lg:pl-6"',
                          'isSticky ? "fixed top-[88px] lg:top-[88px] inset-x-0 flex justify-center lg:justify-start lg:pl-6" : "relative flex justify-center lg:justify-start lg:pl-6"')

with open('src/components/landing/StickySubNav.js', 'w') as f:
    f.write(content)

print("Updates applied 3.")
