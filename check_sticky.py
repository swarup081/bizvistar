import sys

with open('src/components/landing/LandingEditor.js', 'r') as f:
    lines = f.readlines()
    for i, line in enumerate(lines):
        if 'sticky' in line.lower() or 'fixed' in line.lower() or 'absolute' in line.lower() or 'z-' in line.lower():
            if i > 250: # Only check near the return statement
                print(f"{i+1}: {line.strip()}")
