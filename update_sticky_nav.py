import re

# The user reported: "the editor become sticky when scrool it remain as it is although the nav is not sticky which it need to be fix the landing"

# 1. NewHeader.js -> Make sure nav is correctly sticky. Right now the wrapper has `sticky top-0 z-[110] bg-white`.
with open('src/components/landing/NewHeader.js', 'r') as f:
    content = f.read()

# Make the inner header `sticky top-0 z-50` if needed, but it's currently inside the wrapper.
# Let's verify the wrapper class
print("Header wrapper classes:")
for line in content.split('\n'):
    if 'className=' in line and 'sticky' in line:
        print(line)

# Let's ensure NewHeader uses `sticky` properly.
content = content.replace(
    '<div className="sticky top-0 left-0 right-0 z-[110] bg-white transition-all duration-300">',
    '<div className="sticky top-0 left-0 right-0 z-[110] bg-white transition-all duration-300 shadow-sm">'
)

with open('src/components/landing/NewHeader.js', 'w') as f:
    f.write(content)


# 2. LandingEditor.js -> The user complains "the editor become sticky when scrool it remain as it is".
# The EditorSidebar has `fixed bottom-0 left-0 w-full z-40`. This makes it a sticky bottom sheet on mobile!
with open('src/components/landing/LandingEditor.js', 'r') as f:
    content = f.read()

# If the user is on the landing page, we probably don't want the editor sidebar to stick to the bottom of the screen forever
# because it covers the rest of the landing page. It should be constrained inside the editor wrapper.
# We will change `fixed bottom-0` to `absolute bottom-0` so it sticks to the bottom of the LandingEditor container, NOT the screen viewport!
old_sidebar_class = """<div className={`bg-white border-t lg:border-t-0 lg:border-l border-gray-200 lg:overflow-y-auto lg:static lg:h-full lg:w-80 fixed bottom-0 left-0 w-full z-40 lg:z-auto shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] lg:shadow-none ${isHovered ? 'pointer-events-auto' : 'pointer-events-none'}`}>"""
new_sidebar_class = """<div className={`bg-white border-t lg:border-t-0 lg:border-l border-gray-200 lg:overflow-y-auto lg:static lg:h-full lg:w-80 absolute bottom-0 left-0 w-full z-40 lg:z-auto shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] lg:shadow-none ${isHovered ? 'pointer-events-auto' : 'pointer-events-none'}`}>"""

content = content.replace(old_sidebar_class, new_sidebar_class)

with open('src/components/landing/LandingEditor.js', 'w') as f:
    f.write(content)
