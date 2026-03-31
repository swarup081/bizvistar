import re

with open('src/components/landing/LandingEditor.js', 'r') as f:
    content = f.read()

# Make the wrapper scale appropriately. On very small devices, 390px might bleed over the edge.
# We will apply a CSS scale trick when it's rendered as `view === 'mobile'` but viewed ON a mobile device.

old_style = """            style={{
              width: isMobileViewport ? '100%' : (view === 'desktop' ? '1440px' : '390px'),
              height: isMobileViewport ? '100%' : (view === 'desktop' ? `${containerHeight / scale}px` : '812px'),
              transform: isMobileViewport ? 'none' : `scale(${scale})`,
              marginTop: isMobileViewport ? '0' : (view === 'desktop' ? '465px' : '40px'),
              overflow: 'hidden',
            }}"""

new_style = """            style={{
              width: isMobileViewport ? '100%' : (view === 'desktop' ? '1440px' : '390px'),
              height: isMobileViewport ? '100%' : (view === 'desktop' ? `${containerHeight / scale}px` : '812px'),
              transform: isMobileViewport ? 'none' : `scale(${scale})`,
              marginTop: isMobileViewport ? '0' : (view === 'desktop' ? '465px' : '40px'),
              overflow: 'hidden',
              transformOrigin: 'top center'
            }}"""

content = content.replace(old_style, new_style)

with open('src/components/landing/LandingEditor.js', 'w') as f:
    f.write(content)
