'use client';

import { useCart } from '../cartContext.js';
import { useCheckout } from '@/hooks/useCheckout';
import { Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import StateSelector from '@/components/checkout/StateSelector';

export default function CheckoutPage() {
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
                                <div className="flex justify-between text-[3vw] md:text-sm text-gray-500">
                                    <span>Shipping</span>
                                    <span>${shipping.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="flex justify-between text-[4vw] md:text-xl font-bold mb-8 text-[#0F1C23] font-serif">
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
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
                                    'Place Order'
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
