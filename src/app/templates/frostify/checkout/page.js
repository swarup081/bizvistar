'use client';

import { useCart } from '../cartContext.js';
import { useCheckout } from '@/hooks/useCheckout';
import { Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import StateSelector from '@/components/checkout/StateSelector';

export default function FrostifyCheckoutPage() {
    const cart = useCart();
    const {
        formData, fieldErrors, isSubmitting, message,
        handleChange, handleStateChange, submit,
        cartDetails, subtotal, shipping, total
    } = useCheckout(cart);
    
    const handlePlaceOrder = (e) => {
        e.preventDefault();
        submit();
    };

    return (
        <div className="bg-[#F9F4F6] min-h-screen pt-24 md:pt-32 pb-12 md:pb-24 w-full max-w-full overflow-hidden overflow-x-hidden">
            <div className="container mx-auto px-6 max-w-6xl">
                <h1 className="text-[8vw] md:text-4xl font-serif text-[var(--color-primary)] text-center mb-8 md:mb-12">Checkout</h1>

                {cartDetails.length === 0 ? (
                    <div className="text-center bg-white p-6 md:p-12 rounded-3xl shadow-sm">
                        <p className="text-[4vw] md:text-xl text-[var(--color-primary)] mb-6">Your cart is empty.</p>
                        <a href="/templates/frostify/shop" className="inline-block bg-[var(--color-secondary)] text-white px-6 py-3 md:px-8 md:py-3 rounded-full text-[3vw] md:text-xs font-bold uppercase tracking-widest hover:bg-[var(--color-primary)] transition-colors">
                            Return to Shop
                        </a>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12">
                        {/* Form */}
                        <div className="bg-white p-4 md:p-8 rounded-3xl shadow-sm">
                            <h2 className="text-[5vw] md:text-xl font-bold text-[var(--color-primary)] mb-6 uppercase tracking-widest">Delivery Details</h2>
                            
                            {message && message.includes('fix') && (
                                <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-lg border border-red-200 flex items-start gap-2 text-sm">
                                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                    <span>{message}</span>
                                </div>
                            )}

                            <form className="space-y-4" onSubmit={handlePlaceOrder}>
                                <div className="grid grid-cols-2 gap-2 md:gap-4">
                                    <div className="space-y-1">
                                        <input 
                                            name="firstName" 
                                            value={formData.firstName} 
                                            onChange={handleChange}
                                            placeholder="First Name *" 
                                            className={cn("w-full bg-[#F9F4F6] px-3 py-2 md:px-4 md:py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-[var(--color-secondary)] text-[3vw] md:text-base", fieldErrors.firstName ? "border border-red-500" : "")}
                                        />
                                        {fieldErrors.firstName && <p className="text-xs text-red-500">{fieldErrors.firstName}</p>}
                                    </div>
                                    <div className="space-y-1">
                                        <input 
                                            name="lastName" 
                                            value={formData.lastName} 
                                            onChange={handleChange}
                                            placeholder="Last Name *" 
                                            className={cn("w-full bg-[#F9F4F6] px-3 py-2 md:px-4 md:py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-[var(--color-secondary)] text-[3vw] md:text-base", fieldErrors.lastName ? "border border-red-500" : "")}
                                        />
                                        {fieldErrors.lastName && <p className="text-xs text-red-500">{fieldErrors.lastName}</p>}
                                    </div>
                                </div>
                                
                                <div className="space-y-1">
                                    <input 
                                        name="phone"
                                        type="tel" 
                                        value={formData.phone} 
                                        onChange={handleChange}
                                        placeholder="Phone Number *" 
                                        className={cn("w-full bg-[#F9F4F6] px-3 py-2 md:px-4 md:py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-[var(--color-secondary)] text-[3vw] md:text-base", fieldErrors.phone ? "border border-red-500" : "")}
                                    />
                                    {fieldErrors.phone && <p className="text-xs text-red-500">{fieldErrors.phone}</p>}
                                </div>

                                <div className="space-y-1">
                                    <input 
                                        name="address" 
                                        value={formData.address} 
                                        onChange={handleChange}
                                        placeholder="Address *" 
                                        className={cn("w-full bg-[#F9F4F6] px-3 py-2 md:px-4 md:py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-[var(--color-secondary)] text-[3vw] md:text-base", fieldErrors.address ? "border border-red-500" : "")}
                                    />
                                    {fieldErrors.address && <p className="text-xs text-red-500">{fieldErrors.address}</p>}
                                </div>

                                <div className="space-y-1">
                                    <input 
                                        name="city" 
                                        value={formData.city} 
                                        onChange={handleChange}
                                        placeholder="City *" 
                                        className={cn("w-full bg-[#F9F4F6] px-3 py-2 md:px-4 md:py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-[var(--color-secondary)] text-[3vw] md:text-base", fieldErrors.city ? "border border-red-500" : "")}
                                    />
                                    {fieldErrors.city && <p className="text-xs text-red-500">{fieldErrors.city}</p>}
                                </div>
                                
                                <div className="grid grid-cols-2 gap-2 md:gap-4">
                                    <div className="space-y-1">
                                         <StateSelector 
                                            value={formData.state}
                                            onChange={handleStateChange}
                                            error={fieldErrors.state}
                                            className="bg-[#F9F4F6] border-none rounded-xl"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <input 
                                            name="zipCode" 
                                            value={formData.zipCode} 
                                            onChange={handleChange}
                                            placeholder="Zip Code *" 
                                            className={cn("w-full bg-[#F9F4F6] px-3 py-2 md:px-4 md:py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-[var(--color-secondary)] text-[3vw] md:text-base", fieldErrors.zipCode ? "border border-red-500" : "")}
                                        />
                                        {fieldErrors.zipCode && <p className="text-xs text-red-500">{fieldErrors.zipCode}</p>}
                                    </div>
                                </div>
                                
                                <div className="space-y-1">
                                     <input 
                                        name="note" 
                                        value={formData.note} 
                                        onChange={handleChange}
                                        placeholder="Note (Optional)" 
                                        className="w-full bg-[#F9F4F6] px-3 py-2 md:px-4 md:py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-[var(--color-secondary)] text-[3vw] md:text-base"
                                    />
                                </div>
                            </form>
                        </div>

                        {/* Order Summary */}
                        <div className="bg-[var(--color-primary)] text-white p-4 md:p-8 rounded-3xl shadow-lg h-fit">
                            <h2 className="text-[5vw] md:text-xl font-bold mb-6 uppercase tracking-widest border-b border-white/20 pb-4">Your Order</h2>
                            <div className="space-y-4 mb-6">
                                {cartDetails.map(item => (
                                    <div key={item.id} className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-white overflow-hidden">
                                                <img src={item.image} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="font-serif text-[3.5vw] md:text-lg leading-none">{item.name}</p>
                                                <p className="text-[2.5vw] md:text-xs opacity-70">Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <p className="font-bold text-[3.5vw] md:text-base">${(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-white/20 pt-6 mt-6">
                                <div className="flex justify-between text-[4vw] md:text-2xl font-serif">
                                    <span>Total</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                                
                                {message && !message.includes('fix') && (
                                    <div className={`mt-4 p-4 rounded-lg text-sm flex items-start gap-2 ${message.includes('success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                        <span>{message}</span>
                                    </div>
                                )}
                                
                                <button 
                                    onClick={handlePlaceOrder}
                                    disabled={isSubmitting}
                                    className="w-full mt-8 bg-white text-[var(--color-primary)] py-3 md:py-4 rounded-full text-[2.5vw] md:text-xs font-bold uppercase tracking-widest hover:bg-[var(--color-secondary)] hover:text-white transition-colors flex justify-center items-center gap-2"
                                >
                                     {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        'Place Order'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
