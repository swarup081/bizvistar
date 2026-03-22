"use client";

import React, { useState, useEffect } from 'react';
import { X, Gift } from 'lucide-react';
import { getOffers, recordOfferClaim } from '@/app/actions/boostActions';

export default function OfferPopup({ websiteId, websiteData }) {
    const [isOpen, setIsOpen] = useState(false);
    const [featuredOffer, setFeaturedOffer] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isClaimed, setIsClaimed] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const checkOffer = async () => {
            // Only show if global showOffers is true or if explicitly allowed (assuming we want to show popups regardless if it's featured)
            // But let's fetch to see if any is featured
            const { success, data } = await getOffers(websiteId);
            if (success && data) {
                const featured = data.find(o => o.is_featured && o.is_active);
                if (featured) {
                    // Check local storage to prevent annoying the user
                    const hasSeen = localStorage.getItem(`offer_seen_${websiteId}_${featured.id}`);
                    const hasClaimed = localStorage.getItem(`offer_claimed_${websiteId}_${featured.id}`);

                    if (!hasClaimed) {
                        setFeaturedOffer(featured);
                        // Delay popup by 3 seconds
                        setTimeout(() => {
                            if (!hasSeen) {
                                setIsOpen(true);
                                localStorage.setItem(`offer_seen_${websiteId}_${featured.id}`, 'true');
                            } else {
                                // Maybe they closed it, don't auto-show again, but could provide a floating button
                            }
                        }, 3000);
                    }
                }
            }
        };

        if (websiteId) {
            checkOffer();
        }
    }, [websiteId]);

    const handleClaim = async (e) => {
        e.preventDefault();
        setError('');

        if (!phoneNumber || phoneNumber.length !== 10 || !/^\d+$/.test(phoneNumber)) {
            setError('Please enter a valid 10-digit phone number');
            return;
        }

        setLoading(true);
        const { success } = await recordOfferClaim(websiteId, featuredOffer.id, phoneNumber);
        setLoading(false);

        if (success) {
            setIsClaimed(true);
            localStorage.setItem(`offer_claimed_${websiteId}_${featuredOffer.id}`, 'true');
        } else {
            setError('Failed to claim offer. Please try again.');
        }
    };

    if (!featuredOffer || !isOpen) return null;

    // Use website theme colors if available
    const themeColor = websiteData?.theme?.primary || '#8A63D2';

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Close Button */}
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 z-10 p-1 bg-white/50 rounded-full"
                >
                    <X size={20} />
                </button>

                {/* Header Graphic */}
                <div
                    className="h-32 flex items-center justify-center relative overflow-hidden"
                    style={{ backgroundColor: themeColor }}
                >
                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                    <Gift size={48} className="text-white relative z-10 animate-bounce" />
                </div>

                <div className="p-8 text-center">
                    {!isClaimed ? (
                        <>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Special Offer!</h2>
                            <p className="text-gray-600 mb-6">
                                Get <strong style={{ color: themeColor }}>{featuredOffer.type === 'percentage' ? `${featuredOffer.value}% OFF` : `₹${featuredOffer.value} OFF`}</strong> your next order. Enter your phone number to reveal the coupon code.
                            </p>

                            <form onSubmit={handleClaim} className="space-y-4">
                                <div>
                                    <input
                                        type="tel"
                                        placeholder="Phone Number (10 digits)"
                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-center text-lg focus:ring-2 focus:border-transparent outline-none transition-all"
                                        style={{ '--tw-ring-color': themeColor }}
                                        value={phoneNumber}
                                        onChange={e => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                    />
                                </div>
                                {error && <p className="text-red-500 text-sm">{error}</p>}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full text-white font-bold py-3 rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-70"
                                    style={{ backgroundColor: themeColor }}
                                >
                                    {loading ? 'Claiming...' : 'Reveal Code'}
                                </button>
                            </form>
                            <p className="text-xs text-gray-400 mt-4">By claiming, you agree to receive order updates.</p>
                        </>
                    ) : (
                        <div className="animate-in slide-in-from-bottom-4">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">You're In!</h2>
                            <p className="text-gray-600 mb-6">Use the code below at checkout.</p>

                            <div className="bg-gray-50 border-2 border-dashed rounded-xl p-4 mb-6 relative group" style={{ borderColor: themeColor }}>
                                <p className="text-3xl font-mono font-black uppercase tracking-widest" style={{ color: themeColor }}>
                                    {featuredOffer.code}
                                </p>
                            </div>

                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl shadow-md hover:bg-gray-800 transition-colors"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
