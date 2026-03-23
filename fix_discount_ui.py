import re
import os

templates = ['aurora', 'avenix', 'blissly', 'flara', 'flavornest', 'frostify']

discount_ui = """
                                {/* Discount Line */}
                                {appliedCoupon && (
                                    <div className="flex justify-between items-center text-sm mb-3 text-green-600">
                                        <span className="flex items-center gap-1"><Tag size={14}/> Discount ({appliedCoupon.code})</span>
                                        <span>-₹{discountAmount.toFixed(2)}</span>
                                    </div>
                                )}
"""

for tmpl in templates:
    path = f'src/app/templates/{tmpl}/checkout/page.js'
    if not os.path.exists(path): continue

    with open(path, 'r') as f:
        content = f.read()

    # Some templates missed the discount UI injection if the regex was too strict.
    if "{/* Discount Line */}" not in content:
        # Let's target the exact text: "Subtotal" or similar and inject right after its div closes.
        content = re.sub(
            r"(<div[^>]*>\s*<span[^>]*>Subtotal<\/span>\s*<span[^>]*>\$*₹*\{*subtotal(\.toFixed\(2\))?\}*<\/span>\s*<\/div>)",
            r"\1\n" + discount_ui,
            content
        )

    with open(path, 'w') as f:
        f.write(content)
    print(f"Patched discount UI in {tmpl}")
