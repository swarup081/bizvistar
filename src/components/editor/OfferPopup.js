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

    // Extract template colors so the popup perfectly matches the website
    // Fallbacks to default dashboard colors if running standalone
    const bgColor = 'var(--color-bg, #ffffff)';
    const textColor = 'var(--color-text, #111827)';
    const textLightColor = 'var(--color-text-light, #6b7280)';
    const btnColor = 'var(--color-dark, #111827)';
    
    // Some templates use the primary/gold theme color for accents
    const accentColor = websiteData?.theme?.primary || 'var(--color-gold, #8A63D2)';

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div 
                className="rounded-2xl w-full max-w-sm shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300 border border-black/5"
                style={{ backgroundColor: bgColor }}
            >
                {/* Close Button */}
                <button 
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-4 z-10 p-1 rounded-full opacity-60 hover:opacity-100 transition-opacity"
                    style={{ color: textColor }}
                >
                    <X size={20} strokeWidth={1.5} />
                </button>

                <div className="p-8 text-center mt-2">
                    {!isClaimed ? (
                        <>
                            <h2 className="text-2xl font-bold mb-2 tracking-tight" style={{ color: textColor }}>Special Offer</h2>
                            <p className="mb-6 text-sm" style={{ color: textLightColor }}>
                                Unlock <strong style={{ color: accentColor }}>{featuredOffer.type === 'percentage' ? `${featuredOffer.value}% OFF` : `₹${featuredOffer.value} OFF`}</strong> your next order. Enter your phone number below to reveal the code.
                            </p>

                            <form onSubmit={handleClaim} className="space-y-4">
                                <div>
                                    <input 
                                        type="tel" 
                                        placeholder="Phone Number" 
                                        className="w-full border rounded-xl px-4 py-3 text-center text-base outline-none transition-all placeholder:text-gray-400 bg-white border-black/10 focus:border-black/30 shadow-sm"
                                        style={{ color: '#111827' }} // Explicitly forced to dark gray/black as requested
                                        value={phoneNumber}
                                        onChange={e => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                    />
                                </div>
                                {error && <p className="text-red-500 text-xs font-medium">{error}</p>}
                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    className="w-full text-white font-semibold py-3.5 rounded-xl transition-opacity disabled:opacity-70 text-sm tracking-wide"
                                    style={{ backgroundColor: btnColor }}
                                >
                                    {loading ? 'Claiming...' : 'Reveal Code'}
                                </button>
                            </form>
                            <p className="text-[10px] mt-5 uppercase tracking-widest opacity-60" style={{ color: textLightColor }}>
                                By claiming, you agree to receive updates.
                            </p>
                        </>
                    ) : (
                        <div className="animate-in slide-in-from-bottom-4 pt-4">
                            <h2 className="text-2xl font-bold mb-2" style={{ color: textColor }}>It's yours!</h2>
                            <p className="text-sm mb-6" style={{ color: textLightColor }}>Use this code at checkout to claim your discount.</p>
                            
                            <div className="border border-dashed rounded-xl p-5 mb-6 relative group bg-black/5" style={{ borderColor: 'rgba(0,0,0,0.1)' }}>
                                <p className="text-2xl font-mono font-bold uppercase tracking-widest" style={{ color: textColor }}>
                                    {featuredOffer.code}
                                </p>
                            </div>

                            <button 
                                onClick={() => setIsOpen(false)}
                                className="w-full text-white font-semibold py-3.5 rounded-xl transition-opacity text-sm tracking-wide"
                                style={{ backgroundColor: btnColor }}
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
