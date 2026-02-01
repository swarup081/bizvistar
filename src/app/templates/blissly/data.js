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
        price: 3.50, 
        category: 'c1', 
        image: "/blissly/specialty-espresso.jpg", // Placeholder, you can change this
        description: "A rich, full-bodied shot with notes of chocolate and citrus." 
    },
    { 
        id: 2, 
        name: "Creamy Cappuccino", 
        price: 4.50, 
        category: 'c1', 
        image: "/blissly/esra-afsar-JqXUZxoLwlE-unsplash.jpg", // From original specialty
        description: "Perfectly balanced espresso, steamed milk, and a cap of foam." 
    },
    { 
        id: 3, 
        name: "Artisanal Latte", 
        price: 5.00, 
        category: 'c1', 
        image: "/blissly/hero_image.png", // Placeholder
        description: "Our signature espresso with velvety smooth steamed milk." 
    },
    { 
        id: 4, 
        name: "Pour Over (V60)", 
        price: 5.50, 
        category: 'c3', 
        image: "/blissly/john-amachaab-z0IktCV6PAg-unsplash.jpg", // From original events
        description: "A clean, bright cup highlighting our single-origin of the day." 
    },
    { 
        id: 5, 
        name: "Croissant", 
        price: 35.00, // Price from specialty
        category: 'c2', 
        image: "/blissly/vicky-nguyen-a4xoMVKzbak-unsplash.jpg", // From original specialty
        description: "Flaky, buttery, and baked fresh every morning." 
    },
    { 
        id: 6, 
        name: "Avocado Toast", 
        price: 8.50, 
        category: 'c4', 
        image: "/blissly/keghan-crossland-ZZxmc66SjfM-unsplash.jpg", // From original about
        description: "Sourdough toast with fresh avocado, chili flakes, and sea salt." 
    },
    { 
        id: 7, 
        name: "Cookies", 
        price: 18.00, 
        category: 'c2', 
        image: "/blissly/caroline-badran-UvZiEu43tcQ-unsplash.jpg", // From original specialty
        description: "Assorted freshly baked cookies, perfect with a coffee." 
    },
    { 
        id: 8, 
        name: "Matcha Green Tea Latte", 
        price: 25.00, // Price from specialty
        category: 'c3', 
        image: "/blissly/mustafa-akin-4fa1DuXBTKw-unsplash.jpg", // From original specialty
        description: "Premium matcha powder whisked with steamed milk for a smooth, earthy taste." 
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
        title: "Where Every Sip is an Experience",
        subtitle: "Discover our passion for artisanal coffee, handcrafted pastries, and a space designed for you to relax, work, or connect.",
        cta: "View Our Menu",
        image: "/blissly/hero_image.png"
    },

    events: {
        title: "What's Brewing",
        items: [
            {
                image: "/blissly/valentin-ciccarone-YMihlfY0wcE-unsplash.jpg",
                title: "Live Acoustic Nights",
                text: "Join us every Friday evening for live music from local artists. Enjoy great coffee and even better company."
            },
            {
                image: "/blissly/john-amachaab-z0IktCV6PAg-unsplash.jpg",
                title: "Latte Art Workshop",
                text: "Unleash your inner barista. Learn the basics of latte art from our head barista. Sign up in-store!"
            },
            {
                image: "/blissly/wtu-257-KaMWcrwimB4-unsplash.jpg",
                title: "Meet the Roaster",
                text: "A special tasting event featuring our latest single-origin bean. Learn about the roasting process."
            }
        ]
    },
    
    about: {
        title: "From Bean to Cup, With Passion",
        text: "Brewhaven was born from a simple idea: coffee should be an experience, not just a routine. We partner with sustainable farms, roast our beans in-house, and train our baristas to pull the perfect shot, every time.",
        image: "/blissly/keghan-crossland-ZZxmc66SjfM-unsplash.jpg",
        features: [
            {
                title: "Ethically Sourced Beans",
                text: "We build direct relationships with farmers to ensure quality and fair compensation."
            },
            {
                title: "In-House Roasting",
                text: "Our beans are roasted fresh every week to bring out their unique, complex flavors."
            },
            {
                title: "Community Focused",
                text: "A welcoming space for everyone to gather, create, and connect."
            }
        ]
    },

    menu: {
        badge: "Our Menu",
        title: "Crafted for You",
        description: "From our signature espresso blends to freshly-baked pastries and light bites, there's something to brighten your day.",
        // This list is now for display on the homepage, not the master list
        items: [
            { name: "Classic Espresso", price: "3.50", description: "A rich, full-bodied shot with notes of chocolate and citrus." },
            { name: "Creamy Cappuccino", price: "4.50", description: "Perfectly balanced espresso, steamed milk, and a cap of foam." },
            { name: "Artisanal Latte", price: "5.00", description: "Our signature espresso with velvety smooth steamed milk." },
            { name: "Pour Over (V60)", price: "5.50", description: "A clean, bright cup highlighting our single-origin of the day." },
            { name: "Croissant", price: "3.00", description: "Flaky, buttery, and baked fresh every morning." },
            { name: "Avocado Toast", price: "8.50", description: "Sourdough toast with fresh avocado, chili flakes, and sea salt." }
        ],
        cta: "View Full Menu"
    },

    testimonials: {
        items: [
            {
                quote: "This is my absolute favorite spot. The coffee is consistently excellent and the atmosphere is so cozy and welcoming!",
                name: "Sarah K.",
                title: "Local Designer"
            },
            {
                quote: "The best avocado toast in the city, hands down. And the baristas always remember my order.",
                name: "Michael R.",
                title: "Remote Worker"
            },
            {
                quote: "I came for the latte art workshop and had a blast. The staff is so knowledgeable and friendly. A true community gem.",
                name: "Emily T.",
                title: "Student"
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
            phone: "+1 (123) 456-7890",
            email: "hello@brewhaven.com",
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
            address: "123 Coffee St, Bean Town, CA 90210",
            hours: "Mon - Fri: 7am - 6pm\nSat - Sun: 8am - 5pm"
        },
        copyright: `© ${new Date().getFullYear()} Brewhaven. All Rights Reserved.`
    }
};