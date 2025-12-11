'use client';
import { useCart } from '../cartContext.js';

export default function Checkout() {
    const { cartDetails, total } = useCart();
    return (
        <div className="container mx-auto px-6 py-24 max-w-4xl">
            <h1 className="text-4xl font-serif mb-12 text-center">Checkout</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                    <h2 className="text-xl font-bold uppercase tracking-widest mb-6">Billing Details</h2>
                    <form className="space-y-4">
                        <input type="text" placeholder="Full Name" className="w-full border p-3 outline-none focus:border-black" />
                        <input type="email" placeholder="Email" className="w-full border p-3 outline-none focus:border-black" />
                        <input type="text" placeholder="Address" className="w-full border p-3 outline-none focus:border-black" />
                        <div className="grid grid-cols-2 gap-4">
                            <input type="text" placeholder="City" className="w-full border p-3 outline-none focus:border-black" />
                            <input type="text" placeholder="Zip Code" className="w-full border p-3 outline-none focus:border-black" />
                        </div>
                    </form>
                </div>
                <div className="bg-gray-50 p-8 h-fit">
                    <h2 className="text-xl font-bold uppercase tracking-widest mb-6">Your Order</h2>
                    <div className="space-y-4 mb-6 border-b border-gray-200 pb-6">
                        {cartDetails.map(item => (
                            <div key={item.id} className="flex justify-between">
                                <span>{item.name} x {item.quantity}</span>
                                <span>${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between text-xl font-bold mb-8">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                    <button className="w-full bg-black text-white py-4 uppercase tracking-widest font-bold">Place Order</button>
                </div>
            </div>
        </div>
    );
}