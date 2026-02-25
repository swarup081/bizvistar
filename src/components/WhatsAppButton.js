'use client';

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
            className="fixed bottom-6 right-6 z-[9999] bg-[#25D366] p-3 rounded-full shadow-lg hover:bg-[#20bd5a] hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center overflow-hidden"
            aria-label="Chat on WhatsApp"
        >
            <img
                src="/whatsappicon.png"
                alt="WhatsApp"
                className="w-8 h-8 object-contain"
            />
        </a>
    );
}
