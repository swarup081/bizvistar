import re

filepath = 'src/components/editor/EditorSidebar.js'
with open(filepath, 'r') as f:
    content = f.read()

# 1. Imports
if "from './icons/GeminiIcon'" not in content:
    content = content.replace("import { useState, useEffect, useRef } from 'react';",
                              "import { useState, useEffect, useRef } from 'react';\nimport { GeminiIcon } from './icons/GeminiIcon';")

# 2. EditorInput Definition
# Locate the existing definition and replace it
input_regex = r"const EditorInput = \(\{ label, value, onChange, isRequired = false, onFocus \}\) => \{.*?return \(\n    <div className=\"mb-4\">\n      <label className=\"block text-sm font-medium text-gray-700 mb-1\">\n        \{label\} \{isRequired && <span className=\"text-red-500\">\*\<\/span>\}\n      <\/label>\n      <input"
input_replacement = """const EditorInput = ({ label, value, onChange, isRequired = false, onFocus, onAI, aiPath }) => {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-end mb-1">
        <label className="block text-sm font-medium text-gray-700">
            {label} {isRequired && <span className="text-red-500">*</span>}
        </label>
        {onAI && aiPath && (
            <button
                onClick={() => onAI({ type: 'field', key: aiPath, context: value })}
                className="text-purple-600 hover:bg-purple-50 p-1 rounded-md transition-colors flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider"
                title="Rewrite with AI"
            >
                <GeminiIcon size={12} />
                AI
            </button>
        )}
      </div>
      <input"""

content = re.sub(input_regex, input_replacement, content, flags=re.DOTALL)


# 3. EditorTextArea Definition
textarea_regex = r"const EditorTextArea = \(\{ label, value, onChange, onFocus \}\) => \{.*?return \(\n    <div className=\"mb-4\">\n      <label className=\"block text-sm font-medium text-gray-700 mb-1\">\n        \{label\}\n      <\/label>\n      <textarea"
textarea_replacement = """const EditorTextArea = ({ label, value, onChange, onFocus, onAI, aiPath }) => {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-end mb-1">
        <label className="block text-sm font-medium text-gray-700">
            {label}
        </label>
        {onAI && aiPath && (
            <button
                onClick={() => onAI({ type: 'field', key: aiPath, context: value })}
                className="text-purple-600 hover:bg-purple-50 p-1 rounded-md transition-colors flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider"
                title="Rewrite with AI"
            >
                <GeminiIcon size={12} />
                AI
            </button>
        )}
      </div>
      <textarea"""

content = re.sub(textarea_regex, textarea_replacement, content, flags=re.DOTALL)

# 4. AccordionItem Definition
# This one is tricky due to size. I'll replace the returned JSX structure.
# But wait, I need to add props to the signature too.
accordion_sig_regex = r"const AccordionItem = \(\{ title, icon: Icon, isOpen, onClick, children, isMobile, onCloseMobile \}\) => \{"
accordion_sig_replacement = "const AccordionItem = ({ title, icon: Icon, isOpen, onClick, children, isMobile, onCloseMobile, onAI, aiSection, aiContext }) => {"

content = re.sub(accordion_sig_regex, accordion_sig_replacement, content)

# Inject Mobile AI Button
mobile_header_regex = r"<div className=\"flex items-center gap-2\">\n                      <Icon size={20} className=\"text-\[#8A63D2\]\" />\n                      <span className=\"font-semibold text-lg text-gray-900\">\{title\}<\/span>\n                  <\/div>\n              <\/div>"
mobile_header_replacement = """<div className="flex items-center gap-2">
                      <Icon size={20} className="text-[#8A63D2]" />
                      <span className="font-semibold text-lg text-gray-900">{title}</span>
                  </div>
                   {onAI && aiSection && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onAI({ type: 'section', key: aiSection, context: aiContext });
                        }}
                        className="ml-auto flex items-center gap-1 text-purple-600 bg-purple-50 px-3 py-1.5 rounded-full text-xs font-bold"
                    >
                        <GeminiIcon size={14} />
                        AI Writer
                    </button>
                  )}
              </div>"""
content = content.replace(mobile_header_regex.replace(r'\{', '{').replace(r'\}', '}').replace(r'\n', '\n').replace(r'\[', '[').replace(r'\]', ']'), mobile_header_replacement)
# Actually, precise string replacement is safer than regex here if I can match exact string.
# But the regex above had escaped chars. Let's try to locate a unique anchor.

anchor = '<span className="font-semibold text-lg text-gray-900">{title}</span>\n                  </div>\n              </div>'
replacement = '<span className="font-semibold text-lg text-gray-900">{title}</span>\n                  </div>\n                  {onAI && aiSection && (\n                    <button \n                        onClick={(e) => {\n                            e.stopPropagation();\n                            onAI({ type: \'section\', key: aiSection, context: aiContext });\n                        }}\n                        className="ml-auto flex items-center gap-1 text-purple-600 bg-purple-50 px-3 py-1.5 rounded-full text-xs font-bold"\n                    >\n                        <GeminiIcon size={14} />\n                        AI Writer\n                    </button>\n                  )}\n              </div>'
content = content.replace(anchor, replacement)

# Inject Desktop AI Button
desktop_header_regex = r"<div className=\"flex items-center gap-3\">\n          \{displayIcon\}\n          <span className=\"font-medium\">\{title\}<\/span>\n        <\/div>\n        {!isMobile && \("
desktop_header_replacement = """<div className="flex items-center gap-3">
          {displayIcon}
          <span className="font-medium">{title}</span>
        </div>

        <div className="flex items-center gap-2">
            {!isMobile && onAI && aiSection && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onAI({ type: 'section', key: aiSection, context: aiContext });
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-purple-100 rounded-full text-purple-600"
                    title="Write section with AI"
                >
                    <GeminiIcon size={16} />
                </button>
            )}
            {!isMobile && ("""

# Construct regex carefully
# The original code:
#         <div className="flex items-center gap-3">
#           {displayIcon}
#           <span className="font-medium">{title}</span>
#         </div>
#         {!isMobile && (

pattern = r'<div className="flex items-center gap-3">\s+\{displayIcon\}\s+<span className="font-medium">\{title\}</span>\s+</div>\s+\{!isMobile && \('
repl = """<div className="flex items-center gap-3">
          {displayIcon}
          <span className="font-medium">{title}</span>
        </div>
        <div className="flex items-center gap-2">
            {!isMobile && onAI && aiSection && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onAI({ type: 'section', key: aiSection, context: aiContext });
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-purple-100 rounded-full text-purple-600"
                    title="Write section with AI"
                >
                    <GeminiIcon size={16} />
                </button>
            )}
            {!isMobile && ("""

content = re.sub(pattern, repl, content, flags=re.DOTALL)

# Also need to close the div I opened
# The original ended with:
#             <ChevronDown ... />
#         )}
#       </button>

# My replacement opened a div before `{!isMobile && (`. I need to close it after the ChevronDown block.
# Or I can just wrap the ChevronDown block in the div.
# Correct: I added `<div className="flex items-center gap-2">`
# Then `{!isMobile && onAI...}`
# Then `{!isMobile && (` (existing Chevron)
# I need to close the div after the existing Chevron block.

# Find where the Chevron block ends.
chevron_end_pattern = r'(\s+isOpen \? \'rotate-180\' : \'rotate-0\'\n\s+\}\}\n\s+/>\n\s+\)\}\n\s+</button>)'
# This regex is brittle.
# Let's try another way.
# Replace `</button>` with `</div></button>` if it follows the Chevron pattern? No.

# Let's replace the ENTIRE return block of AccordionItem if possible? No, too big.

# Strategy: Replace `{!isMobile && (` ... `)}` with `... </div>`
# It's safer to just replace the ChevronDown block completely.
chevron_block = """        {!isMobile && (
            <ChevronDown
            size={18}
            className={`text-gray-400 transition-transform ${
                isOpen ? 'rotate-180' : 'rotate-0'
            }`}
            />
        )}"""

chevron_block_new = """            {!isMobile && (
                <ChevronDown
                size={18}
                className={`text-gray-400 transition-transform ${
                    isOpen ? 'rotate-180' : 'rotate-0'
                }`}
                />
            )}
        </div>"""

content = content.replace(chevron_block, chevron_block_new)


# 5. EditorSidebar Signature
content = content.replace("websiteId // --- ADDED ---", "websiteId, // --- ADDED ---\n  onAI // <-- NEW PROP")

# 6. Inject Props

# Inject onAI into components
# Only inject if not already injected (to be safe)
content = re.sub(r'<EditorInput(?! onAI)', '<EditorInput onAI={onAI}', content)
content = re.sub(r'<EditorTextArea(?! onAI)', '<EditorTextArea onAI={onAI}', content)
# AccordionItem needs onAI too
content = re.sub(r'<AccordionItem(?! onAI)', '<AccordionItem onAI={onAI}', content)

# Inject aiPath
# Logic: value={getSafe(businessData, 'X')} -> value={getSafe(businessData, 'X')} aiPath='X'
# Regex for getSafe
content = re.sub(r"value=\{getSafe\(businessData, '([^']+)'\)\}", r"value={getSafe(businessData, '\1')} aiPath='\1'", content)

# Inject aiSection
# Logic: isOpen={activeAccordion === 'X'} -> isOpen={activeAccordion === 'X'} aiSection='X' aiContext={businessData?.X}
content = re.sub(r"isOpen=\{activeAccordion === '([^']+)'\}", r"isOpen={activeAccordion === '\1'} aiSection='\1' aiContext={businessData?.\1}", content)


with open(filepath, 'w') as f:
    f.write(content)
