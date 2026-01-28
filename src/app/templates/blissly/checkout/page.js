'use client';

import { useCart } from '../cartContext.js';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { submitOrder } from '@/app/actions/orderActions';
import { Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import StateSelector from '@/components/checkout/StateSelector';

export default function CheckoutPage() {
    const { cartDetails, subtotal, shipping, total, openCart, clearCart } = useCart();
    
    // Logic: No email, Phone required, Note optional.
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        phone: '', 
        note: ''   
    });
    
    const [fieldErrors, setFieldErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const pathname = usePathname();
    const router = useRouter();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (fieldErrors[name]) {
             setFieldErrors(prev => ({ ...prev, [name]: null }));
        }
    };
    
    // Separate handler for StateSelector
    const handleStateChange = (value) => {
        setFormData({ ...formData, state: value });
        if (fieldErrors.state) {
             setFieldErrors(prev => ({ ...prev, state: null }));
        }
    }

    const validateForm = () => {
        const errors = {};
        if (!formData.firstName.trim()) errors.firstName = "First name is required";
        if (!formData.lastName.trim()) errors.lastName = "Last name is required";
        if (!formData.phone.trim()) errors.phone = "Phone number is required";
        
        const phoneRegex = /^\d{10}$/;
        if (formData.phone.trim() && !phoneRegex.test(formData.phone.trim())) {
             errors.phone = "Phone number must be exactly 10 digits";
        }

        if (!formData.address.trim()) errors.address = "Address is required";
        if (!formData.city.trim()) errors.city = "City is required";
        if (!formData.state.trim()) errors.state = "State is required";
        if (!formData.zipCode.trim()) errors.zipCode = "ZIP Code is required";
        
        const zipRegex = /^\d{6}$/;
        if (formData.zipCode.trim() && !zipRegex.test(formData.zipCode.trim())) {
             errors.zipCode = "ZIP code must be exactly 6 digits";
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    }

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setMessage('');

        if (!validateForm()) {
            setMessage("Please fix the highlighted errors before continuing.");
            return;
        }

        setIsSubmitting(true);

        try {
            const pathParts = pathname.split('/');
            let siteSlug = null;
            if (pathParts[1] === 'site') {
                siteSlug = pathParts[2];
            } else {
                 console.warn("Checkout is running in preview/template mode.");
            }

            if (!siteSlug && pathParts[1] !== 'site') {
                 setMessage('Cannot place real orders in Template Preview mode. Please publish the site first.');
                 setIsSubmitting(false);
                 return;
            }

            const result = await submitOrder({
                siteSlug,
                cartDetails,
                customerDetails: formData,
                totalAmount: total
            });

            if (result.success) {
                setMessage('Order placed successfully!');
                clearCart();
                setTimeout(() => {
                    // Success redirect logic here if needed
                }, 2000);
            } else {
                setMessage('Failed to place order: ' + result.error);
            }

        } catch (error) {
            setMessage('An unexpected error occurred.');
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full max-w-full overflow-hidden overflow-x-hidden">
            <div className="container mx-auto px-4 md:px-6 py-10 md:py-20 font-sans">
                <h1 className="text-[8vw] md:text-6xl font-serif font-medium text-brand-text text-center mb-8 md:mb-16">Checkout</h1>
                
                {cartDetails.length === 0 ? (
                    <div className="text-center">
                        <p className="text-[3vw] md:text-xl text-brand-text/80">Your cart is empty.</p>
                        <a 
                            href="/templates/blissly/shop"
                            className="mt-8 inline-block bg-brand-secondary text-brand-bg px-6 py-3 md:px-8 md:py-3 font-medium tracking-wide rounded-lg text-[2.5vw] md:text-base hover:opacity-90 transition-all"
                        >
                            Start Shopping
                        </a>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 max-w-6xl mx-auto">
                        
                        {/* Shipping Details Form */}
                        <div className="font-sans">
                            <h2 className="text-[5vw] md:text-2xl font-serif font-medium text-brand-text mb-6">Shipping Details</h2>
                            
                            {message && message.includes('fix') && (
                                <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-lg border border-red-200 flex items-start gap-2 text-sm">
                                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                    <span>{message}</span>
                                </div>
                            )}
                        
                            <form className="space-y-4" onSubmit={handlePlaceOrder}>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[2.5vw] md:text-sm font-medium text-brand-text/80">First Name *</label>
                                        <input 
                                            name="firstName" 
                                            value={formData.firstName}
                                            onChange={handleChange} 
                                            type="text" 
                                            className={cn("w-full p-2 md:p-3 bg-brand-primary border rounded-lg focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary outline-none transition-all", fieldErrors.firstName ? "border-red-500" : "border-brand-text/10")} 
                                            required
                                        />
                                        {fieldErrors.firstName && <p className="text-xs text-red-500">{fieldErrors.firstName}</p>}
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[2.5vw] md:text-sm font-medium text-brand-text/80">Last Name *</label>
                                        <input 
                                            name="lastName" 
                                            value={formData.lastName}
                                            onChange={handleChange} 
                                            type="text" 
                                            className={cn("w-full p-2 md:p-3 bg-brand-primary border rounded-lg focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary outline-none transition-all", fieldErrors.lastName ? "border-red-500" : "border-brand-text/10")} 
                                            required
                                        />
                                        {fieldErrors.lastName && <p className="text-xs text-red-500">{fieldErrors.lastName}</p>}
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[2.5vw] md:text-sm font-medium text-brand-text/80">Phone Number *</label>
                                    <input 
                                        name="phone" 
                                        value={formData.phone}
                                        onChange={handleChange} 
                                        type="tel" 
                                        placeholder="0000000000"
                                        className={cn("w-full p-2 md:p-3 bg-brand-primary border rounded-lg focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary outline-none transition-all", fieldErrors.phone ? "border-red-500" : "border-brand-text/10")} 
                                        required
                                    />
                                    {fieldErrors.phone && <p className="text-xs text-red-500">{fieldErrors.phone}</p>}
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[2.5vw] md:text-sm font-medium text-brand-text/80">Address *</label>
                                    <input 
                                        name="address" 
                                        value={formData.address}
                                        onChange={handleChange} 
                                        type="text" 
                                        className={cn("w-full p-2 md:p-3 bg-brand-primary border rounded-lg focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary outline-none transition-all", fieldErrors.address ? "border-red-500" : "border-brand-text/10")} 
                                        required
                                    />
                                    {fieldErrors.address && <p className="text-xs text-red-500">{fieldErrors.address}</p>}
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[2.5vw] md:text-sm font-medium text-brand-text/80">City *</label>
                                    <input 
                                        name="city" 
                                        value={formData.city}
                                        onChange={handleChange} 
                                        type="text" 
                                        className={cn("w-full p-2 md:p-3 bg-brand-primary border rounded-lg focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary outline-none transition-all", fieldErrors.city ? "border-red-500" : "border-brand-text/10")} 
                                        required
                                    />
                                    {fieldErrors.city && <p className="text-xs text-red-500">{fieldErrors.city}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[2.5vw] md:text-sm font-medium text-brand-text/80">State *</label>
                                        <StateSelector 
                                            value={formData.state}
                                            onChange={handleStateChange}
                                            error={fieldErrors.state}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[2.5vw] md:text-sm font-medium text-brand-text/80">ZIP Code *</label>
                                        <input 
                                            name="zipCode" 
                                            value={formData.zipCode}
                                            onChange={handleChange} 
                                            type="text" 
                                            className={cn("w-full p-2 md:p-3 bg-brand-primary border rounded-lg focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary outline-none transition-all", fieldErrors.zipCode ? "border-red-500" : "border-brand-text/10")} 
                                            required
                                        />
                                        {fieldErrors.zipCode && <p className="text-xs text-red-500">{fieldErrors.zipCode}</p>}
                                    </div>
                                </div>
                                
                                <div className="space-y-1">
                                    <label className="text-[2.5vw] md:text-sm font-medium text-brand-text/80">Note (Optional)</label>
                                    <input 
                                        name="note" 
                                        value={formData.note}
                                        onChange={handleChange} 
                                        type="text" 
                                        className="w-full p-2 md:p-3 bg-brand-primary border border-brand-text/10 rounded-lg focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary outline-none transition-all" 
                                    />
                                </div>
                            </form>
                        </div>
                        
                        {/* Order Summary */}
                        <div className="bg-brand-primary p-4 md:p-8 rounded-lg h-fit">
                            <h2 className="text-[5vw] md:text-2xl font-serif font-medium text-brand-text mb-6">Your Order</h2>
                            
                            <div className="space-y-4 border-b border-brand-text/10 pb-4">
                                {cartDetails.map(item => (
                                    <div key={item.id} className="flex items-center gap-4">
                                        <img src={item.image} alt={item.name} className="w-12 h-16 md:w-16 md:h-20 object-cover bg-white rounded-lg" />
                                        <div className="flex-grow">
                                            <h3 className="text-[3vw] md:text-base font-serif font-bold text-brand-text">{item.name}</h3>
                                            <p className="text-[2.5vw] md:text-sm text-brand-text/70">Quantity: {item.quantity}</p>
                                        </div>
                                        <p className="font-medium text-brand-text text-[3vw] md:text-base">${(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="space-y-2 border-b border-brand-text/10 py-4">
                                <div className="flex justify-between text-brand-text/80 text-[3vw] md:text-base">
                                    <span>Subtotal</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                 <div className="flex justify-between text-brand-text/80 text-[3vw] md:text-base">
                                    <span>Shipping</span>
                                    <span>${shipping.toFixed(2)}</span>
                                </div>
                            </div>
                            
                             <div className="flex justify-between text-brand-text font-bold text-[4vw] md:text-xl py-4">
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
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
                                className="w-full mt-4 h-12 bg-brand-secondary text-brand-bg font-medium tracking-wide hover:opacity-90 transition-opacity rounded-lg flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    'Place Order (COD)'
                                )}
                            </button>
                            <p className="text-xs text-brand-text/60 text-center mt-2">Payment will be collected upon delivery.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
