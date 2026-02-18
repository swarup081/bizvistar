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
      price: 1250.00,
      category: 'rings',
      description: "A timeless solitaire diamond ring set in 18k white gold.",
      image: "/aurora/segal-jewelry-NsH-CvU0deg-unsplash.jpg"
    },
  
    { 
      id: 3, 
      name: "GOLD CUFF BRACELET", 
      price: 450.00,
      category: 'bracelets',
      description: "Handcrafted gold cuff bracelet with intricate detailing.",
      image: "/aurora/laura-guldner-rZjRXpDJUdw-unsplash.jpg"
    },
    { 
        id: 2, 
        name: "EMERALD CUT NECKLACE", 
        price: 890.00,
        category: 'necklaces',
        description: "Stunning emerald cut pendant suspended from a delicate gold chain.",
        image: "/aurora/jasmin-chew-WKD2vIe8Rb0-unsplash.jpg"
      },
    { 
      id: 4, 
      name: "PEARL DROP EARRINGS", 
      price: 299.00,
      category: 'earrings',
      description: "Classic pearl drop earrings that add a touch of sophistication.",
      image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800"
    },
    { 
        id: 5, 
        name: "RUBY STATEMENT RING", 
        price: 1450.00,
        category: 'rings',
        description: "A bold ruby centerpiece surrounded by crushed diamonds.",
        image: "https://images.unsplash.com/photo-1608042314453-ae338d80c427?auto=format&fit=crop&q=80&w=800"
    },
    { 
        id: 6, 
        name: "SAPPHIRE NECKLACE", 
        price: 1890.00,
        category: 'necklaces',
        description: "Deep blue sapphire pendant.",
        image: "/aurora/kotryna-juskaite-dlXBaYIQ5nY-unsplash.jpg"
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
        subtitle: "Welcome to a realm of timeless beauty and unparalleled craftsmanship. At Aurora, we invite you to adorn yourself in the finest expressions of luxury.",
        cta: "EXPLORE COLLECTIONS",
        // Large Arch Slideshow Images
        imageArch1: "/aurora/kamran-abdullayev-WQ-f4ux5xX0-unsplash.jpg",
        imageArch1_b: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=1000", 
        // Small Arch Image (Detail Shot)
        imageSmallArch: "/aurora/jasmin-chew-UBeNYvk6ED0-unsplash.jpg",
        stats: [
            { value: "12", label: "All over World" },
            { value: "150+", label: "Product Available" },
            { value: "1K+", label: "Product Reviews" }
        ]
    },

    features: [
        {
            title: "FAST SHIPPING",
            text: "Express delivery worldwide.",
            icon: "fast_shipping"
        },
        {
            title: "FLEXIBLE PAYMENT",
            text: "Multiple secure payment options.",
            icon: "card"
        },
        {
            title: "CERTIFIED GEMS", 
            text: "All gems are GIA certified authentic.",
            icon: "certified" 
        },
        {
            title: "ETHICAL SOURCING",
            text: "Conflict-free, sustainable stones.",
            icon: "ecology"
        }
    ],

    about: {
        title: "The Aurora Legacy",
        text: "Established in 2020, Aurora began as a humble atelier in the heart of the artisan district. For over a century, we have remained true to our founding principles: uncompromising quality, artistic innovation, and a deep respect for the gemstones we work with.",
        image: "https://images.unsplash.com/photo-1531995811006-35cb42e1a022?auto=format&fit=crop&q=80&w=1000",
    },

    collections: {
        title: "Curated Collections",
        subtitle: "Indulge in the opulence of handcrafted necklaces, bracelets, earrings, and rings, each a masterpiece in its own right.",
        itemIDs: [1, 6, 2]
    },

    testimonials: {
        title: "Client Experiences",
        items: [
            {
                quote: "The attention to detail is simply extraordinary. I've never felt more special wearing a piece of jewelry.",
                author: "Victoria Sterling",
                location: "London, UK"
            },
            {
                quote: "A beautiful collection for having diamond jewellery. Staff are quite friendly and helpful. It is a big showroom.",
                author: "Connie H. Tengan",
                location: "New York, USA"
            }
        ]
    },

    newsletterCta: {
        title: "Unlock Exclusive Access",
        text: "Sign up to receive invitations to private viewings, early access to new collections, and expert advice on building your jewelry heirloom.",
        placeholder: "Enter your email address",
        buttonText: "SUBSCRIBE NOW"
    },

    instagram: {
        title: "@aurora_official",
        handle: "Follow our journey",
        images: [
            "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=400",
            "https://images.unsplash.com/photo-1608042314453-ae338d80c427?auto=format&fit=crop&q=80&w=400",
            "/aurora/tara-yates-ZL7JpQ3d1Yk-unsplash.jpg",
            "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&q=80&w=400",
            "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=400",
            "/aurora/tina-park-4_1qfH3ds4M-unsplash.jpg"
        ]
    },

    faq: {
        title: "Frequently Asked Questions",
        subtitle: "Quick answers to the questions our Insta fam asks the most!",
        questions: [
            { 
                q: "Is your jewelry suitable for daily wear?", 
                a: "Absolutely! Our pieces are lightweight, skin-friendly, and designed for everyday styling." 
            },
            { 
                q: "Will the color fade over time?", 
                a: "Our jewelry is premium-plated and long-lasting. Just keep it away from water, perfume, and sweat for best durability." 
            },
            { 
                q: "How do I take care of my jewelry?", 
                a: "Wipe it with a soft cloth after use and store it in an airtight pouch. Avoid moisture to keep the shine intact." 
            },
            { 
                q: "Do you offer COD or online payments?", 
                a: "Yes! We support secure online payments and Cash on Delivery in most locations." 
            }
        ]
    },

    footer: {
        description: "A legacy of brilliance, crafted for eternity.",
        subscribe: {
            title: "Be the first to know our news",
            cta: "SUBMIT"
        },
        copyright: "© 2026 Aurora. All rights reserved.",
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
                { name: "Cookie Policy", url: "#" }
            ]
        }
    }
};