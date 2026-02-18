'use client';

// Define styles here so they are editable
const styleConfig = {
    colors: {
        primary: "#592E4F",       // Deep Plum/Violet
        secondary: "#9E5A85",     // Lighter Orchid/Mauve
        background: "#FFF5F8",    // Very Pale Pink
        surface: "#FFFFFF",       // Pure White
        textLight: "#7D5A6F",     // Muted Violet text
        footerBg: "#592E4F",      // Dark Footer background
        footerText: "#FFDDE6"     // Light Footer Text
    },
    fonts: {
        heading: "DM Serif Display", 
        body: "Quicksand"            
    }
};

const categories = [
    { id: 'cakes', name: 'Custom Cakes' },
    { id: 'pastries', name: 'Baked Pastries' },
    { id: 'cookies', name: 'Homemade Cookies' },
    { id: 'breads', name: 'Artisan Breads' },
];

const allProducts = [
    
    { 
        id: 8, 
        name: "BUTTER CAKE", 
        price: 4.50, 
        category: 'pastries',
        description: "Classic french butter croissant.",
        image: "/frostify/paulina-kaminska-M9xYLiRnH_k-unsplash.jpg" 
    },
    { 
      id: 1, 
      name: "CHOCOLATE CROISSANT", 
      price: 6.50,
      category: 'pastries',
      description: "Buttery, flaky pastry filled with dark Belgian chocolate.",
      image: "/frostify/mae-mu-m9pzwmxm2rk-unsplash.jpg"
    },
    { 
      id: 2, 
      name: "LAVENDER LAYER CAKE", 
      price: 55.00,
      category: 'cakes',
      description: "Three layers of vanilla sponge soaked in lavender syrup with buttercream.",
      image: "/frostify/junior-reis--72q2VOq90Q-unsplash.jpg"
    },
    { 
      id: 3, 
      name: "MACARON BOX", 
      price: 24.00,
      category: 'cookies',
      description: "A selection of 6 assorted French macarons.",
      image: "https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&q=80&w=800"
    },
    { 
      id: 4, 
      name: "ARTISAN SOURDOUGH", 
      price: 12.00,
      category: 'breads',
      description: "Slow-fermented sourdough with a crispy crust.",
      image: "/frostify/kobby-mendez-q54Oxq44MZs-unsplash.jpg"
    },
    { 
        id: 5, 
        name: "BERRY TART", 
        price: 8.50,
        category: 'pastries',
        description: "Fresh berries atop a smooth vanilla custard.",
        image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&q=80&w=400" 
    },
    { 
        id: 6, 
        name: "RED VELVET CAKE", 
        price: 45.00,
        category: 'cakes',
        description: "Classic red velvet with cream cheese frosting.",
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=400" 
    },
    { 
        id: 7, 
        name: "SOURDOUGH LOAF", 
        price: 10.00,
        category: 'breads',
        description: "Freshly baked sourdough loaf.",
        image: "/frostify/katie-rosario-QNyRp21hb5I-unsplash.jpg" 
    }
];

export const businessData = {
    // --- Global Configuration ---
    name: "Sweet Delight",
    logoText: "Sweet Delight",
    logoUrl: "",
    styleConfig: styleConfig,
    categories: categories,
    allProducts: allProducts,
    
    pages: [
      { name: 'Home', path: '' },
      { name: 'Menu', path: '/shop' },
      { name: 'Contact', path: '#contact' }
    ],

    // IDs for Editor Focus
    heroSectionId: "hero",
    aboutSectionId: "about",
    specialtiesSectionId: "specialties",
    gallerySectionId: "gallery",
    faqSectionId: "faq",
    footerSectionId: "footer",
    testimonialsSectionId: "testimonials",

    hero: {
        badge: "Made with Love",
        title: "Homemade Goodness in Every Bite",
        subtitle: "Freshly baked with love, using the finest ingredients.",
        cta: "Explore Treats",
        image1: "https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?auto=format&fit=crop&q=80&w=800",
        image2: "/frostify/sincerely-media-z10eH_RA6ZQ-unsplash.jpg"
    },

    about: {
        title: "Meet Johanna",
        text: "Johanna, the heart behind Sweet Delight, believes the best treats are made with love and the finest ingredients. With years of baking experience, she creates delicious homemade pastries that bring joy to every bite.",
        subtext: "Come visit and taste Johanna's creations—you'll love every bite!",
        image: "/frostify/frostifybaleryface.jpg"
    },

    specialties: {
        title: "Our Specialties",
        items: [
            { title: "Baked Pastries", icon: "croissant" },
            { title: "Custom Cakes", icon: "cake" },
            { title: "Homemade Cookies", icon: "cookie" },
            { title: "Artisan Breads", icon: "bread" }
        ]
    },
    
    gallery: {
        title: "Fresh from the Oven",
        // Store IDs here, mirroring how Aurora/Flara work for consistency in EditorSidebar
        items: [5, 6, 4, 1] 
    },

    faq: {
        title: "Got Questions? We've Got Answers!",
        questions: [
            { q: "CAKE SIZES & PRICING", a: "We offer 6\", 8\", and 10\" cakes starting at $45." },
            { q: "FLAVOURS", a: "Our standard flavors are Vanilla, Chocolate, Red Velvet, and Lemon." },
            { q: "DO YOU MAKE CUSTOM CAKES?", a: "Yes! We specialize in custom designs for weddings and birthdays." },
            { q: "HOW MUCH NOTICE DO YOU NEED?", a: "We require at least 2 weeks notice for custom orders." },
            { q: "DO YOU OFFER GLUTEN-FREE?", a: "Yes, we have a selection of gluten-free cupcakes and cookies." }
        ]
    },

    testimonials: {
        title: "Sweet Words",
        items: [
            {
                text: "The chocolate croissants here are the best I've ever had! Perfectly flaky and rich.",
                author: "Sarah M.",
                image: "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&q=80&w=800"
            },
            {
                text: "Ordered a custom birthday cake and it was stunning. Tasted even better than it looked!",
                author: "James D.",
                image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800"
            },
            {
                text: "My go-to spot for morning coffee and a treat. The atmosphere is just lovely.",
                author: "Emily R.",
                image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800"
            }
        ]
    },

    footer: {
        contactTitle: "Contact us",
        copyright: "© 2026 by Sweet Delight. Built on BizVistar.",
        socials: [ "IG", "FB", "TK" ]
    }
};