import re

with open('src/components/landing/LandingEditor.js', 'r') as f:
    content = f.read()

# Replace iframe with video for mobile
# `<iframe ... />` is inside `<div className={`transition-all ...`>...</div>`
# We want to keep the desktop iframe but use a video for mobile.
iframe_section = """            <iframe
              ref={iframeRef}
              src={`/templates/${templateName}?isLanding=true`}
              title="Website Preview"
              className="w-full h-full border-0 pointer-events-auto"
              key={templateName}
              style={{ overflow: 'hidden' }}
            />"""

new_iframe_section = """            {isMobileViewport ? (
              <video
                src="/loadingofeditorBackgroundRemover.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <iframe
                ref={iframeRef}
                src={`/templates/${templateName}?isLanding=true`}
                title="Website Preview"
                className="w-full h-full border-0 pointer-events-auto"
                key={templateName}
                style={{ overflow: 'hidden' }}
              />
            )}"""

content = content.replace(iframe_section, new_iframe_section)

with open('src/components/landing/LandingEditor.js', 'w') as f:
    f.write(content)


# Now fix the font for the top banner timer.
with open('src/components/landing/NewHeader.js', 'r') as f:
    content = f.read()

# Make the countdown number fonts better
# Currently: className="flex items-center gap-1 font-mono text-[16px] md:text-[17px] tracking-tight"
# Let's change it to something bolder/nicer, maybe `font-sans font-bold text-lg md:text-xl text-[#cfff04]`
old_timer = """<span className="flex items-center gap-1 font-mono text-[16px] md:text-[17px] tracking-tight">"""
new_timer = """<span className="flex items-center gap-1 font-sans font-bold text-[18px] md:text-[20px] text-[#cfff04] tracking-wider">"""

content = content.replace(old_timer, new_timer)

with open('src/components/landing/NewHeader.js', 'w') as f:
    f.write(content)
