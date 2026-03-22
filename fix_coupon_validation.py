import re
import os

templates = ['aurora', 'avenix', 'blissly', 'flara', 'flavornest', 'frostify']

new_coupon_logic = """
    const handleApplyCoupon = (codeToApply = couponInput) => {
        setCouponError('');
        const cleanCode = codeToApply.trim().toUpperCase();

        // Find offer matching the cleaned code
        const offer = activeOffers.find(o => o.code.trim().toUpperCase() === cleanCode);

        if (!offer) {
            setCouponError('Invalid coupon code');
            setAppliedCoupon(null);
            return;
        }

        // Check expiration
        if (offer.expires_at && new Date(offer.expires_at) < new Date()) {
            setCouponError('This coupon code has expired');
            setAppliedCoupon(null);
            return;
        }

        // Check usage limits
        if (offer.usage_limit && offer.used_count >= offer.usage_limit) {
            setCouponError('This coupon has reached its usage limit');
            setAppliedCoupon(null);
            return;
        }

        // Check minimum order value
        if (offer.min_order_value > 0 && subtotal < offer.min_order_value) {
            setCouponError(`Minimum order value of $${offer.min_order_value} required`);
            setAppliedCoupon(null);
            return;
        }

        setAppliedCoupon(offer);
        setCouponInput(cleanCode);
    };
"""

for tmpl in templates:
    path = f'src/app/templates/{tmpl}/checkout/page.js'
    if not os.path.exists(path): continue

    with open(path, 'r') as f:
        content = f.read()

    # The previous logic was:
    # const upperCode = codeToApply.toUpperCase();
    # const offer = activeOffers.find(o => o.code === upperCode);

    # We will replace the entire handleApplyCoupon function block
    content = re.sub(
        r"const handleApplyCoupon = \([^)]*\) => \{[\s\S]*?setCouponInput\([^\)]*\);\n\s*\};",
        new_coupon_logic.strip(),
        content
    )

    with open(path, 'w') as f:
        f.write(content)

    print(f"Patched coupon validation for {tmpl}")
