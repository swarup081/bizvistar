// --- NEW DYNAMIC CATEGORIES ---
const categories = [
    { id: 'c1', name: 'Coffee' },
    { id: 'c2', name: 'Pastries' },
    { id: 'c3', name: 'Specialty Drinks' },
    { id: 'c4', name: 'Light Bites' },
];

// --- NEW MASTER PRODUCT LIST ---
// I've combined 'menu.items' and 'specialty.items' into a master list.
const allProducts = [
    { 
        id: 1, 
        name: "Classic Espresso", 
        price: 199.00, 
        category: 'c1', 
        image: "/blissly/specialty-espresso.jpg", // Placeholder, you can change this
        description: "A rich, full-bodied shot with bold notes of dark chocolate and citrus." 
    },
    { 
        id: 2, 
        name: "Creamy Cappuccino", 
        price: 249.00, 
        category: 'c1', 
        image: "https://res.cloudinary.com/drg4lzk9s/image/upload/f_auto,q_auto,w_800/v1775893436/bizvistar/blissly/esra-afsar-JqXUZxoLwlE-unsplash.jpg", // From original specialty
        description: "Perfectly balanced espresso, steamed milk, and a velvety cap of microfoam." 
    },
    { 
        id: 3, 
        name: "Artisanal Latte", 
        price: 279.00, 
        category: 'c1', 
        image: "https://res.cloudinary.com/drg4lzk9s/image/upload/f_auto,q_auto,w_800/v1775893437/bizvistar/blissly/hero_image.png", // Placeholder
        description: "Our signature espresso with velvety smooth steamed milk — a true crowd favourite." 
    },
    { 
        id: 4, 
        name: "Pour Over (V60)", 
        price: 329.00, 
        category: 'c3', 
        image: "https://res.cloudinary.com/drg4lzk9s/image/upload/f_auto,q_auto,w_800/v1775893442/bizvistar/blissly/john-amachaab-z0IktCV6PAg-unsplash.jpg", // From original events
        description: "A clean, bright cup highlighting our single-origin beans sourced from Coorg plantations." 
    },
    { 
        id: 5, 
        name: "Butter Croissant", 
        price: 179.00,
        category: 'c2', 
        image: "https://res.cloudinary.com/drg4lzk9s/image/upload/f_auto,q_auto,w_800/v1775893454/bizvistar/blissly/vicky-nguyen-a4xoMVKzbak-unsplash.jpg", // From original specialty
        description: "Flaky, golden, and baked fresh every morning with European-style butter." 
    },
    { 
        id: 6, 
        name: "Avocado Toast", 
        price: 349.00, 
        category: 'c4', 
        image: "https://res.cloudinary.com/drg4lzk9s/image/upload/f_auto,q_auto,w_800/v1775893445/bizvistar/blissly/keghan-crossland-ZZxmc66SjfM-unsplash.jpg", // From original about
        description: "Sourdough toast with fresh avocado, chili flakes, and Himalayan pink salt." 
    },
    { 
        id: 7, 
        name: "Assorted Cookies", 
        price: 149.00, 
        category: 'c2', 
        image: "https://res.cloudinary.com/drg4lzk9s/image/upload/f_auto,q_auto,w_800/v1775893433/bizvistar/blissly/caroline-badran-UvZiEu43tcQ-unsplash.jpg", // From original specialty
        description: "Freshly baked cookies in classic flavours — perfect alongside your coffee." 
    },
    { 
        id: 8, 
        name: "Matcha Green Tea Latte", 
        price: 299.00,
        category: 'c3', 
        image: "https://res.cloudinary.com/drg4lzk9s/image/upload/f_auto,q_auto,w_800/v1775893448/bizvistar/blissly/mustafa-akin-4fa1DuXBTKw-unsplash.jpg", // From original specialty
        description: "Premium ceremonial-grade matcha whisked with steamed milk for a smooth, earthy taste." 
    }
];


export const businessData = {
    // --- GENERAL BUSINESS INFO ---
    name: "Brewhaven",
    logoText: "Brewhaven",
    whatsappNumber: "91123456789", // Added for checkout

    // --- NEW: Master Lists ---
    categories: categories,
    allProducts: allProducts,

    // --- NEW: Page Definitions ---
    pages: [
        { name: 'Home', path: '' },
        { name: 'Shop', path: '/shop' },
        { name: 'Product (Example)', path: '/product/1' },
        { name: 'Checkout', path: '/checkout' }
    ],

    // --- THIS IS THE NEWLY ADDED BLOCK ---
    // Section IDs for Editor Navigation
    aboutSectionId: "about",
    eventsSectionId: "events",
    menuSectionId: "menu",
    testimonialsSectionId: "testimonials",
    bestSellersSectionId: "specialty", // Links "Products" accordion to the "Our Specialty" section
    collectionSectionId: "specialty", // <-- ADDED THIS LINE
    ctaSectionId: "cta-final", // Links "CTA" accordion to the "cta-final" section
    footerSectionId: "contact",
    // --- END OF NEW BLOCK ---

    // --- THEME SECTION ---
    theme: {
        colorPalette: 'elegant-botanics', 
        font: {
            heading: 'kalam',
            body: 'Lato'
        }
    },

    // --- NAVIGATION (UPDATED) ---
    navigation: [
        { href: "", label: "Home" },
        { href: "/shop", label: "Shop" },
        { href: "#about", label: "About" },
        { href: "#events", label: "Events" },
        { href: "#contact", label: "Contact" },
    ],

    // --- HEADER BUTTON ---
    headerButton: {
        text: "Order Online",
        href: "/shop" // Links to the new shop page
    },

    // --- PAGE SECTIONS (Original content preserved) ---
    hero: {
        title: "Where Every Moment is an Experience",
        subtitle: "Discover our passion for quality, expertly crafted products, and a space designed for you to connect, relax, and be inspired.",
        cta: "View Our Menu",
        image: "https://res.cloudinary.com/drg4lzk9s/image/upload/f_auto,q_auto,w_800/v1775893437/bizvistar/blissly/hero_image.png"
    },

    events: {
        title: "What's Happening",
        items: [
            {
                image: "https://res.cloudinary.com/drg4lzk9s/image/upload/f_auto,q_auto,w_800/v1775893451/bizvistar/blissly/valentin-ciccarone-YMihlfY0wcE-unsplash.jpg",
                title: "Live Community Events",
                text: "Join us every week for live events showcasing local talent. Enjoy great products and even better company."
            },
            {
                image: "https://res.cloudinary.com/drg4lzk9s/image/upload/f_auto,q_auto,w_800/v1775893442/bizvistar/blissly/john-amachaab-z0IktCV6PAg-unsplash.jpg",
                title: "Expert Workshops",
                text: "Unleash your creativity! Learn new skills directly from our experts. Sign up in-store!"
            },
            {
                image: "https://res.cloudinary.com/drg4lzk9s/image/upload/f_auto,q_auto,w_800/v1775893457/bizvistar/blissly/wtu-257-KaMWcrwimB4-unsplash.jpg",
                title: "Exclusive Previews",
                text: "A special event featuring our latest collections and offerings. Learn about our process and quality."
            }
        ]
    },
    
    about: {
        title: "Crafted with Passion",
        text: "Our brand was born from a simple idea: quality should be an experience, not just a routine. We partner with sustainable sources, focus on premium materials, and train our team to deliver perfection — every single time.",
        image: "https://res.cloudinary.com/drg4lzk9s/image/upload/f_auto,q_auto,w_800/v1775893445/bizvistar/blissly/keghan-crossland-ZZxmc66SjfM-unsplash.jpg",
        features: [
            {
                title: "Ethically Sourced",
                text: "We build direct, sustainable relationships with our partners to ensure exceptional quality."
            },
            {
                title: "In-House Quality",
                text: "Every product is carefully crafted and curated to bring out its unique, best features."
            },
            {
                title: "Community Focused",
                text: "A welcoming brand built for everyone to gather, create, and connect."
            }
        ]
    },

    menu: {
        badge: "Our Menu",
        title: "Crafted for You",
        description: "From our signature selections to our latest arrivals, there's always something to brighten your day.",
        // This list is now for display on the homepage, not the master list
        items: [
            { name: "Classic Espresso", price: "199", description: "A rich, full-bodied shot with bold notes of dark chocolate and citrus." },
            { name: "Creamy Cappuccino", price: "249", description: "Perfectly balanced espresso, steamed milk, and a velvety cap of microfoam." },
            { name: "Artisanal Latte", price: "279", description: "Our signature espresso with velvety smooth steamed milk." },
            { name: "Pour Over (V60)", price: "329", description: "A clean, bright cup highlighting our single-origin beans from Coorg." },
            { name: "Butter Croissant", price: "179", description: "Flaky, golden, and baked fresh every morning." },
            { name: "Avocado Toast", price: "349", description: "Sourdough toast with fresh avocado, chili flakes, and Himalayan pink salt." }
        ],
        cta: "View Full Menu"
    },

    testimonials: {
        items: [
            {
                quote: "This is hands down my favourite café in the city. The coffee is consistently excellent and the atmosphere is incredibly warm and inviting!",
                name: "Sneha K.",
                title: "Graphic Designer"
            },
            {
                quote: "The best avocado toast I've had in Bangalore — and the baristas always remember my order. Feels like home.",
                name: "Rohit M.",
                title: "Remote Worker"
            },
            {
                quote: "I came for the latte art workshop and had the most amazing time. The staff are so knowledgeable and friendly. A true community gem!",
                name: "Isha T.",
                title: "College Student"
            }
        ]
    },

    // --- UPDATED to reference product IDs ---
    specialty: {
        title: "Our Specialty",
        itemIDs: [2, 7, 8, 5] // IDs from allProducts: Cappuccino, Cookies, Matcha, Croissant
    },

    cta: {
        title: "Let's get in touch!",
        text: "Have a question about our menu, events, or catering? We'd love to hear from you. Drop by or send us a message.",
        cta: "Contact Us"
    },

    // --- FOOTER ---
    footer: {
        promoTitle: "Join our mailing list",
        contact: {
            phone: "+91 98765 43210",
            email: "hello@brewhaven.in",
        },
        links: {
            pages: [
                { name: "Home", url: "" },
                { name: "Shop", url: "/shop" },
                { name: "About", url: "#about" },
                { name: "Events", url: "#events" }
            ],
            utility: [
                { name: "Style Guide", url: "#" },
                { name: "Changelog", url: "#" },
                { name: "Licenses", url: "#" }
            ]
        },
        location: {
            title: "Location",
            address: "42, Church Street, Ashok Nagar, Bengaluru, Karnataka 560001",
            hours: "Mon - Fri: 7am - 9pm\nSat - Sun: 8am - 10pm"
        },
        copyright: `© ${new Date().getFullYear()} Brewhaven. All Rights Reserved.`
    }
};