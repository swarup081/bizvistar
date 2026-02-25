'use client';

import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton({ businessData }) {
    if (!businessData?.whatsappNumber || !businessData?.enableWhatsApp) return null;

    // Ensure number is clean
    const rawNumber = businessData.whatsappNumber.replace(/\D/g, '');

    // If 10 digits, assume India (+91)
    const formattedNumber = rawNumber.length === 10 ? `91${rawNumber}` : rawNumber;

    const whatsappUrl = `https://wa.me/${formattedNumber}`;

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-[9999] p-4 bg-[#25D366] text-white rounded-full shadow-lg hover:bg-[#20bd5a] hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center"
            aria-label="Chat on WhatsApp"
        >
            <MessageCircle size={28} fill="white" className="text-white" />
        </a>
    );
}
