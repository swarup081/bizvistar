import re
import os

templates = ['aurora', 'avenix', 'blissly', 'flara', 'flavornest', 'frostify']

for tmpl in templates:
    path = f'src/app/templates/{tmpl}/checkout/page.js'
    if not os.path.exists(path): continue

    with open(path, 'r') as f:
        content = f.read()

    # Extract websiteId from TemplateContext
    content = content.replace(
        "const { businessData } = useContext(TemplateContext);",
        "const { businessData, websiteId } = useContext(TemplateContext);"
    )

    with open(path, 'w') as f:
        f.write(content)
    print(f"Patched TemplateContext in {tmpl}")
