with open('src/components/landing/NewHeader.js', 'r') as f:
    content = f.read()

# Make sure it's 100% sticky in normal Next.js rendering
# Because we wrap NewHeader in page.js, it might break if parents have `overflow-x-hidden`.
# Let's check page.js
with open('src/app/page.js', 'r') as f:
    page_content = f.read()

for line in page_content.split('\n'):
    if 'overflow' in line:
        print(line)

# AHA! <div className="bg-white font-sans text-gray-900 min-h-screen flex flex-col overflow-x-hidden relative">
# `overflow-x-hidden` on the main parent will BREAK `position: sticky` on its children in many browsers!

new_page_content = page_content.replace(
    '<div className="bg-white font-sans text-gray-900 min-h-screen flex flex-col overflow-x-hidden relative">',
    '<div className="bg-white font-sans text-gray-900 min-h-screen flex flex-col relative overflow-clip">'
)

with open('src/app/page.js', 'w') as f:
    f.write(new_page_content)
print("Updated overflow in page.js to fix sticky behavior.")
