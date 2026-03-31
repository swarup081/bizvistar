import re

with open('src/components/landing/LandingEditor.js', 'r') as f:
    content = f.read()

# Make the wrapper height larger and the inner iframe scale adjust dynamically so it shows correctly on mobile screens
content = content.replace("className={`flex flex-col lg:grid lg:grid-cols-[1fr_auto] bg-gray-50 rounded-xl overflow-hidden shadow-2xl relative border border-gray-200 ${isMobileViewport ? 'h-[70vh]' : 'h-[850px]'}`}",
                          "className={`flex flex-col lg:grid lg:grid-cols-[1fr_auto] bg-gray-50 rounded-xl overflow-hidden shadow-2xl relative border border-gray-200 ${isMobileViewport ? 'h-[85vh]' : 'h-[850px]'}`}")

with open('src/components/landing/LandingEditor.js', 'w') as f:
    f.write(content)
