import sys

def check_file(filepath):
    with open(filepath, 'r') as f:
        print(f"--- {filepath} ---")
        lines = f.readlines()
        for i, line in enumerate(lines):
            if "sticky" in line.lower() or "fixed" in line.lower() or "absolute" in line.lower() or "relative" in line.lower():
                print(f"{i+1}: {line.strip()}")

check_file('src/components/landing/NewHeader.js')
check_file('src/app/page.js')
