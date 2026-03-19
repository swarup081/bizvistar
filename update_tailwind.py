import re
import os

def update_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replacing purple with brand in tailwind classes
    # e.g. bg-purple-50 -> bg-brand-50, text-purple-600 -> text-brand-600, border-purple-200 -> border-brand-200

    # We want to be careful not to replace 'purple' if it's used as a word in text or a variable name unless it's a tailwind class.
    # Tailwind classes usually follow the pattern: prefix-color-weight (e.g. bg-purple-500, text-purple-50, border-purple-500/50, hover:bg-purple-700)

    # A regex to match tailwind color classes containing 'purple'
    # Examples: bg-purple-50, text-purple-600, border-purple-200, ring-purple-500, hover:text-purple-700, focus:ring-purple-500

    # We'll just replace `-purple-` with `-brand-` and `purple-` if it's right after a prefix like `bg-`
    # More safely: match any standard tailwind prefix followed by `purple-`

    prefixes = ['bg', 'text', 'border', 'ring', 'fill', 'stroke', 'from', 'via', 'to', 'shadow', 'decoration', 'outline', 'divide', 'caret']

    new_content = content
    for prefix in prefixes:
        # Match e.g. bg-purple-500, hover:bg-purple-500, group-hover:bg-purple-500
        # The lookbehind ensures it's either the start of the string, a space, a quote, or a colon
        pattern = r'(?<=[\s"\':|\[])' + prefix + r'-purple-(?=\d)'
        new_content = re.sub(pattern, prefix + '-brand-', new_content)

    # Also handle arbitrary custom classes like `bg-[purple-700]` if they exist, though rare.
    # What about things like `bg-purple`?
    new_content = re.sub(r'(?<=[\s"\':|\[])bg-purple(?=[\s"\'\]])', 'bg-brand', new_content)
    new_content = re.sub(r'(?<=[\s"\':|\[])text-purple(?=[\s"\'\]])', 'text-brand', new_content)
    new_content = re.sub(r'(?<=[\s"\':|\[])border-purple(?=[\s"\'\]])', 'border-brand', new_content)

    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated: {filepath}")

def main():
    for root, dirs, files in os.walk('src'):
        for file in files:
            if file.endswith(('.js', '.jsx', '.ts', '.tsx', '.css')):
                filepath = os.path.join(root, file)
                update_file(filepath)

if __name__ == "__main__":
    main()
