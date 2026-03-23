'use client';

import { useContext, useState, useEffect } from 'react';
import { getOffers } from '@/app/actions/boostActions';
import { Tag, PartyPopper } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../cartContext.js';
import { TemplateContext } from '../templateContext.js';
import { useCheckout } from '@/hooks/useCheckout';
import { Loader2, AlertCircle, Smartphone } from 'lucide-react';
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
            <div className="container mx-auto px-6 py-20 min-h-screen flex items-center justify-center">
                <div className="bg-brand-primary p-8 rounded-lg max-w-xl w-full text-center shadow-lg">
                    <div className="w-16 h-16 bg-white/50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Smartphone className="text-brand-secondary w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-serif font-bold text-brand-text mb-4">Almost There! Complete Your Payment</h2>
                    <p className="text-brand-text/80 mb-8">Pay <span className="font-bold">₹{finalAmount.toFixed(2)}</span> via UPI.</p>
                    
                    <div className="hidden md:block mb-8">
                        <div className="bg-white p-2 inline-block rounded-lg shadow-sm">
                            <QRCodeSVG value={upiLink} size={200} />
                        </div>
                        <p className="text-xs text-brand-text/60 mt-2">Scan with any UPI App</p>
                    </div>

                    <a 
                        href={upiLink}
                        className="md:hidden w-full btn btn-secondary h-12 flex items-center justify-center gap-2 mb-4"
                    >
                        Pay Now
                    </a>

                    <p className="text-sm text-brand-text/60 bg-white/50 p-4 rounded-lg">
                        "Payments are processed directly between you and the store owner. The owner may request a payment screenshot for verification. Bizvistar does not facilitate transactions or charge commissions."
                    </p>
                    
                    <a href="/templates/flavornest/shop" className="block mt-8 text-brand-text underline text-sm hover:opacity-70">
                        Return to Shop
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6 py-20">
            <h1 className="text-5xl font-bold text-brand-secondary font-serif text-center mb-12">Checkout</h1>
            
            {cartDetails.length === 0 ? (
                <div className="text-center">
                    <p className="text-xl text-brand-text/80">Your cart is empty.</p>
                    <a 
                        href="/templates/flavornest/shop"
                        className="mt-8 inline-block btn btn-primary px-8 py-3"
                    >
                        Start Shopping
                    </a>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
                    
                    {/* Shipping Details Form */}
                    <div className="font-sans">
                        <h2 className="text-2xl font-serif font-semibold text-brand-text mb-6">Shipping Details</h2>
                        
                        {message && message.includes('fix') && (
                            <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-lg border border-red-200 flex items-start gap-2 text-sm">
                                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                <span>{message}</span>
                            </div>
                        )}

                        <form className="space-y-4" onSubmit={handlePlaceOrder}>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-brand-text/80 mb-1">First Name *</label>
                                    <input 
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        type="text" 
                                        className={cn("w-full p-3 bg-white border rounded-md focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary outline-none", fieldErrors.firstName ? "border-red-500" : "border-brand-text/30")}
                                        required
                                    />
                                    {fieldErrors.firstName && <p className="text-xs text-red-500 mt-1">{fieldErrors.firstName}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-brand-text/80 mb-1">Last Name *</label>
                                    <input 
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        type="text" 
                                        className={cn("w-full p-3 bg-white border rounded-md focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary outline-none", fieldErrors.lastName ? "border-red-500" : "border-brand-text/30")}
                                        required
                                    />
                                    {fieldErrors.lastName && <p className="text-xs text-red-500 mt-1">{fieldErrors.lastName}</p>}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-brand-text/80 mb-1">Phone Number *</label>
                                <input 
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    type="tel" 
                                    placeholder="0000000000"
                                    className={cn("w-full p-3 bg-white border rounded-md focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary outline-none", fieldErrors.phone ? "border-red-500" : "border-brand-text/30")}
                                    required
                                />
                                {fieldErrors.phone && <p className="text-xs text-red-500 mt-1">{fieldErrors.phone}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-brand-text/80 mb-1">Address *</label>
                                <input 
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    type="text" 
                                    className={cn("w-full p-3 bg-white border rounded-md focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary outline-none", fieldErrors.address ? "border-red-500" : "border-brand-text/30")}
                                    required
                                />
                                {fieldErrors.address && <p className="text-xs text-red-500 mt-1">{fieldErrors.address}</p>}
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-brand-text/80 mb-1">City *</label>
                                <input 
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    type="text" 
                                    className={cn("w-full p-3 bg-white border rounded-md focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary outline-none", fieldErrors.city ? "border-red-500" : "border-brand-text/30")}
                                    required
                                />
                                {fieldErrors.city && <p className="text-xs text-red-500 mt-1">{fieldErrors.city}</p>}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-brand-text/80 mb-1">State *</label>
                                    <StateSelector 
                                        value={formData.state}
                                        onChange={handleStateChange}
                                        error={fieldErrors.state}
                                        className="bg-white border-brand-text/30"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-brand-text/80 mb-1">ZIP Code *</label>
                                    <input 
                                        name="zipCode"
                                        value={formData.zipCode}
                                        onChange={handleChange}
                                        type="text" 
                                        className={cn("w-full p-3 bg-white border rounded-md focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary outline-none", fieldErrors.zipCode ? "border-red-500" : "border-brand-text/30")}
                                        required
                                    />
                                    {fieldErrors.zipCode && <p className="text-xs text-red-500 mt-1">{fieldErrors.zipCode}</p>}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-brand-text/80 mb-1">Note (Optional)</label>
                                <input 
                                    name="note"
                                    value={formData.note}
                                    onChange={handleChange}
                                    type="text" 
                                    className="w-full p-3 bg-white border border-brand-text/30 rounded-md focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary outline-none" 
                                />
                            </div>
                        </form>
                    </div>
                    
                    {/* Order Summary */}
                    <div className="bg-brand-primary p-8 rounded-lg h-fit">
                        
                        {/* Coupon Section */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-6">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Tag size={16} /> Promo Code</h3>
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    placeholder="Enter code" 
                                    className="flex-grow border border-gray-200 p-3 outline-none rounded-lg text-sm uppercase bg-white"
                                    value={couponInput}
                                    onChange={e => setCouponInput(e.target.value.toUpperCase())}
                                    disabled={!!appliedCoupon}
                                />
                                {appliedCoupon ? (
                                    <button type="button" onClick={removeCoupon} className="px-4 py-2 bg-red-50 text-red-600 font-bold text-xs rounded-lg hover:bg-red-100 transition-colors">Remove</button>
                                ) : (
                                    <button type="button" onClick={() => handleApplyCoupon(couponInput)} className="px-4 py-2 bg-gray-900 text-white font-bold text-xs rounded-lg hover:bg-gray-800 transition-colors">Apply</button>
                                )}
                            </div>
                            {couponError && <p className="text-red-500 text-xs mt-2 font-medium">{couponError}</p>}
                            
                            {showOffersList && !appliedCoupon && activeOffers.length > 0 && (
                                <div className="mt-4 space-y-2 max-h-48 overflow-y-auto pr-2" style={{ scrollbarWidth: "thin" }}>
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-widest">Available Offers</p>
                                    {activeOffers.map(offer => (
                                        <div key={offer.id} className="flex justify-between items-center p-3 bg-gray-50 border border-dashed border-gray-300 rounded-lg">
                                            <div>
                                                <p className="font-bold text-gray-800 text-sm">{offer.code}</p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {offer.type === 'percentage' ? `${offer.value}% OFF` : `$${offer.value} OFF`} 
                                                    {offer.min_order_value > 0 ? ` on orders above $${offer.min_order_value}` : ''}
                                                </p>
                                            </div>
                                            <button 
                                                type="button" 
                                                onClick={() => handleApplyCoupon(offer.code)}
                                                className="text-[10px] font-bold uppercase tracking-widest bg-gray-900 text-white px-3 py-2 rounded hover:bg-gray-800 transition-colors"
                                            >
                                                Apply
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                            <h2 className="text-2xl font-serif font-semibold text-brand-text mb-6">Your Order</h2>
                        
                        <div className="space-y-4 border-b border-brand-text/20 pb-4">
                            {cartDetails.map(item => (
                                <div key={item.id} className="flex items-center gap-4">
                                    <img src={item.image} alt={item.name} className="w-16 h-20 object-cover bg-white rounded" />
                                    <div className="flex-grow">
                                        <h3 className="font-semibold text-brand-text">{item.name}</h3>
                                        <p className="text-sm text-brand-text/70">Quantity: {item.quantity}</p>
                                    </div>
                                    <p className="font-medium text-brand-text">₹{(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                        
                        <div className="space-y-2 border-b border-brand-text/20 py-4">
                            <div className="flex justify-between text-brand-text/80">
                                <span>Subtotal</span>
                                <span>₹{subtotal.toFixed(2)}</span>
                            </div>

                                {/* Discount Line */}
                                {appliedCoupon && (
                                    <div className="flex justify-between items-center text-sm mb-3 text-green-600">
                                        <span className="flex items-center gap-1"><Tag size={14}/> Discount ({appliedCoupon.code})</span>
                                        <span>-₹{discountAmount.toFixed(2)}</span>
                                    </div>
                                )}

                             <div className="flex justify-between text-brand-text/80">
                                <span>Shipping</span>
                                <span>₹{deliveryAmount.toFixed(2)}</span>
                            </div>
                        </div>
                        
                         <div className="flex justify-between text-brand-text font-bold text-xl py-4">
                            <span>Total</span>
                            <span>₹{finalTotal.toFixed(2)}</span>
                        </div>
                        
                        {message && !message.includes('fix') && (
                            <div className={`p-4 rounded-lg mb-4 text-sm flex items-start gap-2 ${message.includes('success') ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
                                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                <span>{message}</span>
                            </div>
                        )}

                        <button 
                            onClick={handlePlaceOrder}
                            disabled={isSubmitting}
                            className="w-full mt-4 h-12 btn btn-secondary flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                isUPI ? 'Place Order & Pay' : 'Place Order (COD)'
                            )}
                        </button>
                        <p className="text-xs text-brand-text/60 text-center mt-2">
                            {isUPI 
                                ? "Complete payment via UPI after placing order."
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
    );
}
