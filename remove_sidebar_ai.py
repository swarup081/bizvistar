import re

filepath = 'src/components/editor/EditorSidebar.js'
with open(filepath, 'r') as f:
    content = f.read()

# 1. Revert EditorInput Definition
input_block_regex = r"const EditorInput = \(\{ label, value, onChange, isRequired = false, onFocus, onAI, aiPath \}\) => \{.*?<input"
input_replacement = """const EditorInput = ({ label, value, onChange, isRequired = false, onFocus }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {isRequired && <span className="text-red-500">*</span>}
      </label>
      <input"""

content = re.sub(input_block_regex, input_replacement, content, flags=re.DOTALL)

# 2. Revert EditorTextArea Definition
textarea_regex = r"const EditorTextArea = \(\{ label, value, onChange, onFocus, onAI, aiPath \}\) => \{.*?<textarea"
textarea_replacement = """const EditorTextArea = ({ label, value, onChange, onFocus }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <textarea"""

content = re.sub(textarea_regex, textarea_replacement, content, flags=re.DOTALL)

# 3. Revert AccordionItem Signature and Remove Buttons
content = content.replace("const AccordionItem = ({ title, icon: Icon, isOpen, onClick, children, isMobile, onCloseMobile, onAI, aiSection, aiContext }) => {",
                          "const AccordionItem = ({ title, icon: Icon, isOpen, onClick, children, isMobile, onCloseMobile }) => {")

# Remove Mobile Button (approximate matching to be safe)
content = re.sub(r"\{onAI && aiSection && \(.*?\)\}", "", content, flags=re.DOTALL)

# Remove Desktop Button (approximate matching)
content = re.sub(r"\{!isMobile && onAI && aiSection && \(.*?\)\}", "", content, flags=re.DOTALL)

# 4. Cleanup usage props
content = content.replace(" onAI={onAI}", "")
content = re.sub(r" aiPath='[^']+'", "", content)
content = re.sub(r" aiSection='[^']+'", "", content)
content = re.sub(r" aiContext=\{[^}]+\}", "", content)

# 5. Remove onAI from EditorSidebar props
content = content.replace("  onAI // <-- NEW PROP", "")
content = content.replace(",\n  onAI // <-- NEW PROP", "")

# 6. Remove GeminiIcon import
content = content.replace("import { GeminiIcon } from './icons/GeminiIcon';", "")

with open(filepath, 'w') as f:
    f.write(content)
