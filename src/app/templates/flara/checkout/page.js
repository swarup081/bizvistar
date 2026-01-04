'use client';

import { useCart } from '../cartContext.js';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { submitOrder } from '@/app/actions/orderActions'; // Adjust path if necessary

export default function CheckoutPage() {
    const { cartDetails, subtotal, shipping, total, openCart, clearCart } = useCart();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        phone: '',
        email: '' // Added email field
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const pathname = usePathname();
    const router = useRouter();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage('');

        try {
            // Extract slug from URL (e.g. /site/myslug/checkout)
            // Or rely on the 'slug' passed in via props if this was a server component, but here we are client.
            // Safe bet: parse pathname
            const pathParts = pathname.split('/');
            // Expected formats: 
            // 1. /site/[slug]/checkout
            // 2. /templates/flara/checkout (Preview mode) - Handle this!
            
            let siteSlug = null;
            if (pathParts[1] === 'site') {
                siteSlug = pathParts[2];
            } else {
                // In template preview mode, we can't really save to a specific user site unless we mock it or use a query param.
                // However, the user wants "pseudo orders".
                // We'll throw an error if not on a published site, OR fallback to a demo site if exists.
                // Better: Check if we can find a slug.
                 console.warn("Checkout is running in preview/template mode. Order might fail if not linked to a real site.");
                 // For now, let's assume we are testing on a "deployed" site or the wrapper passes context.
                 // Actually, looking at `src/app/site/[slug]/checkout/page.js`, it renders this component.
                 // But this component doesn't receive props.
                 // We need to parse the URL.
            }

            if (!siteSlug && pathParts[1] !== 'site') {
                 // Fallback for development/testing directly on /templates/flara/checkout
                 // We can't really submit an order without a website ID.
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
                // Redirect to success or home
                setTimeout(() => {
                    // router.push(`/site/${siteSlug}/shop`); // Redirect to shop
                    // For now just show success
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
        <div className="container mx-auto px-6 py-20">
            <h1 className="text-5xl font-bold text-brand-text font-serif text-center mb-12">Checkout</h1>
            
            {cartDetails.length === 0 ? (
                <div className="text-center">
                    <p className="text-xl text-brand-text/80">Your cart is empty.</p>
                    <a 
                        href="shop" // Relative link works for both /site/slug/shop and /templates/flara/shop
                        className="mt-8 inline-block bg-brand-secondary text-brand-bg px-8 py-3 font-semibold uppercase tracking-wider"
                    >
                        Start Shopping
                    </a>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    
                    {/* Shipping Details Form */}
                    <div className="font-sans">
                        <h2 className="text-2xl font-serif font-semibold text-brand-text mb-6">Shipping Details</h2>
                        <form className="space-y-4" onSubmit={handlePlaceOrder}>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-brand-text/80 mb-1">First Name</label>
                                    <input required name="firstName" onChange={handleChange} type="text" className="w-full p-3 border border-brand-text/30 focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-brand-text/80 mb-1">Last Name</label>
                                    <input required name="lastName" onChange={handleChange} type="text" className="w-full p-3 border border-brand-text/30 focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary outline-none" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-brand-text/80 mb-1">Email</label>
                                <input required name="email" onChange={handleChange} type="email" className="w-full p-3 border border-brand-text/30 focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-brand-text/80 mb-1">Address</label>
                                <input required name="address" onChange={handleChange} type="text" className="w-full p-3 border border-brand-text/30 focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary outline-none" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-brand-text/80 mb-1">City</label>
                                <input required name="city" onChange={handleChange} type="text" className="w-full p-3 border border-brand-text/30 focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary outline-none" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-brand-text/80 mb-1">State</label>
                                    <input required name="state" onChange={handleChange} type="text" className="w-full p-3 border border-brand-text/30 focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-brand-text/80 mb-1">ZIP Code</label>
                                    <input required name="zipCode" onChange={handleChange} type="text" className="w-full p-3 border border-brand-text/30 focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary outline-none" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-brand-text/80 mb-1">Phone</label>
                                <input required name="phone" onChange={handleChange} type="tel" className="w-full p-3 border border-brand-text/30 focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary outline-none" />
                            </div>
                        </form>
                    </div>
                    
                    {/* Order Summary */}
                    <div className="bg-brand-primary p-8 h-fit">
                        <h2 className="text-2xl font-serif font-semibold text-brand-text mb-6">Your Order</h2>
                        
                        <div className="space-y-4 border-b border-brand-text/20 pb-4">
                            {cartDetails.map(item => (
                                <div key={item.id} className="flex items-center gap-4">
                                    <img src={item.image} alt={item.name} className="w-16 h-20 object-cover bg-white" />
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
                        
                        {message && (
                            <div className={`p-3 rounded mb-4 text-sm ${message.includes('success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {message}
                            </div>
                        )}

                        <button 
                            onClick={handlePlaceOrder}
                            disabled={isSubmitting}
                            className="w-full mt-4 h-12 bg-brand-secondary text-brand-bg font-semibold uppercase tracking-wider hover:opacity-80 transition-opacity disabled:opacity-50"
                        >
                            {isSubmitting ? 'Processing...' : 'Place Order (COD)'}
                        </button>
                        <p className="text-xs text-brand-text/60 text-center mt-2">Payment will be collected upon delivery.</p>
                    </div>
                </div>
            )}
        </div>
    );
}
