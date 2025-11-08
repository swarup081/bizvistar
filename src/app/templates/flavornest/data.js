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
        description: "Classic steamed modaks filled with a rich, saffron-infused mawa (khoya) and nuts. (Pre-order)", 
        price: 129, 
        unit: "6 Pieces", 
        image: "/flavournestImage/modak_productimage.jpeg", 
        category: 'c1' 
    },
    { 
        id: 2, 
        name: "Shahi Mawa Rolls", 
        description: "A royal treat, these rolls are made from mawa and nuts, delicately flavored and perfect for celebrations. (Pre-order)", 
        price: 149, 
        unit: "4 Pieces", 
        image: "/flavournestImage/shahi_mava_rolls_productimage.jpeg", 
        category: 'c1' 
    },
    { 
        id: 3, // Changed from 4 to 3 for consistency
        name: "Milk Shondesh", 
        description: "A classic Bengali sweet made from fresh chenna (paneer) and sugar, soft and delicious. (Pre-order)", 
        price: 109, 
        unit: "6 Pieces", 
        image: "/flavournestImage/Sandesh_productimage.jpeg", 
        category: 'c1' 
    },
    { 
        id: 4, // Changed from 5 to 4
        name: "Thekua", 
        description: "A traditional crispy and sweet deep-fried biscuit from Bihar, perfect for tea time. (Pre-order)", 
        price: 249, 
        unit: "200 grams", 
        image: "/flavournestImage/thakua_productimage.jpeg", 
        category: 'c2' 
    },
    { 
        id: 5, // Changed from 6 to 5
        name: "Kesar Elaichi Shondesh", 
        description: "A fragrant twist on the classic shondesh, infused with saffron and cardamom. (Pre-order)", 
        price: 129, 
        unit: "6 Pieces", 
        image: "/flavournestImage/Kesar_Elaichi_Shondesh_product_image.jpeg", 
        category: 'c1' 
    },
    { 
        id: 6, // Changed from 7 to 6
        name: "Chocolate Coconut Burfi", 
        description: "A modern fusion of decadent chocolate and classic coconut burfi. (Pre-order)", 
        price: 312, 
        unit: "12 Pieces", 
        image: "/flavournestImage/Chocolate_Coconut_Burfi.jpeg", 
        category: 'c1' 
    }
];

export const businessData = {
    // --- GENERAL BUSINESS INFO ---
    name: "Your Business Name",
    logoText: "FlavorNest",
    logo: "/flavournestImage/flavornest_logo.jpeg",
    whatsappNumber: "91123456789", 

    // --- NEW: Master Lists ---
    categories: categories,
    allProducts: allProducts,

    // --- NEW: Page Definitions ---
    pages: [
        { name: 'Home', path: '/templates/flavornest' },
        { name: 'Shop', path: '/templates/flavornest/shop' },
        { name: 'Checkout', path: '/templates/flavornest/checkout' }
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
        { href: "/templates/flavornest", label: "Home" },
        { href: "/templates/flavornest/shop", label: "Shop" },
        { href: "#reviews", label: "Reviews" },
        { href: "#about", label: "About" },
    ],

    // --- PAGE SECTIONS ---
    hero: {
        title: "Handcrafted Delicacies, Made with Love",
        subtitle: "Experience the authentic taste of homemade sweets and savories, crafted with the freshest ingredients and a touch of tradition.",
        cta: "Explore Our Menu"
    },
    about: {
        title: "Where Taste Finds a Home",
        text: "FlavorNest started from a simple passion for cooking, balanced with the hustle of student life. Every dish we create is a piece of our heart, made with the same care and quality we'd want for our own family. Thank you for supporting a small dream and letting us share our flavors with you."
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
            { author: "Muskan B.", text: "The Kesar Mawa Modaks were absolutely divine! So fresh and perfectly sweet. You can taste the quality in every bite." },
            { author: "Anjali P.", text: "FlavorNest is my go-to for festive sweets now. The packaging is beautiful, making it perfect for gifting." },
            { author: "Rohan D.", text: "Incredible taste and so hygienic. It feels so good to support a local, student-run business that puts so much love into their food." }
        ]
    },
    footer: {
        copyright: `© ${new Date().getFullYear()} Your Business Name. All Rights Reserved`,
        madeBy: "Swarup",
        madeByLink: "https://www.instagram.com/swarup_81",
        socialLink: "https://www.instagram.com/_flavornest_",
        socialText: "Follow our journey on Instagram"
    }
};