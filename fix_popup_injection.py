import re
import os

templates = ['aurora', 'avenix', 'blissly', 'flara', 'flavornest', 'frostify']

state_code = """    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
"""

popup_ui = """
            {showSuccessPopup && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-2xl p-8 flex flex-col items-center shadow-2xl animate-in zoom-in-95 duration-300 max-w-sm w-full mx-4">
                        <div className="w-32 h-32 mb-4">
                            <iframe src="/Gift.lottie" className="w-full h-full pointer-events-none" frameBorder="0" scrolling="no"></iframe>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">Coupon Applied!</h3>
                        <p className="text-gray-500 font-medium">You saved <span className="text-[#8A63D2] font-bold">₹{discountAmount.toFixed(2)}</span></p>
                    </div>
                </div>
            )}
"""

for tmpl in templates:
    path = f'src/app/templates/{tmpl}/checkout/page.js'
    if not os.path.exists(path): continue

    with open(path, 'r') as f:
        content = f.read()

    # The previous regex didn't match the closing tags correctly for popup_ui or the handler

    if "const [showSuccessPopup" not in content:
        content = content.replace(
            "const [showOffersList, setShowOffersList] = useState(false);",
            "const [showOffersList, setShowOffersList] = useState(false);\n" + state_code
        )

    if "setShowSuccessPopup(true);" not in content:
        content = content.replace(
            "setAppliedCoupon(offer);\n        setCouponInput(cleanCode);",
            "setAppliedCoupon(offer);\n        setCouponInput(cleanCode);\n        setShowSuccessPopup(true);\n        setTimeout(() => setShowSuccessPopup(false), 2500);"
        )

    if "Coupon Applied!" not in content:
        # Just inject it right before the final closing div/tag of the entire return statement.
        # Find the last occurrence of `</div>`
        last_div_idx = content.rfind("</div>")
        if last_div_idx != -1:
            content = content[:last_div_idx] + popup_ui + content[last_div_idx:]

    with open(path, 'w') as f:
        f.write(content)

    print(f"Patched popup and UI properly for {tmpl}")
