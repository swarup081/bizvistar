'use client';

import { useContext, useState } from 'react';
import { useCart } from '../cartContext.js';
import { TemplateContext } from '../templateContext.js';
import { useCheckout } from '@/hooks/useCheckout';
import { Loader2, AlertCircle, Smartphone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { QRCodeSVG } from 'qrcode.react';
import StateSelector from '@/components/checkout/StateSelector';

export default function CheckoutPage() {
    const cart = useCart();
    const { businessData } = useContext(TemplateContext);
    const { 
        formData, fieldErrors, isSubmitting, message, 
        handleChange, handleStateChange, submit,
        cartDetails, subtotal, shipping, total 
    } = useCheckout(cart);
    
    const [showUpi, setShowUpi] = useState(false);
    const [finalAmount, setFinalAmount] = useState(0);

    const isUPI = businessData?.payment?.mode === 'UPI';
    const upiId = businessData?.payment?.upiId;

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        const currentTotal = total;
        const result = await submit();
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
                             <div className="flex justify-between text-brand-text/80">
                                <span>Shipping</span>
                                <span>₹{shipping.toFixed(2)}</span>
                            </div>
                        </div>
                        
                         <div className="flex justify-between text-brand-text font-bold text-xl py-4">
                            <span>Total</span>
                            <span>₹{total.toFixed(2)}</span>
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
        </div>
    );
}
