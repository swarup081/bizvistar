import re

# Fix NewHeader.js colors explicitly
with open('src/components/landing/NewHeader.js', 'r') as f:
    content = f.read()

content = content.replace('bg-[#1a1a1a] text-white text-xs md:text-[15px] py-2.5 text-center px-4 font-bold flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 font-sans tracking-wide',
                          'bg-[#1a1a1a] text-white text-xs md:text-[15px] py-2.5 text-center px-4 font-medium flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 font-sans tracking-wide')

content = content.replace('<span className="text-[11px] md:text-[12px] font-sans font-semibold text-gray-300 -ml-0.5">D</span>',
                          '<span className="text-[11px] md:text-[12px] font-sans font-medium text-gray-300 -ml-0.5">D</span>')
content = content.replace('<span className="text-[11px] md:text-[12px] font-sans font-semibold text-gray-300 -ml-0.5">H</span>',
                          '<span className="text-[11px] md:text-[12px] font-sans font-medium text-gray-300 -ml-0.5">H</span>')
content = content.replace('<span className="text-[11px] md:text-[12px] font-sans font-semibold text-gray-300 -ml-0.5">M</span>',
                          '<span className="text-[11px] md:text-[12px] font-sans font-medium text-gray-300 -ml-0.5">M</span>')
content = content.replace('<span className="text-[11px] md:text-[12px] font-sans font-semibold text-gray-300 -ml-0.5">S</span>',
                          '<span className="text-[11px] md:text-[12px] font-sans font-medium text-gray-300 -ml-0.5">S</span>')


with open('src/components/landing/NewHeader.js', 'w') as f:
    f.write(content)

# Update HowItWorks layout
with open('src/components/landing/HowItWorks.js', 'r') as f:
    content = f.read()

old_hiw = """        {/* Header content centered or left-aligned as per screenshot */}
        <div className="mb-14">
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
        <div className="flex flex-col mt-12">"""

new_hiw = """        <div className="flex flex-col lg:flex-row justify-between gap-16 lg:gap-24">
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
          <div className="flex flex-col lg:w-1/2">"""

content = content.replace(old_hiw, new_hiw)

# Add closing div for the flex container
content = content.replace("""          ))}
        </div>

      </div>
    </section>""", """          ))}
          </div>
        </div>

      </div>
    </section>""")

with open('src/components/landing/HowItWorks.js', 'w') as f:
    f.write(content)

# Fix Landing Editor layout
with open('src/components/landing/LandingEditor.js', 'r') as f:
    content = f.read()

# Change the scale and width to make it fit nicely
# We saw the user request exact mobile editor layout
content = content.replace('isMobileViewport ? \'100%\' : (view === \'desktop\' ? \'1440px\' : \'375px\')',
                          'isMobileViewport ? \'100%\' : (view === \'desktop\' ? \'1440px\' : \'390px\')') # iPhone 12/13/14 size

with open('src/components/landing/LandingEditor.js', 'w') as f:
    f.write(content)

print("Updates applied 2.")
