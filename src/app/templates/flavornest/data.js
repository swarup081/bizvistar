// This object contains all the dynamic content AND theme for the site.
// For your MVP, you will duplicate this file for each new client and manually change the values.

export const businessData = {
    // --- GENERAL BUSINESS INFO ---
    name: "FlavorNest",
    logo: "/images/flavornest_logo.jpeg",
    whatsappNumber: "917896025128",

    // --- NEW THEME SECTION ---
    // This controls the look and feel.
    // When you build your backend, your user's dashboard will just update these values.
    theme: {
        // CSS Variables are used for maximum flexibility
        '--color-primary': '#6D4C41',      // Main brand color (headings, buttons)
        '--color-secondary': '#F9EBE4',    // Accent/background color
        '--color-text': '#5D4037',         // Body text color
        '--color-background': '#FFF8F2',   // Page background color
        
        '--font-heading': 'var(--font-playfair)', // Font for titles (see layout.js)
        '--font-body': 'var(--font-inter)',       // Font for paragraph text (see layout.js)
    },

    // --- NAVIGATION ---
    navigation: [
        { href: "#home", label: "Home" },
        { href: "#menu", label: "Menu" },
        { href: "#reviews", label: "Reviews" },
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
    menu: {
        title: "Our Signature Offerings",
        items: [
            { id: 1, name: "Kesar Mawa Modak (Pre Order)", description: "Delicate homemade mawa modaks with kesar and premium dry fruits.", price: 129, unit: "6 Pieces", image: "/images/modak_productimage.jpeg" },
            { id: 2, name: "Shahi Mawa Rolls (Pre Order)", description: "Rich rolls stuffed with fresh mawa, fried in ghee and coated in sugar syrup.", price: 149, unit: "4 Pieces", image: "/images/shahi_mava_rolls_productimage.jpeg" },
            { id: 4, name: "Milk Shondesh/ Sandesh (Pre Order)", description: "Soft Milk Shondesh, with a subtle fusion twist, a classic sweet.", price: 109, unit: "6 Pieces", image: "/images/Sandesh_productimage.jpeg" },
            { id: 5, name: "Thekua (Pre Order)", description: "Authentic handmade Thekua made with 100% whole wheat atta.", price: 249, unit: "200 grams", image: "/images/thakua_productimage.jpeg" },
            { id: 6, name: "Kesar Elaichi Shondesh (Pre Order)", description: "Delicately flavored with premium saffron and cardamom.", price: 129, unit: "6 Pieces", image: "/images/Kesar_Elaichi_Shondesh_product_image.jpeg" },
            { id: 7, name: "Chocolate Coconut Burfi (Pre Order)", description: "A rich two-layer fusion of tradition and indulgence.", price: 312, unit: "12 Pieces", image: "/images/Chocolate_Coconut_Burfi.jpeg" }
        ]
    },
    reviews: {
        title: "What Our Customers Say",
        items: [
            { author: "Muskan B.", text: "The Kesar Mawa Modaks were absolutely divine! So fresh and perfectly sweet. You can taste the quality in every bite." },
            { author: "Anjali P.", text: "FlavorNest is my go-to for festive sweets now. The packaging is beautiful, making it perfect for gifting." },
            { author: "Rohan D.", text: "Incredible taste and so hygienic. It feels so good to support a local, student-run business that puts so much love into their food." }
        ]
    },
    footer: {
        copyright: `© ${new Date().getFullYear()} FlavorNest. All Rights Reserved`,
        madeBy: "Swarup",
        madeByLink: "https://www.instagram.com/swarup_81",
        socialLink: "https://www.instagram.com/_flavornest_",
        socialText: "Follow our journey on Instagram"
    }
};