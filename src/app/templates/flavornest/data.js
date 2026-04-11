// --- NEW DYNAMIC CATEGORIES ---
const categories = [
    { id: 'c1', name: 'Mithai (Sweets)' },
    { id: 'c2', name: 'Snacks & Savories' },
];

// --- NEW MASTER PRODUCT LIST ---
const allProducts = [
    { 
        id: 1, 
        name: "Kesar Mawa Modak", 
        description: "Classic steamed modaks filled with a rich, saffron-infused mawa (khoya) and dry fruits. A festive favourite. (Pre-order)", 
        price: 129, 
        unit: "6 Pieces", 
        image: "https://res.cloudinary.com/drg4lzk9s/image/upload/f_auto,q_auto,w_800/v1775893532/bizvistar/flavournestImage/modak_productimage.jpg", 
        category: 'c1' 
    },
    { 
        id: 2, 
        name: "Shahi Mawa Rolls", 
        description: "A royal treat, these rolls are crafted from mawa and premium dry fruits, delicately flavoured and perfect for celebrations. (Pre-order)", 
        price: 149, 
        unit: "4 Pieces", 
        image: "https://res.cloudinary.com/drg4lzk9s/image/upload/f_auto,q_auto,w_800/v1775893535/bizvistar/flavournestImage/shahi_mava_rolls_productimage.jpg", 
        category: 'c1' 
    },
    { 
        id: 3, // Changed from 4 to 3 for consistency
        name: "Milk Shondesh", 
        description: "A beloved Bengali sweet made from fresh chenna (paneer) and sugar — soft, melt-in-your-mouth perfection. (Pre-order)", 
        price: 109, 
        unit: "6 Pieces", 
        image: "https://res.cloudinary.com/drg4lzk9s/image/upload/f_auto,q_auto,w_800/v1775893526/bizvistar/flavournestImage/Sandesh_productimage.jpg", 
        category: 'c1' 
    },
    { 
        id: 4, // Changed from 5 to 4
        name: "Thekua", 
        description: "A traditional crispy and sweet deep-fried biscuit from Bihar — the perfect companion for your evening chai. (Pre-order)", 
        price: 249, 
        unit: "200 grams", 
        image: "https://res.cloudinary.com/drg4lzk9s/image/upload/f_auto,q_auto,w_800/v1775893537/bizvistar/flavournestImage/thakua_productimage.jpg", 
        category: 'c2' 
    },
    { 
        id: 5, // Changed from 6 to 5
        name: "Kesar Elaichi Shondesh", 
        description: "A fragrant twist on the classic shondesh, beautifully infused with Kashmiri saffron and green cardamom. (Pre-order)", 
        price: 129, 
        unit: "6 Pieces", 
        image: "https://res.cloudinary.com/drg4lzk9s/image/upload/f_auto,q_auto,w_800/v1775893523/bizvistar/flavournestImage/Kesar_Elaichi_Shondesh_product_image.jpg", 
        category: 'c1' 
    },
    { 
        id: 6, // Changed from 7 to 6
        name: "Chocolate Coconut Burfi", 
        description: "A modern fusion of decadent dark chocolate and classic coconut burfi — tradition meets indulgence. (Pre-order)", 
        price: 312, 
        unit: "12 Pieces", 
        image: "https://res.cloudinary.com/drg4lzk9s/image/upload/f_auto,q_auto,w_800/v1775893521/bizvistar/flavournestImage/Chocolate_Coconut_Burfi.jpg", 
        category: 'c1' 
    }
];

export const businessData = {
    // --- GENERAL BUSINESS INFO ---
    name: "FlavorNest",
    logoText: "FlavorNest",
    logo: "https://res.cloudinary.com/drg4lzk9s/image/upload/f_auto,q_auto,w_400/v1775893530/bizvistar/flavournestImage/flavornest_logo.jpg",
    whatsappNumber: "91123456789", 

    // --- NEW: Master Lists ---
    categories: categories,
    allProducts: allProducts,

    // --- NEW: Page Definitions ---
    pages: [
        { name: 'Home', path: '' },
        { name: 'Shop', path: '/shop' },
        { name: 'Checkout', path: '/checkout' }
    ],

    // --- SECTION ID MAP (FIXED) ---
    // Section IDs for Editor Navigation
    aboutSectionId: "about",
    menuSectionId: "menu", // Links "Homepage Menu" to the "menu" section
    reviewsSectionId: "reviews",
    bestSellersSectionId: "menu", // Links "Products" accordion to the "menu" section
    collectionSectionId: "menu", // <-- ADDED THIS LINE
    footerSectionId: "contact", 
    // --- END OF FIX ---

    // --- THEME SECTION ---
    theme: {
        colorPalette: 'warm-bakery',
        font: {
            heading: 'Lora',
            body: 'Lato'
        }
    },

    // --- NAVIGATION ---
    navigation: [
        { href: "", label: "Home" },
        { href: "/shop", label: "Shop" },
        { href: "#reviews", label: "Reviews" },
        { href: "#about", label: "About" },
    ],

    // --- PAGE SECTIONS ---
    hero: {
        title: "Handcrafted Experiences, Made with Love",
        subtitle: "Experience the authentic touch of homemade specialties, crafted with the freshest ingredients and a generous touch of tradition.",
        cta: "Explore Our Menu"
    },
    about: {
        title: "Where Quality Finds a Home",
        text: "Our brand started from a simple passion for excellence. Every product we create is a piece of our heart — made with the same care and quality we'd want for our own family. Thank you for supporting a small dream and letting us share our best with you."
    },

    // --- THIS IS THE FIX ---
    // This section now correctly lists the IDs from allProducts
    // that you want to feature on the homepage.
    menu: {
        title: "Our Signature Offerings",
        itemIDs: [1, 2, 3,] // These IDs (1-6) pull from allProducts
    },
    // --- End of fix ---

    reviews: {
        title: "What Our Customers Say",
        items: [
            { author: "Muskan B.", text: "The Kesar Mawa Modaks were absolutely divine! So fresh and perfectly sweet. You can truly taste the quality and love in every bite." },
            { author: "Anjali P.", text: "FlavorNest is my go-to for festive sweets now. The packaging is beautiful, making it perfect for gifting during Diwali and Raksha Bandhan." },
            { author: "Rohan D.", text: "Incredible taste and impeccable hygiene. It feels wonderful to support a local, student-run business that pours so much love into their craft." }
        ]
    },
    footer: {
        copyright: `© ${new Date().getFullYear()} FlavorNest. All Rights Reserved.`,
        madeBy: "Swarup",
        madeByLink: "https://www.instagram.com/swarup_81",
        socialLink: "https://www.instagram.com/_flavornest_",
        socialText: "Follow our journey on Instagram"
    }
};