'use client';

// Define styles here so they are editable
const styleConfig = {
    colors: {
        primary: "#1A1A1A",       // Dark Charcoal (Headings, Text)
        secondary: "#D4AF37",     // Gold (Accents, Buttons)
        background: "#F9F8F6",    // Cream/Off-White (Main Background)
        surface: "#FFFFFF",       // Pure White (Cards, Sections)
        textLight: "#666666",     // Grey (Subtitles)
        footerBg: "#111111",      // Dark Footer
        footerText: "#EEEEEE"     // Light Footer Text
    },
    fonts: {
        heading: "Playfair Display", // Luxury Serif
        body: "Lato"                 // Clean Sans-serif
    }
};

const categories = [
    { id: 'rings', name: 'Rings' },
    { id: 'necklaces', name: 'Necklaces' },
    { id: 'bracelets', name: 'Bracelets' },
    { id: 'earrings', name: 'Earrings' },
];

const allProducts = [
    { 
      id: 1, 
      name: "SOLITAIRE DIAMOND RING", 
      price: 48500.00,
      category: 'rings',
      description: "A timeless solitaire diamond ring set in 18k white gold, handcrafted by master artisans.",
      image: "https://res.cloudinary.com/drg4lzk9s/image/upload/f_auto,q_auto,w_800/v1775893574/bizvistar/aurora/segal-jewelry-NsH-CvU0deg-unsplash.jpg"
    },
  
    { 
      id: 3, 
      name: "GOLD CUFF BRACELET", 
      price: 18500.00,
      category: 'bracelets',
      description: "Handcrafted gold cuff bracelet with intricate Rajasthani filigree detailing.",
      image: "https://res.cloudinary.com/drg4lzk9s/image/upload/f_auto,q_auto,w_800/v1775893569/bizvistar/aurora/laura-guldner-rZjRXpDJUdw-unsplash.jpg"
    },
    { 
        id: 2, 
        name: "EMERALD CUT NECKLACE", 
        price: 35900.00,
        category: 'necklaces',
        description: "Stunning emerald cut pendant suspended from a delicate gold chain, perfect for special occasions.",
        image: "https://res.cloudinary.com/drg4lzk9s/image/upload/f_auto,q_auto,w_800/v1775893564/bizvistar/aurora/jasmin-chew-WKD2vIe8Rb0-unsplash.jpg"
      },
    { 
      id: 4, 
      name: "PEARL DROP EARRINGS", 
      price: 12900.00,
      category: 'earrings',
      description: "Classic pearl drop earrings that add a touch of sophistication to any ensemble.",
      image: "https://res.cloudinary.com/drg4lzk9s/image/upload/f_auto,q_auto,w_800/v1775893548/bizvistar/aurora/auroraprodcutid4.avif"
    },
    { 
        id: 5, 
        name: "RUBY STATEMENT RING", 
        price: 62500.00,
        category: 'rings',
        description: "A bold Burmese ruby centerpiece surrounded by ethically sourced crushed diamonds.",
        image: "https://res.cloudinary.com/drg4lzk9s/image/upload/f_auto,q_auto,w_800/v1775893550/bizvistar/aurora/auroraprodcutid5.avif"
    },
    { 
        id: 6, 
        name: "SAPPHIRE NECKLACE", 
        price: 78900.00,
        category: 'necklaces',
        description: "Deep blue Ceylon sapphire pendant, certified and set in 22k gold.",
        image: "https://res.cloudinary.com/drg4lzk9s/image/upload/f_auto,q_auto,w_800/v1775893568/bizvistar/aurora/kotryna-juskaite-dlXBaYIQ5nY-unsplash.jpg"
    },
];

export const businessData = {
    // --- Global Configuration ---
    name: "AURORA", // Changed from Aurora
    logoUrl: "",    // Leave empty to use the name as text, or paste an image URL here
    styleConfig: styleConfig, // Inject styles
    categories: categories,
    allProducts: allProducts,
    
    pages: [
      { name: 'Home', path: '' },
      { name: 'Shop', path: '/shop' },
      { name: 'Checkout', path: '/checkout' }
    ],

    // IDs for Editor Focus
    heroSectionId: "hero",
    aboutSectionId: "story",
    collectionSectionId: "collection",
    featuresSectionId: "features",
    testimonialsSectionId: "testimonials",
    instagramSectionId: "instagram",
    faqSectionId: "faq",
    blogSectionId: "blog",
    ctaSectionId: "cta", 
    footerSectionId: "footer",

    navigation: {
        main: [
            { href: "", label: "HOME" },
            { href: "/shop", label: "SHOP" },
        ],
        secondary: []
    },

    hero: {
        title: "Desire Meets New Style",
        subtitle: "Step into a world of timeless elegance and unparalleled craftsmanship. Every piece tells a story of heritage, artistry, and enduring beauty.",
        cta: "EXPLORE COLLECTIONS",
        // Large Arch Slideshow Images
        imageArch1: "https://res.cloudinary.com/drg4lzk9s/image/upload/f_auto,q_auto,w_800/v1775893565/bizvistar/aurora/kamran-abdullayev-WQ-f4ux5xX0-unsplash.jpg",
        imageArch1_b: "https://res.cloudinary.com/drg4lzk9s/image/upload/f_auto,q_auto,w_800/v1775893571/bizvistar/aurora/photo-1573408301185-9146fe634ad0.avif", 
        // Small Arch Image (Detail Shot)
        imageSmallArch: "https://res.cloudinary.com/drg4lzk9s/image/upload/f_auto,q_auto,w_800/v1775893562/bizvistar/aurora/jasmin-chew-UBeNYvk6ED0-unsplash.jpg",
        stats: [
            { value: "12", label: "Cities in India" },
            { value: "150+", label: "Handcrafted Designs" },
            { value: "1K+", label: "Customer Reviews" }
        ]
    },

    features: [
        {
            title: "NATIONWIDE SHIPPING",
            text: "Free express delivery across all regions.",
            icon: "fast_shipping"
        },
        {
            title: "FLEXIBLE PAYMENT",
            text: "UPI, cards, wallets & EMI options available at checkout.",
            icon: "card"
        },
        {
            title: "CERTIFIED QUALITY", 
            text: "All our products are certified for authenticity and premium quality.",
            icon: "certified" 
        },
        {
            title: "ETHICAL SOURCING",
            text: "Conflict-free materials, responsibly and sustainably sourced.",
            icon: "ecology"
        }
    ],

    about: {
        title: "Our Legacy",
        text: "Established with a vision for excellence, we began as a small boutique. Rooted in centuries of tradition, we blend time-honoured techniques with contemporary design — creating heirloom pieces that transcend generations.",
        image: "https://res.cloudinary.com/drg4lzk9s/image/upload/f_auto,q_auto,w_800/v1775893544/bizvistar/aurora/auroraaboutimage.avif",
    },

    collections: {
        title: "Curated Collections",
        subtitle: "Indulge in the opulence of handcrafted necklaces, bracelets, earrings, and rings — each a masterpiece born from India's finest goldsmithing traditions.",
        itemIDs: [1, 6, 2]
    },

    testimonials: {
        title: "Client Experiences",
        items: [
            {
                quote: "The craftsmanship is extraordinary. My engagement ring from Aurora is the most stunning piece I've ever owned — truly world-class quality.",
                author: "Priya Sharma",
                location: "Mumbai, Maharashtra"
            },
            {
                quote: "A beautiful collection of diamond jewellery. The showroom in Connaught Place is stunning, and the staff made me feel so special during my visit.",
                author: "Ananya Reddy",
                location: "New Delhi"
            }
        ]
    },

    newsletterCta: {
        title: "Unlock Exclusive Access",
        text: "Sign up to receive invitations to private viewings, early access to new collections, and expert advice on building your jewellery heirloom.",
        placeholder: "Enter your email address",
        buttonText: "SUBSCRIBE NOW"
    },

    instagram: {
        title: "@aurora_jewels",
        handle: "Follow our journey",
        images: [
            "https://res.cloudinary.com/drg4lzk9s/image/upload/f_auto,q_auto,w_400/v1775893545/bizvistar/aurora/auroraig1.avif",
            "https://res.cloudinary.com/drg4lzk9s/image/upload/f_auto,q_auto,w_400/v1775893546/bizvistar/aurora/auroraig2.avif",
            "https://res.cloudinary.com/drg4lzk9s/image/upload/f_auto,q_auto,w_400/v1775893578/bizvistar/aurora/tara-yates-ZL7JpQ3d1Yk-unsplash.jpg",
            "https://res.cloudinary.com/drg4lzk9s/image/upload/f_auto,q_auto,w_400/v1775893547/bizvistar/aurora/auroraig3.avif",
            "https://res.cloudinary.com/drg4lzk9s/image/upload/f_auto,q_auto,w_400/v1775893548/bizvistar/aurora/auroraprodcutid4.avif",
            "https://res.cloudinary.com/drg4lzk9s/image/upload/f_auto,q_auto,w_400/v1775893581/bizvistar/aurora/tina-park-4_1qfH3ds4M-unsplash.jpg"
        ]
    },

    faq: {
        title: "Frequently Asked Questions",
        subtitle: "Quick answers to everything our customers ask the most!",
        questions: [
            { 
                q: "Is your jewellery suitable for daily wear?", 
                a: "Absolutely! Our pieces are lightweight, skin-friendly, and designed for everyday styling." 
            },
            { 
                q: "Will the colour fade over time?", 
                a: "Our jewellery is premium-plated and long-lasting. Just keep it away from water, perfume, and sweat for best durability." 
            },
            { 
                q: "How do I take care of my jewellery?", 
                a: "Wipe it with a soft cloth after use and store it in an airtight pouch. Avoid moisture to keep the shine intact." 
            },
            { 
                q: "Do you offer COD or online payments?", 
                a: "Yes! We support UPI, cards, net banking, and Cash on Delivery across most Indian pincodes." 
            }
        ]
    },

    footer: {
        description: "A legacy of brilliance, handcrafted in India for eternity.",
        subscribe: {
            title: "Be the first to know our news",
            cta: "SUBMIT"
        },
        copyright: "© 2026 Aurora Jewels. All rights reserved.",
        links: {
            main: [
                { name: "Home", url: "" },
                { name: "About", url: "#story" },
                { name: "Shop", url: "/shop" },
                { name: "Journal", url: "#blog" }
            ],
            utility: [
                { name: "Terms & Conditions", url: "#" },
                { name: "Privacy Policy", url: "#" },
                { name: "Shipping & Returns", url: "#" }
            ]
        }
    }
};