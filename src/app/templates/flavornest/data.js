// This object contains all the dynamic content AND theme for the site.
// For your MVP, you will duplicate this file for each new client and manually change the values.

export const businessData = {
    // --- GENERAL BUSINESS INFO ---
    name: "Your Business Name", // This will be replaced by the name from local storage
    logo: "/flavournestImage/flavornest_logo.jpeg",
    whatsappNumber: "91123456789", // Remember to change this for each client

    // --- CORRECTED THEME SECTION ---
   // ...
// In src/app/templates/flavornest/data.js

theme: {
    // Choose any: 'warm-bakery', 'strawberry-cream', 'chocolate-caramel',
    // 'cinnamon-spice', 'earl-grey', 'dark-roast'
    colorPalette: 'earl-grey',

    font: {
        heading: 'Poppins',
        body: 'Lato'
    }
},
// ...
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
            { id: 1, name: "Kesar Mawa Modak (Pre Order)", description: "...", price: 129, unit: "6 Pieces", image: "/flavournestImage/modak_productimage.jpeg" },
            { id: 2, name: "Shahi Mawa Rolls (Pre Order)", description: "...", price: 149, unit: "4 Pieces", image: "/flavournestImage/shahi_mava_rolls_productimage.jpeg" },
            { id: 4, name: "Milk Shondesh/ Sandesh (Pre Order)", description: "...", price: 109, unit: "6 Pieces", image: "/flavournestImage/Sandesh_productimage.jpeg" },
            { id: 5, name: "Thekua (Pre Order)", description: "...", price: 249, unit: "200 grams", image: "/flavournestImage/thakua_productimage.jpeg" },
            { id: 6, name: "Kesar Elaichi Shondesh (Pre Order)", description: "...", price: 129, unit: "6 Pieces", image: "/flavournestImage/Kesar_Elaichi_Shondesh_product_image.jpeg" },
            { id: 7, name: "Chocolate Coconut Burfi (Pre Order)", description: "...", price: 312, unit: "12 Pieces", image: "/flavournestImage/Chocolate_Coconut_Burfi.jpeg" }
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
        // This copyright text will also be dynamically updated by the page component
        copyright: `© ${new Date().getFullYear()} Your Business Name. All Rights Reserved`,
        madeBy: "Swarup",
        madeByLink: "https://www.instagram.com/swarup_81",
        socialLink: "https://www.instagram.com/_flavornest_",
        socialText: "Follow our journey on Instagram"
    }
};
