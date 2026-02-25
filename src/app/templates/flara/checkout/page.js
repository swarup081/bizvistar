'use client';

import { useContext, useState } from 'react';
import { useCart } from '../cartContext.js';
import { TemplateContext } from '../templateContext.js';
import { usePathname, useRouter } from 'next/navigation';
import { submitOrder } from '@/app/actions/orderActions';
import { Loader2, AlertCircle, Smartphone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { QRCodeSVG } from 'qrcode.react';

export default function CheckoutPage() {
    const { cartDetails, subtotal, shipping, total, openCart, clearCart } = useCart();
    const { businessData } = useContext(TemplateContext);

    // Swapped fields: No email. Added phone (required). Added note (optional).
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        phone: '', // Replaces email as primary contact
        note: ''   // Replaces old 'phone' slot
    });
    
    // Explicit field error state
    const [fieldErrors, setFieldErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [showUpi, setShowUpi] = useState(false);
    const [finalAmount, setFinalAmount] = useState(0);

    const pathname = usePathname();
    const router = useRouter();

    const isUPI = businessData?.payment?.mode === 'UPI';
    const upiId = businessData?.payment?.upiId;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (fieldErrors[name]) {
             setFieldErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.firstName.trim()) errors.firstName = "First name is required";
        if (!formData.lastName.trim()) errors.lastName = "Last name is required";
        if (!formData.phone.trim()) errors.phone = "Phone number is required"; // New Required Field
        
        // Strict phone validation (10 digits)
        const phoneRegex = /^\d{10}$/;
        if (formData.phone.trim() && !phoneRegex.test(formData.phone.trim())) {
             errors.phone = "Phone number must be exactly 10 digits";
        }

        if (!formData.address.trim()) errors.address = "Address is required";
        if (!formData.city.trim()) errors.city = "City is required";
        if (!formData.state.trim()) errors.state = "State is required";
        if (!formData.zipCode.trim()) errors.zipCode = "ZIP Code is required";
        
        // ZIP validation
        const zipRegex = /^\d{6}$/;
        if (formData.zipCode.trim() && !zipRegex.test(formData.zipCode.trim())) {
             errors.zipCode = "ZIP code must be exactly 6 digits";
        }

        // Note is optional
        
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

        const currentTotal = total;

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
                customerDetails: formData, // Contains phone, note, etc.
                totalAmount: total
            });

            if (result.success) {
                setMessage('Order placed successfully!');
                clearCart();
                if (isUPI) {
                    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                    if (isMobile) {
                        const link = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(businessData?.name || 'Store')}&am=${currentTotal}&cu=INR`;
                        window.location.href = link;
                    }
                    setFinalAmount(currentTotal);
                    setShowUpi(true);
                } else {
                    setTimeout(() => {
                        // Logic for success redirect could go here
                    }, 2000);
                }
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

    const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(businessData?.name || 'Store')}&am=${finalAmount}&cu=INR`;

    if (showUpi) {
        return (
            <div className="container mx-auto px-4 py-20 min-h-screen flex items-center justify-center">
                <div className="bg-brand-primary p-8 md:p-12 rounded-md max-w-md w-full text-center shadow-lg">
                    <div className="w-16 h-16 bg-brand-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Smartphone className="text-brand-secondary w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-serif text-brand-text mb-4">Order Placed!</h2>
                    <p className="text-brand-text/80 mb-8">Pay <span className="font-bold">₹{finalAmount.toFixed(2)}</span> via UPI.</p>

                    <div className="hidden md:block mb-8">
                        <div className="bg-white p-2 inline-block rounded-md shadow-sm">
                             <QRCodeSVG value={upiLink} size={200} />
                        </div>
                        <p className="text-xs text-brand-text/60 mt-2">Scan with any UPI App</p>
                    </div>

                    <a
                        href={upiLink}
                        className="md:hidden w-full bg-brand-secondary text-brand-bg py-4 rounded-md font-medium uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center justify-center gap-2 mb-4"
                    >
                        Pay Now
                    </a>

                    <p className="text-sm text-brand-text/60 bg-brand-bg/50 p-4 rounded-md">
                        {businessData?.footer?.paymentDisclaimer || "Payments are processed directly between you and the store owner. The owner may kindly request a payment screenshot for verification. Please note that Bizvistar does not facilitate transactions or charge commissions."}
                    </p>

                    <a href="shop" className="block mt-8 text-brand-text underline text-sm hover:opacity-70">
                        Return to Shop
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 md:px-6 py-10 md:py-20 max-w-7xl">
            <h1 className="text-3xl md:text-5xl font-bold text-brand-text font-serif text-center mb-8 md:mb-12">Checkout</h1>
            
            {cartDetails.length === 0 ? (
                <div className="text-center">
                    <p className="text-xl text-brand-text/80">Your cart is empty.</p>
                    <a 
                        href="shop" 
                        className="mt-8 inline-block bg-brand-secondary text-brand-bg px-8 py-3 font-semibold uppercase tracking-wider rounded-md"
                    >
                        Start Shopping
                    </a>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
                    
                    {/* Shipping Details Form */}
                    <div className="font-sans">
                        <div className="flex items-center gap-4 mb-6">
                             <h2 className="text-2xl font-serif font-semibold text-brand-text">Shipping Details</h2>
                        </div>
                        
                        {message && message.includes('fix') && (
                            <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-lg border border-red-200 flex items-start gap-2">
                                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                <span>{message}</span>
                            </div>
                        )}
                       
                        <form className="space-y-6" onSubmit={handlePlaceOrder}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-brand-text/80">First Name *</label>
                                    <input 
                                        name="firstName" 
                                        value={formData.firstName}
                                        onChange={handleChange} 
                                        type="text" 
                                        className={cn("w-full p-3 border rounded-md focus:ring-1 focus:ring-brand-secondary outline-none transition-all", fieldErrors.firstName ? "border-red-500" : "border-brand-text/30")} 
                                        required
                                    />
                                    {fieldErrors.firstName && <p className="text-xs text-red-500">{fieldErrors.firstName}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-brand-text/80">Last Name *</label>
                                    <input 
                                        name="lastName" 
                                        value={formData.lastName}
                                        onChange={handleChange} 
                                        type="text" 
                                        className={cn("w-full p-3 border rounded-md focus:ring-1 focus:ring-brand-secondary outline-none transition-all", fieldErrors.lastName ? "border-red-500" : "border-brand-text/30")} 
                                        required
                                    />
                                    {fieldErrors.lastName && <p className="text-xs text-red-500">{fieldErrors.lastName}</p>}
                                </div>
                            </div>

                            {/* Replaced Email with Phone Number */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-brand-text/80">Phone Number *</label>
                                <input 
                                    name="phone" 
                                    value={formData.phone}
                                    onChange={handleChange} 
                                    type="tel" 
                                    placeholder="0000000000"
                                    className={cn("w-full p-3 border rounded-md focus:ring-1 focus:ring-brand-secondary outline-none transition-all", fieldErrors.phone ? "border-red-500" : "border-brand-text/30")} 
                                    required
                                />
                                {fieldErrors.phone && <p className="text-xs text-red-500">{fieldErrors.phone}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-brand-text/80">Address *</label>
                                <input 
                                    name="address" 
                                    value={formData.address}
                                    onChange={handleChange} 
                                    type="text" 
                                    className={cn("w-full p-3 border rounded-md focus:ring-1 focus:ring-brand-secondary outline-none transition-all", fieldErrors.address ? "border-red-500" : "border-brand-text/30")} 
                                    required
                                />
                                {fieldErrors.address && <p className="text-xs text-red-500">{fieldErrors.address}</p>}
                            </div>

                             <div className="space-y-2">
                                <label className="text-sm font-semibold text-brand-text/80">City *</label>
                                <input 
                                    name="city" 
                                    value={formData.city}
                                    onChange={handleChange} 
                                    type="text" 
                                    className={cn("w-full p-3 border rounded-md focus:ring-1 focus:ring-brand-secondary outline-none transition-all", fieldErrors.city ? "border-red-500" : "border-brand-text/30")} 
                                    required
                                />
                                {fieldErrors.city && <p className="text-xs text-red-500">{fieldErrors.city}</p>}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-brand-text/80">State *</label>
                                    <input 
                                        name="state" 
                                        value={formData.state}
                                        onChange={handleChange} 
                                        type="text" 
                                        className={cn("w-full p-3 border rounded-md focus:ring-1 focus:ring-brand-secondary outline-none transition-all", fieldErrors.state ? "border-red-500" : "border-brand-text/30")} 
                                        required
                                    />
                                    {fieldErrors.state && <p className="text-xs text-red-500">{fieldErrors.state}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-brand-text/80">ZIP Code *</label>
                                    <input 
                                        name="zipCode" 
                                        value={formData.zipCode}
                                        onChange={handleChange} 
                                        type="text" 
                                        className={cn("w-full p-3 border rounded-md focus:ring-1 focus:ring-brand-secondary outline-none transition-all", fieldErrors.zipCode ? "border-red-500" : "border-brand-text/30")} 
                                        required
                                    />
                                    {fieldErrors.zipCode && <p className="text-xs text-red-500">{fieldErrors.zipCode}</p>}
                                </div>
                            </div>

                            {/* Replaced old Phone slot with Note */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-brand-text/80">Note (Optional)</label>
                                <input 
                                    name="note" 
                                    value={formData.note}
                                    onChange={handleChange} 
                                    type="text" 
                                    className="w-full p-3 border border-brand-text/30 rounded-md focus:ring-1 focus:ring-brand-secondary outline-none transition-all" 
                                />
                            </div>
                        </form>
                    </div>
                    
                    {/* Order Summary */}
                    <div className="bg-brand-primary p-5 md:p-8 h-fit rounded-lg shadow-sm border border-brand-text/10">
                        <h2 className="text-2xl font-serif font-semibold text-brand-text mb-6">Your Order</h2>
                        
                        <div className="space-y-4 border-b border-brand-text/20 pb-4">
                            {cartDetails.map(item => (
                                <div key={item.id} className="flex items-center gap-4">
                                    <img src={item.image} alt={item.name} className="w-16 h-20 object-cover bg-white rounded-sm" />
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
                            className="w-full mt-4 h-12 bg-brand-secondary text-brand-bg font-bold uppercase tracking-wider rounded-lg shadow-md hover:opacity-90 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
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
                        <p className="text-xs text-brand-text/60 text-center mt-3">
                            {isUPI
                                ? "You will be redirected to payment after placing order."
                                : "Payment will be collected upon delivery."
                            }
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
