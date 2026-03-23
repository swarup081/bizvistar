'use client';

import { useContext, useState, useEffect } from 'react';
import { getOffers } from '@/app/actions/boostActions';
import { Tag } from 'lucide-react';
import { useCart } from '../cartContext.js';
import { TemplateContext } from '../templateContext.js';
import { useCheckout } from '@/hooks/useCheckout';
import { Loader2, AlertCircle, QrCode, Smartphone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { QRCodeSVG } from 'qrcode.react';
import StateSelector from '@/components/checkout/StateSelector';

export default function CheckoutPage() {
    const cart = useCart();
    const { businessData, websiteId } = useContext(TemplateContext);
    const { 
        formData, fieldErrors, isSubmitting, message, 
        handleChange, handleStateChange, submit,
        cartDetails, subtotal, shipping, total 
    } = useCheckout(cart);
    
    const [showUpi, setShowUpi] = useState(false);

    const [activeOffers, setActiveOffers] = useState([]);
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponInput, setCouponInput] = useState('');
    const [couponError, setCouponError] = useState('');
    const [showOffersList, setShowOffersList] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);


    const [finalAmount, setFinalAmount] = useState(0);

    useEffect(() => {
        if (!businessData || !websiteId) return;
        const showOff = businessData?.offersConfig?.showOffers ?? false;
        setShowOffersList(showOff);
        getOffers(websiteId).then(res => {
            if (res.success) setActiveOffers(res.data.filter(o => o.is_active));
        });
    }, [businessData, websiteId]);

    const isUPI = businessData?.payment?.mode === 'UPI';
    const upiId = businessData?.payment?.upiId;


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
        setShowSuccessPopup(true);
        setTimeout(() => setShowSuccessPopup(false), 2500);
    };

    const removeCoupon = () => {
        setAppliedCoupon(null);
        setCouponInput('');
        setCouponError('');
    };

    const calculateDiscount = (sub) => {
        if (!appliedCoupon) return 0;
        let discount = 0;
        if (appliedCoupon.type === 'percentage') {
            discount = sub * (appliedCoupon.value / 100);
        } else {
            discount = appliedCoupon.value;
        }
        if (appliedCoupon.max_discount && discount > appliedCoupon.max_discount) {
            discount = appliedCoupon.max_discount;
        }
        return discount;
    };

    const calculateDelivery = (sub) => {
        const deliveryConfig = businessData?.delivery || { type: 'fixed', cost: 0, threshold: 0 };
        if (deliveryConfig.type === 'free_over_threshold' && sub >= deliveryConfig.threshold) {
            return 0;
        }
        return deliveryConfig.cost || 0;
    };

    const discountAmount = calculateDiscount(subtotal);
    const deliveryAmount = calculateDelivery(subtotal);

    // OVERRIDE TOTAL FROM CART CONTEXT TO APPLY DISCOUNT
    const finalTotal = (subtotal || 0) - (discountAmount || 0) + (deliveryAmount || 0);


    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        const currentTotal = finalTotal;
        const result = await submit({ finalTotal, discountAmount, deliveryAmount, couponCode: appliedCoupon ? appliedCoupon.code : null });
        if (result && result.success && isUPI) {
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            if (isMobile) {
                const link = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(businessData?.name || 'Store')}&am=${currentTotal}&cu=INR`;
                window.location.href = link;
            }
            setFinalAmount(currentTotal);
            setShowUpi(true);
        }
    };

    const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(businessData?.name || 'Store')}&am=${finalAmount}&cu=INR`;

    if (showUpi) {
        return (
            <div className="bg-[var(--color-bg)] w-full min-h-screen flex items-center justify-center p-6">
                <div className="bg-white p-8 md:p-12 shadow-lg border border-gray-100 max-w-xl w-full text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Smartphone className="text-green-600 w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-serif text-[#0F1C23] mb-4">Almost There! Complete Your Payment</h2>
                    <p className="text-gray-600 mb-8">Please complete your payment of <span className="font-bold text-[#0F1C23]">₹{finalAmount.toFixed(2)}</span> via UPI.</p>
                    
                    <div className="hidden md:block mb-8">
                        <div className="bg-white p-2 border border-gray-200 inline-block rounded-lg">
                             <QRCodeSVG value={upiLink} size={200} />
                        </div>
                        <p className="text-xs text-gray-400 mt-2">Scan with any UPI App</p>
                    </div>

                    <a 
                        href={upiLink}
                        className="md:hidden w-full bg-[#25D366] text-white py-4 rounded-lg font-bold uppercase tracking-widest hover:bg-[#20bd5a] transition-colors flex items-center justify-center gap-2 mb-4"
                    >
                        Pay Now
                    </a>

                    <p className="text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">
                        "Payments are processed directly between you and the store owner. The owner may request a payment screenshot for verification. Bizvistar does not facilitate transactions or charge commissions."
                    </p>
                    
                    <a href="/templates/aurora/shop" className="block mt-8 text-[#0F1C23] underline text-sm hover:text-opacity-70">
                        Return to Shop
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[var(--color-bg)] w-full max-w-full overflow-hidden overflow-x-hidden min-h-screen">
            <div className="container mx-auto px-6 py-12 md:py-24 max-w-6xl">
                <h1 className="text-[8vw] md:text-4xl font-serif mb-8 md:mb-12 text-center text-[#0F1C23]">Checkout</h1>
                
                {cartDetails.length === 0 ? (
                    <div className="text-center bg-white p-8 md:p-12 shadow-sm border border-gray-100">
                        <p className="text-[4vw] md:text-xl text-gray-500 mb-6">Your cart is empty.</p>
                        <a 
                            href="/templates/aurora/shop" 
                            className="inline-block bg-[#0F1C23] text-white px-8 py-3 md:px-10 md:py-4 text-[2.5vw] md:text-xs font-bold uppercase tracking-widest hover:bg-[#D4A373] transition-colors"
                        >
                            Return to Shop
                        </a>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
                        {/* Form */}
                        <div className="bg-white p-6 md:p-10 shadow-sm border border-gray-100">
                            <h2 className="text-[4vw] md:text-xl font-bold uppercase tracking-widest mb-6 md:mb-8 text-[#0F1C23]">Billing Details</h2>
                            
                            {message && message.includes('fix') && (
                                <div className="mb-6 p-4 text-red-700 bg-red-50 border border-red-100 flex items-start gap-2 text-sm">
                                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                    <span>{message}</span>
                                </div>
                            )}

                            <form className="space-y-4" onSubmit={handlePlaceOrder}>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <input 
                                            name="firstName" 
                                            value={formData.firstName} 
                                            onChange={handleChange}
                                            placeholder="First Name *" 
                                            className={cn("w-full border border-gray-200 p-3 outline-none focus:border-[#0F1C23] transition-colors text-[3vw] md:text-sm placeholder:text-gray-400 font-light", fieldErrors.firstName ? "border-red-500" : "")}
                                        />
                                        {fieldErrors.firstName && <p className="text-[2vw] md:text-xs text-red-500 mt-1">{fieldErrors.firstName}</p>}
                                    </div>
                                    <div className="space-y-1">
                                        <input 
                                            name="lastName" 
                                            value={formData.lastName} 
                                            onChange={handleChange}
                                            placeholder="Last Name *" 
                                            className={cn("w-full border border-gray-200 p-3 outline-none focus:border-[#0F1C23] transition-colors text-[3vw] md:text-sm placeholder:text-gray-400 font-light", fieldErrors.lastName ? "border-red-500" : "")}
                                        />
                                        {fieldErrors.lastName && <p className="text-[2vw] md:text-xs text-red-500 mt-1">{fieldErrors.lastName}</p>}
                                    </div>
                                </div>
                                
                                <div className="space-y-1">
                                    <input 
                                        name="phone"
                                        type="tel" 
                                        value={formData.phone} 
                                        onChange={handleChange}
                                        placeholder="Phone Number *" 
                                        className={cn("w-full border border-gray-200 p-3 outline-none focus:border-[#0F1C23] transition-colors text-[3vw] md:text-sm placeholder:text-gray-400 font-light", fieldErrors.phone ? "border-red-500" : "")}
                                    />
                                    {fieldErrors.phone && <p className="text-[2vw] md:text-xs text-red-500 mt-1">{fieldErrors.phone}</p>}
                                </div>

                                <div className="space-y-1">
                                    <input 
                                        name="address" 
                                        value={formData.address} 
                                        onChange={handleChange}
                                        placeholder="Address *" 
                                        className={cn("w-full border border-gray-200 p-3 outline-none focus:border-[#0F1C23] transition-colors text-[3vw] md:text-sm placeholder:text-gray-400 font-light", fieldErrors.address ? "border-red-500" : "")}
                                    />
                                    {fieldErrors.address && <p className="text-[2vw] md:text-xs text-red-500 mt-1">{fieldErrors.address}</p>}
                                </div>

                                <div className="space-y-1">
                                    <input 
                                        name="city" 
                                        value={formData.city} 
                                        onChange={handleChange}
                                        placeholder="City *" 
                                        className={cn("w-full border border-gray-200 p-3 outline-none focus:border-[#0F1C23] transition-colors text-[3vw] md:text-sm placeholder:text-gray-400 font-light", fieldErrors.city ? "border-red-500" : "")}
                                    />
                                    {fieldErrors.city && <p className="text-[2vw] md:text-xs text-red-500 mt-1">{fieldErrors.city}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                         <StateSelector 
                                            value={formData.state}
                                            onChange={handleStateChange}
                                            error={fieldErrors.state}
                                            className="border border-gray-200 rounded-none bg-white p-3 text-[3vw] md:text-sm"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <input 
                                            name="zipCode" 
                                            value={formData.zipCode} 
                                            onChange={handleChange}
                                            placeholder="Zip Code *" 
                                            className={cn("w-full border border-gray-200 p-3 outline-none focus:border-[#0F1C23] transition-colors text-[3vw] md:text-sm placeholder:text-gray-400 font-light", fieldErrors.zipCode ? "border-red-500" : "")}
                                        />
                                        {fieldErrors.zipCode && <p className="text-[2vw] md:text-xs text-red-500 mt-1">{fieldErrors.zipCode}</p>}
                                    </div>
                                </div>
                                
                                <div className="space-y-1">
                                     <input 
                                        name="note" 
                                        value={formData.note} 
                                        onChange={handleChange}
                                        placeholder="Note (Optional)" 
                                        className="w-full border border-gray-200 p-3 outline-none focus:border-[#0F1C23] transition-colors text-[3vw] md:text-sm placeholder:text-gray-400 font-light"
                                    />
                                </div>
                            </form>
                        </div>

                        {/* Order Summary */}

                        {/* Coupon Section */}
                        <div className="bg-[#FAF9F6] p-6 border border-gray-100 mb-6">
                            <h3 className="text-[3vw] md:text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2 text-[#0F1C23]"><Tag size={16} /> Promo Code</h3>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Enter code"
                                    className="flex-grow border border-gray-200 p-3 outline-none focus:border-[#0F1C23] text-[3vw] md:text-sm uppercase bg-white font-light"
                                    value={couponInput}
                                    onChange={e => setCouponInput(e.target.value.toUpperCase())}
                                    disabled={!!appliedCoupon}
                                />
                                {appliedCoupon ? (
                                    <button type="button" onClick={removeCoupon} className="px-6 py-3 bg-red-50 text-red-600 font-bold uppercase tracking-widest text-xs hover:bg-red-100 transition-colors border border-red-100">Remove</button>
                                ) : (
                                    <button type="button" onClick={() => handleApplyCoupon(couponInput)} className="px-6 py-3 bg-[#0F1C23] text-white font-bold uppercase tracking-widest text-xs hover:bg-[#D4A373] transition-colors">Apply</button>
                                )}
                            </div>
                            {couponError && <p className="text-red-500 text-xs mt-2 font-medium">{couponError}</p>}

                            {showOffersList && !appliedCoupon && activeOffers.length > 0 && (
                                <div className="mt-4 space-y-2 max-h-48 overflow-y-auto pr-2" style={{ scrollbarWidth: "thin" }}>
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-widest">Available Offers</p>
                                    {activeOffers.map(offer => (
                                        <div key={offer.id} className="flex justify-between items-center p-3 bg-white border border-dashed border-[#D4A373]/50">
                                            <div>
                                                <p className="font-bold text-[#D4A373] text-sm">{offer.code}</p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {offer.type === 'percentage' ? `${offer.value}% OFF` : `$${offer.value} OFF`}
                                                    {offer.min_order_value > 0 ? ` on orders above $${offer.min_order_value}` : ''}
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleApplyCoupon(offer.code)}
                                                className="text-[10px] font-bold uppercase tracking-widest bg-[#0F1C23] text-white px-3 py-2 hover:bg-[#D4A373] transition-colors"
                                            >
                                                Apply
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="bg-[#FAF9F6] p-6 md:p-10 border border-gray-100 h-fit">
                            <h2 className="text-[4vw] md:text-xl font-bold uppercase tracking-widest mb-6 md:mb-8 text-[#0F1C23]">Your Order</h2>
                            <div className="space-y-4 mb-6 border-b border-gray-200 pb-6">
                                {cartDetails.map(item => (
                                    <div key={item.id} className="flex justify-between items-center text-[3vw] md:text-sm text-gray-600">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-white border border-gray-100">
                                                <img src={item.image} className="w-full h-full object-cover" />
                                            </div>
                                            <span>{item.name} <span className="text-xs text-gray-400 ml-1">x {item.quantity}</span></span>
                                        </div>
                                        <span className="font-medium text-[#0F1C23]">${(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="space-y-3 border-b border-gray-200 pb-6 mb-6">
                                <div className="flex justify-between text-[3vw] md:text-sm text-gray-500">
                                    <span>Subtotal</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>

                                {/* Discount Line */}
                                {appliedCoupon && (
                                    <div className="flex justify-between text-[3vw] md:text-sm text-green-600">
                                        <span className="flex items-center gap-1"><Tag size={14}/> Discount ({appliedCoupon.code})</span>
                                        <span>-${discountAmount.toFixed(2)}</span>
                                    </div>
                                )}

<div className="flex justify-between text-[3vw] md:text-sm text-gray-500">
                                    <span>Shipping</span>
                                    <span>${typeof deliveryAmount !== 'undefined' ? deliveryAmount.toFixed(2) : 0}</span>
                                </div>
                            </div>

                            <div className="flex justify-between text-[4vw] md:text-xl font-bold mb-8 text-[#0F1C23] font-serif">
                                <span>Total</span>
                                <span>${finalTotal.toFixed(2)}</span>
                            </div>
                            
                            {message && !message.includes('fix') && (
                                <div className={`mb-6 p-4 text-sm flex items-start gap-2 ${message.includes('success') ? 'bg-green-50 text-green-800 border border-green-100' : 'bg-red-50 text-red-800 border border-red-100'}`}>
                                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                    <span>{message}</span>
                                </div>
                            )}

                            <button 
                                onClick={handlePlaceOrder}
                                disabled={isSubmitting}
                                className="w-full bg-[#0F1C23] text-white py-4 text-[2.5vw] md:text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#D4A373] transition-colors flex justify-center items-center gap-2"
                            >
                                 {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    isUPI ? 'Place Order & Pay' : 'Place Order (COD)'
                                )}
                            </button>
                            <p className="text-xs text-center text-gray-400 mt-4">
                                {isUPI 
                                    ? "You will be redirected to payment after placing order."
                                    : "Payment will be collected upon delivery."
                                }
                            </p>
                        </div>
                    </div>
                )}

            {showSuccessPopup && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: -20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="bg-white rounded-2xl p-6 flex flex-col items-center shadow-2xl max-w-xs w-full pointer-events-auto border border-gray-100"
                    >
                        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4 text-green-500">
                            <PartyPopper size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">Coupon Applied!</h3>
                        <p className="text-gray-500 text-sm text-center">
                            You saved <span className="text-[#8A63D2] font-bold">₹{discountAmount.toFixed(2)}</span>
                        </p>
                    </motion.div>
                </div>
            )}
</div>
        </div>
    );
}
